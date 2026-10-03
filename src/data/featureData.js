/* Mock data for the role-based features:
   - Employee: Personal Space (Weekly Focus, Topic Discovery, Training Item View)
   - Leader:   Leader Experience + Team Balance pattern visualization
   - Admin:    Advanced user management table
   Everything is illustrative — there is no backend. */

/* ---------------- Employee · Personal Space ---------------- */

export const WEEKLY_FOCUS = {
  week: "Week 4 · Aug 24 – Aug 30",
  title: "Protect one 90-minute deep-work block each day",
  why: "Short, protected blocks beat long, fragmented days. This week you practice the one habit that makes the rest of the theme stick.",
  habits: [
    { id: "h1", label: "Block 90 minutes in your calendar before 10:00", done: true },
    { id: "h2", label: "Silence notifications for the whole block", done: true },
    { id: "h3", label: "Write down the single outcome you'll finish", done: false },
    { id: "h4", label: "Take a 10-minute recovery walk afterwards", done: false },
  ],
  days: [
    { d: "Mon", state: "done" },
    { d: "Tue", state: "done" },
    { d: "Wed", state: "today" },
    { d: "Thu", state: "todo" },
    { d: "Fri", state: "todo" },
  ],
  streak: 6,
  checkIn: ["Drained", "Scattered", "Steady", "Focused", "In flow"],
  linkedItems: ["ti-attention-reset", "ti-block-design"],
};

export const TOPICS = [
  { id: "focus", name: "Focus", color: "teal" },
  { id: "resilience", name: "Resilience", color: "amber" },
  { id: "energy", name: "Energy", color: "indigo" },
  { id: "communication", name: "Communication", color: "violet" },
  { id: "change", name: "Navigating Change", color: "teal" },
  { id: "recovery", name: "Recovery", color: "amber" },
];

/* type: video | exercise | article | audio */
export const TRAINING_ITEMS = [
  {
    id: "ti-attention-reset", title: "The 3-Minute Attention Reset", type: "exercise", topic: "focus",
    duration: 3, level: "Beginner", saved: true, progress: 0, recommended: true,
    summary: "A quick guided reset you can run between meetings to clear attention residue.",
    outcome: "Re-enter deep work faster after an interruption.",
    steps: ["Close your eyes or soften your gaze for 20 seconds.", "Name the task you're leaving — out loud or in writing.", "Take three slow breaths, longer on the exhale.", "Pick the first small action of the next task and begin."],
    takeaways: ["Attention lingers on the previous task — closing it explicitly frees capacity.", "Resets work best when tied to an existing transition, like leaving a meeting."],
  },
  {
    id: "ti-block-design", title: "Designing a Distraction-Free Block", type: "video", topic: "focus",
    duration: 12, level: "Beginner", saved: false, progress: 45, recommended: true,
    summary: "Set up your calendar, devices and workspace so deep work is the default.",
    outcome: "A repeatable 90-minute block you actually protect.",
    steps: ["Choose your peak-energy window.", "Declare the block to your team.", "Remove the three biggest interruptions.", "Define a clear stop condition."],
    takeaways: ["Environment design beats willpower.", "A visible stop condition makes starting easier."],
  },
  {
    id: "ti-box-breathing", title: "Box Breathing Under Pressure", type: "audio", topic: "resilience",
    duration: 5, level: "Beginner", saved: true, progress: 100, recommended: false,
    summary: "A 4-4-4-4 breathing pattern used to steady the nervous system before high-stakes moments.",
    outcome: "Lower physiological arousal in under five minutes.",
    steps: ["Inhale for four counts.", "Hold for four counts.", "Exhale for four counts.", "Hold for four counts, then repeat for 5 rounds."],
    takeaways: ["Slow, paced breathing shifts the body toward recovery.", "Use it before presentations, feedback conversations or deadlines."],
  },
  {
    id: "ti-energy-audit", title: "Run Your Personal Energy Audit", type: "exercise", topic: "energy",
    duration: 10, level: "Intermediate", saved: false, progress: 0, recommended: true,
    summary: "Track what gives and drains energy across a typical week, then redesign one pattern.",
    outcome: "One concrete change to your weekly rhythm.",
    steps: ["List your five most frequent weekly activities.", "Rate each +2 to −2 for energy impact.", "Spot the biggest drain you can influence.", "Plan one small experiment for next week."],
    takeaways: ["Energy, not time, is the scarce resource.", "Small experiments beat big overhauls."],
  },
  {
    id: "ti-reframe", title: "Reframing a Setback", type: "article", topic: "resilience",
    duration: 6, level: "Intermediate", saved: false, progress: 0, recommended: false,
    summary: "A practical, three-question approach to turning a setback into usable information.",
    outcome: "Recover perspective faster after things go wrong.",
    steps: ["Describe what happened, factually.", "Separate what you control from what you don't.", "Choose the next smallest useful action."],
    takeaways: ["Explanatory style shapes recovery speed.", "Facts first, interpretation second."],
  },
  {
    id: "ti-clear-asks", title: "Making Clear Asks", type: "video", topic: "communication",
    duration: 9, level: "Beginner", saved: false, progress: 0, recommended: false,
    summary: "Say what you need, by when, and why — without over-apologizing.",
    outcome: "Fewer back-and-forth messages and faster decisions.",
    steps: ["State the ask in one sentence.", "Add the deadline and the reason.", "Offer an easy way to say no."],
    takeaways: ["Clarity is a kindness.", "A specific ask is easier to answer."],
  },
  {
    id: "ti-change-curve", title: "Leading Yourself Through Change", type: "article", topic: "change",
    duration: 8, level: "Intermediate", saved: true, progress: 20, recommended: false,
    summary: "Understand the emotional arc of change and what helps at each stage.",
    outcome: "Language for what you're feeling — and a next step.",
    steps: ["Locate yourself on the change curve.", "Name one thing that is staying the same.", "Choose one thing you can influence this week."],
    takeaways: ["Resistance is information, not a flaw.", "Anchor on what's stable."],
  },
  {
    id: "ti-recovery-ritual", title: "A 10-Minute Recovery Ritual", type: "audio", topic: "recovery",
    duration: 10, level: "Beginner", saved: false, progress: 0, recommended: true,
    summary: "A guided wind-down to separate work from the rest of your evening.",
    outcome: "Switch off properly and sleep better.",
    steps: ["Close your work loops for the day.", "Do a slow body scan.", "Set one intention for the evening."],
    takeaways: ["Detachment is a skill you can train.", "Consistency matters more than length."],
  },
];

