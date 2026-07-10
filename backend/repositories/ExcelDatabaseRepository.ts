import * as xlsx from "xlsx";
import { IDatabaseRepository } from "./IDatabaseRepository";
import { CutoffRecord } from "../models/CutoffRecord";

export class ExcelDatabaseRepository implements IDatabaseRepository {
  private cache: CutoffRecord[] = [];
  private isLoaded: boolean = false;
  
  // Hardcoded default as per user request, can be overridden by env variable
  private fileId = process.env.GOOGLE_DRIVE_FILE_ID || "1RK6tEpAA62Od4GgQYNbXFv8_ylWCBUnv";
  private downloadUrl = `https://drive.google.com/uc?export=download&id=${this.fileId}`;

  async loadData(): Promise<void> {
    console.log(`[ExcelDatabaseRepository] Starting to load workbook from Google Drive...`);
    const startTime = Date.now();

    try {
      const response = await fetch(this.downloadUrl);
      if (!response.ok) {
        throw new Error(`Failed to download workbook. HTTP Status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Parse the workbook
      const workbook = xlsx.read(buffer, { type: "buffer" });
      console.log(`[ExcelDatabaseRepository] Workbook loaded successfully in ${Date.now() - startTime}ms. Worksheets: ${workbook.SheetNames.length}`);

      const newCache: CutoffRecord[] = [];
      let duplicateSkips = 0;
      let invalidSkips = 0;

      // Ensure we treat the "DSE ALL" sheet as the master, but we'll parse all to be safe, 
      // or we can just parse the master dataset. 
      // User says: "The prediction engine should use the master dataset... Sheet 1 — DSE ALL".
      // Let's parse all worksheets but we will rely mostly on DSE ALL for predictions, or combine them?
      // Actually, "This sheet (DSE ALL) contains every institute... should be considered the master dataset. The other sheets are organized branch-wise/percent-wise". 
      // Since they contain the same data in different orders, we only strictly need to parse "DSE ALL" to prevent duplicates!
      
      const masterSheetName = workbook.SheetNames.find(n => n.trim() === "DSE ALL") || workbook.SheetNames[0];
      const sheet = workbook.Sheets[masterSheetName];
      
      // Parse as JSON with headers
      const data: any[] = xlsx.utils.sheet_to_json(sheet, { defval: "" });
      
      console.log(`[ExcelDatabaseRepository] Parsing sheet: ${masterSheetName}. Found ${data.length} raw rows.`);

      const uniqueSet = new Set<string>();

      for (const row of data) {
        // Handle subtle column name variations
        const instCode = String(row["Inst_ Code"] || row["Inst. Code"] || "").trim();
        const instName = String(row["Institute_Name"] || row["College Name"] || "").trim();
        const choiceCode = String(row["Choice_Code"] || row["Choice Code"] || "").trim();
        const courseName = String(row["Course_Name"] || row["Course Name"] || "").trim();
        const category = String(row["Category"] || "").trim();
        const percentileStr = String(row["Closing_Percentile"] || row["Closing Percentile"] || "").trim();

        // Validate missing columns
        if (!instCode || !instName || !courseName || !category || !percentileStr) {
          invalidSkips++;
          continue;
        }

        const closingPercentile = parseFloat(percentileStr);
        if (isNaN(closingPercentile)) {
          invalidSkips++;
          continue;
        }

        const recordKey = `${instCode}-${choiceCode}-${category}`;
        if (uniqueSet.has(recordKey)) {
          duplicateSkips++;
          continue;
        }
        uniqueSet.add(recordKey);

        newCache.push({
          instituteCode: instCode,
          instituteName: instName,
          choiceCode: choiceCode,
          courseName: courseName,
          category: category,
          closingPercentile: closingPercentile
        });
      }

      this.cache = newCache;
      this.isLoaded = true;
      
      console.log(`[ExcelDatabaseRepository] Load Summary:`);
      console.log(`- Total valid records cached: ${this.cache.length}`);
      console.log(`- Duplicate records skipped: ${duplicateSkips}`);
      console.log(`- Invalid rows skipped: ${invalidSkips}`);
      
    } catch (error) {
      console.error("[ExcelDatabaseRepository] Critical error during workbook loading:", error);
      throw error;
    }
  }

  async search(criteria: { category?: string; branch?: string; minPercentile?: number }): Promise<CutoffRecord[]> {
    if (!this.isLoaded) {
      await this.loadData();
    }

    return this.cache.filter((record) => {
      // Category matching (exact match)
      if (criteria.category && record.category.toUpperCase() !== criteria.category.toUpperCase()) {
        return false;
      }
      
      // Branch/Course matching (partial match for robustness)
      if (criteria.branch) {
        const query = criteria.branch.toLowerCase().trim();
        if (!record.courseName.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Percentile matching: Student percentile must be >= Closing Percentile
      if (criteria.minPercentile !== undefined && criteria.minPercentile < record.closingPercentile) {
        return false;
      }

      return true;
    });
  }

  getAllRecords(): CutoffRecord[] {
    return this.cache;
  }
}

// Singleton export
export const excelRepository = new ExcelDatabaseRepository();
