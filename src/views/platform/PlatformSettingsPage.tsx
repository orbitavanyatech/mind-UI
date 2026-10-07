"use client";

/* Platform administrator — Settings. Platform-wide integrations, the privacy guarantees
   every company inherits, and subscription defaults. A company's own organization
   profile is edited by its company administrator, not here. */

import React, { useState } from "react";
import { Building2, CalendarClock, Settings, Video } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge, Card, EmptyPagePlaceholder } from "@/components/ui/Primitives";
import { ANNUAL_DISCOUNT } from "@/data/mockData";

const INTEGRATIONS = [
  { key: "zoom", name: "Zoom", desc: "admin.settings.int.zoom", icon: Video, connected: true },
  { key: "calendly", name: "Calendly", desc: "admin.settings.int.calendly", icon: CalendarClock, connected: true },
  { key: "hubspot", name: "HubSpot", desc: "admin.settings.int.hubspot", icon: Building2, connected: true },
];

const IntegrationsCard = () => {
  const { t } = useLanguage();
  const [state, setState] = useState(INTEGRATIONS);
  const toggle = (key: string) => setState((s) => s.map((i) => (i.key === key ? { ...i, connected: !i.connected } : i)));
  return (
    <Card>
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center"><Settings className="w-4.5 h-4.5 text-teal-600" /></div>
        <p className="font-semibold text-slate-900 text-sm">{t("admin.settings.integrations")}</p>
      </div>
      <p className="text-xs text-slate-500 mb-4">{t("admin.settings.integrationsDesc")}</p>
      <div className="divide-y divide-slate-100">
        {state.map((i) => (
          <div key={i.key} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><i.icon className="w-4.5 h-4.5 text-slate-500" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">{i.name}</p>
              <p className="text-xs text-slate-500">{t(i.desc)}</p>
            </div>
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
  );
};

export const PlatformSettingsPage = () => {
  const { t } = useLanguage();
  return (
    <EmptyPagePlaceholder title={t("admin.settings.title")} desc={t("platform.settings.desc")}>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <p className="font-semibold text-slate-900 text-sm mb-4">{t("platform.settings.billingDefaults")}</p>
          <div className="space-y-4 text-sm">
            {[
              [t("platform.settings.currency"), "USD"],
              [t("platform.settings.trialLength"), t("platform.settings.trialLengthValue")],
              [t("platform.settings.annualDiscount"), `${Math.round(ANNUAL_DISCOUNT * 100)}%`],
            ].map(([l, v]) => (
              <div key={l} className="flex items-center justify-between"><span className="text-slate-600">{l}</span><Badge color="indigo">{v}</Badge></div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="font-semibold text-slate-900 text-sm mb-1">{t("admin.settings.privacyTitle")}</p>
          <p className="text-xs text-slate-500 mb-4">{t("platform.settings.privacyDesc")}</p>
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
        <div className="lg:col-span-2">
          <IntegrationsCard />
        </div>
      </div>
    </EmptyPagePlaceholder>
  );
};
