import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../firebaseAdmin";

const BROKER_PIN = process.env.BROKER_PIN!;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const pin = req.headers["x-broker-pin"];

    if (pin !== BROKER_PIN) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        error: "Missing property id",
      });
    }

    // ==========================
    // DELETE PROPERTY
    // ==========================
    if (req.method === "DELETE") {
      await db.collection("properties").doc(id).delete();

      return res.status(200).json({
        success: true,
        message: "Property deleted successfully",
      });
    }

    // ==========================
    // UPDATE PROPERTY
    // ==========================
    if (req.method === "PUT") {
      const updates = req.body;

      await db.collection("properties").doc(id).update({
        ...updates,
        updatedAt: Date.now(),
      });

      return res.status(200).json({
        success: true,
        message: "Property updated successfully",
      });
    }

    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  } catch (err: any) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}