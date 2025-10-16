// rag.js
import { indexTheDocument } from "@/utils/prepare";

export const testRag = async () => {
  const filePath = "public/yash.pdf";
  const docs = await indexTheDocument(filePath);
  console.log(docs);
  return docs;
};
