import { ImageResponse } from "next/og";
import { headers } from "next/headers";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

async function hasPremiumAccess() {
  try {
    const requestHeaders = await headers();
    const cookie = requestHeaders.get("cookie");
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    if (!cookie || !host) return false;

    const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
    const origin = `${protocol}://${host}`;
    const response = await fetch(new URL("/api/subscription/status", origin), {
      headers: { cookie },
      cache: "no-store",
    });
    if (!response.ok) return false;

    const subscription = await response.json();
    const currentPlan = String(subscription?.currentPlan ?? "").toLowerCase();
    const status = String(subscription?.subscriptionStatus ?? "").toLowerCase();
    return (
      subscription?.subscribed === true ||
      currentPlan === "sqlwhale premium" ||
      currentPlan === "premium" ||
      currentPlan === "pro" ||
      status === "active"
    );
  } catch {
    return false;
  }
}
export default async function Icon() {
  const premium = await hasPremiumAccess();
  const logo = await readFile(
    path.join(process.cwd(), "public", premium ? "Whale-Pro.png" : "sqlwhale-logo-main.png"),
  );
  const logoDataUrl = "data:image/png;base64," + logo.toString("base64");

  return new ImageResponse(
    (
      <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", backgroundColor: "#102638", alignItems: "center", justifyContent: "center" }}>
        <img src={logoDataUrl} width={390} height={390} style={{ objectFit: "contain" }} alt="SQLWhale" />
      </div>
    ),
    { ...size, headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
