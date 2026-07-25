import type { VercelRequest, VercelResponse } from "@vercel/node";
import { writeDb } from "../storage";

const BROKER_PIN = process.env.BROKER_PIN || "4040";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    if (req.method === "POST") {
      const pin = req.headers["x-broker-pin"];

      if (pin !== BROKER_PIN) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const { properties } = req.body;
      if (!properties || !Array.isArray(properties)) {
        return res.status(400).json({ success: false, error: "Invalid properties array" });
      }

      writeDb("properties.json", properties);
      return res.status(200).json({ success: true, count: properties.length });
    }

    return res.status(405).json({ success: false, error: "Method Not Allowed" });

  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
