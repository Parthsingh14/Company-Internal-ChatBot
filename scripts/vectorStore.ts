import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pc.index("your-index-name");

export async function storeVector(
  id: string,
  embedding: number[],
  metadata: any
) {
  await index.upsert([
    {
      id,
      values: embedding,
      metadata,
    },
  ]);
}
