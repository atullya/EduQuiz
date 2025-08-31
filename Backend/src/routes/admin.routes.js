import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
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
import User from "../models/user.model.js";
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

adminRoutes.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Generate token
    const token = crypto.randomBytes(20).toString("hex");
    admin.resetPasswordToken = token;
    admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await admin.save();

    // Return token in response (for testing / simple logic)
    res.json({ message: "Reset token generated", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});
adminRoutes.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const admin = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
      role: "admin",
    });

    if (!admin)
      return res.status(400).json({ message: "Invalid or expired token" });

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;

    // Clear token
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;

    await admin.save();
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default adminRoutes;
