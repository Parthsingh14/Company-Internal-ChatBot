import { NextRequest } from "next/server";
import { createEmbedding } from "@/scripts/embedding";
import { querySimilar } from "@/scripts/vectorStore";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question) {
      return new Response(JSON.stringify({ error: "Question is required" }), {
        status: 400,
      });
    }

    // Generate embedding for the question
    const questionEmbedding = await createEmbedding(question);

    if (!questionEmbedding) {
      return new Response(
        JSON.stringify({ error: "Failed to generate embedding" }),
        { status: 400 },
      );
    }
    console.log("Is Array:", Array.isArray(questionEmbedding));
    console.log("Length:", questionEmbedding?.length);

    // Query similar vectors from Pinecone
    const matches = await querySimilar(questionEmbedding, 3);

    // Extract relevant context from matches
    const context = matches
      .map((match) => match.metadata?.text)
      .filter(Boolean)
      .join("\n\n");

//     const prompt = `
// You are an internal company assistant.
// Answer ONLY using the provided context.
// If the answer is not in the context, say:
// "I could not find this information in the company knowledge base."

// Context:
// ${context}

// Question:
// ${question}
// `;

    // Generate answer using Gemini
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "You are an internal company assistant. Answer ONLY using the provided context. If the answer is not in the context, say: 'I could not find this information in the company knowledge base.'",
        },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion:\n${question}`,
        },
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? "No response.";
    return new Response(JSON.stringify({ reply }), { status: 200 });
  } catch (error) {
    console.error("RAG API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
