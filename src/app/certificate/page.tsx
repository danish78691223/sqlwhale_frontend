"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, api } from "@/services/api";
import { Award, Download, ShieldCheck } from "lucide-react";

export default function CertificatePage() {
  const router = useRouter();
  const [learner, setLearner] = useState("");
  const [certificateId, setCertificateId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    authApi.get("/auth/me")
      .then(async (response) => {
        if (!active) return;
        if (!response.data?.authenticated) {
          router.replace("/login");
          return;
        }
        const certificateResponse = await api.get("/certificate/mine");
        if (!active) return;
        const certificate = certificateResponse.data?.certificate;
        if (!certificate?.certificateId || !certificate?.learnerName) throw new Error("Certificate data unavailable");
        setLearner(certificate.learnerName);
        setCertificateId(certificate.certificateId.replace(/^SQLW-DEMO-/, ""));
      })
      .catch((requestError) => {
        if (!active) return;
        if (requestError?.response?.status === 401) router.replace("/login");
        else setError("Unable to load your certificate ID. Please refresh the page.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [router]);

  if (loading) return <main className="cert-page"><p style={{ textAlign: "center" }}>Loading your SQLWhale account...</p></main>;
  if (error) return <main className="cert-page"><p role="alert" style={{ textAlign: "center" }}>{error}</p></main>;
  if (!learner || !certificateId) return null;
  return (
    <main className="cert-page">
      <div className="cert-intro">
        <span className="cert-tag"><Award size={14} /> CERTIFICATE STUDIO · PREVIEW</span>
        <h1>A milestone worth framing.</h1>
        <p>A first look at the SQLWhale course completion certificate. This is a design preview, not an issued credential.</p>
        <div className="cert-actions">
          <button type="button" onClick={() => window.print()}><Download size={17} /> Print / Save PDF</button>
        </div>
      </div>

      <div className="cert-paper" aria-label="Demo SQLWhale certificate">
        <div className="cert-frame">
          <div className="cert-corners cert-corner-tl" />
          <div className="cert-corners cert-corner-tr" />
          <div className="cert-corners cert-corner-bl" />
          <div className="cert-corners cert-corner-br" />
          <div className="cert-topline">
            <div className="cert-brand"><span className="cert-brand-mark">S<span>Q</span>L</span><span>SQL<span className="cert-brand-accent">Whale</span></span></div>
            <span className="cert-edition">LEARNING ACHIEVEMENT · 001</span>
          </div>
          <div className="cert-center">
            <div className="cert-crest"><span>✦</span><Award size={39} strokeWidth={1.25} /><span>✦</span></div>
            <div className="cert-overline">THE CERTIFICATE OF</div>
            <h2>Completion</h2>
            <div className="cert-rule"><span>✦</span></div>
            <p className="cert-presented">PROUDLY PRESENTED TO</p>
            <h3>{learner}</h3>
            <p className="cert-copy">For successfully completing the learning journey in</p>
            <h4>SQL Fundamentals &amp; Database Mastery</h4>
            <p className="cert-subcopy">In recognition of dedication to learning, practicing, and understanding SQL through the SQLWhale curriculum.</p>
          </div>
          <div className="cert-bottom">
            <div className="cert-signature"><span className="cert-signature-script">SQLWhale</span><span className="cert-small-line" /><span>ISSUED BY SQLWHALE</span></div>
            <div className="cert-seal"><ShieldCheck size={25} strokeWidth={1.35} /><span>SQLWHALE</span><small>ACADEMY</small></div>
            <div className="cert-identity"><strong>DEMO · NOT ISSUED</strong><span className="cert-small-line" /><span>CERTIFICATE ID · {certificateId}</span></div>
          </div>
          <div className="cert-footnote">LEARN · PRACTICE · UNDERSTAND</div>
        </div>
      </div>
      <p className="cert-disclaimer">Preview only. Completion checks, real certificate IDs, issuance dates, and verification will be added later.</p>
      <style jsx global>{`
        .cert-page,.cert-page *{box-sizing:border-box}
        .cert-page{min-height:100vh;padding:75px 22px 90px;background:#f3f2ee;color:#18252d;font-family:Arial,Helvetica,sans-serif}
        .cert-intro{max-width:950px;margin:0 auto 32px;text-align:center}
        .cert-tag{display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border:1px solid #d9d5ca;border-radius:30px;color:#7c6744;font-size:11px;font-weight:800;letter-spacing:.13em}
        .cert-intro h1{font-size:clamp(30px,4.5vw,48px);letter-spacing:-.05em;margin:17px 0 9px;color:#18252d}
        .cert-intro p{font-size:14px;color:#66717a;line-height:1.7;margin:0 auto;max-width:650px}
        .cert-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:11px;margin-top:23px}
        .cert-actions label{font-size:12px;font-weight:700;color:#55636a}
        .cert-actions input{height:43px;min-width:230px;padding:0 14px;border:1px solid #d5d8d8;border-radius:9px;background:#fff;color:#18252d;outline-color:#0d858c}
        .cert-actions button{height:43px;padding:0 17px;border:0;border-radius:9px;background:#102b36;color:#fff;display:inline-flex;align-items:center;gap:9px;font-size:13px;font-weight:700;cursor:pointer}
        .cert-paper{width:min(100%,1050px);aspect-ratio:1.414/1;margin:0 auto;padding:16px;background:#fffefa;box-shadow:0 25px 75px #23313b20,0 1px 5px #23313b15}
        .cert-frame{height:100%;position:relative;border:2px solid #b89a62;outline:1px solid #b89a62;outline-offset:-10px;padding:38px 48px 22px;display:flex;flex-direction:column;overflow:hidden;background:radial-gradient(ellipse at center,#fffefa 35%,#faf6ed 100%)}
        .cert-frame:before,.cert-frame:after{content:"";position:absolute;pointer-events:none;width:220px;height:220px;border:1px solid #c7b38b55;border-radius:50%}
        .cert-frame:before{top:-175px;left:calc(50% - 110px)}.cert-frame:after{bottom:-190px;left:calc(50% - 110px)}
        .cert-corners{position:absolute;width:36px;height:36px;border-color:#b89a62;pointer-events:none}
        .cert-corner-tl{top:17px;left:17px;border-top:2px solid;border-left:2px solid}.cert-corner-tr{top:17px;right:17px;border-top:2px solid;border-right:2px solid}.cert-corner-bl{bottom:17px;left:17px;border-bottom:2px solid;border-left:2px solid}.cert-corner-br{bottom:17px;right:17px;border-bottom:2px solid;border-right:2px solid}
        .cert-topline{display:flex;align-items:center;justify-content:space-between;gap:15px}
        .cert-brand{display:flex;align-items:center;gap:11px;font-size:21px;font-weight:900;letter-spacing:-.055em;color:#142f3b}
        .cert-brand-mark{width:39px;height:39px;border-radius:10px;background:#142f3b;color:#fff;display:grid;place-items:center;font-size:13px;letter-spacing:-.1em}
        .cert-brand-mark span{color:#6dd1d0}.cert-brand-accent{color:#008f98}
        .cert-edition{font-size:9px;letter-spacing:.16em;color:#978363;font-weight:700}
        .cert-center{flex:1;min-height:0;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center}
        .cert-crest{display:flex;align-items:center;gap:15px;color:#b7985e;margin-bottom:12px}.cert-crest span{font-size:11px}
        .cert-overline{font-size:11px;letter-spacing:.36em;color:#7c6744;font-weight:700}
        .cert-center h2{font-family:Georgia,'Times New Roman',serif;font-size:clamp(42px,6vw,76px);font-weight:400;letter-spacing:-.055em;line-height:1.06;margin:8px 0 4px;color:#172d37}
        .cert-rule{width:175px;height:20px;display:flex;align-items:center;gap:12px;color:#b89a62;font-size:11px}
        .cert-rule:before,.cert-rule:after{content:"";flex:1;height:1px;background:#cbb88f}
        .cert-presented{margin:13px 0 3px!important;font-size:10px!important;letter-spacing:.22em;color:#847a67!important;font-weight:700}
        .cert-center h3{font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:clamp(30px,4vw,53px);font-weight:400;line-height:1.2;margin:7px 0 10px;color:#1c3945;overflow-wrap:anywhere}
        .cert-copy{margin:4px 0 5px!important;font-size:13px!important;color:#647079!important}
        .cert-center h4{font-family:Georgia,'Times New Roman',serif;font-size:clamp(18px,2.5vw,29px);font-weight:500;color:#143b45;margin:5px 0 10px}
        .cert-subcopy{font-size:11px!important;line-height:1.6!important;max-width:560px;color:#768087!important;margin:0!important}
        .cert-bottom{display:grid;grid-template-columns:1fr auto 1fr;gap:18px;align-items:end}
        .cert-signature,.cert-identity{display:flex;flex-direction:column;gap:6px;font-size:9px;letter-spacing:.11em;color:#7a7c79}
        .cert-signature-script{font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:25px;color:#233e46;letter-spacing:-.04em}
        .cert-small-line{height:1px;background:#bcb6a9;width:min(100%,195px)}
        .cert-seal{width:93px;height:93px;border:2px solid #b89a62;border-radius:50%;outline:1px solid #b89a62;outline-offset:-7px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#aa884e}
        .cert-seal span{font-size:9px;letter-spacing:.09em;font-weight:800}.cert-seal small{font-size:7px;letter-spacing:.2em}
        .cert-identity{text-align:right;align-items:flex-end}.cert-identity strong{font-size:10px;color:#866f49}
        .cert-footnote{margin-top:16px;text-align:center;font-size:8px;letter-spacing:.35em;color:#a28e68}
        .cert-disclaimer{text-align:center;margin:20px auto 0;font-size:12px;color:#7b8388}
        @media(max-width:700px){.cert-page{padding:42px 12px 65px}.cert-paper{padding:7px;aspect-ratio:auto;min-height:570px}.cert-frame{padding:32px 20px 22px;min-height:555px}.cert-topline{align-items:flex-start}.cert-brand{font-size:17px}.cert-brand-mark{width:30px;height:30px;font-size:10px}.cert-edition{max-width:100px;text-align:right;font-size:7px;line-height:1.6}.cert-crest{margin-bottom:8px}.cert-center h2{font-size:48px}.cert-center h3{font-size:36px}.cert-center h4{font-size:21px}.cert-copy{font-size:11px!important}.cert-subcopy{font-size:10px!important}.cert-bottom{gap:7px}.cert-seal{width:65px;height:65px}.cert-seal span{font-size:7px}.cert-seal small{font-size:5px}.cert-signature,.cert-identity{font-size:7px}.cert-signature-script{font-size:20px}.cert-footnote{font-size:7px;letter-spacing:.2em}}
        @media print{@page{size:A4 landscape;margin:0}.cert-page{padding:0;background:white;min-height:0}.cert-intro,.cert-disclaimer{display:none!important}.cert-paper{width:100%;height:100vh;max-width:none;aspect-ratio:auto;box-shadow:none;padding:12mm;print-color-adjust:exact;-webkit-print-color-adjust:exact}.cert-frame{padding:12mm 17mm 7mm}.cert-center h2{font-size:76px}.cert-center h3{font-size:53px}.cert-center h4{font-size:29px}body{background:white!important}body .sqlwhale-site-nav,body .sqlwhale-site-nav-spacer,body .sqlwhale-notch-header,body .sqlwhale-notch-spacer,body .sqlwhale-footer,body .sqlwhale-site-mobile-menu,body .sqlwhale-notch-mobile-menu,body .feedback-widget,body [data-feedback-widget]{display:none!important}body *{visibility:hidden!important}body .cert-page,body .cert-page .cert-paper,body .cert-page .cert-paper *{visibility:visible!important}body .cert-page{position:absolute!important;inset:0!important;width:100%!important;margin:0!important}body .cert-paper{position:relative!important}}
      `}</style>
    </main>
  );
}
