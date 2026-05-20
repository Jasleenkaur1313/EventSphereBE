import React, { useState, useEffect } from 'react';
import CookiesModal from './CookiesModal';

// cookie helpers — using actual document.cookie
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, days = 365) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

function deleteCookie(name) {
  document.cookie = `${name}=; max-age=0; path=/`;
}

function applyAnalytics(enabled) {
  if (enabled) {
    setCookie('es_analytics', 'true');
    setCookie('es_last_visit', new Date().toISOString());
    const count = parseInt(getCookie('es_visit_count') || '0', 10);
    setCookie('es_visit_count', String(count + 1));
    if (document.referrer) setCookie('es_referrer', document.referrer, 30);
  } else {
    ['es_analytics', 'es_last_visit', 'es_visit_count', 'es_referrer'].forEach(deleteCookie);
  }
}

function applyPreferences(enabled) {
  if (enabled) {
    setCookie('es_preferences', 'true');
    const theme = document.querySelector('.dark-mode-active') ? 'dark' : 'light';
    setCookie('es_theme', theme);
    setCookie('es_timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
    setCookie('es_lang', navigator.language || 'en');
  } else {
    ['es_preferences', 'es_theme', 'es_timezone', 'es_lang'].forEach(deleteCookie);
  }
}

export default function ConsentInfo() {
  const [showBanner, setShowBanner] = useState(false);
  const [showManage, setShowManage] = useState(false);

  useEffect(() => {
    const consent = getCookie('es_consent');
    if (!consent) {
      // slight delay so it doesn't flash on page load
      const t = setTimeout(() => setShowBanner(true), 500);
      return () => clearTimeout(t);
    }
    // already consented — re-apply whatever they chose
    const prefs = getCookie('es_cookie_prefs');
    if (prefs) {
      try {
        const p = JSON.parse(prefs);
        applyAnalytics(p.analytics);
        applyPreferences(p.preferences);
      } catch {}
    }
  }, []);

  const handleAcceptAll = () => {
    setCookie('es_consent', 'all');
    setCookie('es_cookie_prefs', JSON.stringify({ essential: true, analytics: true, preferences: true }));
    applyAnalytics(true);
    applyPreferences(true);
    setShowBanner(false);
  };

  const handleSavePrefs = (prefs) => {
    setCookie('es_consent', 'custom');
    setCookie('es_cookie_prefs', JSON.stringify(prefs));
    applyAnalytics(prefs.analytics);
    applyPreferences(prefs.preferences);
    setShowBanner(false);
  };

  return (
    <>
      <div id="cookieBanner" className={showBanner ? 'show' : ''}>
        <p>
          This website uses cookies to ensure you get the best experience.
          By clicking "Accept All", you consent to the use of all cookies.
        </p>
        <div className="cookie-actions">
          <button id="acceptCookies" className="cookie-btn" onClick={handleAcceptAll}>Accept All</button>
          <button id="manageCookies" className="cookie-btn" onClick={() => setShowManage(true)}>Manage Cookies</button>
        </div>
      </div>
      {showManage && <CookiesModal onClose={() => setShowManage(false)} onSave={handleSavePrefs} />}
    </>
  );
}
