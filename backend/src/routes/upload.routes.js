import express from "express";
import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import UploadJob from "../models/UploadJob.js";
import { protect } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";
import { processCSVUpload } from "../controllers/upload.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  protect,
  allowRoles("Admin", "Analyst"),
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const buffer = fs.readFileSync(req.file.path);
    const fileHash = crypto.createHash("sha256").update(buffer).digest("hex");

    const existingJob = await UploadJob.findOne({ fileHash });
    if (existingJob) {
      return res.json({
        message: "File already uploaded",
        job: existingJob
      });
    }

    const job = await UploadJob.create({
      fileName: req.file.originalname,
      fileHash,
      uploadedBy: req.user.id,
      status: "Processing"
    });

    // 🚀 ASYNC BACKGROUND PROCESSING (DO NOT AWAIT)
    processCSVUpload(job._id, req.file.path);

    res.status(201).json({
      message: "Upload accepted. Processing started.",
      jobId: job._id
    });
  }
);

export default router;
