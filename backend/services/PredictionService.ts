import { excelRepository } from "../repositories/ExcelDatabaseRepository";
import { CutoffRecord } from "../models/CutoffRecord";

export interface PredictionRequestDTO {
  fullName: string;
  mobileNumber: string;
  exam_type: string;
  pred_mode: string;
  score: string; // the student's percentile
  gender: string;
  district: string;
  category: string;
  ews: string;
  tfws: string;
  branch: string;
}

export interface PredictedCollegeDTO {
  rank: number;
  collegeCode: string;
  collegeName: string;
  district: string;
  branch: string;
  quota: string;
  r1: string; // We map closing percentile here
  r2: string;
  r3: string;
  r4: string;
  average: string;
}

export interface PredictionResponseDTO {
  predictions: PredictedCollegeDTO[];
  studentDetails: PredictionRequestDTO;
}

export class PredictionService {
  /**
   * Executes the prediction matching logic.
   */
  async predict(request: PredictionRequestDTO): Promise<PredictionResponseDTO> {
    const startTime = Date.now();
    const studentPercentile = parseFloat(request.score);

    // If the student percentile is invalid, return empty predictions
    if (isNaN(studentPercentile)) {
      return {
        predictions: [],
        studentDetails: request,
      };
    }

    // Determine the target category based on user input (simplified to exact category match, though it can be expanded)
    let searchCategory = request.category;
    if (request.tfws === "Yes") searchCategory = "TFWS";
    if (request.ews === "Yes") searchCategory = "EWS";

    // Query the repository
    const matchedRecords: CutoffRecord[] = await excelRepository.search({
      category: searchCategory,
      branch: request.branch !== "All" ? request.branch : undefined,
      minPercentile: studentPercentile,
    });

    // Sort colleges from highest closing percentile to lowest
    matchedRecords.sort((a, b) => b.closingPercentile - a.closingPercentile);

    // Map database models to DTOs expected by the legacy frontend/PDF generator
    const predictions: PredictedCollegeDTO[] = matchedRecords.map((record, index) => ({
      rank: index + 1, // Sr. No.
      collegeCode: record.instituteCode,
      collegeName: record.instituteName,
      // The dataset doesn't have district explicitly, so we leave it as "-" or infer from name
      district: "-", 
      branch: record.courseName,
      quota: record.category,
      // As per our plan, map closing percentile to r1, leaving the rest empty
      r1: record.closingPercentile.toFixed(2),
      r2: "-",
      r3: "-",
      r4: "-",
      average: record.closingPercentile.toFixed(2),
    }));

    console.log(`[PredictionService] Prediction generated in ${Date.now() - startTime}ms. Found ${predictions.length} eligible colleges.`);

    return {
      predictions,
      studentDetails: request,
    };
  }
}

export const predictionService = new PredictionService();
