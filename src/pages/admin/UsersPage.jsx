import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Download, Mail, MoreVertical,
  Plus, Search, ShieldOff, UserCheck, UserX, Users as UsersIcon, X
} from "lucide-react";
import { Badge, Button, Card, EmptyPagePlaceholder, MenuSelect, ProgressBar, StatCard } from "../../components/ui/Primitives";
import { statusBadge } from "../../components/ui/Table";
import { USER_DEPARTMENTS, USER_DIRECTORY, USER_ROLES, USER_STATUSES } from "../../data/featureData";

const ROLE_COLOR = { Employee: "teal", Leader: "violet", Administrator: "indigo" };
const PAGE_SIZES = [10, 25, 50];

const initials = (name) => name.split(" ").map((n) => n[0]).join("").slice(0, 2);
const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/* Sortable column definitions — `value` drives sorting. */
const COLUMNS = [
  { key: "name", label: "User", value: (u) => u.name.toLowerCase() },
  { key: "dept", label: "Department", value: (u) => u.dept },
  { key: "role", label: "Role", value: (u) => u.role },
  { key: "status", label: "Status", value: (u) => u.status },
  { key: "completion", label: "Completion", value: (u) => u.completion },
  { key: "lastActive", label: "Last active", value: (u) => u.lastActiveDays },
  { key: "joined", label: "Joined", value: (u) => u.joined },
];

const InviteModal = ({ onClose, onInvite }) => {
  const [form, setForm] = useState({ name: "", email: "", dept: USER_DEPARTMENTS[0], role: "Employee" });
  const valid = form.name.trim() && /\S+@\S+\.\S+/.test(form.email);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="invite-title">
      <div className="absolute inset-0 bg-slate-950/50" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 id="invite-title" className="mpp-display text-lg font-bold text-slate-900">Invite user</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-600">Full name<input className="form-input mt-1" value={form.name} onChange={set("name")} placeholder="e.g. Jane Doe" /></label>
          <label className="block text-xs font-semibold text-slate-600">Work email<input type="email" className="form-input mt-1" value={form.email} onChange={set("email")} placeholder="jane@acme.com" /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-semibold text-slate-600">Department
              <select className="form-input mt-1" value={form.dept} onChange={set("dept")}>{USER_DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}</select>
            </label>
            <label className="block text-xs font-semibold text-slate-600">Role
              <select className="form-input mt-1" value={form.role} onChange={set("role")}>{USER_ROLES.map((r) => <option key={r}>{r}</option>)}</select>
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button disabled={!valid} icon={Mail} onClick={() => onInvite(form)}>Send invite</Button>
        </div>
      </div>
    </div>
  );
};

const SortIcon = ({ active, dir }) => {
  if (!active) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
  return dir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
};