/* ---------------- Leader · Experience & Team Balance ---------------- */

export const LEADER_FOCUS = {
  title: "Create space for deep work in your team",
  desc: "This week, try one team-level change that protects focus time — then notice what shifts.",
  actions: [
    { id: "a1", label: "Declare a no-meeting block on Wednesday morning", done: true },
    { id: "a2", label: "Ask each direct report for their top focus-blocker", done: false },
    { id: "a3", label: "Reduce one recurring meeting by 15 minutes", done: false },
  ],
};

export const LEADER_PRACTICES = [
  { id: "p1", title: "The 5-Minute Check-In", tag: "Team rhythm", desc: "Open 1:1s with energy and load before status — it changes the whole conversation.", duration: "5 min" },
  { id: "p2", title: "Protect the Edges of the Day", tag: "Workload", desc: "Agree team norms for early and late messages to reduce always-on pressure.", duration: "10 min" },
  { id: "p3", title: "Name the Trade-off", tag: "Prioritization", desc: "When adding work, explicitly decide what leaves the plan.", duration: "8 min" },
  { id: "p4", title: "Recognition That Lands", tag: "Psych. safety", desc: "Make recognition specific, timely and tied to behaviours you want to see more of.", duration: "6 min" },
];

export const LEADER_NUDGES = [
  { id: "n1", tone: "amber", title: "Workload balance dipped", body: "Your team's workload balance is 8 points below last month. Consider a priorities review this week." },
  { id: "n2", tone: "teal", title: "Psychological safety is strong", body: "Safety scores are consistently high — a good moment to raise a stretch topic." },
  { id: "n3", tone: "violet", title: "Your coaching session is Thursday", body: "A good place to bring the workload pattern you're seeing." },
];

/* Team balance dimensions (aggregated, 0–100). Shown only when group size >= MIN_GROUP. */
export const MIN_GROUP = 5;

export const BALANCE_DIMENSIONS = [
  { key: "focus", label: "Focus" },
  { key: "energy", label: "Energy" },
  { key: "workload", label: "Workload" },
  { key: "safety", label: "Psych. safety" },
  { key: "recovery", label: "Recovery" },
  { key: "connection", label: "Connection" },
];

export const BALANCE_PERIODS = {
  "4w": {
    label: "Last 4 weeks",
    weeks: ["W1", "W2", "W3", "W4"],
    series: {
      focus: [66, 69, 71, 74],
      energy: [70, 68, 71, 74],
      workload: [74, 70, 66, 62],
      safety: [78, 80, 80, 81],
      recovery: [60, 58, 61, 63],
      connection: [69, 70, 72, 72],
    },
  },
  "12w": {
    label: "Last 12 weeks",
    weeks: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"],
    series: {
      focus: [58, 60, 61, 63, 62, 65, 66, 67, 66, 69, 71, 74],
      energy: [62, 63, 60, 64, 66, 67, 70, 68, 70, 71, 72, 74],
      workload: [72, 74, 75, 73, 76, 75, 74, 73, 70, 66, 64, 62],
      safety: [74, 75, 75, 76, 77, 78, 78, 79, 80, 80, 81, 81],
      recovery: [55, 54, 57, 56, 58, 59, 60, 58, 61, 62, 62, 63],
      connection: [64, 65, 66, 66, 68, 69, 69, 70, 71, 72, 72, 72],
    },
  },
};

