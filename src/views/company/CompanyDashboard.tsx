"use client";

/* Company administrator dashboard — one company's workforce view: org structure at a
   glance, what needs placing, and aggregated (never individual) engagement. */

import React from "react";
import { useRouter } from "next/navigation";
import { Activity, BookOpen, ChevronRight, ClipboardList, MailPlus, Network, Users, UsersRound } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { slug } from "@/i18n/slug";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge, Card, PrivacyNotice, ProgressBar, StatCard } from "@/components/ui/Primitives";
import { COMPANIES, ENGAGEMENT_TREND, PIE_COLORS, THEME_PARTICIPATION } from "@/data/mockData";
import { useOrg } from "@/company/OrgContext";
import { activeLabel } from "@/company/insights";
import { ROUTES } from "@/config/routes";
import { Avatar, DepartmentBars, SuppressedNote } from "@/views/company/orgUi";

const QuickAction = ({ icon: Icon, title, desc, onClick }: { icon: typeof MailPlus; title: string; desc: string; onClick: () => void }) => (
  <button onClick={onClick} className="min-h-32 text-left bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-300 hover:shadow-sm transition-all">
    <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3"><Icon className="w-4.5 h-4.5 text-indigo-600" /></div>
    <div>
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
    </div>
  </button>
);

const StructureTile = ({ label, value, onClick, tone = "slate" }: { label: string; value: number; onClick: () => void; tone?: "slate" | "amber" }) => (
  <button onClick={onClick} className={`text-left rounded-2xl border p-4 transition-colors ${tone === "amber" && value > 0 ? "border-amber-200 bg-amber-50/60 hover:border-amber-300" : "border-slate-200 bg-white hover:border-indigo-300"}`}>
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <p className="mpp-display text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </button>
);

export const CompanyDashboard = () => {
  const router = useRouter();
  const { t, tOr } = useLanguage();
  const { people, departments, teams, insights } = useOrg();
  const { overall } = insights;
  const pct = (v: number | null) => (v === null ? "—" : `${v}%`);

  const unassigned = people.filter((p) => !p.departmentId);
  const invited = people.filter((p) => p.status === "Invited");
  /* The company's own subscription, read-only: plan changes are made by Mind Elevate. */
  const company = COMPANIES.find((c) => c.id === "acme")!;
  const seatPct = Math.round((company.seatsUsed / company.seats) * 100);

  return (
    <div className="space-y-6">
      <PrivacyNotice text={t("company.dashboard.privacy")} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Active Employees" value={activeLabel(overall) === String(overall.active) ? overall.active.toLocaleString() : activeLabel(overall)} icon={Users} color="indigo" />
        <StatCard label="Monthly Engagement" value={pct(overall.engagement)} icon={Activity} color="indigo" />
        <StatCard label="Avg. Learning Completion" value={pct(overall.completion)} icon={BookOpen} color="indigo" />
        <StatCard label="Workload Score" value={pct(overall.workload)} icon={ClipboardList} color="indigo" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StructureTile label={t("company.dashboard.people")} value={people.length} onClick={() => router.push(ROUTES.company.people)} />
        <StructureTile label={t("company.dashboard.departments")} value={departments.length} onClick={() => router.push(ROUTES.company.departments)} />
        <StructureTile label={t("company.dashboard.teams")} value={teams.length} onClick={() => router.push(ROUTES.company.teams)} />
        <StructureTile label={t("company.dashboard.needsPlacement")} value={unassigned.length} tone="amber" onClick={() => router.push(`${ROUTES.company.people}#unassigned`)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <QuickAction icon={MailPlus} title={t("company.dashboard.invite")} desc={t("company.dashboard.inviteDesc")} onClick={() => router.push(`${ROUTES.company.people}#invite`)} />
        <QuickAction icon={Network} title={t("company.dashboard.newDept")} desc={t("company.dashboard.newDeptDesc")} onClick={() => router.push(ROUTES.company.departments)} />
        <QuickAction icon={UsersRound} title={t("company.dashboard.newTeam")} desc={t("company.dashboard.newTeamDesc")} onClick={() => router.push(ROUTES.company.teams)} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-900 text-sm">{t("admin.reports.engagementOverTime")}</p>
            <Badge color="indigo">{t("admin.dashboard.last6")}</Badge>
          </div>
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
          <p className="font-semibold text-slate-900 text-sm mb-4">{t("company.dashboard.themeParticipation")}</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={THEME_PARTICIPATION} dataKey="value" innerRadius={42} outerRadius={64} paddingAngle={3}>
                {THEME_PARTICIPATION.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center flex-wrap gap-4 mt-2">
            {THEME_PARTICIPATION.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />{tOr(`data.participation.${slug(d.name)}`, d.name)}</div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <p className="font-semibold text-slate-900 text-sm mb-4">{t("admin.reports.completionByDept")}</p>
          <DepartmentBars groups={insights.byDepartment} metric="completion" color="#3346E8" />
          <SuppressedNote groups={insights.byDepartment} />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-900 text-sm">{t("company.dashboard.pendingInvites")}</p>
            <button onClick={() => router.push(ROUTES.company.people)} className="text-xs font-semibold text-indigo-600 flex items-center gap-0.5">{t("dashboard.viewAll")}<ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
          <div className="space-y-3">
            {invited.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <Avatar name={p.name} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">{p.name}</p>
                  <p className="text-xs text-slate-500 truncate">{p.email}</p>
                </div>
                <Badge color="amber">{tOr("data.status.invited", "Invited")}</Badge>
              </div>
            ))}
            {invited.length === 0 && <p className="text-sm text-slate-400 text-center py-6">{t("company.dashboard.noInvites")}</p>}
          </div>
        </Card>

        <Card>
          <p className="font-semibold text-slate-900 text-sm mb-4">{t("company.dashboard.subscription")}</p>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-600">{t("admin.companies.planName", { plan: tOr(`data.plan.${slug(company.plan)}`, company.plan) })}</p>
            <Badge color="teal">{tOr("data.status.active", "Active")}</Badge>
          </div>
          <p className="text-xs text-slate-500 mb-1">{t("admin.companies.seatsUsed")}</p>
          <ProgressBar value={seatPct} color="indigo" />
          <p className="text-xs text-slate-400 mt-1.5 mb-4">{company.seatsUsed.toLocaleString()} / {company.seats.toLocaleString()}</p>
          <p className="text-xs text-slate-500">{t("admin.companies.renews")}: <span className="font-semibold text-slate-800">{company.renewal}</span></p>
          <p className="text-xs text-slate-400 mt-3">{t("company.dashboard.subscriptionNote")}</p>
        </Card>
      </div>
    </div>
  );
};
