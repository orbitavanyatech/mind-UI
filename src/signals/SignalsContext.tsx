"use client";

/* Direct signals: a named message an employee EXPLICITLY chooses to send to their own leader.

   Privacy model (the point of this module):
   - A signal is visible to exactly two people: the sender and the one leader it was addressed to.
   - The context never exposes the full list. Consumers only get `inbox` (signals addressed to the
     signed-in leader) and `sent` (signals the signed-in person wrote). Company administrators and
     the platform have no provider at all, and other leaders get an empty inbox.
   - Every mutation re-checks that the signed-in person is the sender or the recipient.
   - Signals are never aggregated, counted per team, reported or exported.

   Demo-only persistence: there is no backend, so signals live in localStorage (shared between the
   employee and leader demo personas). A real backend must enforce the same rules server-side. */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/auth/AuthContext";
import { USERS } from "@/data/mockData";
import type { Role } from "@/types";

export const SIGNAL_TOPICS = ["Workload", "Wellbeing", "Team dynamics", "Idea or feedback", "Something else"] as const;
export type SignalTopic = (typeof SIGNAL_TOPICS)[number];

export const MIN_LENGTH = 10;
export const MAX_LENGTH = 600;
/** Working agreement shown to leaders: acknowledge within this many days (1 when time-sensitive). */
export const RESPONSE_DAYS = 3;
export const URGENT_RESPONSE_DAYS = 1;

/* Demo identities (ids match people in mockData). */
export const PERSONA_IDS = { employee: "p-sophie", leader: "p-thomas" } as const;

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
  message: string;
  wantsConversation: boolean;
  timeSensitive: boolean;
  createdAt: string;
  /** Whose turn it is. */
  awaiting: "leader" | "sender";
  /** The leader hasn't opened this (or its latest follow-up) yet. */
  leaderUnread: boolean;
  /** When the leader first opened it; the sender sees this as "Seen". */
  seenAt?: string;
  resolvedAt?: string;
  thread: SignalMessage[];
  /** The leader's private note. Never shown to the sender or anyone else. */
  leaderNote: string;
}

export type SignalStatus = "sent" | "seen" | "replied" | "resolved";

/** Status as the sender sees it. */
export const statusFor = (s: DirectSignal): SignalStatus =>
  s.resolvedAt ? "resolved" : s.awaiting === "sender" ? "replied" : s.seenAt ? "seen" : "sent";

/** The leader's three working buckets. */
export type LeaderBucket = "needs" | "waiting" | "resolved";
export const bucketFor = (s: DirectSignal): LeaderBucket =>
  s.resolvedAt ? "resolved" : s.awaiting === "leader" ? "needs" : "waiting";

const DAY = 86_400_000;

/** When the leader's turn started: the sender's latest message. */
const lastSenderAt = (s: DirectSignal) => [...s.thread].reverse().find((m) => m.by === "sender")?.at ?? s.createdAt;

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

const STORAGE_KEY = "mind-elevate-signals-v1";
const ago = (now: number, days: number, hours = 0) => new Date(now - days * DAY - hours * 3_600_000).toISOString();

/* Starting data for the demo leader's inbox. */
const seed = (now: number): DirectSignal[] => [
  {
    id: "sig-1", fromId: "p-mei", fromName: "Mei Tanaka", fromTitle: "Site Reliability Engineer",
    toId: PERSONA_IDS.leader, toName: USERS.leader.name, topic: "Workload",
    message: "The on-call rotation has been heavy for three weeks. Could we talk about sharing it more evenly?",
    wantsConversation: true, timeSensitive: true, createdAt: ago(now, 2), awaiting: "leader", leaderUnread: true, thread: [], leaderNote: "",
  },
  {
    id: "sig-2", fromId: "p-sam", fromName: "Sam Okafor", fromTitle: "Software Engineer",
    toId: PERSONA_IDS.leader, toName: USERS.leader.name, topic: "Idea or feedback",
    message: "I'd like to try a team-wide focus-block experiment. Happy to run it if you're open to it.",
    wantsConversation: false, timeSensitive: false, createdAt: ago(now, 5), awaiting: "sender", leaderUnread: false, seenAt: ago(now, 4, 20),
    thread: [{ id: "m-1", by: "leader", text: "Thanks for the idea — I like it. Can you sketch what a two-week trial would look like?", at: ago(now, 4, 19) }],
    leaderNote: "",
  },
  {
    id: "sig-3", fromId: "p-joris", fromName: "Joris Mulder", fromTitle: "Backend Engineer",
    toId: PERSONA_IDS.leader, toName: USERS.leader.name, topic: "Team dynamics",
    message: "Handovers between squads keep dropping context. A short sync would help.",
    wantsConversation: true, timeSensitive: false, createdAt: ago(now, 12), awaiting: "sender", leaderUnread: false, seenAt: ago(now, 11),
    thread: [{ id: "m-2", by: "leader", text: "Agreed — set up a weekly 15-minute handover sync, starting this Thursday.", at: ago(now, 11) }],
    resolvedAt: ago(now, 8), leaderNote: "Check in again after the first two syncs.",
  },
];

