import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from "../utils/accessToken.js";
import Classs from "../models/class.model.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, profile } = req.body;

    // Basic validation
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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with that email",
      });
    }

    // Check class/section for students and teachers
    let targetClass = null;
    if (role === "student" || role === "teacher") {
      if (!profile?.class || !profile?.section) {
        return res.status(400).json({
          success: false,
          message: "Class and section must be provided",
        });
      }

      targetClass = await Classs.findOne({
        grade: profile.class,
        section: profile.section,
      });

      if (!targetClass) {
        return res.status(404).json({
          success: false,
          message: "No class found with the provided grade and section",
        });
      }

      // --- STUDENT RULE ---
      if (role === "student") {
        // Check if student is already assigned to any class
        const studentAssigned = await Classs.findOne({
          students: profile.studentId,
        });

        if (studentAssigned) {
          return res.status(400).json({
            success: false,
            message: "Student is already assigned to a class and section",
          });
        }
      }

      // --- TEACHER RULE ---
      // A teacher can be assigned to multiple subjects/classes
      // No restriction needed here if you allow one teacher to multiple subjects/classes
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      profile,
    });

    const insertUser = await newUser.save();

    // Assign student or teacher to class
    if (role === "student") {
      if (!targetClass.students.includes(insertUser._id)) {
        targetClass.students.push(insertUser._id);
        await targetClass.save();
      }
    } else if (role === "teacher") {
      // Assign teacher to class (optional: you can allow multiple teachers)
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

    // Handle unique index violation (duplicate class)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Duplicate entry detected. Check email, username or class uniqueness.",
      });
    }

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
export const getTeacher = async (req, res) => {
  try {
    const students = await User.find({ role: "teacher" }).select("-password");
    res.status(200).json(students);
  } catch (error) {
    console.error("Error in teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ==============================
// Edit User (student or teacher)
// ==============================
export const editUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, password, profile } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Handle class/section updates
    if (
      (user.role === "student" || user.role === "teacher") &&
      profile?.class &&
      profile?.section
    ) {
      const newClass = await Classs.findOne({
        grade: profile.class,
        section: profile.section,
      });

      if (!newClass) {
        return res
          .status(404)
          .json({ success: false, message: "Target class not found" });
      }

      // Remove from previous class
      const prevClass = await Classs.findOne({
        $or: [{ students: user._id }, { teacher: user._id }],
      });

      if (user.role === "student") {
        if (prevClass) {
          prevClass.students = prevClass.students.filter(
            (id) => id.toString() !== user._id.toString()
          );
          await prevClass.save();
        }

        if (!newClass.students.includes(user._id)) {
          newClass.students.push(user._id);
          await newClass.save();
        }
      } else if (user.role === "teacher") {
        if (prevClass) {
          prevClass.teacher = null;
          await prevClass.save();
        }

        if (
          !newClass.teacher ||
          newClass.teacher.toString() === user._id.toString()
        ) {
          newClass.teacher = user._id;
          await newClass.save();
        } else {
          return res.status(400).json({
            success: false,
            message: "Another teacher already assigned to this class",
          });
        }
      }

      user.profile.class = profile.class;
      user.profile.section = profile.section;
    }

    // Update basic fields
    user.username = username || user.username;
    user.email = email || user.email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Update profile fields
    if (profile) {
      user.profile.firstName = profile.firstName || user.profile.firstName;
      user.profile.lastName = profile.lastName || user.profile.lastName;
      user.profile.phone = profile.phone || user.profile.phone;
      user.profile.address = profile.address || user.profile.address;
      user.profile.dateOfBirth =
        profile.dateOfBirth || user.profile.dateOfBirth;

      user.profile.subjects = profile.subjects || user.profile.subjects;
      user.profile.qualification =
        profile.qualification || user.profile.qualification;
      user.profile.studentId = profile.studentId || user.profile.studentId;
      user.profile.teacherId = profile.teacherId || user.profile.teacherId;
    }

    await user.save();
    // console.log(user);
    res
      .status(200)
      .json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    console.error("Error in editUserProfile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ==============================
// Delete User (student or teacher)
// ==============================
export const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Also remove user from Classs collection
    if (user.role === "student") {
      await Classs.updateMany(
        { students: userId },
        { $pull: { students: userId } }
      );
    } else if (user.role === "teacher") {
      await Classs.updateMany({ teacher: userId }, { $set: { teacher: null } });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUserProfile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
