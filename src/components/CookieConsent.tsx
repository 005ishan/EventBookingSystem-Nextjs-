"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "ebs_cookie_consent";

type CookiePreferences = {
  essential: boolean; // Always true
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
};

const defaultPreferences: CookiePreferences = {
  essential: true, // Always required
  analytics: false,
  preferences: false,
  marketing: false,
};

export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveCookiePreferences(prefs: CookiePreferences) {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    const consent = getCookiePreferences();
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function acceptAll() {
    const all: CookiePreferences = {
      essential: true,
      analytics: true,
      preferences: true,
      marketing: true,
    };
    saveCookiePreferences(all);
    animateOut();
  }

  function acceptSelected() {
    saveCookiePreferences({ ...preferences, essential: true });
    animateOut();
  }

  function rejectAll() {
    saveCookiePreferences({ ...defaultPreferences, essential: true });
    animateOut();
  }

  function animateOut() {
    setAnimatingOut(true);
    setTimeout(() => {
      setVisible(false);
      setAnimatingOut(false);
    }, 400);
  }

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[200] transition-all duration-400 ${
        animatingOut ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="bg-[#10152A]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
        <div className="max-w-5xl mx-auto px-6 py-4 md:py-5">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-[#4A7AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
                <span className="text-[#E8E4DA] text-sm font-semibold">Cookie Preferences</span>
              </div>
              <p className="text-[#E8E4DA]/60 text-xs leading-relaxed max-w-2xl">
                We use cookies to enhance your experience, analyze site traffic, and personalize content.
                By clicking &ldquo;Accept All&rdquo;, you consent to our use of cookies.
                <Link href="/cookies" className="text-[#4A7AFF] hover:underline ml-1">
                  Learn more
                </Link>
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-[#E8E4DA]/50 hover:text-[#E8E4DA] text-xs transition-all whitespace-nowrap"
              >
                {showDetails ? "Hide details" : "Customize"}
              </button>
              <button
                onClick={rejectAll}
                className="px-4 py-2 border border-white/15 rounded-lg text-[#E8E4DA]/70 text-xs hover:bg-white/5 transition-all whitespace-nowrap"
              >
                Reject All
              </button>
              <button
                onClick={acceptAll}
                className="px-5 py-2 bg-[#4A7AFF] rounded-lg text-white text-xs font-medium hover:bg-[#3A6AEF] transition-all whitespace-nowrap"
              >
                Accept All
              </button>
            </div>
          </div>

          {/* Detailed preferences */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              showDetails ? "max-h-80 opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t border-white/5 pt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Essential - always on */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="w-4 h-4 rounded border border-[#4A7AFF]/50 bg-[#4A7AFF]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-2.5 h-2.5 text-[#4A7AFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#E8E4DA] text-xs font-medium">Essential</p>
                  <p className="text-[#E8E4DA]/40 text-[10px] leading-relaxed">Required for basic functionality. Always active.</p>
                </div>
              </div>

              {/* Analytics */}
              <button
                onClick={() => setPreferences((p) => ({ ...p, analytics: !p.analytics }))}
                className="flex items-start gap-3 p-3 rounded-lg border border-white/5 hover:bg-white/[0.03] transition-all text-left"
              >
                <div className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                  preferences.analytics
                    ? "bg-[#4A7AFF] border-[#4A7AFF]"
                    : "border-white/20 bg-transparent"
                }`}>
                  {preferences.analytics && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-[#E8E4DA] text-xs font-medium">Analytics</p>
                  <p className="text-[#E8E4DA]/40 text-[10px] leading-relaxed">Help us improve with usage data.</p>
                </div>
              </button>

              {/* Preferences */}
              <button
                onClick={() => setPreferences((p) => ({ ...p, preferences: !p.preferences }))}
                className="flex items-start gap-3 p-3 rounded-lg border border-white/5 hover:bg-white/[0.03] transition-all text-left"
              >
                <div className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                  preferences.preferences
                    ? "bg-[#4A7AFF] border-[#4A7AFF]"
                    : "border-white/20 bg-transparent"
                }`}>
                  {preferences.preferences && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-[#E8E4DA] text-xs font-medium">Preferences</p>
                  <p className="text-[#E8E4DA]/40 text-[10px] leading-relaxed">Remember your settings and choices.</p>
                </div>
              </button>
            </div>

            <div className="flex justify-end mt-3">
              <button
                onClick={acceptSelected}
                className="px-5 py-2 bg-[#4A7AFF]/80 rounded-lg text-white text-xs font-medium hover:bg-[#4A7AFF] transition-all"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
