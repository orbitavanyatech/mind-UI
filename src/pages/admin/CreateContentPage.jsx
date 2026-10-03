import React, { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Clock3, Eye, FileText, Link as LinkIcon, Plus, Upload, Video, X } from "lucide-react";
import { Badge, Button, Card, EmptyPagePlaceholder } from "../../components/ui/Primitives";

const CONTENT_TYPES = {
  "Course Module": { icon: BookOpen, label: "Course module" },
  Article: { icon: FileText, label: "Article" },
  "Live Session": { icon: Video, label: "Live session" },
};
const INITIAL_FORM = { title: "", type: "Course Module", theme: "Focus & Deep Work", visibility: "All Employees", description: "", duration: "10 min", resource: "", tags: ["Focus"] };

export const CreateContentPage = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [tagInput, setTagInput] = useState("");
  const [notice, setNotice] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const typeMeta = CONTENT_TYPES[form.type];
  const TypeIcon = typeMeta.icon;
  const isReady = Boolean(form.title.trim() && form.description.trim());
  const previewTitle = useMemo(() => form.title.trim() || "Untitled content", [form.title]);
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const addTag = () => { const tag = tagInput.trim(); if (tag && !form.tags.includes(tag)) update("tags", [...form.tags, tag]); setTagInput(""); };
  const save = (status) => setNotice(status === "published" ? "Content published to the library." : "Draft saved. You can keep editing anytime.");

  return <EmptyPagePlaceholder title="Create content" desc="Build a useful learning experience, then publish it to the right audience." action={<Badge color="indigo">Step 1 of 1 · Content details</Badge>}>
    {notice && <div className="flex items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800"><span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss confirmation"><X className="h-4 w-4" /></button></div>}
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Card className="max-w-none">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-5"><div><p className="mpp-display text-lg font-bold text-slate-900">Content details</p><p className="mt-1 text-sm text-slate-500">Fields marked with an asterisk are required to publish.</p></div><Badge color={isReady ? "teal" : "slate"}>{isReady ? "Ready to publish" : "Draft in progress"}</Badge></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Content title" required className="sm:col-span-2"><input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Recovery Rituals for High Performers" className="form-input" /></Field>
          <Field label="Content type"><select value={form.type} onChange={(e) => update("type", e.target.value)} className="form-input bg-white">{Object.keys(CONTENT_TYPES).map((type) => <option key={type}>{type}</option>)}</select></Field>
          <Field label="Estimated duration"><select value={form.duration} onChange={(e) => update("duration", e.target.value)} className="form-input bg-white"><option>5 min</option><option>10 min</option><option>15 min</option><option>30 min</option><option>45 min</option></select></Field>
          <Field label="Monthly theme"><select value={form.theme} onChange={(e) => update("theme", e.target.value)} className="form-input bg-white"><option>Focus & Deep Work</option><option>Navigating Change</option><option>Sustainable Performance</option></select></Field>
          <Field label="Visibility"><select value={form.visibility} onChange={(e) => update("visibility", e.target.value)} className="form-input bg-white"><option>All Employees</option><option>Leaders Only</option><option>Administrators Only</option></select></Field>
          <Field label="Short description" required className="sm:col-span-2" hint={`${form.description.length}/300 characters`}><textarea value={form.description} onChange={(e) => update("description", e.target.value.slice(0, 300))} rows={4} placeholder="Describe what learners will get from this content…" className="form-input resize-y" /></Field>
          <Field label="Resource link" className="sm:col-span-2" hint="Optional"><div className="relative"><LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={form.resource} onChange={(e) => update("resource", e.target.value)} placeholder="Paste a video, article, or document URL" className="form-input pl-9" /></div></Field>
        </div>
        <div className="mt-6 border-t border-slate-100 pt-5"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Topics</p><div className="mt-2 flex flex-wrap gap-2">{form.tags.map((tag) => <button key={tag} onClick={() => update("tags", form.tags.filter((item) => item !== tag))} className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 hover:bg-teal-100">{tag}<X className="h-3 w-3" /></button>)}</div><div className="mt-3 flex gap-2"><input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} placeholder="Add a topic" className="form-input max-w-xs" /><Button variant="outline" size="sm" onClick={addTag} icon={Plus}>Add</Button></div></div>
        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5"><Button onClick={() => save("published")} disabled={!isReady} icon={Upload}>Publish content</Button><Button variant="outline" onClick={() => save("draft")}>Save draft</Button>{!isReady && <span className="text-xs text-slate-400">Add a title and description to publish.</span>}</div>
      </Card>
      <div className="space-y-4"><Card padded={false} className="overflow-hidden"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div className="flex items-center gap-2"><Eye className="h-4 w-4 text-slate-500" /><p className="font-semibold text-slate-900">Learner preview</p></div><button onClick={() => setShowPreview((value) => !value)} className="text-xs font-semibold text-teal-700">{showPreview ? "Hide" : "Show"}</button></div>{showPreview && <div className="p-5"><div className="rounded-2xl bg-gradient-to-br from-indigo-950 to-indigo-800 p-5 text-white"><div className="mb-5 flex items-center justify-between"><div className="rounded-xl bg-white/10 p-2"><TypeIcon className="h-5 w-5 text-teal-300" /></div><Badge color="teal">{form.theme}</Badge></div><p className="mpp-display text-lg font-bold leading-snug">{previewTitle}</p><p className="mt-2 min-h-10 text-sm leading-relaxed text-slate-300">{form.description || "A concise description will help learners decide what to explore next."}</p><div className="mt-5 flex items-center gap-4 text-xs text-slate-300"><span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{form.duration}</span><span>{typeMeta.label}</span></div></div><div className="mt-4 flex flex-wrap gap-2">{form.tags.map((tag) => <Badge key={tag} color="slate">{tag}</Badge>)}</div></div>}</Card><Card className="border-amber-100 bg-amber-50/50"><p className="text-sm font-semibold text-amber-900">Publishing checklist</p><ul className="mt-3 space-y-2 text-xs text-amber-800"><li className="flex gap-2"><CheckCircle2 className={form.title ? "h-4 w-4 text-teal-600" : "h-4 w-4 text-amber-400"} />Add a clear title</li><li className="flex gap-2"><CheckCircle2 className={form.description ? "h-4 w-4 text-teal-600" : "h-4 w-4 text-amber-400"} />Describe the learner outcome</li><li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" />Choose an audience</li></ul></Card></div>
    </div>
  </EmptyPagePlaceholder>;
};

const Field = ({ label, required, hint, className = "", children }) => <label className={`block ${className}`}><span className="mb-1.5 flex justify-between text-xs font-semibold text-slate-600">{label}{required && <span className="text-rose-500">*</span>}{hint && <span className="font-normal text-slate-400">{hint}</span>}</span>{children}</label>;
