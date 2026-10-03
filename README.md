# Mind Elevate

The mental performance platform for modern organizations — a monthly focus theme for every
employee, confidential 1:1 coaching for leaders, and a private, aggregated wellbeing view for
administrators.

This is a front-end demo/prototype built with React + Vite + Tailwind CSS. Role switching
(Employee / Leader / Administrator) is simulated entirely client-side for demo purposes — see the
floating role switcher in the bottom-right corner once you're signed in.

## Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** — custom design tokens (see `tailwind.config.js`)
- **Recharts** for data visualization
- **lucide-react** for icons
- **vite-plugin-pwa** for installable/offline support

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
```

## Project structure

```
src/
├── main.jsx                 # entry point
├── App.jsx                  # root: view state (landing/login/app) + dashboard shell
├── router.jsx                # maps role + active nav key -> page component
├── index.css                 # global styles, fonts, design-system utilities
├── config/
│   └── nav.js                 # per-role navigation config + role metadata/colors
├── data/
│   ├── mockData.js            # core mock/demo data used across the app
│   └── featureData.js         # data for Personal Space, Leader & Users features
├── components/
│   ├── ui/
│   │   ├── Primitives.jsx     # Badge, Card, Button, ProgressBar, ProgressRing, etc.
│   │   └── Table.jsx          # simple data table + status badge helper
│   └── layout/
│       ├── Sidebar.jsx        # collapsible role-aware side nav
│       ├── Header.jsx         # top bar (search, notifications, account)
│       └── MobileTabBar.jsx   # bottom tab bar for small screens
└── pages/
    ├── marketing/
    │   ├── LandingPage.jsx    # public marketing site
    │   └── LoginPage.jsx      # sign-in / demo role picker
    ├── employee/               # dashboard + all employee & leader-facing pages
    │   ├── EmployeeDashboard.jsx
    │   ├── ThemePage.jsx
    │   ├── LibraryPage.jsx
    │   ├── ProgressPage.jsx
    │   ├── SessionsPage.jsx
    │   ├── CalendarPage.jsx
    │   ├── PulsePage.jsx
    │   ├── ProfilePage.jsx
    │   ├── CoachingPage.jsx    # leader-only confidential coaching
    │   ├── PersonalSpacePage.jsx    # Weekly Focus + Topic Discovery (employee & leader)
    │   ├── TrainingItemPage.jsx     # drill-down detail for a training item
    │   ├── LeaderExperiencePage.jsx # leader-only dashboard
    │   └── TeamBalancePage.jsx      # leader-only aggregated team pattern visualization
    └── admin/                   # organization administrator console
        ├── AdminDashboard.jsx
        ├── CompaniesPage.jsx
        ├── UsersPage.jsx
        ├── ContentLibraryPage.jsx
        ├── CreateContentPage.jsx
        ├── ThemesAdminPage.jsx
        ├── AdminSessionsPage.jsx
        ├── RecordingsPage.jsx
        ├── AdminPulsePage.jsx
        ├── ReportsPage.jsx
        └── SettingsPage.jsx
```

## Design system

Mind Elevate's visual identity centers on an "elevate" motif — concentric progress rings and
upward gradients — over a warm, editorial neutral palette rather than a cool corporate gray:

| Token | Role | Base shade |
|---|---|---|
| `teal` (jade) | Primary brand — CTAs, progress, focus | `#0F8E72` |
| `indigo` (dusk indigo) | Dark surfaces (hero, sidebar) + org/admin accent | `#14132E` / `#4A47B0` |
| `violet` (coach plum) | Leader role + confidential coaching | `#7B3AA3` |
| `amber` (ember gold) | Monthly theme / momentum accent | `#B06F0F` |
| `slate` (graphite) | Warm neutral text & surfaces | `#1E211C` → `#F8F7F5` |

Typography pairs **Space Grotesk** (display) with **Manrope** (body/UI) — see `src/index.css`
and the `fontFamily` extension in `tailwind.config.js`. Both load from Google Fonts; swap in
self-hosted files there if you need to work offline or avoid the external request.

Dynamic role-based color classes (e.g. `bg-${roleColor}-600`) are pre-registered in the Tailwind
`safelist` in `tailwind.config.js` — extend that pattern if you introduce new dynamic shades.

## Notes

- All data is mocked in `src/data/mockData.js` — there is no backend.
- Privacy/aggregation messaging throughout the admin views is illustrative copy, not a real
  data-governance implementation.
