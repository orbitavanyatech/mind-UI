"use client";

/* Auto-generated during modernization refactor of Mind Elevate */

import { useLanguage } from "@/i18n/LanguageContext";
import React from "react";
import { ChevronRight, Lock, ShieldCheck } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyPagePlaceholder
} from "@/components/ui/Primitives";
import { COACHING_NOTES_PREVIEW } from "@/data/mockData";

const LeadershipCoachingSection = () => {
  const { t } = useLanguage();
  return (
  <Card className="border-violet-100 bg-gradient-to-br from-violet-50/60 to-white">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center"><ShieldCheck className="w-4.5 h-4.5 text-violet-600" /></div>
        <div><p className="font-semibold text-slate-900 text-sm">{t("coaching.title")}</p><p className="text-xs text-slate-500">{t("coaching.confidential")}</p></div>
      </div>
      <Badge color="violet"><Lock className="w-3 h-3" />{t("coaching.private")}</Badge>
    </div>
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl border border-violet-100 p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">{t("coaching.nextSession")}</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-semibold text-sm shrink-0">MF</div>
          <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-900">{t("coaching.coach", { name: "Marcus Ford" })}</p><p className="text-xs text-slate-500">Thu, Aug 29 · 2:30 PM · 45 min</p></div>
        </div>
        <div className="flex gap-2 mt-4"><Button size="sm" className="flex-1 !bg-violet-600 hover:!bg-violet-700">{t("coaching.joinCall")}</Button><Button size="sm" variant="outline" className="flex-1">{t("coaching.reschedule")}</Button></div>
      </div>
      <div className="bg-white rounded-xl border border-violet-100 p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">{t("coaching.notes")}</p>
        <div className="space-y-2.5">{COACHING_NOTES_PREVIEW.map((note) => <div key={note.date} className="flex gap-2.5 text-sm"><span className="text-xs text-slate-400 shrink-0 w-11">{note.date}</span><p className="text-slate-600 text-xs leading-relaxed">{note.note}</p></div>)}</div>
      </div>
    </div>
  </Card>
  );
};

export const CoachingPage = () => {
  const { t } = useLanguage();
  return (
    <EmptyPagePlaceholder title={t("coaching.title")} desc={t("coaching.pageDesc")}>
      <LeadershipCoachingSection />
    </EmptyPagePlaceholder>
  );
};
