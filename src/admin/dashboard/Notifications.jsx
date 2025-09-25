'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../../components/AdminSidebar';
import {
  getPayments,
  getStudents,
  getGroups,
  getDashboard,
} from '../API/AdminPanelApi';

// localStorage keys
const READ_KEY = 'admin_notifications_read_v1';
const LOCAL_KEY = 'admin_notifications_local_v1';

function getTokenFromStorage() {
  try {
    return (
      localStorage.getItem('token') ??
      localStorage.getItem('authToken') ??
      localStorage.getItem('apiToken') ??
      localStorage.getItem('admin_token') ??
      localStorage.getItem('accessToken') ??
      ''
    );
  } catch {
    return '';
  }
}

function formatTime(t) {
  if (!t) return '';
  try {
    const d = new Date(t);
    if (isNaN(d.getTime())) return String(t);
    return d.toLocaleString();
  } catch (e) {
    return String(t);
  }
}

export default function AdminNotificationsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [dashboardRaw, setDashboardRaw] = useState(null);

  // notifications state
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [query, setQuery] = useState('');
  const [readIds, setReadIds] = useState(new Set());
  const [localAdds, setLocalAdds] = useState([]); // admin-created notifications

  const listRef = useRef(null);

  // load persisted read ids + local custom notifications
  useEffect(() => {
    try {
      const raw = localStorage.getItem(READ_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      setReadIds(new Set(arr || []));
    } catch (e) { /* ignore */ }

    try {
      const rawLocal = localStorage.getItem(LOCAL_KEY);
      const arr = rawLocal ? JSON.parse(rawLocal) : [];
      setLocalAdds(arr || []);
    } catch (e) { /* ignore */ }
  }, []);

  // fetch backend data if token exists
  useEffect(() => {
    let mounted = true;
    const token = getTokenFromStorage();
    if (!token) {
      // just build notifications from local data / sample
      setLoading(false);
      buildAndSet([] , [], []);
      return () => { mounted = false; };
    }

    (async () => {
      try {
        setLoading(true);
        const [pRes, sRes, gRes, dRes] = await Promise.allSettled([
          getPayments(token),
          getStudents(token),
          getGroups(token),
          getDashboard(token),
        ]);

        const extract = (s) => (s && s.status === 'fulfilled') ? s.value : null;
        const pays = extract(pRes) ?? [];
        const studs = extract(sRes) ?? [];
        const gps = extract(gRes) ?? [];
        const db = extract(dRes) ?? null;

        if (!mounted) return;

        setPayments(Array.isArray(pays) ? pays : (pays.results ?? pays.data ?? []));
        setStudents(Array.isArray(studs) ? studs : (studs.results ?? studs.data ?? []));
        setGroups(Array.isArray(gps) ? gps : (gps.results ?? gps.data ?? []));
        setDashboardRaw(db);

        buildAndSet(pays, studs, gps);
      } catch (err) {
        console.error('Notifications fetch error', err);
        buildAndSet([], [], []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function buildAndSet(pays = [], studs = [], gps = []) {
    const acts = [];

    // payments
    const paysArr = Array.isArray(pays) ? pays : (pays && (pays.results ?? pays.data ?? [])) || [];
    paysArr.slice(0, 200).forEach((p) => {
      const payer = p.payer_name ?? p.name ?? (p.student && (p.student.full_name ?? p.student.name)) ?? 'Unknown';
      const amount = p.amount ?? p.total ?? p.price ?? '';
      const status = (p.status ?? p.payment_status ?? '').toString().toLowerCase();
      const title = status === 'paid' || status === 'successful'
        ? `Payment received from ${payer}`
        : status === 'overdue'
          ? `Payment overdue for ${payer}`
          : `Payment updated: ${payer}`;

      acts.push({
        id: `pay-${p.id ?? p.pk ?? Math.random()}`,
        type: 'payment',
        title,
        body: amount ? `Amount: ${amount}` : '',
        time: p.created_at ?? p.paid_at ?? p.date ?? p.updated_at ?? '',
      });
    });

    // students
    const studsArr = Array.isArray(studs) ? studs : (studs && (studs.results ?? studs.data ?? [])) || [];
    studsArr.slice(0, 200).forEach((s) => {
      const name = s.full_name ?? s.name ?? (`${s.first_name ?? ''} ${s.last_name ?? ''}`.trim() || 'Student');
      acts.push({
        id: `stu-${s.id ?? s.pk ?? Math.random()}`,
        type: 'student',
        title: `${name} enrolled`,
        body: s.group && (s.group.name ?? s.group.title) ? `Group: ${s.group.name ?? s.group.title}` : '',
        time: s.enrollment_date ?? s.created_at ?? s.joined_at ?? '',
      });
    });

    // groups (optional)
    const groupsArr = Array.isArray(gps) ? gps : (gps && (gps.results ?? gps.data ?? [])) || [];
    groupsArr.slice(0, 50).forEach((g) => {
      const gname = g.name ?? g.title ?? g.uz ?? String(g.id ?? g.pk ?? g.group_id ?? g);
      acts.push({
        id: `grp-${g.id ?? g.pk ?? Math.random()}`,
        type: 'group',
        title: `Class: ${gname}`,
        body: g.description ?? '',
        time: g.created_at ?? g.createdAt ?? '',
      });
    });

    // local adds (admin made notifications)
    const local = (() => {
      try {
        const raw = localStorage.getItem(LOCAL_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) { return []; }
    })();

    // combine, newest first (sort by time if exists else local first)
    const combined = [...local.map(l => ({ ...l, _local: true })), ...acts];

    // attempt to sort by date where possible
    const withDates = combined.map((a) => {
      const t = a.time ? new Date(a.time) : new Date(0);
      const ts = isNaN(t.getTime()) ? 0 : t.getTime();
      return { ...a, _ts: ts };
    });

    withDates.sort((a, b) => b._ts - a._ts);

    setNotifications(withDates.map(({ _ts, _local, ...rest }) => rest));
  }

  // persist readIds
  useEffect(() => {
    try {
      localStorage.setItem(READ_KEY, JSON.stringify(Array.from(readIds)));
    } catch (e) { /* ignore */ }
  }, [readIds]);

  // persist local adds
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(localAdds));
    } catch (e) { /* ignore */ }
  }, [localAdds]);

  const toggleRead = (id) => {
    setReadIds(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return new Set(s);
    });
  };

  const markAllRead = () => {
    setReadIds(new Set(notifications.map(n => n.id)));
  };

  const addLocalNotification = (title, body) => {
    const n = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      title: title || 'Note',
      body: body || '',
      time: new Date().toISOString(),
    };
    setLocalAdds(prev => [n, ...prev]);
    setNotifications(prev => [n, ...prev]);
  };

  const removeNotification = (id) => {
    // removing local vs remote: if local then remove from localAdds; otherwise just hide from UI by filtering
    setLocalAdds(prev => prev.filter(l => l.id !== id));
    setNotifications(prev => prev.filter(n => n.id !== id));
    setReadIds(prev => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });
  };

  const visible = notifications.filter(n => {
    if (filter === 'unread' && readIds.has(n.id)) return false;
    if (query && !(String(n.title ?? '').toLowerCase().includes(query.toLowerCase()) || String(n.body ?? '').toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar isOpen={true} />

        <main className="flex-1 ml-0 lg:ml-64 p-6">
          <div className="max-w-7xl mx-auto h-full">
            {/* Full-screen-like panel */}
            <div className="bg-white rounded-xl shadow p-6 h-[calc(100vh-96px)] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <button onClick={() => navigate('/admin')} className="mr-3 inline-flex items-center px-3 py-2 rounded bg-gray-100 hover:bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                    Back
                  </button>
                  <h2 className="text-2xl font-semibold">Notifications</h2>
                  <p className="text-sm text-gray-500">All notifications for your center — payments, enrollments, and admin notes.</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notifications" className="px-3 py-2 w-64 focus:outline-none" />
                    <button onClick={() => setQuery('')} className="px-3 py-2 text-sm border-l">Clear</button>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setFilter('all')} className={`px-3 py-2 rounded ${filter==='all' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>All</button>
                    <button onClick={() => setFilter('unread')} className={`px-3 py-2 rounded ${filter==='unread' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>Unread</button>
                  </div>

                  <button onClick={markAllRead} className="px-3 py-2 rounded bg-green-50 text-green-700">Mark all read</button>
                </div>
              </div>

              <div className="flex gap-6 h-full">
                {/* left: list */}
                <div className="w-2/3 h-full overflow-y-auto border-r pr-4" ref={listRef}>
                  {loading && <div className="p-4">Loading...</div>}

                  {!loading && visible.length === 0 && (
                    <div className="p-6 text-center text-gray-500">No notifications match your filter.</div>
                  )}

                  {visible.map((n) => (
                    <div key={n.id} className={`p-4 mb-3 rounded-lg ${readIds.has(n.id) ? 'bg-white' : 'bg-indigo-50'} border`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold">{n.title}</div>
                            <div className="text-xs text-gray-500">{formatTime(n.time)}</div>
                          </div>
                          {n.body && <div className="mt-2 text-sm text-gray-700">{n.body}</div>}
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <button onClick={() => toggleRead(n.id)} className="px-3 py-1 rounded text-sm bg-gray-100 hover:bg-gray-200">{readIds.has(n.id) ? 'Mark unread' : 'Mark read'}</button>
                          <button onClick={() => removeNotification(n.id)} className="px-3 py-1 rounded text-sm bg-red-50 text-red-700 hover:bg-red-100">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* right: details / create */}
                <div className="w-1/3 h-full flex flex-col gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Create quick note</h3>
                    <QuickAddForm onAdd={addLocalNotification} />
                  </div>

                  <div className="p-4 border rounded-lg overflow-y-auto">
                    <h3 className="font-medium mb-2">Summary</h3>
                    <div className="text-sm text-gray-700">Total: {notifications.length}</div>
                    <div className="text-sm text-gray-700">Unread: {notifications.filter(n => !readIds.has(n.id)).length}</div>
                    <div className="mt-3">
                      <button onClick={() => { localStorage.removeItem(LOCAL_KEY); setLocalAdds([]); }} className="px-3 py-2 bg-yellow-50 text-yellow-800 rounded">Clear local notes</button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Help</h3>
                    <div className="text-sm text-gray-600">This page is UI-first. Tomorrow you can wire each item to backend endpoints to mark read/unread or delete. Local notes are stored in your browser until you add backend support.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function QuickAddForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title required');
    onAdd(title, body);
    setTitle('');
    setBody('');
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short title" className="w-full border rounded p-2" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="More details (optional)" className="w-full border rounded p-2 h-24" />
      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Add</button>
      </div>
    </form>
  );
}
