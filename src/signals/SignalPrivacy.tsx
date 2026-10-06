/* One source of truth for what a direct signal is, so the Send page, the leader inbox, each signal card
   and the Leader Experience page all say the same four things:
     1. the employee's name is attached
     2. it is NOT anonymous
     3. only the relevant leader and the employee can see it
     4. it is never part of anonymous company, team or group insights
   Plus the rule for categories: topics only organise the leader's inbox, they are never scores. */

import { BarChart3, EyeOff, Lock, UserRound, type LucideIcon } from "lucide-react";

type Viewer = "sender" | "leader";

const points = (viewer: Viewer, other: string): { icon: LucideIcon; title: string; body: string }[] => {
  const sender = viewer === "sender";
  return [
    {
      icon: UserRound,
      title: sender ? "Your name is attached" : `${other}'s name is attached`,
      body: sender ? `${other} sees that this message is from you.` : "Every signal arrives with the sender's name and job title.",
    },
    {
      icon: EyeOff,
      title: "It is not anonymous",
      body: "For anonymous feedback, Pulse Surveys is the place. A direct signal is never anonymous.",
    },
    {
      icon: Lock,
      title: sender ? `Only ${other} and you can see it` : `Only you and ${other} can see it`,
      body: "Not other leaders, company administrators or the platform team.",
    },
    {
      icon: BarChart3,
      title: "Never part of anonymous insights",
      body: "It is never counted or included in anonymous company, team or group insights, reports or exports.",
    },
  ];
};

export const SignalPrivacyPanel = ({ viewer, otherName }: { viewer: Viewer; otherName: string }) => (
  <section aria-label="How direct signals work" className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
    <p className="text-sm font-semibold text-indigo-950 mb-3">Direct signals are named, not anonymous</p>
    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
      {points(viewer, otherName).map(({ icon: Icon, title, body }) => (
        <li key={title} className="flex items-start gap-2.5">
          <Icon className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-indigo-900 leading-relaxed"><span className="font-semibold">{title}.</span> {body}</p>
        </li>
      ))}
    </ul>
  </section>
);

/** Compact reminder shown on every individual signal. */
export const SignalVisibilityTag = ({ viewer, otherName }: { viewer: Viewer; otherName: string }) => (
  <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
    <Lock className="w-3 h-3 shrink-0 text-slate-400" aria-hidden="true" />
    {viewer === "sender"
      ? `Sent with your name · not anonymous · visible only to you and ${otherName} · never in anonymous insights`
      : `Named, not anonymous · visible only to you and ${otherName} · never in anonymous insights`}
  </p>
);

/** Shown next to every topic picker / filter. */
export const TOPIC_NOTE = {
  sender: (leader: string) => `Topics only help sort ${leader}'s inbox. They are not scores or ratings, and nothing is calculated from them.`,
  leader: "Topics only help you sort this inbox. They are not wellbeing or performance scores, and nothing is counted or reported per topic.",
};
