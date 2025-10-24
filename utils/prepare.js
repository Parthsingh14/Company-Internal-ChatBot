// utils/prepare.js
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const indexTheDocument = async (filePath) => {
  // Step 1: Load PDF
  const loader = new PDFLoader(filePath, { splitPages: false });
  const docs = await loader.load(); // this returns an array of documents

  // Step 2: Split text into chunks
  const text = docs[0].pageContent; // full text from PDF
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const chunks = await textSplitter.splitText(text);

  // Return chunks
  return chunks;
};
