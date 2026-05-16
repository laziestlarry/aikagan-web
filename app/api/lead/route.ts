import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.email || typeof body.email !== "string") {
    return NextResponse.json(
      { ok: false, error: "Valid email is required." },
      { status: 400 }
    );
  }

  console.log("AIKAGAN_LEAD_CAPTURE", {
    email: body.email,
    source: body.source || "homepage",
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({
    ok: true,
    message: "Lead captured."
  });
}
