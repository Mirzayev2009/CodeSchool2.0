'use client';

import React, { useEffect, useState } from 'react';
// import AdminHeader from '../../components/AdminHeader';
import AdminSidebar from '../../../components/AdminSidebar';
import QuickActions from './QuickActions';
import OverviewStats from './OverviewStats';
import RecentActivity from './RecentActivity';
import {
  getDashboard,
  getPayments,
  getStudents,
  getGroups,
} from '../API/AdminPanelApi';

function getTokenFromStorage() {
  // only use localStorage to get token (many possible keys checked)
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

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [dashboardRaw, setDashboardRaw] = useState(null);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);

  // fallback sample data (keeps UI intact if API unavailable)
  const SAMPLE_STATS = [
    {
      name: 'Total Students',
      value: '2,847',
      change: '+12%',
      changeType: 'increase',
      icon: 'ri-graduation-cap-line',
      color: 'blue'
    },
    {
      name: 'Active Teachers',
      value: '89',
      change: '+3%',
      changeType: 'increase',
      icon: 'ri-user-star-line',
      color: 'green'
    },
    {
      name: 'Running Classes',
      value: '156',
      change: '+8%',
      changeType: 'increase',
      icon: 'ri-group-line',
      color: 'purple'
    },
    {
      name: 'This Month Revenue',
      value: '$48,692',
      change: '+23%',
      changeType: 'increase',
      icon: 'ri-money-dollar-circle-line',
      color: 'orange'
    }
  ];

  const SAMPLE_ACTIVITIES = [
    {
      id: 's1',
      type: 'student_enrolled',
      message: 'Sarah Johnson enrolled in JavaScript Fundamentals class',
      time: '2 minutes ago',
      icon: 'ri-user-add-line',
      color: 'blue'
    },
    {
      id: 's2',
      type: 'teacher_added',
      message: 'Michael Chen was added as React.js instructor',
      time: '15 minutes ago',
      icon: 'ri-user-star-line',
      color: 'green'
    },
    {
      id: 's3',
      type: 'payment_received',
      message: 'Payment received from Emily Davis for December fees',
      time: '3 hours ago',
      icon: 'ri-money-dollar-circle-line',
      color: 'emerald'
    }
  ];

  useEffect(() => {
    let mounted = true;
    const token = getTokenFromStorage();
    if (!token) {
      // no token -> don't try backend (keep sample data)
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const [dbRes, paysRes, studsRes, groupsRes] = await Promise.allSettled([
          getDashboard(token),
          getPayments(token),
          getStudents(token),
          getGroups(token),
        ]);

        // helper to normalize promise results from Promise.allSettled
        const extract = (settled) => {
          if (!settled) return null;
          if (settled.status === 'fulfilled') return settled.value;
          return null;
        };

        const db = extract(dbRes);
        const pays = extract(paysRes);
        const studs = extract(studsRes);
        const gps = extract(groupsRes);

        if (!mounted) return;

        setDashboardRaw(db ?? null);

        // payments normalization: try array or .results
        const paymentsList = Array.isArray(pays)
          ? pays
          : (pays && (pays.results ?? pays.data ?? [])) || [];
        setPayments(paymentsList);

        const studentsList = Array.isArray(studs)
          ? studs
          : (studs && (studs.results ?? studs.data ?? [])) || [];
        setStudents(studentsList);

        const groupsList = Array.isArray(gps)
          ? gps
          : (gps && (gps.results ?? gps.data ?? [])) || [];
        setGroups(groupsList);
      } catch (err) {
        console.error('Dashboard fetch error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // build stats array for OverviewStats component (defensive)
  const stats = (() => {
    try {
      if (!dashboardRaw && !students.length && !groups.length && !payments.length) {
        return SAMPLE_STATS;
      }

      // Total students: prefer dashboardRaw.total_students else students.length else sample
      const totalStudents = dashboardRaw?.total_students ?? (students.length || SAMPLE_STATS[0].value);

      // Active teachers: try dashboardRaw.active_teachers or derive unique teachers from groups
      let activeTeachers = dashboardRaw?.active_teachers;
      if (activeTeachers == null) {
        const setT = new Set();
        groups.forEach(g => {
          const t = g.teacher ?? g.teacher_id ?? g.teacher_pk ?? null;
          if (!t) return;
          if (typeof t === 'object' && t !== null) {
            const tid = t.id ?? t.pk ?? (t.name ?? JSON.stringify(t));
            setT.add(String(tid));
          } else {
            setT.add(String(t));
          }
        });
        activeTeachers = setT.size || SAMPLE_STATS[1].value;
      }

      // Running classes: prefer dashboardRaw.running_classes or groups.length
      const runningClasses = dashboardRaw?.running_classes ?? (groups.length || SAMPLE_STATS[2].value);

      // This month revenue: prefer dashboardRaw.monthly_revenue or sum of payments amounts
      let revenue = dashboardRaw?.monthly_revenue;
      if (revenue == null) {
        const sum = payments.reduce((s, p) => {
          const amt = Number(p.amount ?? p.total ?? p.price ?? 0);
          return s + (Number.isFinite(amt) ? amt : 0);
        }, 0);
        revenue = sum ? `$${sum.toLocaleString()}` : SAMPLE_STATS[3].value;
      } else {
        // format if numeric
        if (typeof revenue === 'number') revenue = `$${revenue.toLocaleString()}`;
      }

      return [
        {
          name: 'Total Students',
          value: String(totalStudents),
          change: dashboardRaw?.students_change ?? SAMPLE_STATS[0].change,
          changeType: 'increase',
          icon: 'ri-graduation-cap-line',
          color: 'blue'
        },
        {
          name: 'Active Teachers',
          value: String(activeTeachers),
          change: dashboardRaw?.teachers_change ?? SAMPLE_STATS[1].change,
          changeType: 'increase',
          icon: 'ri-user-star-line',
          color: 'green'
        },
        {
          name: 'Running Classes',
          value: String(runningClasses),
          change: dashboardRaw?.classes_change ?? SAMPLE_STATS[2].change,
          changeType: 'increase',
          icon: 'ri-group-line',
          color: 'purple'
        },
        {
          name: 'This Month Revenue',
          value: revenue,
          change: dashboardRaw?.revenue_change ?? SAMPLE_STATS[3].change,
          changeType: 'increase',
          icon: 'ri-money-dollar-circle-line',
          color: 'orange'
        }
      ];
    } catch (err) {
      console.error('Error building stats', err);
      return SAMPLE_STATS;
    }
  })();

  // build activity list (take recent payments + recent students)
  const activities = (() => {
    try {
      if (!payments.length && !students.length) return SAMPLE_ACTIVITIES;

      const acts = [];

      // map latest payments (most recent first)
      const paysSorted = [...payments].slice(0, 6); // don't overdo
      paysSorted.forEach((p) => {
        const payerName = p.payer_name ?? p.name ?? (p.student && (p.student.full_name ?? p.student.name)) ?? 'Unknown';
        const status = (p.status ?? p.payment_status ?? '').toString().toLowerCase();
        const msg = status === 'paid' || status === 'successful'
          ? `Payment received from ${payerName} (${p.amount ?? p.total ?? p.price ?? ''})`
          : status === 'overdue'
            ? `Payment overdue for ${payerName} (${p.amount ?? p.total ?? p.price ?? ''})`
            : `Payment updated for ${payerName} (${p.amount ?? p.total ?? p.price ?? ''})`;

        acts.push({
          id: `pay-${p.id ?? p.pk ?? Math.random()}`,
          type: 'payment',
          message: msg,
          time: (p.created_at ?? p.date ?? p.paid_at ?? p.updated_at) || '',
          icon: status === 'overdue' ? 'ri-error-warning-line' : 'ri-money-dollar-circle-line',
          color: status === 'overdue' ? 'orange' : 'emerald'
        });
      });

      // add recent student enrollments (by enrollment date if available)
      const studsSorted = [...students].slice(0, 6);
      studsSorted.forEach((s) => {
        const name = s.full_name ?? s.name ?? (`${s.first_name ?? ''} ${s.last_name ?? ''}`.trim() || 'Student');
        const date = s.enrollment_date ?? s.created_at ?? s.joined_at ?? '';
        acts.push({
          id: `stu-${s.id ?? s.pk ?? Math.random()}`,
          type: 'student_enrolled',
          message: `${name} enrolled`,
          time: date,
          icon: 'ri-user-add-line',
          color: 'blue'
        });
      });

      // if acts empty, fallback
      if (acts.length === 0) return SAMPLE_ACTIVITIES;

      // sort by time if time values look like dates; otherwise keep order
      const withDates = acts.map(a => {
        const t = a.time ? new Date(a.time) : new Date(0);
        return { ...a, _t: isNaN(t.getTime()) ? 0 : t.getTime() };
      });
      withDates.sort((a,b) => b._t - a._t);
      return withDates.map(({_t, ...rest}) => rest);
    } catch (err) {
      console.error('Error building activities', err);
      return SAMPLE_ACTIVITIES;
    }
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} /> */}
      
      <div className="flex">
        <AdminSidebar isOpen={isSidebarOpen} />
        
        <main className="flex-1 ml-0 lg:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your CodeSchool educational center</p>
            </div>

            {/* Overview stats - keep UI exactly same */}
            <OverviewStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-2">
                <RecentActivity activities={activities} />
              </div>
              <div>
                <QuickActions />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
