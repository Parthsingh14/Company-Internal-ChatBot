// utils/rag.js
import { indexTheDocument } from "@/utils/prepare";

export const testRag = async () => {
  const filePath = "public/yash.pdf";
  const chunks = await indexTheDocument(filePath);

  console.log("Chunk count:", chunks.length);
  console.log("First Chunk:\n", chunks[0]);

  return chunks;
};
