import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "./firebaseAdmin";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST")
    return res.status(405).end();

  const pin = req.headers["x-broker-pin"];

  if (pin !== process.env.BROKER_PIN)
    return res.status(401).json({
      success: false,
    });

  const properties = req.body.properties;

  const batch = db.batch();

  properties.forEach((property: any) => {
    const ref = db.collection("properties").doc(property.id);
    batch.set(ref, property);
  });

  await batch.commit();

  res.json({
    success: true,
  });
}