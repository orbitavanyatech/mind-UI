import { notFound } from "next/navigation";
import { SESSION_DETAILS, UPCOMING_SESSIONS } from "@/data/mockData";
import { SessionDetailsPage } from "@/views/employee/SessionDetailsPage";

/* Every valid id is known at build time, so anything else is a real 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return UPCOMING_SESSIONS.map((s) => ({ sessionId: s.id }));
}

export default async function Page({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const session = UPCOMING_SESSIONS.find((s) => s.id === sessionId);
  const detail = SESSION_DETAILS[sessionId];
  if (!session || !detail) notFound();
  return <SessionDetailsPage session={session} detail={detail} />;
}
