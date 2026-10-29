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
    if (!cookie) return false;

    const apiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api")
      .replace(/\/+$/, "");
    const response = await fetch(`${apiBase}/auth/me`, {
      headers: { cookie },
      cache: "no-store",
    });
    if (!response.ok) return false;

    const data = await response.json();
    const user = data?.user ?? data?.data?.user ?? null;
    if (!data?.authenticated || !user) return false;

    const plan = String(user.plan ?? user.subscriptionPlan ?? user.subscription?.plan ?? "").toLowerCase();
    const status = String(user.subscriptionStatus ?? user.subscription?.status ?? "").toLowerCase();
    return (
      ["premium", "pro", "whale pro"].includes(plan) ||
      user.isPremium === true ||
      user.hasPremiumAccess === true ||
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
