import "dotenv/config";

import { storeVector } from "./vectorStore";
import { randomUUID } from "crypto";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createEmbedding } from "./embedding";
import path from "path";


async function indexTheDocument(filePath: string) {
  const loader = new PDFLoader(filePath, { splitPages: false });
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const splitDocs = await splitter.splitDocuments(docs);

  for (const doc of splitDocs) {
  const embedding = await createEmbedding(doc.pageContent);

  console.log("Embedding length:", embedding?.length);

  await storeVector(
    randomUUID(),
    embedding!,
    {
      text: doc.pageContent,
      source: doc.metadata.source,
    }
  );

  console.log("Stored one chunk successfully");

  break; // abhi sirf test ke liye ek hi store karein
}

}

const filepath = path.join(process.cwd(), "data/documents/nexus.pdf");
indexTheDocument(filepath);
