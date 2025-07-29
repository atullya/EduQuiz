import express from "express";
import multer from "multer";
import axios from "axios";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import MCQ from "../models/MCQ.js";
import Classs from "../models/class.model.js"; // Corrected import path based on your provided code
import User from "../models/user.model.js"; // Corrected import path based on your provided code

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, "../../uploads") });

// URL of your running FastAPI server
const FASTAPI_URL = "http://127.0.0.1:8000"; // Use IPv4 explicitly

router.post("/generate-text", async (req, res) => {
  const { numberOfQuestions = 5, textContent } = req.body;
  if (!textContent) {
    return res
      .status(400)
      .json({ success: false, message: "Text content required" });
  }
  try {
    const params = new URLSearchParams();
    params.append("text", textContent);
    params.append("number_of_questions", numberOfQuestions);
    const response = await axios.post(
      `${FASTAPI_URL}/generate`,
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("[ERROR IN /generate-text]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/generate-pdf", upload.single("pdfFile"), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "PDF file required" });
  }
  try {
    const FormData = (await import("form-data")).default;
    const fsExtra = await import("fs");
    const form = new FormData();
    form.append("pdf_file", fsExtra.createReadStream(req.file.path));
    form.append("number_of_questions", req.body.numberOfQuestions || 5);
    const response = await axios.post(`${FASTAPI_URL}/generate-pdf`, form, {
      headers: {
        ...form.getHeaders(),
      },
      maxBodyLength: Number.POSITIVE_INFINITY,
      maxContentLength: Number.POSITIVE_INFINITY,
    });
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("[FILE DELETE ERROR]", err.message);
    });
    res.json(response.data);
  } catch (error) {
    console.error("[ERROR IN /generate-pdf]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/test-python", async (req, res) => {
  try {
    const params = new URLSearchParams();
    params.append("text", "AI is the science of intelligent machines.");
    params.append("number_of_questions", 1);
    const response = await axios.post(
      `${FASTAPI_URL}/generate`,
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("[ERROR IN /test-python]", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/save-mcqs", async (req, res) => {
  const { mcqs, classId, section, teacherId, duration, subject } = req.body;

  // Validation
  if (!mcqs || !Array.isArray(mcqs) || mcqs.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No MCQs provided." });
  }
  if (!classId || !section || !teacherId || !subject) {
    return res.status(400).json({
      success: false,
      message: "Class, section, subject, and teacher ID are required.",
    });
  }

  try {
    // Validate class and teacher
    const existingClass = await Classs.findById(classId);
    if (!existingClass) {
      return res
        .status(404)
        .json({ success: false, message: "Selected class not found." });
    }

    const existingTeacher = await User.findById(teacherId);
    if (!existingTeacher || existingTeacher.role !== "teacher") {
      return res.status(404).json({
        success: false,
        message: "Teacher not found or invalid role.",
      });
    }

    const savedMCQs = [];

    for (const mcqData of mcqs) {
      const transformedOptions = Object.entries(mcqData.options).map(
        ([key, value]) => ({ key, value })
      );

      const newMCQ = new MCQ({
        question: mcqData.question,
        options: transformedOptions,
        correct_answer: mcqData.correct_answer,
        explanation: mcqData.explanation,
        question_type: mcqData.question_type || "Multiple Choice",
        class: classId,
        section,
        subject, // ✅ Subject added here
        teacher: teacherId,
        duration: duration || 0,
        status: "published",
      });

      await newMCQ.save();
      savedMCQs.push(newMCQ);
    }

    res.status(201).json({
      success: true,
      message: "MCQs saved successfully!",
      savedCount: savedMCQs.length,
    });
  } catch (error) {
    console.error("[ERROR IN /save-mcqs]", error);
    res.status(500).json({
      success: false,
      message: "Failed to save MCQs to database.",
      error: error.message,
    });
  }
});

/*
router.post("/save-mcqs", async (req, res) => {
  const { mcqs, classId, section, teacherId, duration, subject } = req.body;

  if (!mcqs || !Array.isArray(mcqs) || mcqs.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No MCQs provided." });
  }

  if (!classId || !section || !teacherId || !subject) {
    return res.status(400).json({
      success: false,
      message: "Class, section, subject, and teacher ID are required.",
    });
  }

  try {
    const existingClass = await Classs.findById(classId);
    if (!existingClass) {
      return res
        .status(404)
        .json({ success: false, message: "Selected class not found." });
    }

    const existingTeacher = await User.findById(teacherId);
    if (!existingTeacher || existingTeacher.role !== "teacher") {
      return res.status(404).json({
        success: false,
        message: "Teacher not found or invalid role.",
      });
    }

    // 🧹 Delete existing MCQs for the same class, section, subject, and teacher
    await MCQ.deleteMany({
      class: classId,
      section,
      subject,
      teacher: teacherId,
    });

    const savedMCQs = [];

    for (const mcqData of mcqs) {
      const transformedOptions = Object.entries(mcqData.options).map(
        ([key, value]) => ({ key, value })
      );

      const newMCQ = new MCQ({
        question: mcqData.question,
        options: transformedOptions,
        correct_answer: mcqData.correct_answer,
        explanation: mcqData.explanation,
        question_type: mcqData.question_type || "Multiple Choice",
        class: classId,
        section,
        subject,
        teacher: teacherId,
        duration: duration || 0,
        status: "published",
      });

      await newMCQ.save();
      savedMCQs.push(newMCQ);
    }

    res.status(201).json({
      success: true,
      message: "MCQs saved successfully!",
      savedCount: savedMCQs.length,
    });
  } catch (error) {
    console.error("[ERROR IN /save-mcqs]", error);
    res.status(500).json({
      success: false,
      message: "Failed to save MCQs to database.",
      error: error.message,
    });
  }
});

*/

//try


export default router;
