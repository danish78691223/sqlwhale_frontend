"use client";
import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

export default function SqlExample({ title, sql }: { title: string; sql: string }) {
  const [copied, setCopied] = useState(false);
  async function copySql() {
    try { await navigator.clipboard.writeText(sql); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }
    catch { setCopied(false); }
  }
  return <section className="lesson-sql-card" aria-label={title}>
    <div className="lesson-sql-toolbar"><strong>{title}</strong><button type="button" className="lesson-copy-button" onClick={copySql}><span aria-hidden="true">{copied ? <Check size={15}/> : <Copy size={15}/>}</span>{copied ? "Copied" : "Copy SQL"}</button></div>
    <pre className="lesson-code"><code>{sql}</code></pre>
    <a className="lesson-try-link" href={`/run-query?query=${encodeURIComponent(sql)}`}>Try in Query Lab <ExternalLink size={15}/></a>
  </section>;
}