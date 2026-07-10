import { predictionService, PredictionRequestDTO } from "../services/PredictionService";
import { NextResponse } from "next/server";

export async function handlePredictRequest(req: Request) {
  try {
    const body: PredictionRequestDTO = await req.json();

    // Basic validation
    if (!body || !body.score || !body.category) {
      return NextResponse.json({ error: "Missing required fields: score, category" }, { status: 400 });
    }

    const result = await predictionService.predict(body);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[predictController] Error processing prediction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
