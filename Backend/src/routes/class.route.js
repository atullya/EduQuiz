import express from "express";
import Classs from "../models/class.model.js";
import User from "../models/user.model.js";
import Assignment from "../models/assignmnet.model.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import moment from "moment";
import MCQ from "../models/MCQ.js";
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

// GET all available classes
classRoutes.get("/classes/admin", async (req, res) => {
  try {
    const classes = await Classs.find()
      .populate("teacher", "name email") // populate teacher with name and email
      .populate("students", "name email"); // populate students with name and email

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching classes",
      error: error.message,
    });
  }
});

// CREATE class (admin only)
// Assuming you're using moment for time parsing
//only class
classRoutes.post("/onlyclass", authMiddleware, async (req, res) => {
  try {
    const { name, section, grade, subjects, schedule } = req.body;

    // Ensure only one subject is provided
    if (!Array.isArray(subjects) || subjects.length !== 1) {
      return res.status(400).json({
        success: false,
        message: "Only one subject must be selected.",
      });
    }

    // 1. Check if a class with the same name + grade + section already exists
    const existingClass = await Classs.findOne({
      name,
      grade,
      section,
    });

    if (existingClass) {
      return res.status(400).json({
        success: false,
        message: `A class with grade: ${grade}, section: ${section}, and name: "${name}" already exists.`,
      });
    }

    // 2. Create and save the class
    const newClass = new Classs(req.body);
    const savedClass = await newClass.save();

    // 3. Return success response
    return res.status(201).json({ success: true, data: savedClass });
  } catch (error) {
    console.error("Error creating class:", error);

    // Handle Mongo duplicate key error (if schema index is set)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Duplicate class detected: grade: ${error.keyValue.grade}, section: ${error.keyValue.section}, name: ${error.keyValue.name}`,
      });
    }

    return res.status(500).json({
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

    // Assign teacher if needed
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

    // Add students with validation
    if (students) {
      // 1. Validate all student IDs
      const validStudents = await User.find({
        _id: { $in: students },
        role: "student",
      });

      if (students.length !== validStudents.length) {
        return res
          .status(400)
          .json({ message: "One or more student IDs are invalid" });
      }

      // 2. Check if any student is already assigned to another class with same grade + section
      for (const studentId of students) {
        const alreadyAssigned = await Classs.findOne({
          _id: { $ne: classData._id }, // exclude current class
          grade: classData.grade,
          section: classData.section,
          students: studentId,
        });

        if (alreadyAssigned) {
          const studentInfo = await User.findById(studentId);
          return res.status(400).json({
            message: `Student ${studentInfo.profile.firstName} ${studentInfo.profile.lastName} is already assigned to another class in grade ${classData.grade} section ${classData.section}`,
          });
        }
      }

      // 3. Add new students
      const existingIds = classData.students.map((id) => id.toString());
      const newIds = students.filter((id) => !existingIds.includes(id));
      classData.students.push(...newIds);
    }

    // Remove students if needed
    if (removeStudents) {
      classData.students = classData.students.filter(
        (id) => !removeStudents.includes(id.toString())
      );
    }

    // Remove subjects if needed
    if (removeSubjects) {
      classData.subjects = classData.subjects.filter(
        (subject) => !removeSubjects.includes(subject)
      );
    }

    // Update other fields
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
    res.json({ success: true, message: "Class deleted successfully" });
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
// Get all studnts in a class
classRoutes.get(
  "/class-students/:classId",
  authMiddleware,
  async (req, res) => {
    const { classId } = req.params;

    try {
      const cls = await Classs.findById(classId).populate(
        "students",
        "username"
      );

      if (!cls) {
        return res.status(404).json({ message: "Class not found" });
      }

      // Authorization: Only the assigned teacher or an admin can view
      if (
        req.user.role !== "admin" &&
        !(
          req.user.role === "teacher" &&
          req.user._id.toString() === cls.teacher.toString()
        )
      ) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const studentNames = cls.students.map((student) => student.username);

      res.json({ className: cls.name, studentNames });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//student stats route
classRoutes.get(
  "/student-stats/:studentId",
  authMiddleware,
  async (req, res) => {
    const { studentId } = req.params;

    // Authorization
    if (
      req.user.role !== "admin" &&
      !(req.user.role === "student" && req.user._id.toString() === studentId)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    try {
      // ✅ Get all classes student is enrolled in
      const classes = await Classs.find({ students: studentId })
        .populate("teacher", "profile.firstName profile.lastName email")
        .populate("students", "_id username email");

      const totalClasses = classes.length;

      // ✅ Get all assignments for these classes
      const classIds = classes.map((cls) => cls._id);

      const allAssignments = await Assignment.find({
        class: { $in: classIds },
      });

      const totalAssignments = allAssignments.length;

      // ✅ Get all quizzes for these classes (assuming MCQ model has classId)
      const allQuizzes = await MCQ.find({
        classId: { $in: classIds },
      });

      const totalQuizzes = allQuizzes.length;

      // ✅ Breakdown per class
      const classInfo = await Promise.all(
        classes.map(async (cls) => {
          const assignmentCount = await Assignment.countDocuments({
            class: cls._id,
          });

          const quizCount = await MCQ.countDocuments({
            classId: cls._id,
          });

          return {
            classId: cls._id,
            className: cls.name,
            section: cls.section,
            grade: cls.grade,
            roomNo: cls.roomNo,
            subject: cls.subjects,
            schedule: cls.schedule,
            time: cls.time,
            teacher: {
              id: cls.teacher?._id || null,
              name: `${cls.teacher?.profile?.firstName || ""} ${
                cls.teacher?.profile?.lastName || ""
              }`.trim(),
              email: cls.teacher?.email || "N/A",
            },
            studentCount: cls.students.length,
            assignmentCount,
            quizCount,
          };
        })
      );

      res.json({
        success: true,
        totalClasses,
        totalAssignments,
        totalQuizzes,
        enrolledClasses: classInfo,
      });
    } catch (err) {
      console.error("[ERROR: /student-stats]", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
classRoutes.get(
  "/student-stats/:studentId",
  authMiddleware,
  async (req, res) => {
    const { studentId } = req.params;

    // Authorization check: Only admin or the student themselves can access
    if (
      req.user.role !== "admin" &&
      !(req.user.role === "student" && req.user._id.toString() === studentId)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    try {
      const classes = await Classs.find({ students: studentId })
        .populate(
          "teacher",
          "_id profile.firstName profile.lastName email role"
        )

        .populate("students", "_id username email"); // Optional: to show all classmates

      const totalClasses = classes.length;

      const classInfo = classes.map((cls) => ({
        classId: cls._id,
        className: cls.name,
        section: cls.section,
        grade: cls.grade,
        roomNo: cls.roomNo,
        subject: cls.subjects,
        schedule: cls.schedule,
        time: cls.time,
        totalStudents: cls.students.length,
        teacher: {
          id: cls.teacher?._id || null,
          name: cls.teacher
            ? `${cls.teacher.profile.firstName} ${cls.teacher.profile.lastName}`
            : "Unknown",

          email: cls.teacher?.email || "N/A",
        },
      }));

      res.json({
        success: true,
        totalClasses,
        enrolledClasses: classInfo,
      });
    } catch (err) {
      console.error("[ERROR: /student-stats]", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
classRoutes.get(
  "/student/classes-with-quizzes/:studentId",
  authMiddleware,
  async (req, res) => {
    const { studentId } = req.params;

    // Authorization check
    if (
      req.user.role !== "admin" &&
      !(req.user.role === "student" && req.user._id.toString() === studentId)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    try {
      // Find all classes the student is enrolled in
      const classes = await Classs.find({ students: studentId })
        .populate(
          "teacher",
          "username email profile.firstName profile.lastName"
        )
        .populate("students", "_id username email");

      // For each class, check if MCQs exist
      const classesWithQuizInfo = await Promise.all(
        classes.map(async (cls) => {
          // Find if published MCQs exist for this class, section, subject
          const quizCount = await MCQ.countDocuments({
            class: cls._id,
            section: cls.section,
            subject: cls.subjects, // adjust if 'subjects' is an array, pick appropriate
            status: "published",
          });

          return {
            classId: cls._id,
            className: cls.name,
            section: cls.section,
            grade: cls.grade,
            roomNo: cls.roomNo,
            subject: cls.subjects,
            schedule: cls.schedule,
            time: cls.time,
            totalStudents: cls.students.length,
            teacher: {
              id: cls.teacher?._id || null,
              name: cls.teacher
                ? `${cls.teacher.profile.firstName} ${cls.teacher.profile.lastName}`
                : "Unknown",
              email: cls.teacher?.email || "N/A",
            },
            hasQuizzes: quizCount > 0,
            quizzesCount: quizCount,
          };
        })
      );

      res.json({
        success: true,
        totalClasses: classes.length,
        enrolledClasses: classesWithQuizInfo,
      });
    } catch (err) {
      console.error("[ERROR] /student/classes-with-quizzes", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

classRoutes.get(
  "/teacher/classes-with-mcqs/:teacherId",
  authMiddleware,
  async (req, res) => {
    const { teacherId } = req.params;

    // Authorization: only that teacher or admin
    if (
      req.user.role !== "admin" &&
      !(req.user.role === "teacher" && req.user._id.toString() === teacherId)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    try {
      // 1. Find classes where this teacher is assigned
      const classes = await Classs.find({ teacher: teacherId });

      // 2. For each class, find all subjects with MCQs
      const subjectData = await Promise.all(
        classes.map(async (cls) => {
          const subjectsArray = Array.isArray(cls.subjects)
            ? cls.subjects
            : [cls.subjects];

          const results = await Promise.all(
            subjectsArray.map(async (subject) => {
              const publishedCount = await MCQ.countDocuments({
                class: cls._id,
                section: cls.section,
                subject,
                teacher: teacherId,
                status: "published",
              });

              const draftCount = await MCQ.countDocuments({
                class: cls._id,
                section: cls.section,
                subject,
                teacher: teacherId,
                status: "draft",
              });

              const totalCount = publishedCount + draftCount;

              if (totalCount > 0) {
                return {
                  classId: cls._id,
                  className: cls.name,
                  section: cls.section,
                  grade: cls.grade,
                  subject,
                  quizCount: totalCount,
                  statusBreakdown: {
                    published: publishedCount,
                    draft: draftCount,
                  },
                };
              } else {
                return null;
              }
            })
          );

          return results.filter(Boolean); // Remove nulls
        })
      );

      const flatResults = subjectData.flat();

      res.json({
        success: true,
        totalSubjects: flatResults.length,
        subjectsWithMCQs: flatResults,
      });
    } catch (error) {
      console.error("[ERROR] /teacher/classes-with-mcqs", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
);
export default classRoutes;
