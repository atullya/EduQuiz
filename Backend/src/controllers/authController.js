import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from "../utils/accessToken.js";
import Classs from "../models/class.model.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, profile } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const checkExistingUser = await User.findOne({ email });
    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with that email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const registerUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      profile,
    });

    const insertUser = await registerUser.save();

    // ✅ Handle student class assignment
    if (insertUser.role === "student" && profile?.class && profile?.section) {
      const targetClass = await Classs.findOne({
        grade: profile.class,
        section: profile.section,
      });

      if (!targetClass) {
        return res.status(404).json({
          success: false,
          message: "No class found matching the student's grade and section",
        });
      }

      if (!targetClass.students.includes(insertUser._id)) {
        targetClass.students.push(insertUser._id);
        await targetClass.save();
      }
    }

    // ✅ Handle teacher assignment (only one class allowed)
    if (insertUser.role === "teacher" && profile?.class && profile?.section) {
      const alreadyAssigned = await Classs.findOne({
        teacher: insertUser._id,
      });

      if (alreadyAssigned) {
        return res.status(400).json({
          success: false,
          message: "This teacher is already assigned to another class",
        });
      }

      const targetClass = await Classs.findOne({
        grade: profile.class,
        section: profile.section,
      });

      if (!targetClass) {
        return res.status(404).json({
          success: false,
          message: "No class found for the teacher's grade and section",
        });
      }

      targetClass.teacher = insertUser._id;
      await targetClass.save();
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: insertUser,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    } // Check if the user exists
    const userValid = await User.findOne({ email });
    if (!userValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const validPassword = await bcrypt.compare(password, userValid.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const token = generateToken(userValid._id, res);
    res.status(200).json({
      _id: userValid._id,
      username: userValid.username,
      email: userValid.email,
      role: userValid.role,
      success: true,
      message: "Login successful",
      accessToken: token,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in Logout Controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in signup", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getStudent = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.status(200).json(students);
  } catch (error) {
    console.error("Error in getStudent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//main admin

export const getAllStats = async (req, res) => {
  try {
    // Count teachers
    const totalTeachers = await User.countDocuments({ role: "teacher" });

    // Count students
    const totalStudents = await User.countDocuments({ role: "student" });

    // Count classes
    const totalClasses = await Classs.countDocuments();

    res.json({
      totalTeachers,
      totalStudents,
      totalClasses,
    });
  } catch (error) {
    console.error("Error in getAllStats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
