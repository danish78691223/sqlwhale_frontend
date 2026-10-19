import type { Metadata } from "next";
import { notFound } from "next/navigation";
import moduleOne from "@/content/learn/module-01";
import LessonLayout from "@/components/learn/LessonLayout";

type Props = { params: Promise<{ moduleId: string }> };
export async function generateMetadata({params}:Props):Promise<Metadata> {
  const {moduleId}=await params;
  if(moduleId!=="1") return {title:"Module locked | SQLWhale Learn",description:"Complete the previous SQLWhale module to unlock this lesson."};
  return {title:"SQL & Database Foundations | SQLWhale Learn",description:"Learn SQL and database foundations with simple explanations, runnable examples, practice exercises and a five-question quiz."};
}
export default async function LessonPage({params}:Props) {
  const {moduleId}=await params;
  if(!/^\d+$/.test(moduleId)||Number(moduleId)<1||Number(moduleId)>10) notFound();
  if(moduleId!=="1") return <LockedModule moduleId={Number(moduleId)}/>;
  return <LessonLayout module={moduleOne} initialProgress={{completedModules:[],completedCount:0,progressPercent:0,unlockedThrough:1}}/>;
}
function LockedModule({moduleId}:{moduleId:number}) {
  return <div className="lesson-locked-page"><div className="lesson-locked"><span>MODULE {String(moduleId).padStart(2,"0")}</span><h1>This module is locked</h1><p>Finish the previous module and pass its quiz to unlock this lesson. Your saved progress determines which lessons you can open.</p><a href="/learn">Return to learning path</a></div></div>;
}