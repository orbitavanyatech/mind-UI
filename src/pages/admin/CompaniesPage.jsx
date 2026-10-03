/* Auto-generated during modernization refactor of Mind Elevate.
   Platform admin — manage every company (client organization) provisioned
   on Mind Elevate: plans, seats, engagement, and account status. */

import React, { useMemo, useState } from "react";
import {
  Ban,
  Building2,
  CheckCircle2,
  PlusCircle,
  Search,
  X
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyPagePlaceholder,
  ProgressBar
} from "../../components/ui/Primitives";
import { statusBadge } from "../../components/ui/Table";
import { COMPANIES } from "../../data/mockData";

const STATUS_FILTERS = ["All", "Active", "Trial", "At Risk", "Suspended"];
const PLAN_OPTIONS = ["Starter", "Growth", "Enterprise"];

const AddCompanyForm = ({ onCancel, onCreate }) => {
  const [name, setName] = useState("");
  const [plan, setPlan] = useState("Growth");
  const [seats, setSeats] = useState(250);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), plan, seats: Number(seats) || 0 });
  };

  return (
    <Card className="border-indigo-100 bg-indigo-50/40">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-slate-900 text-sm">Provision a new company</p>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
      </div>
      <form onSubmit={submit} className="grid sm:grid-cols-3 gap-4">
        <label className="block sm:col-span-1">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">Company name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Contoso Ltd" className="form-input" required />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">Plan</span>
          <select value={plan} onChange={(e) => setPlan(e.target.value)} className="form-input bg-white">
            {PLAN_OPTIONS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-slate-700">Seats</span>
          <input type="number" min="1" value={seats} onChange={(e) => setSeats(e.target.value)} className="form-input" />
        </label>
        <div className="sm:col-span-3 flex justify-end gap-3 pt-1">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
          <Button type="submit" size="sm">Create company</Button>
        </div>
      </form>
    </Card>
  );
};

const CompanyCard = ({ company, onToggleSuspend }) => {
  const pct = company.seats > 0 ? Math.round((company.seatsUsed / company.seats) * 100) : 0;
  const isSuspended = company.status === "Suspended";
  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0"><Building2 className="w-5 h-5 text-indigo-600" /></div>
          <div>
            <p className="font-semibold text-slate-900 text-sm">{company.name}</p>
            <p className="text-xs text-slate-500">{company.plan} plan</p>
          </div>
        </div>
        {statusBadge(company.status)}
      </div>

      <p className="text-xs text-slate-500 mb-1">Seats used</p>
      <ProgressBar value={pct} color="indigo" />
      <p className="text-xs text-slate-400 mt-1.5 mb-4">{company.seatsUsed.toLocaleString()} / {company.seats.toLocaleString()}</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Engagement</p>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{company.engagement}%</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">Renews</p>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{company.renewal}</p>
        </div>
      </div>

      <div className="mt-auto flex gap-2">
        <Button size="sm" variant="outline" className="flex-1">Manage</Button>
        <Button
          size="sm"
          variant={isSuspended ? "primary" : "outline"}
          icon={isSuspended ? CheckCircle2 : Ban}
          className={isSuspended ? "" : "!text-rose-600 !border-rose-200 hover:!bg-rose-50"}
          onClick={() => onToggleSuspend(company.id)}
        >
          {isSuspended ? "Reactivate" : "Suspend"}
        </Button>
      </div>
    </Card>
  );
};

export const CompaniesPage = () => {
  const [companies, setCompanies] = useState(COMPANIES);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const matchesQuery = c.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [companies, query, statusFilter]);

  const toggleSuspend = (id) => {
    setCompanies((current) => current.map((c) => {
      if (c.id !== id) return c;
      const suspending = c.status !== "Suspended";
      return { ...c, status: suspending ? "Suspended" : "Active", health: suspending ? "suspended" : "good" };
    }));
  };

  const createCompany = ({ name, plan, seats }) => {
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24) || `company-${companies.length + 1}`;
    setCompanies((current) => [
      { id, name, plan, seats, seatsUsed: 0, engagement: 0, status: "Trial", renewal: "—", health: "at_risk", mrr: 0 },
      ...current,
    ]);
    setShowAddForm(false);
  };

  return (
    <EmptyPagePlaceholder
      title="Companies"
      desc="Manage every organization provisioned on the Mind Elevate platform."
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies..."
            className="form-input pl-9"
          />
        </div>
        <Button icon={PlusCircle} onClick={() => setShowAddForm((v) => !v)} className="shrink-0">
          Add company
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${statusFilter === s ? "bg-indigo-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {s}
          </button>
        ))}
        <span className="text-xs text-slate-400 ml-1">{filtered.length} of {companies.length} companies</span>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <AddCompanyForm onCancel={() => setShowAddForm(false)} onCreate={createCompany} />
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => <CompanyCard key={c.id} company={c} onToggleSuspend={toggleSuspend} />)}
        </div>
      ) : (
        <Card className="text-center py-10">
          <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">No companies match your filters</p>
          <p className="text-xs text-slate-500 mt-1">Try a different search term or status filter.</p>
        </Card>
      )}
    </EmptyPagePlaceholder>
  );
};
