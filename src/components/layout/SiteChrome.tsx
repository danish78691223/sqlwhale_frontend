"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authApi } from "@/services/api";

const links = [
  { label: "Home", href: "/" },
  { label: "Run Query", href: "/run-query" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/contact" },
  { label: "Subscribe", href: "/subscribe" },
];

export default function SiteChrome() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    let live = true;
    authApi.get("/auth/me")
      .then((response) => { if (live && response.data?.authenticated) setUser(response.data.user); })
      .catch(() => { if (live) setUser(null); })
      .finally(() => { if (live) setAuthLoading(false); });
    return () => { live = false; };
  }, [pathname]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

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
          <Link href={authLoading ? "/login" : user ? "/account" : "/login"} className="sqlwhale-site-account" title={user?.email || "Login"}>
            {authLoading ? "Login" : user ? "Profile" : "Login"}
          </Link>
          <button className={`sqlwhale-site-menu-button ${menuOpen ? "is-open" : ""}`} type="button" onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
            <span /><span /><span />
          </button>
        </div>
        <nav className={`sqlwhale-site-mobile-menu ${menuOpen ? "is-open" : ""}`} aria-label="Mobile navigation">
          {links.map((item, index) => <Link key={item.href} href={item.href}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}</Link>)}
          <Link href={authLoading ? "/login" : user ? "/account" : "/login"}><span>06</span>{authLoading ? "Login" : user ? "Profile" : "Login"}</Link>
        </nav>
      </header>
      <div className="sqlwhale-site-nav-spacer" aria-hidden="true" />
    </>
  );
}

export function SiteFooter() {
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
        <div className="footer-column"><span className="footer-column-title">BUILT BY</span><a className="footer-company footer-company-link" href="https://webxwhale.com" target="_blank" rel="noopener noreferrer">WEBXWHALE TECH &amp; SOLUTIONS</a><span className="footer-company-description">Technology &amp; digital learning systems.</span></div>
        <div className="footer-column"><span className="footer-column-title">LEGAL</span><Link href="/terms">Terms &amp; Conditions</Link><Link href="/privacy-policy">Privacy Policy</Link><Link href="/refund-policy">Return &amp; Cancellation Policy</Link></div>
      </div>
      <div className="footer-industrial-line"><span /><span className="footer-line-label">SQLWHALE / WEBXWHALE TECH &amp; SOLUTIONS</span><span /></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} SQLWhale. All rights reserved.</span><span className="footer-learning-service">Learning service by <a href="https://webxwhale.com" target="_blank" rel="noopener noreferrer"><strong>WEBXWHALE</strong></a></span></div>
    </footer>
  );
}
