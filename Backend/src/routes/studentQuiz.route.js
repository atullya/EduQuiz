import express from "express";
import MCQ from "../models/MCQ.js";
import QuizAttempt from "../models/QuizAttempt.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

/**
 * GET /mcq/student/quizzes
 * Get all published quizzes (MCQs grouped) by class, section, and subject
 */
// router.get("/student/quizzes", async (req, res) => {
//   try {
//     const { classId, section, subject } = req.query;

//     if (!classId || !section || !subject) {
//       return res.status(400).json({
//         success: false,
//         message: "classId, section, and subject are required as query params.",
//       });
//     }
//     console.log("Querying with:", {
//       class: classId,
//       section,
//       subject,
//       status: "published",
//     });

//     const allMCQs = await MCQ.find({});
//     console.log("All MCQs:", allMCQs.length);
//     res.json({ allMCQs });
//     // Find published MCQs matching criteria
//     // const mcqs = await MCQ.find({
//     //   class: classId,
//     //   section,
//     //   subject: new RegExp(`^${subject}$`, "i"), // case-insensitive
//     //   status: "published",
//     // });

//     // if (mcqs.length === 0) {
//     //   return res.status(404).json({
//     //     success: false,
//     //     message: "No quizzes found for the specified criteria.",
//     //   });
//     // }

//     // res.json({
//     //   success: true,
//     //   mcqs,
//     //   total: mcqs.length,
//     // });
//   } catch (error) {
//     console.error("[ERROR] /student/quizzes", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// router.get("/student/quizzes", async (req, res) => {
//   try {
//     const { classId, section, subject } = req.query;

//     if (!classId || !section || !subject) {
//       return res.status(400).json({
//         success: false,
//         message: "classId, section, and subject are required as query params.",
//       });
//     }

//     console.log("Incoming query:", { classId, section, subject });

//     const mcqs = await MCQ.find({
//       class: new mongoose.Types.ObjectId(classId),
//       section,
//       subject,
//       status: "published",
//     }).select("_id question options duration");

//     console.log("MCQs found:", mcqs.length);

//     if (mcqs.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No quizzes found for the specified criteria.",
//       });
//     }

//     res.json({
//       success: true,
//       duration: mcqs[0].duration, // ✅ FIXED: Send duration
//       mcqs,
//       total: mcqs.length,
//     });
//   } catch (error) {
//     console.error("[ERROR] /student/quizzes", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

