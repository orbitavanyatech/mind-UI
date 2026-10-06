"use client";

/* Auto-generated during modernization refactor of Mind Elevate */

import { useLanguage } from "@/i18n/LanguageContext";
import React from "react";
import {
  Check
} from "lucide-react";
import {
  Badge,
  Card,
  Button,
  EmptyPagePlaceholder,
  PrivacyNotice
} from "@/components/ui/Primitives";

export const PulsePage = () => {
  const { t } = useLanguage();
  return (
  <EmptyPagePlaceholder title={t("pulse.title")} desc={t("pulse.desc")}>
    <PrivacyNotice text={t("pulse.privacy")} />
    <Card className="mt-6 max-w-xl">
      <Badge color="amber" className="mb-3">{t("pulse.badge")}</Badge>
      <p className="font-semibold text-slate-900 mb-4">{t("pulse.cardTitle")}</p>
      <p className="text-sm text-slate-600 mb-4">{t("pulse.question")}</p>
      <div className="flex gap-2 mb-6">
        {["😞", "😕", "😐", "🙂", "😄"].map((e, i) => (
          <button key={i} className="flex-1 py-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50 text-xl">{e}</button>
        ))}
      </div>
      <Button className="w-full">{t("pulse.submit")}</Button>
    </Card>
  </EmptyPagePlaceholder>
  );
};

