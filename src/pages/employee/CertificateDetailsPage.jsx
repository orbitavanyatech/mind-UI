/* Full certificate view — designed to look good both on screen and when
   printed/exported to PDF via the browser's native print dialog, so we
   don't need a PDF-generation dependency for a mock experience. */

import React from "react";
import { Award, Download, ShieldCheck } from "lucide-react";
import { BackLink, Button, Card } from "../../components/ui/Primitives";
import { CERTIFICATES } from "../../data/mockData";
import { useNavigation } from "../../navigation/NavigationContext";

const ACCENTS = {
  teal: { text: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200", line: "from-teal-500 to-teal-300" },
  violet: { text: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", line: "from-violet-500 to-violet-300" },
};

export const CertificateDetailsPage = ({ user }) => {
  const { params, back } = useNavigation();
  const cert = CERTIFICATES.find((c) => c.id === params.certificateId) || CERTIFICATES[0];
  const accent = ACCENTS[cert.color] || ACCENTS.teal;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <BackLink onClick={back}>Back to Certificates & Badges</BackLink>
        <Button icon={Download} onClick={() => window.print()}>Download PDF</Button>
      </div>

      <Card className={`relative overflow-hidden !p-0 print:shadow-none print:border-0`}>
        <div className={`h-2 bg-gradient-to-r ${accent.line}`} />
        <div className="p-8 sm:p-12 text-center">
          <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 ${accent.bg} border ${accent.border}`}>
            <Award className={`w-8 h-8 ${accent.text}`} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">Certificate of Completion</p>
          <h1 className="mpp-display text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{cert.title}</h1>
          <p className="text-sm text-slate-500 mb-8">{cert.detail}</p>

          <p className="text-xs text-slate-400 mb-1">This certifies that</p>
          <p className="mpp-display text-xl sm:text-2xl font-bold text-slate-900 mb-1">{user?.name || "Team Member"}</p>
          <p className="text-sm text-slate-500 mb-8">has successfully completed all modules in this learning path on the Mind Elevate platform.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-left mb-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Issued</p>
              <p className="text-sm font-semibold text-slate-800">{cert.issuedDate}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Credential ID</p>
              <p className="text-sm font-semibold text-slate-800">{cert.credentialId}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs">Verified by Mind Elevate</span>
          </div>
        </div>
      </Card>

      <p className="text-xs text-slate-400 text-center print:hidden">This certificate is personal to you and is never shared with your organization or administrators.</p>
    </div>
  );
};
