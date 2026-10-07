"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Circle, Lock, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import { Badge, Button, Card, ProgressBar } from "@/components/ui/Primitives";
import { LEADER_FOCUS, LEADER_NUDGES, LEADER_PRACTICES } from "@/data/featureData";
import { bucketFor, useNow, dueInfo, useSignals } from "@/signals/SignalsContext";
import { useRouter } from "next/navigation";

const NUDGE_STYLES: Record<string, string> = {
  amber: "border-amber-200 bg-amber-50/60",
  teal: "border-teal-200 bg-teal-50/60",
  violet: "border-violet-200 bg-violet-50/60",
};

export const LeaderExperiencePage = () => {
  const router = useRouter();
  const [actions, setActions] = useState(LEADER_FOCUS.actions);
  const [tried, setTried] = useState<Set<string>>(new Set());
  const { inbox, needsResponse, unread } = useSignals();
  const now = useNow();
  const waiting = inbox.filter((x) => bucketFor(x) === "needs").slice(0, 3);
  const done = actions.filter((a) => a.done).length;

  return (
    <div className="space-y-6">
      <Card className="!p-0 overflow-hidden border-violet-100">
        <div className="bg-indigo-950 p-6 sm:p-8 text-white flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <Badge color="violet"><ShieldCheck className="w-3 h-3" />Leader space</Badge>
            <h1 className="mpp-display text-2xl font-bold mt-3">Your Leader Experience</h1>
            <p className="text-sm text-slate-300 mt-2 max-w-xl">A dedicated space for leading well: signals people choose to send you, practical leadership habits and confidential support for your own development.</p>
            <div className="flex flex-wrap gap-3 mt-5">
              <Button onClick={() => router.push("/coaching")}>Leadership Coaching</Button>
              <Button variant="outline" className="!bg-transparent !text-white !border-white/30 hover:!bg-white/10" onClick={() => router.push("/personal-space")}>Personal Space</Button>
            </div>
          </div>
          <div className="rounded-xl bg-white/10 ring-1 ring-white/10 p-4 lg:w-96 text-center">
            <p className="mpp-display text-3xl font-bold">{needsResponse}</p>
            <p className="text-[11px] text-slate-300 mt-0.5">Direct signals need a reply{unread > 0 ? ` · ${unread} unopened` : ""}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <MessageSquareText className="w-5 h-5 text-violet-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Direct signals sent to you</p>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><Lock className="w-3 h-3" />Named, not anonymous, and only when a colleague explicitly chooses to send you one. Visible only to you and the sender, and never part of anonymous insights. You never see anonymous team, group or company insights.</p>
            </div>
          </div>
          <Button size="sm" variant="dark" onClick={() => router.push("/signals")}>Open inbox <ArrowRight className="w-4 h-4" /></Button>
        </div>
        {waiting.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No one is waiting on a reply from you.</p>
        ) : (
          <ul className="space-y-2">
            {waiting.map((x) => {
              const due = now !== null ? dueInfo(x, now) : null;
              return (
                <li key={x.id}>
                  <button type="button" onClick={() => router.push("/signals")} className="w-full flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left hover:bg-slate-50">
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">{x.leaderUnread && <span className="w-2 h-2 rounded-full bg-violet-600 shrink-0" />}{x.fromName}</span>
                      <span className="block text-xs text-slate-500 truncate">{x.topic} · {x.message}</span>
                    </span>
                    {due && <span className={`shrink-0 text-[11px] font-semibold ${due.overdue ? "text-rose-600" : "text-amber-600"}`}>{due.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div><p className="text-xs font-semibold tracking-wide uppercase text-violet-600 mb-1">This week for your team</p><p className="font-semibold text-slate-900">{LEADER_FOCUS.title}</p><p className="text-xs text-slate-500 mt-1">{LEADER_FOCUS.desc}</p></div>
            <Badge color="violet">{done}/{actions.length}</Badge>
          </div>
          <ProgressBar value={Math.round((done / actions.length) * 100)} color="violet" className="mb-4" />
          <ul className="space-y-2">
            {actions.map((a) => <li key={a.id}><button type="button" onClick={() => setActions((current) => current.map((x) => x.id === a.id ? { ...x, done: !x.done } : x))} className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm ${a.done ? "border-violet-200 bg-violet-50/60 text-slate-500" : "border-slate-200 hover:bg-slate-50 text-slate-800"}`}>{a.done ? <CheckCircle2 className="w-5 h-5 text-violet-600 shrink-0" /> : <Circle className="w-5 h-5 text-slate-300 shrink-0" />}<span className={a.done ? "line-through" : ""}>{a.label}</span></button></li>)}
          </ul>
        </Card>

        <div className="space-y-3">
          <p className="flex items-center gap-2 font-semibold text-slate-900"><Sparkles className="w-4 h-4 text-violet-500" />Worth noticing</p>
          {LEADER_NUDGES.map((n) => <div key={n.id} className={`rounded-2xl border p-4 ${NUDGE_STYLES[n.tone]}`}><p className="text-sm font-semibold text-slate-900">{n.title}</p><p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.body}</p></div>)}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3"><p className="font-semibold text-slate-900">Leadership practices</p><span className="text-xs text-slate-400">{tried.size} tried this month</span></div>
        <div className="grid sm:grid-cols-2 gap-5">
          {LEADER_PRACTICES.map((p) => <Card key={p.id} className="flex flex-col !p-5"><div className="flex items-center gap-2 mb-2"><Badge color="violet">{p.tag}</Badge><span className="text-xs text-slate-400">{p.duration}</span></div><p className="font-semibold text-slate-900 text-sm">{p.title}</p><p className="text-xs text-slate-500 mt-1 mb-4">{p.desc}</p><Button size="sm" variant={tried.has(p.id) ? "subtle" : "outline"} className="mt-auto self-start" onClick={() => setTried((current) => { const next = new Set(current); next.has(p.id) ? next.delete(p.id) : next.add(p.id); return next; })}>{tried.has(p.id) ? "Marked as tried" : "Try this"}</Button></Card>)}
        </div>
      </div>
    </div>
  );
};
