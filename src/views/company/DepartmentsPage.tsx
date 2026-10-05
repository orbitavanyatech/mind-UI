"use client";

/* Company administrator — Departments.
   Create, rename and delete departments, and name a head for each. A department's people
   and teams are counted live from the shared company state. */

import React, { useState } from "react";
import { Check, Network, Pencil, PlusCircle, Trash2, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge, Button, Card, EmptyPagePlaceholder } from "@/components/ui/Primitives";
import { useOrg } from "@/company/OrgContext";
import { Avatar } from "@/views/company/orgUi";
import type { Department } from "@/types";

const DepartmentCard = ({ dept }: { dept: Department }) => {
  const { t } = useLanguage();
  const { people, teams, updateDepartment, deleteDepartment } = useOrg();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(dept.name);
  const [confirming, setConfirming] = useState(false);

  const members = people.filter((p) => p.departmentId === dept.id);
  const deptTeams = teams.filter((tm) => tm.departmentId === dept.id);
  /* People who could lead: members of this department, or nobody-yet-placed. */
  const headOptions = people.filter((p) => p.departmentId === dept.id || !p.departmentId);

  const save = () => {
    if (name.trim()) updateDepartment(dept.id, { name: name.trim() });
    setEditing(false);
  };

  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0"><Network className="w-5 h-5 text-indigo-600" /></div>
          {editing ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setName(dept.name); setEditing(false); } }}
              className="form-input !py-1.5"
              autoFocus
              aria-label={t("company.departments.fName")}
            />
          ) : (
            <p className="font-semibold text-slate-900 truncate">{dept.name}</p>
          )}
        </div>
        {editing ? (
          <div className="flex gap-1 shrink-0">
            <button onClick={save} aria-label={t("company.common.save")} className="p-1.5 rounded-lg text-teal-600 hover:bg-teal-50"><Check className="w-4 h-4" /></button>
            <button onClick={() => { setName(dept.name); setEditing(false); }} aria-label={t("company.common.cancel")} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"><X className="w-4 h-4" /></button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} aria-label={t("company.departments.rename")} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 shrink-0"><Pencil className="w-4 h-4" /></button>
        )}
      </div>

      <label className="block mb-4">
        <span className="mb-1.5 block text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">{t("company.departments.head")}</span>
        <select value={dept.headId ?? ""} onChange={(e) => updateDepartment(dept.id, { headId: e.target.value || null })} className="form-select-sm w-full" style={{ maxWidth: "100%" }}>
          <option value="">{t("company.departments.noHead")}</option>
          {headOptions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">{t("company.departments.people")}</p>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{members.length}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">{t("company.departments.teams")}</p>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{deptTeams.length}</p>
        </div>
      </div>

      <div className="mb-4 min-h-[66px]">
        {deptTeams.length > 0 ? (
          <div className="flex flex-wrap gap-2">{deptTeams.map((tm) => <Badge key={tm.id} color="indigo">{tm.name}</Badge>)}</div>
        ) : (
          <p className="text-xs text-slate-400">{t("company.departments.noTeams")}</p>
        )}
        {members.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3">
            {members.slice(0, 5).map((p) => <Avatar key={p.id} name={p.name} size="sm" />)}
            {members.length > 5 && <span className="text-xs text-slate-400">+{members.length - 5}</span>}
          </div>
        )}
      </div>

      <div className="mt-auto">
        {confirming ? (
          <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-3">
            <p className="text-xs text-rose-800 mb-3">{t("company.departments.deleteWarn", { teams: deptTeams.length, people: members.length })}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setConfirming(false)}>{t("company.common.cancel")}</Button>
              <Button size="sm" className="flex-1 !bg-rose-600 hover:!bg-rose-700" onClick={() => deleteDepartment(dept.id)}>{t("company.departments.delete")}</Button>
            </div>
          </div>
        ) : (
          <Button size="sm" variant="outline" icon={Trash2} className="w-full !text-rose-600 !border-rose-200 hover:!bg-rose-50" onClick={() => setConfirming(true)}>{t("company.departments.delete")}</Button>
        )}
      </div>
    </Card>
  );
};

export const DepartmentsPage = () => {
  const { t } = useLanguage();
  const { departments, people, addDepartment } = useOrg();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [headId, setHeadId] = useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    addDepartment(name.trim(), headId || null);
    setName(""); setHeadId(""); setShowForm(false);
  };

  return (
    <EmptyPagePlaceholder
      title={t("company.departments.title")}
      desc={t("company.departments.desc")}
      action={<Button icon={PlusCircle} onClick={() => setShowForm((v) => !v)}>{t("company.departments.add")}</Button>}
    >
      {showForm && (
        <Card className="border-indigo-100 bg-indigo-50/40">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-900 text-sm">{t("company.departments.formTitle")}</p>
            <button onClick={() => setShowForm(false)} aria-label={t("company.common.cancel")} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("company.departments.fName")}</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("company.departments.fNamePh")} className="form-input" required />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("company.departments.head")}</span>
              <select value={headId} onChange={(e) => setHeadId(e.target.value)} className="form-input bg-white">
                <option value="">{t("company.departments.noHead")}</option>
                {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
            <div className="sm:col-span-2 flex justify-end gap-3 pt-1">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>{t("company.common.cancel")}</Button>
              <Button type="submit" size="sm">{t("company.departments.create")}</Button>
            </div>
          </form>
        </Card>
      )}

      {departments.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((d) => <DepartmentCard key={d.id} dept={d} />)}
        </div>
      ) : (
        <Card className="text-center py-10">
          <Network className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">{t("company.departments.empty")}</p>
          <p className="text-xs text-slate-500 mt-1">{t("company.departments.emptyDesc")}</p>
        </Card>
      )}
    </EmptyPagePlaceholder>
  );
};
