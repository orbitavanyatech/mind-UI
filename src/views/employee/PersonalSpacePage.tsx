"use client";

import { useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, CheckCircle2, Circle, Clock, Compass, Flame, Search, Sparkles, Target } from "lucide-react";
import { Badge, Button, Card, PrivacyNotice, ProgressBar } from "@/components/ui/Primitives";
import { TOPICS, TRAINING_ITEMS, TYPE_META, WEEKLY_FOCUS } from "@/data/featureData";
import { useRouter } from "next/navigation";

const topicOf = (id: string) => TOPICS.find((t) => t.id === id);
const topicStyles: Record<string, { icon: string; chip: string; active: string }> = {
  teal: { icon: "bg-teal-50 text-teal-600", chip: "bg-teal-50 text-teal-700 ring-teal-600/20", active: "bg-teal-600 text-white" },
  violet: { icon: "bg-violet-50 text-violet-600", chip: "bg-violet-50 text-violet-700 ring-violet-600/20", active: "bg-violet-600 text-white" },
  amber: { icon: "bg-amber-50 text-amber-600", chip: "bg-amber-50 text-amber-700 ring-amber-600/20", active: "bg-amber-600 text-white" },
  indigo: { icon: "bg-indigo-50 text-indigo-600", chip: "bg-indigo-50 text-indigo-700 ring-indigo-600/20", active: "bg-indigo-600 text-white" },
};

type TrainingItem = (typeof TRAINING_ITEMS)[number];

