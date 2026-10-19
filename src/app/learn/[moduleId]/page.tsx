import { notFound, redirect } from "next/navigation";

type Props = { params: Promise<{ moduleId: string }> };

// Keep legacy /learn/1, /learn/2, ... URLs working while the course lives
// on the unified /learn page. The hash selects the lesson in the same page.
export default async function LessonPage({ params }: Props) {
  const { moduleId } = await params;
  if (!/^\\d+$/.test(moduleId) || Number(moduleId) < 1 || Number(moduleId) > 10) {
    notFound();
  }
  redirect(`/learn#module-${Number(moduleId)}`);
}
