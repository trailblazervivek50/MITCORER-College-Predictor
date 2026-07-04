"use client";

import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import StudentForm from "@/components/StudentForm";
import { PredictionService, StudentData, PredictedCollege } from "@/lib/PredictionService";
import { generatePDF } from "@/lib/pdf-generator";
import { motion } from "framer-motion";
import { Download, Share2, CheckCircle, RefreshCcw } from "lucide-react";

export default function HomePage() {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [predictedColleges, setPredictedColleges] = useState<PredictedCollege[] | null>(null);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);

  useEffect(() => {
    // Check localStorage on mount for pending predictions
    const pending = localStorage.getItem("predictionPending");
    const storedData = localStorage.getItem("studentData");

    if (pending === "true" && storedData) {
      try {
        const parsedData = JSON.parse(storedData) as StudentData;
        setStudentData(parsedData);
        setIsLoadingPredictions(true);
        
        // Clear flag so we don't refetch on every reload unnecessarily
        localStorage.removeItem("predictionPending");

        PredictionService.fetchPredictions(parsedData).then((colleges) => {
          setPredictedColleges(colleges);
          setIsLoadingPredictions(false);
          // Scroll to results
          setTimeout(() => {
            document.getElementById("prediction-results")?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        });
      } catch (e) {
        console.error("Failed to parse stored student data", e);
        setIsLoadingPredictions(false);
      }
    }
  }, []);

  const handleGeneratePDF = async () => {
    if (studentData && predictedColleges) {
      await generatePDF({ studentData, predictedColleges });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My MHT-CET & JEE Prediction Report",
          text: `Check out my top predicted colleges from the MITCORER Predictor!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing", error);
      }
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  const handleReset = () => {
    localStorage.removeItem("studentData");
    setStudentData(null);
    setPredictedColleges(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Loading State for Predictions */}
      {isLoadingPredictions && (
        <section className="flex flex-col items-center justify-center py-20" style={{ minHeight: "400px" }}>
          <RefreshCcw size={48} className="animate-spin text-[var(--mit-red)] mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Fetching Predictions...</h3>
          <p className="text-[var(--gray-600)]">Retrieving your predicted colleges from the service.</p>
        </section>
      )}

      {/* Prediction Results Section */}
      {!isLoadingPredictions && predictedColleges && studentData && (
        <section id="prediction-results" className="py-16 px-5" style={{ backgroundColor: "var(--gray-100)" }}>
          <div className="max-w-[1000px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-[var(--gray-200)] p-8 md:p-10"
            >
              <div className="flex flex-col items-center text-center mb-10">
                <CheckCircle size={56} color="var(--mit-red)" strokeWidth={1.5} className="mb-4" />
                <h2 className="text-3xl font-bold mb-2">Prediction Successful!</h2>
                <p className="text-[var(--gray-600)] text-lg">
                  We have automatically retrieved your predicted colleges based on your profile.
                </p>
              </div>

              {/* Student Summary */}
              <div className="bg-[var(--gray-100)] rounded-xl p-6 mb-8 flex flex-wrap gap-6 justify-between">
                <div>
                  <div className="text-sm text-[var(--gray-500)] mb-1">Name</div>
                  <div className="font-semibold text-lg">{studentData.fullName}</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--gray-500)] mb-1">Score / Percentile</div>
                  <div className="font-semibold text-lg">{studentData.marksPercentile}</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--gray-500)] mb-1">Category</div>
                  <div className="font-semibold text-lg">{studentData.category}</div>
                </div>
                <div>
                  <div className="text-sm text-[var(--gray-500)] mb-1">Preferred Course</div>
                  <div className="font-semibold text-lg">{studentData.preferredCourse}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 border-t border-[var(--gray-200)] pt-8">
                <button
                  onClick={handleGeneratePDF}
                  className="btn btn-primary flex items-center justify-center gap-2"
                  style={{ fontSize: "16px", padding: "14px 32px" }}
                >
                  <Download size={20} />
                  Download Professional PDF
                </button>
                <button
                  onClick={handleShare}
                  className="btn btn-secondary flex items-center justify-center gap-2"
                  style={{ fontSize: "16px", padding: "14px 32px" }}
                >
                  <Share2 size={20} />
                  Share Results
                </button>
              </div>
              <div className="flex justify-center mt-6">
                 <button onClick={handleReset} className="text-[var(--gray-500)] hover:text-[var(--mit-red)] transition-colors underline text-sm">
                   Start a new prediction
                 </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Student Form (only show if we don't have results yet) */}
      {!isLoadingPredictions && !predictedColleges && (
        <StudentForm />
      )}
    </>
  );
}
