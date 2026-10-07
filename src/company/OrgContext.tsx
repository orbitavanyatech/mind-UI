"use client";

/* Company workspace state for the company administrator.
   Holds the company's people, departments and teams in one place so the People,
   Departments, Teams pages and the dashboard always agree. Demo only: state lives in
   memory (resets on a full page reload); swap the reducer-style helpers below for API
   calls when a backend exists.

   Placement rules (kept here so every page behaves the same):
   - A team always belongs to exactly one department.
   - A person is placed in a department and optionally in ONE team of that department.
   - Moving a person to another department clears their team unless the team belongs to it.
   - Naming a department head / team lead places that person in the department / team.
   - Teams and departments are ARCHIVED, never deleted. An archived unit leaves the active organisation
     (`departments` / `teams` only ever contain active ones) but its record stays in `archivedDepartments` /
     `archivedTeams`. Closing a department archives its teams too. Members become unassigned (a closed team's
     members stay in their department) and each person's earlier placement is written to `placementHistory`.
     Because former members simply become unassigned, the anonymity rules in insights.ts (small-group
     withholding + complementary suppression) keep holding: they count towards the hidden pool.
   - A Customer Administrator may SUSPEND a person (e.g. someone who left); permanent deletion is Bebrave only.
   - PERMISSIONS: the Customer Administrator manages placement only. Creating or permanently deleting
     accounts and changing roles (Leader / Company Admin) are NOT available here — they are requested via
     `requestNewUser` / `requestRemoval` / `requestRoleChange` and applied only after Bebrave approves
     (see RequestsContext). Approved requests are applied by the effect below.
   - The last active Company Admin can't be demoted, deactivated or removed (the company would be locked out).
   - A session is aimed at everyone, one department or one team. Archiving that department/team cancels the
     session rather than silently widening its audience. */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRequests } from "@/requests/RequestsContext";
import { COMPANY_SESSIONS, DEPARTMENTS, PEOPLE, TEAMS } from "@/data/mockData";
import { computeInsights, type Insights } from "@/company/insights";
import type { CompanySession, Department, OrgRole, Person, PersonStatus, PlacementRecord, SessionAudience, Team } from "@/types";

const today = () => new Date().toISOString().slice(0, 10);

/* Close off the person's current placement into their history (no-op if they have none). */
const archivePlacement = (p: Person, reason: PlacementRecord["reason"]): Person =>
  p.departmentId || p.teamId ? { ...p, placementHistory: [...(p.placementHistory ?? []), { departmentId: p.departmentId, teamId: p.teamId, until: today(), reason }] } : p;

export interface NewPerson {
  name: string;
  email: string;
  title: string;
  role: OrgRole;
  departmentId: string | null;
  teamId: string | null;
}

export interface NewSession {
  title: string;
  host: string;
  date: string;
  time: string;
  audience: SessionAudience;
}

interface OrgValue {
  people: Person[];
  /** ACTIVE departments only. */
  departments: Department[];
  /** ACTIVE teams only. */
  teams: Team[];
  /** Closed departments / archived teams, newest first. Their records stay for history. */
  archivedDepartments: Department[];
  archivedTeams: Team[];
  sessions: CompanySession[];
  /** Aggregated, privacy-safe numbers derived from the live org structure. */
  insights: Insights;
  /** True for the only active Company Admin — their role/status/membership are locked. */
  isLastAdmin: (id: string) => boolean;

  /** Ask Bebrave to create an account (a Customer Administrator cannot create users directly). */
  requestNewUser: (input: NewPerson) => void;
  /** Ask Bebrave to permanently delete an account. Use `setPersonStatus` to deactivate instead. */
  requestRemoval: (id: string) => void;
  /** Ask Bebrave to make someone a Leader / Company Admin, or to remove that role. */
  requestRoleChange: (id: string, toRole: OrgRole) => void;
  /** True while a request about this person is waiting for Bebrave. */
  hasPendingRequest: (id: string) => boolean;
  updatePerson: (id: string, patch: Partial<Pick<Person, "name" | "title">>) => void;
  /** Place a person in a department (+ optional team of that department). */
  placePerson: (id: string, departmentId: string | null, teamId: string | null) => void;
  setPersonStatus: (id: string, status: PersonStatus) => void;

