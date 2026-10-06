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
import type {
  BadgeDef,
  Certificate,
  Company,
  CompanySession,
  ContentItem,
  Department,
  Person,
  Plan,
  Team,
  LearningModule,
  LearningPath,
  LessonQuestion,
  LiveSession,
  MonthlyThemeItem,
  PrivateReflection,
  Role,
  SessionDetail,
  UpcomingCertificate,
  User,
} from "@/types";

export const USERS: Record<Role, User> = {
  employee: { name: "Sophie van Dijk", role: "employee", title: "Product Designer", team: "Design", initials: "SD" },
  leader: { name: "Thomas de Vries", role: "leader", title: "Engineering Manager", team: "Platform Engineering", initials: "TV" },
  company_admin: { name: "Lotte Jansen", role: "company_admin", title: "People Operations Admin", team: "HR", initials: "LJ" },
  platform_admin: { name: "Daan Bakker", role: "platform_admin", title: "Platform Operations", team: "Mind Elevate", initials: "DB" },
};

export const MONTHLY_THEME = {
  title: "Focus & Deep Work",
  month: "August 2026",
  description: "This month we're building sustainable focus habits — protecting attention, reducing context-switching, and designing a workday your brain can actually thrive in.",
  progress: 68,
  icon: Target,
  modules: [
    { name: "The Science of Attention", done: true },
    { name: "Designing a Distraction-Free Block", done: true },
    { name: "Recovering After Deep Work", done: false },
    { name: "Focus Under Pressure", done: false },
  ],
};

export const LEARNING_PATHS: LearningPath[] = [
  { name: "Foundations of Resilience", progress: 100, modules: 6, color: "teal" },
  { name: "Focus & Deep Work", progress: 68, modules: 8, color: "amber" },
  { name: "Navigating Change", progress: 32, modules: 5, color: "indigo" },
  { name: "Sustainable High Performance", progress: 10, modules: 7, color: "violet" },
];

