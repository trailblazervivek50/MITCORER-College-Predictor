import { handlePredictRequest } from "../../../../backend/controllers/predictController";

export async function POST(req: Request) {
  return handlePredictRequest(req);
}