  addDepartment: (name: string, headId: string | null) => void;
  updateDepartment: (id: string, patch: { name?: string; headId?: string | null }) => void;
  /** Close a department: it leaves the active organisation, its history stays. */
  archiveDepartment: (id: string) => void;

  addTeam: (name: string, departmentId: string, leadId: string | null) => void;
  updateTeam: (id: string, patch: { name?: string; leadId?: string | null }) => void;
  /** Archive a team: it leaves the active organisation, its history stays. */
  archiveTeam: (id: string) => void;

  scheduleSession: (input: NewSession) => void;
  cancelSession: (id: string) => void;
}

const OrgContext = createContext<OrgValue | null>(null);

export const OrgProvider = ({ children }: { children: ReactNode }) => {
  const [people, setPeople] = useState<Person[]>(PEOPLE);
  const [allDepartments, setDepartments] = useState<Department[]>(DEPARTMENTS);
  const [allTeams, setTeams] = useState<Team[]>(TEAMS);
  const departments = useMemo(() => allDepartments.filter((d) => !d.archivedAt), [allDepartments]);
  const teams = useMemo(() => allTeams.filter((t) => !t.archivedAt), [allTeams]);
  const archivedDepartments = useMemo(() => allDepartments.filter((d) => d.archivedAt).reverse(), [allDepartments]);
  const archivedTeams = useMemo(() => allTeams.filter((t) => t.archivedAt).reverse(), [allTeams]);
  const [sessions, setSessions] = useState<CompanySession[]>(COMPANY_SESSIONS);
  const counter = useRef(0);
  const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${(counter.current++).toString(36)}`;

  /* Team -> department lookup that always sees the latest teams. */
  const teamsRef = useRef(teams);
  teamsRef.current = teams;
  const peopleRef = useRef(people);
  peopleRef.current = people;

  const isLastAdmin = useCallback((id: string) => {
    const admins = peopleRef.current.filter((p) => p.role === "Company Admin" && p.status === "Active");
    return admins.length === 1 && admins[0].id === id;
  }, []);

  /* Cancels scheduled sessions aimed at groups that are being deleted. */
  const cancelSessionsFor = useCallback((match: (a: SessionAudience) => boolean) => {
    setSessions((cur) => cur.map((s) => (s.status === "Scheduled" && match(s.audience) ? { ...s, status: "Cancelled" } : s)));
  }, []);

  const resolvePlacement = useCallback((departmentId: string | null, teamId: string | null) => {
    if (!departmentId) return { departmentId: null, teamId: null };
    const team = teamsRef.current.find((t) => t.id === teamId);
    return { departmentId, teamId: team && team.departmentId === departmentId ? team.id : null };
  }, []);

  const createPerson = useCallback((input: NewPerson) => {
    const place = resolvePlacement(input.departmentId, input.teamId);
    setPeople((cur) => [
      ...cur,
      { id: newId("p"), name: input.name, email: input.email, title: input.title, role: input.role, status: "Invited", lastActive: "—", engagement: 0, completion: 0, workload: 0, ...place },
    ]);
  }, [resolvePlacement]);

  const updatePerson = useCallback<OrgValue["updatePerson"]>((id, patch) => {
    /* Only name/title: the type no longer allows `role`, and this guards against casts. */
    const { name, title } = patch;
    setPeople((cur) => cur.map((p) => (p.id === id ? { ...p, ...(name !== undefined && { name }), ...(title !== undefined && { title }) } : p)));
  }, []);

  const placePerson = useCallback<OrgValue["placePerson"]>((id, departmentId, teamId) => {
    const place = resolvePlacement(departmentId, teamId);
    setPeople((cur) => cur.map((p) => {
      if (p.id !== id || (p.departmentId === place.departmentId && p.teamId === place.teamId)) return p;
      /* Moving or removing someone keeps what they had: the old placement goes to their history. */
      return { ...archivePlacement(p, place.departmentId || place.teamId ? "moved" : "removed"), ...place };
    }));
    /* Leaving a department / team also vacates any head / lead seat they held there (active units only). */
    setDepartments((cur) => cur.map((d) => (!d.archivedAt && d.headId === id && d.id !== place.departmentId ? { ...d, headId: null } : d)));
    setTeams((cur) => cur.map((t) => (!t.archivedAt && t.leadId === id && t.id !== place.teamId ? { ...t, leadId: null } : t)));
  }, [resolvePlacement]);

  const setPersonStatus = useCallback<OrgValue["setPersonStatus"]>((id, status) => {
    if (status === "Suspended" && isLastAdmin(id)) return;
    setPeople((cur) => cur.map((p) => (p.id === id ? { ...p, status } : p)));
  }, [isLastAdmin]);

  const deletePerson = useCallback((id: string) => {
    setPeople((cur) => cur.filter((p) => p.id !== id));
    setDepartments((cur) => cur.map((d) => (!d.archivedAt && d.headId === id ? { ...d, headId: null } : d)));
    setTeams((cur) => cur.map((t) => (!t.archivedAt && t.leadId === id ? { ...t, leadId: null } : t)));
  }, []);

  /* ---- Requests to Bebrave ---- */
  const { requests, submitRequest } = useRequests();

  const requestNewUser = useCallback<OrgValue["requestNewUser"]>((input) => {
    submitRequest({ kind: "new_user", personName: input.name, email: input.email, title: input.title, toRole: input.role, departmentId: input.departmentId, teamId: input.teamId });
  }, [submitRequest]);

  const requestRemoval = useCallback((id: string) => {
    const p = peopleRef.current.find((x) => x.id === id);
    if (!p || isLastAdmin(id)) return;
    submitRequest({ kind: "remove_user", personId: id, personName: p.name, email: p.email, fromRole: p.role });
  }, [submitRequest, isLastAdmin]);

  const requestRoleChange = useCallback((id: string, toRole: OrgRole) => {
    const p = peopleRef.current.find((x) => x.id === id);
    if (!p || p.role === toRole) return;
    if (p.role === "Company Admin" && isLastAdmin(id)) return;
    submitRequest({ kind: "role_change", personId: id, personName: p.name, email: p.email, fromRole: p.role, toRole });
  }, [submitRequest, isLastAdmin]);

  const hasPendingRequest = useCallback((id: string) => requests.some((r) => r.status === "Pending" && r.personId === id), [requests]);

  /* Apply requests Bebrave approved (once each). Runs on mount too, so approvals made while the
     company area was closed still land when it is opened. */
  const applied = useRef<Set<string>>(new Set());
  useEffect(() => {
    for (const r of requests) {
      if (r.status !== "Approved" || applied.current.has(r.id)) continue;
      applied.current.add(r.id);
      if (r.kind === "new_user") createPerson({ name: r.personName, email: r.email ?? "", title: r.title ?? "—", role: r.toRole ?? "Employee", departmentId: r.departmentId ?? null, teamId: r.teamId ?? null });
      else if (r.kind === "remove_user" && r.personId) deletePerson(r.personId);
      else if (r.kind === "role_change" && r.personId && r.toRole) {
        const to = r.toRole;
        setPeople((cur) => cur.map((p) => (p.id === r.personId ? { ...p, role: to } : p)));
      }
    }
  }, [requests, createPerson, deletePerson]);

  const addDepartment = useCallback((name: string, headId: string | null) => {
    const id = newId("d");
    setDepartments((cur) => [...cur, { id, name, headId }]);
    if (headId) setPeople((cur) => cur.map((p) => (p.id === headId ? { ...p, departmentId: id, teamId: null } : p)));
  }, []);

  const updateDepartment = useCallback<OrgValue["updateDepartment"]>((id, patch) => {
    setDepartments((cur) => cur.map((d) => (d.id === id ? { ...d, ...patch } : d)));
    if (patch.headId) {
      const headId = patch.headId;
      setPeople((cur) => cur.map((p) => (p.id === headId && p.departmentId !== id ? { ...p, departmentId: id, teamId: null } : p)));
    }
  }, []);

  const archiveDepartment = useCallback((id: string) => {
    const stamp = today();
    const teamIds = new Set(teamsRef.current.filter((t) => t.departmentId === id).map((t) => t.id));
    cancelSessionsFor((a) => (a.kind === "department" && a.id === id) || (a.kind === "team" && teamIds.has(a.id)));
    setDepartments((cur) => cur.map((d) => (d.id === id && !d.archivedAt ? { ...d, archivedAt: stamp } : d)));
    setTeams((cur) => cur.map((t) => (t.departmentId === id && !t.archivedAt ? { ...t, archivedAt: stamp } : t)));
    setPeople((cur) => cur.map((p) => (p.departmentId === id ? { ...archivePlacement(p, "department_archived"), departmentId: null, teamId: null } : p)));
  }, [cancelSessionsFor]);

  const addTeam = useCallback((name: string, departmentId: string, leadId: string | null) => {
    const id = newId("t");
    setTeams((cur) => [...cur, { id, name, departmentId, leadId }]);
    if (leadId) setPeople((cur) => cur.map((p) => (p.id === leadId ? { ...p, departmentId, teamId: id } : p)));
  }, []);

  const updateTeam = useCallback<OrgValue["updateTeam"]>((id, patch) => {
    const team = teamsRef.current.find((t) => t.id === id);
    setTeams((cur) => cur.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    if (patch.leadId && team) {
      const leadId = patch.leadId;
      setPeople((cur) => cur.map((p) => (p.id === leadId ? { ...p, departmentId: team.departmentId, teamId: id } : p)));
    }
  }, []);

  const archiveTeam = useCallback((id: string) => {
    cancelSessionsFor((a) => a.kind === "team" && a.id === id);
    setTeams((cur) => cur.map((t) => (t.id === id && !t.archivedAt ? { ...t, archivedAt: today() } : t)));
    /* Members stay in their department; only the team placement ends (and is remembered). */
    setPeople((cur) => cur.map((p) => (p.teamId === id ? { ...archivePlacement(p, "team_archived"), teamId: null } : p)));
  }, [cancelSessionsFor]);

  const scheduleSession = useCallback((input: NewSession) => {
    setSessions((cur) => [...cur, { id: newId("cs"), ...input, status: "Scheduled" }]);
  }, []);

  const cancelSession = useCallback((id: string) => {
    setSessions((cur) => cur.map((s) => (s.id === id ? { ...s, status: "Cancelled" } : s)));
  }, []);

  const insights = useMemo(() => computeInsights(people, departments), [people, departments]);

  const value = useMemo<OrgValue>(
    () => ({
      people, departments, teams, archivedDepartments, archivedTeams, sessions, insights, isLastAdmin,
      scheduleSession, cancelSession,
      requestNewUser, requestRemoval, requestRoleChange, hasPendingRequest, updatePerson, placePerson, setPersonStatus,
      addDepartment, updateDepartment, archiveDepartment,
      addTeam, updateTeam, archiveTeam,
    }),
    [people, departments, teams, archivedDepartments, archivedTeams, sessions, insights, isLastAdmin, scheduleSession, cancelSession, requestNewUser, requestRemoval, requestRoleChange, hasPendingRequest, updatePerson, placePerson, setPersonStatus, addDepartment, updateDepartment, archiveDepartment, addTeam, updateTeam, archiveTeam],
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
};

export const useOrg = () => {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("useOrg must be used within an OrgProvider");
  return ctx;
};
