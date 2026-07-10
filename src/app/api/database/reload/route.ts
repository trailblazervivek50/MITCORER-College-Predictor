import { excelRepository } from "../../../../../backend/repositories/ExcelDatabaseRepository";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await excelRepository.loadData();
    const stats = {
      status: "success",
      message: "Database reloaded from Google Drive.",
      totalRecords: excelRepository.getAllRecords().length,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(stats, { status: 200 });
  } catch (error: any) {
    console.error("Error reloading database:", error);
    return NextResponse.json({ error: "Failed to reload database", details: error.message }, { status: 500 });
  }
}
