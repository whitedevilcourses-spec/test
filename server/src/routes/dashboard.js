import express from "express";
import { pool } from "../config/db.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

function dashboardScope(user) {
  if (user.role === "student") {
    return { where: "WHERE r.student_id = ?", params: [user.id] };
  }

  if (user.role === "faculty") {
    return { where: "WHERE sp.faculty_id = ?", params: [user.id] };
  }

  if (user.role === "proctor") {
    return { where: "WHERE sp.proctor_id = ?", params: [user.id] };
  }

  if (user.role === "hod") {
    return { where: "WHERE student.department = ?", params: [user.department] };
  }

  return { where: "", params: [] };
}

router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const scope = dashboardScope(req.user);
    const join = `
      FROM requests r
      JOIN users student ON student.id = r.student_id
      LEFT JOIN student_profiles sp ON sp.user_id = student.id
    `;

    const [statusCounts] = await pool.execute(
      `SELECT r.status, COUNT(*) AS total ${join} ${scope.where} GROUP BY r.status`,
      scope.params
    );

    const [typeCounts] = await pool.execute(
      `SELECT r.request_type, COUNT(*) AS total ${join} ${scope.where} GROUP BY r.request_type`,
      scope.params
    );

    const [pendingApprovals] = await pool.execute(
      `SELECT COUNT(*) AS total ${join}
       ${scope.where ? `${scope.where} AND` : "WHERE"} r.current_approver_role = ?`,
      [...scope.params, req.user.role]
    );

    const [notifications] = await pool.execute(
      "SELECT COUNT(*) AS total FROM notifications WHERE user_id = ? AND is_read = FALSE",
      [req.user.id]
    );

    const [recentRequests] = await pool.execute(
      `SELECT r.id, r.request_type, r.subject, r.status, r.created_at, student.name AS student_name
       ${join}
       ${scope.where}
       ORDER BY r.created_at DESC
       LIMIT 5`,
      scope.params
    );

    res.json({
      statusCounts,
      typeCounts,
      pendingApprovals: pendingApprovals[0]?.total || 0,
      unreadNotifications: notifications[0]?.total || 0,
      recentRequests
    });
  })
);

export default router;
