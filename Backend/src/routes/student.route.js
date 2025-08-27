import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  deleteStudentProfile,
  getNotifications,
  markNotificationRead,
  studentDashboard,
  updateStudentProfile,
} from "../controllers/studentController.js";
const studentRoutes = express.Router();

studentRoutes.get("/", authMiddleware, studentDashboard);
studentRoutes.put("/update/:id", authMiddleware, updateStudentProfile);
studentRoutes.delete("/delete/:id", authMiddleware, deleteStudentProfile);
// ✅ Notification routes
studentRoutes.get("/notifications", authMiddleware, getNotifications); // Fetch notifications
studentRoutes.put(
  "/notifications/read/:id",
  authMiddleware,
  markNotificationRead
); // Mark a notification as read

export default studentRoutes;
