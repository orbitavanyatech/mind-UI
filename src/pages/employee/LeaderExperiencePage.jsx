import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Circle, Lock, Scale, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Badge, Button, Card, EmptyPagePlaceholder, ProgressBar } from "../../components/ui/Primitives";
import { LEADER_FOCUS, LEADER_NUDGES, LEADER_PRACTICES } from "../../data/featureData";
import { TEAM_PULSE } from "../../data/mockData";
import { useNavigation } from "../../navigation/NavigationContext";

const NUDGE_STYLES = {
  amber: "border-amber-200 bg-amber-50/60",
  teal: "border-teal-200 bg-teal-50/60",
  violet: "border-violet-200 bg-violet-50/60",
};

export const LeaderExperiencePage = ({ user }) => {
  const { navigate } = useNavigation();
  const [actions, setActions] = useState(LEADER_FOCUS.actions);
  const [tried, setTried] = useState(() => new Set());
  const done = actions.filter((a) => a.done).length;
  const first = user?.name?.split(" ")[0] || "there";

  return (
    <EmptyPagePlaceholder title="Leader Experience" desc="Tools and practices built for how you lead — separate from your own personal learning.">
      <div className="space-y-6">
        {/* Hero */}
        <Card className="!p-0 overflow-hidden border-violet-100">
          <div className="bg-indigo-950 mpp-noise-surface p-6 sm:p-8 text-white flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <Badge color="violet"><ShieldCheck className="w-3 h-3" />Leader space</Badge>
              <h3 className="mpp-display text-2xl font-bold mt-3">Good to see you, {first}.</h3>
              <p className="text-sm text-slate-300 mt-2 max-w-xl">Here's a calm overview of how your team is doing as a group, plus one thing worth trying this week.</p>
              <div className="flex flex-wrap gap-3 mt-5">
                <Button icon={Scale} onClick={() => navigate("teamBalance", {})}>Open Team Balance</Button>
                <Button variant="outline" className="!bg-transparent !text-white !border-white/30 hover:!bg-white/10" onClick={() => navigate("coaching", {})}>Leadership Coaching</Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 lg:w-96">
              {TEAM_PULSE.map((m) => (
                <div key={m.label} className="rounded-xl bg-white/10 ring-1 ring-white/10 p-3 text-center">
                  <p className="mpp-display text-2xl font-bold">{m.value}</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Weekly leader focus */}
          <Card className="lg:col-span-2">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-semibold tracking-wide uppercase text-violet-600 mb-1">This week for your team</p>
                <p className="font-semibold text-slate-900">{LEADER_FOCUS.title}</p>
                <p className="text-xs text-slate-500 mt-1">{LEADER_FOCUS.desc}</p>
              </div>
              <Badge color="violet">{done}/{actions.length}</Badge>
            </div>
            <ProgressBar value={Math.round((done / actions.length) * 100)} color="violet" className="mb-4" />
            <ul className="space-y-2">
              {actions.map((a) => (
                <li key={a.id}>
                  <button onClick={() => setActions((as) => as.map((x) => (x.id === a.id ? { ...x, done: !x.done } : x)))} className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${a.done ? "border-violet-200 bg-violet-50/60 text-slate-500" : "border-slate-200 hover:bg-slate-50 text-slate-800"}`}>
                    {a.done ? <CheckCircle2 className="w-5 h-5 text-violet-600 shrink-0" /> : <Circle className="w-5 h-5 text-slate-300 shrink-0" />}
                    <span className={a.done ? "line-through" : ""}>{a.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          {/* Nudges */}
          <div className="space-y-3">
            <p className="flex items-center gap-2 font-semibold text-slate-900"><Sparkles className="w-4 h-4 text-violet-500" />Worth noticing</p>
            {LEADER_NUDGES.map((n) => (
              <div key={n.id} className={`rounded-2xl border p-4 ${NUDGE_STYLES[n.tone]}`}>
                <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Practices */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-slate-900">Leadership practices</p>
            <span className="text-xs text-slate-400">{tried.size} tried this month</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {LEADER_PRACTICES.map((p) => (
              <Card key={p.id} className="flex flex-col !p-5">
                <div className="flex items-center gap-2 mb-2"><Badge color="violet">{p.tag}</Badge><span className="text-xs text-slate-400">{p.duration}</span></div>
                <p className="font-semibold text-slate-900 text-sm">{p.title}</p>
                <p className="text-xs text-slate-500 mt-1 mb-4">{p.desc}</p>
                <Button size="sm" variant={tried.has(p.id) ? "subtle" : "outline"} className="mt-auto self-start" onClick={() => setTried((s) => { const n = new Set(s); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })}>
                  {tried.has(p.id) ? "Marked as tried" : "Try this"}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-indigo-50/60 border-indigo-100">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-900">See the full picture of your team's balance</p>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1"><Lock className="w-3 h-3" />Aggregated only — you never see individual responses.</p>
            </div>
          </div>
          <Button variant="dark" size="sm" onClick={() => navigate("teamBalance", {})}>Team Balance <ArrowRight className="w-4 h-4" /></Button>
        </Card>
      </div>
    </EmptyPagePlaceholder>
  );
};
