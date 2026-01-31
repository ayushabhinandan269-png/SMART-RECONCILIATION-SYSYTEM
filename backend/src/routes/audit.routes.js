import express from "express";
import { getRecordTimeline } from "../controllers/audit.controller.js";
import { protect } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";
import AuditLog from "../models/AuditLog.js";
const router = express.Router();

/**
 * GET /api/audit
 * Returns all audit logs
 */
router.get(
  "/",
  protect,
  allowRoles("Admin", "Analyst", "Viewer"),
  async (req, res) => {
    try {
      const logs = await AuditLog.find()
        .sort({ timestamp: -1 })
        .limit(100);

      res.json(logs);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);
/**
 * GET /api/audit/timeline/:recordId
 * Returns audit timeline for a record
 */
router.get(
  "/timeline/:recordId",
  protect,
  allowRoles("Admin", "Analyst", "Viewer"),
  async (req, res) => {
    try {
      const timeline = await getRecordTimeline(req.params.recordId);
      res.json(timeline);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;

