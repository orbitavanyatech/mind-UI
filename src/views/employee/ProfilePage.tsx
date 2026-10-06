"use client";

import React, { useState, type ReactNode } from "react";
import { Bell, Check, ShieldCheck, UserRound } from "lucide-react";
import { Badge, Button, Card, EmptyPagePlaceholder } from "@/components/ui/Primitives";
import { ROLE_META } from "@/config/nav";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCurrentUser } from "@/auth/AuthContext";
import type { User } from "@/types";

const avatarStyles: Record<string, string> = { teal: "bg-teal-600", violet: "bg-violet-600", indigo: "bg-indigo-600" };

interface ProfileForm {
  name: string;
  title: string;
  team: string;
  timezone: string;
  emailReminders: boolean;
  weeklyDigest: boolean;
}

const ProfilePageView = ({ user }: { user: User }) => {
  const meta = ROLE_META[user.role];
  const { t } = useLanguage();
  const [form, setForm] = useState<ProfileForm>({ name: user.name, title: user.title, team: user.team, timezone: "IST (UTC+5:30)", emailReminders: true, weeklyDigest: false });
  const [saved, setSaved] = useState(false);
  const update = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const save = () => { setSaved(true); window.setTimeout(() => setSaved(false), 3000); };

  return (
    <EmptyPagePlaceholder title={t("profile.title")} desc={t("profile.desc")}>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <Card className="text-center">
            <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${avatarStyles[meta.color]} text-3xl font-bold text-white ring-8 ring-teal-50`}>{user.initials}</div>
            <h2 className="mpp-display mt-5 text-xl font-bold text-slate-900">{form.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{form.title}</p>
            <Badge color="teal" className="mt-4">{t(meta.label)}</Badge>
            <div className="mt-6 border-t border-slate-100 pt-5 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t("profile.workspace")}</p>
              <p className="mt-1.5 text-sm font-semibold text-slate-800">Acme Corp</p>
              <p className="mt-0.5 text-xs text-slate-500">{t("profile.team", { team: form.team })}</p>
            </div>
          </Card>
          <div className="flex gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
            <p className="text-xs leading-relaxed text-indigo-900">{t("profile.private")}</p>
          </div>
        </aside>

        <div className="space-y-6">
          <Card>
            <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
              <div className="rounded-xl bg-teal-50 p-2.5 text-teal-700"><UserRound className="h-5 w-5" /></div>
              <div><h2 className="text-base font-bold text-slate-900">{t("profile.personal")}</h2><p className="mt-1 text-sm text-slate-500">{t("profile.personalDesc")}</p></div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label={t("profile.fullName")}><input value={form.name} onChange={(event) => update("name", event.target.value)} className="form-input" /></Field>
              <Field label={t("profile.jobTitle")}><input value={form.title} onChange={(event) => update("title", event.target.value)} className="form-input" /></Field>
              <Field label={t("profile.teamLabel")}><input value={form.team} onChange={(event) => update("team", event.target.value)} className="form-input" /></Field>
              <Field label={t("profile.timezone")}><select value={form.timezone} onChange={(event) => update("timezone", event.target.value)} className="form-input bg-white"><option>IST (UTC+5:30)</option><option>GMT (UTC+0)</option><option>CET (UTC+1)</option><option>EST (UTC-5)</option></select></Field>
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500"><ShieldCheck className="h-4 w-4 shrink-0 text-slate-400" />{t("profile.roleManaged")}</div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700"><Bell className="h-5 w-5" /></div>
              <div><h2 className="text-base font-bold text-slate-900">{t("profile.notifications")}</h2><p className="mt-1 text-sm text-slate-500">{t("profile.notificationsDesc")}</p></div>
            </div>
            <div className="mt-5 divide-y divide-slate-100 border-y border-slate-100">
              <Preference label={t("profile.emailReminders")} detail={t("profile.emailRemindersDesc")} checked={form.emailReminders} onChange={() => update("emailReminders", !form.emailReminders)} />
              <Preference label={t("profile.weeklyDigest")} detail={t("profile.weeklyDigestDesc")} checked={form.weeklyDigest} onChange={() => update("weeklyDigest", !form.weeklyDigest)} />
            </div>
          </Card>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className={`flex items-center gap-1.5 text-sm ${saved ? "text-teal-700" : "text-slate-500"}`}>{saved ? <><Check className="h-4 w-4" />{t("profile.saved")}</> : t("profile.saveHint")}</p>
            <Button onClick={save} icon={saved ? Check : undefined}>{saved ? t("profile.savedBtn") : t("profile.save")}</Button>
          </div>
        </div>
      </div>
    </EmptyPagePlaceholder>
  );
};

const Field = ({ label, children }: { label: string; children: ReactNode }) => <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</span>{children}</label>;

const Preference = ({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: () => void }) => (
  <div className="flex items-center justify-between gap-5 py-4">
    <div><p className="text-sm font-semibold text-slate-800">{label}</p><p className="mt-1 text-xs leading-relaxed text-slate-500">{detail}</p></div>
    <button onClick={onChange} type="button" role="switch" aria-checked={checked} aria-label={label} className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? "bg-teal-500" : "bg-slate-300"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} /></button>
  </div>
);

export const ProfilePage = () => {
  const { user } = useCurrentUser();
  return <ProfilePageView user={user} />;
};
