import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "remixicon/fonts/remixicon.css";
import "../components/layout/SiteNavigation.css";
import FeedbackWidget from "../components/FeedbackWidget";
import MaintenanceGate from "../components/MaintenanceGate";
import CookieConsent from "../components/CookieConsent";
import PushNotificationPrompt from "../components/PushNotificationPrompt";
import "../components/PushNotificationPrompt.css";
import SiteChrome, { SiteFooter } from "../components/layout/SiteChrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SQLWhale",
  applicationName: "SQLWhale",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "SQLWhale", statusBarStyle: "default" },
  description: "Created By WEBXWHALE",
  icons: {
    icon: [{ url: "/icon?v=7", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/icon?v=7", type: "image/png", sizes: "512x512" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><MaintenanceGate><SiteChrome />{children}<SiteFooter /></MaintenanceGate><FeedbackWidget /><CookieConsent /><PushNotificationPrompt /></body>
    </html>
  );
}
