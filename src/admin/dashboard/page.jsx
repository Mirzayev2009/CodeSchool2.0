"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// import AdminHeader from '../../components/AdminHeader';
import AdminSidebar from "../../../components/AdminSidebar";
import QuickActions from "./QuickActions";
import OverviewStats from "./OverviewStats";
import RecentActivity from "./RecentActivity";
import {
  getDashboard,
  getPayments,
  getStudents,
  getGroups,
} from "../API/AdminPanelApi";

function getTokenFromStorage() {
  // only use localStorage to get token (many possible keys checked)
  try {
    return (
      localStorage.getItem("token") ??
      localStorage.getItem("authToken") ??
      localStorage.getItem("apiToken") ??
      localStorage.getItem("admin_token") ??
      localStorage.getItem("accessToken") ??
      ""
    );
  } catch {
    return "";
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dashboardRaw, setDashboardRaw] = useState(null);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);

  // notification / profile UI state
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // fallback sample data (keeps UI intact if API unavailable)
  const SAMPLE_STATS = [
    {
      name: "Jami talabalar",
      value: "—",
      change: "—",
      changeType: "increase",
      icon: "ri-graduation-cap-line",
      color: "blue",
    },
    {
      name: "Faol o'qituvchilar",
      value: "—",
      change: "—",
      changeType: "increase",
      icon: "ri-user-star-line",
      color: "green",
    },
    {
      name: "Faol darslar",
      value: "—",
      change: "—",
      changeType: "increase",
      icon: "ri-group-line",
      color: "purple",
    },
    {
      name: "Bu oy daromadi",
      value: "—",
      change: "—",
      changeType: "increase",
      icon: "ri-money-dollar-circle-line",
      color: "orange",
    },
  ];

  const SAMPLE_ACTIVITIES = [
    {
      id: "s1",
      type: "student_enrolled",
      message: "Sarah Johnson JavaScript Fundamentals kursiga ro'yxatdan o'tdi",
      time: "2 daqiqa oldin",
      icon: "ri-user-add-line",
      color: "blue",
    },
    {
      id: "s2",
      type: "teacher_added",
      message: "Michael Chen React.js instruktor sifatida qo'shildi",
      time: "15 daqiqa oldin",
      icon: "ri-user-star-line",
      color: "green",
    },
    {
      id: "s3",
      type: "payment_received",
      message: "Emily Davis'dan dekabr to'lovi uchun to'lov qabul qilindi",
      time: "3 soat oldin",
      icon: "ri-money-dollar-circle-line",
      color: "emerald",
    },
  ];

  // fetch dashboard from backend (full-featured, defensive)
  useEffect(() => {
    let mounted = true;
    const token = getTokenFromStorage();

    // If there's no token, redirect to admin login (production behaviour)
    if (!token) {
      setLoading(false);
      navigate("/admin/login");
      return () => {
        mounted = false;
      };
    }

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [dbRes, paysRes, studsRes, groupsRes] = await Promise.allSettled([
          getDashboard(token),
          getPayments(token),
          getStudents(token),
          getGroups(token),
        ]);

        if (!mounted || controller.signal.aborted) return;

        const extract = (settled) => {
          if (!settled) return null;
          if (settled.status === "fulfilled") return settled.value;
          console.warn("API call failed", settled.reason);
          return null;
        };

        const db = extract(dbRes);
        const pays = extract(paysRes);
        const studs = extract(studsRes);
        const gps = extract(groupsRes);

        if (!mounted) return;

        setDashboardRaw(db ?? null);

        // payments normalization: try array or .results or .data
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

        // if nothing returned (all null), surface a friendly error so user can retry
        if (
          !db &&
          !paymentsList.length &&
          !studentsList.length &&
          !groupsList.length
        ) {
          setError(
            "Boshqaruv paneli ma'lumotlarini yuklab bo'lmadi. Iltimos, tarmoq yoki serverni tekshiring."
          );
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Dashboard fetch error", err);
        setError(
          err?.message ?? "Dashboard ma'lumotlarini olishda noma'lum xato"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // build stats array for OverviewStats component (defensive & memoized)
  const stats = useMemo(() => {
    try {
      if (
        !dashboardRaw &&
        !students.length &&
        !groups.length &&
        !payments.length
      ) {
        return SAMPLE_STATS;
      }

      // Total students: prefer dashboardRaw.total_students else students.length else sample
      const totalStudents =
        dashboardRaw?.total_students ??
        (students.length || SAMPLE_STATS[0].value);

      // Active teachers: try dashboardRaw.active_teachers or derive unique teachers from groups
      let activeTeachers = dashboardRaw?.active_teachers;
      if (activeTeachers == null) {
        const setT = new Set();
        groups.forEach((g) => {
          const t = g.teacher ?? g.teacher_id ?? g.teacher_pk ?? null;
          if (!t) return;
          if (typeof t === "object" && t !== null) {
            const tid = t.id ?? t.pk ?? t.name ?? JSON.stringify(t);
            setT.add(String(tid));
          } else {
            setT.add(String(t));
          }
        });
        activeTeachers = setT.size || SAMPLE_STATS[1].value;
      }

      // Running classes: prefer dashboardRaw.running_classes or groups.length
      const runningClasses =
        dashboardRaw?.running_classes ??
        (groups.length || SAMPLE_STATS[2].value);

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
        if (typeof revenue === "number")
          revenue = `$${revenue.toLocaleString()}`;
      }

      return [
        {
          name: "Jami talabalar",
          value: String(totalStudents),
          change: dashboardRaw?.students_change ?? SAMPLE_STATS[0].change,
          changeType: "increase",
          icon: "ri-graduation-cap-line",
          color: "blue",
        },
        {
          name: "Faol o'qituvchilar",
          value: String(activeTeachers),
          change: dashboardRaw?.teachers_change ?? SAMPLE_STATS[1].change,
          changeType: "increase",
          icon: "ri-user-star-line",
          color: "green",
        },
        {
          name: "Faol darslar",
          value: String(runningClasses),
          change: dashboardRaw?.classes_change ?? SAMPLE_STATS[2].change,
          changeType: "increase",
          icon: "ri-group-line",
          color: "purple",
        },
        {
          name: "Bu oy daromadi",
          value: revenue,
          change: dashboardRaw?.revenue_change ?? SAMPLE_STATS[3].change,
          changeType: "increase",
          icon: "ri-money-dollar-circle-line",
          color: "orange",
        },
      ];
    } catch (err) {
      console.error("Error building stats", err);
      return SAMPLE_STATS;
    }
  }, [dashboardRaw, students, groups, payments]);

  // build activity list (take recent payments + recent students) - memoized
  const activities = useMemo(() => {
    try {
      if (!payments.length && !students.length) return SAMPLE_ACTIVITIES;

      const acts = [];

      // map latest payments (most recent first) - keep small slice
      const paysSorted = [...payments].slice(0, 6);
      paysSorted.forEach((p) => {
        const payerName =
          p.payer_name ??
          p.name ??
          (p.student && (p.student.full_name ?? p.student.name)) ??
          "Noma'lum";
        const status = (p.status ?? p.payment_status ?? "")
          .toString()
          .toLowerCase();
        const amountLabel = p.amount ?? p.total ?? p.price ?? "";
        const msg =
          status === "paid" || status === "successful"
            ? `To'lov qabul qilindi: ${payerName} (${amountLabel})`
            : status === "overdue"
            ? `${payerName} uchun to'lov muddati o'tib ketgan (${amountLabel})`
            : `To'lov yangilandi: ${payerName} (${amountLabel})`;

        acts.push({
          id: `pay-${p.id ?? p.pk ?? Math.random()}`,
          type: "payment",
          message: msg,
          time: (p.created_at ?? p.date ?? p.paid_at ?? p.updated_at) || "",
          icon:
            status === "overdue"
              ? "ri-error-warning-line"
              : "ri-money-dollar-circle-line",
          color: status === "overdue" ? "orange" : "emerald",
        });
      });

      // add recent student enrollments (by enrollment date if available)
      const studsSorted = [...students].slice(0, 6);
      studsSorted.forEach((s) => {
        const name =
          s.full_name ??
          s.name ??
          (`${s.first_name ?? ""} ${s.last_name ?? ""}`.trim() || "Talaba");
        const date = s.enrollment_date ?? s.created_at ?? s.joined_at ?? "";
        acts.push({
          id: `stu-${s.id ?? s.pk ?? Math.random()}`,
          type: "student_enrolled",
          message: `${name} ro'yxatdan o'tdi`,
          time: date,
          icon: "ri-user-add-line",
          color: "blue",
        });
      });

      if (acts.length === 0) return SAMPLE_ACTIVITIES;

      const withDates = acts.map((a) => {
        const t = a.time ? new Date(a.time) : new Date(0);
        return { ...a, _t: isNaN(t.getTime()) ? 0 : t.getTime() };
      });
      withDates.sort((a, b) => b._t - a._t);
      return withDates.map(({ _t, ...rest }) => rest);
    } catch (err) {
      console.error("Error building activities", err);
      return SAMPLE_ACTIVITIES;
    }
  }, [payments, students]);

  // derive notifications from activities (UI-only for now)
  useEffect(() => {
    const nots = (activities || SAMPLE_ACTIVITIES).slice(0, 6).map((a, i) => ({
      id: a.id ?? `n-${i}`,
      title: a.message,
      time: a.time || "",
      read: false,
      type: a.type || "info",
    }));
    setNotifications(nots);
  }, [activities]);

  // close popovers on outside click
  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setIsProfileOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") {
        setIsNotifOpen(false);
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };
  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const adminName = localStorage.getItem("adminName") ?? "";
  const initials = adminName
    ? adminName
        .split(" ")
        .map((x) => x[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AD";

  const handleLogout = () => {
    // simple logout: clear common token keys and redirect to admin login
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("apiToken");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    } catch (e) {
      /* ignore */
    }
    navigate("/");
  };

  const retryFetch = () => {
    // simple retry: reload page to re-run the effect that fetches data
    setError(null);
    setLoading(true);
    // re-run effect by navigating to same route or forcing reload
    // here we do a soft-reload
    window.location.reload();
  };

  // Small skeleton UI to show while loading so the layout doesn't jump
  const SkeletonOverview = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 bg-white rounded-lg shadow animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded mb-3" />
          <div className="h-8 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );

  const SkeletonActivity = () => (
    <div className="bg-white rounded-lg shadow p-4 space-y-3 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full" />
          <div className="flex-1">
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-1/3 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  const SkeletonQuickActions = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-12 bg-white rounded-lg shadow animate-pulse"
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} /> */}
      <div className="flex">
        <AdminSidebar isOpen={isSidebarOpen} />

        <main className="flex-1 ml-0 lg:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            {/* top row: title + simple profile / notifications for older users */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  Admin boshqaruv paneli
                </h1>
                <p className="text-gray-600">
                  CodeSchool ta'lim markazingizni boshqaring
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Notification bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    aria-label="Bildirishnomalar"
                    onClick={() => setIsNotifOpen((v) => !v)}
                    className="relative p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    title="Bildirishnomalar"
                  >
                    {/* bell icon (simple SVG) */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118.6 14.6V11a6 6 0 10-12 0v3.6c0 .538-.214 1.055-.595 1.395L4 17h5m6 0a3 3 0 11-6 0h6z"
                      />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications dropdown */}
                  {isNotifOpen && (
                    <div
                      className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50"
                      role="dialog"
                      aria-label="Bildirishnomalar paneli"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b">
                        <strong>Bildirishnomalar</strong>
                        <button
                          onClick={markAllRead}
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          Hammasini o'qilgan deb belgilash
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 && (
                          <div className="p-4 text-sm text-gray-500">
                            Bildirishnoma yo'q
                          </div>
                        )}
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`px-4 py-3 border-b cursor-pointer ${
                              n.read ? "bg-white" : "bg-indigo-50"
                            }`}
                            onClick={() => markAsRead(n.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-800">
                                {n.title}
                              </div>
                              <div className="text-xs text-gray-500 ml-2">
                                {n.time}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t text-center">
                        <button
                          onClick={() => {
                            setIsNotifOpen(false);
                            navigate("/admin/notifications");
                          }}
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          Hammasini ko'rish
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile avatar */}
                <div className="relative" ref={profileRef}>
                  <button
                    aria-label="Hisob menyusi"
                    onClick={() => setIsProfileOpen((v) => !v)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    title="Hisob"
                  >
                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                      {initials}
                    </div>
                    <span className="hidden md:inline-block text-sm text-gray-700">
                      {adminName || "Admin"}
                    </span>
                  </button>

                  {/* Profile dropdown */}
                  {isProfileOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50"
                      role="menu"
                      aria-label="Hisob menyusi"
                    >
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate("/admin/profile");
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50"
                      >
                        Profil
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 hover:bg-red-500"
                      >
                        Chiqish
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* error / retry banner */}
            {error && (
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
                <div className="flex items-center justify-between">
                  <div>{error}</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={retryFetch}
                      className="px-3 py-1 bg-yellow-100 rounded text-sm"
                    >
                      Qayta urinib ko'rish
                    </button>
                    <button
                      onClick={() => setError(null)}
                      className="px-3 py-1 rounded text-sm"
                    >
                      Yopish
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Overview stats - show skeleton while loading */}
            {loading ? <SkeletonOverview /> : <OverviewStats stats={stats} />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-2">
                {loading ? (
                  <SkeletonActivity />
                ) : (
                  <RecentActivity activities={activities} />
                )}
              </div>
              <div>{loading ? <SkeletonQuickActions /> : <QuickActions />}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
