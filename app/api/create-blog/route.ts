import { NextResponse } from "next/server";

export async function POST() {
  console.log("Hello from the API route!");
  return NextResponse.json({ success: true });
}
