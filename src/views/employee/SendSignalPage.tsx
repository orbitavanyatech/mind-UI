"use client";

/* Employee view of direct signals:
   Bebrave · The Edge · Direct Signal message rule sheet (Final, 6 October 2026)
   - One-tap Signal answer.
   - If answer is type "action", employee can add one short message to their approved manager.
   - Max 200 characters, single line, plain text.
   - Preview before sending. No editing after sending.
   - Can withdraw and send one replacement. Max two sends per Signal in total.
   - Handled stops new messages and replacements, but employee can still withdraw.
   - No message field on positive, neutral or anonymous answers.
   - Supports 11 distinct employee states, full keyboard navigation, screen reader labels,
     min 44px touch targets, and zero horizontal scroll at 320px. */

import { useState, useRef, useEffect, useId } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  Lock,
  RotateCcw,
  Send,
  Sparkles,
  Undo2,
} from "lucide-react";
import { Badge, Button, Card, EmptyPagePlaceholder } from "@/components/ui/Primitives";
import { SignalPrivacyPanel, SignalVisibilityTag, TOPIC_NOTE } from "@/signals/SignalPrivacy";
import { USERS } from "@/data/mockData";
import {
  SIGNAL_TOPICS,
  MAX_OPTIONAL_MESSAGE_LENGTH,
  getSignalCopy,
  isMessageExpired,
  statusFor,
  timeAgo,
  useNow,
  useSignals,
  type DirectSignal,
  type SignalAnswerType,
  type SignalTopic,
} from "@/signals/SignalsContext";
import { ROUTES } from "@/config/routes";
import { useLanguage } from "@/i18n/LanguageContext";

export type EmployeeDemoState =
  | "normal"
  | "confirmation_add_message"
  | "empty_field"
  | "field_200_chars"
  | "preview"
  | "sent"
  | "confirm_withdraw"
  | "withdrawn_replacement_possible"
  | "withdrawn_no_further_sends"
  | "handled_withdraw_possible"
  | "expired_60_days"
  | "send_failed";

