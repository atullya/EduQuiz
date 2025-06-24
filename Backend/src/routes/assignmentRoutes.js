import express from "express";
import Assignment from "../models/assignmnet.model.js";
import Classs from "../models/class.model.js";
import User from "../models/user.model.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const assignmentRoutes = express.Router();

// ✅ CREATE assignment
assignmentRoutes.post("/create", authMiddleware, async (req, res) => {
  if (req.user.role !== "teacher") {
    return res
      .status(403)
      .json({ message: "Only teachers can create assignments" });
  }

  const { title, description, subject, class: classId, dueDate } = req.body;

  try {
    // Check if class exists
    const classData = await Classs.findById(classId);
    if (!classData) {
      return res
        .status(400)
        .json({ message: "Invalid class ID (class not found)" });
    }

    // Optional: Verify teacher is the assigned teacher of that class
    if (classData.teacher.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not assigned to this class" });
    }

    const assignment = new Assignment({
      title,
      description,
      subject,
      class: classId,
      teacher: req.user._id,
      dueDate,
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    console.error("Create assignment error:", err);
    res.status(400).json({ message: err.message });
  }
});

// GET /assignments
assignmentRoutes.get("/allassignment", authMiddleware, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "teacher") {
      // Teacher sees only their assignments
      query.teacher = req.user._id;
    } else if (req.user.role === "student") {
      // Student sees assignments for their classes
      const student = await User.findById(req.user._id).select("classes");
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      query.class = { $in: student.classes };
    }
    // If admin, no filter — get all

    const assignments = await Assignment.find(query)
      .populate("class", "name grade section")
      .populate("teacher", "username email");

    res.json(assignments);
  } catch (err) {
    console.error("Error getting assignments:", err);
    res.status(500).json({ message: err.message });
  }
});

//my assighments teacher
assignmentRoutes.get("/my-assigned", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can access this endpoint." });
    }

    const assignments = await Assignment.find({ teacher: req.user._id })
      .populate("class", "name grade section")
      .populate("teacher", "username email");

    res.json(assignments);
  } catch (err) {
    console.error("Error getting teacher's assignments:", err);
    res.status(500).json({ message: err.message });
  }
});
assignmentRoutes.get("/my-assigned-with-submissions", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can access this endpoint." });
    }

    // Get all assignments assigned by this teacher
    const assignments = await Assignment.find({ teacher: req.user._id })
      .populate({
        path: "class",
        populate: {
          path: "students",
          select: "username email profile.firstName profile.lastName",
        },
      })
      .populate({
        path: "submissions.student",
        select: "username email profile.firstName profile.lastName",
      })
      .populate({
        path: "teacher",
        select: "username email",
      });

    // Transform data
    const result = assignments.map((assignment) => {
      const allStudents = assignment.class.students;
      const submissions = assignment.submissions;

      const submittedStudentIds = submissions.map((sub) => sub.student._id.toString());

      const notSubmitted = allStudents.filter(
        (student) => !submittedStudentIds.includes(student._id.toString())
      );

      return {
        _id: assignment._id,
        title: assignment.title,
        class: {
          name: assignment.class.name,
          grade: assignment.class.grade,
          section: assignment.class.section,
        },
        submittedCount: submissions.length,
        totalStudents: allStudents.length,
        submissions, // you can include more/less detail as needed
        notSubmitted, // optional
        dueDate: assignment.dueDate,
        priority: assignment.priority,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Error getting assigned assignments with submissions:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET assignments for class
assignmentRoutes.get("/class/:classId", authMiddleware, async (req, res) => {
  try {
    const assignments = await Assignment.find({ class: req.params.classId });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Student submit
assignmentRoutes.post(
  "/submit/:assignmentId",
  authMiddleware,
  async (req, res) => {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can submit assignments" });
    }

    const { submissionText } = req.body;

    try {
      const assignment = await Assignment.findById(
        req.params.assignmentId
      ).populate("class");
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      // ✅ Check if student belongs to the class
      const classStudentIds = assignment.class.students.map((id) =>
        id.toString()
      );
      if (!classStudentIds.includes(req.user._id.toString())) {
        return res
          .status(403)
          .json({ message: "You are not enrolled in this class" });
      }

      // ✅ Check if already submitted
      const alreadySubmitted = assignment.submissions.find(
        (sub) => sub.student.toString() === req.user._id.toString()
      );
      if (alreadySubmitted) {
        return res
          .status(400)
          .json({ message: "You have already submitted this assignment" });
      }

      assignment.submissions.push({
        student: req.user._id,
        submissionText,
      });

      await assignment.save();
      res.json({ message: "Submission successful" });
    } catch (err) {
      console.error("Submission error:", err);
      res.status(400).json({ message: err.message });
    }
  }
);

// GET /assignments/:assignmentId/submissions
assignmentRoutes.get(
  "/:assignmentId/submissions",
  authMiddleware,
  async (req, res) => {
    try {
      const assignment = await Assignment.findById(req.params.assignmentId)
        .populate({
          path: "submissions.student",
          select: "username email profile.firstName profile.lastName",
        })
        .populate({
          path: "class",
          populate: {
            path: "students",
            select: "username email profile.firstName profile.lastName",
          },
        })
        .populate({
          path: "teacher",
          select: "username email",
        });

      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      // Check if requester is the teacher who created it or admin
      if (
        req.user.role !== "admin" &&
        !(
          req.user.role === "teacher" &&
          assignment.teacher._id.toString() === req.user._id.toString()
        )
      ) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const submittedStudentIds = assignment.submissions.map((sub) =>
        sub.student._id.toString()
      );
      const allStudents = assignment.class.students;

      const submissions = assignment.submissions;
      const notSubmitted = allStudents.filter(
        (student) => !submittedStudentIds.includes(student._id.toString())
      );

      res.json({
        assignmentTitle: assignment.title,
        totalStudents: allStudents.length,
        submittedCount: submissions.length,
        submissions,
        notSubmitted: notSubmitted,
      });
    } catch (err) {
      console.error("Error getting assignment submissions:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

// ✅ Teacher grade / give feedback
assignmentRoutes.put(
  "/grade/:assignmentId/:studentId",
  authMiddleware,
  async (req, res) => {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can grade" });
    }

    const { marks, feedback } = req.body;

    try {
      const assignment = await Assignment.findById(req.params.assignmentId);
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      if (assignment.teacher.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "You are not the creator of this assignment" });
      }

      const submission = assignment.submissions.find(
        (sub) => sub.student.toString() === req.params.studentId
      );

      if (!submission) {
        return res
          .status(404)
          .json({ message: "Submission not found for this student" });
      }

      submission.marks = marks;
      submission.feedback = feedback;

      await assignment.save();
      res.json({ message: "Graded successfully" });
    } catch (err) {
      console.error("Grading error:", err);
      res.status(400).json({ message: err.message });
    }
  }
);

export default assignmentRoutes;
