/**
 * Local development API server — NO Firebase, NO external services.
 * Uses simple JSON files on disk for leads and properties storage.
 * Run via: npm run dev:full
 */
import "dotenv/config";
import express from "express";
import { randomUUID } from "crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, ".data");

// Ensure data directory exists
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

// ─── Simple JSON file DB ──────────────────────────────────────────────────────
function readDb(file: string): any[] {
  const path = join(DATA_DIR, file);
  if (!existsSync(path)) return [];
  try { return JSON.parse(readFileSync(path, "utf-8")); }
  catch { return []; }
}

function writeDb(file: string, data: any[]) {
  writeFileSync(join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

// ─── Setup ────────────────────────────────────────────────────────────────────
const BROKER_PIN = process.env.BROKER_PIN || "4040";
const app = express();
app.use(express.json());

// CORS for local Vite dev server
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  if (_req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ─── /api/health ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ─── /api/leads ───────────────────────────────────────────────────────────────
app.get("/api/leads", (req, res) => {
  const pin = req.headers["x-broker-pin"];
  if (pin !== BROKER_PIN) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  const leads = readDb("leads.json").reverse(); // newest first
  res.json({ success: true, leads });
});

app.post("/api/leads", (req, res) => {
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

  console.log(`📋 New lead: ${name} <${email}>`);
  res.json({ success: true, lead });
});

// ─── /api/properties ──────────────────────────────────────────────────────────
app.get("/api/properties", (_req, res) => {
  const properties = readDb("properties.json");
  res.json({ success: true, properties });
});

app.post("/api/properties", (req, res) => {
  const pin = req.headers["x-broker-pin"];
  if (pin !== BROKER_PIN) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const { name, priceText, priceNumerical, purpose, sqft, beds, baths, location, image, tagline, description, highlights, pdfUrl } = req.body;
  if (!name || !location) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  const property = {
    id: randomUUID(),
    name, priceText: priceText || "Price upon request",
    priceNumerical: Number(priceNumerical) || 0,
    purpose: purpose === "rent" ? "rent" : "buy",
    sqft: Number(sqft) || 0,
    beds: Number(beds) || 1,
    baths: Number(baths) || 1,
    location,
    image: image || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    tagline: tagline || "",
    description: description || "",
    highlights: Array.isArray(highlights) ? highlights : [],
    pdfUrl: pdfUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    createdAt: Date.now(),
  };

  const properties = readDb("properties.json");
  properties.push(property);
  writeDb("properties.json", properties);

  res.json({ success: true, property });
});

app.post("/api/properties/sync", (req, res) => {
  const pin = req.headers["x-broker-pin"];
  if (pin !== BROKER_PIN) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const { properties } = req.body;
  if (!Array.isArray(properties)) {
    return res.status(400).json({ success: false, error: "Invalid properties array." });
  }

  writeDb("properties.json", properties);
  res.json({ success: true });
});

app.delete("/api/properties/:id", (req, res) => {
  const pin = req.headers["x-broker-pin"];
  if (pin !== BROKER_PIN) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const { id } = req.params;
  const properties = readDb("properties.json");
  const filtered = properties.filter((p: any) => p.id !== id);
  
  if (properties.length === filtered.length) {
    return res.status(404).json({ success: false, error: "Property not found" });
  }

  writeDb("properties.json", filtered);
  res.json({ success: true });
});


// ─── /api/chat ────────────────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  const { message, history = [] } = req.body;
  try {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const contents = history.map((m: any) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: `You are Elena, the elite AI real estate concierge of Hrida Propnest. You help buyers discover luxury properties in Mumbai, Thane and Navi Mumbai. Always be elegant and professional. Keep replies under 150 words. Recommend suitable properties. Encourage booking a site visit. Collect Name, Email, Phone and Budget when the customer is interested.`,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Local API server → http://localhost:${PORT}`);
  console.log(`📁 Data stored in  → ${DATA_DIR}`);
  console.log(`🔑 Broker PIN      → ${BROKER_PIN}`);
});
