import express from "express";
import {
  registerUser,
  loginUser,
  logout,
  checkAuth,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const adminRoutes = express.Router();

adminRoutes.get("/", (req, res) => {
  res.send("Admin Dashboard");
});
adminRoutes.post("/register", registerUser);
adminRoutes.post("/login", loginUser);
adminRoutes.post("/logout", logout);
adminRoutes.get("/check", authMiddleware, checkAuth);
export default adminRoutes;
