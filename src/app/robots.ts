import type { MetadataRoute } from "next";

const SITE_URL = "https://sqlwhale.webxwhale.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account",
        "/admin",
        "/api",
        "/certificate",
        "/forgot-password",
        "/login",
        "/payment",
        "/push-key-setup",
        "/reset-password",
        "/run-query",
        "/signup",
        "/subscribe",
        "/learn/course",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
