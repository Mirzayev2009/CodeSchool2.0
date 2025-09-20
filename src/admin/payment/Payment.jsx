'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { 
  DollarSign, 
  Users, 
  AlertTriangle,
  Maximize2,
  Minimize2,
  ArrowUpDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminSidebar from '../../../components/AdminSidebar';

// --- API helper (you already have this file in project) ---
import {
  getPayments as apiGetPayments,
  getPaymentStatistics as apiGetPaymentStatistics,
  markPaymentPaid as apiMarkPaymentPaid,
  addPartialPayment as apiAddPartialPayment,
  createMonthlyPayments as apiCreateMonthlyPayments,
  getStudentsAtRisk as apiGetStudentsAtRisk,
  getSuspensionCandidates as apiGetSuspensionCandidates,
  updateAllPaymentStatuses as apiUpdateAllPaymentStatuses,
  updateOverduePayments as apiUpdateOverduePayments,
} from '../API/AdminPanelApi';

// NOTE: UI preserved exactly. Only data source replaced with real backend calls.
// LocalStorage used only for reading token (localStorage.getItem('token')).

const FIXED_GROUPS = ["All Groups", "JavaScript Fundamentals", "React Advanced", "Python Basics", "Web Development", "UI/UX Design", "Advanced Python"];

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function PaymentAdminPage() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All Groups");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [studentPayments, setStudentPayments] = useState([]); // displayed rows
  const [monthlyRevenue, setMonthlyRevenue] = useState([]); // for chart
  const [loading, setLoading] = useState(false);

  // Normalize backend payment object to the UI shape used below
  const normalizePayment = (p) => {
    if (!p) return null;
    const id = p.id ?? p.pk ?? String(Math.random());
    const student = p.student ?? p.payer ?? p.user ?? {};
const name =
  student.full_name ??
  student.name ??
  p.payer_name ??
  p.name ??
  ((`${student.first_name ?? ''} ${student.last_name ?? ''}`).trim() || 'Unknown');


    const phone = (student.phone ?? p.phone) ?? '';

    // groups: try several locations
    let groups = [];
    if (Array.isArray(p.groups) && p.groups.length) {
      groups = p.groups.map(g => (typeof g === 'string' ? g : (g.title ?? g.name ?? g.course ?? g.group_name ?? '')));
    } else if (p.group) {
      const g = p.group;
      groups = [ (typeof g === 'string' ? g : (g.title ?? g.name ?? g.course ?? g.group_name ?? '')) ];
    } else if (p.course) {
      const c = p.course;
      groups = [ c.title ?? c.name ?? String(c) ];
    }

    // teacher heuristics
    const teacher =
      (p.teacher && (p.teacher.name ?? p.teacher.full_name)) ??
      p.teacher_name ??
      (p.group && (p.group.teacher_name ?? (p.group.teacher && (p.group.teacher.name ?? p.group.teacher)))) ??
      '';

    const amount = Number(p.amount ?? p.price ?? p.sum ?? 0);

    const dueDate = p.due_date ?? p.dueDate ?? p.due ?? p.due_at ?? '';
    const lastPayment =
      p.last_payment ??
      p.last_payment_date ??
      p.paid_at ??
      p.lastPaid ??
      p.payment_date ??
      '';

    // status heuristics
    let status = 'pending';
    if (p.status) status = String(p.status).toLowerCase();
    else if (typeof p.paid === 'boolean') status = p.paid ? 'paid' : 'pending';
    else if (p.is_paid) status = p.is_paid ? 'paid' : 'pending';

    // if not paid and due date in past -> overdue
    if (status !== 'paid' && dueDate) {
      const dd = new Date(dueDate);
      if (!isNaN(dd) && dd < new Date()) status = 'overdue';
    }

    return {
      id,
      name,
      phone,
      groups: groups.length ? groups : ['Unknown'],
      teacher: teacher ?? '',
      status,
      amount: isNaN(amount) ? 0 : amount,
      dueDate,
      lastPayment,
      __raw: p,
    };
  };

  // build last N months list (label + year)
  const lastNMonths = (n = 6) => {
    const res = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      res.push({ month: MONTH_NAMES[d.getMonth()], year: d.getFullYear(), key: `${d.getFullYear()}-${d.getMonth()}` });
    }
    return res;
  };

  const computeMonthlyFromPayments = (payments, n = 6) => {
    const months = lastNMonths(n);
    const map = new Map();
    months.forEach(m => map.set(m.key, 0));
    payments.forEach(p => {
      if (p.status !== 'paid') return;
      const dateStr = p.lastPayment || p.__raw?.paid_at || p.__raw?.payment_date || p.__raw?.createdAt || p.dueDate;
      const d = new Date(dateStr);
      if (isNaN(d)) return;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (map.has(key)) map.set(key, map.get(key) + (p.amount || 0));
    });
    return months.map(m => ({ month: m.month, revenue: map.get(m.key) || 0 }));
  };

  async function loadPaymentsAndStats() {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const paymentsData = await apiGetPayments(token).catch(err => {
        console.error('getPayments error', err);
        return [];
      });

      const paymentsArray = Array.isArray(paymentsData) ? paymentsData.map(normalizePayment).filter(Boolean) : [];
      setStudentPayments(paymentsArray);

      // try to get statistics from API; if shape is unknown, try to normalize or fallback to compute
      const stats = await apiGetPaymentStatistics(token).catch(() => null);
      if (stats) {
        // stats might be an array or object — attempt common shapes
        if (Array.isArray(stats)) {
          // assume [{month: 'Jan', revenue: 42000}, ...]
          const arr = stats.map(s => ({ month: s.month ?? s.name ?? s.label ?? String(s[0] ?? ''), revenue: Number(s.revenue ?? s.value ?? 0) }));
          setMonthlyRevenue(arr);
        } else if (Array.isArray(stats.monthly_revenue)) {
          setMonthlyRevenue(stats.monthly_revenue.map(s => ({ month: s.month ?? s.name, revenue: Number(s.revenue ?? s.value ?? 0) })));
        } else if (Array.isArray(stats.data)) {
          setMonthlyRevenue(stats.data.map(s => ({ month: s.month ?? s.name, revenue: Number(s.revenue ?? s.value ?? 0) })));
        } else {
          // unknown object shape -> fallback to compute
          setMonthlyRevenue(computeMonthlyFromPayments(paymentsArray, 6));
        }
      } else {
        setMonthlyRevenue(computeMonthlyFromPayments(paymentsArray, 6));
      }
    } catch (err) {
      console.error('loadPaymentsAndStats error', err);
      // fallback: clear lists
      setStudentPayments([]);
      setMonthlyRevenue([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPaymentsAndStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derived stats (matching original UI logic)
  const totalRevenue = useMemo(() => {
    return studentPayments.reduce((sum, s) => sum + (s.amount || 0), 0);
  }, [studentPayments]);

  const unpaidStudents = useMemo(() => {
    return studentPayments.filter(s => s.status !== 'paid');
  }, [studentPayments]);

  const unpaidPercentage = useMemo(() => {
    if (studentPayments.length === 0) return 0;
    return Math.round((unpaidStudents.length / studentPayments.length) * 100);
  }, [studentPayments, unpaidStudents]);

  const mostUnpaidGroup = useMemo(() => {
    const groupStats = {};
    unpaidStudents.forEach(s => {
      (s.groups || []).forEach(g => {
        if (!groupStats[g]) groupStats[g] = 0;
        groupStats[g]++;
      });
    });
    const topGroup = Object.entries(groupStats).sort((a, b) => b[1] - a[1])[0];
    return topGroup ? topGroup[0] : "N/A";
  }, [unpaidStudents]);

  // Table Data (filter/sort)
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = unpaidStudents.filter(student => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.phone || '').includes(searchTerm);
      const matchesGroup = selectedGroup === "All Groups" || (student.groups || []).includes(selectedGroup);
      return matchesSearch && matchesGroup;
    });

    // Default: sort by oldest lastPayment (longest unpaid)
    filtered.sort((a, b) => {
      const da = new Date(a.lastPayment || a.__raw?.last_payment_date || a.__raw?.paid_at || 0);
      const db = new Date(b.lastPayment || b.__raw?.last_payment_date || b.__raw?.paid_at || 0);
      return da - db;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'groups') {
          aValue = (a.groups || []).join(', ');
          bValue = (b.groups || []).join(', ');
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [unpaidStudents, searchTerm, selectedGroup, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Actions: mark paid / add partial payment (no UI changes were requested; actions not wired to UI buttons)
  // but functions are available to call if you wire UI later.

  const markPaid = async (paymentId) => {
    const token = localStorage.getItem('token');
    try {
      await apiMarkPaymentPaid(paymentId, token);
      // optimistic refresh
      await loadPaymentsAndStats();
    } catch (err) {
      console.error('markPaid error', err);
      alert('Failed to mark payment as paid. See console.');
    }
  };

  const addPartial = async (paymentId) => {
    const token = localStorage.getItem('token');
    try {
      await apiAddPartialPayment(paymentId, token);
      await loadPaymentsAndStats();
    } catch (err) {
      console.error('addPartial error', err);
      alert('Failed to add partial payment. See console.');
    }
  };

  const refresh = async () => {
    await loadPaymentsAndStats();
  };

  // You can also call other backend utilities if needed:
  // apiCreateMonthlyPayments(token), apiGetStudentsAtRisk(token), apiGetSuspensionCandidates(token), apiUpdateAllPaymentStatuses(token), apiUpdateOverduePayments(token)

  const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const TableWrapper = ({ children }) => (
    isFullScreen ? (
      <div className="fixed inset-0 bg-white z-50 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Unpaid Students (Full Screen)</h2>
          <button
            onClick={() => setIsFullScreen(false)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Minimize2 size={16} />
            Exit Full Screen
          </button>
        </div>
        {children}
      </div>
    ) : (
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Unpaid Students</h2>
          <button
            onClick={() => setIsFullScreen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Maximize2 size={16} />
            Full Screen
          </button>
        </div>
        {children}
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar isOpen={isSidebarOpen} />

        <main className="flex-1 ml-0 lg:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
              <p className="text-gray-600">Monitor unpaid students and overdue payments</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                icon={<DollarSign size={24} className="text-white" />}
                title="Total Revenue"
                value={`$${totalRevenue.toLocaleString()}`}
                color="bg-green-500"
              />
              <StatCard
                icon={<AlertTriangle size={24} className="text-white" />}
                title="Unpaid Students"
                value={`${unpaidPercentage}%`}
                color="bg-red-500"
              />
              <StatCard
                icon={<Users size={24} className="text-white" />}
                title="Most Unpaid Group"
                value={mostUnpaidGroup}
                color="bg-purple-500"
              />
            </div>

            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Unpaid Students Table */}
            <TableWrapper>
              <div className="p-4 flex items-center gap-3">
                {/* search UI kept as-is (but wired) */}
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or phone..."
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                {/* group filter dropdown kept minimal and non-intrusive (UI unchanged otherwise) */}
                <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className="px-3 py-2 border rounded-md">
                  {FIXED_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>

                <button onClick={refresh} className="px-3 py-2 bg-gray-200 rounded-md">Refresh</button>
              </div>

              <div className="overflow-auto max-h-96">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <button onClick={() => handleSort('name')} className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase">
                          Name <ArrowUpDown size={12} />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                      <th className="px-6 py-3 text-left">
                        <button onClick={() => handleSort('groups')} className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase">
                          Groups <ArrowUpDown size={12} />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                      <th className="px-6 py-3 text-left">
                        <button onClick={() => handleSort('amount')} className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase">
                          Amount <ArrowUpDown size={12} />
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.phone}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {s.groups.map((g, i) => (
                              <span key={i} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">{g}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.teacher}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${s.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(s.status)}`}>{s.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.dueDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TableWrapper>

          </div>
        </main>
      </div>
    </div>
  );
}
