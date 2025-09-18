import express from "express";
import cors from "cors";
import multer from "multer";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000; // use Render's PORT

app.use(cors());
app.use(express.json());

// Uploads directory
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Prediction API
app.post("/predict", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const imagePath = path.join(__dirname, req.file.path);

  const pythonProcess = spawn("python", ["main.py", imagePath]);

  let result = "";
  pythonProcess.stdout.on("data", (data) => (result += data.toString()));
  pythonProcess.stderr.on("data", (data) => console.error("Python error:", data.toString()));

  pythonProcess.on("close", (code) => {
    console.log(`Python script exited with code ${code}`);
    try {
      const parsed = JSON.parse(result);
      res.json(parsed);
    } catch (err) {
      res.status(500).json({ error: "Failed to parse Python response" });
    }
  });
});

// Serve React frontend
const frontendPath = path.join(__dirname, "../Design/build");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
