import express from "express";
import {
  getReconciliationResults,
  updateReconciliationRecord,
} from "../controllers/reconciliation.controller.js";
import { protect } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";

const router = express.Router();

/**
 * GET /api/reconciliation/:uploadJobId
 */
router.get(
  "/:uploadJobId",
  protect,
  allowRoles("Admin", "Analyst", "Viewer"),
  getReconciliationResults
);

/**
 * PUT /api/reconciliation/:id
 */
router.put(
  "/:id",
  protect,
  allowRoles("Admin", "Analyst"),
  updateReconciliationRecord
);

export default router;
