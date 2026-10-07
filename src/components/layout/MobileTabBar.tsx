"use client";

/* Auto-generated during modernization refactor of Mind Elevate */

import React from "react";
import Link from "next/link";
import {
  Menu
} from "lucide-react";
import {
  NAV_CONFIG,
  ROLE_META
} from "@/config/nav";
import { useLanguage } from "@/i18n/LanguageContext";
import { isNavActive } from "@/config/routes";
import type { Role } from "@/types";

interface MobileTabBarProps {
  role: Role;
  pathname: string;
  onMore: () => void;
}

export const MobileTabBar = ({ role, pathname, onMore }: MobileTabBarProps) => {
  const items = NAV_CONFIG[role].slice(0, 4);
  const meta = ROLE_META[role];
  const { t } = useLanguage();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 mpp-safe-bottom">
      <div className="grid grid-cols-5 h-16">
        {items.map((item) => {
          const isActive = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 text-[10.5px] font-medium ${isActive ? `text-${meta.color}-600` : "text-slate-400"}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="truncate max-w-[64px]">{t(item.label)}</span>
            </Link>
          );
        })}
        <button onClick={onMore} className="flex flex-col items-center justify-center gap-1 text-[10.5px] font-medium text-slate-400">
          <Menu className="w-5 h-5" />
          <span>{t("nav.more")}</span>
        </button>
      </div>
    </nav>
  );
};
