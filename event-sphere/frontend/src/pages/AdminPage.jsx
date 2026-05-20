import React, { useState, useEffect, useRef } from 'react';
import socket from '../socket';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9001';

const STYLES = `
  .admin-wrap *, .admin-wrap *::before, .admin-wrap *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .admin-wrap {
    --bg:       #f9fafc;
    --surface:  #ffffff;
    --card:     #ffffff;
    --border:   #e5e7eb;
    --accent:   #dc143c;
    --accent2:  #b3002e;
    --green:    #059669;
    --yellow:   #fbbf24;
    --text:     #222222;
    --muted:    #6b7280;
    --radius:   10px;
    background: var(--bg);
    color: var(--text);
    font-family: Arial, sans-serif;
    min-height: 100vh;
  }

  .admin-header {
    background: var(--accent);
    padding: 0 2rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .admin-logo {
    font-weight: 800;
    font-size: 1.25rem;
    letter-spacing: -0.5px;
    color: #fff;
  }
  .admin-logo span { color: #fff; opacity: 0.85; }

  .badge-admin {
    background: rgba(255,255,255,0.2);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .admin-btn {
    font-family: Arial, sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    padding: 8px 18px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.18s ease;
  }
  .admin-btn-primary { background: var(--accent); color: #fff; }
  .admin-btn-primary:hover { background: var(--accent2); transform: translateY(-1px); }
  .admin-btn-danger { background: transparent; border: 1px solid #ef4444; color: #ef4444; }
  .admin-btn-danger:hover { background: #ef4444; color: #fff; }
  .admin-btn-ghost { background: transparent; border: 1px solid rgba(255,255,255,0.4); color: #fff; }
  .admin-btn-ghost:hover { border-color: #fff; color: #fff; }
  .admin-btn-sm { padding: 5px 12px; font-size: 0.78rem; }

  .admin-layout { display: flex; height: calc(100vh - 64px); }

  .admin-sidebar {
    width: 220px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 6px;
    overflow-y: auto;
  }

  .sidebar-label {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
    padding: 0 0.5rem;
    margin-bottom: 6px;
  }

  .sidebar-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    border: none;
    background: transparent;
    color: var(--muted);
    border-radius: 8px;
    font-family: Arial, sans-serif;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: left;
  }
  .sidebar-btn:hover { background: #fef2f2; color: var(--text); }
  .sidebar-btn.active { background: var(--accent); color: #fff; }

  .admin-main { flex: 1; overflow-y: auto; padding: 2rem; }

  .page-title {
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    color: var(--text);
  }

  .stats-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; margin-bottom: 2rem; }

  .stat-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .stat-label { font-size: 0.8rem; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
  .stat-value { font-size: 2rem; font-weight: 800; color: var(--accent); }

  .table-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .admin-table { width: 100%; border-collapse: collapse; }
  .admin-table th {
    background: #fafafa;
    padding: 0.75rem 1.25rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
  }
  .admin-table td {
    padding: 0.9rem 1.25rem;
    border-bottom: 1px solid var(--border);
    font-size: 0.875rem;
  }
  .admin-table tr:last-child td { border-bottom: none; }
  .admin-table tr:hover td { background: #fef2f2; }

  .cat-pill {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: capitalize;
  }
  .c-sports   { background: #dbeafe; color: #1d4ed8; }
  .c-comedy   { background: #ffedd5; color: #c2410c; }
  .c-theatre  { background: #dcfce7; color: #15803d; }
  .c-movies   { background: #f3e8ff; color: #7e22ce; }
  .c-concerts { background: #fef3c7; color: #a16207; }
  .c-other    { background: #f3f4f6; color: #6b7280; }

  .actions-td { display: flex; gap: 6px; }

  .modal-overlay {
    display: none;
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    z-index: 200;
    align-items: center;
    justify-content: center;
  }
  .modal-overlay.open { display: flex; }

  .modal-box {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 12px;
    width: 500px;
    max-width: 95vw;
    max-height: 85vh;
    overflow-y: auto;
    padding: 2rem;
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  }

  .modal-title {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--accent);
  }

  .form-group { margin-bottom: 1rem; }
  .form-group label { display: block; font-size: 0.8rem; color: var(--muted); margin-bottom: 6px; font-weight: 600; }
  .form-group input, .form-group select, .form-group textarea {
    width: 100%;
    background: #fff;
    border: 1px solid var(--border);
    color: var(--text);
    padding: 10px 14px;
    border-radius: 6px;
    font-family: Arial, sans-serif;
    font-size: 0.875rem;
  }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(220,20,60,0.15);
  }
  .form-group textarea { resize: vertical; min-height: 80px; }
  .form-group select option { background: #fff; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 1.5rem; }

  .toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: var(--green);
    color: #fff;
    font-weight: 600;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 0.875rem;
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 999;
  }
  .toast.show { transform: translateY(0); opacity: 1; }
  .toast.error { background: #ef4444; color: #fff; }

  .empty-row td { text-align: center; color: var(--muted); padding: 3rem !important; }

  .header-right { display: flex; align-items: center; gap: 12px; }

  @media (max-width: 768px) {
    .admin-layout { flex-direction: column; height: auto; }
    .admin-sidebar { width: 100%; flex-direction: row; overflow-x: auto; padding: 0.75rem; gap: 4px; border-right: none; border-bottom: 1px solid var(--border); }
    .sidebar-label { display: none; }
    .sidebar-btn { white-space: nowrap; font-size: 0.8rem; padding: 8px 10px; }
    .stats-row { grid-template-columns: repeat(3, 1fr); }
    .admin-main { padding: 1rem; }
    .form-row { grid-template-columns: 1fr; }
  }
`;

