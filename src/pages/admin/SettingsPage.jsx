/* Auto-generated during modernization refactor of Mind Elevate */

import React, { useState } from "react";
import {
  Building2,
  Calendar,
  CalendarClock,
  Settings,
  Video
} from "lucide-react";
import {
  Badge,
  Card,
  EmptyPagePlaceholder
} from "../../components/ui/Primitives";

const INTEGRATIONS = [
  { key: "zoom", name: "Zoom", desc: "Powers live group sessions and 1:1 coaching calls.", icon: Video, connected: true },
  { key: "calendly", name: "Calendly", desc: "Confidential leadership coaching booking — never stored in the platform.", icon: CalendarClock, connected: true },
  { key: "hubspot", name: "HubSpot", desc: "Syncs company and workspace data for account management.", icon: Building2, connected: true },
  { key: "google", name: "Google Calendar", desc: "Lets employees add sessions and milestones to their calendar.", icon: Calendar, connected: false },
  { key: "outlook", name: "Outlook Calendar", desc: "Lets employees add sessions and milestones to their calendar.", icon: Calendar, connected: true },
  { key: "apple", name: "Apple Calendar / iCal", desc: "Lets employees add sessions and milestones to their calendar.", icon: Calendar, connected: false },
];

const IntegrationsCard = () => {
  const [state, setState] = useState(INTEGRATIONS);
  const toggle = (key) => setState((s) => s.map((i) => (i.key === key ? { ...i, connected: !i.connected } : i)));
  return (
    <Card>
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center"><Settings className="w-4.5 h-4.5 text-teal-600" /></div>
        <p className="font-semibold text-slate-900 text-sm">Integrations</p>
      </div>
      <p className="text-xs text-slate-500 mb-4">Core connections that power scheduling, coaching, and account management across the platform.</p>
      <div className="divide-y divide-slate-100">
        {state.map((i) => (
          <div key={i.key} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><i.icon className="w-4.5 h-4.5 text-slate-500" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">{i.name}</p>
              <p className="text-xs text-slate-500">{i.desc}</p>
            </div>
            <button
              onClick={() => toggle(i.key)}
              className={`shrink-0 text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors ${i.connected ? "bg-teal-50 text-teal-700 hover:bg-teal-100" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {i.connected ? "Connected" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const SettingsPage = () => (
  <EmptyPagePlaceholder title="Settings" desc="Organization configuration, integrations, and data governance controls.">
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <p className="font-semibold text-slate-900 text-sm mb-4">Organization</p>
        <div className="space-y-4">
          {[["Organization Name", "Acme Corp"], ["Primary Domain", "acme.com"], ["Default Time Zone", "IST (UTC+5:30)"]].map(([l, v]) => (
            <div key={l}><label className="text-xs font-semibold text-slate-500">{l}</label><input defaultValue={v} className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-300 text-sm" /></div>
          ))}
        </div>
      </Card>
      <Card>
        <p className="font-semibold text-slate-900 text-sm mb-4">Privacy & Data Governance</p>
        <div className="space-y-4">
          {[
            { label: "Minimum group size for reports", value: "5 respondents" },
            { label: "Individual data visible to admins", value: "Never" },
            { label: "Coaching notes visible to org", value: "Never" },
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
