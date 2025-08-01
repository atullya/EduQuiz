import express from "express";
import User from "../models/user.model.js";

export const teacherDashboard = (req, res) => {
  res.json({ message: "Welcome to the Teacher Dashboard", user: req.user });
};

export const updateTeacherProfile = async (req, res) => {
  try {
    const teacherId = req.user?.id; // Or use req.params.id if it's in the URL

    if (!teacherId) {
      return res.status(400).json({ error: "Teacher ID not provided." });
    }

    const updatedTeacher = await User.findByIdAndUpdate(
      teacherId,
      {
        $set: {
          email: req.body.email,
          profile: {
            firstName: req.body.profile.firstName,
            lastName: req.body.profile.lastName,
            phone: req.body.profile.phone,
          },
        },
      },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.status(200).json({ message: "Profile updated", updatedTeacher });
  } catch (error) {
    console.error("Error in updateTeacherProfile:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteTeacherProfile = async (req, res) => {
  try {
    const { id } = req.params;
    // Logic to delete student profile based on the provided ID
    const teacher = await User.findByIdAndDelete(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json({ message: "Teacher profile deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTeacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
