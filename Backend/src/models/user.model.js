import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "teacher", "student"], required: true },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    address: String,
    dateOfBirth: Date,
    // Student specific
    studentId: String,
    class: String,
    section: String,
    // Teacher specific
    teacherId: String,
    subjects: [String],
    qualification: String,
  },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);
export default User;
