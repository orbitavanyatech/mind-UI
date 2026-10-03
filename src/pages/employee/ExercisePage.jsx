import React, { useState } from "react";
import { CheckCircle2, ChevronRight, Circle, ListChecks, NotebookPen } from "lucide-react";
import { Badge, BackLink, Button, Card } from "../../components/ui/Primitives";
import { MODULES } from "../../data/mockData";
import { useNavigation } from "../../navigation/NavigationContext";

const STEPS = [
  { title: "Notice", prompt: "Think back over the last week. Write one moment your focus broke that you wish hadn't." },
  { title: "Name the trigger", prompt: "What specifically caused the break — a notification, a person, a thought, an open tab?" },
  { title: "Design a change", prompt: "What's one small, realistic change you could make so this is less likely next week?" },
];

export const ExercisePage = () => {
  const { params, navigate, back } = useNavigation();
  const module = MODULES[params.moduleId] || Object.values(MODULES)[0];
  const lesson = module.lessons.find((l) => l.id === params.lessonId) || module.lessons.find((l) => l.type === "exercise");
  const [answers, setAnswers] = useState(["", "", ""]);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(!!lesson.done);

  const idx = module.lessons.findIndex((l) => l.id === lesson.id);
  const next = module.lessons[idx + 1];

  const update = (val) => setAnswers((a) => a.map((v, i) => (i === step ? val : v)));

  const finish = () => {
    setDone(true);
    if (next) {
      if (next.type === "video") navigate("videoPlayer", { moduleId: module.id, lessonId: next.id });
      else if (next.type === "questions") navigate("questions", { moduleId: module.id, lessonId: next.id });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <BackLink onClick={back}>Back to {module.name}</BackLink>

      <div>
        <Badge color="violet" className="mb-2">Exercise · {lesson.duration}</Badge>
        <h1 className="mpp-display text-xl sm:text-2xl font-bold text-slate-900">{lesson.title}</h1>
        <p className="text-sm text-slate-500 mt-1">A short, guided exercise. Your answers are saved only to your private progress.</p>
      </div>

      <div className="flex items-center gap-2 mb-1">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.title}>
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${i === step ? "text-violet-700" : i < step ? "text-teal-600" : "text-slate-300"}`}>
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              <span className="hidden sm:inline">{s.title}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-teal-300" : "bg-slate-200"}`} />}
          </React.Fragment>
        ))}
      </div>

      <Card>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0"><ListChecks className="w-4.5 h-4.5 text-violet-600" /></div>
          <p className="font-semibold text-slate-900 text-sm">Step {step + 1} of {STEPS.length}: {STEPS[step].title}</p>
        </div>
        <p className="text-sm text-slate-600 mb-4">{STEPS[step].prompt}</p>
        <textarea
          value={answers[step]}
          onChange={(e) => update(e.target.value)}
          rows={4}
          placeholder="Type your answer here..."
          className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
        />
        <div className="flex items-center justify-between mt-5">
          <Button variant="ghost" size="sm" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>Previous</Button>
          {step < STEPS.length - 1 ? (
            <Button size="sm" icon={ChevronRight} onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>Next step</Button>
          ) : (
            <Button size="sm" variant="dark" icon={CheckCircle2} onClick={finish}>Complete exercise</Button>
          )}
        </div>
      </Card>

      {done && (
        <Card className="bg-teal-50/60 border-teal-100 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <p className="text-sm text-teal-900">Nice work — this exercise is marked complete.</p>
        </Card>
      )}

      <Button variant="outline" icon={NotebookPen} className="w-full" onClick={() => navigate("reflection", { moduleId: module.id, moduleName: module.name, lessonTitle: lesson.title })}>
        Turn this into a private reflection
      </Button>
    </div>
  );
};
