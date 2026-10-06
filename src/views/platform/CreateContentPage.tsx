"use client";

import { slug } from "@/i18n/slug";
import { useLanguage } from "@/i18n/LanguageContext";
import React, { useMemo, useState, type ReactNode } from "react";
import { BookOpen, CheckCircle2, Clock3, Eye, FileText, Link as LinkIcon, Plus, Upload, Video, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Badge, Button, Card, EmptyPagePlaceholder } from "@/components/ui/Primitives";
import { usePlatform } from "@/platform/PlatformContext";
import { ROUTES } from "@/config/routes";
import type { ContentType } from "@/types";

const CONTENT_TYPES: Record<string, { icon: LucideIcon; label: string }> = {
  "Course Module": { icon: BookOpen, label: "Course module" },
  Article: { icon: FileText, label: "Article" },
  "Live Session": { icon: Video, label: "Live session" },
};
interface ContentForm {
  title: string;
  type: string;
  theme: string;
  visibility: string;
  description: string;
  duration: string;
  resource: string;
  tags: string[];
}

const INITIAL_FORM: ContentForm = { title: "", type: "Course Module", theme: "Focus & Deep Work", visibility: "All Employees", description: "", duration: "10 min", resource: "", tags: ["Focus"] };

export const CreateContentPage = () => {
  const { t, tOr } = useLanguage();
  const { addContent } = usePlatform();
  const [form, setForm] = useState<ContentForm>(INITIAL_FORM);
  const [tagInput, setTagInput] = useState("");
  const [notice, setNotice] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const typeMeta = CONTENT_TYPES[form.type];
  const TypeIcon = typeMeta.icon;
  const isReady = Boolean(form.title.trim() && form.description.trim());
  const previewTitle = useMemo(() => form.title.trim() || t("admin.create.untitled"), [form.title, t]);
  const update = <K extends keyof ContentForm>(field: K, value: ContentForm[K]) => setForm((current) => ({ ...current, [field]: value }));
  const addTag = () => { const tag = tagInput.trim(); if (tag && !form.tags.includes(tag)) update("tags", [...form.tags, tag]); setTagInput(""); };
  const save = (status: "published" | "draft") => {
    if (!form.title.trim()) return;
    addContent({ title: form.title.trim(), type: form.type as ContentType, theme: form.theme, status: status === "published" ? "Published" : "Draft" });
    setNotice(status === "published" ? t("admin.create.published") : t("admin.create.draftSaved"));
    setForm(INITIAL_FORM);
    setTagInput("");
  };

  return <EmptyPagePlaceholder title={t("admin.create.title")} desc={t("admin.create.desc")} action={<Badge color="indigo">{t("admin.create.step")}</Badge>}>
    {notice && <div className="flex items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800"><span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />{notice}<Link href={ROUTES.platform.content} className="font-semibold underline">{t("platform.content.viewInLibrary")}</Link></span><button onClick={() => setNotice("")} aria-label={t("admin.create.dismiss")}><X className="h-4 w-4" /></button></div>}
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Card className="max-w-none">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-5"><div><p className="mpp-display text-lg font-bold text-slate-900">{t("admin.create.details")}</p><p className="mt-1 text-sm text-slate-500">{t("admin.create.required")}</p></div><Badge color={isReady ? "teal" : "slate"}>{isReady ? t("admin.create.ready") : t("admin.create.inProgress")}</Badge></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("admin.create.fTitle")} required className="sm:col-span-2"><input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder={t("admin.create.fTitlePh")} className="form-input" /></Field>
          <Field label={t("admin.create.fType")}><select value={form.type} onChange={(e) => update("type", e.target.value)} className="form-input bg-white">{Object.keys(CONTENT_TYPES).map((type) => <option key={type} value={type}>{tOr(`data.contentType.${slug(type)}`, type)}</option>)}</select></Field>
          <Field label={t("admin.create.fDuration")}><select value={form.duration} onChange={(e) => update("duration", e.target.value)} className="form-input bg-white"><option>5 min</option><option>10 min</option><option>15 min</option><option>30 min</option><option>45 min</option></select></Field>
          <Field label={t("admin.create.fTheme")}><select value={form.theme} onChange={(e) => update("theme", e.target.value)} className="form-input bg-white">{["Focus & Deep Work", "Navigating Change", "Sustainable Performance"].map((th) => <option key={th} value={th}>{tOr(`data.theme.${slug(th)}`, th)}</option>)}</select></Field>
          <Field label={t("admin.create.fVisibility")}><select value={form.visibility} onChange={(e) => update("visibility", e.target.value)} className="form-input bg-white">{["All Employees", "Leaders Only", "Administrators Only"].map((v) => <option key={v} value={v}>{tOr(`data.visibility.${slug(v)}`, v)}</option>)}</select></Field>
          <Field label={t("admin.create.fDesc")} required className="sm:col-span-2" hint={t("admin.create.chars", { n: form.description.length })}><textarea value={form.description} onChange={(e) => update("description", e.target.value.slice(0, 300))} rows={4} placeholder={t("admin.create.fDescPh")} className="form-input resize-y" /></Field>
          <Field label={t("admin.create.fResource")} className="sm:col-span-2" hint={t("admin.create.optional")}><div className="relative"><LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={form.resource} onChange={(e) => update("resource", e.target.value)} placeholder={t("admin.create.fResourcePh")} className="form-input pl-9" /></div></Field>
        </div>
        <div className="mt-6 border-t border-slate-100 pt-5"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("admin.create.topics")}</p><div className="mt-2 flex flex-wrap gap-2">{form.tags.map((tag) => <button key={tag} onClick={() => update("tags", form.tags.filter((item) => item !== tag))} className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 hover:bg-teal-100">{tag}<X className="h-3 w-3" /></button>)}</div><div className="mt-3 flex gap-2"><input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} placeholder={t("admin.create.addTopicPh")} className="form-input max-w-xs" /><Button variant="outline" size="sm" onClick={addTag} icon={Plus}>{t("admin.create.add")}</Button></div></div>
        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5"><Button onClick={() => save("published")} disabled={!isReady} icon={Upload}>{t("admin.create.publish")}</Button><Button variant="outline" onClick={() => save("draft")} disabled={!form.title.trim()}>{t("admin.create.saveDraft")}</Button>{!isReady && <span className="text-xs text-slate-400">{t("admin.create.needTitleDesc")}</span>}</div>
      </Card>
      <div className="space-y-4"><Card padded={false} className="overflow-hidden"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div className="flex items-center gap-2"><Eye className="h-4 w-4 text-slate-500" /><p className="font-semibold text-slate-900">{t("admin.create.preview")}</p></div><button onClick={() => setShowPreview((value) => !value)} className="text-xs font-semibold text-teal-700">{showPreview ? t("admin.create.hide") : t("admin.create.show")}</button></div>{showPreview && <div className="p-5"><div className="rounded-2xl bg-gradient-to-br from-indigo-950 to-indigo-800 p-5 text-white"><div className="mb-5 flex items-center justify-between"><div className="rounded-xl bg-white/10 p-2"><TypeIcon className="h-5 w-5 text-teal-300" /></div><Badge color="teal">{tOr(`data.theme.${slug(form.theme)}`, form.theme)}</Badge></div><p className="mpp-display text-lg font-bold leading-snug">{previewTitle}</p><p className="mt-2 min-h-10 text-sm leading-relaxed text-slate-300">{form.description || t("admin.create.previewDesc")}</p><div className="mt-5 flex items-center gap-4 text-xs text-slate-300"><span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{form.duration}</span><span>{t(`admin.create.typeLabel.${slug(form.type)}`)}</span></div></div><div className="mt-4 flex flex-wrap gap-2">{form.tags.map((tag) => <Badge key={tag} color="slate">{tag}</Badge>)}</div></div>}</Card><Card className="border-amber-100 bg-amber-50/50"><p className="text-sm font-semibold text-amber-900">{t("admin.create.checklist")}</p><ul className="mt-3 space-y-2 text-xs text-amber-800"><li className="flex gap-2"><CheckCircle2 className={form.title ? "h-4 w-4 text-teal-600" : "h-4 w-4 text-amber-400"} />{t("admin.create.chk1")}</li><li className="flex gap-2"><CheckCircle2 className={form.description ? "h-4 w-4 text-teal-600" : "h-4 w-4 text-amber-400"} />{t("admin.create.chk2")}</li><li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" />{t("admin.create.chk3")}</li></ul></Card></div>
    </div>
  </EmptyPagePlaceholder>;
};

const Field = ({ label, required, hint, className = "", children }: { label: string; required?: boolean; hint?: string; className?: string; children: ReactNode }) => <label className={`block ${className}`}><span className="mb-1.5 flex justify-between text-xs font-semibold text-slate-600">{label}{required && <span className="text-rose-500">*</span>}{hint && <span className="font-normal text-slate-400">{hint}</span>}</span>{children}</label>;
