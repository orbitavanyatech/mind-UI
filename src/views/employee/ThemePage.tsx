"use client";

/* Auto-generated during modernization refactor of Mind Elevate */

import { useLanguage } from "@/i18n/LanguageContext";
import React from "react";
import {
  CheckCircle2,
  Play,
  Target
} from "lucide-react";
import {
  Badge,
  Card,
  EmptyPagePlaceholder,
  ProgressBar
} from "@/components/ui/Primitives";
import {
  MODULES,
  MONTHLY_THEME
} from "@/data/mockData";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";

const moduleIdForName = (name: string) => Object.values(MODULES).find((m) => m.name === name)?.id;

const MonthlyThemeCard = () => {
  const { t } = useLanguage();
  return (
  <Card>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
          <Target className="w-4.5 h-4.5 text-amber-600" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">{MONTHLY_THEME.month}</p>
          <p className="font-semibold text-slate-900 text-sm">{MONTHLY_THEME.title}</p>
        </div>
      </div>
      <Badge color="amber">{t("shared.inProgress")}</Badge>
    </div>
    <p className="text-sm text-slate-500 mb-4">{MONTHLY_THEME.description}</p>
    <ProgressBar value={MONTHLY_THEME.progress} color="amber" className="mb-4" />
    <div className="space-y-2">
      {MONTHLY_THEME.modules.map((module) => (
        <div key={module.name} className="flex items-center gap-2.5 text-sm">
          {module.done ? (
            <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
          )}
          <span className={module.done ? "text-slate-400 line-through" : "text-slate-700"}>{module.name}</span>
        </div>
      ))}
    </div>
  </Card>
  );
};

export const ThemePage = () => {
  const router = useRouter();
  const { t } = useLanguage();
  return (
    <EmptyPagePlaceholder title={t("theme.title")} desc={t("theme.desc")}>
      <MonthlyThemeCard />
      <div className="grid sm:grid-cols-2 gap-5 mt-6">
        {MONTHLY_THEME.modules.map((m) => {
          const moduleId = moduleIdForName(m.name);
          return (
            <button
              key={m.name}
              onClick={() => moduleId && router.push(ROUTES.module(moduleId))}
              disabled={!moduleId}
              className="text-left w-full"
            >
              <Card className="flex items-center gap-4 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center shrink-0"><Play className="w-4.5 h-4.5 text-teal-600" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.done ? t("shared.completed") : t("theme.notStarted")}</p>
                </div>
                <Badge color={m.done ? "teal" : "slate"}>{m.done ? t("shared.done") : t("shared.start")}</Badge>
              </Card>
            </button>
          );
        })}
      </div>
    </EmptyPagePlaceholder>
  );
};
