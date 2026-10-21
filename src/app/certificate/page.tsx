"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, api } from "@/services/api";
import { Award, Download, ShieldCheck } from "lucide-react";

export default function CertificatePage() {
  const router = useRouter();
  const [learner, setLearner] = useState("");
  const [certificateId, setCertificateId] = useState("");
  const [issuedAt, setIssuedAt] = useState<string | null>(null);
  const [eligible, setEligible] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalModules, setTotalModules] = useState(0);
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
        if (!certificate?.learnerName) throw new Error("Certificate data unavailable");
        setLearner(certificate.learnerName);
        setEligible(certificateResponse.data.eligible === true);
        setSubscribed(certificateResponse.data.subscribed === true);
        setCompletedCount(certificateResponse.data.completedCount ?? 0);
        setTotalModules(certificateResponse.data.totalModules ?? 0);
        setCertificateId(certificateResponse.data.eligible && certificate.certificateId ? certificate.certificateId.replace(/^SQLW-DEMO-/, "") : "XXXXXXX");
        setIssuedAt(certificateResponse.data.eligible && certificate.createdAt ? certificate.createdAt : null);
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
  if (!learner) return null;
  const issueDate = issuedAt
    ? new Date(issuedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "DATE NOT AVAILABLE";

  return (
    <main className="cert-page">
      <section className="cert-intro">
        <span className="cert-tag"><Award size={14} /> CERTIFICATE STUDIO · PREVIEW</span>
        <h1>Your SQL achievement, beautifully presented.</h1>
        <p>{eligible ? "You have met the requirements for your official SQLWhale certificate." : "Learn freely, complete every module, and maintain Premium access to unlock your official certificate."}</p>
        <p className="cert-eligibility" role="status">{completedCount} / {totalModules} modules completed <span>•</span> {subscribed ? "Premium active" : "Premium required"} <span>•</span> {eligible ? "Certificate unlocked" : "Certificate locked"}</p>
        <div className="cert-actions"><button type="button" disabled={!eligible} onClick={() => { if (eligible) window.print(); }}><Download size={17} /> {eligible ? "Print / Save as PDF" : "Complete requirements to download"}</button></div>
      </section>

      <article className="cert-paper" aria-label="SQLWhale certificate of completion">
        <div className="cert-frame">
          <span className="cert-corners cert-corner-tl" aria-hidden="true" /><span className="cert-corners cert-corner-tr" aria-hidden="true" /><span className="cert-corners cert-corner-bl" aria-hidden="true" /><span className="cert-corners cert-corner-br" aria-hidden="true" />
          <header className="cert-header">
            <div className="cert-parent-brand"><span className="cert-brand-bar" aria-hidden="true" /><div><span className="cert-brand-kicker">A PRODUCT OF</span><strong>WEB<span className="cert-x">X</span>WHALE</strong></div></div>
            <div className="cert-product-brand"><img src="/sqlwhale-logo-main.png" alt="SQLWhale logo" /></div>
            <div className="cert-top-motto">LEARN <i>•</i> BUILD <i>•</i> GROW</div>
          </header>
          <section className="cert-main">
            <div className="cert-title-wrap"><span className="cert-title-rule" /><h2>CERTIFICATE</h2><span className="cert-title-rule" /></div>
            <div className="cert-of-completion">OF COMPLETION</div><div className="cert-title-ornament"><span />◇<span /></div>
            <p className="cert-presented">THIS CERTIFIES THAT</p><h3 className="cert-learner">{learner}</h3><div className="cert-name-rule"><span>◇</span></div>
            <p className="cert-course-intro">HAS SUCCESSFULLY COMPLETED THE COURSE</p><h4 className="cert-course">SQL Fundamentals &amp; Database Mastery</h4>
            <p className="cert-description">For successfully completing the learning journey and demonstrating<br className="cert-desktop-break" /> foundational SQL and database skills through SQLWhale.</p>
          </section>
          <footer className="cert-footer">
            <div className="cert-signature-block cert-founder"><div className="cert-signature-script">Danish Khan</div><span className="cert-signature-line" /><strong>Founder, Danish Khan</strong></div>
            <div className="cert-medal" aria-label="SQL skills certified"><div className="cert-laurel cert-laurel-left">❧</div><div className="cert-medal-face"><div className="cert-medal-icon">♟</div><strong>SQL SKILLS</strong><strong>CERTIFIED</strong><span>★ ★ ★ ★ ★</span></div><div className="cert-ribbon cert-ribbon-left" /><div className="cert-ribbon cert-ribbon-right" /><div className="cert-laurel cert-laurel-right">❧</div></div>
            <div className="cert-signature-block cert-cofounder"><div className="cert-signature-script">Ismail Shaikh</div><span className="cert-signature-line" /><strong>Founder, Ismail Shaikh</strong></div>
          </footer>
          <div className="cert-metadata cert-meta-id"><div className="cert-meta-icon">▤</div><span className="cert-meta-separator" /><div><small>CERTIFICATE ID:</small><strong>{eligible ? `SQLW-${certificateId}` : "SQLW-XXXXXXXX"}</strong></div></div>
          <div className="cert-metadata cert-meta-date"><div className="cert-meta-icon">▦</div><span className="cert-meta-separator" /><div><small>ISSUE DATE:</small><strong>{eligible ? issueDate : "AWAITING ELIGIBILITY"}</strong></div></div>
          {!eligible && <div className="cert-lock-watermark">PREVIEW · NOT YET ISSUED</div>}
        </div>
      </article>
      <p className="cert-disclaimer">{eligible ? "Your certificate is unlocked. Keep this PDF for your records and use the certificate ID for verification." : "This is a preview only. All Learn modules must be completed and an active Premium subscription is required before an official certificate can be issued."}</p>
      <style jsx global>{`
        .cert-page,.cert-page *{box-sizing:border-box}
        .cert-page{--cert-ink:#071e3c;--cert-gold:#d49a2a;--cert-gold-deep:#a96713;min-height:100vh;padding:54px 22px 78px;background:#f4f5f7;color:var(--cert-ink);font-family:Arial,Helvetica,sans-serif}
        .cert-intro{max-width:1000px;margin:0 auto 28px;text-align:center}.cert-tag{display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border:1px solid #ded4c0;border-radius:30px;color:#85612b;background:#fffdf8;font-size:11px;font-weight:800;letter-spacing:.13em}
        .cert-intro h1{font-size:clamp(28px,4vw,43px);letter-spacing:-.045em;margin:16px 0 8px;color:#102644}.cert-intro p{font-size:14px;color:#5e6b7a;line-height:1.7;margin:0 auto;max-width:750px}.cert-eligibility{margin-top:8px!important;font-weight:700;color:#435468!important}.cert-eligibility span{padding:0 5px;color:#c38a23}
        .cert-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:11px;margin-top:20px}.cert-actions button{min-height:44px;padding:0 18px;border:0;border-radius:9px;background:#102644;color:#fff!important;display:inline-flex;align-items:center;gap:9px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 5px 14px #142d4718}.cert-actions button:disabled{background:#8e969e;color:#fff!important;cursor:not-allowed;opacity:.82}
        .cert-paper{width:min(100%,1500px);aspect-ratio:1.535/1;margin:0 auto;padding:12px;background:#fffdf8;box-shadow:0 20px 65px #182c4217,0 1px 5px #182c4212}.cert-frame{height:100%;position:relative;border:2px solid var(--cert-gold);outline:1px solid #e4bc62;outline-offset:-9px;padding:3.6% 4.8% 2.1%;display:flex;flex-direction:column;overflow:hidden;background:radial-gradient(ellipse at center,#fffefa 29%,#fcf7ea 100%);isolation:isolate}
        .cert-frame:before{content:"";position:absolute;inset:1.8%;border:1px solid #d7a747;pointer-events:none;z-index:-1}.cert-frame:after{content:"";position:absolute;inset:-6%;pointer-events:none;z-index:-1;background:radial-gradient(ellipse at 0 50%,#e9c76b13 0,transparent 30%),radial-gradient(ellipse at 100% 50%,#e9c76b13 0,transparent 30%)}
        .cert-corners{position:absolute;width:5.2%;height:8%;border-color:#d5a13d;pointer-events:none;z-index:2}.cert-corner-tl{top:2.2%;left:2.1%;border-top:3px double;border-left:3px double;border-top-left-radius:12px}.cert-corner-tr{top:2.2%;right:2.1%;border-top:3px double;border-right:3px double;border-top-right-radius:12px}.cert-corner-bl{bottom:2.2%;left:2.1%;border-bottom:3px double;border-left:3px double;border-bottom-left-radius:12px}.cert-corner-br{bottom:2.2%;right:2.1%;border-bottom:3px double;border-right:3px double;border-bottom-right-radius:12px}
        .cert-header{display:grid;grid-template-columns:1fr 1.1fr 1fr;align-items:start;gap:16px;position:relative;z-index:1}.cert-parent-brand{display:flex;align-items:center;gap:15px;padding-top:4px}.cert-brand-bar{height:58px;width:5px;background:linear-gradient(#f0c65d,#b87a19);display:block;flex-shrink:0}.cert-parent-brand>div{display:flex;flex-direction:column;gap:3px}.cert-brand-kicker{font-size:clamp(7px,.9vw,13px);letter-spacing:.25em;color:#263448;white-space:nowrap}.cert-parent-brand strong{font-size:clamp(15px,2.15vw,31px);font-weight:950;letter-spacing:-.055em;white-space:nowrap;color:#0a2342}.cert-x{color:#159be4}
        .cert-product-brand{display:flex;align-items:center;justify-content:center;flex-direction:column;margin-top:-2px;min-height:90px}.cert-product-brand img{display:block;width:clamp(100px,12vw,158px);height:clamp(68px,7.5vw,100px);object-fit:contain;object-position:center;filter:brightness(0) saturate(100%) invert(9%) sepia(35%) saturate(1800%) hue-rotate(177deg)}.cert-top-motto i{color:#cf9422;font-style:normal;padding:0 .28em}.cert-top-motto{justify-self:end;padding-top:9px;font-size:clamp(7px,.95vw,13px);letter-spacing:.2em;white-space:nowrap;color:#102644}
        .cert-main{position:relative;z-index:1;flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 2%}.cert-title-wrap{width:78%;display:flex;align-items:center;justify-content:center;gap:16px}.cert-title-rule{height:1px;background:#c88613;flex:1;max-width:80px}.cert-main h2{font-family:Georgia,"Times New Roman",serif;font-size:clamp(45px,8.6vw,112px);font-weight:700;letter-spacing:-.055em;line-height:.93;margin:0;color:#071c36;white-space:nowrap}.cert-of-completion{font-size:clamp(14px,2.2vw,32px);font-weight:700;letter-spacing:.42em;color:#d4a03b;margin-top:6px;padding-left:.42em}.cert-title-ornament{display:flex;align-items:center;justify-content:center;gap:10px;color:#d39a2e;font-size:17px;margin:5px 0 0}.cert-title-ornament span{height:1px;width:clamp(50px,12vw,160px);background:#d5a13b}
        .cert-presented{font-size:clamp(8px,1.08vw,15px);letter-spacing:.34em;color:#313c4c;margin:9px 0 0;padding-left:.34em}.cert-learner{font-family:Georgia,"Times New Roman",serif;font-weight:700;font-style:italic;font-size:clamp(34px,5.5vw,72px);line-height:1.08;letter-spacing:-.045em;margin:7px 0 0;color:#081e3b;overflow-wrap:anywhere;max-width:100%}.cert-name-rule{width:min(70%,760px);height:12px;border-top:1.5px solid #cf941e;position:relative;margin-top:3px}.cert-name-rule span{position:absolute;top:-9px;left:50%;transform:translateX(-50%);color:#cb8d1a;background:#fffaf0;padding:0 5px;font-size:14px}
        .cert-course-intro{font-size:clamp(8px,1.05vw,14px);letter-spacing:.29em;color:#343f4c;margin:8px 0 0;padding-left:.29em}.cert-course{font-family:Georgia,"Times New Roman",serif;font-size:clamp(19px,3.2vw,43px);font-weight:700;letter-spacing:-.035em;line-height:1.1;margin:7px 0 0;color:#102746;max-width:100%}.cert-description{font-size:clamp(10px,1.35vw,18px);line-height:1.45;letter-spacing:.025em;color:#46515f;margin:8px 0 0;max-width:850px}
        .cert-footer{position:relative;z-index:2;display:grid;grid-template-columns:1fr 145px 1fr;align-items:end;gap:18px;min-height:108px;margin-top:0}.cert-signature-block{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:5px;padding-bottom:2px;position:relative;top:-34px}.cert-signature-script{font-family:"Brush Script MT","Segoe Script",cursive;font-style:italic;font-size:clamp(19px,2.4vw,32px);line-height:1;color:#102746;white-space:nowrap}.cert-signature-line{width:80%;height:1px;background:#c38a22}.cert-signature-block strong{font-size:clamp(9px,1.05vw,14px);font-weight:500;color:#102644}
        .cert-medal{width:128px;height:138px;justify-self:center;position:relative;display:flex;align-items:flex-start;justify-content:center;padding-top:8px;color:#30220a}.cert-medal-face{position:relative;z-index:2;width:96px;height:96px;border-radius:50%;border:5px double #ba8527;outline:2px solid #e8bc55;outline-offset:3px;background:radial-gradient(circle at 30% 20%,#fff0a5,#e9ba4b 43%,#ba7d20 100%);box-shadow:inset 0 0 0 3px #f4d57a,0 5px 9px #5c3d1b40;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px}.cert-medal-icon{font-size:21px;line-height:1;color:#5e3b0c;text-shadow:0 1px #ffedaf}.cert-medal-face strong{font-size:10px;letter-spacing:.02em}.cert-medal-face span{font-size:9px;letter-spacing:1px}.cert-ribbon{position:absolute;top:79px;width:28px;height:55px;background:linear-gradient(90deg,#061b3d,#123c66,#061b3d);border:1px solid #d3a13a;z-index:1}.cert-ribbon-left{left:37px;transform:rotate(12deg);clip-path:polygon(0 0,100% 0,100% 100%,50% 82%,0 100%)}.cert-ribbon-right{right:37px;transform:rotate(-12deg);clip-path:polygon(0 0,100% 0,100% 100%,50% 82%,0 100%)}.cert-laurel{position:absolute;top:39px;font-family:Georgia,serif;font-size:60px;line-height:1;color:#ce972c;text-shadow:0 1px #f9e3a0}.cert-laurel-left{left:-2px;transform:rotate(-48deg)}.cert-laurel-right{right:-2px;transform:scaleX(-1) rotate(-48deg)}
        .cert-metadata{position:absolute;z-index:2;bottom:5.2%;display:flex;align-items:center;gap:12px;color:#0c2747}.cert-meta-id{left:7%}.cert-meta-date{right:7%}.cert-meta-icon{font-size:36px;color:#aa680d;line-height:1}.cert-meta-separator{width:1.5px;height:42px;background:#d1a34a}.cert-metadata>div:last-child{display:flex;flex-direction:column;gap:4px}.cert-metadata small{font-size:clamp(7px,.8vw,11px);letter-spacing:.19em;color:#424957;white-space:nowrap}.cert-metadata strong{font-size:clamp(9px,1.1vw,14px);font-weight:800;white-space:nowrap}.cert-lock-watermark{position:absolute;z-index:4;right:4%;top:5%;padding:6px 10px;border:1px solid #d2a047;background:#fff9ecdf;color:#976b20;font-size:9px;font-weight:800;letter-spacing:.12em;transform:rotate(2deg)}.cert-disclaimer{text-align:center;margin:18px auto 0;max-width:1050px;font-size:12px;line-height:1.65;color:#737c85}
        @media(min-width:1400px){.cert-main h2{font-size:clamp(90px,7.3vw,125px)}}
        @media(max-width:760px){.cert-page{padding:35px 10px 54px}.cert-intro{margin-bottom:20px}.cert-paper{aspect-ratio:auto;min-height:660px;padding:7px}.cert-frame{min-height:645px;padding:22px 14px 105px}.cert-header{grid-template-columns:1fr auto;gap:6px}.cert-parent-brand{gap:7px}.cert-brand-bar{height:39px;width:3px}.cert-brand-kicker{font-size:6px;letter-spacing:.15em}.cert-parent-brand strong{font-size:clamp(13px,4vw,22px)}.cert-product-brand{grid-column:1/-1;grid-row:1;justify-self:center;margin-bottom:12px;min-height:58px}.cert-product-brand img{width:90px;height:58px}.cert-top-motto{grid-column:2;grid-row:2;font-size:6px;letter-spacing:.08em;padding-top:5px}.cert-main{padding:4px 0 10px;min-height:0}.cert-title-wrap{width:100%;gap:6px}.cert-title-rule{max-width:22px}.cert-main h2{font-size:clamp(32px,8.7vw,56px);letter-spacing:-.06em}.cert-of-completion{font-size:clamp(11px,3vw,19px);letter-spacing:.28em}.cert-title-ornament{margin-top:3px}.cert-presented{font-size:7px;letter-spacing:.2em;margin-top:8px}.cert-learner{font-size:clamp(27px,7.8vw,43px)}.cert-course-intro{font-size:7px;letter-spacing:.12em}.cert-course{font-size:clamp(18px,5vw,27px)}.cert-description{font-size:10px;line-height:1.5}.cert-desktop-break{display:none}.cert-footer{grid-template-columns:1fr 82px 1fr;gap:4px;min-height:76px}.cert-signature-block{top:-20px}.cert-signature-script{font-size:clamp(15px,4vw,22px)}.cert-signature-block strong{font-size:7px;text-align:center}.cert-medal{width:80px;height:94px;padding-top:4px}.cert-medal-face{width:61px;height:61px;border-width:3px;gap:1px}.cert-medal-icon{font-size:13px}.cert-medal-face strong{font-size:6px}.cert-medal-face span{font-size:6px}.cert-ribbon{top:53px;width:19px;height:34px}.cert-ribbon-left{left:21px}.cert-ribbon-right{right:21px}.cert-laurel{top:24px;font-size:38px}.cert-laurel-left{left:-6px}.cert-laurel-right{right:-6px}.cert-metadata{bottom:4%;gap:6px}.cert-meta-id{left:5%}.cert-meta-date{right:5%}.cert-meta-icon{font-size:23px}.cert-meta-separator{height:29px}.cert-metadata small{font-size:6px;letter-spacing:.1em}.cert-metadata strong{font-size:7px}.cert-lock-watermark{font-size:6px;right:3%;top:2%}}
        @media(max-width:390px){.cert-paper{min-height:620px}.cert-frame{min-height:605px;padding-left:10px;padding-right:10px}.cert-course{font-size:17px}.cert-footer{grid-template-columns:1fr 70px 1fr}.cert-medal{width:70px}.cert-metadata{gap:4px}.cert-meta-icon{font-size:19px}.cert-metadata small{font-size:5px}.cert-metadata strong{font-size:6px}}
        @media print{@page{size:A4 landscape;margin:0}html,body{width:297mm!important;height:210mm!important;margin:0!important;padding:0!important;background:white!important;print-color-adjust:exact;-webkit-print-color-adjust:exact}.cert-page{padding:0!important;margin:0!important;min-height:0!important;background:white!important}.cert-intro,.cert-disclaimer{display:none!important}.cert-paper{width:297mm!important;height:210mm!important;max-width:none!important;aspect-ratio:auto!important;box-shadow:none!important;padding:7mm!important;margin:0!important;print-color-adjust:exact;-webkit-print-color-adjust:exact}.cert-frame{padding:10mm 13mm 6mm!important}body *{visibility:hidden!important}.cert-page,.cert-page .cert-paper,.cert-page .cert-paper *{visibility:visible!important}.cert-page{position:absolute!important;inset:0!important;width:297mm!important;height:210mm!important;overflow:hidden!important}.cert-paper{position:relative!important}body .sqlwhale-site-nav,body .sqlwhale-site-nav-spacer,body .sqlwhale-notch-header,body .sqlwhale-notch-spacer,body .sqlwhale-footer,body .sqlwhale-site-mobile-menu,body .sqlwhale-notch-mobile-menu,body .feedback-widget,body [data-feedback-widget]{display:none!important}}
      `}</style>
    </main>
  );
}
