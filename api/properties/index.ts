import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readDb, writeDb } from "../storage";

const BROKER_PIN = process.env.BROKER_PIN || "4040";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    if (req.method === "GET") {
      const properties = readDb("properties.json");
      return res.status(200).json({ success: true, properties });
    }

    if (req.method === "POST") {
      const pin = req.headers["x-broker-pin"];

      if (pin !== BROKER_PIN) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const prop = req.body;
      if (!prop.name || !prop.location) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
      }

      const properties = readDb("properties.json");
      properties.push(prop);
      writeDb("properties.json", properties);

      return res.status(200).json({ success: true, property: prop });
    }

    return res.status(405).json({ success: false, error: "Method Not Allowed" });

  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
}