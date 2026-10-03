/* Auto-generated during modernization refactor of Mind Elevate */

import React from "react";
import {
  Check
} from "lucide-react";
import {
  Badge,
  Card,
  Button,
  EmptyPagePlaceholder,
  PrivacyNotice
} from "../../components/ui/Primitives";

export const PulsePage = () => (
  <EmptyPagePlaceholder title="Pulse Surveys" desc="Quick, anonymous check-ins that help your organization support its people.">
    <PrivacyNotice text="Your individual answers are never linked to your name. Only aggregated, team-level results are shared with your organization." />
    <Card className="mt-6 max-w-xl">
      <Badge color="amber" className="mb-3">2 min · Anonymous</Badge>
      <p className="font-semibold text-slate-900 mb-4">This Week's Pulse Check</p>
      <p className="text-sm text-slate-600 mb-4">How manageable did your workload feel this week?</p>
      <div className="flex gap-2 mb-6">
        {["😞", "😕", "😐", "🙂", "😄"].map((e, i) => (
          <button key={i} className="flex-1 py-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50 text-xl">{e}</button>
        ))}
      </div>
      <Button className="w-full">Submit Anonymously</Button>
    </Card>
  </EmptyPagePlaceholder>
);

