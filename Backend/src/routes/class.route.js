import express from "express";
import Classs from "../models/class.model.js";
import User from "../models/user.model.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import moment from "moment";
const classRoutes = express.Router();

// GET all classes + total count
classRoutes.get("/", authMiddleware, async (req, res) => {
  try {
    const classes = await Classs.find()
      .populate("teacher", "username email profile.firstName profile.lastName")
      .populate(
        "students",
        "username email profile.firstName profile.lastName"
      );

    const totalCount = await Classs.countDocuments();

    res.json({
      totalCount,
      classes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE class (admin only)
// Assuming you're using moment for time parsing
//only class
classRoutes.post("/onlyclass", authMiddleware, async (req, res) => {
  try {
    const { name, section, grade, subjects, schedule } = req.body;

    // 1. Check if a class with the same name + subjects + schedule exists
    const existingClass = await Classs.findOne({
      name,
      section,
      grade,
      subjects: { $all: subjects, $size: subjects.length }, // exact match
      schedule: { $all: schedule, $size: schedule.length }, // exact match
    });

    if (existingClass) {
      return res.status(400).json({
        success: false,
        message:
          "A class with the same name, subjects, and schedule already exists.",
      });
    }

    // 2. Create and save the class
    const newClass = new Classs(req.body);
    const savedClass = await newClass.save();

    // 3. Return success response
    return res.status(201).json({ success: true, data: savedClass });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create class. Please try again.",
    });
  }
});

classRoutes.post("/create", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can create classes" });
  }

  try {
    const {
      name,
      section,
      grade,
      capacity,
      maxStudents,
      roomNo,
      time, // e.g. "09:00-10:00"
      schedule, // e.g. ["Monday", "Wednesday"]
      status,
      teacher,
      students,
      subjects,
    } = req.body;

    // Validate teacher
    const teacherUser = await User.findOne({ _id: teacher, role: "teacher" });
    if (!teacherUser) {
      return res
        .status(400)
        .json({ message: "Invalid teacher ID (must be a teacher)" });
    }

    // Validate students
    const validStudents = await User.find({
      _id: { $in: students || [] },
      role: "student",
    });
    if ((students || []).length !== validStudents.length) {
      return res
        .status(400)
        .json({ message: "One or more student IDs are invalid" });
    }

    // ✅ Check for teacher time conflict
    if (time && schedule) {
      const [newStart, newEnd] = time.split("-").map((t) => moment(t, "HH:mm"));

      const teacherClasses = await Classs.find({ teacher });
      const conflict = teacherClasses.some((cls) => {
        if (!cls.time || !cls.schedule) return false;

        // Check if any day overlaps
        const daysOverlap = cls.schedule.some((day) => schedule.includes(day));
        if (!daysOverlap) return false;

        const [existingStart, existingEnd] = cls.time
          .split("-")
          .map((t) => moment(t, "HH:mm"));

        // Check for time overlap
        return newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);
      });

      if (conflict) {
        return res.status(400).json({
          message:
            "Time conflict: Teacher is already assigned to a class at this time",
        });
      }
    }

    // Create class
    const classData = new Classs({
      name,
      section,
      grade,
      capacity,
      maxStudents,
      roomNo,
      time,
      schedule,
      status,
      teacher,
      students,
      subjects,
    });

    await classData.save();
    res.status(201).json(classData);
  } catch (err) {
    console.error("Class creation error:", err);
    res.status(400).json({ message: err.message });
  }
});

