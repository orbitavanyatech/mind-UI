"use client";

/* Leader view of direct signals:
   Bebrave · The Edge · Direct Signal message rule sheet (Final, 6 October 2026)
   - Sees active message on Signal card, below the fixed answer, also after marking Handled.
   - Loses access immediately if relationship ends (neutral State 8: No access).
   - Uses ONLY existing actions: status, fixed acknowledgements and follow-up.
     NO reply field, NO chat, NO typing indicators.
   - After withdrawal: "The message has been withdrawn." Withdrawn text can NEVER be read.
   - If replacement sent, only new message shown. No thread, no history of earlier text.
   - After 60 days from sending: nothing is shown. Neither text nor withdrawn status.
   - Supports 8 distinct manager states, full keyboard navigation, screen reader labels,
     min 44px touch targets, and zero horizontal scroll at 320px. */

import { useEffect, useRef, useState, useId } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  EyeOff,
  Lock,
  MessageSquareText,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  UserX,
} from "lucide-react";
import { Badge, Button, Card, EmptyPagePlaceholder } from "@/components/ui/Primitives";
import { SignalPrivacyPanel, SignalVisibilityTag, TOPIC_NOTE } from "@/signals/SignalPrivacy";
import {
  bucketFor,
  dueInfo,
  getSignalCopy,
  isMessageExpired,
  timeAgo,
  useNow,
  useSignals,
  SIGNAL_TOPICS,
  type DirectSignal,
  type LeaderBucket,
  type SignalTopic,
} from "@/signals/SignalsContext";
import { useLanguage } from "@/i18n/LanguageContext";

type Filter = LeaderBucket | "all";

export type ManagerDemoState =
  | "all_cards"
  | "card_without_message"
  | "card_with_message"
  | "card_withdrawn"
  | "card_replacement"
  | "long_message_320px"
  | "expired_nothing"
  | "handled_readable"
  | "no_access";

const bucketBadge = (s: DirectSignal, handledBadgeText: string) => {
  if (s.isHandled) return <Badge color="teal">{handledBadgeText}</Badge>;
  const b = bucketFor(s);
  return b === "needs" ? (
    <Badge color="amber">Needs response</Badge>
  ) : b === "waiting" ? (
    <Badge color="slate">Waiting on them</Badge>
  ) : (
    <Badge color="teal">{handledBadgeText}</Badge>
  );
};

