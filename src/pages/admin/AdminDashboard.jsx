/* Auto-generated during modernization refactor of Mind Elevate.
   Platform admin dashboard — this is Mind Elevate's own operations view
   for managing the companies (client organizations) provisioned on the
   platform, not a single company's internal HR view. It never drills
   into individual employee data. */

import React from "react";
import {
  AlertTriangle,
  Building2,
  ChevronRight,
  PlusCircle,
  Settings,
  UserPlus
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
} from "../../components/ui/Primitives";
import {
  Table,
  statusBadge
} from "../../components/ui/Table";
import {
  PLATFORM_STATS,
  COMPANY_GROWTH_TREND,
  PLAN_DISTRIBUTION,
  COMPANIES
} from "../../data/mockData";
import { useNavigation } from "../../navigation/NavigationContext";

const PLAN_COLORS = ["#DE3FA3", "#3346E8", "#EE8710"];

const HEALTH_LABEL = { good: "Healthy", at_risk: "At risk", suspended: "Suspended" };
const HEALTH_COLOR = { good: "teal", at_risk: "amber", suspended: "rose" };

const NeedsAttentionCard = ({ companies, onOpenCompanies }) => {
  const flagged = companies.filter((c) => c.health !== "good");
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-amber-600" /></div>
          <p className="font-semibold text-slate-900 text-sm">Companies needing attention</p>
        </div>
        <button onClick={onOpenCompanies} className="text-xs font-semibold text-indigo-600 flex items-center gap-0.5">Manage<ChevronRight className="w-3.5 h-3.5" /></button>
      </div>
      <div className="space-y-3">
        {flagged.map((c) => (
          <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><Building2 className="w-4 h-4 text-slate-400" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{c.name}</p>
              <p className="text-xs text-slate-500">{c.plan} · {c.engagement}% engagement · renews {c.renewal}</p>
            </div>
            <Badge color={HEALTH_COLOR[c.health]} className="shrink-0">{HEALTH_LABEL[c.health]}</Badge>
          </div>
        ))}
        {flagged.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No companies currently flagged.</p>}
      </div>
    </Card>
  );
};

const PlatformQuickActions = ({ onOpenCompanies, onOpenSettings }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
    <button onClick={onOpenCompanies} className="min-h-32 text-left bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-300 hover:shadow-sm transition-all">
      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3"><PlusCircle className="w-4.5 h-4.5 text-indigo-600" /></div>
      <p className="text-sm font-semibold text-slate-900">Provision a company</p>
      <p className="text-xs text-slate-500 mt-0.5">Add a new client organization to the platform</p>
    </button>
    <button onClick={onOpenCompanies} className="min-h-32 text-left bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-300 hover:shadow-sm transition-all">
      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3"><UserPlus className="w-4.5 h-4.5 text-indigo-600" /></div>
      <p className="text-sm font-semibold text-slate-900">Invite a company admin</p>
      <p className="text-xs text-slate-500 mt-0.5">Grant a client team access to manage their workspace</p>
    </button>
    <button onClick={onOpenSettings} className="min-h-32 text-left bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-300 hover:shadow-sm transition-all">
      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3"><Settings className="w-4.5 h-4.5 text-indigo-600" /></div>
      <p className="text-sm font-semibold text-slate-900">Platform settings</p>
      <p className="text-xs text-slate-500 mt-0.5">Billing, plans, and platform-wide configuration</p>
    </button>
  </div>
);

export const AdminDashboard = () => {
  const { resetTo } = useNavigation();

  return (
    <div className="space-y-6">
      <PrivacyNotice text="This view covers company accounts, plans, and platform health only. Individual employee data — reflections, coaching notes, and survey responses — is never accessible here, even to Mind Elevate staff." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PLATFORM_STATS.map((s) => <StatCard key={s.label} {...s} color="indigo" />)}
      </div>

      <PlatformQuickActions onOpenCompanies={() => resetTo("companies")} onOpenSettings={() => resetTo("settings")} />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-900 text-sm">Companies on the Platform</p>
            <Badge color="indigo">Last 6 months</Badge>
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
          <p className="font-semibold text-slate-900 text-sm mb-4">Plan Distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={PLAN_DISTRIBUTION} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                {PLAN_DISTRIBUTION.map((entry, i) => <Cell key={i} fill={PLAN_COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center flex-wrap gap-4 mt-2">
            {PLAN_DISTRIBUTION.map((t, i) => (
              <div key={t.name} className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-2 h-2 rounded-full" style={{ background: PLAN_COLORS[i] }} />{t.name}</div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <NeedsAttentionCard companies={COMPANIES} onOpenCompanies={() => resetTo("companies")} />
        <Card>
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-900 text-sm">Top Companies by Engagement</p>
            <button onClick={() => resetTo("companies")} className="text-xs font-semibold text-indigo-600 flex items-center gap-0.5">View all<ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
          <Table
            columns={["Company", "Plan", "Seats", "Engagement", "Status"]}
            rows={[...COMPANIES]
              .sort((a, b) => b.engagement - a.engagement)
              .slice(0, 5)
              .map((c) => [
                c.name,
                c.plan,
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
