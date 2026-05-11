import { pool } from "../config/db.js";

export async function createNotification(userId, title, message) {
  if (!userId) return;

  await pool.execute(
    "INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)",
    [userId, title, message]
  );
}

export async function notifyRole(role, department, title, message) {
  const params = [role];
  let query = "SELECT id FROM users WHERE role = ?";

  if (department) {
    query += " AND department = ?";
    params.push(department);
  }

  const [users] = await pool.execute(query, params);
  await Promise.all(users.map((user) => createNotification(user.id, title, message)));
}
