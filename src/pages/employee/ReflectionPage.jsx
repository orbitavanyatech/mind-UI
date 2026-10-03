import React, { useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowUpRight, BookOpen, Check, Clock3, Feather,
  LockKeyhole, NotebookPen, Search, ShieldCheck, Sparkles, X,
} from "lucide-react";
import { BackLink, Button, Card, MenuSelect } from "../../components/ui/Primitives";
import { PRIVATE_REFLECTIONS } from "../../data/mockData";
import { useNavigation } from "../../navigation/NavigationContext";

const MOODS = [
  { emoji: "\u{1F614}", label: "Heavy" },
  { emoji: "\u{1F615}", label: "Unsettled" },
  { emoji: "\u{1F610}", label: "Steady" },
  { emoji: "\u{1F642}", label: "Good" },
  { emoji: "\u{1F604}", label: "Great" },
];

const PROMPTS = [
  "What felt important today?",
  "What would you like to try next?",
  "What are you carrying that you can set down?",
];

const moodForEntry = (entry) => MOODS.find((mood) => mood.emoji === entry.mood)?.label || "Reflection";

export const ReflectionPage = () => {
  const { params, canGoBack, back } = useNavigation();
  const [entries, setEntries] = useState(PRIVATE_REFLECTIONS);
  const [text, setText] = useState("");
  const [mood, setMood] = useState(null);
  const [saved, setSaved] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All entries");
  const [expanded, setExpanded] = useState(null);

  const relatedTo = params.lessonTitle || params.moduleName || null;
  const filteredEntries = useMemo(() => entries.filter((entry) => {
    const matchesQuery = `${entry.relatedTo} ${entry.text}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesMood = filter === "All entries" || moodForEntry(entry) === filter;
    return matchesQuery && matchesMood;
  }), [entries, filter, query]);

  const save = () => {
    if (!text.trim()) return;
    const date = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date());
    const entry = {
      id: `r-${Date.now()}`,
      date,
      mood: mood === null ? MOODS[2].emoji : MOODS[mood].emoji,
      relatedTo: relatedTo || "A moment for yourself",
      text: text.trim(),
    };
    setEntries((current) => [entry, ...current]);
    setText("");
    setMood(null);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {canGoBack && <BackLink onClick={back}>Back</BackLink>}

      <section className="relative overflow-hidden rounded-3xl bg-indigo-950 px-6 py-7 text-white shadow-sm sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-14 -top-24 h-72 w-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-2 -top-12 h-48 w-48 rounded-full border border-white/10" />
        <div className="relative max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-indigo-100">
            <LockKeyhole className="h-3.5 w-3.5" /> Just for you
          </div>
          <h1 className="mpp-display text-3xl font-bold tracking-tight sm:text-4xl">Make room to reflect.</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-indigo-100/80 sm:text-base">
            A quiet place to notice what’s changing, capture what matters, and come back to your own words when you need them.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-indigo-100/75">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-teal-300" /> Private to you</span>
            <span className="inline-flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-teal-300" /> {entries.length} {entries.length === 1 ? "entry" : "entries"} in your journal</span>
          </div>
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)]">
        <Card className="!p-0 overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-7">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
              <Feather className="h-4 w-4" /> Your space
            </div>
            <h2 className="mpp-display mt-2 text-xl font-bold text-slate-900">What’s on your mind?</h2>
            {relatedTo && <p className="mt-1 text-sm text-slate-500">A reflection on <span className="font-medium text-slate-700">{relatedTo}</span></p>}
          </div>

          <div className="px-5 py-5 sm:px-7 sm:py-6">
            <p className="mb-3 text-sm font-medium text-slate-700">How are you feeling right now?</p>
            <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Choose how you are feeling">
              {MOODS.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  role="radio"
                  aria-checked={mood === index}
                  aria-label={item.label}
                  onClick={() => setMood(index)}
                  className={`flex min-h-[66px] flex-col items-center justify-center gap-1 rounded-xl border text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${mood === index ? "border-teal-500 bg-teal-50 text-teal-800 ring-1 ring-teal-500" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}
                >
                  <span className="text-xl leading-none" aria-hidden="true">{item.emoji}</span>
                  <span className="text-[10px] font-medium sm:text-xs">{item.label}</span>
                </button>
              ))}
            </div>

            <label htmlFor="reflection-text" className="sr-only">Write your reflection</label>
            <textarea
              id="reflection-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={7}
              placeholder="Start wherever you are. This space is yours."
              className="mt-5 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
            />
            <div className="mt-3 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p aria-live="polite" className={`inline-flex items-center gap-1.5 text-xs ${saved ? "text-teal-700" : "text-slate-500"}`}>
                {saved ? <Check className="h-4 w-4" /> : <LockKeyhole className="h-3.5 w-3.5" />}
                {saved ? "Saved to your private journal" : "Only you can see what you write here"}
              </p>
              <Button size="md" icon={NotebookPen} onClick={save} disabled={!text.trim()} className="w-full sm:w-auto">
                Save reflection
              </Button>
            </div>
          </div>
        </Card>

        <aside className="space-y-4">
          <Card className="!p-5 sm:!p-6">
            <div className="flex items-center gap-2 text-teal-700"><Sparkles className="h-4 w-4" /><p className="text-xs font-semibold uppercase tracking-[0.12em]">Need a starting point?</p></div>
            <p className="mt-2 text-sm text-slate-500">There’s no right way to do this. Pick a prompt, or follow your own thread.</p>
            <div className="mt-4 space-y-2">
              {PROMPTS.map((prompt) => (
                <button key={prompt} type="button" onClick={() => setText((current) => current ? `${current}${current.endsWith("\n") ? "" : "\n\n"}${prompt}\n` : `${prompt}\n`)} className="group flex w-full items-start justify-between gap-3 rounded-xl border border-slate-200 px-3.5 py-3 text-left text-sm leading-snug text-slate-700 transition hover:border-teal-200 hover:bg-teal-50/60">
                  <span>{prompt}</span><ArrowDownRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 group-hover:text-teal-700" />
                </button>
              ))}
            </div>
          </Card>
          <div className="flex gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
            <p className="text-xs leading-relaxed text-indigo-900">Your entries belong to you. They’re never shown to your manager, employer, or administrators.</p>
          </div>
        </aside>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">Look back</p>
            <h2 className="mpp-display mt-1 text-xl font-bold text-slate-900">Your journal</h2>
            <p className="mt-1 text-sm text-slate-500">A record of the things you’ve noticed along the way.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your entries" aria-label="Search your entries" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 sm:w-52" />
            </label>
            <MenuSelect className="w-full sm:w-40" value={filter} onChange={setFilter} ariaLabel="Filter entries by mood" options={["All entries", ...MOODS.map((item) => item.label)].map((label) => ({ value: label, label }))} />
          </div>
        </div>

        {filteredEntries.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {filteredEntries.map((entry) => {
              const isExpanded = expanded === entry.id;
              return (
                <Card key={entry.id} className="!p-0 overflow-hidden">
                  <button type="button" onClick={() => setExpanded(isExpanded ? null : entry.id)} aria-expanded={isExpanded} className="w-full p-4 text-left sm:p-5">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 text-xl" aria-label={moodForEntry(entry)}>{entry.mood}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-sm font-semibold text-slate-900">{entry.relatedTo}</span>
                          <span className="text-slate-300" aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500"><Clock3 className="h-3 w-3" />{entry.date}</span>
                        </div>
                        <p className={`mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600 ${isExpanded ? "" : "line-clamp-3"}`}>{entry.text}</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal-700">{isExpanded ? "Show less" : "Read entry"}{isExpanded ? <ArrowDownRight className="h-3.5 w-3.5 rotate-180" /> : <ArrowUpRight className="h-3.5 w-3.5" />}</span>
                      </div>
                    </div>
                  </button>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-500"><Search className="h-5 w-5" /></div>
            <p className="mt-3 text-sm font-semibold text-slate-800">{entries.length ? "No entries match that search" : "Your journal starts here"}</p>
            <p className="mt-1 text-sm text-slate-500">{entries.length ? "Try another phrase or mood." : "When you save a reflection, you’ll find it here."}</p>
            {(query || filter !== "All entries") && <button type="button" onClick={() => { setQuery(""); setFilter("All entries"); }} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 hover:text-teal-800"><X className="h-4 w-4" /> Clear filters</button>}
          </div>
        )}
      </section>
    </div>
  );
};
