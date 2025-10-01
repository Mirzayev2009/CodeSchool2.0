"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  DollarSign,
  Users,
  AlertTriangle,
  Maximize2,
  Minimize2,
  ArrowUpDown,
  CheckCircle,
  Plus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AdminSidebar from "../../../components/AdminSidebar";

// API imports
import {
  getPayments as apiGetPayments,
  getPaymentStatistics as apiGetPaymentStatistics,
  markPaymentPaid as apiMarkPaymentPaid,
  addPartialPayment as apiAddPartialPayment,
  getGroups as apiGetGroups,
} from "../API/AdminPanelApi";

const MONTH_NAMES = [
  "Yan",
  "Fev",
  "Mar",
  "Apr",
  "May",
  "Iyun",
  "Iyul",
  "Avg",
  "Sen",
  "Okt",
  "Noy",
  "Dek",
];

export default function PaymentAdminPage() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("Barcha guruhlar");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [studentPayments, setStudentPayments] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [groups, setGroups] = useState(["Barcha guruhlar"]);
  const [loading, setLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmPayment, setConfirmPayment] = useState(null);

  const [partialOpen, setPartialOpen] = useState(false);
  const [partialLoading, setPartialLoading] = useState(false);
  const [partialPayment, setPartialPayment] = useState(null);
  const [partialAmount, setPartialAmount] = useState("");

  const [alert, setAlert] = useState(null);

  const showAlert = (type, message, ms = 3000) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), ms);
  };

  // Normalize payment data from various backend formats
  const normalizePayment = (p) => {
    if (!p) return null;

    const id = p.id ?? p.pk ?? String(Math.random());
    const student = p.student ?? p.payer ?? p.user ?? {};
    const name =
      student.full_name ??
      student.name ??
      p.payer_name ??
      p.student_name ??
      `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() ??
      "Unknown";

    const phone = student.phone ?? student.phone_number ?? p.phone ?? "";

    // Extract groups
    let groups = [];
    if (Array.isArray(p.groups) && p.groups.length) {
      groups = p.groups.map((g) =>
        typeof g === "string" ? g : g.title ?? g.name ?? g.course_name ?? ""
      );
    } else if (p.group) {
      const g = p.group;
      groups = [
        typeof g === "string" ? g : g.title ?? g.name ?? g.course_name ?? "",
      ];
    } else if (p.course) {
      const c = p.course;
      groups = [typeof c === "string" ? c : c.title ?? c.name ?? ""];
    }

    const teacher =
      p.teacher?.name ??
      p.teacher?.full_name ??
      p.teacher_name ??
      p.group?.teacher?.name ??
      p.group?.teacher_name ??
      "";

    const amount = Number(p.amount ?? p.remaining_amount ?? p.price ?? 0);
    const paidAmount = Number(p.paid_amount ?? 0);
    const remainingAmount = amount - paidAmount;

    const dueDate = p.due_date ?? p.dueDate ?? p.payment_date ?? "";
    const lastPayment =
      p.last_payment ?? p.last_payment_date ?? p.paid_at ?? "";

    let status = "pending";
    if (p.status) {
      status = String(p.status).toLowerCase();
    } else if (p.is_paid === true || p.paid === true) {
      status = "paid";
    } else if (remainingAmount <= 0) {
      status = "paid";
    }

    // Check if overdue
    if (status !== "paid" && dueDate) {
      const dd = new Date(dueDate);
      if (!isNaN(dd) && dd < new Date()) {
        status = "overdue";
      }
    }

    return {
      id,
      name,
      phone,
      groups: groups.length ? groups : ["Unknown"],
      teacher,
      status,
      amount: remainingAmount > 0 ? remainingAmount : amount,
      dueDate,
      lastPayment,
      __raw: p,
    };
  };

  // Load all data
  async function loadData() {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      showAlert("error", "Autentifikatsiya tokeni topilmadi");
      setLoading(false);
      return;
    }

    try {
      // Fetch payments
      const paymentsData = await apiGetPayments(token);
      const paymentsArray = Array.isArray(paymentsData)
        ? paymentsData.map(normalizePayment).filter(Boolean)
        : [];
      setStudentPayments(paymentsArray);

      // Fetch groups
      try {
        const groupsData = await apiGetGroups(token);
        const groupNames = Array.isArray(groupsData)
          ? groupsData
              .map((g) => g.title ?? g.name ?? g.course_name ?? "")
              .filter(Boolean)
          : [];
        setGroups(["Barcha guruhlar", ...new Set(groupNames)]);
      } catch (err) {
        console.error("Failed to fetch groups:", err);
      }

      // Fetch payment statistics
      try {
        const stats = await apiGetPaymentStatistics(token);

        if (Array.isArray(stats)) {
          setMonthlyRevenue(
            stats.map((s) => ({
              month: s.month ?? s.name ?? "",
              revenue: Number(s.revenue ?? s.value ?? s.amount ?? 0),
            }))
          );
        } else if (
          stats?.monthly_revenue &&
          Array.isArray(stats.monthly_revenue)
        ) {
          setMonthlyRevenue(
            stats.monthly_revenue.map((s) => ({
              month: s.month ?? s.name ?? "",
              revenue: Number(s.revenue ?? s.value ?? s.amount ?? 0),
            }))
          );
        } else if (stats?.data && Array.isArray(stats.data)) {
          setMonthlyRevenue(
            stats.data.map((s) => ({
              month: s.month ?? s.name ?? "",
              revenue: Number(s.revenue ?? s.value ?? s.amount ?? 0),
            }))
          );
        } else {
          // Compute from payments as fallback
          setMonthlyRevenue(computeMonthlyFromPayments(paymentsArray));
        }
      } catch (err) {
        console.error("Failed to fetch statistics:", err);
        setMonthlyRevenue(computeMonthlyFromPayments(paymentsArray));
      }
    } catch (err) {
      console.error("Failed to load data:", err);
      showAlert("error", "To'lov ma'lumotlarini yuklashda xato");
      setStudentPayments([]);
      setMonthlyRevenue([]);
    } finally {
      setLoading(false);
    }
  }

  const computeMonthlyFromPayments = (payments) => {
    const months = lastNMonths(6);
    const map = new Map();
    months.forEach((m) => map.set(m.key, 0));

    payments.forEach((p) => {
      if (p.status !== "paid") return;
      const dateStr = p.lastPayment || p.__raw?.paid_at || p.dueDate;
      const d = new Date(dateStr);
      if (isNaN(d)) return;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (map.has(key)) {
        map.set(key, map.get(key) + (p.amount || 0));
      }
    });

    return months.map((m) => ({
      month: m.month,
      revenue: map.get(m.key) || 0,
    }));
  };

  const lastNMonths = (n = 6) => {
    const res = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      res.push({
        month: MONTH_NAMES[d.getMonth()],
        year: d.getFullYear(),
        key: `${d.getFullYear()}-${d.getMonth()}`,
      });
    }
    return res;
  };

  useEffect(() => {
    loadData();
  }, []);

  // Stats
  const totalRevenue = useMemo(
    () => studentPayments.reduce((sum, s) => sum + (s.amount || 0), 0),
    [studentPayments]
  );

  const unpaidStudents = useMemo(
    () => studentPayments.filter((s) => s.status !== "paid"),
    [studentPayments]
  );

  const unpaidPercentage = useMemo(() => {
    if (studentPayments.length === 0) return 0;
    return Math.round((unpaidStudents.length / studentPayments.length) * 100);
  }, [studentPayments, unpaidStudents]);

  const mostUnpaidGroup = useMemo(() => {
    const groupStats = {};
    unpaidStudents.forEach((s) => {
      s.groups.forEach((g) => {
        if (!groupStats[g]) groupStats[g] = 0;
        groupStats[g]++;
      });
    });
    const sorted = Object.entries(groupStats).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : "N/A";
  }, [unpaidStudents]);

  // Filtering and sorting
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = unpaidStudents.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone.includes(searchTerm);
      const matchesGroup =
        selectedGroup === "Barcha guruhlar" ||
        student.groups.includes(selectedGroup);
      return matchesSearch && matchesGroup;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "groups") {
          aValue = a.groups.join(", ");
          bValue = b.groups.join(", ");
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [unpaidStudents, searchTerm, selectedGroup, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "paid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const localStatusLabel = (status) => {
    switch (String(status).toLowerCase()) {
      case "pending":
        return "Kutilmoqda";
      case "overdue":
        return "Muddati o'tgan";
      case "paid":
        return "To'langan";
      default:
        return status;
    }
  };

  // Mark as paid
  const handleOpenConfirm = (payment) => {
    setConfirmPayment(payment);
    setConfirmOpen(true);
  };

  const handleMarkPaidConfirm = async () => {
    if (!confirmPayment) return;
    const id = confirmPayment.id;
    setConfirmLoading(true);

    const token = localStorage.getItem("token");
    try {
      await apiMarkPaymentPaid(id, token);
      showAlert("success", `${confirmPayment.name} to'landi deb belgilandi`);
      await loadData(); // Reload all data
    } catch (err) {
      console.error("Mark paid error:", err);
      showAlert(
        "error",
        `To'lovni to'langan deb belgilashda xato: ${
          err.message || "Noma'lum xato"
        }`
      );
    } finally {
      setConfirmLoading(false);
      setConfirmOpen(false);
      setConfirmPayment(null);
    }
  };

  // Partial payment
  const handleOpenPartial = (payment) => {
    setPartialPayment(payment);
    setPartialAmount("");
    setPartialOpen(true);
  };

  const handlePartialSubmit = async () => {
    if (!partialPayment) return;
    const id = partialPayment.id;
    const amountNum = parseFloat(partialAmount);

    if (isNaN(amountNum) || amountNum <= 0) {
      return showAlert("error", "Iltimos, to'g'ri qisman summa kiriting");
    }

    if (amountNum > partialPayment.amount) {
      return showAlert(
        "error",
        "Qisman summa qolgan balansdan oshmasligi kerak"
      );
    }

    setPartialLoading(true);

    const token = localStorage.getItem("token");
    try {
      // The API expects the payment ID and amount
      // Adjust this if your backend expects different parameters
      await apiAddPartialPayment(id, amountNum, token);
      showAlert(
        "success",
        `Qisman to'lov $${amountNum.toFixed(2)} ${
          partialPayment.name
        } uchun qayd qilindi`
      );
      await loadData(); // Reload all data
    } catch (err) {
      console.error("Partial payment error:", err);
      showAlert(
        "error",
        `Qisman to'lov qo'shishda xato: ${err.message || "Noma'lum xato"}`
      );
    } finally {
      setPartialLoading(false);
      setPartialOpen(false);
      setPartialPayment(null);
      setPartialAmount("");
    }
  };

  // UI Components
  const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const TableWrapper = ({ children }) =>
    isFullScreen ? (
      <div className="fixed inset-0 bg-white z-50 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            To'lovini to'lamaganlar (To'liq ekran)
          </h2>
          <button
            onClick={() => setIsFullScreen(false)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Minimize2 size={16} />
            To'liq ekrandan chiqish
          </button>
        </div>
        {children}
      </div>
    ) : (
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            To'lovini to'lamaganlar
          </h2>
          <button
            onClick={() => setIsFullScreen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Maximize2 size={16} />
            To'liq ekran
          </button>
        </div>
        {children}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar isOpen={isSidebarOpen} />

        <main className="flex-1 ml-0 lg:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                To'lovlarni boshqarish
              </h1>
              <p className="text-gray-600">
                To'lovini to'lamagan talabalarni va muddatdan o'tgan to'lovlarni
                kuzatib boring
              </p>
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">
                  To'lovlar ma'lumotlari yuklanmoqda...
                </p>
              </div>
            )}

            {!loading && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <StatCard
                    icon={<DollarSign size={24} className="text-white" />}
                    title="Jami daromad"
                    value={`$${totalRevenue.toLocaleString()}`}
                    color="bg-green-500"
                  />
                  <StatCard
                    icon={<AlertTriangle size={24} className="text-white" />}
                    title="To'lovini to'lamaganlar"
                    value={`${unpaidPercentage}%`}
                    color="bg-red-500"
                  />
                  <StatCard
                    icon={<Users size={24} className="text-white" />}
                    title="Eng ko'p qarzdor guruh"
                    value={mostUnpaidGroup}
                    color="bg-purple-500"
                  />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Oylik daromad
                  </h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          formatter={(v) => [
                            `$${v.toLocaleString()}`,
                            "Daromad",
                          ]}
                        />
                        <Bar dataKey="revenue" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <TableWrapper>
                  <div className="p-4 flex items-center gap-3">
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Ism yoki telefon bo'yicha qidirish..."
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <select
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      {groups.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={loadData}
                      className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Yangilash
                    </button>
                  </div>

                  <div className="overflow-auto max-h-96">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-6 py-3 text-left">
                            <button
                              onClick={() => handleSort("name")}
                              className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase"
                            >
                              Ism <ArrowUpDown size={12} />
                            </button>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Telefon
                          </th>
                          <th className="px-6 py-3 text-left">
                            <button
                              onClick={() => handleSort("groups")}
                              className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase"
                            >
                              Guruhlar <ArrowUpDown size={12} />
                            </button>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            O'qituvchi
                          </th>
                          <th className="px-6 py-3 text-left">
                            <button
                              onClick={() => handleSort("amount")}
                              className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase"
                            >
                              Summa <ArrowUpDown size={12} />
                            </button>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Holat
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Muddati
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Amallar
                          </th>
                        </tr>
                      </thead>

                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAndSortedStudents.length === 0 ? (
                          <tr>
                            <td
                              colSpan="8"
                              className="px-6 py-8 text-center text-gray-500"
                            >
                              To'lovini to'lamagan talaba topilmadi
                            </td>
                          </tr>
                        ) : (
                          filteredAndSortedStudents.map((s) => (
                            <tr key={s.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {s.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {s.phone || "—"}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                  {s.groups.map((g, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                    >
                                      {g}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {s.teacher || "—"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${(s.amount || 0).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                    s.status
                                  )}`}
                                >
                                  {localStatusLabel(s.status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {s.dueDate || "—"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleOpenConfirm(s)}
                                    className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                  >
                                    <CheckCircle size={14} /> To'landi
                                  </button>
                                  <button
                                    onClick={() => handleOpenPartial(s)}
                                    className="flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                                  >
                                    <Plus size={14} /> Qisman
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </TableWrapper>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Confirm Modal */}
      {confirmOpen && confirmPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold">To'lovni tasdiqlash</h3>
              <p className="text-sm text-gray-600 mt-2">
                {confirmPayment.name}ni <strong>to'langan</strong> deb
                belgilaysizmi?
                <br />
                Summa:{" "}
                <strong>${(confirmPayment.amount || 0).toFixed(2)}</strong>
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setConfirmOpen(false);
                    setConfirmPayment(null);
                  }}
                  disabled={confirmLoading}
                  className="px-4 py-2 rounded-md border"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleMarkPaidConfirm}
                  disabled={confirmLoading}
                  className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                >
                  {confirmLoading ? "Jarayonda..." : "To'landi deb belgilash"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partial Payment Modal */}
      {partialOpen && partialPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold">Qisman to'lov</h3>
              <p className="text-sm text-gray-600 mt-2">
                {` ${partialPayment.name} uchun qisman to'lov summa kiriting.`}
                <br />
                Hozirgi qarz:{" "}
                <strong>${(partialPayment.amount || 0).toFixed(2)}</strong>
              </p>

              <div className="mt-4">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  placeholder="Summa (mas., 20.00)"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setPartialOpen(false);
                    setPartialPayment(null);
                    setPartialAmount("");
                  }}
                  disabled={partialLoading}
                  className="px-4 py-2 rounded-md border"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handlePartialSubmit}
                  disabled={partialLoading}
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
                >
                  {partialLoading ? "Jarayonda..." : "Qisman saqlash"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Toast */}
      {alert && (
        <div
          className={`fixed right-6 bottom-6 z-50 px-4 py-3 rounded shadow ${
            alert.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {alert.message}
        </div>
      )}
    </div>
  );
}
