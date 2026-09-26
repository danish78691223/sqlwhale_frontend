import { NextResponse } from "next/server";

const WEBXWHALE_CONTACT_URL =
  process.env.WEBXWHALE_CONTACT_URL ||
  "https://webxwhale-ebon.vercel.app/api/contact";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(WEBXWHALE_CONTACT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: body?.name,
        email: body?.email,
        service: body?.service,
        message: body?.message,
      }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({
      success: false,
      message: "Invalid response from WebXWhale.",
    }));

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("WebXWhale contact proxy error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "We could not send your enquiry. Please try again later.",
      },
      { status: 502 }
    );
  }
}
