import React, { useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight, Lock, Minus } from "lucide-react";
import { Badge, Card, EmptyPagePlaceholder, PrivacyNotice } from "../../components/ui/Primitives";
import { BALANCE_DIMENSIONS, BALANCE_GROUPS, BALANCE_PERIODS, MIN_GROUP } from "../../data/featureData";

const LINE_COLORS = { focus: "#3346E8", energy: "#12B8A6", workload: "#EE8710", safety: "#DE3FA3", recovery: "#7986A8", connection: "#2E3759" };

const heat = (v) => {
  /* 50 → soft amber, 70 → neutral, 85+ → strong signal blue. Inline because the colour is data-driven. */
  if (v < 60) return { background: "#FDD888", color: "#6D350F" };
  if (v < 68) return { background: "#FEEDC7", color: "#85400F" };
  if (v < 74) return { background: "#E0E7FF", color: "#1F267D" };
  if (v < 80) return { background: "#9DB0FF", color: "#14174A" };
  return { background: "#4A65FA", color: "#FFFFFF" };
};

const Delta = ({ value }) => {
  if (value === 0) return <span className="inline-flex items-center text-xs text-slate-400"><Minus className="w-3 h-3" />0</span>;
  const up = value > 0;
  return (
    <span className={`inline-flex items-center text-xs font-semibold ${up ? "text-teal-600" : "text-amber-600"}`}>
      {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}{Math.abs(value)}
    </span>
  );
};

