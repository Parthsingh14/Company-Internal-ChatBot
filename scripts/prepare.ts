import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import path from "path";

async function indexTheDocument(filePath: string) {
  const loader = new PDFLoader(filePath, { splitPages: false });
  const doc = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const splitDocs = await splitter.splitText(doc[0].pageContent)
  console.log(splitDocs.length)
}
const filepath = path.join(process.cwd(), "data/documents/nexus.pdf");
indexTheDocument(filepath);
