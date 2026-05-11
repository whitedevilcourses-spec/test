import express from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import { pool } from "../config/db.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

function nullIfBlank(value) {
  return value === "" || value === undefined ? null : value;
}

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const [users] = await pool.execute(
      `SELECT
        u.id, u.name, u.email, u.role, u.department, u.phone, u.created_at,
        sp.roll_number, sp.course, sp.year, sp.faculty_id, sp.proctor_id
       FROM users u
       LEFT JOIN student_profiles sp ON sp.user_id = u.id
       ORDER BY u.created_at DESC`
    );

    res.json({ users });
  })
);

router.post(
  "/users",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name is required."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").isLength({ min: 6 }).withMessage("Password must have at least 6 characters."),
    body("role").isIn(["student", "faculty", "proctor", "hod", "admin"]).withMessage("Invalid role."),
    body("department").trim().notEmpty().withMessage("Department is required.")
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: "Validation failed.", errors: errors.array() });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password_hash, role, department, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [
        req.body.name,
        req.body.email,
        passwordHash,
        req.body.role,
        req.body.department,
        req.body.phone || null
      ]
    );

    if (req.body.role === "student") {
      await pool.execute(
        `INSERT INTO student_profiles (user_id, roll_number, course, year, faculty_id, proctor_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          result.insertId,
          nullIfBlank(req.body.roll_number),
          nullIfBlank(req.body.course),
          nullIfBlank(req.body.year),
          nullIfBlank(req.body.faculty_id),
          nullIfBlank(req.body.proctor_id)
        ]
      );
    }

    res.status(201).json({ message: "User created successfully.", userId: result.insertId });
  })
);

router.patch(
  "/students/:id/mapping",
  [
    body("roll_number").optional({ values: "falsy" }).trim(),
    body("course").optional({ values: "falsy" }).trim(),
    body("year").optional({ values: "falsy" }).isInt({ min: 1, max: 8 }),
    body("faculty_id").optional({ values: "falsy" }).isInt(),
    body("proctor_id").optional({ values: "falsy" }).isInt()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: "Validation failed.", errors: errors.array() });
    }

    const [students] = await pool.execute("SELECT id FROM users WHERE id = ? AND role = 'student'", [
      req.params.id
    ]);

    if (!students.length) {
      return res.status(404).json({ message: "Student not found." });
    }

    await pool.execute(
      `INSERT INTO student_profiles (user_id, roll_number, course, year, faculty_id, proctor_id)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        roll_number = VALUES(roll_number),
        course = VALUES(course),
        year = VALUES(year),
        faculty_id = VALUES(faculty_id),
        proctor_id = VALUES(proctor_id)`,
      [
        req.params.id,
        nullIfBlank(req.body.roll_number),
        nullIfBlank(req.body.course),
        nullIfBlank(req.body.year),
        nullIfBlank(req.body.faculty_id),
        nullIfBlank(req.body.proctor_id)
      ]
    );

    res.json({ message: "Student mapping updated successfully." });
  })
);

export default router;
