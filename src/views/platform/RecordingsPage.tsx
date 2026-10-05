"use client";

/* Auto-generated during modernization refactor of Mind Elevate */

import { useLanguage } from "@/i18n/LanguageContext";
import React from "react";
import {
  PlayCircle
} from "lucide-react";
import {
  Card,
  EmptyPagePlaceholder
} from "@/components/ui/Primitives";

export const RecordingsPage = () => {
  const { t } = useLanguage();
  return (
  <EmptyPagePlaceholder title={t("admin.recordings.title")} desc={t("admin.recordings.desc")}>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {["Focus Under Pressure — Replay", "Resilience Reset — Group Circle", "Leading Through Change", "Energy Management Live Q&A"].map((r) => (
        <Card key={r} className="p-0 overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-indigo-900 to-slate-800 flex items-center justify-center"><PlayCircle className="w-10 h-10 text-white/80" /></div>
          <div className="p-4"><p className="font-semibold text-sm text-slate-900">{r}</p><p className="text-xs text-slate-500 mt-1">{t("admin.recordings.meta")}</p></div>
        </Card>
      ))}
    </div>
  </EmptyPagePlaceholder>
  );
};

