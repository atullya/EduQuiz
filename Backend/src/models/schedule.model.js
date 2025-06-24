import mongoose from "mongoose";
const scheduleSchema = new mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: { type: String, required: true },
  dayOfWeek: {
    type: String,
    enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    required: true,
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: String,
  createdAt: { type: Date, default: Date.now },
});
const Schedule = mongoose.model("Schedule", scheduleSchema);
export default Schedule;
