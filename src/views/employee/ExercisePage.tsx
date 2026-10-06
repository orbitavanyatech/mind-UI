"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import React, { useState } from "react";
import { CheckCircle2, ChevronRight, Circle, ListChecks, NotebookPen } from "lucide-react";
import { Badge, BackLink, Button, Card } from "@/components/ui/Primitives";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import type { LearningModule, Lesson } from "@/types";

const STEPS = [
  { title: "exercise.s1.title", prompt: "exercise.s1.prompt" },
  { title: "exercise.s2.title", prompt: "exercise.s2.prompt" },
  { title: "exercise.s3.title", prompt: "exercise.s3.prompt" },
];

export const ExercisePage = ({ learningModule, lesson }: { learningModule: LearningModule; lesson: Lesson }) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [answers, setAnswers] = useState(["", "", ""]);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(!!lesson.done);

  const idx = learningModule.lessons.findIndex((l) => l.id === lesson.id);
  const next = learningModule.lessons[idx + 1];

  const update = (val: string) => setAnswers((a) => a.map((v, i) => (i === step ? val : v)));

  const finish = () => {
    setDone(true);
    if (next) router.push(ROUTES.lesson(learningModule.id, next.id));
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <BackLink href={ROUTES.module(learningModule.id)}>{t("shared.backTo", { name: learningModule.name })}</BackLink>

      <div>
        <Badge color="violet" className="mb-2">{t("exercise.badge", { duration: lesson.duration })}</Badge>
        <h1 className="mpp-display text-xl sm:text-2xl font-bold text-slate-900">{lesson.title}</h1>
        <p className="text-sm text-slate-500 mt-1">{t("exercise.intro")}</p>
      </div>

      <div className="flex items-center gap-2 mb-1">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.title}>
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${i === step ? "text-violet-700" : i < step ? "text-teal-600" : "text-slate-300"}`}>
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              <span className="hidden sm:inline">{t(s.title)}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-teal-300" : "bg-slate-200"}`} />}
          </React.Fragment>
        ))}
      </div>

      <Card>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0"><ListChecks className="w-4.5 h-4.5 text-violet-600" /></div>
          <p className="font-semibold text-slate-900 text-sm">{t("exercise.step", { n: step + 1, total: STEPS.length, title: t(STEPS[step].title) })}</p>
        </div>
        <p className="text-sm text-slate-600 mb-4">{t(STEPS[step].prompt)}</p>
        <textarea
          value={answers[step]}
          onChange={(e) => update(e.target.value)}
          rows={4}
          placeholder={t("exercise.placeholder")}
          className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400"
        />
        <div className="flex items-center justify-between mt-5">
          <Button variant="ghost" size="sm" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>{t("exercise.previous")}</Button>
          {step < STEPS.length - 1 ? (
            <Button size="sm" icon={ChevronRight} onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>{t("exercise.nextStep")}</Button>
          ) : (
            <Button size="sm" variant="dark" icon={CheckCircle2} onClick={finish}>{t("exercise.complete")}</Button>
          )}
        </div>
      </Card>

      {done && (
        <Card className="bg-teal-50/60 border-teal-100 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <p className="text-sm text-teal-900">{t("exercise.doneMsg")}</p>
        </Card>
      )}

      <Button variant="outline" icon={NotebookPen} className="w-full" onClick={() => router.push(ROUTES.reflectionFor(learningModule.id, lesson.id))}>
        {t("exercise.toReflection")}
      </Button>
    </div>
  );
};
