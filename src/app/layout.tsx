import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { AuthProvider } from "@/auth/AuthContext";
import { LanguageProvider } from "@/i18n/LanguageContext";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/components.css";
import "@/styles/utilities.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mind Elevate — Mental Performance Platform",
    template: "%s · Mind Elevate",
  },
  description: "Mind Elevate — the mental performance platform for modern organizations.",
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0E1C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
