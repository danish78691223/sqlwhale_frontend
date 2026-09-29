import { NextResponse } from "next/server";

const WEBXWHALE_URL = (
  process.env.WEBXWHALE_URL || "https://webxwhale-ebon.vercel.app"
).replace(/\/+$/, "");

export async function POST(request: Request) {
  try {
    const body = await request.text();

    const response = await fetch(WEBXWHALE_URL + "/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": request.headers.get("x-forwarded-for") || "",
      },
      body,
      cache: "no-store",
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "application/json" },
    });
  } catch (error) {
    console.error("SQLWhale feedback proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to submit feedback right now." },
      { status: 502 }
    );
  }
}
