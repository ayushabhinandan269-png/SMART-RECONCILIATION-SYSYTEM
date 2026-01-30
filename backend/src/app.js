import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.routes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/uploads", uploadRoutes);
app.get("/", (req, res) => {
  res.send("Smart Reconciliation API running");
});

export default app;
