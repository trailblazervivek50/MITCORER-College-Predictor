export interface PredictedCollege {
  id?: string;
  name: string;
  district: string;
  university: string;
  branch: string;
  quota: string;
  round1: string;
  round2: string;
  round3: string;
  round4: string;
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
    marks: number;
    category: string;
    mobile: string;
  };
  predictionSummary: {
    overallChance: string;
    eligibleCount: number;
  };
  topColleges: PredictedCollege[];
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
        throw new Error('Failed to fetch predictions');
      }

      const data = await response.json();
      
      const colleges: PredictedCollege[] = data.colleges || [];

      // Calculate a pseudo "overallChance" based on count of results for now
      const eligibleCount = colleges.length;
      let overallChance = "Low";
      if (eligibleCount > 50) overallChance = "Very High";
      else if (eligibleCount > 20) overallChance = "High";
      else if (eligibleCount > 5) overallChance = "Medium";

      return {
        student: {
          name: studentData.fullName,
          marks: parseFloat(studentData.score) || 0,
          category: studentData.category,
          mobile: studentData.mobileNumber,
        },
        predictionSummary: {
          overallChance,
          eligibleCount,
        },
        topColleges: colleges,
      };
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }
}
