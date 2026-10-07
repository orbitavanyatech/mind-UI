"use client";

/* Direct signals: a named message an employee EXPLICITLY chooses to send to their own leader.

   Privacy model (the point of this module):
   - A signal is visible to exactly two people: the sender and the one leader it was addressed to.
   - The context never exposes the full list. Consumers only get `inbox` (signals addressed to the
     signed-in leader) and `sent` (signals the signed-in person wrote). Company administrators and
     the platform have no provider at all, and other leaders get an empty inbox.
   - Every mutation re-checks that the signed-in person is the sender or the recipient.
   - Signals are never aggregated, counted per team, reported or exported, and never feed anonymous
     company / team / group insights. `scripts/check-signals-isolation.mjs` fails if reporting code imports this module.
   - Topics (SIGNAL_TOPICS) exist ONLY to organise the leader's inbox. They must never be turned into a
     wellbeing or performance score, a per-topic count or a trend.

   Bebrave · The Edge · Direct Signal message rule sheet (Final, 6 October 2026):
   - After sending a direct Signal answer of the type "action", the employee can add one short message
     to their approved manager.
   - Max 200 characters, single line, plain text. No attachments, formatting, emoji picker or clickable links.
   - Preview before sending. No editing after sending.
   - The employee can withdraw the message and send one replacement. Max two sends per Signal in total.
   - Handled stops new messages and replacements. It does not stop reading a message that has already been sent.
   - The employee can still withdraw the message after Handled, but cannot send a replacement.
   - No message field on positive, neutral or anonymous answers.
   - Manager sees active message on Signal card, below fixed answer, also after marking Handled.
   - Uses only existing actions: status, fixed acknowledgements and follow-up. No reply field, no chat.
   - After a withdrawal: "The message has been withdrawn." Withdrawn text can never be read.
   - If replacement is sent, only the new message is shown. No thread, no history of earlier text.
   - After 60 days from sending: nothing is shown. Neither the text nor the withdrawn status. */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/auth/AuthContext";
import { USERS } from "@/data/mockData";
import type { Lang, Role } from "@/types";

export const SIGNAL_TOPICS = ["Workload", "Wellbeing", "Team dynamics", "Idea or feedback", "Something else"] as const;
export type SignalTopic = (typeof SIGNAL_TOPICS)[number];

export type SignalAnswerType = "action" | "positive" | "neutral" | "anonymous";

export const MIN_LENGTH = 1;
export const MAX_OPTIONAL_MESSAGE_LENGTH = 200;
export const MAX_LENGTH = 600;

/** Working agreement shown to leaders: acknowledge within this many days (1 when time-sensitive). */
export const RESPONSE_DAYS = 3;
export const URGENT_RESPONSE_DAYS = 1;

/* Demo identities (ids match people in mockData). */
export const PERSONA_IDS = { employee: "p-sophie", leader: "p-thomas" } as const;

export interface OptionalSignalMessage {
  id: string;
  /** Plain text, single line, max 200 chars. Set to null immediately upon withdrawal (permanently unreadable). */
  text: string | null;
  sentAt: string;
  /** Max 2 sends per Signal in total (initial send + 1 replacement). */
  sendsCount: number;
  isWithdrawn: boolean;
  withdrawnAt?: string;
}

export interface SignalMessage {
  id: string;
  by: "sender" | "leader";
  text: string;
  at: string;
}

export interface DirectSignal {
  id: string;
  fromId: string;
  fromName: string;
  fromTitle: string;
  toId: string;
  toName: string;
  topic: SignalTopic;
  answerType: SignalAnswerType;
  answerLabel: string;
  optionalMessage?: OptionalSignalMessage | null;
  isHandled: boolean;
  handledAt?: string;
  acknowledgement?: string;
  followUpPlan?: string;
  /** Legacy/compatibility field for preview cards */
  message: string;
  wantsConversation: boolean;
  timeSensitive: boolean;
  createdAt: string;
  /** Whose turn it is. */
  awaiting: "leader" | "sender";
  /** The leader hasn't opened this yet. */
  leaderUnread: boolean;
  /** When the leader first opened it; the sender sees this as "Seen". */
  seenAt?: string;
  resolvedAt?: string;
  thread: SignalMessage[];
  /** The leader's private note. Never shown to the sender or anyone else. */
  leaderNote: string;
  /** For testing manager State 8: No access */
  managerAccessRevoked?: boolean;
}

