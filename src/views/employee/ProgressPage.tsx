"use client";

/* Auto-generated during modernization refactor of Mind Elevate */

import { useLanguage } from "@/i18n/LanguageContext";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { NotebookPen } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  ProgressRing,
  EmptyPagePlaceholder,
  PrivacyNotice
} from "@/components/ui/Primitives";
import { WELLBEING_TREND } from "@/data/mockData";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";

const WellbeingTrendCard = () => {
  const { t } = useLanguage();
  return (
  <Card className="overflow-hidden">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-5">
      <div>
        <p className="font-semibold text-slate-900 text-base">{t("progress.trendTitle")}</p>
        <p className="mt-1 text-xs text-slate-500">{t("progress.trendDesc")}</p>
      </div>
      <Badge color="slate">{t("shared.privateToYou")}</Badge>
    </div>
    <div className="flex flex-wrap gap-x-5 gap-y-2 mb-4 text-xs font-medium text-slate-600">
      <span className="flex items-center gap-2"><i className="w-2.5 h-2.5 rounded-full bg-teal-500" />{t("progress.focus")} <strong className="text-slate-900">74</strong></span>
      <span className="flex items-center gap-2"><i className="w-2.5 h-2.5 rounded-full bg-amber-500" />{t("progress.resilience")} <strong className="text-slate-900">70</strong></span>
      <span className="flex items-center gap-2"><i className="w-2.5 h-2.5 rounded-full bg-indigo-500" />{t("progress.energy")} <strong className="text-slate-900">68</strong></span>
    </div>
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={WELLBEING_TREND} margin={{ top: 10, right: 12, bottom: 0, left: -18 }}>
        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#EEF0F2" />
        <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#747D88" }} axisLine={false} tickLine={false} dy={10} />
        <YAxis domain={[50, 80]} ticks={[50, 60, 70, 80]} tick={{ fontSize: 11, fill: "#9AA2AB" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #DDE1E5", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.10)", fontSize: 12 }}
          cursor={{ stroke: "#C1C7CD", strokeDasharray: "4 4" }}
        />
        <Line type="monotone" dataKey="focus" name={t("progress.focus")} stroke="#3346E8" strokeWidth={3} dot={{ r: 3, fill: "#ffffff", strokeWidth: 2 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="resilience" name={t("progress.resilience")} stroke="#EE8710" strokeWidth={3} dot={{ r: 3, fill: "#ffffff", strokeWidth: 2 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="energy" name={t("progress.energy")} stroke="#12B8A6" strokeWidth={3} dot={{ r: 3, fill: "#ffffff", strokeWidth: 2 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  </Card>
  );
};

export const ProgressPage = () => {
  const router = useRouter();
  const { t } = useLanguage();
  return (
    <EmptyPagePlaceholder title={t("progress.title")} desc={t("progress.desc")}>
      <PrivacyNotice text={t("progress.privacy")} />
      <div className="grid sm:grid-cols-3 gap-5 mt-6 mb-6">
        <Card className="flex flex-col items-center"><ProgressRing value={82} color="#3346E8" label={t("progress.focus")} sub={t("progress.thisMonth", { n: "+14" })} /></Card>
        <Card className="flex flex-col items-center"><ProgressRing value={64} color="#EE8710" label={t("progress.resilience")} sub={t("progress.thisMonth", { n: "+9" })} /></Card>
        <Card className="flex flex-col items-center"><ProgressRing value={71} color="#12B8A6" label={t("progress.energy")} sub={t("progress.thisMonth", { n: "+6" })} /></Card>
      </div>
      <WellbeingTrendCard />
      <Card className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{t("progress.reflTitle")}</p>
          <p className="text-xs text-slate-500 mt-0.5">{t("progress.reflDesc")}</p>
        </div>
        <Button variant="outline" size="sm" icon={NotebookPen} onClick={() => router.push(ROUTES.reflection)}>{t("progress.openRefl")}</Button>
      </Card>
    </EmptyPagePlaceholder>
  );
};
