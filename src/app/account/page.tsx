"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

type User = {
  id: number;
  webxwhaleUserId: string;
  name: string;
  email: string;
  role: string;
  currentPlan: string;
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    api.get("/auth/me")
      .then((response) => {
        if (response.data?.authenticated) {
          setUser(response.data.user);
        } else {
          router.replace("/login");
        }
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await api.post("/auth/logout");
    } finally {
      router.replace("/");
      router.refresh();
    }
  }

  if (loading) {
    return (
      <main className="account-page">
        <div className="account-loading">
          <span className="account-loading-dot" />
          Loading your SQLWhale account...
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="account-page">
      <div className="account-page-grid" aria-hidden="true" />
      <div className="account-orb account-orb-one" aria-hidden="true" />
      <div className="account-orb account-orb-two" aria-hidden="true" />

      <header className="account-topbar">
        <Link href="/" className="account-brand">
          <Image
            src="/assets/sqlwhale-logo.png"
            alt="SQLWhale"
            width={44}
            height={44}
            priority
          />
          <span><strong>SQL</strong>Whale</span>
        </Link>
        <Link href="/" className="account-back">← Back to SQLWhale</Link>
      </header>

      <section className="account-shell">
        <div className="account-heading">
          <div className="account-eyebrow"><span /> YOUR SQLWHALE ACCOUNT</div>
          <h1>Welcome, <em>{user.name}</em>.</h1>
          <p>Your WEBXWHALE identity is connected and ready across SQLWhale.</p>
        </div>

        <div className="account-layout">
          <section className="account-card account-profile-card">
            <div className="account-card-header">
              <span className="account-card-label">PROFILE</span>
              <span className="account-connected"><i /> Connected</span>
            </div>

            <div className="account-avatar">
              {(user.name || "U").trim().charAt(0).toUpperCase()}
            </div>

            <h2>{user.name}</h2>
            <p className="account-email">{user.email}</p>

            <div className="account-details">
              <div>
                <span>ACCOUNT TYPE</span>
                <strong>{user.role || "User"}</strong>
              </div>
              <div>
                <span>SQLWHALE PLAN</span>
                <strong>{user.currentPlan || "Starter"}</strong>
              </div>
            </div>
          </section>

          <section className="account-card account-central-card">
            <div className="account-card-header">
              <span className="account-card-label">CENTRAL IDENTITY</span>
              <span className="account-webx">WEBXWHALE</span>
            </div>

            <div className="central-identity-mark">W</div>
            <h2>WEBXWHALE Identity</h2>
            <p>
              This account is authenticated through WEBXWHALE. Your SQLWhale
              session is linked to the same central identity.
            </p>

            <div className="identity-status">
              <span className="identity-status-dot" />
              <div>
                <strong>Identity connected</strong>
                <span>SSO authentication is active</span>
              </div>
            </div>
          </section>
        </div>

        <div className="account-actions">
          <Link href="/run-query" className="account-primary-action">
            Start Learning SQL <span>↗</span>
          </Link>
          <button
            type="button"
            className="account-logout-action"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>

        <div className="account-footer-note">
          <span>WEBXWHALE SSO</span>
          <p>One central identity. Separate product experiences.</p>
        </div>
      </section>
    </main>
  );
}
