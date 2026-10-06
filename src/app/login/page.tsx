import type { Metadata } from "next";
import { LoginPage } from "@/views/marketing/LoginPage";

export const metadata: Metadata = { title: "Sign in" };

export default function Page() {
  return <LoginPage />;
}
