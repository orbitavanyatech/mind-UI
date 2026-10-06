# Mind Elevate

The mental performance platform for modern organizations — a monthly focus theme for every
employee, confidential 1:1 coaching for leaders, and a private, aggregated wellbeing view for
administrators.

This is a front-end demo/prototype. There is no backend: data lives in `src/data/mockData.ts`, and
"signing in" just records which role you picked.

## Roles

| Role | Area | What they do |
|---|---|---|
| **Employee** | `/dashboard`, `/library`, … | Learner app: monthly theme, library, reflections, sessions |
| **Leader** | same as employee + leader pages | Has **every employee feature** (all employee pages, badges and certificates), plus leadership coaching and the leader experience (named direct signals sent to them). **Never** sees anonymous team, group or company insights |
| **Company Administrator** | `/company/*` | Runs **one company's workforce**: places people, manages departments and teams, schedules sessions, sees anonymous aggregated reports and team balance (`/company/team-balance`). Sees their plan/seats **read-only**. |
| **Platform Administrator** | `/platform/*` | Mind Elevate operator for this **B2B platform**: provisions companies, manages **subscriptions** (plan, seats, billing, trials, suspension), owns the content catalog and monthly themes. |

The two administrators are deliberately separate: the platform admin never manages individual people or
teams, and the company admin never sees other companies or can change their own subscription. Neither can
see individual reflections, coaching notes or survey answers.

## Privacy rule: who sees what

Anonymous team, group and company insights are available **only** to the Company Administrator / senior management and the platform. An ordinary team leader never sees anonymous aggregated insights; a leader sees only **named direct signals explicitly sent to them** (`src/signals/SignalsContext.tsx`). Aggregate data lives in `src/company/*` and is only imported by `/company/*` screens.

**Small groups:** a group with fewer than 5 *active* people never shows any anonymous figure (charts, tables, CSV, Team Balance). Teams are never reported at all. If the people left out of the breakdown (small groups + unassigned) total fewer than 5, the next-smallest department is withheld too, so a hidden group can't be recovered as "company total minus the others". All of this is enforced in `computeInsights` (`src/company/insights.ts`); Team Balance values are only reachable through `balanceFor`, which returns nothing for withheld groups.

### Direct signals workflow (`/signals`)

