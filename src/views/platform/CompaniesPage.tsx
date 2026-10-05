"use client";

/* Platform administrator — manage every company (client organization) provisioned
   on Mind Elevate: provisioning, seats, engagement, and account status. Plans and
   billing are changed on the Subscriptions page. */

import { slug } from "@/i18n/slug";
import { useLanguage } from "@/i18n/LanguageContext";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Ban,
  Building2,
  CheckCircle2,
  PlusCircle,
  Search,
  X
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyPagePlaceholder,
  ProgressBar
} from "@/components/ui/Primitives";
import { statusBadge } from "@/components/ui/Table";
import { PLANS } from "@/data/mockData";
import { usePlatform, type NewCompany } from "@/platform/PlatformContext";
import { ROUTES } from "@/config/routes";
import type { BillingCycle, Company, PlanName } from "@/types";

const STATUS_FILTERS = ["All", "Active", "Trial", "At Risk", "Suspended"];
const BILLING_OPTIONS: BillingCycle[] = ["Monthly", "Annual"];

const AddCompanyForm = ({ onCancel, onCreate }: { onCancel: () => void; onCreate: (company: NewCompany) => void }) => {
  const { t, tOr } = useLanguage();
  const [name, setName] = useState("");
  const [plan, setPlan] = useState<PlanName>("Growth");
  const [seats, setSeats] = useState("250");
  const [billing, setBilling] = useState<BillingCycle>("Monthly");
  const [adminEmail, setAdminEmail] = useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), plan, seats: Number(seats) || 1, billing, adminEmail: adminEmail.trim() });
  };

  return (
    <Card className="border-indigo-100 bg-indigo-50/40">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-slate-900 text-sm">{t("admin.companies.formTitle")}</p>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
      </div>
      <form onSubmit={submit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <label className="block sm:col-span-1">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("admin.companies.name")}</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("admin.companies.namePlaceholder")} className="form-input" required />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("admin.companies.plan")}</span>
          <select value={plan} onChange={(e) => setPlan(e.target.value as PlanName)} className="form-input bg-white">
            {PLANS.map((p) => <option key={p.name} value={p.name}>{tOr(`data.plan.${slug(p.name)}`, p.name)}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("admin.companies.seats")}</span>
          <input type="number" min="1" value={seats} onChange={(e) => setSeats(e.target.value)} className="form-input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("platform.subscriptions.billing")}</span>
          <select value={billing} onChange={(e) => setBilling(e.target.value as BillingCycle)} className="form-input bg-white">
            {BILLING_OPTIONS.map((b) => <option key={b} value={b}>{tOr(`data.billing.${slug(b)}`, b)}</option>)}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("platform.companies.adminEmail")}</span>
          <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="hr@contoso.com" className="form-input" />
          <span className="mt-1 block text-xs text-slate-400">{t("platform.companies.adminEmailHint")}</span>
        </label>
        <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-1">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>{t("admin.companies.cancel")}</Button>
          <Button type="submit" size="sm">{t("admin.companies.create")}</Button>
        </div>
      </form>
    </Card>
  );
};

const CompanyCard = ({ company, onToggleSuspend, onManage }: { company: Company; onToggleSuspend: (id: string) => void; onManage: (id: string) => void }) => {
  const { t, tOr } = useLanguage();
  const pct = company.seats > 0 ? Math.round((company.seatsUsed / company.seats) * 100) : 0;
  const isSuspended = company.status === "Suspended";
  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0"><Building2 className="w-5 h-5 text-indigo-600" /></div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">{company.name}</p>
            <p className="text-xs text-slate-500">{t("admin.companies.planName", { plan: tOr(`data.plan.${slug(company.plan)}`, company.plan) })}</p>
          </div>
        </div>
        {statusBadge(company.status)}
      </div>

      <p className="text-xs text-slate-500 mb-1">{t("admin.companies.seatsUsed")}</p>
      <ProgressBar value={pct} color="indigo" />
      <p className="text-xs text-slate-400 mt-1.5 mb-4">{company.seatsUsed.toLocaleString()} / {company.seats.toLocaleString()}</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">{t("admin.companies.engagement")}</p>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{company.engagement}%</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">{t("admin.companies.renews")}</p>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{company.renewal}</p>
        </div>
      </div>

      <div className="mt-auto flex gap-2">
        <Button size="sm" variant="outline" className="flex-1" onClick={() => onManage(company.id)}>{t("platform.companies.manageSubscription")}</Button>
        <Button
          size="sm"
          variant={isSuspended ? "primary" : "outline"}
          icon={isSuspended ? CheckCircle2 : Ban}
          className={isSuspended ? "" : "!text-rose-600 !border-rose-200 hover:!bg-rose-50"}
          onClick={() => onToggleSuspend(company.id)}
        >
          {isSuspended ? t("admin.companies.reactivate") : t("admin.companies.suspend")}
        </Button>
      </div>
    </Card>
  );
};

export const CompaniesPage = () => {
  const { t, tOr } = useLanguage();
  const router = useRouter();
  const { companies, createCompany: create, toggleSuspend } = usePlatform();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const matchesQuery = c.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [companies, query, statusFilter]);

  const createCompany = (input: NewCompany) => {
    create(input);
    setShowAddForm(false);
  };

  return (
    <EmptyPagePlaceholder
      title={t("admin.companies.title")}
      desc={t("admin.companies.desc")}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("admin.companies.search")}
            className="form-input pl-9"
          />
        </div>
        <Button icon={PlusCircle} onClick={() => setShowAddForm((v) => !v)} className="shrink-0">
          {t("admin.companies.add")}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${statusFilter === s ? "bg-indigo-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {tOr(`data.${s === "All" ? "filter" : "status"}.${slug(s)}`, s)}
          </button>
        ))}
        <span className="text-xs text-slate-400 ml-1">{t("admin.companies.count", { shown: filtered.length, total: companies.length })}</span>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <AddCompanyForm onCancel={() => setShowAddForm(false)} onCreate={createCompany} />
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => <CompanyCard key={c.id} company={c} onToggleSuspend={toggleSuspend} onManage={(id) => router.push(`${ROUTES.platform.subscriptions}#${id}`)} />)}
        </div>
      ) : (
        <Card className="text-center py-10">
          <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">{t("admin.companies.noMatch")}</p>
          <p className="text-xs text-slate-500 mt-1">{t("admin.companies.noMatchDesc")}</p>
        </Card>
      )}
    </EmptyPagePlaceholder>
  );
};
