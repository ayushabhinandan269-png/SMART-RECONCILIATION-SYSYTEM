import fs from "fs";
import csv from "csv-parser";

export const parseCSV = (filePath, onRow, onComplete) => {
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", onRow)
    .on("end", onComplete)
    .on("error", (err) => {
      throw err;
    });
};
