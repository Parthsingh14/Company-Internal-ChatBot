import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import path from "path"

async function indexTheDocument(filePath: string){
    const loader = new PDFLoader(filePath)
    const docs = await loader.load()
    console.log(docs)
}

const filepath = path.join(process.cwd(),"data/documents/nexus.pdf")

indexTheDocument(filepath)