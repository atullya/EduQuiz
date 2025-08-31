import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  section: { type: String, required: true },
  subject: { type: String, required: true },
  mcqs: [
    {
      mcqId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MCQ",
        required: true,
      },
      selectedOption: { type: String }, // e.g. "A", "B", ...
      correctAnswer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
  score: { type: Number, required: true },
  correctAnswers: { type: Number, required: true }, // New field added here
  duration: { type: Number }, // Duration in minutes
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
});

const QuizAttempt =
  mongoose.models.QuizAttempt ||
  mongoose.model("QuizAttempt", quizAttemptSchema);

export default QuizAttempt;
