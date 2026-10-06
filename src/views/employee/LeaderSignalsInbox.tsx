"use client";

/* Leader view of direct signals: the only wellbeing information a leader receives. Every item here
   is named and was explicitly sent to this leader; there are no anonymous or aggregated figures.
   Topics only filter the inbox: no per-topic counts, no scores. */

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock, Lock, MessageSquareText, RotateCcw, Send } from "lucide-react";
import { Badge, Button, Card, EmptyPagePlaceholder } from "@/components/ui/Primitives";
import { SignalPrivacyPanel, SignalVisibilityTag, TOPIC_NOTE } from "@/signals/SignalPrivacy";
import {
  bucketFor, dueInfo, MAX_LENGTH, timeAgo, useNow, useSignals,
  SIGNAL_TOPICS, type DirectSignal, type LeaderBucket, type SignalTopic,
} from "@/signals/SignalsContext";

type Filter = LeaderBucket | "all";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "needs", label: "Needs response" },
  { key: "waiting", label: "Waiting on them" },
  { key: "resolved", label: "Resolved" },
  { key: "all", label: "All" },
];

const STARTERS = [
  { label: "Acknowledge", text: "Thank you for telling me. I'd like to understand more — are you free for a short chat this week?" },
  { label: "Ask first", text: "I appreciate you raising this. What would help most right now?" },
  { label: "Next step", text: "Thanks for flagging this. I'll look at what we can change and come back to you with a next step." },
];

const bucketBadge = (s: DirectSignal) => {
  const b = bucketFor(s);
  return b === "needs" ? <Badge color="amber">Needs response</Badge> : b === "waiting" ? <Badge color="slate">Waiting on them</Badge> : <Badge color="teal">Resolved</Badge>;
};