export default function AdminPage({ onNavigate, onLogout }) {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [serverOnline, setServerOnline] = useState(false);
  const [token] = useState(() => localStorage.getItem('eventSphereAuthToken') || '');
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', category: '', date: '', time: '', venue: '', image: '', description: '', price: '' });
  const [onlineUsers, setOnlineUsers] = useState(0);

  const CATEGORIES = ['sports', 'comedy', 'theatre', 'movies', 'concerts'];

  useEffect(() => {
    loadEvents();
  }, []);

  // Live socket updates
  useEffect(() => {
    const handleUsersCount = (count) => setOnlineUsers(count);
    const handleEventChange = () => loadEvents();

    socket.on('users:count', handleUsersCount);
    socket.on('event:created', handleEventChange);
    socket.on('event:updated', handleEventChange);
    socket.on('event:deleted', handleEventChange);

    return () => {
      socket.off('users:count', handleUsersCount);
      socket.off('event:created', handleEventChange);
      socket.off('event:updated', handleEventChange);
      socket.off('event:deleted', handleEventChange);
    };
  }, []);

  useEffect(() => {
    if (currentFilter === 'all') setFiltered(events);
    else setFiltered(events.filter(e => e.category === currentFilter));
  }, [events, currentFilter]);

  async function loadEvents() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/events`);
      const data = await res.json();
      setEvents(data.data || []);
      setServerOnline(true);
    } catch {
      setServerOnline(false);
      showToast('Backend server not reachable on port 9001', true);
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg, isError = false) {
    setToast({ msg, type: isError ? 'error' : '' });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  }

  function openAdd() {
    setEditingId(null);
    setForm({ title: '', category: '', date: '', time: '', venue: '', image: '', description: '', price: '' });
    setModalOpen(true);
  }

  function openEdit(ev) {
    setEditingId(ev.id);
    setForm({
      title: ev.title || '',
      category: ev.category || '',
      date: ev.date || '',
      time: ev.time || '',
      venue: ev.venue || '',
      image: ev.image || '',
      description: ev.description || '',
      price: ev.price ? String(ev.price) : '',
    });
    setModalOpen(true);
  }

  async function saveEvent() {
    if (!form.title || !form.category || !form.date || !form.description) {
      showToast('Fill in Title, Category, Date and Description!', true);
      return;
    }
    try {
      const url = editingId ? `${API}/api/admin/events/${editingId}` : `${API}/api/admin/events`;
      const method = editingId ? 'PUT' : 'POST';
      const payload = { ...form };
      if (payload.price && !isNaN(payload.price)) {
        payload.price = Number(payload.price);
      } else {
        delete payload.price;
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) { showToast(json.message || 'Error!', true); return; }
      setModalOpen(false);
      showToast(editingId ? 'Event updated!' : 'Event added!');
      loadEvents();
    } catch {
      showToast('Server error. Is backend running?', true);
    }
  }

  async function deleteEvent(id, title) {
    if (!window.confirm(`Delete "${title}"?\nThis cannot be undone.`)) return;
    try {
      const res = await fetch(`${API}/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) { showToast(json.message || 'Error!', true); return; }
      showToast('Event deleted!');
      loadEvents();
    } catch {
      showToast('Server error. Is backend running?', true);
    }
  }

  const stats = {
    total: events.length,
    sports: events.filter(e => e.category === 'sports').length,
    concerts: events.filter(e => e.category === 'concerts').length,
    others: events.filter(e => !['sports', 'concerts'].includes(e.category)).length,
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="admin-wrap">
        {/* Header */}
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="admin-logo">Event<span>Sphere</span></span>
            <span className="badge-admin">Admin Portal</span>
          </div>
          <div className="header-right">
            <span style={{ fontSize: '0.8rem', color: serverOnline ? '#bbf7d0' : '#fecaca' }}>
              {serverOnline ? '● Server Online' : '● Server Offline'}
            </span>
            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => onNavigate('home')}>
              ← Back to Site
            </button>
            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="admin-layout">
          {/* Sidebar */}
          <aside className="admin-sidebar">
            <div className="sidebar-label">Categories</div>
            <button className={`sidebar-btn ${currentFilter === 'all' ? 'active' : ''}`} onClick={() => setCurrentFilter('all')}>
              All Events
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`sidebar-btn ${currentFilter === cat ? 'active' : ''}`}
                onClick={() => setCurrentFilter(cat)}
              >
                {cat === 'sports' ? '●' : cat === 'comedy' ? '●' : cat === 'theatre' ? '●' : cat === 'movies' ? '●' : '●'}
                {' '}{cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </aside>

          {/* Main */}
          <main className="admin-main">
            <div className="page-title">
              {currentFilter === 'all'
                ? 'All Events'
                : `${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)} Events`}
            </div>

            {/* Stats */}
            <div className="stats-row">
              <div className="stat-card"><div className="stat-label">Total Events</div><div className="stat-value">{stats.total}</div></div>
              <div className="stat-card"><div className="stat-label">Sports</div><div className="stat-value" style={{ color: '#1d4ed8' }}>{stats.sports}</div></div>
              <div className="stat-card"><div className="stat-label">Concerts</div><div className="stat-value" style={{ color: '#a16207' }}>{stats.concerts}</div></div>
              <div className="stat-card"><div className="stat-label">Others</div><div className="stat-value" style={{ color: '#7e22ce' }}>{stats.others}</div></div>
              <div className="stat-card">
                <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: onlineUsers > 0 ? '#059669' : '#9ca3af', display: 'inline-block' }} />
                  Online Now
                </div>
                <div className="stat-value" style={{ color: '#059669' }}>{onlineUsers}</div>
              </div>
            </div>

            {/* Table */}
            <div className="table-card">
              <div className="table-toolbar">
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{filtered.length} event{filtered.length !== 1 ? 's' : ''}</span>
                <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={openAdd}>+ Add Event</button>
              </div>

              {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>Loading events…</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Venue</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr className="empty-row"><td colSpan="7">No events found.{!serverOnline && ' (Backend server not running)'}</td></tr>
                    ) : filtered.map((ev, i) => (
                      <tr key={ev.id}>
                        <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{i + 1}</td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{ev.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '3px' }}>
                            {ev.description?.slice(0, 60)}…
                          </div>
                        </td>
                        <td><span className={`cat-pill c-${ev.category}`}>{ev.category}</span></td>
                        <td style={{ color: 'var(--muted)' }}>{ev.date || '—'}</td>
                        <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{ev.venue || '—'}</td>
                        <td>
                          {ev.price
                            ? <span style={{ color: '#059669', fontWeight: 600 }}>Rs {ev.price}</span>
                            : <span style={{ color: 'var(--muted)' }}>Free</span>}
                        </td>
                        <td>
                          <div className="actions-td">
                            <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={() => openEdit(ev)}>Edit</button>
                            <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => deleteEvent(ev.id, ev.title)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </main>
        </div>

        {/* Modal */}
        <div className={`modal-overlay ${modalOpen ? 'open' : ''}`} onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="modal-box">
            <div className="modal-title">{editingId ? 'Edit Event' : 'Add New Event'}</div>
            <div className="form-group">
              <label>Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Event title" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Time</label>
                <input value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="e.g. 6:00 PM" />
              </div>
              <div className="form-group">
                <label>Venue</label>
                <input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} placeholder="Location" />
              </div>
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>Ticket Price (Rs) — leave blank for free</label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                placeholder="e.g. 150 (optional)"
              />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the event…" />
            </div>
            <div className="modal-footer">
              <button className="admin-btn admin-btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={saveEvent}>
                {editingId ? 'Save Changes' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>

        {/* Toast */}
        <div className={`toast ${toast.msg ? 'show' : ''} ${toast.type}`}>{toast.msg}</div>
      </div>
    </>
  );
}