// UPDATE class (admin only)
classRoutes.put("/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can update classes" });
  }

  try {
    const {
      teacher,
      students,
      removeStudents,
      removeSubjects,
      assignNewTeacher,
      ...otherFields
    } = req.body;

    const classData = await Classs.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (assignNewTeacher) {
      const newTeacher = await User.findOne({
        _id: assignNewTeacher,
        role: "teacher",
      });
      if (!newTeacher) {
        return res.status(400).json({ message: "Invalid new teacher ID" });
      }
      classData.teacher = assignNewTeacher;
    }

    if (teacher) {
      const teacherUser = await User.findOne({ _id: teacher, role: "teacher" });
      if (!teacherUser) {
        return res
          .status(400)
          .json({ message: "Invalid teacher ID (must be a teacher)" });
      }
      classData.teacher = teacher;
    }

    if (students) {
      const validStudents = await User.find({
        _id: { $in: students },
        role: "student",
      });
      if (students.length !== validStudents.length) {
        return res
          .status(400)
          .json({ message: "One or more student IDs are invalid" });
      }

      const existingIds = classData.students.map((id) => id.toString());
      const newIds = students.filter((id) => !existingIds.includes(id));
      classData.students.push(...newIds);
    }

    if (removeStudents) {
      classData.students = classData.students.filter(
        (id) => !removeStudents.includes(id.toString())
      );
    }

    if (removeSubjects) {
      classData.subjects = classData.subjects.filter(
        (subject) => !removeSubjects.includes(subject)
      );
    }

    Object.keys(otherFields).forEach((field) => {
      classData[field] = otherFields[field];
    });

    await classData.save();

    const populatedClass = await Classs.findById(classData._id)
      .populate("teacher", "username email profile.firstName profile.lastName")
      .populate(
        "students",
        "username email profile.firstName profile.lastName"
      );

    res.json(populatedClass);
  } catch (err) {
    console.error("Update class error:", err);
    res.status(400).json({ message: err.message });
  }
});
// PUT /api/classes/:id/edit
classRoutes.put("/:id/edit", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can edit classes" });
  }

  try {
    const {
      name,
      section,
      grade,
      capacity,
      maxStudents,
      roomNo,
      time,
      schedule,
      status,
      teacher,
      students,
      subjects,
    } = req.body;

    // Validate teacher (if provided)
    if (teacher) {
      const teacherUser = await User.findOne({ _id: teacher, role: "teacher" });
      if (!teacherUser) {
        return res
          .status(400)
          .json({ message: "Invalid teacher ID (must be a teacher)" });
      }
    }

    // Validate students (if provided)
    if (students && students.length > 0) {
      const validStudents = await User.find({
        _id: { $in: students },
        role: "student",
      });
      if (students.length !== validStudents.length) {
        return res
          .status(400)
          .json({ message: "One or more student IDs are invalid" });
      }
    }

    // Optional: check for time conflict for teacher (same logic as before)
    if (teacher && time && schedule) {
      const [newStart, newEnd] = time.split("-").map((t) => moment(t, "HH:mm"));

      const teacherClasses = await Classs.find({
        teacher,
        _id: { $ne: req.params.id }, // exclude current class
      });

      const conflict = teacherClasses.some((cls) => {
        if (!cls.time || !cls.schedule) return false;

        const daysOverlap = cls.schedule.some((day) => schedule.includes(day));
        if (!daysOverlap) return false;

        const [existingStart, existingEnd] = cls.time
          .split("-")
          .map((t) => moment(t, "HH:mm"));

        return newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart);
      });

      if (conflict) {
        return res.status(400).json({
          message:
            "Time conflict: Teacher is already assigned to a class at this time",
        });
      }
    }

    // Update class
    const updatedClass = await Classs.findByIdAndUpdate(
      req.params.id,
      {
        name,
        section,
        grade,
        capacity,
        maxStudents,
        roomNo,
        time,
        schedule,
        status,
        teacher,
        students,
        subjects,
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedClass });
  } catch (err) {
    console.error("Class update error:", err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE class (admin only)
classRoutes.delete("/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can delete classes" });
  }

  try {
    await Classs.findByIdAndDelete(req.params.id);
    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Teacher stats route
classRoutes.get(
  "/teacher-stats/:teacherId",
  authMiddleware,
  async (req, res) => {
    const { teacherId } = req.params;

    if (
      req.user.role !== "admin" &&
      !(req.user.role === "teacher" && req.user._id.toString() === teacherId)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    try {
      const classes = await Classs.find({ teacher: teacherId }).populate(
        "students",
        "_id username email"
      );

      const totalClasses = classes.length;
      const allStudentIds = classes.flatMap((cls) =>
        cls.students.map((s) => s._id.toString())
      );
      const uniqueStudentIds = [...new Set(allStudentIds)];

      const classStudentCounts = classes.map((cls) => ({
        classId: cls._id,
        className: cls.name,
        section: cls.section,
        grade: cls.grade,
        roomNo: cls.roomNo,
        subject: cls.subjects,
        time: cls.time,
        schedule: cls.schedule,
        studentCount: cls.students.length,
      }));

      res.json({
        totalClasses,
        totalUniqueStudents: uniqueStudentIds.length,
        classStudentCounts,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default classRoutes;
