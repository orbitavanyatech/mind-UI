"use client";

/* Platform administrator — Monthly Themes. Plan the monthly focus areas every company receives.
   One theme is Active at a time; activating another archives the running one. Archived themes
   are history and are read-only. */

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { slug } from "@/i18n/slug";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge, Button, Card, EmptyPagePlaceholder } from "@/components/ui/Primitives";
import { usePlatform } from "@/platform/PlatformContext";
import type { MonthlyThemeItem } from "@/types";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/* "October 2026" <-> "2026-10", the value an <input type="month"> works with. */
const toInput = (month: string) => {
  const [name, year] = month.split(" ");
  const i = MONTH_NAMES.indexOf(name);
  return i >= 0 && year ? `${year}-${String(i + 1).padStart(2, "0")}` : "";
};
const fromInput = (v: string) => {
  const [year, m] = v.split("-");
  return year && m ? `${MONTH_NAMES[Number(m) - 1]} ${year}` : "";
};

const ThemeForm = ({ initial, onSave, onCancel }: { initial?: MonthlyThemeItem; onSave: (v: { month: string; title: string }) => void; onCancel: () => void }) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [month, setMonth] = useState(initial ? toInput(initial.month) : "");
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !month) return;
    onSave({ title: title.trim(), month: fromInput(month) });
  };
  return (
    <Card className="border-indigo-100 bg-indigo-50/40">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-slate-900 text-sm">{initial ? t("admin.themes.edit") : t("admin.themes.new")}</p>
        <button onClick={onCancel} aria-label={t("company.common.cancel")} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
      </div>
      <form onSubmit={submit} className="grid sm:grid-cols-3 gap-4 items-end">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("platform.themes.fTitle")}</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" required />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("platform.themes.fMonth")}</span>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="form-input" required />
        </label>
        <div className="sm:col-span-3 flex justify-end gap-3">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>{t("company.common.cancel")}</Button>
          <Button type="submit" size="sm">{t("company.common.save")}</Button>
        </div>
      </form>
    </Card>
  );
};

export const ThemesAdminPage = () => {
  const { t, tOr } = useLanguage();
  const { themes, addTheme, updateTheme, activateTheme } = usePlatform();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <EmptyPagePlaceholder
      title={t("admin.themes.title")}
      desc={t("admin.themes.desc")}
      action={<Button size="sm" icon={Plus} onClick={() => { setEditingId(null); setCreating(true); }}>{t("admin.themes.new")}</Button>}
    >
      {creating && <ThemeForm onCancel={() => setCreating(false)} onSave={(v) => { addTheme(v); setCreating(false); }} />}
      <div className="grid sm:grid-cols-3 gap-5">
        {themes.map((th) => {
          if (editingId === th.id) {
            return <div key={th.id} className="sm:col-span-3"><ThemeForm initial={th} onCancel={() => setEditingId(null)} onSave={(v) => { updateTheme(th.id, v); setEditingId(null); }} /></div>;
          }
          const archived = th.status === "Archived";
          return (
            <Card key={th.id}>
              <Badge color={th.status === "Active" ? "teal" : th.status === "Scheduled" ? "amber" : "slate"} className="mb-3">{tOr(`data.status.${slug(th.status)}`, th.status)}</Badge>
              <p className="text-xs text-slate-400 font-medium mb-1">{tOr(`data.month.${slug(th.month)}`, th.month)}</p>
              <p className="font-semibold text-slate-900">{th.title}</p>
              {!archived && (
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => { setCreating(false); setEditingId(th.id); }}>{t("admin.themes.edit")}</Button>
                  {th.status === "Scheduled" && <Button size="sm" variant="subtle" onClick={() => activateTheme(th.id)}>{t("platform.themes.activate")}</Button>}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </EmptyPagePlaceholder>
  );
};
