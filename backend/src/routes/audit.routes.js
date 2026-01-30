import express from "express";
import { getRecordTimeline } from "../controllers/audit.controller.js";
import { protect } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";

const router = express.Router();

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

