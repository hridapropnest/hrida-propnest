import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "crypto";
import { readDb, writeDb } from "../storage";

const BROKER_PIN = process.env.BROKER_PIN || "4040";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    if (req.method === "GET") {
      const pin = req.headers["x-broker-pin"];

      if (pin !== BROKER_PIN) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const leads = readDb("leads.json").reverse();

      return res.status(200).json({ success: true, leads });
    }

    if (req.method === "POST") {
      const { name, email, phone, budget, propertyInterest, message } = req.body;

      if (!name || !email) {
        return res.status(400).json({ success: false, error: "Name and Email are required." });
      }

      const lead = {
        id: randomUUID(),
        name,
        email,
        phone: phone || "",
        budget: budget || "",
        propertyInterest: propertyInterest || "",
        message: message || "",
        createdAt: Date.now(),
      };

      const leads = readDb("leads.json");
      leads.push(lead);
      writeDb("leads.json", leads);

      return res.status(200).json({ success: true, lead });
    }

    return res.status(405).json({ success: false, error: "Method Not Allowed" });

  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
}