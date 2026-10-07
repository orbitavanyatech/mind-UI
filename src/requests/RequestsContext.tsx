"use client";

/* Requests from the Customer Administrator to Bebrave (the platform administrator).
   Lives at the app root so both areas see the same queue. Demo only: in memory.
   The company workspace (OrgContext) applies approved requests to its people list. */

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { AccountRequest } from "@/types";

export type NewRequest = Omit<AccountRequest, "id" | "status" | "createdAt">;

interface RequestsValue {
  requests: AccountRequest[];
  submitRequest: (input: NewRequest) => void;
  /** Only the platform administrator calls this. */
  resolveRequest: (id: string, approve: boolean) => void;
}

const RequestsContext = createContext<RequestsValue | null>(null);

export const RequestsProvider = ({ children }: { children: ReactNode }) => {
  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const counter = useRef(0);

  const submitRequest = useCallback((input: NewRequest) => {
    const id = `rq-${Date.now().toString(36)}${(counter.current++).toString(36)}`;
    setRequests((cur) => [{ ...input, id, status: "Pending", createdAt: new Date().toISOString().slice(0, 10) }, ...cur]);
  }, []);

  const resolveRequest = useCallback((id: string, approve: boolean) => {
    setRequests((cur) => cur.map((r) => (r.id === id && r.status === "Pending" ? { ...r, status: approve ? "Approved" : "Declined" } : r)));
  }, []);

  const value = useMemo(() => ({ requests, submitRequest, resolveRequest }), [requests, submitRequest, resolveRequest]);
  return <RequestsContext.Provider value={value}>{children}</RequestsContext.Provider>;
};

export const useRequests = () => {
  const ctx = useContext(RequestsContext);
  if (!ctx) throw new Error("useRequests must be used within a RequestsProvider");
  return ctx;
};
