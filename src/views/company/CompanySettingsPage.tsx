"use client";

/* Company administrator — Settings. Organization profile, the privacy guarantees that
   apply to this company, and calendar connections for its employees. Plan, seats and
   billing are owned by the platform administrator and shown read-only. */

import React, { useState } from "react";
import { Calendar, Settings } from "lucide-react";
import { slug } from "@/i18n/slug";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge, Card, EmptyPagePlaceholder } from "@/components/ui/Primitives";
import { COMPANIES } from "@/data/mockData";

const CALENDARS = [
  { key: "google", name: "Google Calendar", connected: false },
  { key: "outlook", name: "Outlook Calendar", connected: true },
  { key: "apple", name: "Apple Calendar / iCal", connected: false },
];

export const CompanySettingsPage = () => {
  const { t, tOr } = useLanguage();
  const [calendars, setCalendars] = useState(CALENDARS);
  const company = COMPANIES.find((c) => c.id === "acme")!;
  const toggle = (key: string) => setCalendars((s) => s.map((i) => (i.key === key ? { ...i, connected: !i.connected } : i)));

  return (
    <EmptyPagePlaceholder title={t("admin.settings.title")} desc={t("company.settings.desc")}>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <p className="font-semibold text-slate-900 text-sm mb-4">{t("admin.settings.organization")}</p>
          <div className="space-y-4">
            {[[t("admin.settings.orgName"), "Acme Corp"], [t("admin.settings.domain"), "acme.com"], [t("admin.settings.timezone"), "IST (UTC+5:30)"]].map(([l, v]) => (
              <div key={l}><label className="text-xs font-semibold text-slate-500">{l}</label><input defaultValue={v} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-300 text-sm" /></div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="font-semibold text-slate-900 text-sm mb-4">{t("company.settings.subscription")}</p>
          <div className="space-y-4 text-sm">
            {[
              [t("admin.cols.plan"), tOr(`data.plan.${slug(company.plan)}`, company.plan)],
              [t("admin.cols.seats"), `${company.seatsUsed.toLocaleString()} / ${company.seats.toLocaleString()}`],
              [t("platform.subscriptions.billing"), tOr(`data.billing.${slug(company.billing)}`, company.billing)],
              [t("admin.companies.renews"), company.renewal],
            ].map(([l, v]) => (
              <div key={l} className="flex items-center justify-between"><span className="text-slate-600">{l}</span><Badge color="indigo">{v}</Badge></div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-5">{t("company.settings.subscriptionNote")}</p>
        </Card>

        <Card>
          <p className="font-semibold text-slate-900 text-sm mb-4">{t("admin.settings.privacyTitle")}</p>
          <div className="space-y-4">
            {[
              { label: t("admin.settings.minGroup"), value: t("admin.settings.minGroupValue") },
              { label: t("admin.settings.indivData"), value: t("admin.settings.never") },
              { label: t("admin.settings.coachingNotes"), value: t("admin.settings.never") },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{r.label}</span>
                <Badge color="indigo">{r.value}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center"><Settings className="w-4.5 h-4.5 text-teal-600" /></div>
            <p className="font-semibold text-slate-900 text-sm">{t("company.settings.calendars")}</p>
          </div>
          <p className="text-xs text-slate-500 mb-4">{t("admin.settings.int.calendar")}</p>
          <div className="divide-y divide-slate-100">
            {calendars.map((i) => (
              <div key={i.key} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><Calendar className="w-4.5 h-4.5 text-slate-500" /></div>
                <p className="flex-1 text-sm font-medium text-slate-900">{i.name}</p>
                <button
                  onClick={() => toggle(i.key)}
                  className={`shrink-0 text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors ${i.connected ? "bg-teal-50 text-teal-700 hover:bg-teal-100" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {i.connected ? t("admin.settings.connected") : t("admin.settings.connect")}
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </EmptyPagePlaceholder>
  );
};