const ItemCard = ({ item, saved, onToggleSave }: { item: TrainingItem; saved: boolean; onToggleSave: (id: string) => void }) => {
  const meta = TYPE_META[item.type];
  const topic = topicOf(item.topic);
  const style = topicStyles[topic?.color ?? "teal"];
  const Icon = meta.icon;

  return (
    <Card className="flex flex-col !p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.icon}`}><Icon className="w-5 h-5" /></div>
        <button type="button" onClick={() => onToggleSave(item.id)} aria-label={saved ? "Remove from saved" : "Save for later"} className="text-slate-400 hover:text-teal-600">
          {saved ? <BookmarkCheck className="w-5 h-5 text-teal-600" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>
      <p className="font-semibold text-slate-900 text-sm leading-snug mb-1">{item.title}</p>
      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{item.summary}</p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-4">
        <span className={`inline-flex rounded-full px-2 py-0.5 ring-1 ring-inset font-medium ${style.chip}`}>{topic?.name}</span>
        <span>{meta.label}</span>
        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{item.duration} min</span>
      </div>
      {item.progress > 0 && item.progress < 100 && <ProgressBar value={item.progress} className="mb-3" />}
      <Button size="sm" variant={item.progress >= 100 ? "outline" : "primary"} className="mt-auto">{item.progress >= 100 ? "Revisit" : item.progress > 0 ? "Continue" : meta.cta}</Button>
    </Card>
  );
};

const WeeklyFocus = ({ saved, onToggleSave }: { saved: Set<string>; onToggleSave: (id: string) => void }) => {
  const [habits, setHabits] = useState(WEEKLY_FOCUS.habits);
  const [mood, setMood] = useState<string | null>(null);
  const done = habits.filter((h) => h.done).length;
  const linked = WEEKLY_FOCUS.linkedItems.map((id) => TRAINING_ITEMS.find((i) => i.id === id)).filter(Boolean) as TrainingItem[];

  return (
    <div className="space-y-6">
      <Card className="!p-0 overflow-hidden">
        <div className="bg-indigo-950 p-6 sm:p-8 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge color="teal">{WEEKLY_FOCUS.week}</Badge>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300"><Flame className="w-4 h-4" />{WEEKLY_FOCUS.streak}-day streak</span>
          </div>
          <h3 className="mpp-display text-2xl font-bold max-w-2xl">{WEEKLY_FOCUS.title}</h3>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">{WEEKLY_FOCUS.why}</p>
          <div className="mt-5 max-w-md">
            <div className="flex justify-between text-xs text-slate-300 mb-1.5"><span>This week&apos;s practice</span><span>{done}/{habits.length} done</span></div>
            <ProgressBar value={Math.round((done / habits.length) * 100)} />
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <p className="font-semibold text-slate-900 mb-1">Your practice</p>
          <p className="text-xs text-slate-500 mb-4">Tick off each step as you go — small and consistent wins.</p>
          <ul className="space-y-2">
            {habits.map((h) => (
              <li key={h.id}>
                <button type="button" onClick={() => setHabits((hs) => hs.map((x) => x.id === h.id ? { ...x, done: !x.done } : x))} className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${h.done ? "border-teal-200 bg-teal-50/60 text-slate-500" : "border-slate-200 hover:bg-slate-50 text-slate-800"}`}>
                  {h.done ? <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" /> : <Circle className="w-5 h-5 text-slate-300 shrink-0" />}
                  <span className={h.done ? "line-through" : ""}>{h.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
        <div className="space-y-5">
          <Card>
            <p className="font-semibold text-slate-900 mb-3">This week</p>
            <div className="flex justify-between">
              {WEEKLY_FOCUS.days.map((d, i) => (
                <div key={`${d.d}-${i}`} className="flex flex-col items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">{d.d}</span>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center ${d.state === "done" ? "bg-teal-600 text-white" : d.state === "today" ? "ring-2 ring-teal-500 text-teal-600" : "bg-slate-100 text-slate-300"}`}>
                    {d.state === "done" ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-3 h-3" />}
                  </span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <p className="font-semibold text-slate-900 mb-1">How is your focus today?</p>
            <p className="text-xs text-slate-500 mb-3">Private to you.</p>
            <div className="flex flex-wrap gap-2">
              {WEEKLY_FOCUS.checkIn.map((m) => <button type="button" key={m} onClick={() => setMood(m)} className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${mood === m ? "bg-teal-600 border-teal-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{m}</button>)}
            </div>
          </Card>
        </div>
      </div>

      <div>
        <p className="font-semibold text-slate-900 mb-3">Supports this week&apos;s focus</p>
        <div className="grid sm:grid-cols-2 gap-5">{linked.map((item) => <ItemCard key={item.id} item={item} saved={saved.has(item.id)} onToggleSave={onToggleSave} />)}</div>
      </div>
    </div>
  );
};

const TopicDiscovery = ({ saved, onToggleSave }: { saved: Set<string>; onToggleSave: (id: string) => void }) => {
  const [topic, setTopic] = useState("all");
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");
  const [onlySaved, setOnlySaved] = useState(false);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TRAINING_ITEMS.filter((i) => (topic === "all" || i.topic === topic) && (type === "all" || i.type === type) && (!onlySaved || saved.has(i.id)) && (!q || i.title.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q)));
  }, [topic, type, query, onlySaved, saved]);
  const recommended = TRAINING_ITEMS.filter((i) => i.recommended).slice(0, 3);
  const browsing = topic !== "all" || type !== "all" || query || onlySaved;

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 flex-1"><Search className="w-4 h-4 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search topics, skills or exercises..." className="bg-transparent text-sm outline-none w-full" aria-label="Search personal space" /></div>
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"><option value="all">All formats</option>{Object.entries(TYPE_META).map(([k, m]) => <option key={k} value={k}>{m.label}</option>)}</select>
          <Button variant={onlySaved ? "subtle" : "outline"} size="sm" icon={Bookmark} onClick={() => setOnlySaved((v) => !v)}>Saved ({saved.size})</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setTopic("all")} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${topic === "all" ? "bg-indigo-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>All topics</button>
          {TOPICS.map((t) => <button type="button" key={t.id} onClick={() => setTopic(t.id)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${topic === t.id ? topicStyles[t.color].active : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{t.name}</button>)}
        </div>
      </Card>
      {!browsing && <div><p className="flex items-center gap-2 font-semibold text-slate-900 mb-3"><Sparkles className="w-4 h-4 text-amber-500" />Picked for you</p><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{recommended.map((item) => <ItemCard key={item.id} item={item} saved={saved.has(item.id)} onToggleSave={onToggleSave} />)}</div></div>}
      <div>
        <p className="font-semibold text-slate-900 mb-3">{browsing ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Browse everything"}</p>
        {results.length === 0 ? <Card className="text-center py-10"><p className="font-semibold text-slate-800 text-sm">Nothing matches yet</p><p className="text-xs text-slate-500 mt-1">Try a different topic or clear your filters.</p></Card> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{results.map((item) => <ItemCard key={item.id} item={item} saved={saved.has(item.id)} onToggleSave={onToggleSave} />)}</div>}
      </div>
    </div>
  );
};

export const PersonalSpacePage = () => {
  const router = useRouter();
  const [tab, setTab] = useState<"weekly" | "discover">("weekly");
  const [saved, setSaved] = useState<Set<string>>(() => new Set(TRAINING_ITEMS.filter((i) => i.saved).map((i) => i.id)));
  const toggleSave = (id: string) => setSaved((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div><p className="text-xs font-semibold tracking-wide uppercase text-teal-600 mb-1">Your space</p><h1 className="mpp-display text-2xl sm:text-3xl font-bold text-slate-900">Personal Space</h1><p className="text-sm text-slate-500 mt-1 max-w-2xl">A private corner for your weekly focus, topic discovery, saved learning and small practices that support your own growth.</p></div>
        <Button variant="outline" onClick={() => router.push("/reflection")} icon={Target}>Private Reflection</Button>
      </div>
      <PrivacyNotice text="Personal Space is private. Your check-ins, saved items and progress are never shared with your manager, HR or administrators." />
      <div className="inline-flex rounded-xl bg-slate-100 p-1" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "weekly"} onClick={() => setTab("weekly")} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${tab === "weekly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}><Target className="w-4 h-4" />Weekly Focus</button>
        <button type="button" role="tab" aria-selected={tab === "discover"} onClick={() => setTab("discover")} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${tab === "discover" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}><Compass className="w-4 h-4" />Topic Discovery</button>
      </div>
      {tab === "weekly" ? <WeeklyFocus saved={saved} onToggleSave={toggleSave} /> : <TopicDiscovery saved={saved} onToggleSave={toggleSave} />}
    </div>
  );
};
