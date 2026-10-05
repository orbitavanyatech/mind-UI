"use client";

/* Company administrator — People.
   The company's directory: invite people, place them in a department and team, set their
   role, and deactivate or remove them. Placement is edited inline in the table. */

import React, { useMemo, useState } from "react";
import { MailPlus, Search, Trash2, UserCheck, UserX, X } from "lucide-react";
import { slug } from "@/i18n/slug";
import { useLanguage } from "@/i18n/LanguageContext";
import { Badge, Button, Card, EmptyPagePlaceholder } from "@/components/ui/Primitives";
import { Table, statusBadge } from "@/components/ui/Table";
import { useOrg, type NewPerson } from "@/company/OrgContext";
import { Avatar, useInitialHash } from "@/views/company/orgUi";
import type { OrgRole, PersonStatus } from "@/types";

const ROLES: OrgRole[] = ["Employee", "Leader", "Company Admin"];
const STATUS_FILTERS: Array<"All" | PersonStatus> = ["All", "Active", "Invited", "Inactive"];
const UNASSIGNED = "__unassigned__";

const InviteForm = ({ onCancel, onInvite }: { onCancel: () => void; onInvite: (p: NewPerson) => void }) => {
  const { t, tOr } = useLanguage();
  const { departments, teams } = useOrg();
  const [form, setForm] = useState({ name: "", email: "", title: "", role: "Employee" as OrgRole, departmentId: "", teamId: "" });
  const deptTeams = teams.filter((tm) => tm.departmentId === form.departmentId);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    onInvite({
      name: form.name.trim(),
      email: form.email.trim(),
      title: form.title.trim() || "—",
      role: form.role,
      departmentId: form.departmentId || null,
      teamId: form.teamId || null,
    });
  };

  return (
    <Card className="border-indigo-100 bg-indigo-50/40">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-slate-900 text-sm">{t("company.people.inviteTitle")}</p>
        <button onClick={onCancel} aria-label={t("company.common.cancel")} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
      </div>
      <form onSubmit={submit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("company.people.fName")}</span>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className="form-input" required />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("company.people.fEmail")}</span>
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="name@acme.com" className="form-input" required />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("company.people.fTitle")}</span>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className="form-input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("admin.cols.role")}</span>
          <select value={form.role} onChange={(e) => set("role", e.target.value as OrgRole)} className="form-input bg-white">
            {ROLES.map((r) => <option key={r} value={r}>{tOr(`data.role.${slug(r)}`, r)}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("admin.cols.department")}</span>
          <select value={form.departmentId} onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value, teamId: "" }))} className="form-input bg-white">
            <option value="">{t("company.common.unassigned")}</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">{t("company.cols.team")}</span>
          <select value={form.teamId} onChange={(e) => set("teamId", e.target.value)} disabled={!form.departmentId} className="form-input bg-white">
            <option value="">{t("company.common.noTeam")}</option>
            {deptTeams.map((tm) => <option key={tm.id} value={tm.id}>{tm.name}</option>)}
          </select>
        </label>
        <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-1">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>{t("company.common.cancel")}</Button>
          <Button type="submit" size="sm" icon={MailPlus}>{t("company.people.sendInvite")}</Button>
        </div>
      </form>
    </Card>
  );
};

