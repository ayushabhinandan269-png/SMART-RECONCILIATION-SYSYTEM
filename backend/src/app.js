import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import manualCorrectionRoutes from "./routes/manualCorrection.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/uploads", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/records", manualCorrectionRoutes);


app.get("/", (req, res) => {
  res.send("Smart Reconciliation API running");
});

export default app;
