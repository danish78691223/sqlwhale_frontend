"use client";

import { useEffect } from "react";
import { ArrowRight, BookOpen, GraduationCap, Trophy, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { MODULE_TITLES, moduleSummaries } from "@/content/learn/modules";

const outcomes = ["Understand relational databases, tables, rows and keys","Write SQL queries using SELECT, WHERE and ORDER BY","Summarise data with aggregate functions and GROUP BY","Combine tables with JOINs and build subqueries","Modify data safely and understand database integrity","Learn database design, indexes and advanced SQL"];

export default function LearnOverviewPage() {
  const router = useRouter();
  useEffect(() => {
    try { if (window.localStorage.getItem("sqlwhale:course-started") === "true") router.replace("/learn/course"); } catch {}
  }, [router]);
  function startCourse() {
    try { window.localStorage.setItem("sqlwhale:course-started", "true"); } catch {}
    router.push("/learn/course");
  }
  return (
    <main className="course-overview">
      <style jsx global>{`
        .course-overview{--co-bg:#f5f8fb;--co-ink:#102233;--co-muted:#5d7080;--co-line:#dce5ec;min-height:calc(100vh - 80px);padding:24px clamp(18px,5vw,76px) 76px;background:radial-gradient(ellipse at 10% 0%,rgba(124,199,255,.18),transparent 32%),radial-gradient(ellipse at 90% 15%,rgba(143,231,189,.16),transparent 30%),var(--co-bg);color:var(--co-ink)}
        .course-overview *{box-sizing:border-box}.co-container{max-width:1180px;margin:0 auto}.co-hero{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(240px,.7fr);gap:34px;align-items:center;padding:44px 0 34px}.co-eyebrow{display:inline-flex;gap:8px;align-items:center;color:#087d59;font:700 11px ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase}.co-hero h1{font-size:clamp(38px,5.3vw,66px);line-height:1.02;letter-spacing:-.065em;margin:18px 0}.co-hero p{max-width:690px;color:var(--co-muted);font-size:16px;line-height:1.8}.co-start{display:inline-flex;align-items:center;justify-content:center;gap:10px;margin-top:18px;padding:15px 23px;border:0;border-radius:11px;background:#122b3d;color:white;font-weight:750;cursor:pointer;box-shadow:0 10px 24px rgba(18,43,61,.16);transition:transform .2s,background .2s}.co-start:hover{transform:translateY(-2px);background:#087d59}.co-visual{padding:25px;border:1px solid rgba(20,55,75,.12);border-radius:24px;background:rgba(255,255,255,.8);box-shadow:0 18px 50px rgba(30,60,80,.08)}.co-visual-icon{width:58px;height:58px;display:grid;place-items:center;border-radius:17px;background:#e6f7ef;color:#087d59}.co-visual strong{display:block;font-size:40px;letter-spacing:-.06em;margin-top:20px}.co-visual small{color:var(--co-muted)}.co-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:10px 0 34px}.co-stat{padding:17px;border:1px solid var(--co-line);border-radius:14px;background:#fff}.co-stat strong{display:block;font-size:21px}.co-stat span{color:var(--co-muted);font-size:12px}.co-section{margin:34px 0}.co-section h2{font-size:25px;letter-spacing:-.04em;margin:0 0 8px}.co-section-intro{color:var(--co-muted);margin:0 0 18px;line-height:1.7}.co-modules{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.co-module{display:flex;gap:14px;align-items:flex-start;padding:17px;border:1px solid var(--co-line);border-radius:14px;background:#fff}.co-number{width:34px;height:34px;flex:0 0 34px;display:grid;place-items:center;border-radius:10px;background:#eaf7f1;color:#087d59;font:700 12px ui-monospace,monospace}.co-module h3{font-size:14px;margin:1px 0 6px}.co-module p{font-size:12px;line-height:1.6;color:var(--co-muted);margin:0}.co-outcomes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.co-outcome{display:flex;gap:9px;align-items:flex-start;color:#314657;font-size:13px;line-height:1.6}.co-outcome svg{color:#087d59;flex:0 0 auto;margin-top:2px}.co-assessment{display:flex;justify-content:space-between;gap:24px;align-items:center;padding:23px;border:1px solid #c9e8d9;border-radius:17px;background:#eaf7f1}.co-assessment p{color:#466454;line-height:1.7;margin:7px 0 0;font-size:13px}.co-bottom{text-align:center;padding:30px 0 0}.co-bottom p{color:var(--co-muted);font-size:13px}@media(max-width:760px){.co-hero{grid-template-columns:1fr;padding-top:25px}.co-visual{display:none}.co-stats{grid-template-columns:1fr}.co-modules,.co-outcomes{grid-template-columns:1fr}.co-assessment{align-items:flex-start;flex-direction:column}.course-overview{padding-left:15px;padding-right:15px}}
      `}</style>
      <div className="co-container">
        <section className="co-hero"><div><span className="co-eyebrow"><GraduationCap size={15}/> SQLWHALE LEARNING PATH</span><h1>Master SQL.<br/><span style={{color:"#087d59"}}>One concept at a time.</span></h1><p>A structured, beginner-to-advanced SQL course with practical examples, interactive lessons, module-wise progress and a final assessment. Learn the concepts and then apply them in the SQLWhale Query Lab.</p><button className="co-start" onClick={startCourse}>Start Course <ArrowRight size={18}/></button></div><div className="co-visual"><div className="co-visual-icon"><BookOpen size={29}/></div><strong>10 Modules</strong><small>One guided learning journey from SQL foundations to advanced concepts.</small></div></section>
        <section className="co-stats"><div className="co-stat"><strong>10</strong><span>Structured modules</span></div><div className="co-stat"><strong>Beginner → Advanced</strong><span>Difficulty progression</span></div><div className="co-stat"><strong>50 Marks</strong><span>Final assessment · pass at 35</span></div></section>
        <section className="co-section"><h2>Course curriculum</h2><p className="co-section-intro">Follow the modules in sequence. Each module introduces concepts, examples and practice to build your SQL skills.</p><div className="co-modules">{MODULE_TITLES.map((title,index)=><article className="co-module" key={title}><span className="co-number">{String(index+1).padStart(2,"0")}</span><div><h3>{title}</h3><p>{moduleSummaries[index]}</p></div></article>)}</div></section>
        <section className="co-section"><h2>What you will learn</h2><p className="co-section-intro">By the end of this course, you will be able to:</p><div className="co-outcomes">{outcomes.map(item=><div className="co-outcome" key={item}><CheckCircle2 size={17}/>{item}</div>)}</div></section>
        <section className="co-assessment"><div><h2>Final assessment</h2><p>Complete all 10 modules to unlock the final 50-question assessment. Score at least 35 marks to pass and qualify for your course certificate.</p></div><Trophy size={38} color="#087d59"/></section>
        <div className="co-bottom"><button className="co-start" onClick={startCourse}>Start Learning <ArrowRight size={18}/></button><p>You can return anytime. Your saved course progress stays in your account.</p></div>
      </div>
    </main>
  );
}
