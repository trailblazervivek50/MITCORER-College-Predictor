export interface PredictedCollege {
  id: string;
  name: string;
  branch: string;
  cutoff: string;
  probability: string;
  category: string;
}

export interface StudentData {
  fullName: string;
  marksPercentile: string;
  category: string;
  preferredCourse: string;
  collegePreference?: string;
  mobileNumber: string;
}

/**
 * PredictionService
 *
 * This service acts as an abstraction layer for the prediction logic.
 * Currently, since direct API integration with Eduvale is not available,
 * this returns mock top 10 colleges based on the student's input.
 *
 * In the future, replace the contents of fetchPredictions with an actual
 * API call to the backend.
 */
export class PredictionService {
  static async fetchPredictions(studentData: StudentData): Promise<PredictedCollege[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Base mock data for prediction
    const baseScore = parseFloat(studentData.marksPercentile) || 90;
    const branch = studentData.preferredCourse || "Engineering";
    const category = studentData.category || "General (Open)";

    // Generate 10 mock colleges
    const colleges: PredictedCollege[] = [
      {
        id: "c1",
        name: "College of Engineering, Pune (COEP)",
        branch,
        cutoff: Math.max(0, baseScore - 5).toFixed(2),
        probability: "Low",
        category,
      },
      {
        id: "c2",
        name: "VJTI, Mumbai",
        branch,
        cutoff: Math.max(0, baseScore - 4.5).toFixed(2),
        probability: "Low",
        category,
      },
      {
        id: "c3",
        name: "Pune Institute of Computer Technology (PICT)",
        branch,
        cutoff: Math.max(0, baseScore - 3).toFixed(2),
        probability: "Medium",
        category,
      },
      {
        id: "c4",
        name: "Vishwakarma Institute of Technology (VIT), Pune",
        branch,
        cutoff: Math.max(0, baseScore - 2).toFixed(2),
        probability: "Medium",
        category,
      },
      {
        id: "c5",
        name: "MIT College of Railway Engineering & Research, Barshi",
        branch,
        cutoff: Math.max(0, baseScore + 1).toFixed(2),
        probability: "High",
        category,
      },
      {
        id: "c6",
        name: "Pimpri Chinchwad College of Engineering (PCCOE)",
        branch,
        cutoff: Math.max(0, baseScore + 2).toFixed(2),
        probability: "High",
        category,
      },
      {
        id: "c7",
        name: "Walchand College of Engineering, Sangli",
        branch,
        cutoff: Math.max(0, baseScore - 1).toFixed(2),
        probability: "Medium",
        category,
      },
      {
        id: "c8",
        name: "Sardar Patel Institute of Technology (SPIT), Mumbai",
        branch,
        cutoff: Math.max(0, baseScore - 3.5).toFixed(2),
        probability: "Low",
        category,
      },
      {
        id: "c9",
        name: "Ramrao Adik Institute of Technology (RAIT), Navi Mumbai",
        branch,
        cutoff: Math.max(0, baseScore + 3).toFixed(2),
        probability: "High",
        category,
      },
      {
        id: "c10",
        name: "Government College of Engineering, Aurangabad",
        branch,
        cutoff: Math.max(0, baseScore + 0.5).toFixed(2),
        probability: "High",
        category,
      },
    ];

    // Sort by cutoff descending (closest to score first)
    return colleges.sort((a, b) => parseFloat(b.cutoff) - parseFloat(a.cutoff));
  }
}
