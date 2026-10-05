import {
  BookOpen,
  Brain,
  CheckCircle2,
  Compass,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";

export const TOPICS = [
  { id: "focus", name: "Focus & Attention", color: "teal" },
  { id: "resilience", name: "Resilience", color: "violet" },
  { id: "energy", name: "Energy & Recovery", color: "amber" },
  { id: "communication", name: "Communication", color: "indigo" },
] as const;

export const TRAINING_ITEMS = [
  { id: "focus-reset", title: "The 3-Minute Focus Reset", summary: "A short practice for regaining attention between meetings and interruptions.", topic: "focus", type: "exercise", duration: 3, progress: 0, saved: true, recommended: true },
  { id: "deep-work", title: "Protecting a Deep Work Block", summary: "Design a realistic block of focused work without relying on willpower.", topic: "focus", type: "module", duration: 12, progress: 55, saved: false, recommended: true },
  { id: "recovery", title: "Recovering After Intense Work", summary: "Notice the difference between switching tasks and actually recovering.", topic: "energy", type: "article", duration: 7, progress: 100, saved: false, recommended: true },
  { id: "resilience-loop", title: "The Resilience Loop", summary: "Recognise pressure, reset your response, and choose your next useful action.", topic: "resilience", type: "module", duration: 15, progress: 0, saved: false, recommended: false },
  { id: "hard-conversation", title: "Preparing for a Hard Conversation", summary: "A simple reflection framework for entering difficult conversations with clarity.", topic: "communication", type: "exercise", duration: 8, progress: 0, saved: false, recommended: false },
  { id: "energy-check", title: "Your Energy Signals", summary: "Map the moments that reliably restore or drain your capacity.", topic: "energy", type: "exercise", duration: 6, progress: 20, saved: true, recommended: false },
] as const;

export const WEEKLY_FOCUS = {
  week: "This week",
  streak: 4,
  title: "Protect your attention before you protect your schedule.",
  why: "Small moments of intentional focus can make the rest of your day feel less fragmented.",
  habits: [
    { id: "h1", label: "Choose one priority before opening your inbox.", done: true },
    { id: "h2", label: "Take one 25-minute distraction-free block.", done: false },
    { id: "h3", label: "Pause for two minutes before switching tasks.", done: false },
    { id: "h4", label: "Write down one thing that can wait.", done: false },
  ],
  days: [
    { d: "M", state: "done" }, { d: "T", state: "done" }, { d: "W", state: "today" },
    { d: "T", state: "future" }, { d: "F", state: "future" }, { d: "S", state: "future" }, { d: "S", state: "future" },
  ],
  checkIn: ["Heavy", "Unsettled", "Steady", "Good", "Great"],
  linkedItems: ["focus-reset", "deep-work"],
};

export const TYPE_META = {
  module: { label: "Module", cta: "Start", icon: BookOpen },
  exercise: { label: "Exercise", cta: "Try it", icon: Target },
  article: { label: "Article", cta: "Read", icon: Sparkles },
} as const;

export const LEADER_FOCUS = {
  title: "Create one clearer moment for your team this week.",
  desc: "Respond to anything a colleague chose to send you directly, then choose one small leadership practice.",
  actions: [
    { id: "a1", label: "Read the direct signals sent to you.", done: true },
    { id: "a2", label: "Ask one open question before offering a solution.", done: false },
    { id: "a3", label: "Protect one meeting-free recovery block.", done: false },
    { id: "a4", label: "Recognise one healthy team behaviour.", done: false },
  ],
};

export const LEADER_NUDGES = [
  { id: "n1", title: "Respond to named signals first", body: "When someone sends you a signal by name, they chose to tell you. A short, curious reply matters more than a solution.", tone: "amber" },
  { id: "n2", title: "Protect psychological safety", body: "Use curiosity before interpretation. You see only what people choose to share with you directly, so ask rather than assume.", tone: "teal" },
  { id: "n3", title: "Keep your own space separate", body: "Your private reflection and personal progress remain yours, even while you lead a team.", tone: "violet" },
] as const;

export const LEADER_PRACTICES = [
  { id: "lp1", tag: "Delegation", duration: "6 min", title: "Delegate the outcome, not every step", desc: "Clarify the result, constraints and decision rights before handing over the work." },
  { id: "lp2", tag: "Conversation", duration: "8 min", title: "Ask before you advise", desc: "Create a little more space for the other person to name what they need." },
  { id: "lp3", tag: "Recovery", duration: "5 min", title: "Model a real pause", desc: "Make recovery visible by protecting a short reset instead of filling every gap." },
  { id: "lp4", tag: "Change", duration: "10 min", title: "Name what is still stable", desc: "During uncertainty, separate what is changing from what the team can rely on." },
];
