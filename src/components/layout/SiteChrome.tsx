"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authApi } from "@/services/api";
import { ArrowUpRight, BookOpen, CreditCard, Home, Menu, Play, UserRound, X, ExternalLink } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { label: "Home", href: "/" },
  { label: "Run Query", href: "/run-query" },
  { label: "About", href: "/#about" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Contact", href: "/contact" },
  { label: "Subscribe", href: "/subscribe" },
];

type SessionUser = { name?: string; email?: string; role?: string };

const homeNavLeft = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/#about", icon: UserRound },
  { label: "How It Works", href: "/#how-it-works", icon: BookOpen },
];
const homeNavRight = [
  { label: "Run Query", href: "/run-query", icon: Play },
  { label: "Subscribe", href: "/subscribe", icon: CreditCard },
];

function HomeNotchNavbar({ accountHref, accountLabel }: { accountHref: string; accountLabel: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [accountHref, accountLabel]);

  const navLink = (item: typeof homeNavLeft[number]) => (
    <Link key={item.label} href={item.href} className="sqlwhale-notch-link" onClick={() => setMobileOpen(false)}>
      <item.icon aria-hidden="true" size={15} strokeWidth={1.8} />
      <span>{item.label}</span>
    </Link>
  );

  return (
    <>
      <header className="sqlwhale-notch-header">
        <div className="sqlwhale-notch-center">
          <nav className="sqlwhale-notch-links sqlwhale-notch-links-left" aria-label="Primary navigation">
            {homeNavLeft.map(navLink)}
          </nav>
          <Link href="/" className="sqlwhale-notch-brand" aria-label="SQLWhale home">
            <Image src="/sqlwhale-logo-main.png" alt="" width={34} height={34} priority />
            <span>SQL<span>Whale</span></span>
          </Link>
          <nav className="sqlwhale-notch-links sqlwhale-notch-links-right" aria-label="Product navigation">
            {homeNavRight.map(navLink)}
            <Link href={accountHref} className="sqlwhale-notch-account">
              {accountLabel}<ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </nav>
          <button
            className="sqlwhale-notch-menu-button"
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      <div className="sqlwhale-notch-spacer" aria-hidden="true" />
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            className="sqlwhale-notch-mobile-menu"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            {[...homeNavLeft, ...homeNavRight].map((item) => (
              <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)}>
                <item.icon size={17} aria-hidden="true" />
                <span>{item.label}</span>
                <ArrowUpRight size={14} className="sqlwhale-notch-mobile-arrow" aria-hidden="true" />
              </Link>
            ))}
            <Link href={accountHref} onClick={() => setMobileOpen(false)}>
              <UserRound size={17} aria-hidden="true" />
              <span>{accountLabel}</span>
              <ArrowUpRight size={14} className="sqlwhale-notch-mobile-arrow" aria-hidden="true" />
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