export const PeoplePage = () => {
  const { t, tOr } = useLanguage();
  const { people, departments, teams, invitePerson, updatePerson, placePerson, setPersonStatus, removePerson, isLastAdmin } = useOrg();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | PersonStatus>("All");
  const [dept, setDept] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  useInitialHash((hash) => {
    if (hash === "invite") setShowInvite(true);
    if (hash === "unassigned") setDept(UNASSIGNED);
  });

  const unassignedCount = people.filter((p) => !p.departmentId).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return people.filter((p) => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.title.toLowerCase().includes(q);
      const matchesStatus = status === "All" || p.status === status;
      const matchesDept = !dept || (dept === UNASSIGNED ? !p.departmentId : p.departmentId === dept);
      return matchesQuery && matchesStatus && matchesDept;
    });
  }, [people, query, status, dept]);

  return (
    <EmptyPagePlaceholder title={t("company.people.title")} desc={t("company.people.desc")}>
      {unassignedCount > 0 && dept !== UNASSIGNED && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3">
          <p className="text-sm text-amber-900">{t("company.people.unassignedBanner", { n: unassignedCount })}</p>
          <Button size="sm" variant="outline" onClick={() => setDept(UNASSIGNED)}>{t("company.people.showUnassigned")}</Button>
        </div>
      )}

      {showInvite && (
        <InviteForm
          onCancel={() => setShowInvite(false)}
          onInvite={(p) => { invitePerson(p); setShowInvite(false); }}
        />
      )}

      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("admin.users.search")} className="bg-transparent text-sm outline-none w-full" />
            </div>
            <select value={dept} onChange={(e) => setDept(e.target.value)} aria-label={t("admin.cols.department")} className="form-select-sm">
              <option value="">{t("company.people.allDepartments")}</option>
              <option value={UNASSIGNED}>{t("company.common.unassigned")}</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <Button size="sm" icon={MailPlus} onClick={() => setShowInvite((v) => !v)}>{t("admin.users.invite")}</Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${status === s ? "bg-indigo-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {tOr(`data.${s === "All" ? "filter" : "status"}.${slug(s)}`, s)}
            </button>
          ))}
          <span className="text-xs text-slate-400 ml-1">{t("company.people.count", { shown: filtered.length, total: people.length })}</span>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-10">{t("company.people.empty")}</p>
        ) : (
          <Table
            columns={[t("admin.cols.name"), t("admin.cols.role"), t("admin.cols.department"), t("company.cols.team"), t("admin.cols.status"), t("company.cols.actions")]}
            rows={filtered.map((p) => {
              const deptTeams = teams.filter((tm) => tm.departmentId === p.departmentId);
              const isConfirming = confirmRemove === p.id;
              const locked = isLastAdmin(p.id);
              const lockedTip = t("company.people.lastAdmin");
              return [
                <div key="n" className="flex items-center gap-2.5">
                  <Avatar name={p.name} />
                  <div>
                    <p className="font-medium text-slate-800 leading-tight">{p.name}</p>
                    <p className="text-xs text-slate-400 leading-tight">{p.title !== "—" ? `${p.title} · ` : ""}{p.email}</p>
                  </div>
                </div>,
                <select key="r" value={p.role} onChange={(e) => updatePerson(p.id, { role: e.target.value as OrgRole })} disabled={locked} title={locked ? lockedTip : undefined} aria-label={t("admin.cols.role")} className="form-select-sm">
                  {ROLES.map((r) => <option key={r} value={r}>{tOr(`data.role.${slug(r)}`, r)}</option>)}
                </select>,
                <select key="d" value={p.departmentId ?? ""} onChange={(e) => placePerson(p.id, e.target.value || null, p.teamId)} aria-label={t("admin.cols.department")} className="form-select-sm">
                  <option value="">{t("company.common.unassigned")}</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>,
                <select key="t" value={p.teamId ?? ""} onChange={(e) => placePerson(p.id, p.departmentId, e.target.value || null)} disabled={!p.departmentId} aria-label={t("company.cols.team")} className="form-select-sm">
                  <option value="">{t("company.common.noTeam")}</option>
                  {deptTeams.map((tm) => <option key={tm.id} value={tm.id}>{tm.name}</option>)}
                </select>,
                statusBadge(p.status),
                <div key="a" className="flex items-center gap-1">
                  {p.status === "Inactive" ? (
                    <button onClick={() => setPersonStatus(p.id, "Active")} title={t("company.people.reactivate")} aria-label={t("company.people.reactivate")} className="p-1.5 rounded-lg text-teal-600 hover:bg-teal-50"><UserCheck className="w-4 h-4" /></button>
                  ) : (
                    <button onClick={() => setPersonStatus(p.id, "Inactive")} disabled={locked} title={locked ? lockedTip : t("company.people.deactivate")} aria-label={t("company.people.deactivate")} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"><UserX className="w-4 h-4" /></button>
                  )}
                  {isConfirming ? (
                    <>
                      <button onClick={() => { removePerson(p.id); setConfirmRemove(null); }} className="px-2 py-1 rounded-lg text-xs font-semibold bg-rose-600 text-white">{t("company.common.confirm")}</button>
                      <button onClick={() => setConfirmRemove(null)} className="px-2 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100">{t("company.common.cancel")}</button>
                    </>
                  ) : (
                    <button onClick={() => setConfirmRemove(p.id)} disabled={locked} title={locked ? lockedTip : t("company.people.remove")} aria-label={t("company.people.remove")} className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400 disabled:cursor-not-allowed"><Trash2 className="w-4 h-4" /></button>
                  )}
                </div>,
              ];
            })}
          />
        )}
      </Card>
      <p className="text-xs text-slate-400"><Badge color="slate">{t("company.people.privacyTag")}</Badge> <span className="ml-2">{t("company.people.privacy")}</span></p>
    </EmptyPagePlaceholder>
  );
};
