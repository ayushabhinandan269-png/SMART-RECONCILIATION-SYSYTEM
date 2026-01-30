import UploadJob from "../models/UploadJob.js";
import Record from "../models/Record.js";
import { parseCSV } from "../utils/csvParser.js";
import { runReconciliation } from "./reconciliation.controller.js";

export const processCSVUpload = async (jobId, filePath) => {
  let count = 0;

  try {
    await UploadJob.findByIdAndUpdate(jobId, {
      status: "Processing"
    });

    return new Promise((resolve, reject) => {
      parseCSV(
        filePath,
        async (row) => {
          count++;

          await Record.create({
            uploadJobId: jobId,
            transactionId: row.transaction_id,
            referenceNumber: row.reference_number,
            amount: Number(row.amount),
            date: new Date(row.date),
            rawData: row
          });
        },
        async () => {
          await UploadJob.findByIdAndUpdate(jobId, {
            status: "Completed",
            totalRecords: count
          });

          // 🚀 reconciliation runs after ingestion
          await runReconciliation(jobId);

          resolve();
        },
        async (err) => {
          await UploadJob.findByIdAndUpdate(jobId, {
            status: "Failed",
            error: err.message
          });
          reject(err);
        }
      );
    });
  } catch (err) {
    await UploadJob.findByIdAndUpdate(jobId, {
      status: "Failed",
      error: err.message
    });
  }
};