const SignalDetail = ({ signal, now }: { signal: DirectSignal; now: number | null }) => {
  const { reply, resolve, reopen, saveNote } = useSignals();
  const [draft, setDraft] = useState("");
  const [note, setNote] = useState(signal.leaderNote);
  const bucket = bucketFor(signal);
  const due = now !== null && bucket === "needs" ? dueInfo(signal, now) : null;
  const first = signal.fromName.split(" ")[0];

  const send = () => {
    if (!draft.trim()) return;
    reply(signal.id, draft);
    setDraft("");
  };

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-slate-900">{signal.fromName}</p>
          <p className="text-xs text-slate-500">{signal.fromTitle}{now !== null && ` · sent ${timeAgo(signal.createdAt, now)}`}</p>
          <div className="mt-1.5"><SignalVisibilityTag viewer="leader" otherName={signal.fromName} /></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge color="violet">{signal.topic}</Badge>
          {signal.timeSensitive && <Badge color="rose"><Clock className="w-3 h-3" />Time-sensitive</Badge>}
          {signal.wantsConversation && <Badge color="indigo"><MessageSquareText className="w-3 h-3" />Wants a conversation</Badge>}
        </div>
      </div>

      {due && (
        <p className={`rounded-xl px-4 py-2.5 text-xs font-semibold ${due.overdue ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>{due.label}</p>
      )}

      <div className="space-y-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-800 leading-relaxed">{signal.message}</p>
        </div>
        {signal.thread.map((m) => (
          <div key={m.id} className={`rounded-2xl p-4 text-sm leading-relaxed ${m.by === "leader" ? "bg-violet-50 text-slate-800 ml-6" : "bg-slate-50 text-slate-800"}`}>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">{m.by === "leader" ? "You" : first}{now !== null && ` · ${timeAgo(m.at, now)}`}</p>
            {m.text}
          </div>
        ))}
      </div>

      {signal.topic === "Wellbeing" && (
        <p className="text-xs text-slate-600 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3">
          If this sounds serious, listen first and encourage {first} to use the confidential support your company offers. Don&apos;t try to be their counsellor.
        </p>
      )}

      {bucket !== "resolved" ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-900">Your reply</p>
          <div className="flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button key={s.label} type="button" onClick={() => setDraft(s.text)} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">{s.label}</button>
            ))}
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, MAX_LENGTH))}
            rows={4}
            placeholder={`Write back to ${first}…`}
            aria-label={`Reply to ${signal.fromName}`}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-teal-500"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-400">{draft.length}/{MAX_LENGTH} · {first} sees your reply</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" icon={CheckCircle2} onClick={() => resolve(signal.id)}>Mark resolved</Button>
              <Button size="sm" icon={Send} onClick={send} disabled={!draft.trim()}>Send reply</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-teal-50/60 px-4 py-3">
          <p className="text-sm text-teal-800">Resolved. {first} can reopen it with a follow-up.</p>
          <Button variant="outline" size="sm" icon={RotateCcw} onClick={() => reopen(signal.id)}>Reopen</Button>
        </div>
      )}

      <div>
        <label htmlFor={`note-${signal.id}`} className="flex items-center gap-1.5 text-sm font-semibold text-slate-900"><Lock className="w-3.5 h-3.5 text-violet-500" />Private note</label>
        <p className="text-xs text-slate-400 mb-2">Only you can see this. It isn&apos;t shared with {first}, the company or the platform.</p>
        <textarea
          id={`note-${signal.id}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => note !== signal.leaderNote && saveNote(signal.id, note)}
          rows={2}
          placeholder="Things to remember, follow-ups, how the conversation went…"
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-teal-500"
        />
      </div>
    </Card>
  );
};

export const LeaderSignalsInbox = () => {
  const { inbox, needsResponse, unread, open, ready } = useSignals();
  const now = useNow();
  const [filter, setFilter] = useState<Filter>("needs");
  const [topicFilter, setTopicFilter] = useState<SignalTopic | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const list = inbox.filter((s) => (filter === "all" || bucketFor(s) === filter) && (topicFilter === "all" || s.topic === topicFilter));
  const selected = inbox.find((s) => s.id === selectedId) ?? null;
  const counts = { needs: needsResponse, waiting: inbox.filter((s) => bucketFor(s) === "waiting").length, resolved: inbox.filter((s) => bucketFor(s) === "resolved").length };

  /* Opening a signal is what marks it "seen" for the sender — never a bare page load. */
  useEffect(() => {
    if (selected && (selected.leaderUnread || !selected.seenAt)) open(selected.id);
  }, [selected, open]);

  const choose = (id: string) => {
    setSelectedId(id);
    if (typeof window !== "undefined" && window.innerWidth < 1024) window.setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  if (!ready) return null;

  return (
    <EmptyPagePlaceholder title="Direct Signals" desc="Named messages your team members chose to send to you. They are not anonymous.">
      <SignalPrivacyPanel viewer="leader" otherName="the sender" />
      <p className="text-xs text-slate-500 mt-2">Please don&apos;t forward or discuss a signal without the sender&apos;s OK. You never see anonymous team, group or company insights here.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <Card className="!p-4"><p className="text-xs font-medium text-slate-500">Needs response</p><p className="mpp-display text-2xl font-bold text-slate-900 mt-1">{counts.needs}</p></Card>
        <Card className="!p-4"><p className="text-xs font-medium text-slate-500">Not opened yet</p><p className="mpp-display text-2xl font-bold text-slate-900 mt-1">{unread}</p></Card>
        <Card className="!p-4"><p className="text-xs font-medium text-slate-500">Waiting on them</p><p className="mpp-display text-2xl font-bold text-slate-900 mt-1">{counts.waiting}</p></Card>
        <Card className="!p-4"><p className="text-xs font-medium text-slate-500">Resolved</p><p className="mpp-display text-2xl font-bold text-slate-900 mt-1">{counts.resolved}</p></Card>
      </div>

      <div className="flex flex-wrap gap-2 mt-6" role="tablist" aria-label="Signal filter">
        {FILTERS.map((f) => (
          <button
            key={f.key} type="button" role="tab" aria-selected={filter === f.key} onClick={() => setFilter(f.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${filter === f.key ? "bg-violet-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            {f.label}{f.key !== "all" && <span className="opacity-70"> · {counts[f.key]}</span>}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-3">
        <label className="text-xs font-medium text-slate-500" htmlFor="topic-filter">Topic</label>
        <select id="topic-filter" value={topicFilter} onChange={(e) => setTopicFilter(e.target.value as SignalTopic | "all")} className="form-select-sm">
          <option value="all">All topics</option>
          {SIGNAL_TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <p className="text-xs text-slate-400">{TOPIC_NOTE.leader}</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5 mt-4">
        <div className="lg:col-span-2 space-y-3">
          {list.length === 0 ? (
            <Card className="text-center py-10">
              <p className="font-semibold text-slate-900">{filter === "needs" ? "You're all caught up" : "Nothing here"}</p>
              <p className="text-sm text-slate-500 mt-1">{filter === "needs" ? "No one is waiting on a reply from you." : "Signals will show up here as they change."}</p>
            </Card>
          ) : (
            list.map((s) => {
              const due = now !== null && bucketFor(s) === "needs" ? dueInfo(s, now) : null;
              return (
                <button
                  key={s.id} type="button" onClick={() => choose(s.id)} aria-current={selectedId === s.id}
                  className={`w-full text-left rounded-2xl border p-4 ${selectedId === s.id ? "border-violet-400 bg-violet-50/60" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      {s.leaderUnread && <span className="w-2 h-2 rounded-full bg-violet-600 shrink-0" aria-label="Not opened yet" />}
                      {s.fromName}
                    </p>
                    {bucketBadge(s)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 truncate">{s.message}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge color="violet">{s.topic}</Badge>
                    {s.timeSensitive && bucketFor(s) !== "resolved" && <Badge color="rose">Time-sensitive</Badge>}
                    {due && <span className={`text-[11px] font-semibold ${due.overdue ? "text-rose-600" : "text-amber-600"}`}>{due.label}</span>}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div ref={detailRef} className="lg:col-span-3">
          {selected ? (
            <SignalDetail key={selected.id} signal={selected} now={now} />
          ) : (
            <Card className="text-center py-14">
              <MessageSquareText className="w-6 h-6 text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-900">Select a signal</p>
              <p className="text-sm text-slate-500 mt-1">Opening one lets the sender know you&apos;ve seen it.</p>
            </Card>
          )}
        </div>
      </div>
    </EmptyPagePlaceholder>
  );
};
