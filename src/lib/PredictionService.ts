export interface PredictedCollege {
  rank: number;
  collegeCode: string;
  collegeName: string;
  district: string;
  branch: string;
  quota: string;
  r1: string;
  r2: string;
  r3: string;
  r4: string;
  average: string;
}

export interface StudentData {
  fullName: string;
  mobileNumber: string;
  exam_type: string;
  pred_mode: string;
  score: string;
  gender: string;
  district: string;
  category: string;
  ews?: boolean;
  tfws?: boolean;
  branch?: string[];
}

export interface PredictionResponse {
  student: {
    name: string;
    mobile: string;
    score: string;
    category: string;
    district: string;
    gender: string;
  };
  predictionSummary: {
    eligibleCount: number;
  };
  predictions: PredictedCollege[];
}

/**
 * PredictionService
 *
 * This service makes a POST request to /api/predict to get the real results.
 */
export class PredictionService {
  static async predict(studentData: StudentData): Promise<PredictionResponse> {
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch predictions from backend');
      }

      const data = await response.json();
      
      const predictions: PredictedCollege[] = data.predictions || [];
      const eligibleCount = predictions.length;

      return {
        student: {
          name: studentData.fullName,
          mobile: studentData.mobileNumber,
          score: studentData.score,
          category: studentData.category,
          district: studentData.district,
          gender: studentData.gender,
        },
        predictionSummary: {
          eligibleCount,
        },
        predictions: predictions,
      };
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }
}
