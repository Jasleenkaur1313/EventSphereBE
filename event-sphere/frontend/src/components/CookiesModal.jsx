import React, { useState, useEffect } from 'react';

// ── Cookie helpers ───────────────────────────────────────────────────
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function getAllCookies() {
  if (!document.cookie) return [];
  return document.cookie.split(';').map(c => {
    const [name, ...rest] = c.trim().split('=');
    return { name, value: decodeURIComponent(rest.join('=')) };
  });
}

export default function CookiesModal({ onClose, onSave }) {
  const [prefs, setPrefs] = useState({ essential: true, analytics: true, preferences: false });
  const [showDetails, setShowDetails] = useState(false);

  // Load saved prefs from cookie on mount
  useEffect(() => {
    const saved = getCookie('es_cookie_prefs');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setPrefs({ essential: true, analytics: !!p.analytics, preferences: !!p.preferences });
      } catch {}
    }
  }, []);

  const handleSave = () => {
    if (onSave) onSave(prefs);
    onClose();
  };

  const activeCookies = getAllCookies();

  // Cookie descriptions for the detail view
  const cookieInfo = {
    es_consent:     'Records whether you accepted cookies',
    es_cookie_prefs:'Stores your cookie category preferences',
    es_analytics:   'Enables analytics tracking',
    es_last_visit:  'Timestamp of your last page visit',
    es_visit_count: 'Number of times you have visited',
    es_referrer:    'The page that referred you here',
    es_preferences: 'Enables preference cookies',
    es_theme:       'Your selected theme (light/dark)',
    es_timezone:    'Your detected timezone',
    es_lang:        'Your browser language',
  };

  return (
    <div style={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={styles.box}>
        <h2 style={styles.heading}>🍪 Manage Cookies</h2>
        <p style={styles.para}>
          We use real browser cookies to improve your experience. Essential cookies
          are always active. Toggle optional categories below.
        </p>

        {/* Essential */}
        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <div style={styles.label}>Essential Cookies</div>
            <div style={styles.desc}>Required for login, navigation, and security. Always on.</div>
          </div>
          <ToggleSwitch on={true} disabled />
        </div>

        {/* Analytics */}
        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <div style={styles.label}>Analytics Cookies</div>
            <div style={styles.desc}>
              Track visit count, last visit time, and referrer to help us understand usage.
            </div>
          </div>
          <ToggleSwitch on={prefs.analytics} onToggle={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))} />
        </div>

        {/* Preferences */}
        <div style={{ ...styles.row, borderBottom: 'none' }}>
          <div style={{ flex: 1 }}>
            <div style={styles.label}>Preference Cookies</div>
            <div style={styles.desc}>
              Remember your theme, timezone, and language settings across sessions.
            </div>
          </div>
          <ToggleSwitch on={prefs.preferences} onToggle={() => setPrefs(p => ({ ...p, preferences: !p.preferences }))} />
        </div>

        {/* Active cookies detail toggle */}
        <button style={styles.detailToggle} onClick={() => setShowDetails(d => !d)}>
          {showDetails ? '▲ Hide' : '▼ View'} Active Cookies ({activeCookies.length})
        </button>

        {showDetails && (
          <div style={styles.detailBox}>
            {activeCookies.length === 0 ? (
              <p style={{ ...styles.desc, padding: 8 }}>No cookies set yet.</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Value</th>
                    <th style={styles.th}>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCookies.map((c, i) => (
                    <tr key={i}>
                      <td style={styles.td}><code>{c.name}</code></td>
                      <td style={{ ...styles.td, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.value.length > 30 ? c.value.slice(0, 30) + '…' : c.value}
                      </td>
                      <td style={styles.td}>{cookieInfo[c.name] || 'Third-party / browser cookie'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={styles.btnRow}>
          <button style={styles.btnGhost} onClick={onClose}>Cancel</button>
          <button style={styles.btnPrimary} onClick={handleSave}>Save Preferences</button>
        </div>
      </div>
    </div>
  );
}

// ── Toggle Switch ────────────────────────────────────────────────────
function ToggleSwitch({ on, onToggle, disabled }) {
  return (
    <button
      onClick={() => !disabled && onToggle && onToggle()}
      aria-label="Toggle"
      style={{
        width: 48, height: 26, borderRadius: 13, border: 'none',
        background: on ? '#dc143c' : '#555', position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
        flexShrink: 0, opacity: disabled ? 0.6 : 1,
      }}
    >
      <span style={{
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 3, left: on ? 25 : 3, transition: 'left 0.2s',
      }} />
    </button>
  );
}

// ── Styles (crimson theme) ───────────────────────────────────────────
const styles = {
  overlay: {
    display: 'flex', position: 'fixed', inset: 0, zIndex: 1100,
    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    alignItems: 'center', justifyContent: 'center', padding: '1rem',
  },
  box: {
    background: 'var(--card-bg-color, #fff)', color: 'var(--text-color, #222)',
    borderRadius: 12, maxWidth: 600, width: '100%', maxHeight: '90vh',
    overflowY: 'auto', padding: '2rem', boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    color: '#dc143c', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.75rem',
  },
  para: {
    lineHeight: 1.7, fontSize: '0.95rem', color: 'var(--secondary-text, #555)',
    marginBottom: '1rem',
  },
  row: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0.85rem 0', borderBottom: '1px solid var(--calendar-border, #ddd)',
    gap: 12,
  },
  label: { fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-color, #222)' },
  desc: { fontSize: '0.8rem', color: 'var(--secondary-text, #888)', marginTop: 3 },
  detailToggle: {
    background: 'none', border: 'none', color: '#dc143c', fontWeight: 600,
    fontSize: '0.85rem', cursor: 'pointer', padding: '0.75rem 0', width: '100%',
    textAlign: 'left',
  },
  detailBox: {
    background: 'var(--bg-color, #f9fafc)', borderRadius: 8,
    border: '1px solid var(--calendar-border, #ddd)', marginBottom: '0.5rem',
    overflow: 'auto', maxHeight: 200,
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' },
  th: {
    textAlign: 'left', padding: '6px 10px', fontWeight: 700, fontSize: '0.7rem',
    textTransform: 'uppercase', letterSpacing: 0.5, color: '#dc143c',
    borderBottom: '1px solid var(--calendar-border, #ddd)',
  },
  td: {
    padding: '5px 10px', borderBottom: '1px solid var(--calendar-border, #eee)',
    color: 'var(--secondary-text, #555)',
  },
  btnRow: { display: 'flex', gap: 10, marginTop: '1.25rem', justifyContent: 'flex-end' },
  btnPrimary: {
    background: '#dc143c', color: '#fff', border: 'none',
    padding: '10px 24px', borderRadius: 6, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
  },
  btnGhost: {
    background: 'transparent', color: 'var(--text-color, #222)',
    border: '1px solid var(--calendar-border, #ccc)',
    padding: '10px 24px', borderRadius: 6, fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
  },
};
