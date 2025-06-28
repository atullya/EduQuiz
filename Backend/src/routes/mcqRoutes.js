import express from "express";
import multer from "multer";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, "../../uploads") });

const PY_SCRIPT = "C:/Users/atulm/Desktop/finalYear/scripts/api_integration.py";

function runPython(platform, contentOrPath, numQ = 5) {
  return new Promise((resolve, reject) => {
    const process = spawn("python", [
      PY_SCRIPT,
      platform,
      contentOrPath,
      numQ.toString(),
    ]);

    let out = "";
    let err = "";

    process.stdout.on("data", (data) => (out += data.toString()));
    process.stderr.on("data", (data) => (err += data.toString()));

    process.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`Python exited ${code}. ${err}`));
      }
      try {
        resolve(JSON.parse(out));
      } catch (e) {
        reject(new Error(`Invalid JSON: ${e.message} | Output: ${out}`));
      }
    });
  });
}

router.post("/generate-text", async (req, res) => {
  const { numberOfQuestions, textContent } = req.body;
  if (!textContent)
    return res
      .status(400)
      .json({ success: false, message: "Text content required" });

  try {
    const result = await runPython("text", textContent, numberOfQuestions || 5);
    res.json(result);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

router.post("/generate-pdf", upload.single("pdfFile"), async (req, res) => {
  if (!req.file)
    return res
      .status(400)
      .json({ success: false, message: "PDF file required" });

  try {
    const result = await runPython(
      "pdf",
      req.file.path,
      req.body.numberOfQuestions || 5
    );
    res.json(result);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ success: false, message: e.message });
  } finally {
    fs.unlink(req.file.path, () => {});
  }
});

router.get("/test-python", async (req, res) => {
  try {
    const result = await runPython(
      "text",
      "AI is the science of intelligent machines.",
      1
    );
    res.json(result);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ success: false, message: e.message });
  }
});

export default router;
