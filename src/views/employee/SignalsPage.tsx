"use client";

import { useAuth } from "@/auth/AuthContext";
import { LeaderSignalsInbox } from "@/views/employee/LeaderSignalsInbox";
import { SendSignalPage } from "@/views/employee/SendSignalPage";

/* One route, two views: leaders read the signals sent to them; employees send one to their leader. */
export const SignalsPage = () => {
  const { role } = useAuth();
  return role === "leader" ? <LeaderSignalsInbox /> : <SendSignalPage />;
};
