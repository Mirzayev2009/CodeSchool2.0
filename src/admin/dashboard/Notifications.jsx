import React, { useEffect, useRef, useState } from "react";
import AdminSidebar from "../../../components/AdminSidebar";
import {
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getNotificationStats,
} from "../../notifications";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // 'all' | 'unread'
  const [lastFetchAt, setLastFetchAt] = useState(null);
  const mountedRef = useRef(true);
  const timerRef = useRef(null);

  const pollMs = 5000; // Poll every 5 seconds

  useEffect(() => {
    mountedRef.current = true;
    startPolling();
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function fetchNotifications() {
    try {
      setLoading(true);

      // Fetch notifications based on filter
      const notificationsData =
        filter === "unread"
          ? await getUnreadNotifications()
          : await getNotifications();

      // Fetch stats
      const statsData = await getNotificationStats();

      if (!mountedRef.current) return;

      setNotifications(notificationsData);
      setStats(statsData);
      setLastFetchAt(new Date().toLocaleString());
    } catch (error) {
      console.error("fetchNotifications error", error);
      if (!mountedRef.current) return;

      // Show error in UI but don't crash
      if (error.response?.status === 401) {
        alert("Autentifikatsiya xatosi. Iltimos, qayta kiring.");
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }

  function startPolling() {
    fetchNotifications();
    if (timerRef.current) clearTimeout(timerRef.current);

    const loop = async () => {
      if (!mountedRef.current) return;
      await fetchNotifications();
      if (!mountedRef.current) return;
      timerRef.current = setTimeout(loop, pollMs);
    };

    timerRef.current = setTimeout(loop, pollMs);
  }

  async function handleMarkAsRead(notification) {
    if (notification.is_read) return;

    try {
      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );

      // Update on backend
      await markNotificationAsRead(notification.id);

      // Refresh stats
      const statsData = await getNotificationStats();
      setStats(statsData);
    } catch (error) {
      console.error("Mark as read error", error);
      // Revert optimistic update on error
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: false, read_at: null } : n
        )
      );
    }
  }

  async function handleMarkAllAsRead() {
    if (!confirm("Barcha bildirishnomalar o'qilgan deb belgilansinmi?")) return;

    try {
      const unreadIds = notifications
        .filter((n) => !n.is_read)
        .map((n) => n.id);

      if (unreadIds.length === 0) {
        alert("O'qilmagan bildirishnomalar yo'q.");
        return;
      }

      // Optimistically update UI
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          is_read: true,
          read_at: new Date().toISOString(),
        }))
      );

      // Update on backend
      await markAllNotificationsAsRead(unreadIds);

      // Refresh stats
      const statsData = await getNotificationStats();
      setStats(statsData);

      alert(`${unreadIds.length} ta bildirishnoma o'qilgan deb belgilandi.`);
    } catch (error) {
      console.error("Mark all as read error", error);
      // Refresh to get actual state
      fetchNotifications();
    }
  }

  const getNotificationIcon = (type) => {
    const icons = {
      assignment: "📝",
      submission: "✅",
      progress: "📊",
      schedule: "📅",
      payment: "💰",
      announcement: "📢",
      system: "⚙️",
    };
    return icons[type] || "📬";
  };

  const getPriorityStyle = (priority) => {
    if (priority === "high") return "border-l-4 border-red-500 bg-red-50";
    if (priority === "medium")
      return "border-l-4 border-yellow-500 bg-yellow-50";
    return "border-l-4 border-green-500 bg-green-50";
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "—";
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Hozir";
      if (diffMins < 60) return `${diffMins} daqiqa oldin`;
      if (diffHours < 24) return `${diffHours} soat oldin`;
      if (diffDays < 7) return `${diffDays} kun oldin`;
      return date.toLocaleDateString("uz-UZ");
    } catch {
      return String(timestamp);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar isOpen={true} />

        <main className="flex-1 ml-0 lg:ml-64 p-6">
          <div className="max-w-7xl mx-auto h-full">
            <div className="bg-white rounded-xl shadow p-6 h-[calc(100vh-96px)] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold">Bildirishnomalar</h2>
                  <p className="text-sm text-gray-500">
                    Tizim bildirshnomalari va muhim xabarlar
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-600">
                    Oxirgi yangilanish: {lastFetchAt ?? "—"}
                  </div>
                  <button
                    onClick={() => fetchNotifications()}
                    disabled={loading}
                    className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    {loading ? "Yuklanmoqda..." : "Yangilash"}
                  </button>
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Hammasini o'qilgan deb belgilash
                  </button>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded ${
                    filter === "all"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Barchasi {stats && `(${stats.total})`}
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-4 py-2 rounded ${
                    filter === "unread"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  O'qilmaganlar {stats && `(${stats.unread})`}
                </button>
              </div>

              <div className="flex gap-6 h-full">
                {/* Main notification list */}
                <div className="w-2/3 h-full overflow-y-auto border-r pr-4">
                  {loading && notifications.length === 0 && (
                    <div className="p-4 text-center">Yuklanmoqda...</div>
                  )}

                  {!loading && notifications.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                      {filter === "unread"
                        ? "O'qilmagan bildirishnomalar yo'q."
                        : "Hozircha bildirishnomalar yo'q."}
                    </div>
                  )}

                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 mb-3 rounded-lg ${
                        notification.is_read
                          ? "bg-white border border-gray-200"
                          : getPriorityStyle(notification.priority)
                      } cursor-pointer hover:shadow-md transition-shadow`}
                      onClick={() => handleMarkAsRead(notification)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">
                              {getNotificationIcon(
                                notification.notification_type
                              )}
                            </span>
                            <div className="font-semibold text-gray-900">
                              {notification.title}
                            </div>
                            {!notification.is_read && (
                              <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                                Yangi
                              </span>
                            )}
                          </div>

                          <div className="text-sm text-gray-700 mb-2">
                            {notification.message}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{formatTime(notification.created_at)}</span>
                            <span className="capitalize">
                              {notification.notification_type}
                            </span>
                            {notification.recipient_username && (
                              <span>👤 {notification.recipient_username}</span>
                            )}
                          </div>

                          {notification.related_object_info && (
                            <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                              {notification.related_object_info}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {notification.is_read ? (
                            <span className="text-green-600 text-sm">
                              ✓ O'qilgan
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification);
                              }}
                              className="px-3 py-1 rounded text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                            >
                              O'qilgan
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sidebar with stats */}
                <div className="w-1/3 h-full flex flex-col gap-4">
                  {stats && (
                    <div className="p-4 border rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50">
                      <h3 className="font-semibold mb-3">Statistika</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Jami:</span>
                          <span className="font-semibold">{stats.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">O'qilmagan:</span>
                          <span className="font-semibold text-blue-600">
                            {stats.unread}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">O'qilgan:</span>
                          <span className="font-semibold text-green-600">
                            {stats.read}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {stats?.by_type && Object.keys(stats.by_type).length > 0 && (
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-3">Tur bo'yicha</h3>
                      <div className="space-y-2 text-sm">
                        {Object.entries(stats.by_type).map(([type, count]) => (
                          <div key={type} className="flex justify-between">
                            <span className="text-gray-600 capitalize flex items-center gap-1">
                              {getNotificationIcon(type)} {type}
                            </span>
                            <span className="font-semibold">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {stats?.by_priority &&
                    Object.keys(stats.by_priority).length > 0 && (
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-3">
                          Muhimlik darajasi
                        </h3>
                        <div className="space-y-2 text-sm">
                          {Object.entries(stats.by_priority).map(
                            ([priority, count]) => (
                              <div
                                key={priority}
                                className="flex justify-between"
                              >
                                <span className="text-gray-600 capitalize">
                                  {priority === "high" && "🔴"}{" "}
                                  {priority === "medium" && "🟡"}{" "}
                                  {priority === "low" && "🟢"} {priority}
                                </span>
                                <span className="font-semibold">{count}</span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h3 className="font-semibold mb-2 text-blue-900">
                      💡 Maslahat
                    </h3>
                    <div className="text-sm text-blue-800">
                      Bildirishnomani o'qish uchun ustiga bosing. Tizim
                      avtomatik ravishda yangi bildirishnomalarni{" "}
                      {pollMs / 1000} soniya ichida tekshiradi.
                    </div>
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
