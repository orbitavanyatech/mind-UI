"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/AuthContext";
import { homeFor } from "@/config/routes";
import type { Role } from "@/types";

/* Client-side guard for pages that only some roles may open. */
export const RoleGate = ({ allow, children }: { allow: Role[]; children: ReactNode }) => {
  const { role, ready } = useAuth();
  const router = useRouter();
  const permitted = role !== null && allow.includes(role);

  useEffect(() => {
    if (ready && role && !permitted) router.replace(homeFor(role));
  }, [ready, role, permitted, router]);

  return permitted ? <>{children}</> : null;
};
