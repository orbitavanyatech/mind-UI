"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import React, { useState } from "react";
import { CheckCircle2, Circle, FileQuestion, ListChecks, NotebookPen, Play, PlayCircle } from "lucide-react";
import { Badge, BackLink, Button, Card, ProgressBar, StarRating } from "@/components/ui/Primitives";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import type { LearningModule, Lesson } from "@/types";

const LESSON_ICON = { video: PlayCircle, exercise: ListChecks, questions: FileQuestion };
const LESSON_LABEL_KEY = { video: "shared.lesson.video", exercise: "shared.lesson.exercise", questions: "shared.lesson.questions" } as const;

export const ModuleDetailsPage = ({ learningModule }: { learningModule: LearningModule }) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);

  const openLesson = (lesson: Lesson) => router.push(ROUTES.lesson(learningModule.id, lesson.id));

  return (
    <div className="space-y-6">
      <BackLink href={ROUTES.library}>{t("module.backToLibrary")}</BackLink>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
        <div>
          <p className="text-xs font-semibold text-slate-400 mb-1">{learningModule.path}</p>
          <h1 className="mpp-display text-xl sm:text-2xl font-bold text-slate-900">{learningModule.name}</h1>
        </div>
        <Badge color={learningModule.progress === 100 ? "teal" : "amber"} className="shrink-0">
          {learningModule.progress === 100 ? t("shared.completed") : learningModule.progress > 0 ? t("shared.inProgress") : t("shared.notStarted")}
        </Badge>
      </div>
      <p className="text-sm text-slate-500 max-w-2xl mb-5">{learningModule.description}</p>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-slate-900">{t("module.progress")}</p>
          <p className="text-xs text-slate-400">{t("module.total", { duration: learningModule.duration })}</p>
        </div>
        <ProgressBar value={learningModule.progress} color={learningModule.color} />
      </Card>

      <p className="text-sm font-semibold text-slate-900 mb-3">{t("module.lessons")}</p>
      <div className="space-y-3 mb-6">
        {learningModule.lessons.map((lesson, i) => {
          const Icon = LESSON_ICON[lesson.type];
          return (
            <Card key={lesson.id} className="flex items-center gap-4 !p-4">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500 shrink-0">{i + 1}</div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${lesson.done ? "bg-teal-50" : "bg-slate-50"}`}>
                <Icon className={`w-5 h-5 ${lesson.done ? "text-teal-600" : "text-slate-400"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{lesson.title}</p>
                <p className="text-xs text-slate-500">{t(LESSON_LABEL_KEY[lesson.type])} · {lesson.duration}</p>
              </div>
              {lesson.done ? <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 hidden sm:block" /> : <Circle className="w-5 h-5 text-slate-300 shrink-0 hidden sm:block" />}
              <Button size="sm" variant={lesson.done ? "outline" : "primary"} icon={Play} onClick={() => openLesson(lesson)}>
                {lesson.done ? t("shared.review") : t("shared.start")}
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{t("module.rateTitle")}</p>
          <p className="text-xs text-slate-500 mt-0.5">{t("module.rateDesc")}</p>
        </div>
        <div className="flex items-center gap-3">
          <StarRating value={rating} onChange={setRating} />
          {rating > 0 && <span className="text-xs text-teal-600 font-medium">{t("shared.thanks")}</span>}
        </div>
      </Card>

      <button
        onClick={() => router.push(ROUTES.reflectionFor(learningModule.id))}
        className="mt-6 w-full flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 hover:bg-slate-50 p-4 text-left transition-colors"
      >
        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0"><NotebookPen className="w-4.5 h-4.5 text-indigo-600" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900">{t("module.reflectTitle")}</p>
          <p className="text-xs text-slate-500">{t("module.reflectDesc")}</p>
        </div>
      </button>
    </div>
  );
};
