/* Fails the build if anything outside the signal screens can reach direct-signal data.
   Run: npm run check:signals */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ALLOWED = new Set([
  "src/signals/SignalsContext.tsx",
  "src/signals/SignalPrivacy.tsx",
  "src/views/employee/SendSignalPage.tsx",
  "src/views/employee/LeaderSignalsInbox.tsx",
  "src/views/employee/LeaderExperiencePage.tsx", // the leader's own inbox preview
  "src/components/layout/Sidebar.tsx",           // leader's own "needs reply" badge
  "src/app/(employee)/layout.tsx",               // the only provider
]);
const FORBIDDEN_NAMES = [/\bSIGNAL_TOPICS\b/, /\bDirectSignal\b/];

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
let bad = 0;
for (const file of walk("src").filter((f) => /\.(ts|tsx)$/.test(f))) {
  const rel = relative(".", file);
  if (ALLOWED.has(rel)) continue;
  const text = readFileSync(file, "utf8");
  if (/@\/signals\//.test(text) || FORBIDDEN_NAMES.some((r) => r.test(text))) { console.error(`✗ ${rel} touches direct-signal data`); bad++; }
}
if (bad) process.exit(1);
console.log("✓ Direct signals are isolated from company/platform/reporting code.");
