import mongoose from "mongoose";
const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  section: { type: String, required: true },
  grade: { type: String, required: true },
  capacity: { type: Number, default: 30 },
  maxStudents: { type: Number },
  roomNo: { type: String },
  time: { type: String }, // Or you could use { start: Date, end: Date } if you'd prefer
  schedule: [{ type: String }], // e.g. ["Monday", "Wednesday"]
  status: {
    type: String,
    enum: ["active", "archived", "completed"],
    default: "active",
  },

  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  subjects: [String],
  createdAt: { type: Date, default: Date.now },
});

const Classs = mongoose.model("Class", classSchema);
export default Classs;
