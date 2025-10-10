

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/AdminSidebar";
import QuickActions from "./QuickActions";
import OverviewStats from "./OverviewStats";
import RecentActivity from "./RecentActivity"
import {
  getDashboard,
  getPayments,
  getStudents,
  getGroups,
  getTeachers, // <-- added
} from "../API/AdminPanelApi";;

// notification API helpers (adjust the import path if your project uses a different alias)
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/notifications";

function getTokenFromStorage() {
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
  const [teachers, setTeachers] = useState([]);

  // raw API notifications (keeps server shape — useful when marking read)
  const [apiNotifications, setApiNotifications] = useState([]);
  
  // UI notifications (derived from apiNotifications or activities)
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // UI state for the notification dropdown
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const notifControllerRef = useRef(null);

  // notification / profile UI state
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fetch dashboard + payments + students + groups + teachers + notifications (initial mount)
  useEffect(() => {
    let mounted = true;
    const token = getTokenFromStorage();

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

        const [
          dbRes,
          paysRes,
          studsRes,
          groupsRes,
          teachersRes,
          notsRes,
        ] = await Promise.allSettled([
          getDashboard(token),
          getPayments(token),
          getStudents(token),
          getGroups(token),
          getTeachers(token),
          getNotifications(token),
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
        const tchs = extract(teachersRes);
        const nots = extract(notsRes);

        if (!mounted) return;

        setDashboardRaw(db ?? null);

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

        const teachersList = Array.isArray(tchs)
          ? tchs
          : (tchs && (tchs.results ?? tchs.data ?? [])) || [];
        setTeachers(teachersList);

        const notificationsList = Array.isArray(nots)
          ? nots
          : (nots && (nots.results ?? nots.data ?? [])) || [];
        setApiNotifications(notificationsList);

        // Note: intentionally do NOT inject any sample/fake data.
        // If the server returns no data, we simply keep empty arrays/objects.
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Dashboard fetch error", err);
        setError(err?.message ?? "Dashboard ma'lumotlarini olishda noma'lum xato");
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

  // build stats — no sample fallbacks, only real data or empty strings
  const stats = useMemo(() => {
    try {
      const totalStudents =
        dashboardRaw?.total_students ?? (students.length ? students.length : "");

      let activeTeachers = dashboardRaw?.active_teachers ?? (teachers.length ? teachers.length : "");

      if ((activeTeachers === null || activeTeachers === undefined) && groups.length) {
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
        activeTeachers = setT.size || "";
      }

      const runningClasses = dashboardRaw?.running_classes ?? (groups.length ? groups.length : "");

      let revenue = dashboardRaw?.monthly_revenue;
      if (revenue == null) {
        const sum = payments.reduce((s, p) => {
          const amt = Number(p.amount ?? p.total ?? p.price ?? 0);
          return s + (Number.isFinite(amt) ? amt : 0);
        }, 0);
        revenue = sum ? `$${sum.toLocaleString()}` : "";
      } else {
        if (typeof revenue === "number") revenue = `$${revenue.toLocaleString()}`;
      }

      return [
        {
          name: "Jami talabalar",
          value: totalStudents === undefined || totalStudents === null ? "" : String(totalStudents),
          change: dashboardRaw?.students_change ?? "",
          changeType: "increase",
          icon: "ri-graduation-cap-line",
          color: "blue",
        },
        {
          name: "Faol o'qituvchilar",
          value: activeTeachers === undefined || activeTeachers === null ? "" : String(activeTeachers),
          change: dashboardRaw?.teachers_change ?? "",
          changeType: "increase",
          icon: "ri-user-star-line",
          color: "green",
        },
        {
          name: "Faol darslar",
          value: runningClasses === undefined || runningClasses === null ? "" : String(runningClasses),
          change: dashboardRaw?.classes_change ?? "",
          changeType: "increase",
          icon: "ri-group-line",
          color: "purple",
        },
        {
          name: "Bu oy daromadi",
          value: revenue ?? "",
          change: dashboardRaw?.revenue_change ?? "",
          changeType: "increase",
          icon: "ri-money-dollar-circle-line",
          color: "orange",
        },
      ];
    } catch (err) {
      console.error("Error building stats", err);
      // return empty values if something fails
      return [
        { name: "Jami talabalar", value: "", change: "", changeType: "increase", icon: "ri-graduation-cap-line", color: "blue" },
        { name: "Faol o'qituvchilar", value: "", change: "", changeType: "increase", icon: "ri-user-star-line", color: "green" },
        { name: "Faol darslar", value: "", change: "", changeType: "increase", icon: "ri-group-line", color: "purple" },
        { name: "Bu oy daromadi", value: "", change: "", changeType: "increase", icon: "ri-money-dollar-circle-line", color: "orange" },
      ];
    }
  }, [dashboardRaw, students, groups, payments, teachers]);

  // build activity list — only real activities, no sample fallback
  const activities = useMemo(() => {
    try {
      const acts = [];

      const paysSorted = [...payments].slice(0, 6);
      paysSorted.forEach((p) => {
        const payerName =
          p.payer_name ?? p.name ?? (p.student && (p.student.full_name ?? p.student.name)) ?? "Noma'lum";
        const status = (p.status ?? p.payment_status ?? "").toString().toLowerCase();
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
          icon: status === "overdue" ? "ri-error-warning-line" : "ri-money-dollar-circle-line",
          color: status === "overdue" ? "orange" : "emerald",
        });
      });

      const studsSorted = [...students].slice(0, 6);
      studsSorted.forEach((s) => {
        const name = s.full_name ?? s.name ?? (`${s.first_name ?? ""} ${s.last_name ?? ""}`.trim() || "Talaba");
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

      if (acts.length === 0) return [];

      const withDates = acts.map((a) => {
        const t = a.time ? new Date(a.time) : new Date(0);
        return { ...a, _t: isNaN(t.getTime()) ? 0 : t.getTime() };
      });
      withDates.sort((a, b) => b._t - a._t);
      return withDates.map(({ _t, ...rest }) => rest);
    } catch (err) {
      console.error("Error building activities", err);
      return [];
    }
  }, [payments, students]);


useEffect(() => {
  // if still not loaded, keep current UI (or show loading skeleton via notifLoading)
  if (apiNotifications === null) return;

  // if server returned items -> show them; otherwise keep list empty (no fallback)
  if (Array.isArray(apiNotifications) && apiNotifications.length > 0) {
    const nots = apiNotifications.slice(0, 6).map((s, i) => {
      const title = s.title ?? s.message ?? s.body ?? s.text ?? s.name ?? s.event ?? "Bildirishnoma";
      const time = s.created_at ?? s.timestamp ?? s.date ?? s.time ?? "";
      const read = !!(s.read ?? s.is_read ?? s.seen ?? false);
      const type = s.type ?? s.category ?? "info";
      return { id: s.id ?? `n-api-${i}`, title, time, read, type };
    });
    setNotifications(nots);
  } else {
    // explicit: no server notifications -> show empty list (no activity fallback)
    setNotifications([]);
  }
}, [apiNotifications]);

  // function to refresh notifications from server (used when opening dropdown and after actions)
  const refreshNotifications = async () => {
    const token = getTokenFromStorage();
    if (!token) return;

    if (notifControllerRef.current) {
      try {
        notifControllerRef.current.abort();
      } catch (e) {
        /* ignore */
      }
    }

    const controller = new AbortController();
    notifControllerRef.current = controller;

    try {
      setNotifLoading(true);
      const res = await getNotifications(token, { signal: controller.signal });
      const list = Array.isArray(res) ? res : (res && (res.results ?? res.data ?? [])) || [];
      setApiNotifications(list);
    } catch (err) {
      if (err && err.name === "AbortError") return;
      console.error("Failed to refresh notifications", err);
    } finally {
      setNotifLoading(false);
      notifControllerRef.current = null;
    }
  };

  // mark single notification as read (optimistic UI + API call)
  const markAsRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setApiNotifications((prev) => prev.map((s) => (s.id === id ? { ...s, read: true, is_read: true, seen: true } : s)));

    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("No auth token");
      await markNotificationAsRead(id, token);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
      refreshNotifications();
    }
  };

  // mark all as read
  const markAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (!unreadIds.length) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setApiNotifications((prev) => prev.map((s) => ({ ...s, read: true, is_read: true, seen: true })));

    try {
      const token = getTokenFromStorage();
      if (!token) throw new Error("No auth token");
      await markAllNotificationsAsRead(unreadIds, token);
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
      refreshNotifications();
    }
  };

  // open a notification (mark read + navigate to a details page)
  const handleOpenNotification = (n) => {
    if (!n.read) markAsRead(n.id);
    setIsNotifOpen(false);
    navigate(`/admin/notifications/${n.id}`);
  };

  // close popovers on outside click
  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
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

  // adminName / initials / logout / retryFetch / skeletons / rendering (unchanged)
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
    setError(null);
    setLoading(true);
    window.location.reload();
  };

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
        <div key={i} className="h-12 bg-white rounded-lg shadow animate-pulse" />
      ))}
    </div>
  );

  const NotifSkeleton = () => (
    <div className="p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="mb-3 flex items-center gap-3">
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-3 w-3/4 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar isOpen={isSidebarOpen} />

        <main className="flex-1 ml-0 lg:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Admin boshqaruv paneli</h1>
                <p className="text-gray-600">CodeSchool ta'lim markazingizni boshqaring</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Notification bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    aria-label="Bildirishnomalar"
                    onClick={async () => {
                      const newState = !isNotifOpen;
                      setIsNotifOpen(newState);
                      if (newState) await refreshNotifications();
                    }}
                    className="relative p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    title="Bildirishnomalar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118.6 14.6V11a6 6 0 10-12 0v3.6c0 .538-.214 1.055-.595 1.395L4 17h5m6 0a3 3 0 11-6 0h6z" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">{unreadCount}</span>
                    )}
                  </button>

                  {/* Notifications dropdown */}
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50" role="dialog" aria-label="Bildirishnomalar paneli">
                      <div className="flex items-center justify-between px-4 py-3 border-b">
                        <strong>Bildirishnomalar</strong>
                        <div className="flex items-center gap-3">
                          <button onClick={markAllRead} className="text-sm text-indigo-600 hover:underline">Hammasini o'qilgan deb belgilash</button>
                          {notifLoading && (
                            <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifLoading ? (
                          <NotifSkeleton />
                        ) : notifications.length === 0 ? (
                          <div className="p-4 text-sm text-gray-500">Bildirishnoma yo'q</div>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.id} className={`px-4 py-3 border-b cursor-pointer ${n.read ? "bg-white" : "bg-indigo-50"}`} onClick={() => handleOpenNotification(n)}>
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-800">{n.title}</div>
                                <div className="text-xs text-gray-500 ml-2">{n.time}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-3 border-t text-center">
                        <button onClick={() => { setIsNotifOpen(false); navigate("/admin/notifications"); }} className="text-sm text-indigo-600 hover:underline">Hammasini ko'rish</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile avatar */}
                <div className="relative" ref={profileRef}>
                  <button aria-label="Hisob menyusi" onClick={() => setIsProfileOpen((v) => !v)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300" title="Hisob">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">{initials}</div>
                    <span className="hidden md:inline-block text-sm text-gray-700">{adminName || "Admin"}</span>
                  </button>

                  {/* Profile dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50" role="menu" aria-label="Hisob menyusi">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-red-500">Chiqish</button>
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
                    <button onClick={retryFetch} className="px-3 py-1 bg-yellow-100 rounded text-sm">Qayta urinib ko'rish</button>
                    <button onClick={() => setError(null)} className="px-3 py-1 rounded text-sm">Yopish</button>
                  </div>
                </div>
              </div>
            )}

            {/* Overview stats - show skeleton while loading */}
            {loading ? <SkeletonOverview /> : <OverviewStats stats={stats} />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-2">
                {loading ? <SkeletonActivity /> : <RecentActivity activities={activities} />}
              </div>
              <div>{loading ? <SkeletonQuickActions /> : <QuickActions />}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


// // src/notificationsApi.js (kept for convenience)
// const BASE_URL = 'https://sanjar1718.pythonanywhere.com';

// async function request(path, token, { method = 'GET', body = null, signal = undefined, headers = {} } = {}) {
//   const hdrs = { Accept: 'application/json', ...headers };
//   const usedToken = token || (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null);
//   if (usedToken) hdrs['Authorization'] = `Token ${usedToken}`;
//   if (body && !(body instanceof FormData)) { hdrs['Content-Type'] = 'application/json'; body = JSON.stringify(body); }
//   const res = await fetch(`${BASE_URL}${path}`, { method, headers: hdrs, body, signal });
//   const text = await res.text();
//   let data = null; try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
//   if (!res.ok) { const err = new Error(`Request failed (${res.status})`); err.status = res.status; err.body = data; throw err; }
//   return data;
// }

// export function getNotifications(token, opts = {}) { return request('/api/notifications/', token, opts); }
// export function markNotificationAsRead(id, token, opts = {}) { return request(`/api/notifications/${id}/mark_read/`, token, { method: 'POST', body: {}, ...opts }); }
// export function markAllNotificationsAsRead(notificationIds = [], token, opts = {}) { return request('/api/notifications/mark_all_read/', token, { method: 'POST', body: { notification_ids: notificationIds }, ...opts }); }
// export { request };
