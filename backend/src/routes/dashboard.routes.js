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
  getDashboardStats   // ✅ PASS CONTROLLER DIRECTLY
);

export default router;

