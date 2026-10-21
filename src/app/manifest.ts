import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
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
      { src: "/sqlwhale-logo-main.png", sizes: "any", type: "image/png", purpose: "any" },
    ],
  };
}
