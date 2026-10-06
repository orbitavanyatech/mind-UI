import { MODULES } from "@/data/mockData";
import type { Role, Scope } from "@/types";

/* Single source of truth for URLs. Employees and leaders share the top-level
   routes; the company administrator lives under /company and the platform administrator under /platform. */

export const ROUTES = {
  landing: "/",
  theme: "/theme",
  progress: "/progress",
  calendar: "/calendar",
  pulse: "/pulse",
  coaching: "/coaching",
  profile: "/profile",
  login: "/login",
  dashboard: "/dashboard",
  achievements: "/achievements",
  library: "/library",
  sessions: "/sessions",
  reflection: "/reflection",
  personalSpace: "/personal-space",
  leaderExperience: "/leader-experience",
  signals: "/signals",
  /* Company administrator — manages one company's people, departments and teams. */
  company: {
    dashboard: "/company/dashboard",
    people: "/company/people",
    departments: "/company/departments",
    teams: "/company/teams",
    teamBalance: "/company/team-balance",
    sessions: "/company/sessions",
    pulse: "/company/pulse",
    reports: "/company/reports",
    settings: "/company/settings",
  },
  /* Platform administrator — Mind Elevate operator: companies and subscriptions. */
  platform: {
    dashboard: "/platform/dashboard",
    companies: "/platform/companies",
    subscriptions: "/platform/subscriptions",
    requests: "/platform/requests",
    content: "/platform/content",
    create: "/platform/create",
    themes: "/platform/themes",
    recordings: "/platform/recordings",
    settings: "/platform/settings",
  },
  module: (moduleId: string) => `/library/${moduleId}`,
  lesson: (moduleId: string, lessonId: string) => `/library/${moduleId}/${lessonId}`,
  certificate: (certificateId: string) => `/achievements/${certificateId}`,
  session: (sessionId: string) => `/sessions/${sessionId}`,
  /** Private reflection, optionally pre-linked to a module / lesson. */
  reflectionFor: (moduleId?: string, lessonId?: string) => {
    const qs = new URLSearchParams();
    if (moduleId) qs.set("module", moduleId);
    if (lessonId) qs.set("lesson", lessonId);
    const s = qs.toString();
    return s ? `/reflection?${s}` : "/reflection";
  },
} as const;

export const homeFor = (role: Role) =>
  role === "platform_admin" ? ROUTES.platform.dashboard : role === "company_admin" ? ROUTES.company.dashboard : ROUTES.dashboard;
export const scopeFor = (role: Role): Scope =>
  role === "platform_admin" ? "platform" : role === "company_admin" ? "company" : "employee";

/* Maps a pathname to the translation key of its page title (`pageTitles.*`). */
const COMPANY_TITLES: Record<string, string> = {
  dashboard: "dashboard",
  people: "people",
  departments: "departments",
  teams: "teams",
  "team-balance": "teamBalance",
  sessions: "adminSessions",
  pulse: "adminPulse",
  reports: "reports",
  settings: "settings",
};

const PLATFORM_TITLES: Record<string, string> = {
  dashboard: "dashboard",
  companies: "companies",
  subscriptions: "subscriptions",
  content: "content",
  create: "create",
  themes: "themes",
  recordings: "recordings",
  requests: "requests",
  settings: "settings",
};

export function pageTitleKey(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "company") {
    return `pageTitles.${COMPANY_TITLES[segments[1] ?? "dashboard"] ?? "dashboard"}`;
  }
  if (segments[0] === "platform") {
    return `pageTitles.${PLATFORM_TITLES[segments[1] ?? "dashboard"] ?? "dashboard"}`;
  }

  const [section, id, lessonId] = segments;
  if (section === "library" && id) {
    if (!lessonId) return "pageTitles.moduleDetails";
    const lesson = MODULES[id]?.lessons.find((l) => l.id === lessonId);
    if (lesson?.type === "video") return "pageTitles.videoPlayer";
    if (lesson?.type === "exercise") return "pageTitles.exercise";
    return "pageTitles.questions";
  }
  if (section === "sessions" && id) return "pageTitles.sessionDetails";
  if (section === "achievements" && id) return "pageTitles.certificateDetails";
  const PAGE_TITLE_OVERRIDES: Record<string, string> = {
    "personal-space": "personalSpace",
    "leader-experience": "leaderExperience",
  };
  return `pageTitles.${PAGE_TITLE_OVERRIDES[section ?? ""] ?? section ?? "dashboard"}`;
}

/** A nav item is active on its own route and on any nested detail route. */
export const isNavActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);
