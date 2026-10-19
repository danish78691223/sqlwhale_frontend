"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Circle, Clock3, LockKeyhole, Sparkles } from "lucide-react";
import type { LessonModule } from "@/content/learn/types";
import { MODULE_TITLES } from "@/content/learn/modules";
import SqlExample from "./SqlExample";

type Progress = { completedModules?: number[]; completedCount?: number; progressPercent?: number; unlockedThrough?: number };
export default function LessonLayout({ module, initialProgress }: { module: LessonModule; initialProgress: Progress }) {
  const [progress, setProgress] = useState(initialProgress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});
  const completed = progress.completedModules || [];
  const score = useMemo(() => module.quiz.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0), [answers, module.quiz]);
  const canAccess = module.id <= (progress.unlockedThrough || 1) || completed.includes(module.id);
  useEffect(() => {
    const onScroll = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      const percent = max > 0 ? Math.round((root.scrollTop / max) * 100) : 0;
      const bar = document.getElementById("lesson-reading-progress");
      if (bar) bar.style.width = `${percent}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  async function refreshProgress() {
    const response = await fetch("/api/learning/progress", { credentials: "include", cache: "no-store" });
    if (!response.ok) throw new Error("Unable to refresh your saved course progress.");
    setProgress(await response.json());
  }
  async function submitQuiz() {
    setLoading(true); setError(""); setSuccess("");
    try {
      const response = await fetch(`/api/learning/modules/${module.id}/quiz/submit`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Quiz submission failed. Please try again.");
      setChecked(true); setQuizPassed(Boolean(data.passed));
      if (data.passed) setSuccess(`Great work! You passed with ${data.score}/5. You can now mark this module complete.`);
      else setError(`You scored ${data.score}/5. You need at least 3 correct answers. Review the explanations and try again.`);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to submit quiz."); }
    finally { setLoading(false); }
  }
  async function markComplete() {
    setSaving(true); setError(""); setSuccess("");
    try {
      const response = await fetch(`/api/learning/modules/${module.id}/complete`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save completion. Please retry.");
      await refreshProgress();
      setSuccess(`Module ${module.id} completed! Your course progress has increased by 10%.`);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to save completion."); }
    finally { setSaving(false); }
  }
  if (!canAccess) return <main className="lesson-shell"><div className="lesson-locked"><LockKeyhole size={36}/><h1>Module locked</h1><p>Complete the previous module and pass its quiz to unlock this lesson.</p><Link href="/learn">Back to learning path</Link></div></main>;
  return <main className="lesson-shell">
    <div className="lesson-reading-track"><div id="lesson-reading-progress"/></div>
    <div className="lesson-layout-grid">
      <aside className="lesson-sidebar"><Link href="/learn" className="lesson-back"><ArrowLeft size={16}/> All modules</Link><p className="lesson-sidebar-label">YOUR LEARNING PATH</p>{MODULE_TITLES.map((title, index) => { const id=index+1; const unlocked=id <= (progress.unlockedThrough||1) || completed.includes(id); return <div key={title} className={`lesson-side-item ${id===module.id?"active":""} ${!unlocked?"locked":""}`}>{unlocked?<Link href={`/learn/${id}`}><span>{completed.includes(id)?<CheckCircle2 size={16}/>:<Circle size={16}/>}</span><span><small>MODULE {id}</small><strong>{title}</strong></span><em>{completed.includes(id)?"Done":`${id*10}%`}</Link>:<div><span><LockKeyhole size={15}/></span><span><small>MODULE {id}</small><strong>{title}</strong></span></div>}</div>})}<div className="lesson-sidebar-progress"><div><span>Course progress</span><strong>{progress.progressPercent || 0}%</strong></div><div className="lesson-progress-track"><i style={{width:`${progress.progressPercent||0}%`}}/></div></div></aside>
      <article className="lesson-content">
        <div className="lesson-module-meta"><span>MODULE {String(module.id).padStart(2,"0")}</span><span>{module.difficulty}</span><span><Clock3 size={14}/>{module.estimatedTime}</span><span className="lesson-progress-badge">+10% progress</span></div>
        <h1>{module.title}</h1><p className="lesson-summary">{module.summary}</p>
        <section className="lesson-block"><h2>What you will learn</h2><ul className="lesson-outcomes">{module.outcomes.map(item=><li key={item}><CheckCircle2 size={17}/>{item}</li>)}</ul></section>
        <section className="lesson-analogy"><Sparkles size={20}/><div><h2>Think of it like this</h2><p>{module.analogy}</p></div></section>
        {module.sections.map((section,index)=><section className="lesson-block" key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p>{section.examples?.map(example=><div className="lesson-example-wrap" key={example.title}><h3>{example.title}</h3><p>{example.concept}</p><p className="lesson-analogy-inline"><strong>Analogy:</strong> {example.analogy}</p><SqlExample title={example.title} sql={example.sql}/><h4>Line-by-line explanation</h4><ul className="lesson-explanation">{example.explanation.map(line=><li key={line.line}><code>{line.line}</code><span>{line.meaning}</span></li>)}</ul>{example.input.length>0&&<div className="lesson-table-grid">{example.input.map(table=><div key={table.name}><h4>Input: {table.name}</h4><DataTable columns={table.columns} rows={table.rows}/></div>)}</div>}<h4>Expected output</h4><DataTable columns={example.output.columns} rows={example.output.rows}/>{example.note&&<p className="lesson-note">{example.note}</p>}</div>)}</section>)}
        <section className="lesson-block"><h2>Keyword cheat sheet</h2><div className="lesson-table-scroll"><table className="lesson-cheat-table"><thead><tr><th>Keyword</th><th>What it does</th><th>Example</th></tr></thead><tbody>{module.cheatSheet.map(row=><tr key={row.keyword}><td><code>{row.keyword}</code></td><td>{row.meaning}</td><td><code>{row.example}</code></td></tr>)}</tbody></table></div></section>
        <section className="lesson-block"><h2>Common mistakes & pro tips</h2><div className="lesson-tip-grid">{module.mistakes.map(item=><div className="lesson-tip" key={item.mistake}><strong>{item.mistake}</strong><p>{item.tip}</p></div>)}</div></section>
        <section className="lesson-block"><h2>Practice exercises</h2><p>Try each task in Query Lab before revealing the answer.</p>{module.exercises.map((exercise,index)=><div className="lesson-exercise" key={exercise.question}><h3>Exercise {index+1}</h3><p>{exercise.question}</p><p className="lesson-hint"><strong>Hint:</strong> {exercise.hint}</p><button type="button" className="lesson-secondary-button" onClick={()=>setShowAnswers(prev=>({...prev,[index]:!prev[index]}))}>{showAnswers[index]?"Hide answer":"Show answer"}</button>{showAnswers[index]&&<div className="lesson-answer"><pre><code>{exercise.answer}</code></pre><p>{exercise.explanation}</p><a href={`/run-query?query=${encodeURIComponent(exercise.answer)}`}>Try this answer in Query Lab</a></div>}</div>)}</section>
        <section className="lesson-block lesson-quiz"><div className="lesson-quiz-heading"><div><span>KNOWLEDGE CHECK</span><h2>Module quiz</h2><p>Answer all five questions. You need 3/5 to pass.</p></div><div className="lesson-quiz-score">{checked?`${score}/5`:"5 Qs"}</div></div>{module.quiz.map((question,index)=><fieldset className="lesson-question" key={question.question}><legend>{index+1}. {question.question}</legend>{question.options.map((option,optionIndex)=><label key={option} className={checked&&optionIndex===question.answer?"correct":checked&&answers[index]===optionIndex?"incorrect":""}><input type="radio" name={`quiz-${index}`} value={optionIndex} checked={answers[index]===optionIndex} disabled={checked} onChange={()=>setAnswers(prev=>({...prev,[index]:optionIndex}))}/><span>{option}</span></label>)}{checked&&<p className="lesson-quiz-explanation">{question.explanation}</p>}</fieldset>)}{!checked?<button type="button" className="lesson-primary-button" onClick={submitQuiz} disabled={loading||Object.keys(answers).length!==5}>{loading?"Checking answers…":"Submit quiz"}</button>:<button type="button" className="lesson-secondary-button" onClick={()=>{setAnswers({});setChecked(false);setQuizPassed(false);setError("");setSuccess("");}}>Retry quiz</button>}</section>
        {error&&<div className="lesson-status error" role="alert">{error}</div>}{success&&<div className="lesson-status success" role="status">{success}</div>}
        <section className="lesson-complete-card"><div><h2>Ready to finish this module?</h2><p>Pass the quiz first. Your progress is saved to your SQLWhale account.</p></div><button type="button" className="lesson-primary-button" disabled={!quizPassed||saving||completed.includes(module.id)} onClick={markComplete}>{saving?"Saving progress…":completed.includes(module.id)?"Module completed":quizPassed?"Mark module as completed":"Pass the quiz to continue"}</button></section>
        <nav className="lesson-bottom-nav" aria-label="Module navigation"><Link href="/learn"><ArrowLeft size={16}/> All modules</Link>{module.id<10&&(completed.includes(module.id)?<Link href={`/learn/${module.id+1}`}>Next module <ArrowRight size={16}/></Link>:<span aria-disabled="true"><LockKeyhole size={15}/> Next module locked</span>)}</nav>
      </article>
    </div>
  </main>;
}
function DataTable({columns,rows}:{columns:string[];rows:(string|number|null)[][]}) { return <div className="lesson-table-scroll"><table className="lesson-data-table"><thead><tr>{columns.map(column=><th key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row,index)=><tr key={index}>{row.map((value,i)=><td key={i}>{value===null?"NULL":String(value)}</td>)}</tr>)}</tbody></table></div>; }
