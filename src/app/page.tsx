"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import StudentForm, { FormData as StudentFormData } from "@/components/StudentForm";
import { PredictionService, PredictionResponse } from "@/lib/PredictionService";
import { generatePDF } from "@/lib/pdf-generator";
import { motion } from "framer-motion";
import { Download, Share2, RefreshCcw, FileText, AlertCircle } from "lucide-react";

export default function HomePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionResponse, setPredictionResponse] = useState<PredictionResponse | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFormSubmit = async (data: StudentFormData) => {
    // 1. Show loading screen immediately
    setIsAnalyzing(true);
    setPredictionResponse(null);
    setPdfBlobUrl(null);
    setErrorMsg(null);

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

      // 3. Handle 0 colleges
      if (!response.predictions || response.predictions.length === 0) {
        setErrorMsg("Prediction data could not be fetched or no eligible colleges found. Please try again.");
        return; // Do NOT generate empty PDF
      }

      setPredictionResponse(response);

      // 4. Automatically generate PDF
      const url = await generatePDF({ predictionResponse: response });
      setPdfBlobUrl(url);
    } catch (error) {
      console.error("Prediction error:", error);
      setErrorMsg("An error occurred while fetching predictions. Please try again.");
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
    setErrorMsg(null);
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

      {/* Error State */}
      {!isAnalyzing && errorMsg && (
        <section id="analysis-section" className="py-16 px-5" style={{ backgroundColor: "var(--gray-100)" }}>
          <div className="max-w-[700px] mx-auto text-center bg-white p-10 rounded-2xl shadow-md border border-[var(--gray-200)]">
             <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
             <h3 className="text-xl font-bold mb-2">Oops! Something went wrong</h3>
             <p className="text-[var(--gray-600)] mb-6">{errorMsg}</p>
             <button onClick={handleReset} className="btn btn-primary" style={{ padding: "10px 24px" }}>
               Go Back & Try Again
             </button>
          </div>
        </section>
      )}

      {/* PDF Preview Section */}
      {!isAnalyzing && pdfBlobUrl && predictionResponse && (
        <section id="analysis-section" className="py-16 px-5" style={{ backgroundColor: "var(--gray-100)" }}>
          <div className="max-w-[1000px] mx-auto">
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
                <p className="opacity-90 mt-1">Review your automatically generated PDF below. We found {predictionResponse.predictionSummary.eligibleCount} eligible colleges.</p>
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

      {/* Student Form (only show if not analyzing and no results/errors) */}
      {!isAnalyzing && !pdfBlobUrl && !errorMsg && (
        <StudentForm onSubmitDetails={handleFormSubmit} />
      )}
    </>
  );
}