export const TeamBalancePage = () => {
  const [period, setPeriod] = useState("4w");
  const [groupName, setGroupName] = useState(BALANCE_GROUPS[0].name);
  const [visible, setVisible] = useState(() => new Set(BALANCE_DIMENSIONS.map((d) => d.key)));

  const group = BALANCE_GROUPS.find((g) => g.name === groupName);
  const hidden = group.size < MIN_GROUP;
  const data = BALANCE_PERIODS[period];

  /* Whole-team series come from the period data; sub-groups scale it toward their own latest values. */
  const series = useMemo(() => {
    const out = {};
    BALANCE_DIMENSIONS.forEach(({ key }) => {
      const base = data.series[key];
      const offset = group.values[key] - base[base.length - 1];
      out[key] = base.map((v) => Math.max(0, Math.min(100, v + (hidden ? 0 : offset))));
    });
    return out;
  }, [data, group, hidden]);

  const trendRows = data.weeks.map((w, i) => ({ week: w, ...Object.fromEntries(BALANCE_DIMENSIONS.map(({ key }) => [key, series[key][i]])) }));
  const radarRows = BALANCE_DIMENSIONS.map(({ key, label }) => ({ dim: label, Now: series[key][series[key].length - 1], Start: series[key][0] }));

  const latest = BALANCE_DIMENSIONS.map(({ key, label }) => ({ key, label, now: series[key][series[key].length - 1], delta: series[key][series[key].length - 1] - series[key][0] }));
  const sorted = [...latest].sort((a, b) => b.now - a.now);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const index = 100 - (strongest.now - weakest.now);

  const toggleDim = (key) => setVisible((s) => { const n = new Set(s); if (n.has(key)) { if (n.size > 1) n.delete(key); } else n.add(key); return n; });

  return (
    <EmptyPagePlaceholder title="Team Balance" desc="How your team's wellbeing patterns fit together over time — as a group, never as individuals.">
      <div className="space-y-6">
        <PrivacyNotice text={`Results are aggregated and only shown for groups of ${MIN_GROUP} or more people. You can't see, and nobody can infer, an individual's answers.`} />

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Team group">
            {BALANCE_GROUPS.map((g) => (
              <button key={g.name} role="tab" aria-selected={groupName === g.name} onClick={() => setGroupName(g.name)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors inline-flex items-center gap-1.5 ${groupName === g.name ? "bg-violet-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                {g.size < MIN_GROUP && <Lock className="w-3 h-3" />}{g.name}<span className="opacity-70">· {g.size}</span>
              </button>
            ))}
          </div>
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            {Object.entries(BALANCE_PERIODS).map(([k, p]) => (
              <button key={k} onClick={() => setPeriod(k)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${period === k ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>{p.label}</button>
            ))}
          </div>
        </div>

        {hidden ? (
          <Card className="text-center py-14">
            <div className="w-12 h-12 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center mx-auto mb-4"><Lock className="w-5 h-5" /></div>
            <p className="font-semibold text-slate-900">Not enough people to show this group</p>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">{group.name} has {group.size} people. To protect privacy, patterns appear only for groups of {MIN_GROUP} or more. Try the whole team instead.</p>
          </Card>
        ) : (
          <>
            {/* Summary */}
            <div className="grid sm:grid-cols-3 gap-5">
              <Card>
                <p className="text-xs font-medium text-slate-500">Balance index</p>
                <p className="mpp-display text-3xl font-bold text-slate-900 mt-1">{index}</p>
                <p className="text-xs text-slate-500 mt-1">Higher means the gap between your strongest and weakest dimension is small.</p>
              </Card>
              <Card>
                <p className="text-xs font-medium text-slate-500">Strongest pattern</p>
                <p className="mpp-display text-xl font-bold text-slate-900 mt-1">{strongest.label}</p>
                <p className="text-xs text-teal-600 font-semibold mt-1">{strongest.now} / 100</p>
              </Card>
              <Card>
                <p className="text-xs font-medium text-slate-500">Needs attention</p>
                <p className="mpp-display text-xl font-bold text-slate-900 mt-1">{weakest.label}</p>
                <p className="text-xs text-amber-600 font-semibold mt-1">{weakest.now} / 100</p>
              </Card>
            </div>

            <div className="grid lg:grid-cols-5 gap-5">
              {/* Radar */}
              <Card className="lg:col-span-2">
                <p className="font-semibold text-slate-900">Balance shape</p>
                <p className="text-xs text-slate-500 mb-2">Now compared with the start of the period.</p>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarRows} outerRadius="72%">
                    <PolarGrid stroke="#DDE1E5" />
                    <PolarAngleAxis dataKey="dim" tick={{ fontSize: 11, fill: "#5A626D" }} />
                    <PolarRadiusAxis domain={[40, 100]} tick={false} axisLine={false} />
                    <Radar name="Start" dataKey="Start" stroke="#9AA2AB" fill="#9AA2AB" fillOpacity={0.15} strokeDasharray="4 4" />
                    <Radar name="Now" dataKey="Now" stroke="#C02786" fill="#DE3FA3" fillOpacity={0.3} strokeWidth={2} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #DDE1E5", fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>

              {/* Trend lines */}
              <Card className="lg:col-span-3">
                <p className="font-semibold text-slate-900">Trend</p>
                <div className="flex flex-wrap gap-2 my-3">
                  {BALANCE_DIMENSIONS.map(({ key, label }) => (
                    <button key={key} onClick={() => toggleDim(key)} aria-pressed={visible.has(key)} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border transition-opacity ${visible.has(key) ? "border-slate-300 text-slate-800" : "border-slate-200 text-slate-400 opacity-60"}`}>
                      <i className="w-2 h-2 rounded-full" style={{ background: LINE_COLORS[key] }} />{label}
                    </button>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendRows} margin={{ top: 5, right: 12, bottom: 0, left: -18 }}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#EEF0F2" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#747D88" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: "#9AA2AB" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #DDE1E5", fontSize: 12 }} />
                    {BALANCE_DIMENSIONS.filter((d) => visible.has(d.key)).map((d) => (
                      <Line key={d.key} type="monotone" dataKey={d.key} name={d.label} stroke={LINE_COLORS[d.key]} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Heatmap */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-slate-900">Pattern heatmap</p>
                  <p className="text-xs text-slate-500">Darker blue = healthier. Amber = worth a closer look.</p>
                </div>
                <Badge color="violet">{group.name} · {group.size} people</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-separate border-spacing-1">
                  <thead>
                    <tr>
                      <th className="text-left font-semibold text-slate-400 uppercase tracking-wide px-2 py-1">Dimension</th>
                      {data.weeks.map((w) => <th key={w} className="font-semibold text-slate-400 px-1 py-1 min-w-[40px]">{w}</th>)}
                      <th className="text-right font-semibold text-slate-400 uppercase tracking-wide px-2">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latest.map(({ key, label, delta }) => (
                      <tr key={key}>
                        <td className="px-2 py-1 font-medium text-slate-700 whitespace-nowrap">{label}</td>
                        {series[key].map((v, i) => <td key={i} className="rounded-md text-center py-2 font-semibold" style={heat(v)}>{v}</td>)}
                        <td className="px-2 text-right"><Delta value={delta} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Reading */}
            <Card className="bg-violet-50/40 border-violet-100">
              <p className="font-semibold text-slate-900 mb-2">What this pattern suggests</p>
              <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-5">
                <li><strong>{strongest.label}</strong> is your team's strongest area — protect what's working.</li>
                <li><strong>{weakest.label}</strong> is the lowest dimension{weakest.delta < 0 ? " and has been trending down" : ""}. A short conversation about it in your next team meeting could help.</li>
                <li>Patterns describe the group, not any one person. Use them as a prompt for curiosity, not as an evaluation.</li>
              </ul>
            </Card>
          </>
        )}
      </div>
    </EmptyPagePlaceholder>
  );
};
