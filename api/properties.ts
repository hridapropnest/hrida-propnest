import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "./firebaseAdmin";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const snapshot = await db.collection("properties").get();

  const properties = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  res.json({
    success: true,
    properties,
  });
}