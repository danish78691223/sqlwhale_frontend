"use client";
import { useState } from "react";

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function numberBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
  return Uint8Array.from(raw, c => c.charCodeAt(0));
}
export default function PushKeySetup() {
  const [keys, setKeys] = useState<{ publicKey: string; privateKey: string } | null>(null);
  const [error, setError] = useState("");
  async function generate() {
    setError(""); setKeys(null);
    try {
      const pair = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
      const publicBytes = new Uint8Array(await crypto.subtle.exportKey("raw", pair.publicKey));
      const privateJwk = await crypto.subtle.exportKey("jwk", pair.privateKey);
      if (!privateJwk.d) throw new Error("Unable to export private key");
      // VAPID private key is the raw P-256 scalar; public key is uncompressed P-256 point.
      if (publicBytes.length !== 65 || numberBytes(privateJwk.d).length !== 32) throw new Error("Unexpected key format");
      setKeys({ publicKey: base64url(publicBytes), privateKey: privateJwk.d });
    } catch (e: any) { setError(e?.message || "Unable to generate keys."); }
  }
  return <main style={{ maxWidth: 760, margin: "60px auto", padding: 24 }}>
    <h1 style={{ fontSize: 30, fontWeight: 800 }}>SQLWhale Push Key Setup</h1>
    <p style={{ margin: "16px 0" }}>Generate VAPID keys in your browser. Keys are generated locally using Web Crypto and are not uploaded or stored by this page. Copy the values into Render Environment settings. Keep the private key secret.</p>
    <button onClick={() => void generate()} style={{ background: "#1862fd", color: "white", padding: "12px 18px", borderRadius: 8 }}>Generate VAPID keys</button>
    {error && <p role="alert">{error}</p>}
    {keys && <section style={{ display: "grid", gap: 18, marginTop: 24 }}>
      <label>VAPID_PUBLIC_KEY<textarea readOnly rows={3} value={keys.publicKey} style={{ display: "block", width: "100%", padding: 12, color: "#111" }} /></label>
      <label>VAPID_PRIVATE_KEY (SECRET — never share)<textarea readOnly rows={3} value={keys.privateKey} style={{ display: "block", width: "100%", padding: 12, color: "#111" }} /></label>
      <p>VAPID_SUBJECT: <code>mailto:YOUR_REAL_EMAIL</code></p>
      <p>After copying both keys into Render, close this page. Regenerating keys will invalidate existing subscriptions if you change keys after users subscribe.</p>
    </section>}
  </main>;
}
