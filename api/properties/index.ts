import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../firebaseAdmin";
import { randomUUID } from "crypto";

const BROKER_PIN = process.env.BROKER_PIN!;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // ===========================
    // GET ALL PROPERTIES
    // ===========================
    if (req.method === "GET") {
      const snapshot = await db.collection("properties").get();

      const properties = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json({
        success: true,
        properties,
      });
    }

    // ===========================
    // ADD PROPERTY
    // ===========================
    if (req.method === "POST") {
      const pin = req.headers["x-broker-pin"];

      if (pin !== BROKER_PIN) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const {
        name,
        priceText,
        priceNumerical,
        purpose,
        sqft,
        beds,
        baths,
        location,
        image,
        tagline,
        description,
        highlights,
      } = req.body;

      if (!name || !priceText || !location) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
        });
      }

      const id = randomUUID();

      const property = {
        id,
        name,
        priceText,
        priceNumerical: Number(priceNumerical) || 0,
        purpose: purpose === "rent" ? "rent" : "buy",
        sqft: Number(sqft) || 0,
        beds: Number(beds) || 1,
        baths: Number(baths) || 1,
        location,
        image:
          image ||
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
        tagline: tagline || "",
        description: description || "",
        highlights: Array.isArray(highlights) ? highlights : [],
        createdAt: Date.now(),
      };

      await db.collection("properties").doc(id).set(property);

      return res.status(200).json({
        success: true,
        property,
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