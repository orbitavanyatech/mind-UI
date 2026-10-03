/* Auto-generated during modernization refactor of Mind Elevate */
import {
  Activity,
  Award,
  BookOpen,
  Building2,
  ClipboardList,
  DollarSign,
  Flame,
  GraduationCap,
  NotebookPen,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";

export const USERS = {
  employee: { name: "Sophie van Dijk", role: "employee", title: "Product Designer", team: "Design", initials: "SD" },
  leader: { name: "Thomas de Vries", role: "leader", title: "Engineering Manager", team: "Platform Engineering", initials: "TV" },
  admin: { name: "Lotte Jansen", role: "admin", title: "People Operations Admin", team: "HR", initials: "LJ" },
};

export const MONTHLY_THEME = {
  title: "Focus & Deep Work",
  month: "August 2026",
  description: "This month we're building sustainable focus habits â€” protecting attention, reducing context-switching, and designing a workday your brain can actually thrive in.",
  progress: 68,
  icon: Target,
  modules: [
    { name: "The Science of Attention", done: true },
    { name: "Designing a Distraction-Free Block", done: true },
    { name: "Recovering After Deep Work", done: false },
    { name: "Focus Under Pressure", done: false },
  ],
};

export const LEARNING_PATHS = [
  { name: "Foundations of Resilience", progress: 100, modules: 6, color: "teal" },
  { name: "Focus & Deep Work", progress: 68, modules: 8, color: "amber" },
  { name: "Navigating Change", progress: 32, modules: 5, color: "indigo" },
  { name: "Sustainable High Performance", progress: 10, modules: 7, color: "violet" },
];

export const UPCOMING_SESSIONS = [
  { title: "Live: Managing Pre-Deadline Stress", type: "Group Session", host: "Dr. Alina Wu", date: "Aug 27", time: "11:00 AM", spots: "24 spots left" },
  { title: "1:1 Coaching Check-in", type: "1:1 Coaching", host: "Coach Marcus Ford", date: "Aug 29", time: "2:30 PM", spots: "Confirmed" },
  { title: "Mindful Mornings â€” Weekly Reset", type: "Group Session", host: "Sofia Alvarez", date: "Sep 2", time: "9:00 AM", spots: "12 spots left" },
  { title: "Resilience Reset â€” Group Circle", type: "Group Session", host: "Dr. Alina Wu", date: "Sep 5", time: "3:00 PM", spots: "18 spots left" },
];

export const QUICK_ACTIONS = [
  { label: "Resume Learning", icon: BookOpen, desc: "Continue Focus & Deep Work" },
  { label: "Book a Session", icon: Video, desc: "Live & 1:1 availability" },
  { label: "Take Pulse Survey", icon: ClipboardList, desc: "2 min, fully anonymous" },
  { label: "View Progress", icon: TrendingUp, desc: "Your growth over time" },
];

export const WELLBEING_TREND = [
  { week: "W1", focus: 58, resilience: 61, energy: 54 },
  { week: "W2", focus: 63, resilience: 64, energy: 59 },
  { week: "W3", focus: 66, resilience: 68, energy: 62 },
  { week: "W4", focus: 74, resilience: 70, energy: 68 },
];

export const COACHING_NOTES_PREVIEW = [
  { date: "Aug 15", note: "Discussed delegation strategies ahead of Q3 planning." },
  { date: "Aug 1", note: "Explored energy management across back-to-back leadership meetings." },
];

export const TEAM_PULSE = [
  { label: "Team Energy", value: 74 },
  { label: "Psych. Safety", value: 81 },
  { label: "Workload Balance", value: 62 },
];

/* ---------------------------------------------------------------------
   Certificates & Badges â€” recognition for employees and leaders.
   `roles` controls who can see/earn a badge or certificate. Locked
   badges carry a `progress` (0-100) toward the next milestone instead
   of an `earnedDate`. Nothing here is ever visible to administrators â€”
   it's personal recognition, not performance data. */
export const BADGES = [
  {
    id: "foundations-graduate",
    name: "Foundations Graduate",
    description: "Completed every module in the Foundations of Resilience learning path.",
    icon: GraduationCap,
    tier: "gold",
    roles: ["employee", "leader"],
    earned: true,
    earnedDate: "Jul 18, 2026",
  },
  {
    id: "streak-4",
    name: "4-Week Streak",
    description: "Checked in on your wellbeing four weeks in a row.",
    icon: Flame,
    tier: "bronze",
    roles: ["employee", "leader"],
    earned: true,
    earnedDate: "Aug 24, 2026",
  },
  {
    id: "reflective-practitioner",
    name: "Reflective Practitioner",
    description: "Logged 3 private reflections after completing a module or theme.",
    icon: NotebookPen,
    tier: "bronze",
    roles: ["employee", "leader"],
    earned: true,
    earnedDate: "Aug 24, 2026",
  },
  {
    id: "pulse-participant",
    name: "Pulse Participant",
    description: "Completed 5 anonymous pulse surveys.",
    icon: ClipboardList,
    tier: "bronze",
    roles: ["employee", "leader"],
    earned: false,
    progress: 60,
  },
  {
    id: "focus-finisher",
    name: "Focus Finisher",
    description: "Complete every module in this month's theme, Focus & Deep Work.",
    icon: Target,
    tier: "silver",
    roles: ["employee", "leader"],
    earned: false,
    progress: 68,
  },
  {
    id: "session-regular",
    name: "Session Regular",
    description: "Attend 3 live or group sessions.",
    icon: Video,
    tier: "silver",
    roles: ["employee", "leader"],
    earned: false,
    progress: 33,
  },
  {
    id: "people-champion",
    name: "People Champion",
    description: "Completed 3 confidential leadership coaching sessions.",
    icon: ShieldCheck,
    tier: "gold",
    roles: ["leader"],
    earned: true,
    earnedDate: "Aug 1, 2026",
  },
  {
    id: "team-pulse-advocate",
    name: "Team Pulse Advocate",
    description: "Kept your team's psychological safety score above 80% for a full quarter.",
    icon: Users,
    tier: "silver",
    roles: ["leader"],
    earned: true,
    earnedDate: "Jul 30, 2026",
  },
];

export const CERTIFICATES = [
  {
    id: "foundations-resilience",
    title: "Foundations of Resilience",
    issuedDate: "Jul 18, 2026",
    credentialId: "ME-2026-FR-04821",
    detail: "6 modules Â· 4.5 hours",
    color: "teal",
    roles: ["employee", "leader"],
  },
  {
    id: "leadership-fundamentals",
    title: "Leadership Fundamentals",
    issuedDate: "Aug 1, 2026",
    credentialId: "ME-2026-LF-01193",
    detail: "5 modules Â· 6 hours",
    color: "violet",
    roles: ["leader"],
  },
];

/* In-progress paths that will unlock a certificate once complete â€”
   shown so people can see what's coming next. */
export const UPCOMING_CERTIFICATES = [
  { id: "focus-deep-work", title: "Focus & Deep Work", progress: 68, roles: ["employee", "leader"] },
  { id: "navigating-change", title: "Navigating Change", progress: 32, roles: ["employee", "leader"] },
];

/* Admin â€” aggregate-only mock data */
export const ORG_STATS = [
  { label: "Active Employees", value: "2,314", delta: "+4.2%", icon: Users },
  { label: "Monthly Engagement", value: "78%", delta: "+6 pts", icon: Activity },
  { label: "Avg. Learning Completion", value: "64%", delta: "+11 pts", icon: BookOpen },
  { label: "Pulse Response Rate", value: "71%", delta: "+3 pts", icon: ClipboardList },
];

export const ENGAGEMENT_TREND = [
  { month: "Mar", engagement: 58 }, { month: "Apr", engagement: 61 },
  { month: "May", engagement: 65 }, { month: "Jun", engagement: 69 },
  { month: "Jul", engagement: 74 }, { month: "Aug", engagement: 78 },
];

export const DEPARTMENT_COMPLETION = [
  { dept: "Engineering", completion: 71 }, { dept: "Sales", completion: 58 },
  { dept: "Design", completion: 82 }, { dept: "Support", completion: 66 },
  { dept: "Ops", completion: 60 },
];

export const THEME_PARTICIPATION = [
  { name: "Completed", value: 64 }, { name: "In Progress", value: 24 }, { name: "Not Started", value: 12 },
];
export const PIE_COLORS = ["#3346E8", "#EE8710", "#DDE1E5"];

export const ADMIN_USERS = [
  { name: "Sophie van Dijk", dept: "Design", role: "Employee", status: "Active", lastActive: "Today" },
  { name: "Thomas de Vries", dept: "Platform Eng.", role: "Leader", status: "Active", lastActive: "Today" },
  { name: "Wei Zhang", dept: "Sales", role: "Employee", status: "Active", lastActive: "Yesterday" },
  { name: "Ines Fontaine", dept: "Support", role: "Leader", status: "Invited", lastActive: "â€”" },
  { name: "TomÃ¡s Silva", dept: "Engineering", role: "Employee", status: "Inactive", lastActive: "12 days ago" },
];

export const CONTENT_LIBRARY = [
  { title: "The Science of Attention", type: "Course Module", theme: "Focus & Deep Work", status: "Published" },
  { title: "Navigating Reorgs with Confidence", type: "Article", theme: "Navigating Change", status: "Published" },
  { title: "Leading Through Uncertainty", type: "Live Session", theme: "Navigating Change", status: "Scheduled" },
  { title: "Recovery Rituals for High Performers", type: "Course Module", theme: "Sustainable Performance", status: "Draft" },
];

export const ADMIN_THEMES = [
  { month: "August 2026", title: "Focus & Deep Work", status: "Active" },
  { month: "September 2026", title: "Navigating Change", status: "Scheduled" },
  { month: "July 2026", title: "Foundations of Resilience", status: "Archived" },
];

/* ---------------------------------------------------------------------
   Platform admin â€” Mind Elevate operators managing the companies (client
   organizations) on the platform, not any single company's employees.
   All figures here are portfolio-level and never drill into individual
   employee data. ------------------------------------------------- */
export const PLATFORM_STATS = [
  { label: "Total Companies", value: "48", delta: "+3", icon: Building2 },
  { label: "Active Seats (all companies)", value: "18,240", delta: "+6.1%", icon: Users },
  { label: "Platform MRR", value: "$142.6K", delta: "+8.4%", icon: DollarSign },
  { label: "Avg. Company Engagement", value: "73%", delta: "+4 pts", icon: Activity },
];

export const COMPANY_GROWTH_TREND = [
  { month: "Mar", companies: 34 }, { month: "Apr", companies: 37 },
  { month: "May", companies: 39 }, { month: "Jun", companies: 42 },
  { month: "Jul", companies: 45 }, { month: "Aug", companies: 48 },
];

export const PLAN_DISTRIBUTION = [
  { name: "Enterprise", value: 14 }, { name: "Growth", value: 20 }, { name: "Starter", value: 14 },
];

/* Every client organization provisioned on Mind Elevate. `health` drives
   which companies surface in the "Needs attention" list on the admin
   dashboard. */
export const COMPANIES = [
  { id: "acme", name: "Acme Corp", plan: "Enterprise", seats: 2500, seatsUsed: 2314, engagement: 82, status: "Active", renewal: "Dec 12, 2026", health: "good", mrr: 18500 },
  { id: "umbrella", name: "Umbrella Health", plan: "Enterprise", seats: 3200, seatsUsed: 3050, engagement: 88, status: "Active", renewal: "Jan 22, 2027", health: "good", mrr: 24800 },
  { id: "northwind", name: "Northwind Traders", plan: "Growth", seats: 1000, seatsUsed: 820, engagement: 74, status: "Active", renewal: "Oct 3, 2026", health: "good", mrr: 6200 },
  { id: "vandelay", name: "Vandelay Industries", plan: "Growth", seats: 650, seatsUsed: 540, engagement: 69, status: "Active", renewal: "Nov 8, 2026", health: "good", mrr: 4100 },
  { id: "globex", name: "Globex Industries", plan: "Starter", seats: 200, seatsUsed: 156, engagement: 41, status: "At Risk", renewal: "Sep 15, 2026", health: "at_risk", mrr: 1400 },
  { id: "initech", name: "Initech", plan: "Growth", seats: 500, seatsUsed: 120, engagement: 28, status: "Trial", renewal: "Sep 9, 2026", health: "at_risk", mrr: 0 },
  { id: "stark", name: "Stark Logistics", plan: "Starter", seats: 300, seatsUsed: 244, engagement: 76, status: "Active", renewal: "Dec 1, 2026", health: "good", mrr: 2100 },
  { id: "hooli", name: "Hooli", plan: "Starter", seats: 150, seatsUsed: 38, engagement: 19, status: "Suspended", renewal: "â€”", health: "suspended", mrr: 0 },
];

/* ---------------------------------------------------------------------
   Module Details / Video Player / Exercise / Questions
   Each learning module is a short sequence of lessons. `type` drives
   which detail screen a lesson opens: "video" | "exercise" | "questions".
   ------------------------------------------------------------------- */
export const MODULES = {
  "science-of-attention": {
    id: "science-of-attention",
    name: "The Science of Attention",
    path: "Focus & Deep Work",
    color: "amber",
    duration: "38 min",
    description: "Understand how attention actually works â€” why it's a limited resource, what depletes it fastest, and how top performers protect it across a demanding day.",
    progress: 100,
    lessons: [
      { id: "attn-video-1", type: "video", title: "Why Attention Is Finite", duration: "9 min", done: true, videoId: "attention-finite" },
      { id: "attn-exercise-1", type: "exercise", title: "Map Your Attention Drains", duration: "6 min", done: true },
      { id: "attn-questions-1", type: "questions", title: "Check Your Understanding", duration: "4 min", done: true },
    ],
  },
  "distraction-free-block": {
    id: "distraction-free-block",
    name: "Designing a Distraction-Free Block",
    path: "Focus & Deep Work",
    color: "amber",
    duration: "42 min",
    description: "A practical walkthrough for building a protected block of deep-work time into a calendar that's already full of meetings.",
    progress: 100,
    lessons: [
      { id: "dfb-video-1", type: "video", title: "Designing the Block", duration: "11 min", done: true, videoId: "designing-block" },
      { id: "dfb-exercise-1", type: "exercise", title: "Build Your First Block", duration: "8 min", done: true },
      { id: "dfb-questions-1", type: "questions", title: "Check Your Understanding", duration: "4 min", done: true },
    ],
  },
  "recovering-after-deep-work": {
    id: "recovering-after-deep-work",
    name: "Recovering After Deep Work",
    path: "Focus & Deep Work",
    color: "amber",
    duration: "35 min",
    description: "Deep work has a cost. Learn the recovery habits that let you go again tomorrow without burning out this week.",
    progress: 40,
    lessons: [
      { id: "rec-video-1", type: "video", title: "The Recovery Curve", duration: "10 min", done: true, videoId: "recovery-curve" },
      { id: "rec-exercise-1", type: "exercise", title: "Design a Recovery Ritual", duration: "7 min", done: false },
      { id: "rec-questions-1", type: "questions", title: "Check Your Understanding", duration: "4 min", done: false },
    ],
  },
  "focus-under-pressure": {
    id: "focus-under-pressure",
    name: "Focus Under Pressure",
    path: "Focus & Deep Work",
    color: "amber",
    duration: "40 min",
    description: "What changes about focus when the stakes go up â€” and the small adjustments that keep you sharp instead of scattered.",
    progress: 0,
    lessons: [
      { id: "fup-video-1", type: "video", title: "Pressure Changes Everything", duration: "9 min", done: false, videoId: "pressure-focus" },
      { id: "fup-exercise-1", type: "exercise", title: "Your Pressure Reset Plan", duration: "7 min", done: false },
      { id: "fup-questions-1", type: "questions", title: "Check Your Understanding", duration: "4 min", done: false },
    ],
  },
};

/* Maps a Learning Path name to the ordered module ids that belong to it,
   so the Library page can deep-link "Continue" into the right module. */
export const PATH_MODULES = {
  "Focus & Deep Work": ["science-of-attention", "distraction-free-block", "recovering-after-deep-work", "focus-under-pressure"],
};

/* Comprehension / reflection-style questions shown on the Questions
   screen for a lesson. Kept generic so any module can reuse them. */
export const LESSON_QUESTIONS = [
  {
    id: "q1",
    prompt: "What is the biggest driver of attention fatigue during a typical workday?",
    options: ["Meeting length", "Context-switching between tasks", "Screen brightness", "Time of day"],
    correctIndex: 1,
  },
  {
    id: "q2",
    prompt: "Which of these is the best first step in protecting a deep-work block?",
    options: ["Turning off notifications only", "Blocking the time and telling your team why", "Working later at night", "Skipping breaks"],
    correctIndex: 1,
  },
  {
    id: "q3",
    prompt: "In your own words, what's one change you'll make this week based on this lesson?",
    freeText: true,
  },
];

/* ---------------------------------------------------------------------
   Private Reflections â€” journal-style entries, visible only to the
   employee who wrote them. Never exposed to admins/employers.
   ------------------------------------------------------------------- */
export const PRIVATE_REFLECTIONS = [
  { id: "r1", date: "Aug 24, 2026", mood: "\u{1F642}", relatedTo: "The Science of Attention", text: "Noticed I switch tabs most right after standup — going to try a 25-minute buffer before opening Slack." },
  { id: "r2", date: "Aug 18, 2026", mood: "\u{1F610}", relatedTo: "Monthly Theme: Focus & Deep Work", text: "Workload felt heavier this week. Blocked mornings helped Tue/Wed but I let Thu slip." },
  { id: "r3", date: "Aug 10, 2026", mood: "\u{1F604}", relatedTo: "Designing a Distraction-Free Block", text: "First real 90-minute block in months. Getting through my backlog without pinging anyone felt great." },
];

/* ---------------------------------------------------------------------
   Session Details â€” extra fields for the Live Sessions detail screen,
   keyed by the session title (matches UPCOMING_SESSIONS entries).
   ------------------------------------------------------------------- */
export const SESSION_DETAILS = {
  "Live: Managing Pre-Deadline Stress": {
    description: "A live, expert-led session on recognizing stress spikes before a deadline and using quick, workable resets that don't require you to step away from your desk for long.",
    agenda: ["Welcome & framing (5 min)", "The deadline stress curve (15 min)", "Live reset techniques, practiced together (20 min)", "Open Q&A (15 min)"],
    location: "Zoom",
    joinUrl: "https://zoom.us/j/000000000",
    past: false,
  },
  "1:1 Coaching Check-in": {
    description: "A private, 1:1 check-in with your coach. Notes from this session are visible only to you and your coach â€” never to your organization.",
    agenda: ["Check in on last session's goals (10 min)", "Focus topic for today (20 min)", "Next steps (5 min)"],
    location: "Zoom",
    joinUrl: "https://zoom.us/j/111111111",
    past: false,
  },
  "Mindful Mornings â€” Weekly Reset": {
    description: "A gentle, weekly group reset to start the day with intention â€” light guided practice, no cameras required.",
    agenda: ["Grounding practice (10 min)", "Intention setting (10 min)", "Open share, opt-in (10 min)"],
    location: "Zoom",
    joinUrl: "https://zoom.us/j/222222222",
    past: false,
  },
  "Resilience Reset â€” Group Circle": {
    description: "A recurring peer circle for processing a demanding week and picking up a few resilience tools along the way.",
    agenda: ["Opening round (10 min)", "Resilience tool of the week (15 min)", "Peer discussion (20 min)"],
    location: "Zoom",
    joinUrl: "https://zoom.us/j/333333333",
    past: false,
  },
};
