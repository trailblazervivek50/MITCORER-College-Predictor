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
  // Use landscape for a wider table
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth(); // ~297mm
  const pageHeight = pdf.internal.pageSize.getHeight(); // ~210mm
  const margin = 15;
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
  y += 12;

  const { student, predictionSummary, predictions } = predictionResponse;

  // ── Student Info Table & Summary ────────────────────────────────────────
  pdf.setFillColor(255, 240, 240);
  pdf.roundedRect(margin, y - 4, contentWidth, 7, 2, 2, "F");
  pdf.setTextColor(204, 0, 0);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("STUDENT INFORMATION & PREDICTION SUMMARY", margin + 4, y + 1);
  y += 10;

  const fields: [string, string][] = [
    ["Full Name", student.name],
    ["Mobile Number", student.mobile],
    ["Marks / Percentile", student.score],
    ["Category", student.category],
    ["Eligible Colleges", predictionSummary.eligibleCount.toString()],
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

  y += fields.length * rowHeight + 10;

  // ── Prediction Table ────────────────────────────────────────
  pdf.setFillColor(255, 240, 240);
  pdf.roundedRect(margin, y - 4, contentWidth, 7, 2, 2, "F");
  pdf.setTextColor(204, 0, 0);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("ELIGIBLE COLLEGES (BASED ON CUTOFFS)", margin + 4, y + 1);
  y += 10;

  // Table header
  pdf.setFillColor(204, 0, 0);
  pdf.rect(margin, y - 4, contentWidth, 8, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  
  // Layout columns for Landscape (width = 297 - 30 = 267)
  const colSrNo = margin;
  const colCode = margin + 10;
  const colCollege = margin + 28;
  const colDistrict = margin + 100;
  const colBranch = margin + 120;
  const colQuota = margin + 175;
  const colR1 = margin + 190;
  const colR2 = margin + 205;
  const colR3 = margin + 220;
  const colR4 = margin + 235;
  const colAvg = margin + 250;

  pdf.text("Sr. No.", colSrNo, y + 1);
  pdf.text("College Code", colCode, y + 1);
  pdf.text("College Name", colCollege, y + 1);
  pdf.text("District", colDistrict, y + 1);
  pdf.text("Branch", colBranch, y + 1);
  pdf.text("Quota", colQuota, y + 1);
  pdf.text("R1", colR1, y + 1);
  pdf.text("R2", colR2, y + 1);
  pdf.text("R3", colR3, y + 1);
  pdf.text("R4", colR4, y + 1);
  pdf.text("Average", colAvg, y + 1);
  y += 8;
  
  predictions.forEach((row, idx) => {
    if (y > pageHeight - 25) {
      pdf.addPage();
      y = margin;
    }
    if (idx % 2 === 0) {
      pdf.setFillColor(248, 248, 248);
      pdf.rect(margin, y - 3, contentWidth, 8, "F");
    }
    pdf.setTextColor(17, 17, 17);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.text((idx + 1).toString(), colSrNo, y + 2);
    pdf.text(row.collegeCode || "N/A", colCode, y + 2);
    
    // Truncate strings
    const collegeName = row.collegeName.length > 50 ? row.collegeName.substring(0, 47) + "…" : row.collegeName;
    const branch = row.branch.length > 40 ? row.branch.substring(0, 37) + "…" : row.branch;
    
    pdf.text(collegeName, colCollege, y + 2);
    pdf.text(row.district, colDistrict, y + 2);
    pdf.text(branch, colBranch, y + 2);
    pdf.text(row.quota, colQuota, y + 2);
    pdf.text(row.r1 || "-", colR1, y + 2);
    pdf.text(row.r2 || "-", colR2, y + 2);
    pdf.text(row.r3 || "-", colR3, y + 2);
    pdf.text(row.r4 || "-", colR4, y + 2);
    pdf.setFont("helvetica", "bold");
    pdf.text(row.average || "-", colAvg, y + 2);
    y += 8;
  });

  y += 10;

  // ── Footer ────────────────────────────────────────────────────
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(130, 130, 130);
    pdf.text("Generated using MHT-CET & JEE Predictor | MIT College of Railway Engineering & Research", margin, pageHeight - 10);
    pdf.text(`Page ${i} / ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: "right" });
  }

  // Instead of auto-saving, we return a Blob URL so the frontend can preview it.
  const blob = pdf.output("blob");
  return URL.createObjectURL(blob);
}
