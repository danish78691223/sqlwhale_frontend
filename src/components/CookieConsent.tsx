"use client";

import { useEffect, useState } from "react";
import AppleEmoji from "./AppleEmoji";

const COOKIE_CONSENT_KEY = "sqlwhale-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const saveConsent = (value: "accepted" | "necessary") => {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      className="sqlwhale-cookie-consent"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="sqlwhale-cookie-consent-content">
        <div className="sqlwhale-cookie-consent-icon" aria-hidden="true">
          <AppleEmoji name="cookie" size={28} />
        </div>

        <div className="sqlwhale-cookie-consent-copy">
          <h2>We use cookies</h2>
          <p>
            SQLWhale uses cookies to keep the site working and remember your
            preferences. By continuing, you agree to our use of cookies.
          </p>
        </div>

        <div className="sqlwhale-cookie-consent-actions">
          <button
            type="button"
            className="sqlwhale-cookie-consent-secondary"
            onClick={() => saveConsent("necessary")}
          >
            Necessary only
          </button>
          <button
            type="button"
            className="sqlwhale-cookie-consent-primary"
            onClick={() => saveConsent("accepted")}
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </aside>
  );
}
