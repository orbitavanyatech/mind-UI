/* Aggregated, privacy-safe views of a company's workforce.

   The company administrator may see how groups are doing, never how individuals are doing.
   Two rules are enforced here, in one place, so every screen (Dashboard, Pulse, Reports,
   CSV export) behaves the same:

   1. Only ACTIVE people count: invited and deactivated people have no signal yet / any more.
   2. A group is only reportable once it has at least MIN_GROUP active people. Below that,
      its numbers are withheld (null) because they could identify an individual — this is the
      "minimum group size for reports" promised in Settings.
   3. Complementary suppression: withholding a small group is useless if it can be recomputed
      as "company total minus every other group". So whenever the people left out of the
      published breakdown (small groups + people without a department) number fewer than
      MIN_GROUP, the smallest remaining group is withheld too, until the hidden pool is large
      enough that no single group (or person) can be isolated.

   4. TEAMS ARE STRUCTURE, NOT A REPORTING LEVEL. A team may have any number of members (even 1 or 2), but
      `Insights` has no team breakdown at all, so a small team can never produce a figure. Departments
      follow rules 1-3; anything a withheld group would reveal — its averages AND its exact headcount —
      stays hidden (use `activeLabel`, never print `g.active` for a group directly).

   Every figure that leaves this module goes through `summarize`; screens must never compute
   their own averages from `Person` records. */

import type { Department, Person, SessionAudience, Team } from "@/types";

export const MIN_GROUP = 5;

/** Why a group's numbers are withheld: it is too small itself, or hiding it protects a small group. */
export type Suppression = "small" | "complementary";

export interface GroupStat {
  id: string;
  name: string;
  /** Everyone placed in the group, whatever their status. */
  headcount: number;
  /** People who are Active — the only ones that contribute to the averages. INTERNAL for withheld groups: display via `activeLabel`. */
  active: number;
  /** false when `active` is below MIN_GROUP (or the group is withheld to protect another); the averages are then null. */
  reportable: boolean;
  suppression: Suppression | null;
  engagement: number | null;
  completion: number | null;
  workload: number | null;
}

/* Reports deliberately stop at department level (see the privacy notice on the Reports screen):
   teams are small enough that a team average would point at individuals. */
export interface Insights {
  overall: GroupStat;
  byDepartment: GroupStat[];
}

const avg = (values: number[]) => Math.round(values.reduce((a, b) => a + b, 0) / values.length);

export const summarize = (id: string, name: string, members: Person[]): GroupStat => {
  const active = members.filter((p) => p.status === "Active");
  const reportable = active.length >= MIN_GROUP;
  return {
    id,
    name,
    headcount: members.length,
    active: active.length,
    reportable,
    suppression: reportable ? null : "small",
    engagement: reportable ? avg(active.map((p) => p.engagement)) : null,
    completion: reportable ? avg(active.map((p) => p.completion)) : null,
    workload: reportable ? avg(active.map((p) => p.workload)) : null,
  };
};

/** What may be printed as a group's "active people" number: the count when the group is reportable,
 *  "<5" when it is too small, and "—" when it is withheld only to protect a smaller group (its exact size
 *  would help someone subtract). Screens must use this instead of `g.active`. */
export const activeLabel = (g: GroupStat): string =>
  g.reportable ? String(g.active) : g.suppression === "small" ? `<${MIN_GROUP}` : "—";

const withhold = (g: GroupStat): GroupStat => ({ ...g, reportable: false, suppression: "complementary", engagement: null, completion: null, workload: null });

export const computeInsights = (people: Person[], departments: Department[]): Insights => {
  const overall = summarize("all", "All", people);
  let byDepartment = departments.map((d) =>
    summarize(d.id, d.name, people.filter((p) => p.departmentId === d.id)),
  );

  /* Active people who are not in any published group: small groups plus people with no department
     (or a department that no longer exists). The company total includes them, so they must stay a
     pool of at least MIN_GROUP to be unrecoverable by subtraction. */
  const known = new Set(departments.map((d) => d.id));
  const poolSize = () =>
    people.filter((p) => p.status === "Active" && !(p.departmentId && known.has(p.departmentId))).length +
    byDepartment.filter((g) => !g.reportable).reduce((n, g) => n + g.active, 0);

  while (overall.reportable && poolSize() > 0 && poolSize() < MIN_GROUP) {
    const smallest = byDepartment.filter((g) => g.reportable).sort((a, b) => a.active - b.active)[0];
    if (!smallest) break;
    byDepartment = byDepartment.map((g) => (g.id === smallest.id ? withhold(g) : g));
  }
  return { overall, byDepartment };
};

/* ---- Session audiences ---- */

/** Who a session is aimed at: Active people only (an invitee who hasn't joined yet can't attend). */
export const audienceMembers = (people: Person[], audience: SessionAudience): Person[] =>
  people.filter((p) => {
    if (p.status !== "Active") return false;
    if (audience.kind === "everyone") return true;
    return audience.kind === "department" ? p.departmentId === audience.id : p.teamId === audience.id;
  });

/** True when the audience points at a department/team that no longer exists. */
export const audienceIsGone = (audience: SessionAudience, departments: Department[], teams: Team[]) =>
  (audience.kind === "department" && !departments.some((d) => d.id === audience.id)) ||
  (audience.kind === "team" && !teams.some((t) => t.id === audience.id));

/* ---- CSV export ---- */

const csvCell = (v: string | number) => {
  const text = String(v);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/** Aggregated report as CSV. Groups below the privacy minimum are left out entirely, not blanked. */
export const buildReportCsv = (insights: Insights, labels: { group: string; active: string; engagement: string; completion: string; workload: string; company: string }) => {
  const rows = [insights.overall, ...insights.byDepartment].filter((g) => g.reportable);
  const lines = [[labels.group, labels.active, labels.engagement, labels.completion, labels.workload]];
  for (const g of rows) {
    lines.push([g.id === "all" ? labels.company : g.name, String(g.active), `${g.engagement}%`, `${g.completion}%`, `${g.workload}%`]);
  }
  return lines.map((l) => l.map(csvCell).join(",")).join("\n");
};
