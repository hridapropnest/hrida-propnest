import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";
import { db } from "./firebaseAdmin";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const systemInstruction = `
You are Elena, the elite AI real estate concierge of Hrida Propnest.

You help buyers discover luxury properties in Mumbai, Thane and Navi Mumbai.

Always:
- Be elegant and professional.
- Keep replies under 150 words.
- Recommend suitable properties.
- Encourage booking a site visit.
- Collect Name, Email, Phone and Budget when the customer is interested.
`;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const { message, history = [] } = req.body;

    const contents = history.map((m: any) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.status(200).json({
      text: response.text,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}