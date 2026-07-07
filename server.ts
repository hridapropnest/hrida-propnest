import express from "express";
import { db } from "./server/firebaseAdmin";
console.log("Firebase Connected");
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import crypto from "crypto";

// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory lead storage for demonstration / lead dashboard
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  budget: string;
  propertyInterest: string;
  message: string;
  createdAt: string;
}

const leads: Lead[] = [];

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// API: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!apiKey });
});

app.get("/api/firebase-test", async (req, res) => {
  try {
    const snapshot = await db.collection("properties").get();

    res.json({
      success: true,
      count: snapshot.size,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
    });
  }
});

// In-memory property database on server side
interface Property {
  id: string;
  name: string;
  priceText: string;
  priceNumerical: number;
  purpose: "buy" | "rent";
  sqft: number;
  beds: number;
  baths: number;
  location: string;
  image: string;
  tagline: string;
  description: string;
  highlights: string[];
}

// API: Get properties
app.get("/api/properties", async (req, res) => {
  try {
    const snapshot = await db.collection("properties").get();

    const properties = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      properties,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch properties.",
    });
  }
});

// // API: Sync properties (overwrite entire list)
// app.post("/api/properties/sync", (req, res) => {
//   const pin = req.headers["x-broker-pin"];
//   const BROKER_PIN = process.env.BROKER_PIN;

// if (pin !== BROKER_PIN) {
//     return res.status(401).json({
//       success: false,
//       error: "Unauthorized access. Valid PIN required.",
//     });
//   }
//   const { properties } = req.body;
//   if (Array.isArray(properties)) {
//     serverProperties = properties;
//   }
//   res.json({ success: true, properties: serverProperties });
// });

// API: Add a new property
app.post("/api/properties", async (req, res) => {
  const pin = req.headers["x-broker-pin"];
const BROKER_PIN = process.env.BROKER_PIN;

if (pin !== BROKER_PIN) {
  return res.status(401).json({
    success: false,
    error: "Unauthorized access. Valid PIN required.",
  });
}

  const { name, priceText, priceNumerical, purpose, sqft, beds, baths, location, image, tagline, description, highlights } = req.body;

  if (!name || !location || !priceText) {
    return res.status(400).json({ error: "Name, Location, and Price Text are required properties." });
  }

  const newProperty: Property = {
    

id: crypto.randomUUID(),
    name,
    priceText,
    priceNumerical: Number(priceNumerical) || 0,
    purpose: purpose === "rent" ? "rent" : "buy",
    sqft: Number(sqft) || 0,
    beds: Number(beds) || 1,
    baths: Number(baths) || 1,
    location,
    image: image || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    tagline: tagline || "Curated bespoke residence",
    description: description || "Exquisite architectural mastery in a prestigious locality.",
    highlights: Array.isArray(highlights) ? highlights : [],
  };

  await db
  .collection("properties")
  .doc(newProperty.id)
  .set(newProperty);

console.log("New Property Added:", newProperty);

res.json({
  success: true,
  property: newProperty,
});
});
// API: Delete a property
app.delete("/api/properties/:id", async (req, res) => {
  const pin = req.headers["x-broker-pin"];
  const BROKER_PIN = process.env.BROKER_PIN;

if (pin !== BROKER_PIN) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized access. Valid PIN required.",
    });
  }

  const { id } = req.params;

await db.collection("properties").doc(id).delete();

res.json({
  success: true,
});
});

// API: Submit lead
app.post("/api/leads", (req, res) => {
  const { name, email, phone, budget, propertyInterest, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and Email are required." });
  }

  const newLead: Lead = {

id: crypto.randomUUID(),
    name,
    email,
    phone: phone || "Not provided",
    budget: budget || "Flexible",
    propertyInterest: propertyInterest || "General Inquiry",
    message: message || "Interested in learning more about Hrida Propnest luxury properties.",
    createdAt: new Date().toISOString(),
  };

  leads.push(newLead);
  console.log("New Lead Received:", newLead);

  res.json({
    success: true,
    message: "Namaste! Your inquiry has been logged. One of our elite Mumbai portfolio partners will connect with you shortly.",
    leadId: newLead.id,
  });
});

// API: Get leads (primarily for the dashboard view to verify lead generation works)
app.get("/api/leads", (req, res) => {
  const pin = req.headers["x-broker-pin"];
  const BROKER_PIN = process.env.BROKER_PIN;

if (pin !== BROKER_PIN) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized access to Hrida Propnest lead desk. Please supply the valid security passcode PIN.",
    });
  }
  res.json({ success: true, leads });
});

// API: Chat helper powered by Gemini
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  if (!ai) {
    // Elegant fallback simulation when Gemini API Key is not supplied
    return res.json({
      text: "Namaste! I am Elena, your Hrida Propnest real estate assistant. (Note: Running in demo mode without API key).\n\n" +
        "I'd love to help you explore our exclusive luxury collection across Mumbai, Thane, and Navi Mumbai:\n" +
        "• *Lodha Altamount Penthouse* (₹ 85 Cr, Altamount Road, Mumbai)\n" +
        "• *Hiranandani Eagle's Nest* (₹ 18 Cr, Thane)\n" +
        "• *Amara Palm Beach Sky-Villa* (₹ 24 Cr, Navi Mumbai)\n\n" +
        "Which of these prestigious residences can I tell you more about, or would you like to schedule a private tour?",
    });
  }

  try {
    const systemInstruction = `You are Elena, the elite real estate AI concierge for Hrida Propnest, a premier high-end luxury real estate brokerage. You are professional, warm, and highly knowledgeable about Mumbai, Thane, and Navi Mumbai's most prestigious luxury areas (such as Altamount Road, Bandra West, Worli Sea Face, Hiranandani Estate in Thane, and Palm Beach Road in Navi Mumbai).
Your primary focus is capturing high-quality leads for our human partners by keeping the user engaged and asking for their preferences.

Our exclusive featured listings:
1. "Lodha Altamount Penthouse" in Altamount Road, Mumbai - ₹ 85 Crores, 8,500 sq ft, 5 bedrooms, spectacular ocean views, temperature-controlled pool, premium butler service.
2. "Amara Palm Beach Sky-Villa" in Palm Beach Road, Navi Mumbai - ₹ 24 Crores, 6,500 sq ft, 4 bedrooms, tropical creek-front view, basalt reflection pool, private garden.
3. "Hiranandani Eagle's Nest Penthouse" in Hiranandani Estate, Thane - ₹ 18 Crores, 7,200 sq ft, 5 bedrooms, triplex luxury, Yeoor Hills panoramic vistas, double-height lounge.

Guidance:
- Capture contact information (Name, Email, Phone, and Budget) in a warm, conversational manner when the user expresses serious interest.
- If they ask about scheduling or booking a tour, offer to help them and mention we will have a representative contact them immediately.
- Use markdown beautifully (bullet points, bold highlights) to make reading delightful.
- Speak in a refined luxury broker tone: welcoming, prestigious, and knowledgeable. Use occasional Indian greetings like "Namaste".
- Keep your answers elegant, helpful, and concise (under 150 words per reply).`;

    // Format history for Google GenAI SDK if present
    const formattedContents: any[] = [];

    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        formattedContents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        });
      });
    }

    // Append the new message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I apologize, I could not process your inquiry. Please feel free to call our main line!";
    res.json({ text: replyText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Error processing your request via AI. Please try again.",
      details: error.message,
    });
  }
});

// Set up Vite development server middleware or production static folder serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Homewise Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
