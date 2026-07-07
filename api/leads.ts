import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "./firebaseAdmin";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST")
    return res.status(405).end();

  await db.collection("leads").add(req.body);

  res.json({
    success: true,
  });
}