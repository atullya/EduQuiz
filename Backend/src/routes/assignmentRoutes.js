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

//main get hai yo chai
assignmentRoutes.get(
  "/my-assigned-with-submissions",
  authMiddleware,
  async (req, res) => {
    try {
      // Ensure only teachers can access this endpoint
      if (req.user.role !== "teacher") {
        return res
          .status(403)
          .json({ message: "Only teachers can access this endpoint." });
      }

      // Get all assignments created by this teacher
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

      // Process and transform data
      const result = assignments
        .filter((assignment) => assignment.class) // Ignore assignments with missing class
        .map((assignment) => {
          const allStudents = assignment.class.students || [];
          const submissions = assignment.submissions || [];

          const submittedStudentIds = submissions.map((sub) =>
            sub.student?._id?.toString()
          );

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
            subject: assignment.subject,
            submittedCount: submissions.length,
            totalStudents: allStudents.length,
            submissions, // You can include more/less detail here
            notSubmitted, // Optional
            dueDate: assignment.dueDate,
            priority: assignment.priority,
          };
        });

      // Return the result
      res.json(result);
    } catch (err) {
      console.error(
        "Error getting assigned assignments with submissions:",
        err
      );
      res.status(500).json({ message: err.message });
    }
  }
);

// DELETE /api/assignments/my-assigned/:assignmentId
assignmentRoutes.delete(
  "/my-assigned/:assignmentId",
  authMiddleware,
  async (req, res) => {
    try {
      const { assignmentId } = req.params;

      if (req.user.role !== "teacher") {
        return res.status(403).json({
          message: "Only teachers can delete their assignments.",
        });
      }

      // Find assignment by ID
      const assignment = await Assignment.findById(assignmentId);

      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found." });
      }

      // Ensure the assignment belongs to the requesting teacher
      if (assignment.teacher.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "You are not authorized to delete this assignment.",
        });
      }

      // Delete the assignment
      await Assignment.findByIdAndDelete(assignmentId);

      res.json({ success: true, message: "Assignment deleted successfully." });
    } catch (err) {
      console.error("Error deleting assignment:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// ✅ GET assignments for class
assignmentRoutes.get("/class/:classId", authMiddleware, async (req, res) => {
  try {
    const assignments = await Assignment.find({ class: req.params.classId });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ✅ UPDATE assignment
assignmentRoutes.put(
  "/my-assigned/:assignmentId",
  authMiddleware,
  async (req, res) => {
    try {
      const { assignmentId } = req.params;
      // Destructure class as classId directly, and remove priority
      const { title, description, subject, class: classId, dueDate } = req.body;

      if (req.user.role !== "teacher") {
        return res.status(403).json({
          message: "Only teachers can update assignments.",
        });
      }

      // Find assignment by ID
      const assignment = await Assignment.findById(assignmentId);

      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found." });
      }

      // Ensure the assignment belongs to the requesting teacher
      if (assignment.teacher.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "You are not authorized to update this assignment.",
        });
      }

      // Update assignment fields
      assignment.title = title || assignment.title;
      assignment.description = description || assignment.description;
      assignment.subject = subject || assignment.subject;
      assignment.dueDate = dueDate || assignment.dueDate;
      // Remove priority update: assignment.priority = priority || assignment.priority;

      // If classId is provided, update the class reference directly
      if (classId) {
        assignment.class = classId;
      }

      await assignment.save();

      res.json({
        success: true,
        message: "Assignment updated successfully.",
        assignment,
      });
    } catch (err) {
      console.error("Error updating assignment:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
);

// Route for students to view their assigned assignments
assignmentRoutes.get(
  "/student/my-assignments",
  authMiddleware,
  async (req, res) => {
    try {
      if (req.user.role !== "student") {
        return res
          .status(403)
          .json({ message: "Only students can access this endpoint." });
      }

      const studentUser = await User.findById(req.user._id)
        .select("profile.class profile.section")
        .lean();

      if (
        !studentUser ||
        !studentUser.profile ||
        !studentUser.profile.class ||
        !studentUser.profile.section
      ) {
        return res.status(400).json({
          message:
            "Student's class or section information not found in user profile.",
        });
      }

      const studentGrade = studentUser.profile.class; // or Number(studentUser.profile.class)
      const studentSection = studentUser.profile.section;

      console.log("Looking for class with:", { studentGrade, studentSection });

      const studentClassDoc = await Classs.findOne({
        grade: studentGrade,
        section: studentSection,
      })
        .select("_id")
        .lean();

      console.log("Matched class document:", studentClassDoc);

      if (!studentClassDoc) {
        return res.status(404).json({
          message: `No class found for grade "${studentGrade}" and section "${studentSection}".`,
        });
      }

      const studentClassId = studentClassDoc._id;

      const assignments = await Assignment.find({ class: studentClassId })
        .populate(
          "teacher",
          "username email profile.firstName profile.lastName"
        )
        .populate("class", "name grade section")
        .lean();

      const result = assignments.map((assignment) => {
        const studentSubmission = assignment.submissions.find(
          (sub) => sub.student.toString() === req.user._id.toString()
        );

        return {
          _id: assignment._id,
          title: assignment.title,
          description: assignment.description,
          subject: assignment.subject,
          dueDate: assignment.dueDate,
          priority: assignment.priority,
          class: {
            _id: assignment.class._id,
            name: assignment.class.name,
            grade: assignment.class.grade,
            section: assignment.class.section,
          },
          teacher: {
            _id: assignment.teacher._id,
            firstName: assignment.teacher.profile?.firstName,
            lastName: assignment.teacher.profile?.lastName,
          },
          isSubmitted: !!studentSubmission,
          submission: studentSubmission
            ? {
                submittedAt: studentSubmission.submittedAt,
                submissionText: studentSubmission.submissionText,
              }
            : null,
        };
      });

      res.json({ success: true, assignments: result });
    } catch (err) {
      console.error("Error getting student's assignments:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
);

// ✅ Student submit
// Route for students to submit an assignment
assignmentRoutes.post(
  "/student/submit-assignment/:assignmentId",
  authMiddleware,
  async (req, res) => {
    try {
      if (req.user.role !== "student") {
        return res
          .status(403)
          .json({ message: "Only students can submit assignments." });
      }

      const { assignmentId } = req.params;
      const { submissionText } = req.body;
      const studentId = req.user._id;

      if (!submissionText) {
        return res
          .status(400)
          .json({ message: "Submission text is required." });
      }

      const assignment = await Assignment.findById(assignmentId);

      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found." });
      }

      // Check if student has already submitted
      const existingSubmissionIndex = assignment.submissions.findIndex(
        (sub) => sub.student.toString() === studentId.toString()
      );

      if (existingSubmissionIndex > -1) {
        // Update existing submission
        assignment.submissions[existingSubmissionIndex].submissionText =
          submissionText;
        assignment.submissions[existingSubmissionIndex].submittedAt =
          new Date();
      } else {
        // Add new submission
        assignment.submissions.push({
          student: studentId,
          submissionText,
          submittedAt: new Date(),
        });
      }

      await assignment.save();

      res.json({
        success: true,
        message: "Assignment submitted successfully.",
      });
    } catch (err) {
      console.error("Error submitting assignment:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  }
);
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
