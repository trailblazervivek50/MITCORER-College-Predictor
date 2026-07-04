/**
 * PDF Generator Utility
 * Uses jsPDF to create a professional prediction report.
 */

import jsPDF from "jspdf";
import { PredictionResponse } from "./PredictionService";

interface PDFData {
  predictionResponse: PredictionResponse;
}

/**
 * Generates the prediction report PDF and returns it as a Blob URL.
 */
export async function generatePDF({ predictionResponse }: PDFData): Promise<string> {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // ── Header Strip ──────────────────────────────────────────────
  pdf.setFillColor(204, 0, 0); // MIT Red
  pdf.rect(0, 0, pageWidth, 28, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("MHT-CET & JEE PREDICTOR", margin, 12);

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("MIT College of Railway Engineering & Research, Barshi", margin, 19);
  pdf.text("DTE CODE – 06901 | Affiliated to PAH Solapur University", margin, 24);

  // Date on right
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  pdf.setFontSize(9);
  pdf.text(`Generated: ${dateStr}`, pageWidth - margin, 19, { align: "right" });

  // ── Report Title ──────────────────────────────────────────────
  let y = 42;
  pdf.setTextColor(17, 17, 17);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("PREDICTION REPORT", margin, y);

  // Divider
  pdf.setDrawColor(204, 0, 0);
  pdf.setLineWidth(0.8);
  pdf.line(margin, y + 3, pageWidth - margin, y + 3);
  y += 14;

  const { student, predictionSummary, topColleges } = predictionResponse;

  // ── Student Info Table ────────────────────────────────────────
  pdf.setFillColor(255, 240, 240);
  pdf.roundedRect(margin, y - 4, contentWidth, 7, 2, 2, "F");
  pdf.setTextColor(204, 0, 0);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("STUDENT INFORMATION", margin + 4, y + 1);
  y += 10;

  const fields: [string, string][] = [
    ["Full Name", student.name],
    ["Mobile Number", student.mobile],
    ["Marks / Percentile", student.marks.toString()],
    ["Category", student.category],
    ["Preferred Course", student.course],
  ];

  pdf.setFontSize(10);
  const labelWidth = 55;
  const rowHeight = 9;

  fields.forEach(([label, value], idx) => {
    const rowY = y + idx * rowHeight;
    if (idx % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(margin, rowY - 4, contentWidth, rowHeight, "F");
    }
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(80, 80, 80);
    pdf.text(`${label}:`, margin + 3, rowY);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(17, 17, 17);
    pdf.text(value, margin + labelWidth, rowY);
  });

  y += fields.length * rowHeight + 8;

  // ── Prediction Summary ────────────────────────────────────────
  pdf.setFillColor(255, 240, 240);
  pdf.roundedRect(margin, y - 4, contentWidth, 7, 2, 2, "F");
  pdf.setTextColor(204, 0, 0);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("PREDICTION SUMMARY", margin + 4, y + 1);
  y += 10;

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(80, 80, 80);
  pdf.text("Overall Admission Chance:", margin + 3, y);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(17, 17, 17);
  pdf.text(predictionSummary.overallChance, margin + 55, y);
  y += 9;

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(80, 80, 80);
  pdf.text("Total Eligible Colleges:", margin + 3, y);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(17, 17, 17);
  pdf.text(predictionSummary.eligibleCount.toString(), margin + 55, y);
  y += 14;

  // ── Prediction Table ────────────────────────────────────────
  pdf.setFillColor(255, 240, 240);
  pdf.roundedRect(margin, y - 4, contentWidth, 7, 2, 2, "F");
  pdf.setTextColor(204, 0, 0);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("TOP 10 RECOMMENDED COLLEGES", margin + 4, y + 1);
  y += 12;

  // Table header
  pdf.setFillColor(204, 0, 0);
  pdf.rect(margin, y - 4, contentWidth, 8, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.text("Rank", margin + 3, y + 1);
  pdf.text("College Name", margin + 14, y + 1);
  pdf.text("Branch", margin + 90, y + 1);
  pdf.text("Est. Cutoff", margin + 130, y + 1);
  pdf.text("Probability", margin + 155, y + 1);
  y += 8;

  topColleges.forEach((row, idx) => {
    if (y > pageHeight - 35) {
      pdf.addPage();
      y = margin;
    }
    if (idx % 2 === 0) {
      pdf.setFillColor(248, 248, 248);
      pdf.rect(margin, y - 3, contentWidth, 8, "F");
    }
    pdf.setTextColor(17, 17, 17);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text((idx + 1).toString(), margin + 3, y + 2);
    const collegeName = row.collegeName.length > 40 ? row.collegeName.substring(0, 37) + "…" : row.collegeName;
    pdf.text(collegeName, margin + 14, y + 2);
    const branch = row.branch.length > 20 ? row.branch.substring(0, 17) + "…" : row.branch;
    pdf.text(branch, margin + 90, y + 2);
    pdf.text(row.cutoff, margin + 130, y + 2);
    pdf.text(row.probability, margin + 155, y + 2);
    y += 8;
  });

  y += 10;

  // ── Footer ────────────────────────────────────────────────────
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(130, 130, 130);
    pdf.text("Generated using", margin, pageHeight - 15);
    pdf.setFont("helvetica", "bold");
    pdf.text("MHT-CET & JEE Predictor", margin, pageHeight - 11);
    pdf.setFont("helvetica", "normal");
    pdf.text("MIT College of Railway Engineering & Research", margin, pageHeight - 7);

    // QR Code Placeholder
    pdf.setDrawColor(150, 150, 150);
    pdf.rect(pageWidth - margin - 15, pageHeight - 18, 15, 15);
    pdf.setFontSize(6);
    pdf.text("QR Placeholder", pageWidth - margin - 14, pageHeight - 10);
    
    pdf.setFontSize(8);
    pdf.text(`Page ${i} / ${pageCount}`, pageWidth - margin - 25, pageHeight - 7, { align: "right" });
    pdf.text("© 2026", pageWidth - margin - 25, pageHeight - 11, { align: "right" });
  }

  // Instead of auto-saving, we return a Blob URL so the frontend can preview it.
  const blob = pdf.output("blob");
  return URL.createObjectURL(blob);
}
