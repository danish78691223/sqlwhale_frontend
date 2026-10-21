import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function Icon() {
  const logo = await readFile(path.join(process.cwd(), "public", "sqlwhale-logo-main.png"));
  const logoDataUrl = "data:image/png;base64," + logo.toString("base64");

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: "#102638", alignItems: "center", justifyContent: "center" }}>
        {/* Use the actual project logo, rather than a substitute SQL text icon. */}
        <img src={logoDataUrl} width={390} height={390} style={{ objectFit: "contain" }} alt="SQLWhale" />
      </div>
    ),
    { ...size },
  );
}
