"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import React, { useState } from "react";
import { CheckCircle2, ChevronRight, NotebookPen, Pause, Play, Volume2 } from "lucide-react";
import { Badge, BackLink, Button, Card, StarRating } from "@/components/ui/Primitives";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import type { LearningModule, Lesson } from "@/types";

export const VideoPlayerPage = ({ learningModule, lesson }: { learningModule: LearningModule; lesson: Lesson }) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState(!!lesson.done);
  const [rating, setRating] = useState(0);

  const idx = learningModule.lessons.findIndex((l) => l.id === lesson.id);
  const next = learningModule.lessons[idx + 1];

  const goToNext = () => router.push(next ? ROUTES.lesson(learningModule.id, next.id) : ROUTES.module(learningModule.id));

  return (
    <div className="space-y-6 max-w-3xl">
      <BackLink href={ROUTES.module(learningModule.id)}>{t("shared.backTo", { name: learningModule.name })}</BackLink>

      <div>
        <Badge color="teal" className="mb-2">{t("video.badge", { duration: lesson.duration })}</Badge>
        <h1 className="mpp-display text-xl sm:text-2xl font-bold text-slate-900">{lesson.title}</h1>
        <p className="text-sm text-slate-500 mt-1">{learningModule.name} — {learningModule.path}</p>
      </div>

      <Card padded={false} className="overflow-hidden">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="relative w-full aspect-video bg-gradient-to-br from-indigo-950 to-slate-800 flex items-center justify-center group"
        >
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, #5D67E5 0, transparent 45%)" }} />
          <div className="relative w-16 h-16 rounded-full bg-white/15 backdrop-blur flex items-center justify-center group-hover:bg-white/25 transition-colors">
            {playing ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white ml-1" />}
          </div>
          <span className="absolute bottom-4 left-4 text-xs text-white/70 font-medium">{playing ? t("video.playing") : t("video.paused")} · {lesson.duration}</span>
          <Volume2 className="absolute bottom-4 right-4 w-4 h-4 text-white/70" />
        </button>
        <div className="p-4 sm:p-5">
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-4">
            <div className={`h-full rounded-full bg-teal-500 transition-all duration-700`} style={{ width: playing ? "42%" : "0%" }} />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{t("video.blurb")}</p>
        </div>
      </Card>

      <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCompleted((c) => !c)}
            className={`flex items-center gap-2 text-sm font-semibold ${completed ? "text-teal-700" : "text-slate-500 hover:text-slate-800"}`}
          >
            <CheckCircle2 className={`w-5 h-5 ${completed ? "text-teal-500" : "text-slate-300"}`} />
            {completed ? t("video.markedComplete") : t("video.markComplete")}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{t("video.rate")}</span>
          <StarRating value={rating} onChange={setRating} size="sm" />
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" icon={NotebookPen} onClick={() => router.push(ROUTES.reflectionFor(learningModule.id, lesson.id))} className="flex-1">
          {t("shared.addReflection")}
        </Button>
        <Button icon={ChevronRight} onClick={goToNext} className="flex-1">
          {next ? t("shared.nextLesson") : t("shared.backToModule")}
        </Button>
      </div>
    </div>
  );
};
