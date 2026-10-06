"use client";

/* Full certificate view — designed to look good both on screen and when
   printed/exported to PDF via the browser's native print dialog, so we
   don't need a PDF-generation dependency for a mock experience. */

import { useLanguage } from "@/i18n/LanguageContext";
import React from "react";
import { Award, Download, ShieldCheck } from "lucide-react";
import { BackLink, Button, Card } from "@/components/ui/Primitives";
import { ROUTES } from "@/config/routes";
import { useCurrentUser } from "@/auth/AuthContext";
import type { Certificate } from "@/types";

const ACCENTS: Record<string, { text: string; bg: string; border: string; line: string }> = {
  teal: { text: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200", line: "from-teal-500 to-teal-300" },
  violet: { text: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", line: "from-violet-500 to-violet-300" },
};

export const CertificateDetailsPage = ({ certificate: cert }: { certificate: Certificate }) => {
  const { user } = useCurrentUser();
  const { t } = useLanguage();
  const accent = ACCENTS[cert.color] || ACCENTS.teal;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <BackLink href={ROUTES.achievements}>{t("certificate.back")}</BackLink>
        <Button icon={Download} onClick={() => window.print()}>{t("certificate.download")}</Button>
      </div>

      <Card className={`relative overflow-hidden !p-0 print:shadow-none print:border-0`}>
        <div className={`h-2 bg-gradient-to-r ${accent.line}`} />
        <div className="p-8 sm:p-12 text-center">
          <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 ${accent.bg} border ${accent.border}`}>
            <Award className={`w-8 h-8 ${accent.text}`} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">{t("certificate.ofCompletion")}</p>
          <h1 className="mpp-display text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{cert.title}</h1>
          <p className="text-sm text-slate-500 mb-8">{cert.detail}</p>

          <p className="text-xs text-slate-400 mb-1">{t("certificate.certifies")}</p>
          <p className="mpp-display text-xl sm:text-2xl font-bold text-slate-900 mb-1">{user?.name || t("certificate.teamMember")}</p>
          <p className="text-sm text-slate-500 mb-8">{t("certificate.completed")}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-left mb-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{t("certificate.issued")}</p>
              <p className="text-sm font-semibold text-slate-800">{cert.issuedDate}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{t("certificate.credentialId")}</p>
              <p className="text-sm font-semibold text-slate-800">{cert.credentialId}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs">{t("certificate.verified")}</span>
          </div>
        </div>
      </Card>

      <p className="text-xs text-slate-400 text-center print:hidden">{t("certificate.private")}</p>
    </div>
  );
};
