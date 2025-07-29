import express from "express";
import {
  registerUser,
  loginUser,
  logout,
  checkAuth,
  getAllStats,
  getStudent,
  getTeacher,
  deleteUserProfile,
  editUserProfile,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkAdmin } from "../middleware/adminMiddleware.js";
const adminRoutes = express.Router();

adminRoutes.get("/", (req, res) => {
  res.send("Admin Dashboard");
});
adminRoutes.post("/register", registerUser);
adminRoutes.post("/login", loginUser);
adminRoutes.post("/logout", logout);
adminRoutes.get("/getStudent", authMiddleware, checkAdmin, getStudent);
adminRoutes.get("/getTeacher", authMiddleware, checkAdmin, getTeacher);
adminRoutes.get("/check", authMiddleware, checkAuth);
adminRoutes.get("/allStats", authMiddleware, checkAdmin, getAllStats);
adminRoutes.put("/editUser/:id", authMiddleware, checkAdmin, editUserProfile);
adminRoutes.delete(
  "/deleteUser/:id",
  authMiddleware,
  checkAdmin,
  deleteUserProfile
);

export default adminRoutes;
