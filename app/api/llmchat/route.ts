import "dotenv/config";
import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createEmbedding } from "@/scripts/embedding";
import { querySimilar } from "@/scripts/vectorStore";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: NextRequest) {
    try{
        const question = await request.json();

        if(!question){
            return new Response(JSON.stringify({ error: "Question is required" }), { status: 400 });
        }

        // Generate embedding for the question
        const questionEmbedding= await createEmbedding(question);

        // Query similar vectors from Pinecone
        const matches = await querySimilar(questionEmbedding, 3);

        // Extract relevant context from matches
    }
    catch(error){
        console.error("RAG API Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
}