export interface NewSignalInput {
  topic: SignalTopic;
  message: string;
  wantsConversation: boolean;
  timeSensitive: boolean;
}

interface SignalsValue {
  ready: boolean;
  /** Signals addressed to the signed-in leader (empty for everyone else), newest activity first. */
  inbox: DirectSignal[];
  /** Signals the signed-in person sent, newest first. */
  sent: DirectSignal[];
  /** Signals waiting on the leader, and how many of those are unopened. */
  needsResponse: number;
  unread: number;
  send: (input: NewSignalInput) => void;
  /** Leader opens a signal: marks it seen for the sender. */
  open: (id: string) => void;
  reply: (id: string, text: string) => void;
  resolve: (id: string) => void;
  reopen: (id: string) => void;
  saveNote: (id: string, text: string) => void;
  /** Sender adds a follow-up (reopens a resolved signal). */
  followUp: (id: string, text: string) => void;
  /** Sender takes a signal back. */
  withdraw: (id: string) => void;
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

  /* Applies `fn` to one signal, but only if the signed-in person is its leader/sender as required. */
  const mutate = useCallback(
    (id: string, as: "leader" | "sender", fn: (s: DirectSignal) => DirectSignal) =>
      setAll((cur) =>
        cur.map((s) => {
          const allowed = actorId !== null && (as === "leader" ? s.toId === actorId : s.fromId === actorId);
          return s.id === id && allowed ? fn(s) : s;
        }),
      ),
    [actorId],
  );

  const send = useCallback(
    (input: NewSignalInput) => {
      const message = input.message.trim();
      if (role !== "employee" || message.length < MIN_LENGTH || message.length > MAX_LENGTH) return;
      const me = USERS.employee;
      setAll((cur) => [
        {
          id: newId("sig"), fromId: PERSONA_IDS.employee, fromName: me.name, fromTitle: me.title,
          toId: PERSONA_IDS.leader, toName: USERS.leader.name,
          topic: input.topic, message, wantsConversation: input.wantsConversation, timeSensitive: input.timeSensitive,
          createdAt: new Date().toISOString(), awaiting: "leader", leaderUnread: true, thread: [], leaderNote: "",
        },
        ...cur,
      ]);
    },
    [role],
  );

  const open = useCallback(
    (id: string) =>
      mutate(id, "leader", (s) => (s.leaderUnread || !s.seenAt ? { ...s, leaderUnread: false, seenAt: s.seenAt ?? new Date().toISOString() } : s)),
    [mutate],
  );

  const reply = useCallback(
    (id: string, text: string) => {
      const t = text.trim();
      if (!t) return;
      mutate(id, "leader", (s) => ({
        ...s, awaiting: "sender", leaderUnread: false, seenAt: s.seenAt ?? new Date().toISOString(),
        thread: [...s.thread, { id: newId("m"), by: "leader", text: t, at: new Date().toISOString() }],
      }));
    },
    [mutate],
  );

  const resolve = useCallback((id: string) => mutate(id, "leader", (s) => ({ ...s, resolvedAt: new Date().toISOString(), leaderUnread: false, seenAt: s.seenAt ?? new Date().toISOString() })), [mutate]);
  const reopen = useCallback((id: string) => mutate(id, "leader", (s) => ({ ...s, resolvedAt: undefined })), [mutate]);
  const saveNote = useCallback((id: string, text: string) => mutate(id, "leader", (s) => ({ ...s, leaderNote: text.slice(0, 2000) })), [mutate]);

  const followUp = useCallback(
    (id: string, text: string) => {
      const t = text.trim();
      if (!t) return;
      mutate(id, "sender", (s) => ({
        ...s, awaiting: "leader", leaderUnread: true, resolvedAt: undefined,
        thread: [...s.thread, { id: newId("m"), by: "sender", text: t.slice(0, MAX_LENGTH), at: new Date().toISOString() }],
      }));
    },
    [mutate],
  );

  const withdraw = useCallback(
    (id: string) => setAll((cur) => cur.filter((s) => !(s.id === id && actorId !== null && s.fromId === actorId && !s.resolvedAt))),
    [actorId],
  );

  const value = useMemo<SignalsValue>(() => {
    const activity = (s: DirectSignal) => new Date(s.thread[s.thread.length - 1]?.at ?? s.createdAt).getTime();
    const inbox = actorId ? all.filter((s) => s.toId === actorId).sort((a, b) => activity(b) - activity(a)) : [];
    const sent = actorId ? all.filter((s) => s.fromId === actorId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
    return {
      ready, inbox, sent,
      needsResponse: inbox.filter((s) => bucketFor(s) === "needs").length,
      unread: inbox.filter((s) => s.leaderUnread).length,
      send, open, reply, resolve, reopen, saveNote, followUp, withdraw,
    };
  }, [all, actorId, ready, send, open, reply, resolve, reopen, saveNote, followUp, withdraw]);

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
