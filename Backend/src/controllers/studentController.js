import express from "express";
import User from "../models/user.model.js";

export const studentDashboard = (req, res) => {
  res.json({ message: "Welcome to the Student Dashboard", user: req.user });
};

export const updateStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;
    // Logic to update student profile based on the provided ID
    const student = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(student);
  } catch (error) {
    console.error("Error in updateStudentProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;
    // Logic to delete student profile based on the provided ID
    const student = await User.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student profile deleted successfully" });
  } catch (error) {
    console.error("Error in deleteStudentProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
