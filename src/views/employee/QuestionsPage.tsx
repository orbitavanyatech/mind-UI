"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import React, { useState } from "react";
import { CheckCircle2, ChevronRight, FileQuestion, XCircle } from "lucide-react";
import { Badge, BackLink, Button, Card } from "@/components/ui/Primitives";
import { LESSON_QUESTIONS } from "@/data/mockData";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import type { LearningModule, Lesson } from "@/types";

export const QuestionsPage = ({ learningModule, lesson }: { learningModule: LearningModule; lesson: Lesson }) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [freeText, setFreeText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const graded = LESSON_QUESTIONS.filter((q) => !q.freeText);
  const correctCount = graded.filter((q) => selected[q.id] === q.correctIndex).length;

  const submit = () => setSubmitted(true);

  return (
    <div className="space-y-6 max-w-2xl">
      <BackLink href={ROUTES.module(learningModule.id)}>{t("shared.backTo", { name: learningModule.name })}</BackLink>

      <div>
        <Badge color="indigo" className="mb-2">{t("questions.badge", { duration: lesson.duration })}</Badge>
        <h1 className="mpp-display text-xl sm:text-2xl font-bold text-slate-900">{lesson.title}</h1>
        <p className="text-sm text-slate-500 mt-1">{t("questions.intro", { name: learningModule.name })}</p>
      </div>

      <div className="space-y-4">
        {LESSON_QUESTIONS.map((q, qi) => (
          <Card key={q.id}>
            <div className="flex items-start gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5"><FileQuestion className="w-4 h-4 text-indigo-600" /></div>
              <p className="text-sm font-semibold text-slate-900">{qi + 1}. {q.prompt}</p>
            </div>

            {q.freeText ? (
              <textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                rows={3}
                placeholder={t("exercise.placeholder")}
                disabled={submitted}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm disabled:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
              />
            ) : (
              <div className="space-y-2">
                {(q.options ?? []).map((opt, oi) => {
                  const isChosen = selected[q.id] === oi;
                  const isCorrect = submitted && oi === q.correctIndex;
                  const isWrongChoice = submitted && isChosen && oi !== q.correctIndex;
                  return (
                    <button
                      key={opt}
                      disabled={submitted}
                      onClick={() => setSelected((s) => ({ ...s, [q.id]: oi }))}
                      className={`w-full flex items-center justify-between gap-2 text-left rounded-xl border px-3.5 py-2.5 text-sm transition-colors
                        ${isCorrect ? "border-teal-400 bg-teal-50 text-teal-800" : isWrongChoice ? "border-rose-300 bg-rose-50 text-rose-700" : isChosen ? "border-indigo-400 bg-indigo-50 text-indigo-800" : "border-slate-200 hover:border-slate-300 text-slate-700"}`}
                    >
                      {opt}
                      {isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                      {isWrongChoice && <XCircle className="w-4 h-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        ))}
      </div>

      {!submitted ? (
        <Button className="w-full" icon={ChevronRight} onClick={submit}>{t("questions.submit")}</Button>
      ) : (
        <Card className="bg-teal-50/60 border-teal-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
            <p className="text-sm text-teal-900">{t("questions.result", { correct: correctCount, total: graded.length })}</p>
          </div>
          <Button size="sm" onClick={() => router.push(ROUTES.module(learningModule.id))}>{t("shared.backToModule")}</Button>
        </Card>
      )}
    </div>
  );
};
