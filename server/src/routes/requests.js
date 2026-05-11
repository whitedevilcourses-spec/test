import express from "express";
import { body, validationResult } from "express-validator";
import { pool } from "../config/db.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification, notifyRole } from "../utils/notifications.js";

const router = express.Router();

const requestSelect = `
  SELECT
    r.*,
    student.name AS student_name,
    student.email AS student_email,
    student.department AS student_department,
    sp.roll_number,
    sp.course,
    sp.year,
    sp.faculty_id,
    sp.proctor_id,
    faculty.name AS faculty_name,
    proctor.name AS proctor_name
  FROM requests r
  JOIN users student ON student.id = r.student_id
  LEFT JOIN student_profiles sp ON sp.user_id = student.id
  LEFT JOIN users faculty ON faculty.id = sp.faculty_id
  LEFT JOIN users proctor ON proctor.id = sp.proctor_id
`;

function scopedWhere(user) {
  if (user.role === "student") {
    return { clause: "WHERE r.student_id = ?", params: [user.id] };
  }

  if (user.role === "faculty") {
    return { clause: "WHERE sp.faculty_id = ?", params: [user.id] };
  }

  if (user.role === "proctor") {
    return { clause: "WHERE sp.proctor_id = ?", params: [user.id] };
  }

  if (user.role === "hod") {
    return { clause: "WHERE student.department = ?", params: [user.department] };
  }

  return { clause: "", params: [] };
}

function nextStage(request, approverRole) {
  if (approverRole === "admin") {
    return { status: "approved", currentApproverRole: null, notifyUserId: null };
  }

  if (approverRole === "faculty") {
    if (request.proctor_id) {
      return { status: "pending_proctor", currentApproverRole: "proctor", notifyUserId: request.proctor_id };
    }

    return { status: "pending_hod", currentApproverRole: "hod", notifyUserId: null };
  }

  if (approverRole === "proctor") {
    return { status: "pending_hod", currentApproverRole: "hod", notifyUserId: null };
  }

  return { status: "approved", currentApproverRole: null, notifyUserId: null };
}

function ensureCanDecide(user, request) {
  if (user.role === "admin") return true;

  if (request.current_approver_role !== user.role) return false;

  if (user.role === "faculty") return Number(request.faculty_id) === Number(user.id);
  if (user.role === "proctor") return Number(request.proctor_id) === Number(user.id);
  if (user.role === "hod") return request.student_department === user.department;

  return false;
}

async function notifyNextApprover(stage, request, title, message) {
  if (stage.notifyUserId) {
    await createNotification(stage.notifyUserId, title, message);
    return;
  }

  if (stage.currentApproverRole === "hod") {
    await notifyRole("hod", request.student_department, title, message);
  }
}

router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const scope = scopedWhere(req.user);
    const filters = [];
    const params = [...scope.params];

    if (req.query.status) {
      filters.push("r.status = ?");
      params.push(req.query.status);
    }

    if (req.query.request_type) {
      filters.push("r.request_type = ?");
      params.push(req.query.request_type);
    }

    const whereParts = [scope.clause.replace(/^WHERE /, ""), ...filters].filter(Boolean);
    const whereClause = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";

    const [requests] = await pool.execute(
      `${requestSelect} ${whereClause} ORDER BY r.created_at DESC`,
      params
    );

    res.json({ requests });
  })
);

router.get(
  "/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    const scope = scopedWhere(req.user);
    const [rows] = await pool.execute(
      `${requestSelect} ${scope.clause ? `${scope.clause} AND` : "WHERE"} r.id = ?`,
      [...scope.params, req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Request not found." });
    }

    const [history] = await pool.execute(
      `SELECT a.*, u.name AS approver_name
       FROM approvals a
       JOIN users u ON u.id = a.approver_id
       WHERE a.request_id = ?
       ORDER BY a.created_at ASC`,
      [req.params.id]
    );

    return res.json({ request: rows[0], history });
  })
);

