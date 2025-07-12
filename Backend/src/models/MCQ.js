import mongoose from "mongoose";

// Schema for individual MCQ options
const mcqOptionSchema = new mongoose.Schema({
  key: { type: String, required: true }, // e.g., "A", "B", "C", "D"
  value: { type: String, required: true }, // The text content of the option
});

// Main MCQ Schema
const mcqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [mcqOptionSchema],
  correct_answer: { type: String, required: true },
  explanation: { type: String },
  question_type: { type: String, default: "Multiple Choice" },

  // 🔽 New Field: Subject of the question
  subject: { type: String, required: true },

  // Class/teacher references
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  section: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  duration: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook to update updatedAt
mcqSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const MCQ = mongoose.models.MCQ || mongoose.model("MCQ", mcqSchema);
export default MCQ;
