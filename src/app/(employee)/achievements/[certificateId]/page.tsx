import { notFound } from "next/navigation";
import { CERTIFICATES } from "@/data/mockData";
import { CertificateDetailsPage } from "@/views/employee/CertificateDetailsPage";

/* Every valid id is known at build time, so anything else is a real 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return CERTIFICATES.map((c) => ({ certificateId: c.id }));
}

export default async function Page({ params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await params;
  const certificate = CERTIFICATES.find((c) => c.id === certificateId);
  if (!certificate) notFound();
  return <CertificateDetailsPage certificate={certificate} />;
}
