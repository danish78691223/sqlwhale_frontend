import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#0c2334", borderRadius: 96, alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#ffffff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", width: 310, height: 260, alignItems: "center", justifyContent: "center", border: "9px solid #4da4ff", borderRadius: 68, fontSize: 130, fontWeight: 900, letterSpacing: -12, paddingRight: 14 }}>SQL</div>
        <div style={{ display: "flex", marginTop: 26, fontSize: 48, fontWeight: 800, letterSpacing: -1 }}>SQLWhale</div>
      </div>
    ),
    { ...size },
  );
}
