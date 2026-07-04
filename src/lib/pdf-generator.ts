/**
 * PDF Generator Utility
 * Uses jsPDF to create a professional prediction report.
 */

import jsPDF from "jspdf";
import { PredictedCollege, StudentData } from "./PredictionService";

interface PDFData {
  studentData: StudentData;
  predictedColleges: PredictedCollege[];
}

export async function generatePDF({ studentData, predictedColleges }: PDFData): Promise<void> {
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

  // ── Student Info Table ────────────────────────────────────────
  if (studentData) {
    // Section label
    pdf.setFillColor(255, 240, 240);
    pdf.roundedRect(margin, y - 4, contentWidth, 7, 2, 2, "F");
    pdf.setTextColor(204, 0, 0);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text("STUDENT DETAILS", margin + 4, y + 1);
    y += 10;

    const fields: [string, string][] = [
      ["Full Name", studentData.fullName],
      ["Marks / Percentile", studentData.marksPercentile],
      ["Category", studentData.category],
      ["Preferred Course", studentData.preferredCourse],
      ["College Preference", studentData.collegePreference || "Not specified"],
      ["Mobile Number", studentData.mobileNumber],
    ];

    pdf.setFontSize(10);
    const labelWidth = 55;
    const rowHeight = 9;

    fields.forEach(([label, value], idx) => {
      const rowY = y + idx * rowHeight;
      // Alternate row background
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

    y += fields.length * rowHeight + 14;
  }

  // ── Prediction Table ────────────────────────────────────────
  pdf.setFillColor(255, 240, 240);
  pdf.roundedRect(margin, y - 4, contentWidth, 7, 2, 2, "F");
  pdf.setTextColor(204, 0, 0);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("TOP PREDICTED COLLEGES", margin + 4, y + 1);
  y += 12;

  // Table header
  pdf.setFillColor(204, 0, 0);
  pdf.rect(margin, y - 4, contentWidth, 8, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.text("#", margin + 3, y + 1);
  pdf.text("College Name", margin + 12, y + 1);
  pdf.text("Branch", margin + 100, y + 1);
  pdf.text("Cutoff %", margin + 135, y + 1);
  pdf.text("Probability", margin + 155, y + 1);
  y += 8;

  predictedColleges.forEach((row, idx) => {
    if (y > pageHeight - 30) {
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
    const collegeName = row.name.length > 48 ? row.name.substring(0, 45) + "…" : row.name;
    pdf.text(collegeName, margin + 12, y + 2);
    const branch = row.branch.length > 20 ? row.branch.substring(0, 17) + "…" : row.branch;
    pdf.text(branch, margin + 100, y + 2);
    pdf.text(row.cutoff, margin + 135, y + 2);
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
    pdf.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(130, 130, 130);
    pdf.text("© 2026 MHT-CET & JEE Predictor | MIT CORER Barshi | All Rights Reserved", margin, pageHeight - 9);
    pdf.text(`Page ${i} / ${pageCount}`, pageWidth - margin, pageHeight - 9, { align: "right" });
  }

  // ── Save ──────────────────────────────────────────────────────
  const filename = `Prediction_Report_${(studentData?.fullName || "Student").replace(/\s+/g, "_")}_${Date.now()}.pdf`;
  pdf.save(filename);
}
