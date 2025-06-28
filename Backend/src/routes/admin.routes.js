import express from "express";
import {
  registerUser,
  loginUser,
  logout,
  checkAuth,
  getAllStats,
  getStudent,
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
adminRoutes.get("/check", authMiddleware, checkAuth);
adminRoutes.get("/allStats", authMiddleware, checkAdmin, getAllStats);
export default adminRoutes;
