"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight, Lock, Minus } from "lucide-react";
import { Badge, Card, PrivacyNotice } from "@/components/ui/Primitives";
import { BALANCE_DIMENSIONS, BALANCE_PERIODS, balanceFor } from "@/company/balanceData";
import { MIN_GROUP, type GroupStat } from "@/company/insights";
import { useOrg } from "@/company/OrgContext";

const LINE_COLORS: Record<string, string> = { focus: "#3346E8", energy: "#12B8A6", workload: "#EE8710", safety: "#DE3FA3", recovery: "#7986A8", connection: "#2E3759" };
const heat = (v: number) => {
  if (v < 60) return { background: "#FDD888", color: "#6D350F" };
  if (v < 68) return { background: "#FEEDC7", color: "#85400F" };
  if (v < 74) return { background: "#E0E7FF", color: "#1F267D" };
  if (v < 80) return { background: "#9DB0FF", color: "#14174A" };
  return { background: "#4A65FA", color: "#FFFFFF" };
};
const Delta = ({ value }: { value: number }) => value === 0
  ? <span className="inline-flex items-center text-xs text-slate-400"><Minus className="w-3 h-3" />0</span>
  : <span className={`inline-flex items-center text-xs font-semibold ${value > 0 ? "text-teal-600" : "text-amber-600"}`}>{value > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}{Math.abs(value)}</span>;

