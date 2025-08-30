import multer from "multer";
import path from "path";

// Store in /uploads/assignments
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/assignments/");
  },
  filename: (req, file, cb) => {
    // Keep original filename but prepend timestamp and studentId to avoid collisions
    const studentId = req.user ? req.user._id : "unknown";
    const uniqueSuffix = `${studentId}-${Date.now()}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter });
export default upload;
