"use client";

/* Company administrator — Teams.
   Teams live inside a department. Create and archive teams, name a lead, and add or remove
   members. Teams are archived, never deleted: history stays. Moving people between teams is the same placement the People page edits. */

import React, { useState } from "react";
import { Archive, PlusCircle, UserMinus, UserPlus, UsersRound, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge, Button, Card, EmptyPagePlaceholder } from "@/components/ui/Primitives";
import { useOrg } from "@/company/OrgContext";
import { Avatar } from "@/views/company/orgUi";
import type { Team } from "@/types";

const TeamCard = ({ team }: { team: Team }) => {
  const { t } = useLanguage();
  const { people, departments, updateTeam, archiveTeam, placePerson } = useOrg();
  const [confirming, setConfirming] = useState(false);
  const [adding, setAdding] = useState("");

  const dept = departments.find((d) => d.id === team.departmentId);
  const members = people.filter((p) => p.teamId === team.id);
  /* Candidates: people already in the department (no team yet) or not placed anywhere. */
  const candidates = people.filter((p) => p.teamId !== team.id && (!p.departmentId || (p.departmentId === team.departmentId && !p.teamId)));
  const leadOptions = people.filter((p) => p.departmentId === team.departmentId || !p.departmentId);

  const addMember = () => {
    if (!adding) return;
    placePerson(adding, team.departmentId, team.id);
    setAdding("");
  };

  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0"><UsersRound className="w-5 h-5 text-violet-600" /></div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-sm truncate">{team.name}</p>
            <p className="text-xs text-slate-500">{dept?.name ?? "—"}</p>
          </div>
        </div>
        <Badge color="slate">{t("company.teams.memberCount", { n: members.length })}</Badge>
      </div>

      <label className="block mb-4">
        <span className="mb-1.5 block text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">{t("company.teams.lead")}</span>
        <select value={team.leadId ?? ""} onChange={(e) => updateTeam(team.id, { leadId: e.target.value || null })} className="form-select-sm w-full" style={{ maxWidth: "100%" }}>
          <option value="">{t("company.teams.noLead")}</option>
          {leadOptions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>

      <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">{t("company.teams.members")}</p>
      <div className="space-y-1 mb-3 min-h-[44px]">
        {members.length === 0 && <p className="text-xs text-slate-400">{t("company.teams.noMembers")}</p>}
        {members.map((p) => (
          <div key={p.id} className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 hover:bg-slate-50">
            <Avatar name={p.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-800 truncate leading-tight">{p.name}{team.leadId === p.id && <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-violet-600">{t("company.teams.leadTag")}</span>}</p>
            </div>
            <button onClick={() => placePerson(p.id, team.departmentId, null)} title={t("company.teams.removeMember")} aria-label={t("company.teams.removeMember")} className="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50"><UserMinus className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <select value={adding} onChange={(e) => setAdding(e.target.value)} className="form-select-sm flex-1" style={{ maxWidth: "100%" }} aria-label={t("company.teams.addMember")}>
          <option value="">{t("company.teams.addMember")}</option>
          {candidates.map((p) => <option key={p.id} value={p.id}>{p.name}{!p.departmentId ? ` · ${t("company.common.unassigned")}` : ""}</option>)}
        </select>
        <Button size="sm" variant="subtle" icon={UserPlus} disabled={!adding} onClick={addMember} aria-label={t("company.teams.addMember")} />
      </div>

      <div className="mt-auto">
        {confirming ? (
          <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-3">
            <p className="text-xs text-amber-900 mb-3">{t("company.teams.archiveWarn", { n: members.length })}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setConfirming(false)}>{t("company.common.cancel")}</Button>
              <Button size="sm" className="flex-1" onClick={() => archiveTeam(team.id)}>{t("company.teams.archive")}</Button>
            </div>
          </div>
        ) : (
          <Button size="sm" variant="outline" icon={Archive} className="w-full" onClick={() => setConfirming(true)}>{t("company.teams.archive")}</Button>
        )}
      </div>
    </Card>
  );
};

export const TeamsPage = () => {
  const { t } = useLanguage();
  const { teams, departments, people, addTeam, archivedTeams } = useOrg();
  const [deptFilter, setDeptFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [leadId, setLeadId] = useState("");

  const visible = teams.filter((tm) => !deptFilter || tm.departmentId === deptFilter);
  const formDept = departmentId || departments[0]?.id || "";
  const leadOptions = people.filter((p) => p.departmentId === formDept || !p.departmentId);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !formDept) return;
    addTeam(name.trim(), formDept, leadId || null);
    setName(""); setLeadId(""); setShowForm(false);
  };

  return (
    <EmptyPagePlaceholder
      title={t("company.teams.title")}
      desc={t("company.teams.desc")}
      action={<Button icon={PlusCircle} onClick={() => setShowForm((v) => !v)} disabled={departments.length === 0}>{t("company.teams.add")}</Button>}
    >
      {showForm && (
        <Card className="border-indigo-100 bg-indigo-50/40">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-900 text-sm">{t("company.teams.formTitle")}</p>
            <button onClick={() => setShowForm(false)} aria-label={t("company.common.cancel")} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={submit} className="grid sm:grid-cols-3 gap-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("company.teams.fName")}</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("company.teams.fNamePh")} className="form-input" required />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("admin.cols.department")}</span>
              <select value={formDept} onChange={(e) => { setDepartmentId(e.target.value); setLeadId(""); }} className="form-input bg-white">
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("company.teams.lead")}</span>
              <select value={leadId} onChange={(e) => setLeadId(e.target.value)} className="form-input bg-white">
                <option value="">{t("company.teams.noLead")}</option>
                {leadOptions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
            <div className="sm:col-span-3 flex justify-end gap-3 pt-1">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>{t("company.common.cancel")}</Button>
              <Button type="submit" size="sm">{t("company.teams.create")}</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setDeptFilter("")} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${!deptFilter ? "bg-indigo-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{t("data.filter.all")}</button>
        {departments.map((d) => (
          <button key={d.id} onClick={() => setDeptFilter(d.id)} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${deptFilter === d.id ? "bg-indigo-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{d.name}</button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((tm) => <TeamCard key={tm.id} team={tm} />)}
        </div>
      ) : (
        <Card className="text-center py-10">
          <UsersRound className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">{t("company.teams.empty")}</p>
          <p className="text-xs text-slate-500 mt-1">{t("company.teams.emptyDesc")}</p>
        </Card>
      )}
      {archivedTeams.length > 0 && (
        <details className="rounded-2xl border border-slate-100 bg-white px-5 py-3">
          <summary className="cursor-pointer text-sm font-semibold text-slate-700">{t("company.teams.archivedTitle", { n: archivedTeams.length })}</summary>
          <ul className="mt-3 divide-y divide-slate-100">
            {archivedTeams.map((tm) => (
              <li key={tm.id} className="flex items-center justify-between py-2 text-sm text-slate-600">
                <span>{tm.name} <span className="text-xs text-slate-400">· {departments.find((d) => d.id === tm.departmentId)?.name ?? t("company.common.archivedDept")}</span></span>
                <Badge color="slate">{t("company.common.archivedOn", { date: tm.archivedAt ?? "" })}</Badge>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-400 mt-2">{t("company.common.archivedNote")}</p>
        </details>
      )}
    </EmptyPagePlaceholder>
  );
};
