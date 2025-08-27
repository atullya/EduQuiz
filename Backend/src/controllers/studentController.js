import express from "express";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
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
// Fetch all notifications for the logged-in user


export const getNotifications = async (req, res) => {
  try {
    // Fetch all notifications for the logged-in user
    const notifications = await Notification.find({
      recipients: req.user._id,
    })
      .sort({ createdAt: -1 }) // newest first
      .lean(); // convert to plain JS objects for easier processing

    // Total notifications
    const total = notifications.length;

    // Count unread notifications
    const unreadCount = notifications.filter(
      (notif) => !notif.readBy.includes(req.user._id)
    ).length;

    // Optionally, add a number/index to each notification
    const numberedNotifications = notifications.map((notif, index) => ({
      ...notif,
      number: index + 1, // 1, 2, 3...
    }));

    res.json({
      success: true,
      total,
      unreadCount,
      notifications: numberedNotifications,
    });
  } catch (err) {
    console.error("[ERROR IN getNotifications]", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notifications" });
  }
};

// Mark a specific notification as read for the logged-in user
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { $addToSet: { readBy: req.user._id } }, // avoid duplicates
      { new: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    res.json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (err) {
    console.error("[ERROR IN markNotificationRead]", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to mark notification as read" });
  }
};
