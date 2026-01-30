import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";

const router = express.Router();

/**
 * GET /api/dashboard/:uploadJobId
 * Returns summary stats for dashboard
 */
router.get(
  "/:uploadJobId",
  protect,
  allowRoles("Admin", "Analyst", "Viewer"),
  async (req, res) => {
    try {
      const stats = await getDashboardStats(req.params.uploadJobId);
      res.json(stats);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
