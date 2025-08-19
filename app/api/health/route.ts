import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok" });
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}
