import { notFound, redirect } from "next/navigation";

type Props = { params: Promise<{ moduleId: string }> };

// Keep /learn/1, /learn/2, ... working by redirecting to the unified lesson page.
export default async function LessonPage({ params }: Props) {
  const { moduleId } = await params;
  if (!/^\d+$/.test(moduleId) || Number(moduleId) < 1 || Number(moduleId) > 10) {
    notFound();
  }
  redirect("/learn#module-" + Number(moduleId));
}