export default function SiteChrome() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    let live = true;
    setAuthLoading(true);
    authApi.get("/auth/me")
      .then((response) => {
        if (!live) return;
        setUser(response.data?.authenticated ? response.data.user ?? null : null);
      })
      .catch(() => { if (live) setUser(null); })
      .finally(() => { if (live) setAuthLoading(false); });
    return () => { live = false; };
  }, [pathname]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  if (pathname === "/run-query") return null;

  const accountHref = authLoading ? "/login" : user ? "/account" : "/login";

  if (pathname === "/" || pathname === "/subscribe") {
    return <HomeNotchNavbar accountHref={accountHref} accountLabel={authLoading ? "Login" : user ? "Profile" : "Login"} />;
  }

  return (
    <>
      <header className="sqlwhale-site-nav">
        <div className="sqlwhale-site-nav-inner">
          <Link href="/" className="sqlwhale-site-brand" aria-label="SQLWhale Home">
            <Image src="/sqlwhale-logo-main.png" alt="SQLWhale" width={42} height={42} priority />
          </Link>
          <nav className="sqlwhale-site-links" aria-label="Primary navigation">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className={pathname === item.href ? "is-active" : ""}>{item.label}</Link>
            ))}
          </nav>
          <Link href={accountHref} className="sqlwhale-site-account" title={user?.email || "Login"}>
            {authLoading ? "Login" : user ? "Profile" : "Login"}
          </Link>
          <button className={`sqlwhale-site-menu-button ${menuOpen ? "is-open" : ""}`} type="button" onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
            <span /><span /><span />
          </button>
        </div>
        <nav className={`sqlwhale-site-mobile-menu ${menuOpen ? "is-open" : ""}`} aria-label="Mobile navigation">
          {links.map((item, index) => <Link key={item.href} href={item.href}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}</Link>)}
          <Link href={accountHref}><span>06</span>{authLoading ? "Login" : user ? "Profile" : "Login"}</Link>
        </nav>
      </header>
      <div className="sqlwhale-site-nav-spacer" aria-hidden="true" />
    </>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    let live = true;
    setAuthLoading(true);
    authApi.get("/auth/me")
      .then((response) => {
        if (!live) return;
        setUser(response.data?.authenticated ? response.data.user ?? null : null);
      })
      .catch(() => { if (live) setUser(null); })
      .finally(() => { if (live) setAuthLoading(false); });
    return () => { live = false; };
  }, [pathname]);

  if (pathname === "/run-query") return null;
  const isAdmin = !authLoading && user?.role?.toLowerCase() === "admin";

  return (
    <footer className="sqlwhale-footer">
      <div className="footer-industrial-grid">
        <div className="footer-brand-block">
          <Link href="/" className="sqlwhale-logo footer-logo" aria-label="SQLWhale Home">
            <Image src="/sqlwhale-logo-main.png" alt="SQLWhale" width={52} height={52} className="sqlwhale-logo-image" />
            <span className="logo-wordmark"><span className="logo-whale">SQL</span><span className="logo-text">Whale</span></span>
          </Link>
          <p className="footer-tagline">Learn SQL. See the process. Understand the result.</p>
          <div className="footer-status"><span className="status-dot" />SQL LEARNING SYSTEM</div>
        </div>
        <div className="footer-column"><span className="footer-column-title">NAVIGATION</span><Link href="/">Home</Link><Link href="/run-query">Run Query</Link><Link href="/learn">Learn</Link><Link href="/understand">Understand</Link><Link href="/contact">Contact</Link><Link href="/subscribe">Subscribe</Link></div>
        <div className="footer-column"><span className="footer-column-title">PLATFORM</span><span>SQL Editor</span><span>Query Execution</span><span>Visual Learning</span><span>Interactive Database</span></div>
        <div className="footer-column"><span className="footer-column-title">BUILT BY</span><a className="footer-company footer-company-link" href="https://webxwhale.com" target="_blank" rel="noopener noreferrer">WEBXWHALE TECH &amp; SOLUTIONS</a><span className="footer-company-description">Technology &amp; digital learning systems.</span><span className="footer-column-title footer-social-title">FOLLOW SQLWHALE</span><a className="footer-social-link" href="https://www.instagram.com/sqlwhale/?hl=en" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="material-symbols-outlined" aria-hidden="true">photo_camera</span> Instagram <ExternalLink size={12} aria-hidden="true" /></a><a className="footer-social-link" href="https://github.com/danish78691223/sqlwhale_frontend" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="material-symbols-outlined" aria-hidden="true">code</span> GitHub <ExternalLink size={12} aria-hidden="true" /></a></div>
        <div className="footer-column"><span className="footer-column-title">FEATURED ON</span><a href="https://www.producthunt.com/products/webxwhale?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-webxwhale" target="_blank" rel="noopener noreferrer" aria-label="WEBXWHALE on Product Hunt" className="product-hunt-footer-badge" style={{ display: "inline-flex", maxWidth: "100%" }}><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1288754&amp;theme=dark&amp;t=1792649648947" alt="WEBXWHALE - Learn, Build &amp; Explore the Future of Technology | Product Hunt" width="250" height="54" loading="lazy" style={{ display: "block", maxWidth: "100%", height: "auto" }} /></a></div>
        {isAdmin && <div className="footer-column footer-admin-column"><span className="footer-column-title">ADMIN</span><Link href="/admin" style={{ color: "#ff4545", fontWeight: 700 }}>Admin Dashboard ↗</Link></div>}
        <div className="footer-column"><span className="footer-column-title">LEGAL</span><Link href="/terms">Terms &amp; Conditions</Link><Link href="/privacy-policy">Privacy Policy</Link><Link href="/refund-policy">Return &amp; Cancellation Policy</Link></div>
      </div>
      <div className="footer-industrial-line"><span /><span className="footer-line-label">SQLWHALE / WEBXWHALE TECH &amp; SOLUTIONS</span><span /></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} SQLWhale. All rights reserved.</span><span className="footer-learning-service">Learning service by <a href="https://webxwhale.com" target="_blank" rel="noopener noreferrer"><strong>WEBXWHALE</strong></a></span></div>
    </footer>
  );
}
