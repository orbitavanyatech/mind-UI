"use client";

/* Company administrator — Sessions. Schedule live sessions for this company's own people and
   aim them at everyone, one department or one team. "Eligible" is computed from who is
   currently placed there (Active people only), so it follows every placement change. */

import React, { useState } from "react";
import { CalendarPlus, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button, Card, EmptyPagePlaceholder } from "@/components/ui/Primitives";
import { Table, statusBadge } from "@/components/ui/Table";
import { SESSION_HOSTS } from "@/data/mockData";
import { useOrg } from "@/company/OrgContext";
import { audienceIsGone, audienceMembers } from "@/company/insights";
import type { SessionAudience } from "@/types";

const encode = (a: SessionAudience) => (a.kind === "everyone" ? "everyone" : `${a.kind === "department" ? "d" : "t"}:${a.id}`);
const decode = (v: string): SessionAudience => {
  if (v.startsWith("d:")) return { kind: "department", id: v.slice(2) };
  if (v.startsWith("t:")) return { kind: "team", id: v.slice(2) };
  return { kind: "everyone" };
};

const ScheduleForm = ({ onClose }: { onClose: () => void }) => {
  const { t } = useLanguage();
  const { departments, teams, scheduleSession } = useOrg();
  const [form, setForm] = useState({ title: "", host: SESSION_HOSTS[0], date: "", time: "10:00", audience: "everyone" });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date || !form.time) return;
    scheduleSession({ title: form.title.trim(), host: form.host, date: form.date, time: form.time, audience: decode(form.audience) });
    onClose();
  };

  return (
    <Card className="border-indigo-100 bg-indigo-50/40">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-slate-900 text-sm">{t("company.sessions.formTitle")}</p>
        <button onClick={onClose} aria-label={t("company.common.cancel")} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
      </div>
      <form onSubmit={submit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <label className="block sm:col-span-2 lg:col-span-1">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("company.sessions.fTitle")}</span>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className="form-input" required />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("admin.cols.host")}</span>
          <select value={form.host} onChange={(e) => set("host", e.target.value)} className="form-input bg-white">
            {SESSION_HOSTS.map((h) => <option key={h}>{h}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("company.sessions.fAudience")}</span>
          <select value={form.audience} onChange={(e) => set("audience", e.target.value)} className="form-input bg-white">
            <option value="everyone">{t("company.sessions.everyone")}</option>
            {departments.length > 0 && (
              <optgroup label={t("nav.departments")}>
                {departments.map((d) => <option key={d.id} value={`d:${d.id}`}>{d.name}</option>)}
              </optgroup>
            )}
            {teams.length > 0 && (
              <optgroup label={t("nav.teams")}>
                {teams.map((tm) => <option key={tm.id} value={`t:${tm.id}`}>{tm.name}</option>)}
              </optgroup>
            )}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("admin.cols.date")}</span>
          <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className="form-input" required />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("company.sessions.fTime")}</span>
          <input type="time" value={form.time} onChange={(e) => set("time", e.target.value)} className="form-input" required />
        </label>
        <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-1">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>{t("company.common.cancel")}</Button>
          <Button type="submit" size="sm" icon={CalendarPlus}>{t("admin.sessions.schedule")}</Button>
        </div>
      </form>
    </Card>
  );
};

export const CompanySessionsPage = () => {
  const { t, lang } = useLanguage();
  const { people, departments, teams, sessions, cancelSession } = useOrg();
  const [showForm, setShowForm] = useState(false);

  const when = (date: string, time: string) =>
    new Date(`${date}T${time}`).toLocaleString(lang === "nl" ? "nl-NL" : "en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

  const audienceLabel = (a: SessionAudience) => {
    if (audienceIsGone(a, departments, teams)) return t("company.sessions.removedGroup");
    if (a.kind === "everyone") return t("company.sessions.everyone");
    return (a.kind === "department" ? departments.find((d) => d.id === a.id)?.name : teams.find((tm) => tm.id === a.id)?.name) ?? "—";
  };

  /* Upcoming first (soonest on top), cancelled sessions last. */
  const ordered = [...sessions].sort((a, b) => {
    if ((a.status === "Cancelled") !== (b.status === "Cancelled")) return a.status === "Cancelled" ? 1 : -1;
    return `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`);
  });

  return (
    <EmptyPagePlaceholder
      title={t("admin.sessions.title")}
      desc={t("company.sessions.desc")}
      action={<Button size="sm" icon={CalendarPlus} onClick={() => setShowForm((v) => !v)}>{t("admin.sessions.schedule")}</Button>}
    >
      {showForm && <ScheduleForm onClose={() => setShowForm(false)} />}
      <Card>
        {ordered.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-10">{t("company.sessions.empty")}</p>
        ) : (
          <Table
            columns={[t("admin.cols.session"), t("admin.cols.host"), t("admin.cols.date"), t("company.sessions.colAudience"), t("company.sessions.colEligible"), t("admin.cols.status"), ""]}
            rows={ordered.map((s) => {
              const cancelled = s.status === "Cancelled";
              const dim = cancelled ? "text-slate-400" : "";
              return [
                <span key="t" className={`font-medium ${cancelled ? "text-slate-400 line-through" : "text-slate-800"}`}>{s.title}</span>,
                <span key="h" className={dim}>{s.host}</span>,
                <span key="d" className={dim}>{when(s.date, s.time)}</span>,
                <span key="a" className={dim}>{audienceLabel(s.audience)}</span>,
                <span key="e" className={dim}>{cancelled ? "—" : audienceMembers(people, s.audience).length}</span>,
                statusBadge(s.status),
                cancelled ? null : (
                  <button key="x" onClick={() => cancelSession(s.id)} className="text-xs font-semibold text-slate-500 hover:text-rose-600">{t("company.sessions.cancel")}</button>
                ),
              ];
            })}
          />
        )}
      </Card>
    </EmptyPagePlaceholder>
  );
};
