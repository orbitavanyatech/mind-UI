"use client";

/* Platform administrator — Content Library. The catalog every company receives. Filter by type,
   publish / unpublish items, and jump to Create to add new ones. */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { slug } from "@/i18n/slug";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button, Card, EmptyPagePlaceholder } from "@/components/ui/Primitives";
import { Table, statusBadge } from "@/components/ui/Table";
import { usePlatform } from "@/platform/PlatformContext";
import { ROUTES } from "@/config/routes";
import type { ContentType } from "@/types";

const FILTERS: Array<{ key: "all" | ContentType; label: string }> = [
  { key: "all", label: "data.filter.all" },
  { key: "Course Module", label: "admin.content.courses" },
  { key: "Live Session", label: "admin.content.sessions" },
  { key: "Article", label: "admin.content.articles" },
];

export const ContentLibraryPage = () => {
  const { t, tOr } = useLanguage();
  const router = useRouter();
  const { content, setContentStatus } = usePlatform();
  const [filter, setFilter] = useState<"all" | ContentType>("all");
  const shown = filter === "all" ? content : content.filter((c) => c.type === filter);

  return (
    <EmptyPagePlaceholder title={t("admin.content.title")} desc={t("admin.content.desc")}>
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Button key={f.key} variant={filter === f.key ? "subtle" : "ghost"} size="sm" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>{t(f.label)}</Button>
            ))}
          </div>
          <Button size="sm" icon={Plus} onClick={() => router.push(ROUTES.platform.create)}>{t("admin.content.new")}</Button>
        </div>
        {shown.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-10">{t("platform.content.empty")}</p>
        ) : (
          <Table
            columns={[t("admin.cols.title"), t("admin.cols.type"), t("admin.cols.theme"), t("admin.cols.status"), ""]}
            rows={shown.map((c) => [
              c.title,
              tOr(`data.contentType.${slug(c.type)}`, c.type),
              tOr(`data.theme.${slug(c.theme)}`, c.theme),
              statusBadge(c.status),
              c.status === "Published" ? (
                <button key="a" onClick={() => setContentStatus(c.id, "Draft")} className="text-xs font-semibold text-slate-500 hover:text-slate-800">{t("platform.content.unpublish")}</button>
              ) : (
                <button key="a" onClick={() => setContentStatus(c.id, "Published")} className="text-xs font-semibold text-teal-700 hover:text-teal-800">{t("platform.content.publish")}</button>
              ),
            ])}
          />
        )}
      </Card>
    </EmptyPagePlaceholder>
  );
};
