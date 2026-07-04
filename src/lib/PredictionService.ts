export interface PredictedCollege {
  collegeName: string;
  branch: string;
  cutoff: string;
  probability: string;
}

export interface StudentData {
  fullName: string;
  marksPercentile: string;
  category: string;
  preferredCourse: string;
  collegePreference?: string;
  mobileNumber: string;
}

export interface PredictionResponse {
  student: {
    name: string;
    marks: number;
    category: string;
    course: string;
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
 * This service mocks a backend prediction endpoint.
 * In the future, this should make a POST request to /api/predict-colleges
 */
export class PredictionService {
  static async predict(studentData: StudentData): Promise<PredictionResponse> {
    // Simulate network delay for backend processing
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const baseScore = parseFloat(studentData.marksPercentile) || 90;
    const branch = studentData.preferredCourse || "Engineering";

    // Generate 10 mock colleges
    const colleges: PredictedCollege[] = [
      {
        collegeName: "College of Engineering, Pune (COEP)",
        branch,
        cutoff: Math.max(0, baseScore - 5).toFixed(2),
        probability: "Low",
      },
      {
        collegeName: "VJTI, Mumbai",
        branch,
        cutoff: Math.max(0, baseScore - 4.5).toFixed(2),
        probability: "Low",
      },
      {
        collegeName: "Pune Institute of Computer Technology (PICT)",
        branch,
        cutoff: Math.max(0, baseScore - 3).toFixed(2),
        probability: "Medium",
      },
      {
        collegeName: "Vishwakarma Institute of Technology (VIT), Pune",
        branch,
        cutoff: Math.max(0, baseScore - 2).toFixed(2),
        probability: "Medium",
      },
      {
        collegeName: "MIT College of Railway Engineering & Research, Barshi",
        branch,
        cutoff: Math.max(0, baseScore + 1).toFixed(2),
        probability: "High",
      },
      {
        collegeName: "Pimpri Chinchwad College of Engineering (PCCOE)",
        branch,
        cutoff: Math.max(0, baseScore + 2).toFixed(2),
        probability: "High",
      },
      {
        collegeName: "Walchand College of Engineering, Sangli",
        branch,
        cutoff: Math.max(0, baseScore - 1).toFixed(2),
        probability: "Medium",
      },
      {
        collegeName: "Sardar Patel Institute of Technology (SPIT), Mumbai",
        branch,
        cutoff: Math.max(0, baseScore - 3.5).toFixed(2),
        probability: "Low",
      },
      {
        collegeName: "Ramrao Adik Institute of Technology (RAIT), Navi Mumbai",
        branch,
        cutoff: Math.max(0, baseScore + 3).toFixed(2),
        probability: "High",
      },
      {
        collegeName: "Government College of Engineering, Aurangabad",
        branch,
        cutoff: Math.max(0, baseScore + 0.5).toFixed(2),
        probability: "High",
      },
    ];

    // Sort by cutoff descending (closest to score first)
    colleges.sort((a, b) => parseFloat(b.cutoff) - parseFloat(a.cutoff));

    const overallChance = baseScore > 90 ? "Very High" : baseScore > 75 ? "High" : baseScore > 60 ? "Medium" : "Low";

    return {
      student: {
        name: studentData.fullName,
        marks: baseScore,
        category: studentData.category,
        course: studentData.preferredCourse,
        mobile: studentData.mobileNumber,
      },
      predictionSummary: {
        overallChance,
        eligibleCount: colleges.length,
      },
      topColleges: colleges,
    };
  }
}
