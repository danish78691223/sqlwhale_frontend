import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./theme.css";
import "remixicon/fonts/remixicon.css";
import "../components/layout/SiteNavigation.css";
import FeedbackWidget from "../components/FeedbackWidget";
import MaintenanceGate from "../components/MaintenanceGate";
import CookieConsent from "../components/CookieConsent";
import PushNotificationPrompt from "../components/PushNotificationPrompt";
import PwaUpdater from "../components/PwaUpdater";
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

const SITE_URL = "https://sqlwhale.webxwhale.com";
const SITE_NAME = "SQLWhale";
const SITE_DESCRIPTION =
  "Learn SQL online with SQLWhale. Practise SQL queries in an interactive editor, explore database tables, understand JOINs and build practical skills for data analytics and interviews.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SQLWhale – Learn SQL Online with Interactive Practice",
    template: "%s | SQLWhale",
  },
  applicationName: SITE_NAME,
  description: SITE_DESCRIPTION,
  category: "education",
  keywords: [
    "SQLWhale",
    "learn SQL online",
    "SQL practice",
    "SQL tutorial for beginners",
    "interactive SQL editor",
    "online SQL compiler",
    "SQL query practice",
    "SQL JOIN practice",
    "SQL learning platform",
    "database learning",
    "MySQL practice",
    "SQL for data analytics",
    "SQL interview preparation",
    "visual SQL learning",
    "SQL challenges",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "SQLWhale – Learn SQL Online with Interactive Practice",
    description: SITE_DESCRIPTION,
    locale: "en_IN",
    images: [
      {
        url: "/sqlwhale-logo-main.png",
        alt: "SQLWhale – Visual SQL Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SQLWhale – Learn SQL Online with Interactive Practice",
    description: SITE_DESCRIPTION,
    images: ["/sqlwhale-logo-main.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "default" },
  icons: {
    icon: [{ url: "/icon?v=8", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/icon?v=8", type: "image/png", sizes: "512x512" }],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": SITE_URL + "/#organization",
      name: "SQLWhale",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: SITE_URL + "/sqlwhale-logo-main.png",
      },
      parentOrganization: {
        "@type": "Organization",
        name: "WEBXWHALE",
        url: "https://webxwhale.com",
      },
    },
    {
      "@type": "WebSite",
      "@id": SITE_URL + "/#website",
      name: "SQLWhale",
      alternateName: ["SQL Whale", "SQLWhale by WEBXWHALE"],
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      publisher: { "@id": SITE_URL + "/#organization" },
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      "@id": SITE_URL + "/#application",
      name: "SQLWhale",
      url: SITE_URL,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      description: SITE_DESCRIPTION,
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        description: "Free access to start learning and practising SQL",
      },
      publisher: { "@id": SITE_URL + "/#organization" },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col"><MaintenanceGate><SiteChrome />{children}<SiteFooter /></MaintenanceGate><FeedbackWidget /><CookieConsent /><PwaUpdater /><PushNotificationPrompt /></body>
    </html>
  );
}
