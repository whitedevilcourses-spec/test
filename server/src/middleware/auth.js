import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication token is required." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "development-secret");
    const [rows] = await pool.execute(
      "SELECT id, name, email, role, department, phone FROM users WHERE id = ?",
      [payload.id]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = rows[0];
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired authentication token." });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to perform this action." });
    }

    return next();
  };
}
