import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function createEmbedding(text: string) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  if (!response.embeddings || response.embeddings.length === 0) {
    throw new Error("No embeddings returned from API");
  }

//   console.log("Embedding input type:", typeof text);
// console.log("Embedding input value:", text);

  return response.embeddings[0].values;
}
