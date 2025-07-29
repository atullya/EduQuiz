import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

import {
  deleteTeacherProfile,
  teacherDashboard,
  updateTeacherProfile,
} from "../controllers/teacherController.js";
const teacherRoutes = express.Router();

teacherRoutes.get("/", authMiddleware, teacherDashboard);
teacherRoutes.put("/update/:id", authMiddleware, updateTeacherProfile);
teacherRoutes.delete("/delete/:id", authMiddleware, deleteTeacherProfile);
// teacherRoutes.post("/")

export default teacherRoutes;
