import { notFound } from "next/navigation";
import { MODULES } from "@/data/mockData";
import { ModuleDetailsPage } from "@/views/employee/ModuleDetailsPage";

/* Every valid id is known at build time, so anything else is a real 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(MODULES).map((moduleId) => ({ moduleId }));
}

export default async function Page({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const learningModule = MODULES[moduleId];
  if (!learningModule) notFound();
  return <ModuleDetailsPage learningModule={learningModule} />;
}