export const UPCOMING_SESSIONS: LiveSession[] = [
  { id: "pre-deadline-stress", title: "Live: Managing Pre-Deadline Stress", type: "Group Session", host: "Dr. Alina Wu", date: "Aug 27", time: "11:00 AM", spots: "24 spots left" },
  { id: "coaching-check-in", title: "1:1 Coaching Check-in", type: "1:1 Coaching", host: "Coach Marcus Ford", date: "Aug 29", time: "2:30 PM", spots: "Confirmed" },
  { id: "mindful-mornings", title: "Mindful Mornings — Weekly Reset", type: "Group Session", host: "Sofia Alvarez", date: "Sep 2", time: "9:00 AM", spots: "12 spots left" },
  { id: "resilience-reset", title: "Resilience Reset — Group Circle", type: "Group Session", host: "Dr. Alina Wu", date: "Sep 5", time: "3:00 PM", spots: "18 spots left" },
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

/* ---------------------------------------------------------------------
   Certificates & Badges — recognition for employees and leaders.
   `roles` controls who can see/earn a badge or certificate. Locked
   badges carry a `progress` (0-100) toward the next milestone instead
   of an `earnedDate`. Nothing here is ever visible to administrators —
   it's personal recognition, not performance data. */
export const BADGES: BadgeDef[] = [
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

export const CERTIFICATES: Certificate[] = [
  {
    id: "foundations-resilience",
    title: "Foundations of Resilience",
    issuedDate: "Jul 18, 2026",
    credentialId: "ME-2026-FR-04821",
    detail: "6 modules · 4.5 hours",
    color: "teal",
    roles: ["employee", "leader"],
  },
  {
    id: "leadership-fundamentals",
    title: "Leadership Fundamentals",
    issuedDate: "Aug 1, 2026",
    credentialId: "ME-2026-LF-01193",
    detail: "5 modules · 6 hours",
    color: "violet",
    roles: ["leader"],
  },
];

/* In-progress paths that will unlock a certificate once complete —
   shown so people can see what's coming next. */
export const UPCOMING_CERTIFICATES: UpcomingCertificate[] = [
  { id: "focus-deep-work", title: "Focus & Deep Work", progress: 68, roles: ["employee", "leader"] },
  { id: "navigating-change", title: "Navigating Change", progress: 32, roles: ["employee", "leader"] },
];

/* Admin — aggregate-only mock data */
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

export const CONTENT_LIBRARY: ContentItem[] = [
  { id: "c-science-of-attention", title: "The Science of Attention", type: "Course Module", theme: "Focus & Deep Work", status: "Published" },
  { id: "c-navigating-reorgs", title: "Navigating Reorgs with Confidence", type: "Article", theme: "Navigating Change", status: "Published" },
  { id: "c-leading-uncertainty", title: "Leading Through Uncertainty", type: "Live Session", theme: "Navigating Change", status: "Scheduled" },
  { id: "c-recovery-rituals", title: "Recovery Rituals for High Performers", type: "Course Module", theme: "Sustainable Performance", status: "Draft" },
];

export const ADMIN_THEMES: MonthlyThemeItem[] = [
  { id: "th-aug-2026", month: "August 2026", title: "Focus & Deep Work", status: "Active" },
  { id: "th-sep-2026", month: "September 2026", title: "Navigating Change", status: "Scheduled" },
  { id: "th-jul-2026", month: "July 2026", title: "Foundations of Resilience", status: "Archived" },
];

/* ---------------------------------------------------------------------
   Platform admin — Mind Elevate operators managing the companies (client
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
export const COMPANIES: Company[] = [
  { id: "acme", name: "Acme Corp", plan: "Enterprise", seats: 2500, seatsUsed: 2314, engagement: 82, status: "Active", renewal: "Dec 12, 2026", health: "good", mrr: 18500, billing: "Annual" },
  { id: "umbrella", name: "Umbrella Health", plan: "Enterprise", seats: 3200, seatsUsed: 3050, engagement: 88, status: "Active", renewal: "Jan 22, 2027", health: "good", mrr: 24800, billing: "Annual" },
  { id: "northwind", name: "Northwind Traders", plan: "Growth", seats: 1000, seatsUsed: 820, engagement: 74, status: "Active", renewal: "Oct 3, 2026", health: "good", mrr: 6200, billing: "Monthly" },
  { id: "vandelay", name: "Vandelay Industries", plan: "Growth", seats: 650, seatsUsed: 540, engagement: 69, status: "Active", renewal: "Nov 8, 2026", health: "good", mrr: 4100, billing: "Monthly" },
  { id: "globex", name: "Globex Industries", plan: "Starter", seats: 200, seatsUsed: 156, engagement: 41, status: "At Risk", renewal: "Sep 15, 2026", health: "at_risk", mrr: 1400, billing: "Monthly" },
  { id: "initech", name: "Initech", plan: "Growth", seats: 500, seatsUsed: 120, engagement: 28, status: "Trial", renewal: "Sep 9, 2026", health: "at_risk", mrr: 0, billing: "Monthly" },
  { id: "stark", name: "Stark Logistics", plan: "Starter", seats: 300, seatsUsed: 244, engagement: 76, status: "Active", renewal: "Dec 1, 2026", health: "good", mrr: 2100, billing: "Monthly" },
  { id: "hooli", name: "Hooli", plan: "Starter", seats: 150, seatsUsed: 38, engagement: 19, status: "Suspended", renewal: "—", health: "suspended", mrr: 0, billing: "Monthly" },
];

/* ---------------------------------------------------------------------
   Module Details / Video Player / Exercise / Questions
   Each learning module is a short sequence of lessons. `type` drives
   which detail screen a lesson opens: "video" | "exercise" | "questions".
   ------------------------------------------------------------------- */
export const MODULES: Record<string, LearningModule> = {
  "science-of-attention": {
    id: "science-of-attention",
    name: "The Science of Attention",
    path: "Focus & Deep Work",
    color: "amber",
    duration: "38 min",
    description: "Understand how attention actually works — why it's a limited resource, what depletes it fastest, and how top performers protect it across a demanding day.",
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
    description: "What changes about focus when the stakes go up — and the small adjustments that keep you sharp instead of scattered.",
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
export const PATH_MODULES: Record<string, string[]> = {
  "Focus & Deep Work": ["science-of-attention", "distraction-free-block", "recovering-after-deep-work", "focus-under-pressure"],
};

/* Comprehension / reflection-style questions shown on the Questions
   screen for a lesson. Kept generic so any module can reuse them. */
export const LESSON_QUESTIONS: LessonQuestion[] = [
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
   Private Reflections — journal-style entries, visible only to the
   employee who wrote them. Never exposed to admins/employers.
   ------------------------------------------------------------------- */
export const PRIVATE_REFLECTIONS: PrivateReflection[] = [
  { id: "r1", date: "Aug 24, 2026", mood: "🙂", relatedTo: "The Science of Attention", text: "Noticed I switch tabs most right after standup — going to try a 25-minute buffer before opening Slack." },
  { id: "r2", date: "Aug 18, 2026", mood: "😐", relatedTo: "Monthly Theme: Focus & Deep Work", text: "Workload felt heavier this week. Blocked mornings helped Tue/Wed but I let Thu slip." },
  { id: "r3", date: "Aug 10, 2026", mood: "😄", relatedTo: "Designing a Distraction-Free Block", text: "First real 90-minute block in months. Getting through my backlog without pinging anyone felt great." },
];

/* ---------------------------------------------------------------------
   Session Details — extra fields for the Live Sessions detail screen,
   keyed by the session title (matches UPCOMING_SESSIONS entries).
   ------------------------------------------------------------------- */
export const SESSION_DETAILS: Record<string, SessionDetail> = {
  "pre-deadline-stress": {
    description: "A live, expert-led session on recognizing stress spikes before a deadline and using quick, workable resets that don't require you to step away from your desk for long.",
    agenda: ["Welcome & framing (5 min)", "The deadline stress curve (15 min)", "Live reset techniques, practiced together (20 min)", "Open Q&A (15 min)"],
    location: "Zoom",
    joinUrl: "https://zoom.us/j/000000000",
    past: false,
  },
  "coaching-check-in": {
    description: "A private, 1:1 check-in with your coach. Notes from this session are visible only to you and your coach — never to your organization.",
    agenda: ["Check in on last session's goals (10 min)", "Focus topic for today (20 min)", "Next steps (5 min)"],
    location: "Zoom",
    joinUrl: "https://zoom.us/j/111111111",
    past: false,
  },
  "mindful-mornings": {
    description: "A gentle, weekly group reset to start the day with intention — light guided practice, no cameras required.",
    agenda: ["Grounding practice (10 min)", "Intention setting (10 min)", "Open share, opt-in (10 min)"],
    location: "Zoom",
    joinUrl: "https://zoom.us/j/222222222",
    past: false,
  },
  "resilience-reset": {
    description: "A recurring peer circle for processing a demanding week and picking up a few resilience tools along the way.",
    agenda: ["Opening round (10 min)", "Resilience tool of the week (15 min)", "Peer discussion (20 min)"],
    location: "Zoom",
    joinUrl: "https://zoom.us/j/333333333",
    past: false,
  },
};

/* ---------------------------------------------------------------------
   Subscription plans sold by Mind Elevate (platform admin edits the
   company -> plan assignment; prices are demo values).
   ------------------------------------------------------------------- */
export const PLANS: Plan[] = [
  { name: "Starter", pricePerSeat: 7, minSeats: 50, features: ["Monthly theme + library", "Pulse surveys", "Email support"] },
  { name: "Growth", pricePerSeat: 9, minSeats: 250, features: ["Everything in Starter", "Live sessions & recordings", "Aggregated reports"] },
  { name: "Enterprise", pricePerSeat: 12, minSeats: 1000, features: ["Everything in Growth", "Leadership coaching", "SSO & dedicated manager"] },
];
/** Discount applied when a company pays annually. */
export const ANNUAL_DISCOUNT = 0.15;

/* ---------------------------------------------------------------------
   Company workspace (Acme Corp) — the people, departments and teams a
   company administrator places and manages. ------------------------- */
export const DEPARTMENTS: Department[] = [
  { id: "design", name: "Design", headId: "p-sophie" },
  { id: "engineering", name: "Engineering", headId: "p-thomas" },
  { id: "sales", name: "Sales", headId: "p-wei" },
  { id: "support", name: "Support", headId: "p-ines" },
  { id: "ops", name: "Operations", headId: null },
];

export const TEAMS: Team[] = [
  { id: "t-product-design", name: "Product Design", departmentId: "design", leadId: "p-sophie" },
  { id: "t-brand", name: "Brand & Illustration", departmentId: "design", leadId: null },
  { id: "t-platform", name: "Platform Engineering", departmentId: "engineering", leadId: "p-thomas" },
  { id: "t-web", name: "Web Experience", departmentId: "engineering", leadId: null },
  { id: "t-enterprise-sales", name: "Enterprise Sales", departmentId: "sales", leadId: "p-wei" },
  { id: "t-inside-sales", name: "Inside Sales", departmentId: "sales", leadId: null },
  { id: "t-tier1", name: "Tier 1 Support", departmentId: "support", leadId: "p-ines" },
];

export const PEOPLE: Person[] = [
  { id: "p-sophie", name: "Sophie van Dijk", email: "sophie.vandijk@acme.com", title: "Product Designer", role: "Employee", status: "Active", lastActive: "Today", departmentId: "design", teamId: "t-product-design", engagement: 68, completion: 74, workload: 45 },
  { id: "p-femke", name: "Femke de Boer", email: "femke.deboer@acme.com", title: "Interaction Designer", role: "Employee", status: "Active", lastActive: "Today", departmentId: "design", teamId: "t-product-design", engagement: 78, completion: 71, workload: 35 },
  { id: "p-luca", name: "Luca Moretti", email: "luca.moretti@acme.com", title: "UX Researcher", role: "Employee", status: "Active", lastActive: "Yesterday", departmentId: "design", teamId: "t-product-design", engagement: 75, completion: 73, workload: 44 },
  { id: "p-eva", name: "Eva Lindqvist", email: "eva.lindqvist@acme.com", title: "Brand Designer", role: "Employee", status: "Active", lastActive: "Today", departmentId: "design", teamId: "t-brand", engagement: 76, completion: 71, workload: 49 },
  { id: "p-ravi", name: "Ravi Menon", email: "ravi.menon@acme.com", title: "Illustrator", role: "Employee", status: "Active", lastActive: "2 days ago", departmentId: "design", teamId: "t-brand", engagement: 64, completion: 71, workload: 35 },
  { id: "p-thomas", name: "Thomas de Vries", email: "thomas.devries@acme.com", title: "Engineering Manager", role: "Leader", status: "Active", lastActive: "Today", departmentId: "engineering", teamId: "t-platform", engagement: 67, completion: 72, workload: 52 },
  { id: "p-joris", name: "Joris Mulder", email: "joris.mulder@acme.com", title: "Backend Engineer", role: "Employee", status: "Active", lastActive: "Today", departmentId: "engineering", teamId: "t-platform", engagement: 61, completion: 61, workload: 67 },
  { id: "p-mei", name: "Mei Tanaka", email: "mei.tanaka@acme.com", title: "Site Reliability Engineer", role: "Employee", status: "Active", lastActive: "Yesterday", departmentId: "engineering", teamId: "t-platform", engagement: 67, completion: 60, workload: 68 },
  { id: "p-sam", name: "Sam Okafor", email: "sam.okafor@acme.com", title: "Software Engineer", role: "Employee", status: "Active", lastActive: "Today", departmentId: "engineering", teamId: "t-platform", engagement: 57, completion: 66, workload: 70 },
  { id: "p-dmitri", name: "Dmitri Volkov", email: "dmitri.volkov@acme.com", title: "Data Engineer", role: "Employee", status: "Active", lastActive: "2 days ago", departmentId: "engineering", teamId: "t-platform", engagement: 74, completion: 77, workload: 51 },
  { id: "p-tomas", name: "Tomás Silva", email: "tomas.silva@acme.com", title: "Software Engineer", role: "Employee", status: "Suspended", lastActive: "12 days ago", departmentId: "engineering", teamId: "t-platform", engagement: 31, completion: 31, workload: 62 },
  { id: "p-anika", name: "Anika Patel", email: "anika.patel@acme.com", title: "Frontend Engineer", role: "Employee", status: "Active", lastActive: "Today", departmentId: "engineering", teamId: "t-web", engagement: 72, completion: 77, workload: 62 },
  { id: "p-elif", name: "Elif Demir", email: "elif.demir@acme.com", title: "Frontend Engineer", role: "Employee", status: "Active", lastActive: "Today", departmentId: "engineering", teamId: "t-web", engagement: 55, completion: 66, workload: 51 },
  { id: "p-pieter", name: "Pieter Smit", email: "pieter.smit@acme.com", title: "QA Engineer", role: "Employee", status: "Active", lastActive: "Yesterday", departmentId: "engineering", teamId: "t-web", engagement: 71, completion: 63, workload: 59 },
  { id: "p-hanna", name: "Hanna Berg", email: "hanna.berg@acme.com", title: "Security Engineer", role: "Employee", status: "Active", lastActive: "Today", departmentId: "engineering", teamId: null, engagement: 67, completion: 63, workload: 67 },
  { id: "p-wei", name: "Wei Zhang", email: "wei.zhang@acme.com", title: "Sales Lead", role: "Leader", status: "Active", lastActive: "Yesterday", departmentId: "sales", teamId: "t-enterprise-sales", engagement: 51, completion: 64, workload: 63 },
  { id: "p-marco", name: "Marco Bianchi", email: "marco.bianchi@acme.com", title: "Account Executive", role: "Employee", status: "Active", lastActive: "2 days ago", departmentId: "sales", teamId: "t-enterprise-sales", engagement: 65, completion: 67, workload: 59 },
  { id: "p-isabel", name: "Isabel Cruz", email: "isabel.cruz@acme.com", title: "Account Executive", role: "Employee", status: "Active", lastActive: "Today", departmentId: "sales", teamId: "t-enterprise-sales", engagement: 51, completion: 64, workload: 72 },
  { id: "p-niels", name: "Niels Haan", email: "niels.haan@acme.com", title: "Solutions Consultant", role: "Employee", status: "Active", lastActive: "Today", departmentId: "sales", teamId: "t-enterprise-sales", engagement: 68, completion: 52, workload: 65 },
  { id: "p-chloe", name: "Chloé Laurent", email: "chloe.laurent@acme.com", title: "Account Executive", role: "Employee", status: "Active", lastActive: "Yesterday", departmentId: "sales", teamId: "t-enterprise-sales", engagement: 51, completion: 63, workload: 76 },
  { id: "p-aisha", name: "Aisha Rahman", email: "aisha.rahman@acme.com", title: "Sales Development Rep", role: "Employee", status: "Active", lastActive: "Today", departmentId: "sales", teamId: "t-inside-sales", engagement: 50, completion: 64, workload: 55 },
  { id: "p-tim", name: "Tim Verhoeven", email: "tim.verhoeven@acme.com", title: "Sales Development Rep", role: "Employee", status: "Active", lastActive: "Today", departmentId: "sales", teamId: "t-inside-sales", engagement: 67, completion: 52, workload: 69 },
  { id: "p-ines", name: "Ines Fontaine", email: "ines.fontaine@acme.com", title: "Support Manager", role: "Leader", status: "Invited", lastActive: "—", departmentId: "support", teamId: "t-tier1", engagement: 0, completion: 0, workload: 0 },
  { id: "p-noor", name: "Noor Hassan", email: "noor.hassan@acme.com", title: "Support Specialist", role: "Employee", status: "Active", lastActive: "Today", departmentId: "support", teamId: "t-tier1", engagement: 73, completion: 71, workload: 71 },
  { id: "p-bram", name: "Bram Visser", email: "bram.visser@acme.com", title: "Support Specialist", role: "Employee", status: "Active", lastActive: "Today", departmentId: "support", teamId: "t-tier1", engagement: 76, completion: 64, workload: 72 },
  { id: "p-yara", name: "Yara Haddad", email: "yara.haddad@acme.com", title: "Support Specialist", role: "Employee", status: "Active", lastActive: "Yesterday", departmentId: "support", teamId: "t-tier1", engagement: 70, completion: 68, workload: 69 },
  { id: "p-oskar", name: "Oskar Nilsen", email: "oskar.nilsen@acme.com", title: "Support Specialist", role: "Employee", status: "Active", lastActive: "Today", departmentId: "support", teamId: "t-tier1", engagement: 61, completion: 61, workload: 63 },
  { id: "p-julia", name: "Julia Rossi", email: "julia.rossi@acme.com", title: "Customer Success Manager", role: "Employee", status: "Active", lastActive: "2 days ago", departmentId: "support", teamId: null, engagement: 74, completion: 78, workload: 65 },
  { id: "p-lotte", name: "Lotte Jansen", email: "lotte.jansen@acme.com", title: "People Operations Admin", role: "Company Admin", status: "Active", lastActive: "Today", departmentId: "ops", teamId: null, engagement: 52, completion: 66, workload: 47 },
  { id: "p-kees", name: "Kees Dijkstra", email: "kees.dijkstra@acme.com", title: "Operations Coordinator", role: "Employee", status: "Active", lastActive: "Yesterday", departmentId: "ops", teamId: null, engagement: 66, completion: 63, workload: 48 },
  { id: "p-jonas", name: "Jonas Becker", email: "jonas.becker@acme.com", title: "Operations Analyst", role: "Employee", status: "Invited", lastActive: "—", departmentId: null, teamId: null, engagement: 0, completion: 0, workload: 0 },
  { id: "p-mila", name: "Mila Novak", email: "mila.novak@acme.com", title: "Finance Analyst", role: "Employee", status: "Invited", lastActive: "—", departmentId: null, teamId: null, engagement: 0, completion: 0, workload: 0 },
];

/* Mind Elevate session hosts a company can book for its own people. */
export const SESSION_HOSTS = ["Dr. Alina Wu", "Sofia Alvarez", "James Patel", "Coach Marcus Ford"];

/* Sessions this company has scheduled. Audience is resolved against the live org structure. */
export const COMPANY_SESSIONS: CompanySession[] = [
  { id: "cs-1", title: "Managing Pre-Deadline Stress", host: "Dr. Alina Wu", date: "2026-08-27", time: "11:00", audience: { kind: "everyone" }, status: "Scheduled" },
  { id: "cs-2", title: "Mindful Mornings", host: "Sofia Alvarez", date: "2026-09-02", time: "09:00", audience: { kind: "department", id: "support" }, status: "Scheduled" },
  { id: "cs-3", title: "Leading Through Uncertainty", host: "James Patel", date: "2026-09-10", time: "13:00", audience: { kind: "team", id: "t-platform" }, status: "Scheduled" },
];
