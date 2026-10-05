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
   - Deleting a department deletes its teams and leaves its people unassigned (never deletes people).
   - The last active Company Admin can't be demoted, deactivated or removed (the company would be locked out).
   - A session is aimed at everyone, one department or one team. Deleting that department/team cancels the
     session rather than silently widening its audience. */

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { COMPANY_SESSIONS, DEPARTMENTS, PEOPLE, TEAMS } from "@/data/mockData";
import { computeInsights, type Insights } from "@/company/insights";
import type { CompanySession, Department, OrgRole, Person, PersonStatus, SessionAudience, Team } from "@/types";

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
  departments: Department[];
  teams: Team[];
  sessions: CompanySession[];
  /** Aggregated, privacy-safe numbers derived from the live org structure. */
  insights: Insights;
  /** True for the only active Company Admin — their role/status/membership are locked. */
  isLastAdmin: (id: string) => boolean;

  invitePerson: (input: NewPerson) => void;
  updatePerson: (id: string, patch: Partial<Pick<Person, "name" | "title" | "role">>) => void;
  /** Place a person in a department (+ optional team of that department). */
  placePerson: (id: string, departmentId: string | null, teamId: string | null) => void;
  setPersonStatus: (id: string, status: PersonStatus) => void;
  removePerson: (id: string) => void;

  addDepartment: (name: string, headId: string | null) => void;
  updateDepartment: (id: string, patch: { name?: string; headId?: string | null }) => void;
  deleteDepartment: (id: string) => void;

  addTeam: (name: string, departmentId: string, leadId: string | null) => void;
  updateTeam: (id: string, patch: { name?: string; leadId?: string | null }) => void;
  deleteTeam: (id: string) => void;

  scheduleSession: (input: NewSession) => void;
  cancelSession: (id: string) => void;
}

const OrgContext = createContext<OrgValue | null>(null);

export const OrgProvider = ({ children }: { children: ReactNode }) => {
  const [people, setPeople] = useState<Person[]>(PEOPLE);
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS);
  const [teams, setTeams] = useState<Team[]>(TEAMS);
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

  const invitePerson = useCallback((input: NewPerson) => {
    const place = resolvePlacement(input.departmentId, input.teamId);
    setPeople((cur) => [
      ...cur,
      { id: newId("p"), name: input.name, email: input.email, title: input.title, role: input.role, status: "Invited", lastActive: "—", engagement: 0, completion: 0, workload: 0, ...place },
    ]);
  }, [resolvePlacement]);

  const updatePerson = useCallback<OrgValue["updatePerson"]>((id, patch) => {
    if (patch.role && patch.role !== "Company Admin" && isLastAdmin(id)) return;
    setPeople((cur) => cur.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, [isLastAdmin]);

  const placePerson = useCallback<OrgValue["placePerson"]>((id, departmentId, teamId) => {
    const place = resolvePlacement(departmentId, teamId);
    setPeople((cur) => cur.map((p) => (p.id === id ? { ...p, ...place } : p)));
    /* Leaving a department / team also vacates any head / lead seat they held there. */
    setDepartments((cur) => cur.map((d) => (d.headId === id && d.id !== place.departmentId ? { ...d, headId: null } : d)));
    setTeams((cur) => cur.map((t) => (t.leadId === id && t.id !== place.teamId ? { ...t, leadId: null } : t)));
  }, [resolvePlacement]);

  const setPersonStatus = useCallback<OrgValue["setPersonStatus"]>((id, status) => {
    if (status === "Inactive" && isLastAdmin(id)) return;
    setPeople((cur) => cur.map((p) => (p.id === id ? { ...p, status } : p)));
  }, [isLastAdmin]);

  const removePerson = useCallback((id: string) => {
    if (isLastAdmin(id)) return;
    setPeople((cur) => cur.filter((p) => p.id !== id));
    setDepartments((cur) => cur.map((d) => (d.headId === id ? { ...d, headId: null } : d)));
    setTeams((cur) => cur.map((t) => (t.leadId === id ? { ...t, leadId: null } : t)));
  }, [isLastAdmin]);

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

  const deleteDepartment = useCallback((id: string) => {
    const teamIds = new Set(teamsRef.current.filter((t) => t.departmentId === id).map((t) => t.id));
    cancelSessionsFor((a) => (a.kind === "department" && a.id === id) || (a.kind === "team" && teamIds.has(a.id)));
    setDepartments((cur) => cur.filter((d) => d.id !== id));
    setTeams((cur) => cur.filter((t) => t.departmentId !== id));
    setPeople((cur) => cur.map((p) => (p.departmentId === id ? { ...p, departmentId: null, teamId: null } : p)));
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

  const deleteTeam = useCallback((id: string) => {
    cancelSessionsFor((a) => a.kind === "team" && a.id === id);
    setTeams((cur) => cur.filter((t) => t.id !== id));
    setPeople((cur) => cur.map((p) => (p.teamId === id ? { ...p, teamId: null } : p)));
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
      people, departments, teams, sessions, insights, isLastAdmin,
      scheduleSession, cancelSession,
      invitePerson, updatePerson, placePerson, setPersonStatus, removePerson,
      addDepartment, updateDepartment, deleteDepartment,
      addTeam, updateTeam, deleteTeam,
    }),
    [people, departments, teams, sessions, insights, isLastAdmin, scheduleSession, cancelSession, invitePerson, updatePerson, placePerson, setPersonStatus, removePerson, addDepartment, updateDepartment, deleteDepartment, addTeam, updateTeam, deleteTeam],
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
};

export const useOrg = () => {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("useOrg must be used within an OrgProvider");
  return ctx;
};
