import type { GroupStat } from "@/company/insights";

/* Anonymous, aggregated wellbeing patterns for the company and its departments.
   Visible ONLY to the Company Administrator (and the platform). Team leaders never receive
   these numbers — a leader only sees named direct signals sent to them (see src/signals/SignalsContext.tsx). */

export const BALANCE_DIMENSIONS = [
  { key: "focus", label: "Focus" },
  { key: "energy", label: "Energy" },
  { key: "workload", label: "Workload" },
  { key: "safety", label: "Psychological safety" },
  { key: "recovery", label: "Recovery" },
  { key: "connection", label: "Connection" },
] as const;

const series4w = {
  focus: [61, 64, 68, 74], energy: [58, 62, 66, 71], workload: [72, 68, 64, 62],
  safety: [76, 78, 80, 82], recovery: [55, 59, 63, 67], connection: [69, 71, 73, 76],
};
const series12w = {
  focus: [55, 58, 61, 63, 64, 66, 68, 69, 70, 72, 73, 74],
  energy: [51, 55, 57, 60, 61, 63, 65, 66, 67, 68, 69, 71],
  workload: [78, 76, 74, 72, 70, 69, 68, 67, 65, 64, 63, 62],
  safety: [72, 73, 75, 76, 77, 78, 79, 79, 80, 81, 81, 82],
  recovery: [49, 52, 54, 57, 59, 60, 61, 63, 64, 65, 66, 67],
  connection: [64, 66, 68, 69, 70, 71, 72, 73, 74, 74, 75, 76],
};

export const BALANCE_PERIODS = {
  "4w": { label: "4 weeks", weeks: ["W1", "W2", "W3", "W4"], series: series4w },
  "12w": { label: "12 weeks", weeks: ["W1","W2","W3","W4","W5","W6","W7","W8","W9","W10","W11","W12"], series: series12w },
} as const;

type Values = Record<(typeof BALANCE_DIMENSIONS)[number]["key"], number>;

/* Demo survey results. Deliberately NOT exported: the only way to read them is `balanceFor`,
   which refuses any group that `computeInsights` has withheld (fewer than MIN_GROUP active
   people, or hidden to protect a smaller group). Teams never appear here — teams are below the
   reporting level. A real backend must apply the same rule server-side and never send the
   numbers of a withheld group at all. */
const COMPANY_VALUES: Values = { focus: 74, energy: 71, workload: 62, safety: 82, recovery: 67, connection: 76 };
const DEPARTMENT_VALUES: Record<string, Values> = {
  engineering: { focus: 72, energy: 68, workload: 59, safety: 79, recovery: 64, connection: 74 },
  design: { focus: 76, energy: 73, workload: 66, safety: 85, recovery: 70, connection: 79 },
  sales: { focus: 70, energy: 67, workload: 58, safety: 78, recovery: 63, connection: 75 },
  support: { focus: 73, energy: 70, workload: 61, safety: 81, recovery: 66, connection: 77 },
};

/** Balance values for a group, or null whenever the group is not reportable. */
export const balanceFor = (group: GroupStat): Values | null => {
  if (!group.reportable) return null;
  return group.id === "all" ? COMPANY_VALUES : DEPARTMENT_VALUES[group.id] ?? null;
};
