import type { LucideIcon } from "lucide-react";

/* Four roles:
   - employee / leader     -> the learner app (top-level routes)
   - company_admin         -> manages ONE company: people, departments, teams  (/company/*)
   - platform_admin        -> Mind Elevate operator: companies + subscriptions (/platform/*) */
export type Role = "employee" | "leader" | "company_admin" | "platform_admin";
export type Scope = "employee" | "company" | "platform";
export type Lang = "en" | "nl";

/** Accent colour families that have tokens in src/styles/tokens.css (e.g. --teal-600). */
export type Tone = "teal" | "amber" | "violet" | "indigo" | "slate" | "rose";

export interface User {
  name: string;
  role: Role;
  title: string;
  team: string;
  initials: string;
}

export type LessonType = "video" | "exercise" | "questions";

export interface Lesson {
  id: string;
  type: LessonType;
  title: string;
  duration: string;
  done: boolean;
  videoId?: string;
}

export interface LearningModule {
  id: string;
  name: string;
  path: string;
  color: Tone;
  duration: string;
  description: string;
  progress: number;
  lessons: Lesson[];
}

export interface LearningPath {
  name: string;
  progress: number;
  modules: number;
  color: Tone;
}

export interface LiveSession {
  id: string;
  title: string;
  type: string;
  host: string;
  date: string;
  time: string;
  spots: string;
}

export interface SessionDetail {
  description: string;
  agenda: string[];
  location: string;
  joinUrl: string;
  past: boolean;
}

export interface LessonQuestion {
  id: string;
  prompt: string;
  options?: string[];
  correctIndex?: number;
  freeText?: boolean;
}

export interface PrivateReflection {
  id: string;
  date: string;
  mood: string;
  relatedTo: string;
  text: string;
}

export type BadgeTier = "gold" | "silver" | "bronze";

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  tier: BadgeTier;
  roles: Role[];
  earned: boolean;
  earnedDate?: string;
  progress?: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuedDate: string;
  credentialId: string;
  detail: string;
  color: Tone;
  roles: Role[];
}

export interface UpcomingCertificate {
  id: string;
  title: string;
  progress: number;
  roles: Role[];
}

export type CompanyHealth = "good" | "at_risk" | "suspended";

export interface Company {
  id: string;
  name: string;
  plan: string;
  seats: number;
  seatsUsed: number;
  engagement: number;
  status: string;
  renewal: string;
  health: CompanyHealth;
  mrr: number;
  billing: BillingCycle;
  /** First company administrator invited when the company was provisioned. */
  adminEmail?: string;
}

export type BillingCycle = "Monthly" | "Annual";
export type PlanName = "Starter" | "Growth" | "Enterprise";

export interface Plan {
  name: PlanName;
  /** USD per seat per month, billed monthly. Annual billing is discounted. */
  pricePerSeat: number;
  minSeats: number;
  features: string[];
}

/* ---- Company workspace (managed by a company administrator) ---- */
export type OrgRole = "Employee" | "Leader" | "Company Admin";
/* "Suspended" = access switched off, e.g. someone who has left the company. Reversible. Permanent
   deletion of the account stays a Bebrave action. */
export type PersonStatus = "Active" | "Invited" | "Suspended";

/* One closed-off stretch of someone's placement. Kept when they move, are removed from a placement,
   or their team/department is archived, so history is never lost. */
export interface PlacementRecord {
  departmentId: string | null;
  teamId: string | null;
  /** ISO date the placement ended. */
  until: string;
  reason: "moved" | "removed" | "team_archived" | "department_archived";
}

export interface Person {
  id: string;
  name: string;
  email: string;
  title: string;
  role: OrgRole;
  status: PersonStatus;
  lastActive: string;
  /** null while unassigned */
  departmentId: string | null;
  teamId: string | null;
  /* Per-person learning signals (0-100). They exist only so the company can be reported on
     in aggregate; no screen ever shows them for an individual (see computeInsights). */
  engagement: number;
  completion: number;
  workload: number;
  /** Earlier placements, oldest first. Never shown per person in reports. */
  placementHistory?: PlacementRecord[];
}

/* ---- Account requests: what a Customer Administrator asks Bebrave to do ----
   A Customer Administrator may manage organisational placement and propose a leader, but may not
   create/delete accounts or change system roles. Those changes are requested here and only take effect
   once the platform administrator (Bebrave) approves them — leader status is tied to the Performance
   package and monthly leadership coaching. */
export type RequestKind = "new_user" | "remove_user" | "role_change";
export type RequestStatus = "Pending" | "Approved" | "Declined";

export interface AccountRequest {
  id: string;
  kind: RequestKind;
  personId?: string;
  personName: string;
  email?: string;
  title?: string;
  departmentId?: string | null;
  teamId?: string | null;
  fromRole?: OrgRole;
  toRole?: OrgRole;
  status: RequestStatus;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  headId: string | null;
  /** Set when the department is closed. It leaves the active organisation but its record stays. */
  archivedAt?: string;
}

export interface Team {
  id: string;
  name: string;
  departmentId: string;
  leadId: string | null;
  /** Set when the team is archived. It leaves the active organisation but its record stays. */
  archivedAt?: string;
}

/* ---- Company sessions (scheduled by a company administrator for their own people) ---- */
export type SessionAudience =
  | { kind: "everyone" }
  | { kind: "department"; id: string }
  | { kind: "team"; id: string };

export type CompanySessionStatus = "Scheduled" | "Cancelled";

export interface CompanySession {
  id: string;
  title: string;
  host: string;
  /** ISO date, e.g. 2026-10-14 */
  date: string;
  /** 24h time, e.g. 11:00 */
  time: string;
  audience: SessionAudience;
  status: CompanySessionStatus;
}

/* ---- Platform catalog (owned by the platform administrator) ---- */
export type ContentType = "Course Module" | "Article" | "Live Session";
export type ContentStatus = "Published" | "Scheduled" | "Draft";

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  theme: string;
  status: ContentStatus;
}

export type ThemeStatus = "Active" | "Scheduled" | "Archived";

export interface MonthlyThemeItem {
  id: string;
  /** e.g. "October 2026" */
  month: string;
  title: string;
  status: ThemeStatus;
}