export const SendSignalPage = () => {
  const { sent, answerSignal, sendOptionalMessage, withdrawOptionalMessage, ready } = useSignals();
  const { lang } = useLanguage();
  const copy = getSignalCopy(lang);
  const now = useNow();
  const leader = USERS.leader;
  const leaderFirst = leader.name.split(" ")[0];

  // Active answer flow state
  const [topic, setTopic] = useState<SignalTopic>("Workload");
  const [activeSignalId, setActiveSignalId] = useState<string | null>(null);
  const [lastAnswerType, setLastAnswerType] = useState<SignalAnswerType | null>(null);

  // Message flow step on the newly created / active signal
  const [isComposing, setIsComposing] = useState(false);
  const [messageDraft, setMessageDraft] = useState("");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isConfirmingWithdraw, setIsConfirmingWithdraw] = useState(false);
  const [simulatedFailure, setSimulatedFailure] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Demo showcase state override
  const [demoState, setDemoState] = useState<EmployeeDemoState>("normal");

  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  // Find currently focused active signal if any
  const currentSignal = activeSignalId ? sent.find((s) => s.id === activeSignalId) : null;

  // Sync demo state changes
  useEffect(() => {
    if (demoState === "normal") return;

    if (demoState === "confirmation_add_message") {
      setLastAnswerType("action");
      setIsComposing(false);
      setIsPreviewing(false);
      setIsConfirmingWithdraw(false);
      setSimulatedFailure(false);
    } else if (demoState === "empty_field") {
      setLastAnswerType("action");
      setIsComposing(true);
      setMessageDraft("");
      setIsPreviewing(false);
      setIsConfirmingWithdraw(false);
      setSimulatedFailure(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else if (demoState === "field_200_chars") {
      setLastAnswerType("action");
      setIsComposing(true);
      setMessageDraft(
        "Shift coverage on Tuesday nights is becoming unmanageable due to multiple parallel deployments. Can we please review the rotation at this week's standup so we don't hit an exhaustion wall? Thanks."
      );
      setIsPreviewing(false);
      setIsConfirmingWithdraw(false);
      setSimulatedFailure(false);
    } else if (demoState === "preview") {
      setLastAnswerType("action");
      setIsComposing(true);
      setMessageDraft(
        "Shift coverage on Tuesday nights is becoming unmanageable. Can we please review the rotation at this week's standup?"
      );
      setIsPreviewing(true);
      setIsConfirmingWithdraw(false);
      setSimulatedFailure(false);
    } else if (demoState === "sent") {
      setLastAnswerType("action");
      setIsComposing(false);
      setIsPreviewing(false);
      setIsConfirmingWithdraw(false);
      setSimulatedFailure(false);
    } else if (demoState === "confirm_withdraw") {
      setLastAnswerType("action");
      setIsComposing(false);
      setIsPreviewing(false);
      setIsConfirmingWithdraw(true);
      setSimulatedFailure(false);
    } else if (demoState === "withdrawn_replacement_possible") {
      setLastAnswerType("action");
      setIsComposing(false);
      setIsPreviewing(false);
      setIsConfirmingWithdraw(false);
      setSimulatedFailure(false);
    } else if (demoState === "withdrawn_no_further_sends") {
      setLastAnswerType("action");
      setIsComposing(false);
      setIsPreviewing(false);
      setIsConfirmingWithdraw(false);
      setSimulatedFailure(false);
    } else if (demoState === "handled_withdraw_possible") {
      setLastAnswerType("action");
      setIsComposing(false);
      setIsPreviewing(false);
      setIsConfirmingWithdraw(false);
      setSimulatedFailure(false);
    } else if (demoState === "expired_60_days") {
      setLastAnswerType("action");
      setIsComposing(false);
      setIsPreviewing(false);
      setIsConfirmingWithdraw(false);
      setSimulatedFailure(false);
    } else if (demoState === "send_failed") {
      setLastAnswerType("action");
      setIsComposing(true);
      setIsPreviewing(true);
      setSimulatedFailure(true);
    }
  }, [demoState]);

  if (!ready) return null;

  // 1-tap Answer Handler
  const handleTapAnswer = (type: SignalAnswerType, label: string) => {
    const newId = answerSignal({
      topic,
      answerType: type,
      answerLabel: label,
    });
    setActiveSignalId(newId);
    setLastAnswerType(type);
    setIsComposing(false);
    setIsPreviewing(false);
    setIsConfirmingWithdraw(false);
    setMessageDraft("");
    setSimulatedFailure(false);
  };

  // Submit optional message
  const handleSendMessage = async () => {
    if (simulatedFailure) return;
    const targetId = activeSignalId || sent[0]?.id;
    if (!targetId) return;

    setIsSubmitting(true);
    try {
      await sendOptionalMessage(targetId, messageDraft);
      setIsComposing(false);
      setIsPreviewing(false);
      setMessageDraft("");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Text input sanitizer: single line, plain text, max 200 chars
  const handleTextChange = (val: string) => {
    // Strip newlines and carriage returns
    const singleLine = val.replace(/[\r\n]+/g, " ");
    setMessageDraft(singleLine.slice(0, MAX_OPTIONAL_MESSAGE_LENGTH));
  };

  return (
    <EmptyPagePlaceholder
      title={lang === "da" ? "Direkte signaler" : "Direct Signals"}
      desc={
        lang === "da"
          ? `Fortæl ${leader.name} noget direkte. Dit navn er tilknyttet, det er ikke anonymt, og kun ${leaderFirst} og dig kan se det.`
          : `Tell ${leader.name} something directly. Your name is attached, it is not anonymous, and only ${leaderFirst} and you can see it.`
      }
    >
      <SignalPrivacyPanel viewer="sender" otherName={leader.name} />

      {/* --- DEMO STATE SHOWCASE CONTROLLER (Interactive verification bar) --- */}
      <div className="mt-6 rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            {lang === "da" ? "Test alle 11 medarbejdertilstande" : "Test All 11 Employee States (Rule Sheet Showcase)"}
          </p>
          <span className="text-[11px] font-semibold text-teal-700 bg-white px-2 py-0.5 rounded-full border border-teal-200">
            {demoState}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Employee States Selector">
          {[
            { key: "normal", label: "Interactive Flow" },
            { key: "confirmation_add_message", label: "1. Confirmation ('Add a message')" },
            { key: "empty_field", label: "2. Empty Field with line" },
            { key: "field_200_chars", label: "3. Field at 200 chars" },
            { key: "preview", label: "4. Preview" },
            { key: "sent", label: "5. Sent" },
            { key: "confirm_withdraw", label: "6. Confirm Withdraw" },
            { key: "withdrawn_replacement_possible", label: "7. Withdrawn (Replacement allowed)" },
            { key: "withdrawn_no_further_sends", label: "8. Withdrawn (No further sends)" },
            { key: "handled_withdraw_possible", label: "9. Handled (Withdraw only)" },
            { key: "expired_60_days", label: "10. Expired (60 days: nothing)" },
            { key: "send_failed", label: "11. Send Failed" },
          ].map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setDemoState(s.key as EmployeeDemoState)}
              className={`rounded-lg px-2.5 py-1.5 min-h-[44px] text-xs font-medium transition-colors ${
                demoState === s.key
                  ? "bg-teal-700 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-teal-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- ONE-TAP SIGNAL ANSWER PANEL --- */}
      <Card className="mt-6 max-w-2xl space-y-5">
        <div>
          <p className="text-sm font-semibold text-slate-900 mb-2">
            {lang === "da" ? "Hvad drejer det sig om?" : "What is it about?"}
          </p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Topic selector">
            {SIGNAL_TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={topic === t}
                onClick={() => setTopic(t)}
                className={`rounded-full px-4 min-h-[44px] text-xs font-semibold transition-all ${
                  topic === t
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">{TOPIC_NOTE.sender(leaderFirst)}</p>
        </div>

        {/* 1-tap Answer Options */}
        <div className="border-t border-slate-100 pt-4">
          <p className="text-sm font-semibold text-slate-900 mb-2">
            {lang === "da" ? "Send et direkte signal (et enkelt tryk):" : "Send direct Signal answer (1-tap):"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleTapAnswer("positive", "Positive — Everything is running smoothly")}
              className="flex flex-col items-start p-3 min-h-[44px] rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 text-left transition-all"
            >
              <span className="text-xs font-bold text-emerald-800">
                {lang === "da" ? "Positivt" : "Positive"}
              </span>
              <span className="text-[11px] text-emerald-600 mt-0.5">
                {lang === "da" ? "Alt kører fint (intet beskedfelt)" : "Running smoothly (no message)"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTapAnswer("neutral", "Neutral — Steady and manageable")}
              className="flex flex-col items-start p-3 min-h-[44px] rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all"
            >
              <span className="text-xs font-bold text-slate-800">
                {lang === "da" ? "Neutralt" : "Neutral"}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                {lang === "da" ? "Stabilt (intet beskedfelt)" : "Steady (no message)"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTapAnswer("action", "Action — Needs manager support / action")}
              className="flex flex-col items-start p-3 min-h-[44px] rounded-xl border-2 border-teal-500 bg-teal-50/70 hover:bg-teal-100 text-left transition-all shadow-xs ring-2 ring-teal-200/50"
            >
              <span className="text-xs font-bold text-teal-900">
                {lang === "da" ? "Handling (Action)" : "Action needed"}
              </span>
              <span className="text-[11px] text-teal-700 mt-0.5">
                {lang === "da" ? "Åbner valgfri besked" : "Allows optional message"}
              </span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {lang === "da"
              ? "Regel: Intet beskedfelt ved positive, neutrale eller anonyme svar. Kun ved handlingskrævende svar."
              : "Rule: No message field on positive, neutral or anonymous answers. Only on action answers."}
          </p>
        </div>

        {/* --- POST-ANSWER OPTIONAL MESSAGE JOURNEY (States 1-11) --- */}
        {(lastAnswerType === "action" || demoState !== "normal") && (
          <div className="border-t-2 border-teal-100 pt-5 mt-4 space-y-4">
            {/* STATE 1: Confirmation with "Add a message" */}
            {!isComposing &&
              !isPreviewing &&
              !isConfirmingWithdraw &&
              demoState !== "sent" &&
              demoState !== "confirm_withdraw" &&
              demoState !== "withdrawn_replacement_possible" &&
              demoState !== "withdrawn_no_further_sends" &&
              demoState !== "handled_withdraw_possible" &&
              demoState !== "expired_60_days" && (
                <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-teal-950">
                        {lang === "da" ? "Signal sendt med ét tryk" : "Signal answer sent with one tap"}
                      </p>
                      <p className="text-xs text-teal-800">
                        {lang === "da"
                          ? `Du har valgt handling for ${topic}.`
                          : `You sent an action answer for ${topic}.`}
                      </p>
                    </div>
                  </div>
                  <div>
                    {/* Verbatim Button copy: "Add a message" / "Tilføj en besked" */}
                    <Button
                      onClick={() => {
                        setIsComposing(true);
                        setIsPreviewing(false);
                        setTimeout(() => inputRef.current?.focus(), 50);
                      }}
                      className="min-h-[44px] w-full sm:w-auto"
                    >
                      {copy.addMessageButton}
                    </Button>
                  </div>
                </div>
              )}

            {/* STATES 2 & 3: Input Field (Empty / approaching 200 chars) */}
            {isComposing && !isPreviewing && !simulatedFailure && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                {/* Verbatim Line by the field */}
                <p className="text-xs font-semibold text-slate-600">
                  {copy.lineByField(leaderFirst)}
                </p>

                <div className="space-y-1">
                  <label htmlFor={inputId} className="sr-only">
                    {lang === "da" ? "Valgfri besked" : "Optional message"}
                  </label>
                  <input
                    ref={inputRef}
                    id={inputId}
                    type="text"
                    value={messageDraft}
                    onChange={(e) => handleTextChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && messageDraft.trim()) {
                        e.preventDefault();
                        setIsPreviewing(true);
                      }
                    }}
                    maxLength={MAX_OPTIONAL_MESSAGE_LENGTH}
                    placeholder={
                      lang === "da"
                        ? "Maks 200 tegn, én linje, ren tekst…"
                        : "Max 200 characters, single line, plain text…"
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 min-h-[44px] text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                  />
                  {/* Character counter & Single-line constraint rule display */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>
                      {lang === "da"
                        ? "Én linje, ren tekst. Ingen formatering, links eller vedhæftninger."
                        : "Single line, plain text. No formatting, links, or attachments."}
                    </span>
                    <span
                      aria-live="polite"
                      className={`font-semibold ${
                        messageDraft.length === MAX_OPTIONAL_MESSAGE_LENGTH
                          ? "text-amber-600"
                          : "text-slate-500"
                      }`}
                    >
                      {messageDraft.length}/{MAX_OPTIONAL_MESSAGE_LENGTH}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  <Button
                    variant="outline"
                    className="min-h-[44px]"
                    onClick={() => {
                      setIsComposing(false);
                      setMessageDraft("");
                    }}
                  >
                    {lang === "da" ? "Annuller" : "Cancel"}
                  </Button>
                  <Button
                    className="min-h-[44px]"
                    icon={Eye}
                    disabled={!messageDraft.trim()}
                    onClick={() => setIsPreviewing(true)}
                  >
                    {copy.preview}
                  </Button>
                </div>
              </div>
            )}

            {/* STATE 4: Preview before sending */}
            {isComposing && isPreviewing && !simulatedFailure && (
              <div className="rounded-2xl border-2 border-teal-500 bg-white p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <Badge color="teal" className="uppercase tracking-wider text-[10px]">
                    {copy.preview}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {lang === "da" ? "Ingen redigering efter afsendelse" : "No editing after sending"}
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 mb-1">
                    {copy.managerHeading(leaderFirst)}:
                  </p>
                  <p className="text-sm font-medium text-slate-900 break-words whitespace-pre-wrap">
                    {messageDraft}
                  </p>
                </div>

                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {copy.lineByField(leaderFirst)}
                </p>

                <div className="flex flex-wrap items-center justify-end gap-2.5">
                  <Button
                    variant="outline"
                    className="min-h-[44px]"
                    onClick={() => setIsPreviewing(false)}
                  >
                    {copy.edit}
                  </Button>
                  {/* Verbatim Send Button: "Send message to [first name]" / "Send besked til [fornavn]" */}
                  <Button
                    className="min-h-[44px]"
                    icon={Send}
                    disabled={isSubmitting}
                    onClick={handleSendMessage}
                  >
                    {copy.sendButton(leaderFirst)}
                  </Button>
                </div>
              </div>
            )}

            {/* STATE 11: Send failed */}
            {simulatedFailure && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 space-y-3">
                <div className="flex items-center gap-2 text-rose-800">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-bold">{copy.sendFailed}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="min-h-[44px]"
                    onClick={() => {
                      setSimulatedFailure(false);
                      handleSendMessage();
                    }}
                  >
                    {copy.retry}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-h-[44px]"
                    onClick={() => setSimulatedFailure(false)}
                  >
                    {lang === "da" ? "Tilbage" : "Back"}
                  </Button>
                </div>
              </div>
            )}

            {/* STATE 5, 6, 7, 8, 9, 10: Sent / Withdrawn / Handled / Expired Display for the active action signal */}
            {(demoState === "sent" ||
              demoState === "confirm_withdraw" ||
              demoState === "withdrawn_replacement_possible" ||
              demoState === "withdrawn_no_further_sends" ||
              demoState === "handled_withdraw_possible" ||
              demoState === "expired_60_days" ||
              (currentSignal && currentSignal.optionalMessage)) && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                {/* 60-Day Expiration Check: State 10 */}
                {demoState === "expired_60_days" ||
                (currentSignal?.optionalMessage &&
                  isMessageExpired(currentSignal.optionalMessage.sentAt, now ?? Date.now())) ? (
                  <div className="text-xs text-slate-400 italic py-2">
                    {lang === "da"
                      ? "(Efter 60 dage: Intet vises. Hverken tekst eller tilbagetrukket status)."
                      : "(Expired after 60 days: Nothing is shown. Neither the text nor the withdrawn status)."}
                  </div>
                ) : (
                  <>
                    {/* Handled status badge if Handled: State 9 */}
                    {(demoState === "handled_withdraw_possible" || currentSignal?.isHandled) && (
                      <div className="flex items-center gap-2">
                        <Badge color="teal">{copy.handledBadge}</Badge>
                        <span className="text-xs text-slate-500">
                          {lang === "da"
                            ? "Lederen har håndteret dette signal."
                            : "Manager has marked this Signal as Handled."}
                        </span>
                      </div>
                    )}

                    {/* Active Message or Withdrawn Notice */}
                    {demoState === "withdrawn_replacement_possible" ||
                    demoState === "withdrawn_no_further_sends" ||
                    currentSignal?.optionalMessage?.isWithdrawn ? (
                      <div className="rounded-xl bg-amber-50/60 border border-amber-200 p-3">
                        {/* Verbatim Withdrawn copy */}
                        <p className="text-sm font-semibold text-amber-900">{copy.withdrawn}</p>
                        <p className="text-[11px] text-amber-700 mt-0.5">
                          {lang === "da"
                            ? "Den tilbagetrukne tekst kan aldrig læses."
                            : "The withdrawn text can never be read."}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                          {copy.managerHeading(leaderFirst)}
                        </p>
                        <p className="text-sm text-slate-900 break-words">
                          {currentSignal?.optionalMessage?.text ??
                            "The sprint deliverables are overlapping with on-call shifts. Could we adjust the scope before Thursday?"}
                        </p>
                      </div>
                    )}

                    {/* STATE 6: Confirm withdraw prompt */}
                    {(isConfirmingWithdraw || demoState === "confirm_withdraw") && (
                      <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 space-y-3">
                        {/* Verbatim Confirm Withdraw copy */}
                        <p className="text-sm font-medium text-rose-950">
                          {copy.confirmWithdraw(leaderFirst)}
                        </p>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="min-h-[44px]"
                            onClick={() => setIsConfirmingWithdraw(false)}
                          >
                            {copy.keep}
                          </Button>
                          <Button
                            size="sm"
                            className="min-h-[44px] !bg-rose-600 hover:!bg-rose-700 !text-white"
                            onClick={() => {
                              if (activeSignalId) withdrawOptionalMessage(activeSignalId);
                              setIsConfirmingWithdraw(false);
                            }}
                          >
                            {copy.withdraw}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Action buttons (Withdraw / Replacement) */}
                    {!isConfirmingWithdraw && demoState !== "confirm_withdraw" && (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        {/* Withdraw message button (available if active message exists, even after Handled) */}
                        {!(
                          demoState === "withdrawn_replacement_possible" ||
                          demoState === "withdrawn_no_further_sends" ||
                          currentSignal?.optionalMessage?.isWithdrawn
                        ) && (
                          <button
                            type="button"
                            onClick={() => setIsConfirmingWithdraw(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 min-h-[44px] px-2 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Undo2 className="w-4 h-4" />
                            {copy.withdraw}
                          </button>
                        )}

                        {/* STATE 7: Replacement allowed (send count 1, not handled) */}
                        {(demoState === "withdrawn_replacement_possible" ||
                          (currentSignal?.optionalMessage?.isWithdrawn &&
                            currentSignal.optionalMessage.sendsCount < 2 &&
                            !currentSignal.isHandled)) && (
                          <div className="w-full pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                              {lang === "da"
                                ? "Du kan sende én erstatningsbesked (maks. 2 afsendelser i alt)."
                                : "You can send one replacement message (max two sends in total)."}
                            </span>
                            <Button
                              size="sm"
                              className="min-h-[44px]"
                              onClick={() => {
                                setIsComposing(true);
                                setIsPreviewing(false);
                                setMessageDraft("");
                              }}
                            >
                              {copy.addMessageButton}
                            </Button>
                          </div>
                        )}

                        {/* STATE 8: No further sends (reached 2 sends) */}
                        {(demoState === "withdrawn_no_further_sends" ||
                          (currentSignal?.optionalMessage?.isWithdrawn &&
                            currentSignal.optionalMessage.sendsCount >= 2)) && (
                          <span className="text-xs text-slate-400 italic">
                            {lang === "da"
                              ? "Maksimalt to afsendelser pr. signal er nået. Ingen yderligere beskeder tilladt."
                              : "Max two sends per Signal reached. No further replacement allowed."}
                          </span>
                        )}

                        {/* STATE 9 notice: Handled stops replacements */}
                        {(demoState === "handled_withdraw_possible" ||
                          (currentSignal?.isHandled && currentSignal?.optionalMessage?.isWithdrawn)) && (
                          <span className="text-xs text-slate-400 italic">
                            {lang === "da"
                              ? "Håndteret status forhindrer nye erstatninger."
                              : "Handled status stops replacement messages."}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* --- SENT SIGNALS LIST (Employee History) --- */}
      <div className="mt-8 space-y-4 max-w-2xl">
        <p className="font-semibold text-slate-900">
          {lang === "da" ? "Dine sendte signaler" : "Your sent signals"}
        </p>

        {sent.length === 0 ? (
          <p className="text-sm text-slate-400">
            {lang === "da"
              ? "Du har ikke sendt nogen signaler endnu."
              : "You haven't sent any signals yet."}
          </p>
        ) : (
          sent.map((s) => {
            const hasOptionalMsg = Boolean(s.optionalMessage);
            const isMsgWithdrawn = Boolean(s.optionalMessage?.isWithdrawn);
            const isExpired = isMessageExpired(s.optionalMessage?.sentAt, now ?? Date.now());

            return (
              <Card key={s.id} className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge color="violet">{s.topic}</Badge>
                    <Badge color={s.answerType === "action" ? "amber" : "teal"}>
                      {s.answerLabel}
                    </Badge>
                    {s.isHandled && <Badge color="teal">{copy.handledBadge}</Badge>}
                    <span className="text-xs text-slate-400">
                      {now !== null && `${timeAgo(s.createdAt, now)}`}
                    </span>
                  </div>
                  <Badge color={s.isHandled ? "teal" : "slate"}>
                    {s.isHandled ? copy.handledBadge : statusFor(s)}
                  </Badge>
                </div>

                <SignalVisibilityTag viewer="sender" otherName={s.toName} />

                {/* Optional Message display on historical card */}
                {hasOptionalMsg && !isExpired && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
                    <p className="text-xs font-semibold text-slate-500">
                      {copy.managerHeading(leaderFirst)}
                    </p>
                    {isMsgWithdrawn ? (
                      <p className="text-xs font-medium text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                        {copy.withdrawn}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-800 break-words">{s.optionalMessage?.text}</p>
                    )}

                    {/* Employee can withdraw if not already withdrawn */}
                    {!isMsgWithdrawn && (
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => withdrawOptionalMessage(s.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 min-h-[44px] px-2 rounded-lg hover:bg-slate-200/60"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                          {copy.withdraw}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </EmptyPagePlaceholder>
  );
};
