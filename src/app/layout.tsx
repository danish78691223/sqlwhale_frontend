import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../components/layout/SiteNavigation.css";
import FeedbackWidget from "../components/FeedbackWidget";
import MaintenanceGate from "../components/MaintenanceGate";
import CookieConsent from "../components/CookieConsent";
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
  title: "SQLwhale",
  description: "Created By WEBWHALE",
  icons: {
    icon: '/favicon.ico', // public folder me rakhi image ka path
    
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><MaintenanceGate><SiteChrome />{children}<SiteFooter /></MaintenanceGate><FeedbackWidget /><CookieConsent /></body>
    </html>
  );
}
