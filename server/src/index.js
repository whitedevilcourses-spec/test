import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import requestRoutes from "./routes/requests.js";
import notificationRoutes from "./routes/notifications.js";
import dashboardRoutes from "./routes/dashboard.js";
import adminRoutes from "./routes/admin.js";
import { verifyDatabaseConnection } from "./config/db.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Student Permission & Leave Management API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ message: "A record with this unique value already exists." });
  }

  return res.status(500).json({ message: "Unexpected server error." });
});

verifyDatabaseConnection()
  .then(() => {
    app.listen(port, () => {
      console.log(`API server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to MySQL database.", error);
    process.exit(1);
  });