export const TeamBalancePage = () => {
  const { insights } = useOrg();
  const [period, setPeriod] = useState<keyof typeof BALANCE_PERIODS>("4w");
  const [groupId, setGroupId] = useState<string>("all");
  const [visible, setVisible] = useState<Set<string>>(new Set(BALANCE_DIMENSIONS.map((d) => d.key)));

  /* Whole company plus departments, straight from the live org. Groups are only ever listed with
     a lock when withheld; their numbers are never read (balanceFor returns null for them). */
  const groups: GroupStat[] = useMemo(() => [{ ...insights.overall, name: "Whole company" }, ...insights.byDepartment], [insights]);
  const group = groups.find((g) => g.id === groupId) ?? groups[0];
  const values = balanceFor(group);
  const hidden = values === null;
  const data = BALANCE_PERIODS[period];

  const series = useMemo(() => {
    const out: Record<string, number[]> = {};
    BALANCE_DIMENSIONS.forEach(({ key }) => {
      const base = data.series[key];
      /* A withheld group gets no series at all, not even the company curve. */
      out[key] = values ? base.map((v) => Math.max(0, Math.min(100, v + values[key] - base[base.length - 1]))) : [];
    });
    return out;
  }, [data, values]);

  const trendRows = hidden ? [] : data.weeks.map((week, i) => ({ week, ...Object.fromEntries(BALANCE_DIMENSIONS.map(({ key }) => [key, series[key][i]])) }));
  const radarRows = hidden ? [] : BALANCE_DIMENSIONS.map(({ key, label }) => ({ dim: label, Now: series[key][series[key].length - 1], Start: series[key][0] }));
  const latest = hidden ? [] : BALANCE_DIMENSIONS.map(({ key, label }) => ({ key, label, now: series[key][series[key].length - 1], delta: series[key][series[key].length - 1] - series[key][0] }));
  const sorted = [...latest].sort((a, b) => b.now - a.now);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const index = hidden ? 0 : 100 - (strongest.now - weakest.now);
  const toggleDim = (key: string) => setVisible((current) => { const next = new Set(current); if (next.has(key)) { if (next.size > 1) next.delete(key); } else next.add(key); return next; });

  return (
    <div className="space-y-6">
      <div><p className="text-xs font-semibold tracking-wide uppercase text-violet-600 mb-1">Company insight</p><h1 className="mpp-display text-2xl sm:text-3xl font-bold text-slate-900">Team Balance</h1><p className="text-sm text-slate-500 mt-1 max-w-2xl">How wellbeing patterns fit together across the company and its groups over time — as a group, never as individuals.</p></div>
      <PrivacyNotice text={`Anonymous and aggregated, shown only to company administration and the platform, and only for groups of ${MIN_GROUP} or more people. Team leaders never see these insights, and nobody can infer an individual's answers.`} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Group">
          {groups.map((g) => <button type="button" key={g.id} role="tab" aria-selected={groupId === g.id} onClick={() => setGroupId(g.id)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold inline-flex items-center gap-1.5 ${groupId === g.id ? "bg-violet-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{!g.reportable && <Lock className="w-3 h-3" />}{g.name}<span className="opacity-70">· {g.reportable ? g.active : `<${MIN_GROUP}`}</span></button>)}
        </div>
        <div className="inline-flex rounded-xl bg-slate-100 p-1">{(Object.entries(BALANCE_PERIODS) as [keyof typeof BALANCE_PERIODS, (typeof BALANCE_PERIODS)[keyof typeof BALANCE_PERIODS]][]).map(([k, p]) => <button type="button" key={k} onClick={() => setPeriod(k)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${period === k ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>{p.label}</button>)}</div>
      </div>

      {hidden ? <Card className="text-center py-14"><div className="w-12 h-12 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-4"><Lock className="w-5 h-5" /></div><p className="font-semibold text-slate-900">Hidden to protect anonymity</p><p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">{group.suppression === "complementary" ? `${group.name} is hidden because showing it would let the results of a group with fewer than ${MIN_GROUP} people be worked out by subtraction. ` : `${group.name} has fewer than ${MIN_GROUP} active people, so no figures are shown. `}Try the whole company instead.</p></Card> : <>
        <div className="grid sm:grid-cols-3 gap-5">
          <Card><p className="text-xs font-medium text-slate-500">Balance index</p><p className="mpp-display text-3xl font-bold text-slate-900 mt-1">{index}</p><p className="text-xs text-slate-500 mt-1">Higher means the gap between the strongest and weakest dimension is small.</p></Card>
          <Card><p className="text-xs font-medium text-slate-500">Strongest pattern</p><p className="mpp-display text-xl font-bold text-slate-900 mt-1">{strongest.label}</p><p className="text-xs text-teal-600 font-semibold mt-1">{strongest.now} / 100</p></Card>
          <Card><p className="text-xs font-medium text-slate-500">Needs attention</p><p className="mpp-display text-xl font-bold text-slate-900 mt-1">{weakest.label}</p><p className="text-xs text-amber-600 font-semibold mt-1">{weakest.now} / 100</p></Card>
        </div>

        <div className="grid lg:grid-cols-5 gap-5">
          <Card className="lg:col-span-2"><p className="font-semibold text-slate-900">Balance shape</p><p className="text-xs text-slate-500 mb-2">Now compared with the start of the period.</p><ResponsiveContainer width="100%" height={300}><RadarChart data={radarRows} outerRadius="72%"><PolarGrid stroke="#DDE1E5" /><PolarAngleAxis dataKey="dim" tick={{ fontSize: 11, fill: "#5A626D" }} /><PolarRadiusAxis domain={[40, 100]} tick={false} axisLine={false} /><Radar name="Start" dataKey="Start" stroke="#9AA2AB" fill="#9AA2AB" fillOpacity={0.15} strokeDasharray="4 4" /><Radar name="Now" dataKey="Now" stroke="#C02786" fill="#DE3FA3" fillOpacity={0.3} strokeWidth={2} /><Legend wrapperStyle={{ fontSize: 12 }} /><Tooltip /></RadarChart></ResponsiveContainer></Card>
          <Card className="lg:col-span-3"><p className="font-semibold text-slate-900">Trend</p><div className="flex flex-wrap gap-2 my-3">{BALANCE_DIMENSIONS.map(({ key, label }) => <button type="button" key={key} onClick={() => toggleDim(key)} aria-pressed={visible.has(key)} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${visible.has(key) ? "border-slate-300 text-slate-800" : "border-slate-200 text-slate-400 opacity-60"}`}><i className="w-2 h-2 rounded-full" style={{ background: LINE_COLORS[key] }} />{label}</button>)}</div><ResponsiveContainer width="100%" height={250}><LineChart data={trendRows} margin={{ top: 5, right: 12, bottom: 0, left: -18 }}><CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#EEF0F2" /><XAxis dataKey="week" tick={{ fontSize: 11, fill: "#747D88" }} axisLine={false} tickLine={false} /><YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: "#9AA2AB" }} axisLine={false} tickLine={false} /><Tooltip />{BALANCE_DIMENSIONS.filter((d) => visible.has(d.key)).map((d) => <Line key={d.key} type="monotone" dataKey={d.key} name={d.label} stroke={LINE_COLORS[d.key]} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />)}</LineChart></ResponsiveContainer></Card>
        </div>

        <Card><div className="flex items-center justify-between mb-4"><div><p className="font-semibold text-slate-900">Pattern heatmap</p><p className="text-xs text-slate-500">Darker blue = healthier. Amber = worth a closer look.</p></div><Badge color="violet">{group.name} · {group.active} people</Badge></div><div className="overflow-x-auto"><table className="w-full text-xs border-separate border-spacing-1"><thead><tr><th className="text-left font-semibold text-slate-400 uppercase tracking-wide px-2 py-1">Dimension</th>{data.weeks.map((w) => <th key={w} className="font-semibold text-slate-400 px-1 py-1 min-w-[40px]">{w}</th>)}<th className="text-right font-semibold text-slate-400 uppercase tracking-wide px-2">Change</th></tr></thead><tbody>{latest.map(({ key, label, delta }) => <tr key={key}><td className="px-2 py-1 font-medium text-slate-700 whitespace-nowrap">{label}</td>{series[key].map((v, i) => <td key={i} className="rounded-md text-center py-2 font-semibold" style={heat(v)}>{v}</td>)}<td className="px-2 text-right"><Delta value={delta} /></td></tr>)}</tbody></table></div></Card>
        <Card className="bg-violet-50/40 border-violet-100"><p className="font-semibold text-slate-900 mb-2">What this pattern suggests</p><ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-5"><li><strong>{strongest.label}</strong> is the strongest area for this group — protect what&apos;s working.</li><li><strong>{weakest.label}</strong> is the lowest dimension{weakest.delta < 0 ? " and has been trending down" : ""}. Consider which company-wide support or session could help.</li><li>Patterns describe the group, not any one person. Use them to plan company-level support, never to evaluate individuals or teams.</li></ul></Card>
      </>}
    </div>
  );
};
