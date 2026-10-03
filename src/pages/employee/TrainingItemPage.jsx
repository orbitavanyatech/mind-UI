import React, { useState } from "react";
import { Bookmark, BookmarkCheck, CheckCircle2, Clock, Lightbulb, Target } from "lucide-react";
import { BackLink, Badge, Button, Card, ProgressBar, StarRating } from "../../components/ui/Primitives";
import { TOPICS, TRAINING_ITEMS } from "../../data/featureData";
import { useNavigation } from "../../navigation/NavigationContext";
import { TOPIC_STYLES, TYPE_META } from "./trainingMeta";

export const TrainingItemPage = () => {
  const { params, navigate, back } = useNavigation();
  const item = TRAINING_ITEMS.find((i) => i.id === params.itemId) || TRAINING_ITEMS[0];
  const meta = TYPE_META[item.type];
  const topic = TOPICS.find((t) => t.id === item.topic);
  const style = TOPIC_STYLES[topic.color];

  const [saved, setSaved] = useState(item.saved);
  const [progress, setProgress] = useState(item.progress);
  const [stepsDone, setStepsDone] = useState(() => new Set());
  const [rating, setRating] = useState(0);
  const completed = progress >= 100;

  const related = TRAINING_ITEMS.filter((i) => i.id !== item.id && i.topic === item.topic).slice(0, 2);
  const toggleStep = (i) => setStepsDone((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <BackLink onClick={back}>Back to Personal Space</BackLink>
        <div className="flex flex-wrap items-center gap-2 mt-2 mb-2">
          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style.chip}`}>{topic.name}</span>
          <Badge color="slate"><meta.icon className="w-3 h-3" />{meta.label}</Badge>
          <Badge color="slate"><Clock className="w-3 h-3" />{item.duration} min</Badge>
          <Badge color="slate">{item.level}</Badge>
        </div>
        <div className="flex items-start justify-between gap-4">
          <h2 className="mpp-display text-2xl sm:text-3xl font-bold text-slate-900">{item.title}</h2>
          <button onClick={() => setSaved((v) => !v)} aria-label={saved ? "Remove from saved" : "Save for later"} className="p-2 rounded-xl hover:bg-slate-100 shrink-0">
            {saved ? <BookmarkCheck className="w-5 h-5 text-teal-600" /> : <Bookmark className="w-5 h-5 text-slate-400" />}
          </button>
        </div>
        <p className="text-slate-500 mt-2">{item.summary}</p>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="bg-indigo-950 mpp-noise-surface aspect-video max-h-80 w-full flex flex-col items-center justify-center text-white gap-3">
          <div className="w-16 h-16 rounded-full bg-white/10 ring-1 ring-white/20 flex items-center justify-center"><meta.icon className="w-8 h-8" /></div>
          <p className="text-sm text-slate-300">{completed ? "You've completed this item" : `${meta.label} · ${item.duration} min`}</p>
        </div>
        <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5"><span>Your progress</span><span>{progress}%</span></div>
            <ProgressBar value={progress} />
          </div>
          <div className="flex gap-2">
            {!completed && <Button onClick={() => setProgress((p) => Math.min(100, p === 0 ? 40 : p + 30))}>{progress > 0 ? "Continue" : meta.cta}</Button>}
            <Button variant={completed ? "subtle" : "outline"} icon={CheckCircle2} onClick={() => setProgress(completed ? 0 : 100)}>{completed ? "Completed" : "Mark complete"}</Button>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-5 gap-5">
        <Card className="md:col-span-3">
          <p className="font-semibold text-slate-900 mb-3">{item.type === "exercise" ? "How it works" : "What you'll cover"}</p>
          <ol className="space-y-2.5">
            {item.steps.map((s, i) => (
              <li key={i}>
                <button onClick={() => toggleStep(i)} className="flex w-full items-start gap-3 text-left">
                  <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${stepsDone.has(i) ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-500"}`}>{stepsDone.has(i) ? "✓" : i + 1}</span>
                  <span className={`text-sm ${stepsDone.has(i) ? "text-slate-400 line-through" : "text-slate-700"}`}>{s}</span>
                </button>
              </li>
            ))}
          </ol>
        </Card>
        <div className="md:col-span-2 space-y-5">
          <Card>
            <p className="flex items-center gap-2 font-semibold text-slate-900 mb-2"><Target className="w-4 h-4 text-teal-600" />Outcome</p>
            <p className="text-sm text-slate-600">{item.outcome}</p>
          </Card>
          <Card>
            <p className="flex items-center gap-2 font-semibold text-slate-900 mb-2"><Lightbulb className="w-4 h-4 text-amber-500" />Key takeaways</p>
            <ul className="space-y-2 text-sm text-slate-600 list-disc pl-4">{item.takeaways.map((t) => <li key={t}>{t}</li>)}</ul>
          </Card>
        </div>
      </div>

      <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Was this useful?</p>
          <p className="text-xs text-slate-500">Your rating helps improve recommendations — it's never tied to your name.</p>
        </div>
        <StarRating value={rating} onChange={setRating} />
      </Card>

      {related.length > 0 && (
        <div>
          <p className="font-semibold text-slate-900 mb-3">More on {topic.name}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {related.map((r) => (
              <button key={r.id} onClick={() => navigate("trainingItem", { itemId: r.id })} className="text-left">
                <Card className="hover:border-teal-300 transition-colors !p-4">
                  <p className="text-sm font-semibold text-slate-900">{r.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{TYPE_META[r.type].label} · {r.duration} min</p>
                </Card>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
