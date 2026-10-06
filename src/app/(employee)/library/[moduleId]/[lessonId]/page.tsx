import { notFound } from "next/navigation";
import { MODULES } from "@/data/mockData";
import { ExercisePage } from "@/views/employee/ExercisePage";
import { QuestionsPage } from "@/views/employee/QuestionsPage";
import { VideoPlayerPage } from "@/views/employee/VideoPlayerPage";

/* Every valid id is known at build time, so anything else is a real 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(MODULES).flatMap((m) => m.lessons.map((l) => ({ moduleId: m.id, lessonId: l.id })));
}

/* One URL per lesson; the lesson's `type` decides which screen renders. */
export default async function Page({ params }: { params: Promise<{ moduleId: string; lessonId: string }> }) {
  const { moduleId, lessonId } = await params;
  const learningModule = MODULES[moduleId];
  const lesson = learningModule?.lessons.find((l) => l.id === lessonId);
  if (!learningModule || !lesson) notFound();

  switch (lesson.type) {
    case "video":
      return <VideoPlayerPage learningModule={learningModule} lesson={lesson} />;
    case "exercise":
      return <ExercisePage learningModule={learningModule} lesson={lesson} />;
    default:
      return <QuestionsPage learningModule={learningModule} lesson={lesson} />;
  }
}
