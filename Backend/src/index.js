import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Import DB connection
import { connectDB } from "./db/dbConnection.js";

// Import routes
import adminRoutes from "./routes/admin.routes.js";
import studentRoutes from "./routes/student.route.js";
import teacherRoutes from "./routes/teacher.route.js";
import classRoutes from "./routes/class.route.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import mcqRoutes from "./routes/mcqRoutes.js";
import studentMCQRoutes from "./routes/studentQuiz.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.1.5:5173", // Optional: add your local IP
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// ===== Ensure uploads directory exists =====
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads folder at:", uploadsDir);
}

// ===== Serve static files (uploads) =====
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ===== API Routes =====
app.use("/api/auth", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/mcq", mcqRoutes);
app.use("/api/smcq", studentMCQRoutes);

// ===== Default route =====
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ===== Start server =====
app.listen(PORT, "0.0.0.0", () => {
  connectDB()
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection failed:", err));

  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});
