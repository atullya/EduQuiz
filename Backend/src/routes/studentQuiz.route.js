import express from "express";
import MCQ from "../models/MCQ.js";
import QuizAttempt from "../models/QuizAttempt.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
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
    const { classId, section, subject, studentId } = req.query;

    if (!classId || !section || !subject) {
      return res.status(400).json({
        success: false,
        message: "classId, section, subject, and studentId are required.",
      });
    }

    // Fetch published MCQs with correct answers included
    const mcqs = await MCQ.find({
      class: new mongoose.Types.ObjectId(classId),
      section,
      subject,
      status: "published",
    }).select("_id question options duration correct_answer");

    if (mcqs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No quizzes found for the specified criteria.",
      });
    }

    // Check if student has already attempted this quiz
    const existingAttempt = await QuizAttempt.findOne({
      student: studentId,
      class: classId,
      section,
      subject,
    });

    res.json({
      success: true,
      mcqs,
      duration: mcqs[0].duration,
      total: mcqs.length,
      alreadyAttempted: !!existingAttempt, // Boolean flag
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
      .populate("student", "name email") // assuming User model has name/email
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
      name: attempt.student.name,
      email: attempt.student.email,
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

export default router;
