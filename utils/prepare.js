import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export const indexTheDocument = async (filePath) => {
    const Loader = new PDFLoader(filePath,{splitPages:false});
    const docs = await Loader.load();
    return docs;
}