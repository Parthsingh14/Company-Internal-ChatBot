import { Pinecone } from "@pinecone-database/pinecone";

interface VectorMetadata {
  text: string;
  source: string;
  [key: string]: string | number | boolean;
}

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pc.index("companyinternalbot");

export async function storeVector(
  id: string,
  embedding: number[],
  metadata: VectorMetadata
) {
  await index.upsert({
    records: [
      {
        id,
        values: embedding,
        metadata,
      },
    ],
    namespace: "default", // optional but recommended
  });

  console.log("Vector stored:", id);
}

export async function querySimilar(
  embedding: number[],
  topK: number
) {
  const response = await index.namespace("default").query({
    vector: embedding,
    topK,
    includeValues: false,
    includeMetadata: true,
  });

  return response.matches ?? [];
}


