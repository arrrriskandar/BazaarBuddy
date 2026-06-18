import { GoogleGenAI } from "@google/genai";
import { categoryValues } from "../constants.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function classifyItemCategory(title, description) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Classify this marketplace item:\nTitle: ${title}\nDescription: ${description}`,
      config: {
        systemInstruction:
          "You are an automated categorization assistant. Analyze the item context parameters and assign the single most accurate category name string from the given enum list.",
        responseMimeType: "application/json",
        responseSchema: {
          type: "STRING",
          enum: categoryValues,
        },
      },
    });

    const textOutput = response.text.trim();

    // 1. If it returned the raw enum string matching perfectly, return it
    if (categoryValues.includes(textOutput)) {
      return textOutput;
    }

    // 2. Parse the output safely since type: "STRING" produces valid JSON tokens
    const parsedPayload = JSON.parse(textOutput);

    // 3. Handle cases where it parsed to a direct string or an object property fallback
    const finalizedCategory =
      typeof parsedPayload === "string"
        ? parsedPayload
        : parsedPayload?.selectedCategory || parsedPayload;

    // Double-check that what we are returning is a valid category in your array
    return categoryValues.includes(finalizedCategory)
      ? finalizedCategory
      : "Others";
  } catch (error) {
    console.error("Gemini SDK Execution Layer Interruption:", error);
    throw error; // Essential for BullMQ automatic retry policies
  }
}
