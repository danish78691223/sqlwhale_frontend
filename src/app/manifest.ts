import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const premium = await hasPremiumAccess();
  const icon = premium
    ? "/Whale-Pro.png?v=7"
    : "/sqlwhale-logo-main.png?v=7";

  return {
    name: "SQLWhale — Learn SQL Visually",
    short_name: "SQLWhale",
    description: "Practice SQL, visualize database relationships, and learn SQL.",
    id: "/run-query",
    start_url: "/run-query",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#102b36",
    icons: [
      { src: icon, sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
