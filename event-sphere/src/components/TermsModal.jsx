import React from 'react';

const overlay = {
  display: 'flex', position: 'fixed', inset: 0, zIndex: 1100,
  background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
  alignItems: 'center', justifyContent: 'center', padding: '1rem',
};
const box = {
  background: 'var(--card-bg-color, #fff)', color: 'var(--text-color, #222)',
  borderRadius: 12, maxWidth: 640, width: '100%', maxHeight: '85vh',
  overflowY: 'auto', padding: '2rem', boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
};
const heading = { color: '#dc143c', fontWeight: 800, fontSize: '1.6rem', marginBottom: '1rem' };
const sub = { color: '#dc143c', fontWeight: 700, fontSize: '1.1rem', margin: '1.25rem 0 0.5rem' };
const para = { lineHeight: 1.7, fontSize: '0.95rem', color: 'var(--secondary-text, #555)', marginBottom: '0.75rem' };
const btn = {
  marginTop: '1.5rem', background: '#dc143c', color: '#fff', border: 'none',
  padding: '10px 28px', borderRadius: 6, fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
};

export default function TermsModal({ onClose }) {
  return (
    <div style={overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={box}>
        <h2 style={heading}>Terms of Service</h2>
        <p style={para}>Welcome to College EventSphere. By registering and using this platform you agree to the following terms.</p>

        <h3 style={sub}>1. Account Registration</h3>
        <p style={para}>You must provide accurate info during registration. One account per student. Keep your credentials safe.</p>

        <h3 style={sub}>2. Acceptable Use</h3>
        <p style={para}>EventSphere is for browsing and managing campus events. Don't misuse the platform, submit false info, or try to access admin features without permission.</p>

        <h3 style={sub}>3. Event Content</h3>
        <p style={para}>Event listings come from campus organizers. We don't guarantee accuracy and aren't liable for changes or cancellations.</p>

        <h3 style={sub}>4. Privacy</h3>
        <p style={para}>We only collect what's needed to run the platform (name, email, student ID). Your data isn't shared with third parties without consent.</p>

        <h3 style={sub}>5. Termination</h3>
        <p style={para}>We can suspend accounts that violate these terms. You can delete your account anytime by contacting the admin team.</p>

        <h3 style={sub}>6. Changes</h3>
        <p style={para}>We may update these terms. Continued use after changes means you accept the new terms.</p>

        <p style={{ ...para, fontStyle: 'italic', marginTop: '1rem' }}>Last updated: March 2026</p>

        <button style={btn} onClick={onClose}>I Understand</button>
      </div>
    </div>
  );
}