- **Employee** sends a named signal to their own leader: topic, message (10–600 chars), optional "I'd like to talk" / "time-sensitive", and a required consent tick ("sent with my name to <leader> only"). They see its status (Sent → Seen → Replied → Resolved), can follow up (which reopens a resolved one) or withdraw it.
- **Leader** gets an inbox: *Needs response / Waiting on them / Resolved*, a reply-time guide (3 days, 1 if time-sensitive, overdue flagged), reply starters, mark resolved/reopen, and a private note only they see. Opening a signal (not merely loading the page) marks it Seen for the sender. A badge in the sidebar counts signals that need a reply.
- **Access:** the context exposes only `inbox` (addressed to the signed-in leader) and `sent` (written by the signed-in person); every mutation re-checks sender/recipient. The provider exists only in the learner app, so company and platform administrators never receive it. Signals are never counted per team, reported or exported. Demo storage is localStorage; a backend must enforce the same rules.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** (strict)
- **Plain CSS with design tokens** — CSS custom properties in `src/styles/tokens.css` (no Tailwind)
- **Recharts** for charts · **lucide-react** for icons
- **next/font** (Inter + Outfit), `app/manifest.ts` for the web app manifest

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run build && npm start
```

Requires Node 20.9+.

## Routes

| URL | Screen | Who |
|---|---|---|
| `/` , `/login` | Marketing site, role picker | public |
| `/dashboard`, `/theme`, `/library`, `/reflection`, `/progress`, `/achievements`, `/sessions`, `/calendar`, `/pulse`, `/profile` | Employee & leader app | employee, leader |
| `/coaching` | Confidential coaching | leader only |
| `/library/[moduleId]` | Module details | employee, leader |
| `/library/[moduleId]/[lessonId]` | Video / exercise / questions (chosen by the lesson's `type`) | employee, leader |
| `/achievements/[certificateId]` | Certificate | employee, leader |
| `/sessions/[sessionId]` | Session details | employee, leader |
| `/reflection?module=…&lesson=…` | Reflection pre-linked to a module / lesson | employee, leader |
| `/company/*` | `dashboard`, `people`, `departments`, `teams`, `sessions`, `pulse`, `reports`, `settings` | company_admin |
| `/platform/*` | `dashboard`, `companies`, `subscriptions`, `content`, `create`, `themes`, `recordings`, `settings` | platform_admin |

Users are redirected to their own area if they open another one, and to `/login` when signed out.

### Company administrator — people, departments, teams

- **People**: invite, set role (Employee / Leader / Company Admin), place in a department and team inline, deactivate/reactivate, remove (two-step confirm). Filter by status/department; "Needs placement" surfaces unassigned people.
- **Departments**: create, rename, name a head, delete (deletes its teams, leaves people unassigned — nobody is removed from the company).
- **Teams**: belong to one department; name a lead, add/remove members.
- **Sessions**: schedule a live session for everyone, one department or one team. "Eligible" is the number of *active* people currently in that audience, so it follows every placement change. Deleting a department/team **cancels** sessions aimed at it instead of silently widening the audience.
- **Pulse / Reports / Dashboard**: aggregated numbers derived from the live org structure (a new department or a person moved between departments shows up immediately). Reports stop at department level and **withhold any group with fewer than 5 active people** — the chart, table and CSV export all use the same rule (`src/company/insights.ts`). Invited and deactivated people never count.
- Rules live in `src/company/OrgContext.tsx`: a team always belongs to one department; moving a person to another department clears their team; leaving a department/team vacates any head/lead seat they held; **the last active Company Admin can't be demoted, deactivated or removed** (the company would be locked out — the controls are disabled with an explanation).

### Platform administrator — companies, subscriptions and the catalog

- **Companies**: provision (with the first company admin's email), suspend/reactivate.
- **Subscriptions**: plan catalog, MRR/ARR, per-company plan / contracted seats / billing cycle, convert trial → paid, suspend. Rules in `src/platform/PlatformContext.tsx`: MRR = seats × plan list price (annual billing discounted); seats can't go below seats in use or below the plan minimum; trial and suspended companies don't bill.
- **Content Library / Create / Themes** share one catalog in `PlatformContext`: content published on *Create* appears at the top of the *Library* (filter by type, publish/unpublish); *Themes* can be created, edited and activated. Exactly one theme is Active at a time — activating one archives the running one — and archived themes are read-only.

## Project structure

```
src/
├── app/                      # routes (App Router)
│   ├── layout.tsx            # fonts, metadata, providers
│   ├── manifest.ts           # PWA manifest
│   ├── page.tsx, login/      # marketing
│   ├── (employee)/           # employee + leader area  (layout = <AppShell scope="employee">)
│   ├── company/              # company administrator    (layout = <AppShell scope="company"> + <OrgProvider>)
│   └── platform/             # platform administrator   (layout = <AppShell scope="platform"> + <PlatformProvider>)
├── views/                    # screen components (client components), one per page
│   ├── marketing/ employee/ company/ platform/
├── components/
│   ├── layout/               # AppShell, Sidebar, Header, MobileTabBar, RoleGate
│   └── ui/                   # Primitives, Table
├── auth/AuthContext.tsx      # demo role "session" (localStorage)
├── company/OrgContext.tsx    # company people / departments / teams / sessions state + placement rules
├── company/insights.ts       # privacy-safe aggregation (min group size 5), session audiences, CSV export
├── platform/PlatformContext.tsx # companies, subscriptions, content catalog + themes; billing/theme rules
├── i18n/                     # EN/NL dictionary (translations.ts + screens.ts) + useLanguage() (t, tx, tOr)
├── config/                   # nav.ts (per-role nav), routes.ts (URL helpers, page titles)
├── data/mockData.ts          # all demo data
└── types/index.ts            # shared types
```

`src/app/**/page.tsx` files are thin server components: they look up the module / lesson /
certificate / session for the URL (404 if unknown) and render the matching client view from
`src/views`.

## Notes

- **i18n:** every screen is translated (EN/NL). Chrome text lives in `translations.ts`, screen text in
  `screens.ts`. Demo-data values (statuses, plans, roles, session types…) are translated with
  `tOr(`data.<group>.${slug(value)}`, value)`, which falls back to the raw value. Names, module/lesson
  titles and other demo content in `mockData.ts` stay in English.
- `t("key")` returns a string; use `tx<T>("key")` for list/object nodes (e.g. the landing
  page's feature list). The stored/browser language is applied after hydration.
- **Styling:** `src/styles/` holds `tokens.css` (colors, type, radius, shadow, spacing as CSS variables),
  `base.css` (reset), `components.css` (e.g. `.form-input`) and `utilities.css` (single-purpose classes
  such as `.p-4`, `.bg-teal-600`; every value references a token). Restyle by editing `tokens.css`.
- **Dynamic classes** such as `bg-${color}-600` are plain CSS now: make sure the class exists in
  `utilities.css`. There is no build step that generates it, so add new ones by hand.
- **Translation namespaces:** new admin screens use `company.*` and `platform.*` (EN + NL). The shared
  `admin.*` keys (table columns, settings labels, charts) are still used by screens that moved over.
- **State is in memory.** People, departments, teams, sessions, companies, subscriptions, content and themes reset on a full page
  reload; the provider functions are the seam to replace with API calls.
- **The two admin areas don't share state yet.** Because there's no backend, the platform admin suspending a company or changing its seats is not reflected in the company admin's view (and invites aren't checked against contracted seats). With a real backend both would read the same company record.
- **Auth is a demo.** The role is kept in `localStorage`, so protected pages render after the
  client reads it. With a real backend, move it to cookies and redirect in `proxy.ts`.
- **Offline/PWA:** the manifest is kept, but the Vite service worker (`vite-plugin-pwa`) is not
  ported. Add Serwist (or similar) if offline support is needed.