/* Aggregated by sub-group (never individuals). `size` drives the privacy threshold. */
export const BALANCE_GROUPS = [
  { name: "Whole team", size: 14, values: { focus: 74, energy: 74, workload: 62, safety: 81, recovery: 63, connection: 72 } },
  { name: "Platform", size: 6, values: { focus: 77, energy: 72, workload: 58, safety: 84, recovery: 60, connection: 74 } },
  { name: "Mobile", size: 5, values: { focus: 70, energy: 78, workload: 68, safety: 79, recovery: 66, connection: 70 } },
  { name: "QA & Release", size: 3, values: { focus: 0, energy: 0, workload: 0, safety: 0, recovery: 0, connection: 0 } },
];

/* ---------------- Admin · Users ---------------- */

export const USER_DEPARTMENTS = ["Design", "Engineering", "Platform Eng.", "Sales", "Support", "Marketing", "Finance", "People Ops"];
export const USER_ROLES = ["Employee", "Leader", "Administrator"];
export const USER_STATUSES = ["Active", "Invited", "Inactive", "Suspended"];

const U = (name, dept, role, status, lastActive, lastActiveDays, joined, completion) => ({
  id: name.toLowerCase().replace(/[^a-z]+/g, "."),
  name, dept, role, status, lastActive, lastActiveDays, joined, completion,
  email: `${name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z ]/g, "").replace(/ +/g, ".")}@acme.com`,
});

export const USER_DIRECTORY = [
  U("Sophie van Dijk", "Design", "Employee", "Active", "Today", 0, "2025-11-04", 68),
  U("Thomas de Vries", "Platform Eng.", "Leader", "Active", "Today", 0, "2025-09-12", 91),
  U("Wei Zhang", "Sales", "Employee", "Active", "Yesterday", 1, "2026-01-19", 54),
  U("Ines Fontaine", "Support", "Leader", "Invited", "—", 999, "2026-08-20", 0),
  U("Tomás Silva", "Engineering", "Employee", "Inactive", "12 days ago", 12, "2025-10-02", 23),
  U("Lotte Jansen", "People Ops", "Administrator", "Active", "Today", 0, "2025-06-01", 100),
  U("Amara Okafor", "Marketing", "Employee", "Active", "2 days ago", 2, "2026-02-11", 77),
  U("Daan Bakker", "Engineering", "Leader", "Active", "Today", 0, "2025-07-23", 88),
  U("Priya Nair", "Finance", "Employee", "Active", "Yesterday", 1, "2026-03-03", 61),
  U("Lucas Meijer", "Sales", "Leader", "Active", "3 days ago", 3, "2025-08-14", 72),
  U("Emma Visser", "Design", "Employee", "Suspended", "45 days ago", 45, "2025-12-09", 12),
  U("Noah Smit", "Platform Eng.", "Employee", "Active", "Today", 0, "2026-04-27", 49),
  U("Fatima Haddad", "Support", "Employee", "Active", "Yesterday", 1, "2026-01-08", 83),
  U("Jonas Peeters", "Engineering", "Employee", "Invited", "—", 999, "2026-08-28", 0),
  U("Mila Dekker", "Marketing", "Leader", "Active", "4 days ago", 4, "2025-10-30", 66),
  U("Hugo Janssen", "Finance", "Employee", "Inactive", "30 days ago", 30, "2025-11-18", 18),
  U("Sara Lindqvist", "People Ops", "Administrator", "Active", "Yesterday", 1, "2025-06-01", 95),
  U("Mehmet Yilmaz", "Sales", "Employee", "Active", "Today", 0, "2026-05-12", 57),
  U("Chloé Martin", "Design", "Leader", "Active", "2 days ago", 2, "2025-09-29", 80),
  U("Bram Willems", "Platform Eng.", "Employee", "Active", "Today", 0, "2026-02-23", 74),
  U("Anika Rao", "Engineering", "Employee", "Invited", "—", 999, "2026-08-30", 0),
  U("Felix Mulder", "Support", "Employee", "Inactive", "21 days ago", 21, "2026-03-16", 31),
  U("Zoë Hendriks", "Marketing", "Employee", "Active", "Yesterday", 1, "2026-06-01", 45),
  U("Omar Said", "Finance", "Leader", "Active", "5 days ago", 5, "2025-08-04", 69),
];
