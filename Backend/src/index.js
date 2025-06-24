import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectDB } from "./db/dbConnection.js";
import adminRoutes from "./routes/admin.routes.js";
import studentRoutes from "./routes/student.route.js";
import teacherRoutes from "./routes/teacher.route.js";
import classRoutes from "./routes/class.route.js";
import cookieParser from "cookie-parser";
import assignmentRoutes from "./routes/assignmentRoutes.js";
const app = express();
// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ explicitly specify your frontend origin
    credentials: true, // ✅ allow credentials (cookies)
  })
);
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;
app.use("/api/auth", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/assignment", assignmentRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
