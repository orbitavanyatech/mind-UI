/* Anonymity rules, checked against many random org structures. Run: npm run check:anonymity
   Rules: small teams may exist, but figures stay hidden when a group has < MIN_GROUP active people,
   when hiding is needed to stop subtraction, and teams are never a reporting level. */
import { activeLabel, buildReportCsv, computeInsights, MIN_GROUP } from "../src/company/insights";
import type { Department, Person } from "../src/types";

let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];
const fail = (m: string): never => { console.error("✗ " + m); process.exit(1); };

let leaksChecked = 0;
for (let run = 0; run < 3000; run++) {
  const depts: Department[] = Array.from({ length: 1 + Math.floor(rnd() * 6) }, (_, i) => ({ id: `d${i}`, name: `D${i}`, headId: null }));
  const people: Person[] = Array.from({ length: Math.floor(rnd() * 45) }, (_, i) => {
    const d = rnd() < 0.15 ? null : pick(depts).id;
    return {
      id: `p${i}`, name: `P${i}`, email: "", title: "", role: "Employee", lastActive: "",
      status: pick(["Active", "Active", "Active", "Invited", "Suspended"] as const),
      departmentId: d,
      teamId: d && rnd() < 0.8 ? `${d}-t${Math.floor(rnd() * 4)}` : null, // many tiny teams (1-3 people)
      engagement: Math.round(rnd() * 100), completion: Math.round(rnd() * 100), workload: Math.round(rnd() * 100),
    };
  });
  const ins = computeInsights(people, depts);

  if (Object.keys(ins).sort().join() !== "byDepartment,overall") fail("Insights must not contain a team level");

  const all = [ins.overall, ...ins.byDepartment];
  for (const g of all) {
    const metrics = [g.engagement, g.completion, g.workload];
    if (g.reportable && g.active < MIN_GROUP) fail(`${g.name} reportable with only ${g.active} active`);
    if (!g.reportable && metrics.some((m) => m !== null)) fail(`${g.name} withheld but has figures`);
    if (g.reportable && metrics.some((m) => m === null)) fail(`${g.name} reportable but missing figures`);
    const label = activeLabel(g);
    if (!g.reportable && /^\d/.test(label)) fail(`${g.name} withheld but prints a count (${label})`);
  }

  /* Subtraction: if the company is reported, the active people NOT in a published department must be
     none, or at least MIN_GROUP, so no hidden group/person can be recovered as total minus the rest. */
  if (ins.overall.reportable) {
    const published = new Set(ins.byDepartment.filter((g) => g.reportable).map((g) => g.id));
    const hiddenActive = people.filter((p) => p.status === "Active" && !(p.departmentId && published.has(p.departmentId))).length;
    if (hiddenActive !== 0 && hiddenActive < MIN_GROUP) fail(`run ${run}: only ${hiddenActive} active people hidden — recoverable by subtraction`);
  }

  /* The CSV export drops withheld groups entirely. */
  const csv = buildReportCsv(ins, { group: "g", active: "a", engagement: "e", completion: "c", workload: "w", company: "Company" });
  for (const g of ins.byDepartment.filter((x) => !x.reportable)) if (csv.includes(g.name + ",")) fail(`CSV contains withheld group ${g.name}`);
  leaksChecked++;
}
console.log(`✓ Anonymity rules held in ${leaksChecked} random organisations (tiny teams included).`);