export const UsersPage = () => {
  const [users, setUsers] = useState(USER_DIRECTORY);
  const [query, setQuery] = useState("");
  const [roleF, setRoleF] = useState("all");
  const [statusF, setStatusF] = useState("all");
  const [deptF, setDeptF] = useState("all");
  const [sort, setSort] = useState({ key: "name", dir: "asc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState(() => new Set());
  const [menuFor, setMenuFor] = useState(null);
  const [showInvite, setShowInvite] = useState(false);

  /* Close any open row menu on outside click / Escape. */
  useEffect(() => {
    if (!menuFor) return undefined;
    const close = () => setMenuFor(null);
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", close); document.removeEventListener("keydown", onKey); };
  }, [menuFor]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const col = COLUMNS.find((c) => c.key === sort.key);
    const rows = users.filter((u) =>
      (roleF === "all" || u.role === roleF) &&
      (statusF === "all" || u.status === statusF) &&
      (deptF === "all" || u.dept === deptF) &&
      (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.dept.toLowerCase().includes(q))
    );
    rows.sort((a, b) => {
      const av = col.value(a), bv = col.value(b);
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [users, query, roleF, statusF, deptF, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const allOnPageSelected = pageRows.length > 0 && pageRows.every((u) => selected.has(u.id));

  const activeFilters = [
    roleF !== "all" && { label: `Role: ${roleF}`, clear: () => setRoleF("all") },
    statusF !== "all" && { label: `Status: ${statusF}`, clear: () => setStatusF("all") },
    deptF !== "all" && { label: `Dept: ${deptF}`, clear: () => setDeptF("all") },
  ].filter(Boolean);
  const clearAll = () => { setQuery(""); setRoleF("all"); setStatusF("all"); setDeptF("all"); setPage(1); };

  const counts = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.status === "Active").length,
    invited: users.filter((u) => u.status === "Invited").length,
    attention: users.filter((u) => u.status === "Inactive" || u.status === "Suspended").length,
  }), [users]);

  const resetPage = (fn) => (v) => { fn(v); setPage(1); };
  const toggleSort = (key) => setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  const toggleRow = (id) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const togglePage = () => setSelected((s) => { const n = new Set(s); pageRows.forEach((u) => (allOnPageSelected ? n.delete(u.id) : n.add(u.id))); return n; });

  const applyStatus = (ids, status) => {
    setUsers((us) => us.map((u) => (ids.has(u.id) ? { ...u, status, ...(status === "Active" && u.lastActive === "—" ? { lastActive: "Today", lastActiveDays: 0 } : {}) } : u)));
    setSelected(new Set());
  };
  const removeUsers = (ids) => { setUsers((us) => us.filter((u) => !ids.has(u.id))); setSelected(new Set()); };
  const changeRole = (id, role) => setUsers((us) => us.map((u) => (u.id === id ? { ...u, role } : u)));

  const invite = (form) => {
    const id = form.name.toLowerCase().replace(/[^a-z]+/g, ".") + Date.now();
    setUsers((us) => [{ id, name: form.name.trim(), email: form.email.trim(), dept: form.dept, role: form.role, status: "Invited", lastActive: "—", lastActiveDays: 999, joined: new Date().toISOString().slice(0, 10), completion: 0 }, ...us]);
    setShowInvite(false);
  };

  const exportCsv = () => {
    const rows = (selected.size ? filtered.filter((u) => selected.has(u.id)) : filtered);
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [["Name", "Email", "Department", "Role", "Status", "Last active", "Joined"], ...rows.map((u) => [u.name, u.email, u.dept, u.role, u.status, u.lastActive, u.joined])].map((r) => r.map(esc).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "users.csv" });
    a.click();
    URL.revokeObjectURL(url);
  };

  const sel = selected;

  return (
    <EmptyPagePlaceholder title="Users" desc="Manage accounts, roles, and access — activity and reflections stay private to each user.">
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total users" value={counts.total} icon={UsersIcon} color="indigo" />
          <StatCard label="Active" value={counts.active} icon={UserCheck} color="teal" />
          <StatCard label="Pending invites" value={counts.invited} icon={Mail} color="amber" />
          <StatCard label="Inactive / suspended" value={counts.attention} icon={UserX} color="violet" />
        </div>

        <Card padded={false}>
          {/* Toolbar */}
          <div className="p-4 sm:p-5 space-y-3 border-b border-slate-100">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 flex-1 lg:max-w-sm">
                <Search className="w-4 h-4 text-slate-400" />
                <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search by name, email or department..." className="bg-transparent text-sm outline-none w-full" aria-label="Search users" />
                {query && <button onClick={() => setQuery("")} aria-label="Clear search"><X className="w-4 h-4 text-slate-400" /></button>}
              </div>
              <div className="flex flex-wrap gap-2 lg:ml-auto">
                <MenuSelect className="w-[132px]" value={roleF} onChange={(value) => resetPage(setRoleF)(value)} ariaLabel="Filter by role" options={[{ value: "all", label: "All roles" }, ...USER_ROLES.map((role) => ({ value: role, label: role }))]} />
                <MenuSelect className="w-[140px]" value={statusF} onChange={(value) => resetPage(setStatusF)(value)} ariaLabel="Filter by status" options={[{ value: "all", label: "All statuses" }, ...USER_STATUSES.map((status) => ({ value: status, label: status }))]} />
                <MenuSelect className="w-[165px]" value={deptF} onChange={(value) => resetPage(setDeptF)(value)} ariaLabel="Filter by department" options={[{ value: "all", label: "All departments" }, ...USER_DEPARTMENTS.map((department) => ({ value: department, label: department }))]} />
                <Button size="sm" variant="outline" icon={Download} onClick={exportCsv}>Export</Button>
                <Button size="sm" icon={Plus} onClick={() => setShowInvite(true)}>Invite User</Button>
              </div>
            </div>

            {(activeFilters.length > 0 || query) && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500">{filtered.length} of {users.length} users</span>
                {activeFilters.map((f) => (
                  <button key={f.label} onClick={() => { f.clear(); setPage(1); }} className="inline-flex items-center gap-1 rounded-full bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-600/20 px-2.5 py-1 text-xs font-medium">{f.label}<X className="w-3 h-3" /></button>
                ))}
                <button onClick={clearAll} className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline">Clear all</button>
              </div>
            )}

            {sel.size > 0 && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl bg-indigo-950 text-white px-4 py-2.5" role="region" aria-label="Bulk actions">
                <span className="text-sm font-semibold mr-2">{sel.size} selected</span>
                <button onClick={() => applyStatus(sel, "Active")} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold hover:bg-white/10"><UserCheck className="w-3.5 h-3.5" />Activate</button>
                <button onClick={() => applyStatus(sel, "Suspended")} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold hover:bg-white/10"><ShieldOff className="w-3.5 h-3.5" />Suspend</button>
                <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold hover:bg-white/10"><Download className="w-3.5 h-3.5" />Export</button>
                <button onClick={() => removeUsers(sel)} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-300 hover:bg-white/10"><UserX className="w-3.5 h-3.5" />Remove</button>
                <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-slate-300 hover:text-white">Clear</button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100 bg-slate-50/60">
                  <th className="py-3 pl-5 pr-2 w-10"><input type="checkbox" checked={allOnPageSelected} onChange={togglePage} aria-label="Select all on page" className="rounded border-slate-300 text-teal-600" /></th>
                  {COLUMNS.map((c) => (
                    <th key={c.key} className="py-3 px-3 whitespace-nowrap" aria-sort={sort.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
                      <button onClick={() => toggleSort(c.key)} className={`inline-flex items-center gap-1 uppercase tracking-wide ${sort.key === c.key ? "text-slate-700" : "hover:text-slate-600"}`}>{c.label}<SortIcon active={sort.key === c.key} dir={sort.dir} /></button>
                    </th>
                  ))}
                  <th className="w-12" />
                </tr>
              </thead>
              <tbody>
                {pageRows.map((u) => (
                  <tr key={u.id} className={`border-b border-slate-50 last:border-0 hover:bg-slate-50/60 ${sel.has(u.id) ? "bg-teal-50/40" : ""}`}>
                    <td className="py-3 pl-5 pr-2"><input type="checkbox" checked={sel.has(u.id)} onChange={() => toggleRow(u.id)} aria-label={`Select ${u.name}`} className="rounded border-slate-300 text-teal-600" /></td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold shrink-0">{initials(u.name)}</div>
                        <div><p className="font-medium text-slate-800 leading-tight">{u.name}</p><p className="text-xs text-slate-400">{u.email}</p></div>
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-slate-600">{u.dept}</td>
                    <td className="py-3 px-3 whitespace-nowrap"><Badge color={ROLE_COLOR[u.role]}>{u.role}</Badge></td>
                    <td className="py-3 px-3 whitespace-nowrap">{statusBadge(u.status)}</td>
                    <td className="py-3 px-3 whitespace-nowrap w-40">
                      <div className="flex items-center gap-2"><ProgressBar value={u.completion} className="!h-1.5 w-20" /><span className="text-xs text-slate-500 tabular-nums">{u.completion}%</span></div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-slate-500">{u.lastActive}</td>
                    <td className="py-3 px-3 whitespace-nowrap text-slate-500">{fmtDate(u.joined)}</td>
                    <td className="py-3 pr-4 relative">
                      <button onClick={(e) => { e.stopPropagation(); setMenuFor(menuFor === u.id ? null : u.id); }} aria-label={`Actions for ${u.name}`} aria-haspopup="menu" aria-expanded={menuFor === u.id} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
                      {menuFor === u.id && (
                        <div role="menu" onClick={(e) => e.stopPropagation()} className="absolute right-4 top-11 z-20 w-48 rounded-xl border border-slate-200 bg-white shadow-lift py-1.5 text-sm">
                          {u.status === "Invited" && <button role="menuitem" className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2" onClick={() => setMenuFor(null)}><Mail className="w-4 h-4 text-slate-400" />Resend invite</button>}
                          {u.role !== "Leader" && <button role="menuitem" className="w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => { changeRole(u.id, "Leader"); setMenuFor(null); }}>Make leader</button>}
                          {u.role !== "Employee" && <button role="menuitem" className="w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => { changeRole(u.id, "Employee"); setMenuFor(null); }}>Make employee</button>}
                          {u.status === "Suspended" || u.status === "Inactive"
                            ? <button role="menuitem" className="w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => { applyStatus(new Set([u.id]), "Active"); setMenuFor(null); }}>Activate</button>
                            : <button role="menuitem" className="w-full text-left px-3 py-2 hover:bg-slate-50" onClick={() => { applyStatus(new Set([u.id]), "Suspended"); setMenuFor(null); }}>Suspend</button>}
                          <div className="my-1 border-t border-slate-100" />
                          <button role="menuitem" className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50" onClick={() => { removeUsers(new Set([u.id])); setMenuFor(null); }}>Remove user</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pageRows.length === 0 && (
              <div className="text-center py-14">
                <p className="font-semibold text-slate-800 text-sm">No users match your filters</p>
                <p className="text-xs text-slate-500 mt-1 mb-4">Try a different search or remove a filter.</p>
                <Button size="sm" variant="outline" onClick={clearAll}>Clear filters</Button>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <MenuSelect className="w-[84px]" value={pageSize} onChange={(value) => { setPageSize(Number(value)); setPage(1); }} ariaLabel="Rows per page" options={PAGE_SIZES.map((size) => ({ value: size, label: String(size) }))} />
            </div>
            <span>{filtered.length === 0 ? "0 results" : `${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filtered.length)} of ${filtered.length}`}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(safePage - 1)} disabled={safePage <= 1} aria-label="Previous page" className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
              <span className="px-2 font-semibold text-slate-700">{safePage} / {pageCount}</span>
              <button onClick={() => setPage(safePage + 1)} disabled={safePage >= pageCount} aria-label="Next page" className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </Card>
      </div>
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvite={invite} />}
    </EmptyPagePlaceholder>
  );
};
