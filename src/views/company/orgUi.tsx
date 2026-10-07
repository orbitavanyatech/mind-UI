"use client";

/* Small helpers shared by the company-admin screens (People, Departments, Teams, Dashboard). */

import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { EyeOff } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { MIN_GROUP, type GroupStat } from "@/company/insights";
import type { Person } from "@/types";

export const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

export const Avatar = ({ name, size = "md" }: { name: string; size?: "sm" | "md" }) => (
  <div
    className={`${size === "sm" ? "w-7 h-7 text-[10px]" : "w-8 h-8 text-xs"} rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold shrink-0`}
    aria-hidden="true"
  >
    {initialsOf(name)}
  </div>
);

/** Display name for a person id, or an em dash when nobody is set. */
export const nameOf = (people: Person[], id: string | null) => people.find((p) => p.id === id)?.name ?? "—";

/** Reads the URL hash once on mount (e.g. `#invite`) so dashboards can deep-link into a page state. */
export const useInitialHash = (onHash: (hash: string) => void) => {
  const ref = React.useRef(onHash);
  ref.current = onHash;
  React.useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash) ref.current(hash);
  }, []);
};

/** Names of the groups whose numbers are withheld because they are too small to report on. */
export const suppressedNames = (groups: GroupStat[], reason?: GroupStat["suppression"]) =>
  groups.filter((g) => !g.reportable && (!reason || g.suppression === reason)).map((g) => g.name);

/** Footnote shown wherever groups have been left out of a chart or table. */
export const SuppressedNote = ({ groups }: { groups: GroupStat[] }) => {
  const { t } = useLanguage();
  const small = suppressedNames(groups, "small");
  const complementary = suppressedNames(groups, "complementary");
  if (small.length === 0 && complementary.length === 0) return null;
  return (
    <div className="space-y-1 mt-3">
      {small.length > 0 && (
        <p className="flex items-start gap-1.5 text-xs text-slate-400">
          <EyeOff className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{t("company.insights.suppressed", { min: MIN_GROUP, groups: small.join(", ") })}</span>
        </p>
      )}
      {complementary.length > 0 && (
        <p className="flex items-start gap-1.5 text-xs text-slate-400">
          <EyeOff className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{t("company.insights.suppressedComplementary", { groups: complementary.join(", ") })}</span>
        </p>
      )}
    </div>
  );
};

/** Bar chart of one metric per department. Departments under the privacy minimum are left out. */
export const DepartmentBars = ({ groups, metric, color, height = 200 }: { groups: GroupStat[]; metric: "engagement" | "completion" | "workload"; color: string; height?: number }) => {
  const { t } = useLanguage();
  const data = groups.filter((g) => g.reportable).map((g) => ({ dept: g.name, value: g[metric] as number }));
  if (data.length === 0) {
    return <p className="text-sm text-slate-400 text-center py-12">{t("company.insights.nothingToShow", { min: MIN_GROUP })}</p>;
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F2" />
        <XAxis dataKey="dept" tick={{ fontSize: 11, fill: "#9AA2AB" }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#9AA2AB" }} axisLine={false} tickLine={false} />
        <Tooltip />
        <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
