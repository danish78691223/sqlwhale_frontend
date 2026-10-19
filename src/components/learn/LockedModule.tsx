"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LockKeyhole, CheckCircle2 } from "lucide-react";

type Progress = { completedModules?: number[]; unlockedThrough?: number };
export default function LockedModule({ moduleId }: { moduleId: number }) {
  const [progress, setProgress] = useState<Progress>({ completedModules: [], unlockedThrough: 1 });
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    fetch("/api/learning/progress", { credentials: "include", cache: "no-store" })
      .then(async response => response.ok ? response.json() : null)
      .then(data => { if (active && data) setProgress(data); })
      .catch(() => undefined)
      .finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, []);
  const unlocked = moduleId <= (progress.unlockedThrough || 1) || (progress.completedModules || []).includes(moduleId);
  return <main className="lesson-locked-page"><div className="lesson-locked">
    {unlocked ? <CheckCircle2 size={36}/> : <LockKeyhole size={36}/>}
    <span>MODULE {String(moduleId).padStart(2,"0")}</span>
    <h1>{unlocked ? "Module unlocked" : "This module is locked"}</h1>
    <p>{!loaded ? "Checking your saved course progress…" : unlocked ? "Your progress unlocks this module. Its full lesson content will be added in the next lesson release. Your existing progress is safe." : "Finish the previous module and pass its quiz to unlock this lesson. Your saved progress determines which lessons you can open."}</p>
    <Link href="/learn">Return to learning path</Link>
  </div></main>;
}