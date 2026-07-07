import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../firebaseAdmin";
import { randomUUID } from "crypto";

const BROKER_PIN = process.env.BROKER_PIN!;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {

    // ============================
    // GET ALL LEADS (ADMIN)
    // ============================
    if (req.method === "GET") {

      const pin = req.headers["x-broker-pin"];

      if (pin !== BROKER_PIN) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const snapshot = await db
        .collection("leads")
        .orderBy("createdAt", "desc")
        .get();

      const leads = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json({
        success: true,
        leads,
      });
    }

    // ============================
    // CREATE LEAD
    // ============================
    if (req.method === "POST") {

      const {
        name,
        email,
        phone,
        budget,
        propertyInterest,
        message,
      } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          error: "Name and Email are required.",
        });
      }

      const id = randomUUID();

      const lead = {
        id,
        name,
        email,
        phone: phone || "",
        budget: budget || "",
        propertyInterest: propertyInterest || "",
        message: message || "",
        createdAt: Date.now(),
      };

      await db.collection("leads").doc(id).set(lead);

      return res.status(200).json({
        success: true,
        lead,
      });
    }

    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });

  } catch (err: any) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });

  }
}