import express from "express";
import { manualCorrectRecord } from "../controllers/manualCorrection.controller.js";
import { protect } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";

const router = express.Router();

/**
 * PATCH /api/records/:recordId
 * Manual correction of a record
 */
router.patch(
  "/:recordId",
  protect,
  allowRoles("Admin", "Analyst"),
  async (req, res) => {
    try {
      const updatedRecord = await manualCorrectRecord(
        req.params.recordId,
        req.body,
        req.user.id
      );

      res.json({
        message: "Record updated successfully",
        record: updatedRecord
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

export default router;
