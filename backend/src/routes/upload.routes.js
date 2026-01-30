import express from "express";
import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import UploadJob from "../models/UploadJob.js";
import { protect } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  protect,
  allowRoles("Admin", "Analyst"),
  upload.single("file"),
  async (req, res) => {
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileHash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

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
      uploadedBy: req.user.id
    });

    res.status(201).json({
      message: "Upload job created",
      job
    });
  }
);

export default router;
