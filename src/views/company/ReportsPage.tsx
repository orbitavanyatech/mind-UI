"use client";

/* Company administrator — Reports. Aggregated, anonymised insight for this company only.
   Numbers are derived from the live org structure (so a new department or a person moved
   between departments shows up immediately), stop at department level, and withhold any
   group with fewer than MIN_GROUP active people. */

import React from "react";
import { Activity, BookOpen, Download, Users } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button, Card, EmptyPagePlaceholder, PrivacyNotice, StatCard } from "@/components/ui/Primitives";
import { Table } from "@/components/ui/Table";
import { ENGAGEMENT_TREND } from "@/data/mockData";
import { useOrg } from "@/company/OrgContext";
import { buildReportCsv } from "@/company/insights";
import { DepartmentBars, SuppressedNote } from "@/views/company/orgUi";

export const ReportsPage = () => {
  const { t } = useLanguage();
  const { insights } = useOrg();
  const { overall, byDepartment } = insights;
  const pct = (v: number | null) => (v === null ? "—" : `${v}%`);

  const exportCsv = () => {
    const csv = buildReportCsv(insights, {
      group: t("admin.cols.department"),
      active: t("company.reports.colActive"),
      engagement: t("admin.cols.engagement"),
      completion: t("company.reports.colCompletion"),
      workload: t("company.reports.colWorkload"),
      company: t("company.reports.wholeCompany"),
    });
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "mind-elevate-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <EmptyPagePlaceholder
      title={t("admin.reports.title")}
      desc={t("admin.reports.desc")}
      action={<Button variant="outline" size="sm" icon={Download} onClick={exportCsv}>{t("admin.reports.export")}</Button>}
    >
      <PrivacyNotice text={t("admin.reports.privacy")} />

      <div className="grid sm:grid-cols-3 gap-5">
        <StatCard label="Active Employees" value={overall.active.toLocaleString()} icon={Users} color="indigo" />
        <StatCard label="Monthly Engagement" value={pct(overall.engagement)} icon={Activity} color="indigo" />
        <StatCard label="Avg. Learning Completion" value={pct(overall.completion)} icon={BookOpen} color="indigo" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <p className="font-semibold text-slate-900 text-sm mb-4">{t("admin.reports.engagementOverTime")}</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ENGAGEMENT_TREND}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F2" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9AA2AB" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9AA2AB" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="engagement" stroke="#3346E8" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <p className="font-semibold text-slate-900 text-sm mb-4">{t("admin.reports.completionByDept")}</p>
          <DepartmentBars groups={byDepartment} metric="completion" color="#3346E8" height={220} />
          <SuppressedNote groups={byDepartment} />
        </Card>
      </div>

      <Card>
        <p className="font-semibold text-slate-900 text-sm mb-4">{t("company.reports.byDepartment")}</p>
        <Table
          columns={[t("admin.cols.department"), t("company.reports.colActive"), t("admin.cols.engagement"), t("company.reports.colCompletion"), t("company.reports.colWorkload")]}
          rows={byDepartment.map((g) => [
            <span key="n" className="font-medium text-slate-800">{g.name}</span>,
            g.active,
            g.reportable ? pct(g.engagement) : <span key="e" className="text-slate-400">{t("company.insights.withheld")}</span>,
            g.reportable ? pct(g.completion) : <span key="c" className="text-slate-400">—</span>,
            g.reportable ? pct(g.workload) : <span key="w" className="text-slate-400">—</span>,
          ])}
        />
        <SuppressedNote groups={byDepartment} />
      </Card>
    </EmptyPagePlaceholder>
  );
};