router.get("/student/quizzes", async (req, res) => {
  try {
    console.log("hello");
    const { classId, section, subject, studentId } = req.query;

    // Step 1: Validate inputs
    if (!classId || !section || !subject || !studentId) {
      return res.status(400).json({
        success: false,
        message: "classId, section, subject, and studentId are required.",
      });
    }

    // Step 2: Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid classId format.",
      });
    }

    // Step 3: Fetch MCQs matching class, section, and subject
    const mcqs = await MCQ.find({
      class: new mongoose.Types.ObjectId(classId),
      section: section.trim(),
      subject: subject.trim(),
      status: "published",
    }).select("_id question options duration correct_answer");

    if (mcqs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No quizzes found for the specified criteria.",
      });
    }

    // Step 4: Check if the student has already attempted any quiz
    const existingAttempt = await QuizAttempt.findOne({
      student: new mongoose.Types.ObjectId(studentId),
      class: new mongoose.Types.ObjectId(classId),
      section: section.trim(),
      subject: subject.trim(),
    });

    // Step 5: Return success with quiz data
    res.json({
      success: true,
      mcqs,
      duration: mcqs[0].duration,
      total: mcqs.length,
      alreadyAttempted: !!existingAttempt,
    });
  } catch (error) {
    console.error("[ERROR] /student/quizzes", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * POST /mcq/student/submit
 * Submit answers for grading and save the QuizAttempt
 * Expected req.body: { studentId, classId, section, subject, answers: [{ mcqId, selectedOption }] }
 */
router.post("/student/submit", async (req, res) => {
  try {
    const { studentId, classId, section, subject, answers } = req.body;

    if (!studentId || !classId || !section || !subject || !answers) {
      return res.status(400).json({
        success: false,
        message:
          "studentId, classId, section, subject, and answers are required.",
      });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Fetch MCQs to validate answers and get options & correct_answer
    const mcqIds = answers.map((a) => a.mcqId);
    const mcqs = await MCQ.find({ _id: { $in: mcqIds } });

    if (mcqs.length !== answers.length) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid MCQ IDs in answers" });
    }

    // Grade each answer
    let correctCount = 0;
    const detailedAnswers = answers.map((ans) => {
      const mcq = mcqs.find((m) => m._id.toString() === ans.mcqId);

      // Find selected option object inside MCQ options by option _id (ans.selectedOption)
      const selectedOptionObj = mcq.options.find(
        (o) => o._id.toString() === ans.selectedOption
      );

      // Compare selected option's key to mcq.correct_answer
      const isCorrect = selectedOptionObj?.key === mcq.correct_answer;

      if (isCorrect) correctCount++;

      return {
        mcqId: mcq._id,
        selectedOption: ans.selectedOption,
        correctAnswer: mcq.correct_answer,
        isCorrect,
      };
    });

    const score = (correctCount / mcqs.length) * 100; // percent score

    // Save QuizAttempt with correctAnswers
    const quizAttempt = new QuizAttempt({
      student: studentId,
      class: classId,
      section,
      subject,
      mcqs: detailedAnswers,
      score,
      correctAnswers: correctCount, // Save correct answer count here
      submittedAt: new Date(),
    });
    await quizAttempt.save();

    res.json({
      success: true,
      message: "Quiz submitted successfully.",
      score,
      totalQuestions: mcqs.length,
      correctAnswers: correctCount, // Send it in response too
      quizAttemptId: quizAttempt._id,
    });
  } catch (error) {
    console.error("[ERROR] /student/submit", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * GET /mcq/student/results/:studentId
 * Get past quiz attempts for a student (optionally filter by class, section, subject)
 */
// router.get("/student/progress/:studentId", async (req, res) => {
//   try {
//     const { studentId } = req.params;
//     const { classId, section, subject } = req.query;

//     let filter = { student: studentId };
//     if (classId) filter.class = classId;
//     if (section) filter.section = section;
//     if (subject) filter.subject = subject;

//     const attempts = await QuizAttempt.find(filter);

//     if (attempts.length === 0) {
//       return res.json({
//         success: true,
//         message: "No quiz attempts found for this student.",
//         progress: {
//           totalAttempts: 0,
//           averageScore: 0,
//           totalCorrectAnswers: 0,
//           totalQuestionsAnswered: 0,
//         },
//       });
//     }

//     // Calculate totals
//     const totalAttempts = attempts.length;
//     const totalScoreSum = attempts.reduce((sum, a) => sum + a.score, 0);

//     // Sum all correct answers and questions answered
//     let totalCorrectAnswers = 0;
//     let totalQuestionsAnswered = 0;

//     attempts.forEach((attempt) => {
//       attempt.mcqs.forEach((mcqAnswer) => {
//         totalQuestionsAnswered++;
//         if (mcqAnswer.isCorrect) totalCorrectAnswers++;
//       });
//     });

//     const averageScore = totalScoreSum / totalAttempts;

//     res.json({
//       success: true,
//       progress: {
//         totalAttempts,
//         averageScore,
//         totalCorrectAnswers,
//         totalQuestionsAnswered,
//       },
//       attempts, // optional: full attempts data if needed
//     });
//   } catch (error) {
//     console.error("[ERROR] /student/progress", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

router.get("/student/progress/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    // Get all attempts by the student, no filter on class/section/subject
    const attempts = await QuizAttempt.find({ student: studentId });

    if (attempts.length === 0) {
      return res.json({
        success: true,
        message: "No quiz attempts found for this student.",
        progress: {
          totalAttempts: 0,
          averageScore: 0,
          totalCorrectAnswers: 0,
          totalQuestionsAnswered: 0,
        },
      });
    }

    // Calculate totals
    const totalAttempts = attempts.length;
    const totalScoreSum = attempts.reduce((sum, a) => sum + a.score, 0);

    let totalCorrectAnswers = 0;
    let totalQuestionsAnswered = 0;

    attempts.forEach((attempt) => {
      attempt.mcqs.forEach((mcqAnswer) => {
        totalQuestionsAnswered++;
        if (mcqAnswer.isCorrect) totalCorrectAnswers++;
      });
    });

    const averageScore = totalScoreSum / totalAttempts;

    res.json({
      success: true,
      progress: {
        totalAttempts,
        averageScore,
        totalCorrectAnswers,
        totalQuestionsAnswered,
      },
      attempts,
    });
  } catch (error) {
    console.error("[ERROR] /student/progress", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/teacher/progress", async (req, res) => {
  try {
    const { classId, section, subject } = req.query;

    if (!classId || !section || !subject) {
      return res.status(400).json({
        success: false,
        message: "classId, section, and subject are required.",
      });
    }

    // Find all quiz attempts for this class/section/subject
    const attempts = await QuizAttempt.find({
      class: classId,
      section,
      subject,
    })
      .populate("student", "username email") // assuming User model has name/email
      .sort({ submittedAt: -1 }); // latest first

    if (attempts.length === 0) {
      return res.json({
        success: true,
        message: "No quiz attempts found for this class/section/subject.",
        progress: {
          totalStudentsAttempted: 0,
          averageScore: 0,
          scoreDistribution: {},
          studentResults: [],
        },
      });
    }

    // Map to get each student's latest attempt only
    const latestAttemptsMap = new Map();

    for (const attempt of attempts) {
      const studentId = attempt.student._id.toString();
      if (!latestAttemptsMap.has(studentId)) {
        latestAttemptsMap.set(studentId, attempt);
      }
    }

    const latestAttempts = Array.from(latestAttemptsMap.values());

    const totalStudentsAttempted = latestAttempts.length;
    const totalScoreSum = latestAttempts.reduce((sum, a) => sum + a.score, 0);
    const averageScore = totalScoreSum / totalStudentsAttempted;

    // Create score distribution (e.g., 0-49, 50-69, 70-89, 90-100)
    const scoreDistribution = {
      "0-49": 0,
      "50-69": 0,
      "70-89": 0,
      "90-100": 0,
    };

    latestAttempts.forEach(({ score }) => {
      if (score < 50) scoreDistribution["0-49"]++;
      else if (score < 70) scoreDistribution["50-69"]++;
      else if (score < 90) scoreDistribution["70-89"]++;
      else scoreDistribution["90-100"]++;
    });

    // Prepare student result list
    const studentResults = latestAttempts.map((attempt) => ({
      studentId: attempt.student._id,
      name: attempt.student.username,
      email: attempt.student.email,
      correctAnswers: attempt.correctAnswers,
      totalQuestions: attempt.mcqs.length,
      score: attempt.score,
      submittedAt: attempt.submittedAt,
    }));

    res.json({
      success: true,
      progress: {
        totalStudentsAttempted,
        averageScore,
        scoreDistribution,
        studentResults,
      },
    });
  } catch (error) {
    console.error("[ERROR] /teacher/progress", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.delete("/teacher/delete-mcqs", authMiddleware, async (req, res) => {
  const { teacherId, classId, section, subject } = req.query;

  if (!teacherId || !classId || !section || !subject) {
    return res.status(400).json({
      success: false,
      message: "teacherId, classId, section, and subject are required.",
    });
  }

  // Authorization: Only the teacher or admin
  if (req.user.role !== "admin" && req.user._id.toString() !== teacherId) {
    return res.status(403).json({ message: "Not authorized" });
  }

  try {
    const result = await MCQ.deleteMany({
      teacher: teacherId,
      class: classId,
      section,
      subject,
    });

    res.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} MCQs deleted successfully.`,
    });
  } catch (error) {
    console.error("[ERROR] DELETE /teacher/delete-mcqs", error);
    res.status(500).json({ success: false, message: "Failed to delete MCQs." });
  }
});
// http://localhost:3000/api/mcq?classId=685a4805bf063541fd791afb&teacherId=68595760b52e47a899025a1f&subject=English
router.get("/all-mcqs", async (req, res) => {
  try {
    // Optional query params for filtering
    const { classId, teacherId, subject } = req.query;

    const filter = {};

    if (classId) filter.class = classId;
    if (teacherId) filter.teacher = teacherId;
    if (subject) filter.subject = subject;

    const mcqs = await MCQ.find(filter)
      .populate("class", "name grade section")
      .populate("teacher", "username email")
      .sort({ createdAt: -1 }); // recent first

    const formatted = mcqs.map((mcq) => ({
      id: mcq._id,
      question: mcq.question,
      options: mcq.options,
      correctAnswer: mcq.correct_answer,
      explanation: mcq.explanation,
      subject: mcq.subject,
      duration: mcq.duration,
      questionType: mcq.question_type,
      class: mcq.class
        ? {
            name: mcq.class.name,
            grade: mcq.class.grade,
            section: mcq.class.section,
          }
        : null,
      teacher: mcq.teacher
        ? {
            username: mcq.teacher.username,
            email: mcq.teacher.email,
          }
        : null,
      createdAt: mcq.createdAt,
    }));

    res.json({ success: true, mcqs: formatted });
  } catch (error) {
    console.error("[ERROR IN /all-mcqs]", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch MCQs.",
      error: error.message,
    });
  }
});

export default router;
