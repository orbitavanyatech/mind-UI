"use client";

/* Platform administrator dashboard — Mind Elevate's own operations view for the companies
   (client organizations) and subscriptions on the platform. It is not a company's internal
   HR view (that is the company administrator's dashboard) and never drills into
   individual employee data. */

import { slug } from "@/i18n/slug";
import { useLanguage } from "@/i18n/LanguageContext";
import React from "react";
import {
  AlertTriangle,
  Building2,
  ChevronRight,
  PlusCircle,
  Settings,
  CreditCard
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Badge,
  Card,
  StatCard,
  PrivacyNotice,
  ProgressBar,
  Button
} from "@/components/ui/Primitives";
import {
  Table,
  statusBadge
} from "@/components/ui/Table";
import {
  PLATFORM_STATS,
  COMPANY_GROWTH_TREND,
  PLAN_DISTRIBUTION
} from "@/data/mockData";
import { usePlatform } from "@/platform/PlatformContext";
import { useRouter } from "next/navigation";
import type { Company, CompanyHealth, Tone } from "@/types";
import { ROUTES } from "@/config/routes";

const PLAN_COLORS = ["#DE3FA3", "#3346E8", "#EE8710"];

const HEALTH_COLOR: Record<CompanyHealth, Tone> = { good: "teal", at_risk: "amber", suspended: "rose" };

const NeedsAttentionCard = ({ companies, onOpenCompanies }: { companies: Company[]; onOpenCompanies: () => void }) => {
  const { t, tOr } = useLanguage();
  const flagged = companies.filter((c) => c.health !== "good");
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-amber-600" /></div>
          <p className="font-semibold text-slate-900 text-sm">{t("admin.dashboard.attention")}</p>
        </div>
        <button onClick={onOpenCompanies} className="text-xs font-semibold text-indigo-600 flex items-center gap-0.5">{t("admin.dashboard.manage")}<ChevronRight className="w-3.5 h-3.5" /></button>
      </div>
      <div className="space-y-3">
        {flagged.map((c) => (
          <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><Building2 className="w-4 h-4 text-slate-400" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{c.name}</p>
              <p className="text-xs text-slate-500">{t("admin.dashboard.attentionMeta", { plan: tOr(`data.plan.${slug(c.plan)}`, c.plan), engagement: c.engagement, renewal: c.renewal })}</p>
            </div>
            <Badge color={HEALTH_COLOR[c.health]} className="shrink-0">{t(`data.health.${c.health}`)}</Badge>
          </div>
        ))}
        {flagged.length === 0 && <p className="text-sm text-slate-400 text-center py-6">{t("admin.dashboard.noneFlagged")}</p>}
      </div>
    </Card>
  );
};

const PlatformQuickActions = ({ onOpenCompanies, onOpenSubscriptions, onOpenSettings }: { onOpenCompanies: () => void; onOpenSubscriptions: () => void; onOpenSettings: () => void }) => {
  const { t } = useLanguage();
  return (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
    <button onClick={onOpenCompanies} className="min-h-32 text-left bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-300 hover:shadow-sm transition-all">
      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3"><PlusCircle className="w-4.5 h-4.5 text-indigo-600" /></div>
      <p className="text-sm font-semibold text-slate-900">{t("admin.dashboard.provision")}</p>
      <p className="text-xs text-slate-500 mt-0.5">{t("admin.dashboard.provisionDesc")}</p>
    </button>
    <button onClick={onOpenSubscriptions} className="min-h-32 text-left bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-300 hover:shadow-sm transition-all">
      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3"><CreditCard className="w-4.5 h-4.5 text-indigo-600" /></div>
      <p className="text-sm font-semibold text-slate-900">{t("platform.dashboard.subscriptions")}</p>
      <p className="text-xs text-slate-500 mt-0.5">{t("platform.dashboard.subscriptionsDesc")}</p>
    </button>
    <button onClick={onOpenSettings} className="min-h-32 text-left bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-300 hover:shadow-sm transition-all">
      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3"><Settings className="w-4.5 h-4.5 text-indigo-600" /></div>
      <p className="text-sm font-semibold text-slate-900">{t("admin.dashboard.platformSettings")}</p>
      <p className="text-xs text-slate-500 mt-0.5">{t("admin.dashboard.platformSettingsDesc")}</p>
    </button>
  </div>
  );
};

export const PlatformDashboard = () => {
  const router = useRouter();
  const { t, tOr } = useLanguage();
  const { companies } = usePlatform();

  return (
    <div className="space-y-6">
      <PrivacyNotice text={t("admin.dashboard.privacy")} />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PLATFORM_STATS.map((s) => <StatCard key={s.label} {...s} color="indigo" />)}
      </div>

      <PlatformQuickActions onOpenCompanies={() => router.push(ROUTES.platform.companies)} onOpenSubscriptions={() => router.push(ROUTES.platform.subscriptions)} onOpenSettings={() => router.push(ROUTES.platform.settings)} />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-900 text-sm">{t("admin.dashboard.companiesOnPlatform")}</p>
            <Badge color="indigo">{t("admin.dashboard.last6")}</Badge>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={COMPANY_GROWTH_TREND}>
              <defs>
                <linearGradient id="companyGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DE3FA3" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#DE3FA3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F2" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9AA2AB" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9AA2AB" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="companies" stroke="#DE3FA3" fill="url(#companyGrowth)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <p className="font-semibold text-slate-900 text-sm mb-4">{t("admin.dashboard.planDistribution")}</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={PLAN_DISTRIBUTION} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                {PLAN_DISTRIBUTION.map((entry, i) => <Cell key={i} fill={PLAN_COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center flex-wrap gap-4 mt-2">
            {PLAN_DISTRIBUTION.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2 h-2 rounded-full" style={{ background: PLAN_COLORS[i] }} />{tOr(`data.plan.${slug(d.name)}`, d.name)}</div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <NeedsAttentionCard companies={companies} onOpenCompanies={() => router.push(ROUTES.platform.companies)} />
        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-900 text-sm">{t("admin.dashboard.topCompanies")}</p>
            <button onClick={() => router.push(ROUTES.platform.companies)} className="text-xs font-semibold text-indigo-600 flex items-center gap-0.5">{t("dashboard.viewAll")}<ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
          <Table
            columns={[t("admin.cols.company"), t("admin.cols.plan"), t("admin.cols.seats"), t("admin.cols.engagement"), t("admin.cols.status")]}
            rows={[...companies]
              .sort((a, b) => b.engagement - a.engagement)
              .slice(0, 5)
              .map((c) => [
                c.name,
                tOr(`data.plan.${slug(c.plan)}`, c.plan),
                `${c.seatsUsed.toLocaleString()} / ${c.seats.toLocaleString()}`,
                <div key="eng" className="w-24"><ProgressBar value={c.engagement} color="indigo" /></div>,
                statusBadge(c.status),
              ])}
          />
        </Card>
      </div>
    </div>
  );
};
