import express from "express";
import User from "../models/user.model.js";

export const teacherDashboard = (req, res) => {
  res.json({ message: "Welcome to the Teacher Dashboard", user: req.user });
};

export const updateTeacherProfile = async (req, res) => {
  try {
    const { id } = req.params;
    // Logic to update teacher profile based on the provided ID
    const teacher = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(teacher);
  } catch (error) {
    console.error("Error in updateTeacherProfile:", error);
    res.status(500).json({ message: "Internal server error" });
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
