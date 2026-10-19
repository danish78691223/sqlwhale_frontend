import type { Metadata } from "next";
import "./lesson.css";
import { notFound } from "next/navigation";
import moduleOne from "@/content/learn/module-01";
import LessonLayout from "@/components/learn/LessonLayout";
import LockedModule from "@/components/learn/LockedModule";

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