export type SignalStatus = "sent" | "seen" | "replied" | "resolved";

/** Status as the sender sees it. */
export const statusFor = (s: DirectSignal): SignalStatus =>
  s.isHandled || s.resolvedAt ? "resolved" : s.awaiting === "sender" ? "replied" : s.seenAt ? "seen" : "sent";

/** The leader's three working buckets. */
export type LeaderBucket = "needs" | "waiting" | "resolved";
export const bucketFor = (s: DirectSignal): LeaderBucket =>
  s.isHandled || s.resolvedAt ? "resolved" : s.awaiting === "leader" ? "needs" : "waiting";

const DAY = 86_400_000;

export const isMessageExpired = (sentAt?: string, now: number = Date.now()): boolean => {
  if (!sentAt) return false;
  const sixtyDaysMs = 60 * DAY;
  return now - new Date(sentAt).getTime() > sixtyDaysMs;
};

/** When the leader's turn started: the sender's latest message or signal creation. */
const lastSenderAt = (s: DirectSignal) => s.optionalMessage?.sentAt ?? s.createdAt;

export const dueInfo = (s: DirectSignal, now: number): { overdue: boolean; label: string } => {
  const limit = (s.timeSensitive ? URGENT_RESPONSE_DAYS : RESPONSE_DAYS) * DAY;
  const left = new Date(lastSenderAt(s)).getTime() + limit - now;
  if (left < 0) {
    const days = Math.max(1, Math.ceil(-left / DAY));
    return { overdue: true, label: `Overdue by ${days} day${days === 1 ? "" : "s"}` };
  }
  const days = Math.ceil(left / DAY);
  return { overdue: false, label: days <= 1 ? "Reply due today" : `Reply within ${days} days` };
};

