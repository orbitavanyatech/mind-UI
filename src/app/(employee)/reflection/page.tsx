import { MODULES } from "@/data/mockData";
import { ReflectionPage } from "@/views/employee/ReflectionPage";

/* /reflection?module=<moduleId>&lesson=<lessonId> pre-links an entry to the
   module or lesson the person was just working on. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ module?: string; lesson?: string }>;
}) {
  const { module: moduleId, lesson: lessonId } = await searchParams;
  const learningModule = moduleId ? MODULES[moduleId] : undefined;
  const lesson = learningModule?.lessons.find((l) => l.id === lessonId);
  const relatedTo = lesson?.title ?? learningModule?.name ?? null;
  return <ReflectionPage relatedTo={relatedTo} />;
}