const SignalDetail = ({
  signal,
  now,
  forcedState,
}: {
  signal: DirectSignal;
  now: number | null;
  forcedState?: ManagerDemoState;
}) => {
  const { markHandled, reopenSignal, setAcknowledgement, setFollowUp, saveNote, toggleManagerAccess } =
    useSignals();
  const { lang } = useLanguage();
  const copy = getSignalCopy(lang);
  const first = signal.fromName.split(" ")[0];
  const [note, setNote] = useState(signal.leaderNote);
  const noteId = useId();

  // State 8: No access (neutral state)
  const isNoAccess = forcedState === "no_access" || signal.managerAccessRevoked;

  if (isNoAccess) {
    return (
      <Card className="space-y-4 border-slate-200 bg-slate-50 text-center py-12">
        <UserX className="w-8 h-8 text-slate-400 mx-auto" />
        <p className="text-base font-semibold text-slate-900">{copy.noAccessTitle}</p>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">{copy.noAccessDesc}</p>
        <div className="pt-2">
          <Button
            size="sm"
            variant="outline"
            className="min-h-[44px]"
            onClick={() => toggleManagerAccess(signal.id)}
          >
            {lang === "da" ? "Gendan ledelsesadgang (Demo)" : "Restore Manager Access (Demo)"}
          </Button>
        </div>
      </Card>
    );
  }

  // 60-Day Expiry Check: State 6
  const isExpired =
    forcedState === "expired_nothing" ||
    (signal.optionalMessage && isMessageExpired(signal.optionalMessage.sentAt, now ?? Date.now()));

  // Withdrawn check: State 3
  const isWithdrawn =
    forcedState === "card_withdrawn" ||
    (signal.optionalMessage?.isWithdrawn && forcedState !== "card_replacement");

  // Handled check: State 7
  const isHandled = forcedState === "handled_readable" || signal.isHandled;

  // Active message text calculation
  let activeText: string | null = null;
  if (!isWithdrawn && !isExpired) {
    if (forcedState === "long_message_320px") {
      activeText =
        "Cluster maintenance window was extended by three hours due to replica sync delays. We need a secondary engineer on standby for tomorrow night to prevent burn-out across the team.";
    } else if (forcedState === "card_replacement") {
      activeText =
        "Clarified note: Proposing a 2-week trial of no-meeting Wednesdays. I will draft the guidelines.";
    } else if (forcedState === "card_without_message") {
      activeText = null;
    } else {
      activeText = signal.optionalMessage?.text ?? null;
    }
  }

  const bucket = bucketFor(signal);
  const due = now !== null && bucket === "needs" && !isHandled ? dueInfo(signal, now) : null;

  return (
    <Card className="space-y-5 max-w-full overflow-hidden">
      {/* Header Info */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-slate-900 truncate">{signal.fromName}</p>
          <p className="text-xs text-slate-500">
            {signal.fromTitle}
            {now !== null && ` · sent ${timeAgo(signal.createdAt, now)}`}
          </p>
          <div className="mt-1.5">
            <SignalVisibilityTag viewer="leader" otherName={signal.fromName} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge color="violet">{signal.topic}</Badge>
          {isHandled ? (
            <Badge color="teal">{copy.handledBadge}</Badge>
          ) : (
            due && (
              <Badge color={due.overdue ? "rose" : "amber"}>
                <Clock className="w-3 h-3" />
                {due.label}
              </Badge>
            )
          )}
        </div>
      </div>

      {/* FIXED SIGNAL ANSWER (One-tap answer sent by employee) */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {lang === "da" ? "Fast signal-svar" : "Fixed Signal Answer"}
        </p>
        <p className="text-sm font-semibold text-slate-900">{signal.answerLabel}</p>
      </div>

      {/* --- OPTIONAL MESSAGE SECTION (States 2, 3, 4, 5, 6, 7) --- */}
      {/* State 6: Expired after 60 days -> Nothing is shown */}
      {isExpired ? (
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-center">
          <p className="text-xs text-slate-400 italic">
            {lang === "da"
              ? "(Udløbet efter 60 dage: Hverken besked eller tilbagetrukket status vises)."
              : "(Expired after 60 days: Neither message text nor withdrawn status is shown)."}
          </p>
        </div>
      ) : isWithdrawn ? (
        /* State 3: Card with "withdrawn" status */
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-1">
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-amber-700 shrink-0" />
            {/* Verbatim Withdrawn Notice */}
            <p className="text-sm font-semibold text-amber-900">{copy.withdrawn}</p>
          </div>
          <p className="text-xs text-amber-700 pl-6">
            {lang === "da"
              ? "Den tilbagetrukne tekst kan aldrig læses. Ingen historik eller tråd gemmes."
              : "The withdrawn text can never be read. No thread or history of earlier text is kept."}
          </p>
        </div>
      ) : activeText ? (
        /* State 2, 4, 5, 7: Card with active / replacement message below fixed answer */
        <div className="rounded-2xl border border-teal-200 bg-white p-4 space-y-2 shadow-xs">
          {/* Verbatim Manager Heading: "Message from [first name]" / "Besked fra [fornavn]" */}
          <p className="text-xs font-bold text-teal-800 uppercase tracking-wide">
            {copy.managerHeading(first)}
          </p>
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
            {/* Word wrap and responsive layout for 320px mobile view */}
            <p className="text-sm text-slate-900 leading-relaxed break-words whitespace-pre-wrap">
              {activeText}
            </p>
          </div>
          <p className="text-[11px] text-slate-400">
            {lang === "da"
              ? "Synlig kun for dig og afsenderen. Slettes senest efter 60 dage."
              : "Visible only to you and the sender. Deleted within 60 days."}
          </p>
        </div>
      ) : (
        /* State 1: Card without message */
        <div className="rounded-xl border border-dashed border-slate-200 p-3 text-center">
          <p className="text-xs text-slate-400">
            {lang === "da"
              ? "Dette signal blev sendt uden en valgfri besked."
              : "This signal was answered without an optional message."}
          </p>
        </div>
      )}

      {/* --- MANAGER ACTIONS (Rule: Uses ONLY existing actions: status, fixed acknowledgements, and follow-up. NO reply field, NO chat, NO typing indicators) --- */}
      <div className="space-y-4 pt-2 border-t border-slate-200">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            {lang === "da" ? "Lederhandlinger (faste valg)" : "Manager Actions (Fixed choices)"}
          </p>

          {/* Fixed Acknowledgements Choice */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">
              {lang === "da" ? "Fast anerkendelse:" : "Fixed acknowledgement:"}
            </label>
            <div className="flex flex-col gap-1.5" role="group" aria-label="Fixed acknowledgements">
              {copy.fixedAcknowledgements.map((ack) => (
                <button
                  key={ack}
                  type="button"
                  onClick={() => setAcknowledgement(signal.id, ack)}
                  className={`w-full text-left px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-medium border transition-colors ${
                    signal.acknowledgement === ack
                      ? "border-teal-500 bg-teal-50 text-teal-900 font-semibold"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  ✓ {ack}
                </button>
              ))}
            </div>
          </div>

          {/* Follow-up Plan Choice */}
          <div className="mt-3 space-y-2">
            <label className="text-xs font-semibold text-slate-700">
              {lang === "da" ? "Opfølgningsstatus:" : "Follow-up status:"}
            </label>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Follow-up options">
              {copy.followUpOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFollowUp(signal.id, opt)}
                  className={`px-3 py-2 min-h-[44px] rounded-xl text-xs font-medium border transition-colors ${
                    signal.followUpPlan === opt
                      ? "border-violet-500 bg-violet-50 text-violet-900 font-semibold"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Action: Mark Handled / Reopen */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {isHandled ? (
            <div className="flex items-center gap-2">
              <Badge color="teal" className="gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {copy.handledBadge}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="min-h-[44px]"
                icon={RotateCcw}
                onClick={() => reopenSignal(signal.id)}
              >
                {copy.reopen}
              </Button>
            </div>
          ) : (
            <Button
              className="min-h-[44px]"
              icon={CheckCircle2}
              onClick={() => markHandled(signal.id)}
            >
              {copy.markHandled}
            </Button>
          )}

          {/* Simulated Access Revocation Toggle for State 8 */}
          <button
            type="button"
            onClick={() => toggleManagerAccess(signal.id)}
            className="text-xs text-slate-400 hover:text-slate-600 underline min-h-[44px] px-2"
          >
            {lang === "da" ? "Simuler tab af lederadgang (State 8)" : "Simulate role/access loss (State 8)"}
          </button>
        </div>

        {/* Private Note (Remains strictly private to the manager) */}
        <div className="pt-2">
          <label
            htmlFor={noteId}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700"
          >
            <Lock className="w-3 h-3 text-violet-500" />
            {lang === "da" ? "Privat ledernotat (kun for dig)" : "Private leader note (only you see this)"}
          </label>
          <textarea
            id={noteId}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={() => note !== signal.leaderNote && saveNote(signal.id, note)}
            rows={2}
            placeholder={
              lang === "da"
                ? "Ting at huske, aftaler, hvordan samtalen gik…"
                : "Things to remember, follow-ups, how the conversation went…"
            }
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none focus:border-teal-500"
          />
        </div>
      </div>
    </Card>
  );
};

export const LeaderSignalsInbox = () => {
  const { inbox, needsResponse, unread, open, ready, resetDemoSignals } = useSignals();
  const { lang } = useLanguage();
  const copy = getSignalCopy(lang);
  const now = useNow();
  const [filter, setFilter] = useState<Filter>("needs");
  const [topicFilter, setTopicFilter] = useState<SignalTopic | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [managerDemoState, setManagerDemoState] = useState<ManagerDemoState>("all_cards");
  const detailRef = useRef<HTMLDivElement>(null);

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "needs", label: lang === "da" ? "Kræver svar" : "Needs response" },
    { key: "waiting", label: lang === "da" ? "Venter på dem" : "Waiting on them" },
    { key: "resolved", label: copy.handledBadge },
    { key: "all", label: lang === "da" ? "Alle" : "All" },
  ];

  const list = inbox.filter(
    (s) =>
      (filter === "all" || bucketFor(s) === filter) &&
      (topicFilter === "all" || s.topic === topicFilter)
  );

  const selected = inbox.find((s) => s.id === selectedId) ?? inbox[0] ?? null;
  const counts = {
    needs: needsResponse,
    waiting: inbox.filter((s) => bucketFor(s) === "waiting" && !s.managerAccessRevoked).length,
    resolved: inbox.filter((s) => (s.isHandled || bucketFor(s) === "resolved") && !s.managerAccessRevoked).length,
  };

  useEffect(() => {
    if (selected && (selected.leaderUnread || !selected.seenAt)) {
      open(selected.id);
    }
  }, [selected, open]);

  const choose = (id: string) => {
    setSelectedId(id);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      window.setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }
  };

  if (!ready) return null;

  return (
    <EmptyPagePlaceholder
      title={lang === "da" ? "Direkte signaler" : "Direct Signals"}
      desc={
        lang === "da"
          ? "Navngivne beskeder, som dine teammedlemmer valgte at sende til dig. De er ikke anonyme."
          : "Named messages your team members chose to send to you. They are not anonymous."
      }
    >
      <SignalPrivacyPanel viewer="leader" otherName="the sender" />
      <p className="text-xs text-slate-500 mt-2">
        {lang === "da"
          ? "Videresend eller diskuter venligst ikke et signal uden afsenderens godkendelse. Du ser aldrig anonyme indsigter her."
          : "Please don't forward or discuss a signal without the sender's OK. You never see anonymous team, group or company insights here."}
      </p>

      {/* --- MANAGER DEMO STATE SHOWCASE CONTROLLER (Rule Sheet Showcase) --- */}
      <div className="mt-6 rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-violet-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            {lang === "da" ? "Test alle 8 ledertilstande" : "Test All 8 Manager States (Rule Sheet Showcase)"}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={resetDemoSignals}
              className="text-[11px] font-semibold text-violet-700 hover:underline min-h-[44px] px-2"
            >
              {lang === "da" ? "Nulstil demo-data" : "Reset Seed Data"}
            </button>
            <span className="text-[11px] font-semibold text-violet-800 bg-white px-2 py-0.5 rounded-full border border-violet-200">
              {managerDemoState}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Manager States Selector">
          {[
            { key: "all_cards", label: "Interactive Inbox" },
            { key: "card_without_message", label: "1. Card without message" },
            { key: "card_with_message", label: "2. Card with message" },
            { key: "card_withdrawn", label: "3. Card with 'withdrawn'" },
            { key: "card_replacement", label: "4. Replacement message" },
            { key: "long_message_320px", label: "5. Long message at 320px" },
            { key: "expired_nothing", label: "6. Expired (>60 days: nothing)" },
            { key: "handled_readable", label: "7. Handled (Message readable)" },
            { key: "no_access", label: "8. No Access (Neutral state)" },
          ].map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => {
                setManagerDemoState(s.key as ManagerDemoState);
                if (s.key === "card_without_message") {
                  setSelectedId("sig-action-no-message");
                } else if (s.key === "card_with_message") {
                  setSelectedId("sig-action-with-msg");
                } else if (s.key === "card_withdrawn") {
                  setSelectedId("sig-action-withdrawn");
                } else if (s.key === "card_replacement") {
                  setSelectedId("sig-action-replacement");
                } else if (s.key === "long_message_320px") {
                  setSelectedId("sig-action-long-320");
                } else if (s.key === "expired_nothing") {
                  setSelectedId("sig-action-expired");
                } else if (s.key === "handled_readable") {
                  setSelectedId("sig-action-handled");
                }
              }}
              className={`rounded-lg px-2.5 py-1.5 min-h-[44px] text-xs font-medium transition-colors ${
                managerDemoState === s.key
                  ? "bg-violet-700 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-violet-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <Card className="!p-4">
          <p className="text-xs font-medium text-slate-500">
            {lang === "da" ? "Kræver svar" : "Needs response"}
          </p>
          <p className="mpp-display text-2xl font-bold text-slate-900 mt-1">{counts.needs}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs font-medium text-slate-500">
            {lang === "da" ? "Ikke åbnet endnu" : "Not opened yet"}
          </p>
          <p className="mpp-display text-2xl font-bold text-slate-900 mt-1">{unread}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs font-medium text-slate-500">
            {lang === "da" ? "Venter på dem" : "Waiting on them"}
          </p>
          <p className="mpp-display text-2xl font-bold text-slate-900 mt-1">{counts.waiting}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs font-medium text-slate-500">{copy.handledBadge}</p>
          <p className="mpp-display text-2xl font-bold text-slate-900 mt-1">{counts.resolved}</p>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mt-6" role="tablist" aria-label="Signal filter">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            role="tab"
            aria-selected={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 min-h-[44px] text-xs font-semibold transition-all ${
              filter === f.key
                ? "bg-violet-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f.label}
            {f.key !== "all" && <span className="opacity-70"> · {counts[f.key]}</span>}
          </button>
        ))}
      </div>

      {/* Topic Filter */}
      <div className="flex flex-wrap items-center gap-3 mt-3">
        <label className="text-xs font-medium text-slate-500" htmlFor="topic-filter">
          {lang === "da" ? "Emne" : "Topic"}
        </label>
        <select
          id="topic-filter"
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value as SignalTopic | "all")}
          className="form-select-sm min-h-[44px] py-1 px-3 rounded-xl border border-slate-200 bg-white text-xs"
        >
          <option value="all">{lang === "da" ? "Alle emner" : "All topics"}</option>
          {SIGNAL_TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-400">{TOPIC_NOTE.leader}</p>
      </div>

      {/* Inbox Grid */}
      <div className="grid lg:grid-cols-5 gap-5 mt-4">
        {/* Left: Signals List */}
        <div className="lg:col-span-2 space-y-3">
          {list.length === 0 ? (
            <Card className="text-center py-10">
              <p className="font-semibold text-slate-900">
                {filter === "needs"
                  ? lang === "da"
                    ? "Du er helt med"
                    : "You're all caught up"
                  : lang === "da"
                  ? "Ingen signaler her"
                  : "Nothing here"}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {filter === "needs"
                  ? lang === "da"
                    ? "Ingen venter på et svar fra dig."
                    : "No one is waiting on a reply from you."
                  : lang === "da"
                  ? "Signaler vises her, når de opdateres."
                  : "Signals will show up here as they change."}
              </p>
            </Card>
          ) : (
            list.map((s) => {
              const due = now !== null && bucketFor(s) === "needs" && !s.isHandled ? dueInfo(s, now) : null;
              const isSelected = selected?.id === s.id;
              const hasMsg = Boolean(s.optionalMessage);

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => choose(s.id)}
                  aria-current={isSelected}
                  className={`w-full text-left rounded-2xl border p-4 transition-all min-h-[44px] ${
                    isSelected
                      ? "border-violet-400 bg-violet-50/60 shadow-xs"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-2 truncate">
                      {s.leaderUnread && !s.managerAccessRevoked && (
                        <span className="w-2 h-2 rounded-full bg-violet-600 shrink-0" aria-label="Not opened yet" />
                      )}
                      {s.fromName}
                    </p>
                    {bucketBadge(s, copy.handledBadge)}
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1 truncate">{s.answerLabel}</p>
                  {hasMsg && (
                    <p className="text-[11px] text-teal-700 flex items-center gap-1 mt-1 font-medium">
                      <MessageSquareText className="w-3 h-3" />
                      {s.optionalMessage?.isWithdrawn
                        ? copy.withdrawn
                        : s.optionalMessage?.text ?? "Message attached"}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge color="violet">{s.topic}</Badge>
                    {due && (
                      <span
                        className={`text-[11px] font-semibold ${
                          due.overdue ? "text-rose-600" : "text-amber-600"
                        }`}
                      >
                        {due.label}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right: Signal Detail Card (Cards 1-8) */}
        <div ref={detailRef} className="lg:col-span-3">
          {selected ? (
            <SignalDetail
              key={`${selected.id}-${managerDemoState}`}
              signal={selected}
              now={now}
              forcedState={managerDemoState !== "all_cards" ? managerDemoState : undefined}
            />
          ) : (
            <Card className="text-center py-14">
              <MessageSquareText className="w-6 h-6 text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-900">
                {lang === "da" ? "Vælg et signal" : "Select a signal"}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {lang === "da"
                  ? "Når du åbner et signal, kan afsenderen se, at du har set det."
                  : "Opening one lets the sender know you've seen it."}
              </p>
            </Card>
          )}
        </div>
      </div>
    </EmptyPagePlaceholder>
  );
};
