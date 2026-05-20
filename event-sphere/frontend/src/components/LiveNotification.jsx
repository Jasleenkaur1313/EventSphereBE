import React, { useEffect, useRef } from 'react';

const ICONS = {
  new:    '🎉',
  update: '✏️',
  delete: '🗑️',
  info:   'ℹ️'
};

const COLORS = {
  new:    '#059669',
  update: '#2563eb',
  delete: '#dc2626',
  info:   '#6b7280'
};

export default function LiveNotification({ notifications, onDismiss }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      pointerEvents: 'none'
    }}>
      {notifications.map(n => (
        <NotificationItem key={n.id} notification={n} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function NotificationItem({ notification, onDismiss }) {
  const color = COLORS[notification.type] || COLORS.info;
  const icon  = ICONS[notification.type]  || ICONS.info;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(notification.id), 4000);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  return (
    <div
      onClick={() => onDismiss(notification.id)}
      style={{
        pointerEvents: 'all',
        background: '#fff',
        border: `2px solid ${color}`,
        borderRadius: '10px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        cursor: 'pointer',
        maxWidth: '320px',
        animation: 'slideInRight 0.3s ease',
        fontSize: '0.875rem',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>{icon}</span>
      <span style={{ color: '#222', flex: 1, lineHeight: 1.4 }}>{notification.message}</span>
      <span style={{ color: color, fontWeight: 700, fontSize: '1rem', lineHeight: 1 }}>×</span>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
