"use client";

/* Platform administrator — Subscriptions.
   Plans, seats and billing for every client company. This is where Mind Elevate changes a
   company's plan, adjusts contracted seats, switches billing cycle, converts a trial, or
   suspends access. MRR is recomputed from list price (annual billing is discounted). */

import React, { useEffect, useMemo, useState } from "react";
import { Ban, Building2, CheckCircle2, CircleDollarSign, CreditCard, Hourglass, TrendingUp, X } from "lucide-react";
import { slug } from "@/i18n/slug";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge, Button, Card, EmptyPagePlaceholder, StatCard } from "@/components/ui/Primitives";
import { Table, statusBadge } from "@/components/ui/Table";
import { ANNUAL_DISCOUNT, PLANS } from "@/data/mockData";
import { computeMrr, usePlatform } from "@/platform/PlatformContext";
import type { BillingCycle, PlanName } from "@/types";

const STATUS_FILTERS = ["All", "Active", "Trial", "At Risk", "Suspended"];
const BILLING_OPTIONS: BillingCycle[] = ["Monthly", "Annual"];

const usd = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const SubscriptionsPage = () => {
  const { t, tOr } = useLanguage();
  const { companies, changePlan, changeSeats, changeBilling, activateSubscription, toggleSuspend } = usePlatform();
  const [statusFilter, setStatusFilter] = useState("All");
  const [managingId, setManagingId] = useState<string | null>(null);
  const [seatsDraft, setSeatsDraft] = useState("");

  /* Deep link from the Companies page: /platform/subscriptions#<companyId>. */
  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (id) setManagingId(id);
  }, []);

  const managing = companies.find((c) => c.id === managingId) ?? null;
  useEffect(() => { if (managing) setSeatsDraft(String(managing.seats)); }, [managing?.id, managing?.seats]); // eslint-disable-line react-hooks/exhaustive-deps

  const paying = companies.filter((c) => c.mrr > 0);
  const mrr = paying.reduce((sum, c) => sum + c.mrr, 0);
  const trials = companies.filter((c) => c.status === "Trial").length;

  const rows = useMemo(
    () => companies.filter((c) => statusFilter === "All" || c.status === statusFilter),
    [companies, statusFilter],
  );

  const onPlanChange = (plan: PlanName) => {
    if (!managing) return;
    changePlan(managing.id, plan);
    const min = PLANS.find((p) => p.name === plan)?.minSeats ?? 1;
    if (managing.seats < min) changeSeats(managing.id, min); // keep the contract within the plan's minimum
  };

  const planMin = managing ? PLANS.find((p) => p.name === managing.plan)?.minSeats ?? 1 : 1;
  const draftSeats = Number(seatsDraft) || 0;
  const seatsError = managing
    ? draftSeats < managing.seatsUsed
      ? t("platform.subscriptions.seatsBelowUsed", { n: managing.seatsUsed.toLocaleString() })
      : draftSeats < planMin
        ? t("platform.subscriptions.seatsBelowMin", { n: planMin.toLocaleString() })
        : ""
    : "";

  return (
    <EmptyPagePlaceholder title={t("platform.subscriptions.title")} desc={t("platform.subscriptions.desc")}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label={t("platform.subscriptions.mrr")} value={usd(mrr)} icon={CircleDollarSign} color="indigo" />
        <StatCard label={t("platform.subscriptions.arr")} value={usd(mrr * 12)} icon={TrendingUp} color="indigo" />
        <StatCard label={t("platform.subscriptions.paying")} value={String(paying.length)} icon={CreditCard} color="indigo" />
        <StatCard label={t("platform.subscriptions.trials")} value={String(trials)} icon={Hourglass} color="indigo" />
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {PLANS.map((plan) => {
          const count = companies.filter((c) => c.plan === plan.name).length;
          return (
            <Card key={plan.name}>
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-slate-900">{tOr(`data.plan.${slug(plan.name)}`, plan.name)}</p>
                <Badge color="indigo">{t("platform.subscriptions.companiesOnPlan", { n: count })}</Badge>
              </div>
              <p className="mpp-display text-2xl font-bold text-slate-900">{usd(plan.pricePerSeat)}<span className="text-sm font-medium text-slate-400"> {t("platform.subscriptions.perSeat")}</span></p>
              <p className="text-xs text-slate-400 mt-1 mb-4">{t("platform.subscriptions.minSeats", { n: plan.minSeats.toLocaleString() })}</p>
              <ul className="space-y-2 text-xs text-slate-600">
                {plan.features.map((_, i) => (
                  <li key={i} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />{t(`platform.plans.${slug(plan.name)}.${i}`)}</li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
      <p className="text-xs text-slate-400 -mt-2">{t("platform.subscriptions.annualNote", { pct: Math.round(ANNUAL_DISCOUNT * 100) })}</p>

      {managing && (
        <Card className="border-indigo-100 bg-indigo-50/40">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0"><Building2 className="w-5 h-5 text-indigo-600" /></div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{t("platform.subscriptions.manageTitle", { name: managing.name })}</p>
                <div className="mt-1">{statusBadge(managing.status)}</div>
              </div>
            </div>
            <button onClick={() => setManagingId(null)} aria-label={t("company.common.cancel")} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("admin.cols.plan")}</span>
              <select value={managing.plan} onChange={(e) => onPlanChange(e.target.value as PlanName)} className="form-input bg-white">
                {PLANS.map((p) => <option key={p.name} value={p.name}>{tOr(`data.plan.${slug(p.name)}`, p.name)} · {usd(p.pricePerSeat)} {t("platform.subscriptions.perSeat")}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("platform.subscriptions.contractedSeats")}</span>
              <div className="flex gap-2">
                <input type="number" min={managing.seatsUsed} value={seatsDraft} onChange={(e) => setSeatsDraft(e.target.value)} className="form-input" />
                <Button size="sm" variant="outline" disabled={Boolean(seatsError) || draftSeats === managing.seats} onClick={() => changeSeats(managing.id, draftSeats)}>{t("platform.subscriptions.apply")}</Button>
              </div>
              <span className={`mt-1 block text-xs ${seatsError ? "text-rose-600" : "text-slate-400"}`}>{seatsError || t("platform.subscriptions.seatsInUse", { n: managing.seatsUsed.toLocaleString() })}</span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("platform.subscriptions.billing")}</span>
              <select value={managing.billing} onChange={(e) => changeBilling(managing.id, e.target.value as BillingCycle)} className="form-input bg-white">
                {BILLING_OPTIONS.map((b) => <option key={b} value={b}>{tOr(`data.billing.${slug(b)}`, b)}</option>)}
              </select>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-5 border-t border-indigo-100">
            <p className="text-sm text-slate-600">
              {t("platform.subscriptions.listPrice")}{" "}
              <span className="font-semibold text-slate-900">{usd(computeMrr(managing.plan, managing.seats, managing.billing))}{t("platform.subscriptions.perMonth")}</span>
              {managing.mrr === 0 && <span className="text-slate-400"> · {t("platform.subscriptions.notBilling")}</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              {managing.status === "Trial" && <Button size="sm" icon={CheckCircle2} onClick={() => activateSubscription(managing.id)}>{t("platform.subscriptions.activate")}</Button>}
              <Button
                size="sm"
                variant={managing.status === "Suspended" ? "primary" : "outline"}
                icon={managing.status === "Suspended" ? CheckCircle2 : Ban}
                className={managing.status === "Suspended" ? "" : "!text-rose-600 !border-rose-200 hover:!bg-rose-50"}
                onClick={() => toggleSuspend(managing.id)}
              >
                {managing.status === "Suspended" ? t("admin.companies.reactivate") : t("admin.companies.suspend")}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${statusFilter === s ? "bg-indigo-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {tOr(`data.${s === "All" ? "filter" : "status"}.${slug(s)}`, s)}
            </button>
          ))}
          <span className="text-xs text-slate-400 ml-1">{t("admin.companies.count", { shown: rows.length, total: companies.length })}</span>
        </div>
        <Table
          columns={[t("admin.cols.company"), t("admin.cols.plan"), t("admin.cols.seats"), t("platform.subscriptions.billing"), t("platform.subscriptions.mrrCol"), t("admin.companies.renews"), t("admin.cols.status"), ""]}
          rows={rows.map((c) => [
            <span key="n" className="font-medium text-slate-800">{c.name}</span>,
            tOr(`data.plan.${slug(c.plan)}`, c.plan),
            `${c.seatsUsed.toLocaleString()} / ${c.seats.toLocaleString()}`,
            tOr(`data.billing.${slug(c.billing)}`, c.billing),
            c.mrr > 0 ? usd(c.mrr) : "—",
            c.renewal,
            statusBadge(c.status),
            <Button key="m" size="sm" variant={managingId === c.id ? "subtle" : "outline"} onClick={() => { setManagingId(c.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}>{t("admin.dashboard.manage")}</Button>,
          ])}
        />
      </Card>
    </EmptyPagePlaceholder>
  );
};
