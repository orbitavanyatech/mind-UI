"use client";

/* Auto-generated during modernization refactor of Mind Elevate */

import { slug } from "@/i18n/slug";
import { useLanguage } from "@/i18n/LanguageContext";
import React from "react";
import {
  Filter
} from "lucide-react";
import {
  Badge,
  Card,
  Button,
  EmptyPagePlaceholder
} from "@/components/ui/Primitives";
import {
  UPCOMING_SESSIONS
} from "@/data/mockData";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";

export const SessionsPage = () => {
  const router = useRouter();
  const { t, tOr } = useLanguage();
  return (
    <EmptyPagePlaceholder title={t("sessions.title")} desc={t("sessions.desc")}>
      <div className="flex gap-3 mb-5">
        <Button variant="subtle" size="sm" icon={Filter}>{t("sessions.all")}</Button>
        <Button variant="ghost" size="sm">{t("sessions.group")}</Button>
        <Button variant="ghost" size="sm">{t("sessions.oneOnOne")}</Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {UPCOMING_SESSIONS.map((s) => (
          <Card key={s.title} className="flex flex-col">
            <Badge color={s.type === "1:1 Coaching" ? "violet" : "teal"} className="w-fit mb-3">{tOr(`data.sessionType.${slug(s.type)}`, s.type)}</Badge>
            <p className="font-semibold text-slate-900 text-sm mb-1">{s.title}</p>
            <p className="text-xs text-slate-500 mb-4">{s.host} · {s.date}, {s.time}</p>
            <Button size="sm" className="mt-auto" onClick={() => router.push(ROUTES.session(s.id))}>
              {s.spots === "Confirmed" ? t("sessions.viewDetails") : t("sessions.reserve")}
            </Button>
          </Card>
        ))}
      </div>
    </EmptyPagePlaceholder>
  );
};