export const timeAgo = (iso: string, now: number) => {
  const mins = Math.floor((now - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
};

/* Verbatim copy from the PDF rule sheet */
export const SIGNAL_MESSAGE_COPY = {
  en: {
    addMessageButton: "Add a message",
    lineByField: (firstName: string) => `Sent with your name to ${firstName}. Deleted within 60 days.`,
    sendButton: (firstName: string) => `Send message to ${firstName}`,
    withdraw: "Withdraw message",
    confirmWithdraw: (firstName: string) => `${firstName} may already have read the message. Do you want to withdraw it?`,
    managerHeading: (firstName: string) => `Message from ${firstName}`,
    withdrawn: "The message has been withdrawn.",
    // Supporting UI labels
    keep: "Keep",
    preview: "Preview",
    edit: "Edit",
    sendFailed: "Failed to send message",
    retry: "Try again",
    handledBadge: "Handled",
    markHandled: "Mark as Handled",
    reopen: "Reopen",
    fixedAcknowledgements: [
      "Thank you for sharing this with me.",
      "I've received this and am looking into it.",
      "Let's schedule time to discuss this during our next 1:1."
    ],
    followUpOptions: [
      "Follow-up scheduled this week",
      "Action item taken",
      "No further action required"
    ],
    noAccessTitle: "No access",
    noAccessDesc: "You do not have access to this signal as your manager relationship or role is inactive.",
  },
  da: {
    addMessageButton: "Tilføj en besked",
    lineByField: (firstName: string) => `Sendes med dit navn til ${firstName}. Slettes senest efter 60 dage.`,
    sendButton: (firstName: string) => `Send besked til ${firstName}`,
    withdraw: "Træk beskeden tilbage",
    confirmWithdraw: (firstName: string) => `${firstName} kan allerede have læst beskeden. Vil du trække den tilbage?`,
    managerHeading: (firstName: string) => `Besked fra ${firstName}`,
    withdrawn: "Beskeden er trukket tilbage.",
    // Supporting UI labels
    keep: "Behold",
    preview: "Forhåndsvisning",
    edit: "Rediger",
    sendFailed: "Beskeden kunne ikke sendes",
    retry: "Prøv igen",
    handledBadge: "Håndteret",
    markHandled: "Marker som håndteret",
    reopen: "Genåbn",
    fixedAcknowledgements: [
      "Tak fordi du deler dette med mig.",
      "Jeg har modtaget dette og undersøger det.",
      "Lad os finde tid til at drøfte dette på vores næste 1:1."
    ],
    followUpOptions: [
      "Opfølgning planlagt til denne uge",
      "Handling iværksat",
      "Ingen yderligere handling nødvendig"
    ],
    noAccessTitle: "Ingen adgang",
    noAccessDesc: "Du har ikke adgang til dette signal, da dit lederforhold eller din rolle er inaktiv.",
  },
} as const;

export const getSignalCopy = (lang: Lang) => (lang === "da" ? SIGNAL_MESSAGE_COPY.da : SIGNAL_MESSAGE_COPY.en);

const STORAGE_KEY = "mind-elevate-signals-v2";
const ago = (now: number, days: number, hours = 0) => new Date(now - days * DAY - hours * 3_600_000).toISOString();

/* Starting seed data demonstrating all product states */
const seed = (now: number): DirectSignal[] => [
  {
    id: "sig-action-with-msg",
    fromId: "p-sophie",
    fromName: USERS.employee.name,
    fromTitle: USERS.employee.title,
    toId: PERSONA_IDS.leader,
    toName: USERS.leader.name,
    topic: "Workload",
    answerType: "action",
    answerLabel: "High workload — action requested",
    optionalMessage: {
      id: "msg-1",
      text: "The sprint deliverables are overlapping with on-call shifts. Could we adjust the scope before Thursday?",
      sentAt: ago(now, 1),
      sendsCount: 1,
      isWithdrawn: false,
    },
    isHandled: false,
    message: "The sprint deliverables are overlapping with on-call shifts. Could we adjust the scope before Thursday?",
    wantsConversation: true,
    timeSensitive: true,
    createdAt: ago(now, 1),
    awaiting: "leader",
    leaderUnread: false,
    seenAt: ago(now, 0, 12),
    thread: [],
    leaderNote: "Review shift allocation at standup",
  },
  {
    id: "sig-action-withdrawn",
    fromId: "p-sophie",
    fromName: USERS.employee.name,
    fromTitle: USERS.employee.title,
    toId: PERSONA_IDS.leader,
    toName: USERS.leader.name,
    topic: "Team dynamics",
    answerType: "action",
    answerLabel: "Coordination friction — action requested",
    optionalMessage: {
      id: "msg-2",
      text: null, // withdrawn text is NEVER readable
      sentAt: ago(now, 3),
      sendsCount: 1,
      isWithdrawn: true,
      withdrawnAt: ago(now, 2),
    },
    isHandled: false,
    message: "The message has been withdrawn.",
    wantsConversation: false,
    timeSensitive: false,
    createdAt: ago(now, 3),
    awaiting: "leader",
    leaderUnread: false,
    seenAt: ago(now, 2, 10),
    thread: [],
    leaderNote: "",
  },
  {
    id: "sig-action-replacement",
    fromId: "p-sam",
    fromName: "Sam Okafor",
    fromTitle: "Software Engineer",
    toId: PERSONA_IDS.leader,
    toName: USERS.leader.name,
    topic: "Idea or feedback",
    answerType: "action",
    answerLabel: "Process proposal — action requested",
    optionalMessage: {
      id: "msg-3",
      text: "Clarified note: Proposing a 2-week trial of no-meeting Wednesdays. I will draft the guidelines.",
      sentAt: ago(now, 4),
      sendsCount: 2, // max 2 sends reached
      isWithdrawn: false,
    },
    isHandled: false,
    message: "Clarified note: Proposing a 2-week trial of no-meeting Wednesdays. I will draft the guidelines.",
    wantsConversation: false,
    timeSensitive: false,
    createdAt: ago(now, 5),
    awaiting: "leader",
    leaderUnread: true,
    thread: [],
    leaderNote: "",
  },
  {
    id: "sig-action-long-320",
    fromId: "p-mei",
    fromName: "Mei Tanaka",
    fromTitle: "Site Reliability Engineer",
    toId: PERSONA_IDS.leader,
    toName: USERS.leader.name,
    topic: "Workload",
    answerType: "action",
    answerLabel: "Infrastructure emergency — action requested",
    optionalMessage: {
      id: "msg-4",
      // Exactly near 200 characters single-line plain text to verify 320px mobile responsiveness
      text: "Cluster maintenance window was extended by three hours due to replica sync delays. We need a secondary engineer on standby for tomorrow night to prevent burn-out.",
      sentAt: ago(now, 2),
      sendsCount: 1,
      isWithdrawn: false,
    },
    isHandled: false,
    message: "Cluster maintenance window was extended by three hours due to replica sync delays. We need a secondary engineer on standby for tomorrow night to prevent burn-out.",
    wantsConversation: true,
    timeSensitive: true,
    createdAt: ago(now, 2),
    awaiting: "leader",
    leaderUnread: false,
    seenAt: ago(now, 1),
    thread: [],
    leaderNote: "",
  },
  {
    id: "sig-action-handled",
    fromId: "p-joris",
    fromName: "Joris Mulder",
    fromTitle: "Backend Engineer",
    toId: PERSONA_IDS.leader,
    toName: USERS.leader.name,
    topic: "Team dynamics",
    answerType: "action",
    answerLabel: "Handovers — action requested",
    optionalMessage: {
      id: "msg-5",
      text: "Handovers between squads keep dropping context. A 15-minute weekly sync would fix this.",
      sentAt: ago(now, 10),
      sendsCount: 1,
      isWithdrawn: false,
    },
    isHandled: true,
    handledAt: ago(now, 8),
    acknowledgement: "Thank you for sharing this with me.",
    followUpPlan: "Follow-up scheduled this week",
    message: "Handovers between squads keep dropping context. A 15-minute weekly sync would fix this.",
    wantsConversation: false,
    timeSensitive: false,
    createdAt: ago(now, 10),
    awaiting: "sender",
    leaderUnread: false,
    seenAt: ago(now, 9),
    resolvedAt: ago(now, 8),
    thread: [],
    leaderNote: "Check in again after the first two syncs.",
  },
  {
    id: "sig-action-expired",
    fromId: "p-mei",
    fromName: "Mei Tanaka",
    fromTitle: "Site Reliability Engineer",
    toId: PERSONA_IDS.leader,
    toName: USERS.leader.name,
    topic: "Workload",
    answerType: "action",
    answerLabel: "Old ticket — action requested",
    optionalMessage: {
      id: "msg-6",
      text: "Older request from two months ago that is now expired.",
      sentAt: ago(now, 65), // > 60 days
      sendsCount: 1,
      isWithdrawn: false,
    },
    isHandled: true,
    handledAt: ago(now, 63),
    message: "Old ticket",
    wantsConversation: false,
    timeSensitive: false,
    createdAt: ago(now, 65),
    awaiting: "sender",
    leaderUnread: false,
    seenAt: ago(now, 64),
    resolvedAt: ago(now, 63),
    thread: [],
    leaderNote: "",
  },
  {
    id: "sig-action-no-message",
    fromId: "p-sophie",
    fromName: USERS.employee.name,
    fromTitle: USERS.employee.title,
    toId: PERSONA_IDS.leader,
    toName: USERS.leader.name,
    topic: "Wellbeing",
    answerType: "action",
    answerLabel: "Needs support — action requested",
    optionalMessage: null,
    isHandled: false,
    message: "Needs support — action requested",
    wantsConversation: true,
    timeSensitive: false,
    createdAt: ago(now, 6),
    awaiting: "leader",
    leaderUnread: false,
    seenAt: ago(now, 5),
    thread: [],
    leaderNote: "",
  },
];

export interface NewSignalInput {
  topic: SignalTopic;
  answerType?: SignalAnswerType;
  answerLabel?: string;
  message?: string;
  wantsConversation?: boolean;
  timeSensitive?: boolean;
}

interface SignalsValue {
  ready: boolean;
  /** Signals addressed to the signed-in leader, newest first. */
  inbox: DirectSignal[];
  /** Signals the signed-in person sent, newest first. */
  sent: DirectSignal[];
  /** Signals waiting on the leader, and how many of those are unopened. */
  needsResponse: number;
  unread: number;
  /** 1-tap Signal answer submission (Positive, Neutral, or Action) */
  answerSignal: (input: { topic: SignalTopic; answerType: SignalAnswerType; answerLabel: string }) => string;
  /** Legacy send method */
  send: (input: NewSignalInput) => string;
  /** Add / replace optional message on an action signal (max 200 chars, single line, plain text, max 2 sends) */
  sendOptionalMessage: (signalId: string, text: string) => Promise<boolean>;
  /** Withdraw message: text is permanently redacted, message marked withdrawn */
  withdrawOptionalMessage: (signalId: string) => void;
  /** Manager marks signal Handled (freezes replacements) */
  markHandled: (signalId: string) => void;
  /** Manager reopens signal */
  reopenSignal: (signalId: string) => void;
  /** Manager sets fixed acknowledgement */
  setAcknowledgement: (signalId: string, ack: string) => void;
  /** Manager sets follow-up */
  setFollowUp: (signalId: string, plan: string) => void;
  /** Toggle manager access for state 8 demo */
  toggleManagerAccess: (signalId: string) => void;
  /** Leader opens a signal: marks it seen */
  open: (id: string) => void;
  saveNote: (id: string, text: string) => void;
  /** Withdraw entire signal */
  withdraw: (id: string) => void;
  /** Reset seed state for demo */
  resetDemoSignals: () => void;
}

const SignalsContext = createContext<SignalsValue | null>(null);

const actorIdFor = (role: Role | null) => (role === "leader" ? PERSONA_IDS.leader : role === "employee" ? PERSONA_IDS.employee : null);
const newId = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export const SignalsProvider = ({ children }: { children: ReactNode }) => {
  const { role } = useAuth();
  const actorId = actorIdFor(role);
  const [all, setAll] = useState<DirectSignal[]>([]);
  const [ready, setReady] = useState(false);

  const load = useCallback(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setAll(JSON.parse(raw) as DirectSignal[]);
        return;
      }
    } catch {
      /* fall through to seed data */
    }
    setAll(seed(Date.now()));
  }, []);

  useEffect(() => {
    load();
    setReady(true);
    const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && load();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [load]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {
      /* storage unavailable — keep working in memory */
    }
  }, [all, ready]);

  const mutate = useCallback(
    (id: string, as: "leader" | "sender" | "any", fn: (s: DirectSignal) => DirectSignal) =>
      setAll((cur) =>
        cur.map((s) => {
          const allowed =
            actorId !== null &&
            (as === "any" || (as === "leader" ? s.toId === actorId : s.fromId === actorId));
          return s.id === id && allowed ? fn(s) : s;
        }),
      ),
    [actorId],
  );

  /* 1-tap Signal answer submission */
  const answerSignal = useCallback(
    (input: { topic: SignalTopic; answerType: SignalAnswerType; answerLabel: string }): string => {
      const me = USERS.employee;
      const id = newId("sig");
      const newSignal: DirectSignal = {
        id,
        fromId: PERSONA_IDS.employee,
        fromName: me.name,
        fromTitle: me.title,
        toId: PERSONA_IDS.leader,
        toName: USERS.leader.name,
        topic: input.topic,
        answerType: input.answerType,
        answerLabel: input.answerLabel,
        optionalMessage: null,
        isHandled: false,
        message: input.answerLabel,
        wantsConversation: input.answerType === "action",
        timeSensitive: false,
        createdAt: new Date().toISOString(),
        awaiting: "leader",
        leaderUnread: true,
        thread: [],
        leaderNote: "",
      };
      setAll((cur) => [newSignal, ...cur]);
      return id;
    },
    [],
  );

  const send = useCallback(
    (input: NewSignalInput): string => {
      return answerSignal({
        topic: input.topic,
        answerType: input.answerType ?? "action",
        answerLabel: input.answerLabel ?? (input.message?.trim() || "Action requested"),
      });
    },
    [answerSignal],
  );

  /* Add or replace optional message on an action signal */
  const sendOptionalMessage = useCallback(
    async (signalId: string, text: string): Promise<boolean> => {
      // Clean single line plain text, max 200 chars
      const sanitized = text.replace(/[\r\n]+/g, " ").trim().slice(0, MAX_OPTIONAL_MESSAGE_LENGTH);
      if (!sanitized) return false;

      let success = false;
      setAll((cur) =>
        cur.map((s) => {
          if (s.id !== signalId) return s;
          if (s.answerType !== "action") return s;
          if (s.isHandled) return s; // Handled stops new messages and replacements
          const currentCount = s.optionalMessage?.sendsCount ?? 0;
          if (currentCount >= 2) return s; // Max 2 sends in total

          success = true;
          const msg: OptionalSignalMessage = {
            id: newId("msg"),
            text: sanitized,
            sentAt: new Date().toISOString(),
            sendsCount: currentCount + 1,
            isWithdrawn: false,
          };
          return {
            ...s,
            optionalMessage: msg,
            message: sanitized,
            awaiting: "leader",
            leaderUnread: true,
          };
        }),
      );
      return success;
    },
    [],
  );

  /* Withdraw optional message */
  const withdrawOptionalMessage = useCallback(
    (signalId: string) => {
      mutate(signalId, "sender", (s) => {
        if (!s.optionalMessage || s.optionalMessage.isWithdrawn) return s;
        return {
          ...s,
          optionalMessage: {
            ...s.optionalMessage,
            text: null, // text can NEVER be read after withdrawal
            isWithdrawn: true,
            withdrawnAt: new Date().toISOString(),
          },
          message: "The message has been withdrawn.",
        };
      });
    },
    [mutate],
  );

  const markHandled = useCallback(
    (signalId: string) => {
      mutate(signalId, "leader", (s) => ({
        ...s,
        isHandled: true,
        handledAt: new Date().toISOString(),
        resolvedAt: s.resolvedAt ?? new Date().toISOString(),
        awaiting: "sender",
      }));
    },
    [mutate],
  );

  const reopenSignal = useCallback(
    (signalId: string) => {
      mutate(signalId, "leader", (s) => ({
        ...s,
        isHandled: false,
        resolvedAt: undefined,
        awaiting: "leader",
      }));
    },
    [mutate],
  );

  const setAcknowledgement = useCallback(
    (signalId: string, ack: string) => {
      mutate(signalId, "leader", (s) => ({
        ...s,
        acknowledgement: ack,
      }));
    },
    [mutate],
  );

  const setFollowUp = useCallback(
    (signalId: string, plan: string) => {
      mutate(signalId, "leader", (s) => ({
        ...s,
        followUpPlan: plan,
      }));
    },
    [mutate],
  );

  const toggleManagerAccess = useCallback(
    (signalId: string) => {
      mutate(signalId, "any", (s) => ({
        ...s,
        managerAccessRevoked: !s.managerAccessRevoked,
      }));
    },
    [mutate],
  );

  const open = useCallback(
    (id: string) =>
      mutate(id, "leader", (s) =>
        s.leaderUnread || !s.seenAt ? { ...s, leaderUnread: false, seenAt: s.seenAt ?? new Date().toISOString() } : s,
      ),
    [mutate],
  );

  const saveNote = useCallback(
    (id: string, text: string) => mutate(id, "leader", (s) => ({ ...s, leaderNote: text.slice(0, 2000) })),
    [mutate],
  );

  const withdraw = useCallback(
    (id: string) => setAll((cur) => cur.filter((s) => !(s.id === id && actorId !== null && s.fromId === actorId && !s.resolvedAt))),
    [actorId],
  );

  const resetDemoSignals = useCallback(() => {
    const fresh = seed(Date.now());
    setAll(fresh);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<SignalsValue>(() => {
    const inbox = actorId
      ? all
          .filter((s) => s.toId === actorId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      : [];
    const sent = actorId
      ? all
          .filter((s) => s.fromId === actorId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      : [];

    return {
      ready,
      inbox,
      sent,
      needsResponse: inbox.filter((s) => bucketFor(s) === "needs" && !s.managerAccessRevoked).length,
      unread: inbox.filter((s) => s.leaderUnread && !s.managerAccessRevoked).length,
      answerSignal,
      send,
      sendOptionalMessage,
      withdrawOptionalMessage,
      markHandled,
      reopenSignal,
      setAcknowledgement,
      setFollowUp,
      toggleManagerAccess,
      open,
      saveNote,
      withdraw,
      resetDemoSignals,
    };
  }, [
    all,
    actorId,
    ready,
    answerSignal,
    send,
    sendOptionalMessage,
    withdrawOptionalMessage,
    markHandled,
    reopenSignal,
    setAcknowledgement,
    setFollowUp,
    toggleManagerAccess,
    open,
    saveNote,
    withdraw,
    resetDemoSignals,
  ]);

  return <SignalsContext.Provider value={value}>{children}</SignalsContext.Provider>;
};

export const useSignals = () => {
  const ctx = useContext(SignalsContext);
  if (!ctx) throw new Error("useSignals must be used within a SignalsProvider");
  return ctx;
};

/** For shared chrome (sidebar) that also renders in areas without a provider. */
export const useSignalsOptional = () => useContext(SignalsContext);

/** Current time, available only after mount so server and client markup agree. */
export const useNow = () => {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
};
