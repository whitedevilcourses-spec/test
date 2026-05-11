import express from "express";
import { pool } from "../config/db.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const [notifications] = await pool.execute(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
      [req.user.id]
    );

    res.json({ notifications });
  })
);

router.patch(
  "/:id/read",
  authenticate,
  asyncHandler(async (req, res) => {
    await pool.execute("UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?", [
      req.params.id,
      req.user.id
    ]);

    res.json({ message: "Notification marked as read." });
  })
);

export default router;