router.post(
  "/",
  authenticate,
  authorize("student"),
  [
    body("request_type").isIn(["leave", "permission"]).withMessage("Request type must be leave or permission."),
    body("subject").trim().isLength({ min: 3 }).withMessage("Subject must be at least 3 characters."),
    body("reason").trim().isLength({ min: 10 }).withMessage("Reason must be at least 10 characters."),
    body("start_date").isISO8601().withMessage("Start date is required."),
    body("end_date").isISO8601().withMessage("End date is required.")
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: "Validation failed.", errors: errors.array() });
    }

    const [profiles] = await pool.execute(
      `SELECT sp.*, u.department AS student_department
       FROM student_profiles sp
       JOIN users u ON u.id = sp.user_id
       WHERE sp.user_id = ?`,
      [req.user.id]
    );

    const profile = profiles[0];
    if (!profile) {
      return res.status(400).json({ message: "Student profile and faculty/proctor mapping are required." });
    }

    let status = "pending_hod";
    let currentApproverRole = "hod";
    let firstApproverId = null;

    if (profile.faculty_id) {
      status = "pending_faculty";
      currentApproverRole = "faculty";
      firstApproverId = profile.faculty_id;
    } else if (profile.proctor_id) {
      status = "pending_proctor";
      currentApproverRole = "proctor";
      firstApproverId = profile.proctor_id;
    }

    const [result] = await pool.execute(
      `INSERT INTO requests
        (student_id, request_type, subject, reason, start_date, end_date, from_time, to_time, status, current_approver_role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        req.body.request_type,
        req.body.subject,
        req.body.reason,
        req.body.start_date,
        req.body.end_date,
        req.body.from_time || null,
        req.body.to_time || null,
        status,
        currentApproverRole
      ]
    );

    const title = "New request awaiting approval";
    const message = `${req.user.name} submitted a ${req.body.request_type} request: ${req.body.subject}`;

    if (firstApproverId) {
      await createNotification(firstApproverId, title, message);
    } else {
      await notifyRole("hod", profile.student_department, title, message);
    }

    await createNotification(req.user.id, "Request submitted", "Your request was submitted successfully.");

    res.status(201).json({ message: "Request submitted successfully.", requestId: result.insertId });
  })
);

router.patch(
  "/:id/decision",
  authenticate,
  authorize("faculty", "proctor", "hod", "admin"),
  [
    body("action").isIn(["approve", "reject"]).withMessage("Action must be approve or reject."),
    body("comments").optional({ nullable: true }).trim().isLength({ max: 1000 })
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: "Validation failed.", errors: errors.array() });
    }

    const [rows] = await pool.execute(`${requestSelect} WHERE r.id = ?`, [req.params.id]);
    const request = rows[0];

    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    if (!request.status.startsWith("pending_")) {
      return res.status(409).json({ message: "Only pending requests can be decided." });
    }

    if (!ensureCanDecide(req.user, request)) {
      return res.status(403).json({ message: "This request is not assigned to you for approval." });
    }

    const isApproval = req.body.action === "approve";
    const stage = isApproval
      ? nextStage(request, req.user.role)
      : { status: "rejected", currentApproverRole: null, notifyUserId: null };

    await pool.execute(
      "UPDATE requests SET status = ?, current_approver_role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [stage.status, stage.currentApproverRole, req.params.id]
    );

    await pool.execute(
      "INSERT INTO approvals (request_id, approver_id, approver_role, action, comments) VALUES (?, ?, ?, ?, ?)",
      [req.params.id, req.user.id, req.user.role, req.body.action, req.body.comments || null]
    );

    const studentMessage = isApproval
      ? `Your ${request.request_type} request moved to ${stage.status.replaceAll("_", " ")}.`
      : `Your ${request.request_type} request was rejected by ${req.user.name}.`;

    await createNotification(request.student_id, "Request status updated", studentMessage);

    if (isApproval && stage.status !== "approved") {
      await notifyNextApprover(
        stage,
        request,
        "Request awaiting your approval",
        `${request.student_name}'s ${request.request_type} request requires your review.`
      );
    }

    res.json({ message: `Request ${req.body.action}d successfully.`, status: stage.status });
  })
);

export default router;
