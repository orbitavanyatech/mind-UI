import { PlayCircle, Dumbbell, FileText, Headphones } from "lucide-react";

/* Shared look-up for training item types so cards and the detail view stay consistent. */
export const TYPE_META = {
  video: { label: "Video", icon: PlayCircle, cta: "Watch now" },
  exercise: { label: "Exercise", icon: Dumbbell, cta: "Start exercise" },
  article: { label: "Article", icon: FileText, cta: "Read article" },
  audio: { label: "Audio", icon: Headphones, cta: "Listen now" },
};

/* Static class maps (Tailwind can't see dynamically-built names). */
export const TOPIC_STYLES = {
  teal: { chip: "bg-teal-50 text-teal-700 ring-teal-600/20", active: "bg-teal-600 text-white", icon: "bg-teal-50 text-teal-600" },
  amber: { chip: "bg-amber-50 text-amber-700 ring-amber-600/20", active: "bg-amber-500 text-white", icon: "bg-amber-50 text-amber-600" },
  indigo: { chip: "bg-indigo-50 text-indigo-700 ring-indigo-600/20", active: "bg-indigo-700 text-white", icon: "bg-indigo-50 text-indigo-600" },
  violet: { chip: "bg-violet-50 text-violet-700 ring-violet-600/20", active: "bg-violet-600 text-white", icon: "bg-violet-50 text-violet-600" },
};
