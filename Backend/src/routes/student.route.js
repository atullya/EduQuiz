import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
    deleteStudentProfile,
  studentDashboard,
  updateStudentProfile,
} from "../controllers/studentController.js";
const studentRoutes = express.Router();

studentRoutes.get("/", authMiddleware, studentDashboard);
studentRoutes.put("/update/:id", authMiddleware, updateStudentProfile);
studentRoutes.delete("/delete/:id", authMiddleware, deleteStudentProfile);

export default studentRoutes;
