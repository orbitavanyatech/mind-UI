"use client";

/* Employee view of direct signals: a deliberate, named message to your own leader. */

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, Send, Undo2 } from "lucide-react";
import { Badge, Button, Card, EmptyPagePlaceholder, PrivacyNotice } from "@/components/ui/Primitives";
import { USERS } from "@/data/mockData";
import {
  MAX_LENGTH, MIN_LENGTH, SIGNAL_TOPICS, statusFor, timeAgo, useNow, useSignals,
  type DirectSignal, type SignalStatus, type SignalTopic,
} from "@/signals/SignalsContext";
import { ROUTES } from "@/config/routes";

const STATUS: Record<SignalStatus, { label: string; color: "slate" | "indigo" | "violet" | "teal" }> = {
  sent: { label: "Sent", color: "slate" },
  seen: { label: "Seen", color: "indigo" },
  replied: { label: "Replied", color: "violet" },
  resolved: { label: "Resolved", color: "teal" },
};

const SentItem = ({ signal, now }: { signal: DirectSignal; now: number | null }) => {
  const { followUp, withdraw } = useSignals();
  const [text, setText] = useState("");
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);
  const status = statusFor(signal);
  const leaderFirst = signal.toName.split(" ")[0];

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge color="violet">{signal.topic}</Badge>
          {signal.timeSensitive && <Badge color="rose">Time-sensitive</Badge>}
          <span className="text-xs text-slate-400">{now !== null && `Sent ${timeAgo(signal.createdAt, now)}`}</span>
        </div>
        <Badge color={STATUS[status].color}>{STATUS[status].label}</Badge>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-800 leading-relaxed">{signal.message}</div>
      {signal.thread.map((m) => (
        <div key={m.id} className={`rounded-2xl p-4 text-sm leading-relaxed ${m.by === "leader" ? "bg-violet-50 text-slate-800" : "bg-slate-50 text-slate-800 ml-6"}`}>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">{m.by === "leader" ? leaderFirst : "You"}{now !== null && ` · ${timeAgo(m.at, now)}`}</p>
          {m.text}
        </div>
      ))}

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
          placeholder={status === "resolved" ? "Add a follow-up to reopen this…" : "Add a follow-up…"}
          aria-label="Follow-up message"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500"
        />
        <Button variant="outline" size="sm" disabled={!text.trim()} onClick={() => { followUp(signal.id, text); setText(""); }}>Send</Button>
      </div>

      {status !== "resolved" && (
        <div className="flex items-center justify-end gap-3">
          {confirmWithdraw ? (
            <>
              <span className="text-xs text-slate-500">Take this back? {leaderFirst} will no longer see it.</span>
              <Button variant="outline" size="sm" onClick={() => setConfirmWithdraw(false)}>Keep</Button>
              <Button size="sm" onClick={() => withdraw(signal.id)}>Withdraw</Button>
            </>
          ) : (
            <button type="button" onClick={() => setConfirmWithdraw(true)} className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600"><Undo2 className="w-3.5 h-3.5" />Withdraw</button>
          )}
        </div>
      )}
    </Card>
  );
};

export const SendSignalPage = () => {
  const { sent, send, ready } = useSignals();
  const now = useNow();
  const leader = USERS.leader;
  const [topic, setTopic] = useState<SignalTopic>("Workload");
  const [message, setMessage] = useState("");
  const [wantsConversation, setWantsConversation] = useState(false);
  const [timeSensitive, setTimeSensitive] = useState(false);
  const [consent, setConsent] = useState(false);
  const [justSent, setJustSent] = useState(false);

  const trimmed = message.trim();
  const valid = trimmed.length >= MIN_LENGTH && consent;

  const submit = () => {
    if (!valid) return;
    send({ topic, message: trimmed, wantsConversation, timeSensitive });
    setMessage(""); setConsent(false); setWantsConversation(false); setTimeSensitive(false); setJustSent(true);
  };

  if (!ready) return null;

  return (
    <EmptyPagePlaceholder title="Direct Signals" desc={`Tell ${leader.name} something directly — your name is attached, and only ${leader.name.split(" ")[0]} sees it.`}>
      <PrivacyNotice text={`A direct signal is sent with your name, to ${leader.name} only. It is never anonymous, never shared with company administrators, and never part of any report. For anonymous feedback, use Pulse Surveys instead.`} />

      <Card className="mt-6 max-w-2xl space-y-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 mb-2">What is it about?</p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Topic">
            {SIGNAL_TOPICS.map((t) => (
              <button
                key={t} type="button" role="radio" aria-checked={topic === t} onClick={() => setTopic(t)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${topic === t ? "bg-teal-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >{t}</button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="signal-message" className="text-sm font-semibold text-slate-900">Your message</label>
          <textarea
            id="signal-message" value={message} onChange={(e) => { setMessage(e.target.value.slice(0, MAX_LENGTH)); setJustSent(false); }} rows={5}
            placeholder="What would you like your leader to know? Be as specific as you're comfortable with."
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-teal-500"
          />
          <p className="text-xs text-slate-400 mt-1">{trimmed.length}/{MAX_LENGTH}{trimmed.length > 0 && trimmed.length < MIN_LENGTH && ` · at least ${MIN_LENGTH} characters`}</p>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2.5 text-sm text-slate-700"><input type="checkbox" checked={wantsConversation} onChange={(e) => setWantsConversation(e.target.checked)} />I&apos;d like to talk about this</label>
          <label className="flex items-center gap-2.5 text-sm text-slate-700"><input type="checkbox" checked={timeSensitive} onChange={(e) => setTimeSensitive(e.target.checked)} />This is time-sensitive</label>
        </div>

        <label className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
          <input type="checkbox" className="mt-0.5" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span className="flex items-start gap-1.5"><Lock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />I understand this is sent with my name to {leader.name} only.</span>
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-400">Not an emergency channel. If you need urgent help, contact your local emergency services.</p>
          <Button icon={Send} disabled={!valid} onClick={submit}>Send to {leader.name.split(" ")[0]}</Button>
        </div>
        {justSent && <p className="flex items-center gap-1.5 text-sm font-medium text-teal-700"><CheckCircle2 className="w-4 h-4" />Sent. You&apos;ll see here when {leader.name.split(" ")[0]} has seen it and replied.</p>}
      </Card>

      <div className="mt-8 space-y-4 max-w-2xl">
        <p className="font-semibold text-slate-900">Your signals</p>
        {sent.length === 0 ? (
          <p className="text-sm text-slate-400">You haven&apos;t sent any signals yet. For anonymous feedback, try <Link href={ROUTES.pulse} className="font-semibold text-teal-700">Pulse Surveys</Link>.</p>
        ) : (
          sent.map((s) => <SentItem key={s.id} signal={s} now={now} />)
        )}
      </div>
    </EmptyPagePlaceholder>
  );
};
