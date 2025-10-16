import { NextResponse } from "next/server";
import { testRag } from "@/utils/rag";

export async function GET() {
  try {
    const docs = await testRag();
    return NextResponse.json({ success: true, docs });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
