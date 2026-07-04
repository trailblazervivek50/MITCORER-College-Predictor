"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import StudentForm, { FormData as StudentFormData } from "@/components/StudentForm";
import { PredictionService, PredictionResponse } from "@/lib/PredictionService";
import { generatePDF } from "@/lib/pdf-generator";
import { motion } from "framer-motion";
import { Download, Share2, RefreshCcw, FileText } from "lucide-react";

export default function HomePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionResponse, setPredictionResponse] = useState<PredictionResponse | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  const handleFormSubmit = async (data: StudentFormData) => {
    // 1. Show loading screen immediately
    setIsAnalyzing(true);
    setPredictionResponse(null);
    setPdfBlobUrl(null);

    // Scroll to the loading area smoothly
    setTimeout(() => {
      document.getElementById("analysis-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    try {
      // 2. Call Prediction Service
      const response = await PredictionService.predict({
        fullName: data.fullName,
        mobileNumber: data.mobileNumber,
        exam_type: data.exam_type,
        pred_mode: data.pred_mode,
        score: data.score,
        gender: data.gender,
        district: data.district,
        category: data.category,
        ews: data.ews,
        tfws: data.tfws,
        branch: data.branch,
      });

      setPredictionResponse(response);

      // 3. Automatically generate PDF
      const url = await generatePDF({ predictionResponse: response });
      setPdfBlobUrl(url);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Something went wrong during prediction. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlobUrl || !predictionResponse) return;
    
    // Create an invisible anchor tag to trigger the download
    const a = document.createElement("a");
    a.href = pdfBlobUrl;
    a.download = `Prediction_Report_${predictionResponse.student.name.replace(/\s+/g, "_")}_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My MHT-CET & JEE Prediction Report",
          text: `Check out my top predicted colleges from the MITCORER Predictor!`,
          url: window.location.href, // If we had a hosted PDF, we'd link it. Fallback to app URL.
        });
      } catch (error) {
        console.log("Error sharing", error);
      }
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  const handleReset = () => {
    setPredictionResponse(null);
    setPdfBlobUrl(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Analysis Loading State */}
      {isAnalyzing && (
        <section id="analysis-section" className="flex flex-col items-center justify-center py-20 bg-[var(--gray-50)]" style={{ minHeight: "400px" }}>
          <RefreshCcw size={48} className="animate-spin text-[var(--mit-red)] mb-6" />
          <h3 className="text-2xl font-bold mb-3">Analyzing your profile...</h3>
          <p className="text-[var(--gray-600)] text-lg max-w-md text-center">
            Finding the best colleges based on your marks, category, and preferred course.
            Please wait...
          </p>
        </section>
      )}

      {/* PDF Preview Section */}
      {!isAnalyzing && pdfBlobUrl && predictionResponse && (
        <section id="analysis-section" className="py-16 px-5" style={{ backgroundColor: "var(--gray-100)" }}>
          <div className="max-w-[900px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl border border-[var(--gray-200)] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[var(--mit-red)] text-white p-6 text-center">
                <FileText size={40} className="mx-auto mb-3 opacity-90" />
                <h2 className="text-2xl font-bold">Your Prediction Report is Ready</h2>
                <p className="opacity-90 mt-1">Review your automatically generated PDF below.</p>
              </div>

              {/* PDF Viewer */}
              <div className="w-full bg-[var(--gray-200)] flex justify-center items-center" style={{ height: "600px" }}>
                <iframe 
                  src={`${pdfBlobUrl}#toolbar=0`} 
                  className="w-full h-full border-none shadow-inner"
                  title="PDF Preview"
                />
              </div>

              {/* Action Buttons */}
              <div className="p-8">
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                  <button
                    onClick={handleDownload}
                    className="btn btn-primary flex items-center justify-center gap-2"
                    style={{ fontSize: "16px", padding: "14px 32px" }}
                  >
                    <Download size={20} />
                    Download PDF
                  </button>
                  <button
                    onClick={handleShare}
                    className="btn btn-secondary flex items-center justify-center gap-2"
                    style={{ fontSize: "16px", padding: "14px 32px" }}
                  >
                    <Share2 size={20} />
                    Share PDF
                  </button>
                </div>
                <div className="flex justify-center border-t border-[var(--gray-100)] pt-6">
                   <button onClick={handleReset} className="text-[var(--gray-500)] hover:text-[var(--mit-red)] transition-colors underline text-sm font-medium">
                     Generate Another Prediction
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Student Form (only show if not analyzing and no results) */}
      {!isAnalyzing && !pdfBlobUrl && (
        <StudentForm onSubmitDetails={handleFormSubmit} />
      )}
    </>
  );
}
