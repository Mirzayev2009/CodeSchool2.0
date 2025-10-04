import React, { useEffect, useState, useRef } from "react";
import {
  Plus,
  Calendar,
  Save,
  RefreshCw,
  Globe,
  UploadCloud,
  DownloadCloud,
  Mail,
  Settings,
  Bell,
  Trash2,
} from "lucide-react";
import AdminSidebar from "../../../components/AdminSidebar";
import {
  createNotificationAdmin,
  getNotifications,
  deleteNotification,
  getMyNotificationPreferences,
  updateMyNotificationPreferences,
} from "../../notifications";

// Settings storage key + defaults
const SETTINGS_KEY = "admin_app_settings_v1";
const DEFAULT_SETTINGS = {
  theme: "system",
  language: "uz",
  itemsPerPage: 20,
  showHints: true,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) || {}) };
  } catch (e) {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(s) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch (e) {
    console.warn("Could not save settings", e);
  }
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(() => loadSettings());
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prefsLoading, setPrefsLoading] = useState(false);

  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    notification_type: "announcement",
    recipient_role: "all",
    recipient_id: null,
    priority: "medium",
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
  }, []);

  async function fetchNotifications() {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("fetchNotifications error", error);
      if (error.response?.status === 401) {
        alert("Autentifikatsiya xatosi. Iltimos, qayta kiring.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchPreferences() {
    try {
      setPrefsLoading(true);
      const data = await getMyNotificationPreferences();
      setPreferences(data);
    } catch (error) {
      console.error("fetchPreferences error", error);
      // If preferences don't exist, that's okay
      if (error.response?.status !== 404) {
        console.warn("Could not load preferences");
      }
    } finally {
      setPrefsLoading(false);
    }
  }

  async function handleAddNotification() {
    if (!newNotification.title.trim()) {
      return alert("Bildirishnoma sarlavhasini kiriting!");
    }
    if (!newNotification.message.trim()) {
      return alert("Bildirishnoma xabarini kiriting!");
    }

    try {
      const data = {
        title: newNotification.title,
        message: newNotification.message,
        notification_type: newNotification.notification_type,
        recipient_role: newNotification.recipient_role,
        priority: newNotification.priority,
      };

      // Add recipient_id if specified and not sending to all
      if (
        newNotification.recipient_role !== "all" &&
        newNotification.recipient_id
      ) {
        data.recipient_id = Number(newNotification.recipient_id);
      }

      const created = await createNotificationAdmin(data);

      setNotifications((prev) => [created, ...prev]);
      setNewNotification({
        title: "",
        message: "",
        notification_type: "announcement",
        recipient_role: "all",
        recipient_id: null,
        priority: "medium",
      });

      alert("Bildirishnoma muvaffaqiyatli yuborildi!");
    } catch (error) {
      console.error("Add notification error", error);

      if (error.response?.status === 403) {
        alert("Sizda bildirishnoma yuborish huquqi yo'q.");
      } else if (error.response?.status === 400) {
        alert("Ma'lumotlar noto'g'ri. Barcha maydonlarni to'ldiring.");
      } else {
        alert("Xatolik yuz berdi. Konsolni tekshiring.");
      }
    }
  }

  async function handleDeleteNotification(id) {
    if (!confirm("Ushbu bildirishnomani o'chirmoqchimisiz?")) return;

    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      alert("Bildirishnoma o'chirildi.");
    } catch (error) {
      console.error("Delete notification error", error);
      alert("O'chirishda xatolik. Qayta urinib ko'ring.");
    }
  }

  async function handleSavePreferences() {
    if (!preferences) return;

    try {
      const updated = await updateMyNotificationPreferences(preferences);
      setPreferences(updated);
      alert("Bildirishnoma sozlamalari saqlandi!");
    } catch (error) {
      console.error("Save preferences error", error);
      alert("Sozlamalarni saqlashda xatolik.");
    }
  }

  function handleSaveSettings() {
    saveSettings(settings);
    alert("Tizim sozlamalari saqlandi!");
  }

  function handleResetSettings() {
    if (!confirm("Barcha sozlamalarni tiklashni xohlaysizmi?")) return;
    setSettings({ ...DEFAULT_SETTINGS });
    saveSettings({ ...DEFAULT_SETTINGS });
    alert("Sozlamalar tiklandi!");
  }

  function handleExportSettings() {
    try {
      const exportData = {
        settings,
        preferences,
        exportedAt: new Date().toISOString(),
      };
      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `admin-settings-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed", e);
      alert("Export qilishda xatolik.");
    }
  }

  function handleImportClick() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  function handleImportFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(String(ev.target?.result || "{}"));

        if (parsed.settings) {
          const merged = { ...DEFAULT_SETTINGS, ...parsed.settings };
          setSettings(merged);
          saveSettings(merged);
        }

        if (parsed.preferences) {
          setPreferences(parsed.preferences);
        }

        alert("Sozlamalar import qilindi!");
      } catch (err) {
        console.error(err);
        alert("Noto'g'ri JSON fayl.");
      }
    };
    reader.readAsText(f);
    e.target.value = "";
  }

  const getNotificationTypeLabel = (type) => {
    const labels = {
      assignment: "Vazifa",
      submission: "Topshiriq",
      progress: "Progress",
      schedule: "Jadval",
      payment: "To'lov",
      announcement: "E'lon",
      system: "Tizim",
    };
    return labels[type] || type;
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      high: "Yuqori",
      medium: "O'rta",
      low: "Past",
    };
    return labels[priority] || priority;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("uz-UZ");
    } catch {
      return String(dateString);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar isOpen={true} />

      <div className="ml-0 lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin — Sozlamalar va Bildirishnomalar
            </h1>
            <p className="text-gray-600">
              Tizim bildirishnomalarini boshqarish va sozlamalarni o'zgartirish
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Notifications management */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Bell size={20} /> Bildirishnoma yuborish
              </h2>

              {/* Add form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sarlavha *
                  </label>
                  <input
                    value={newNotification.title}
                    onChange={(e) =>
                      setNewNotification({
                        ...newNotification,
                        title: e.target.value,
                      })
                    }
                    placeholder="Bildirishnoma sarlavhasi"
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xabar *
                  </label>
                  <textarea
                    value={newNotification.message}
                    onChange={(e) =>
                      setNewNotification({
                        ...newNotification,
                        message: e.target.value,
                      })
                    }
                    placeholder="Batafsil xabar matni..."
                    rows={4}
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Turi
                    </label>
                    <select
                      value={newNotification.notification_type}
                      onChange={(e) =>
                        setNewNotification({
                          ...newNotification,
                          notification_type: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                    >
                      <option value="announcement">E'lon</option>
                      <option value="assignment">Vazifa</option>
                      <option value="submission">Topshiriq</option>
                      <option value="progress">Progress</option>
                      <option value="schedule">Jadval</option>
                      <option value="payment">To'lov</option>
                      <option value="system">Tizim</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Muhimlik
                    </label>
                    <select
                      value={newNotification.priority}
                      onChange={(e) =>
                        setNewNotification({
                          ...newNotification,
                          priority: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                    >
                      <option value="high">Yuqori</option>
                      <option value="medium">O'rta</option>
                      <option value="low">Past</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kimga
                    </label>
                    <select
                      value={newNotification.recipient_role}
                      onChange={(e) =>
                        setNewNotification({
                          ...newNotification,
                          recipient_role: e.target.value,
                          recipient_id: null,
                        })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                    >
                      <option value="all">Hammaga</option>
                      <option value="admin">Adminlarga</option>
                      <option value="teacher">O'qituvchilarga</option>
                      <option value="student">O'quvchilarga</option>
                    </select>
                  </div>

                  {newNotification.recipient_role !== "all" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Foydalanuvchi ID (ixtiyoriy)
                      </label>
                      <input
                        type="number"
                        value={newNotification.recipient_id || ""}
                        onChange={(e) =>
                          setNewNotification({
                            ...newNotification,
                            recipient_id: e.target.value
                              ? Number(e.target.value)
                              : null,
                          })
                        }
                        placeholder="Muayyan foydalanuvchi"
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAddNotification}
                  className="w-full bg-indigo-600 text-white px-4 py-3 rounded flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
                >
                  <Plus size={18} /> Bildirishnoma yuborish
                </button>
              </div>

              {/* Notifications list */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Oxirgi bildirishnomalar</h3>
                  <button
                    onClick={fetchNotifications}
                    disabled={loading}
                    className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <RefreshCw
                      size={14}
                      className={loading ? "animate-spin" : ""}
                    />
                    {loading ? "Yuklanmoqda..." : "Yangilash"}
                  </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-gray-500 text-sm text-center py-4">
                      Hozircha bildirishnomalar yo'q
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((n) => (
                      <div
                        key={n.id}
                        className="border border-gray-200 p-3 rounded hover:bg-gray-50 transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{n.title}</div>
                            <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {n.message}
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <span className="bg-gray-100 px-2 py-0.5 rounded">
                                {getNotificationTypeLabel(n.notification_type)}
                              </span>
                              <span>{formatDate(n.created_at)}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteNotification(n.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="O'chirish"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Settings & Preferences */}
            <div className="space-y-6">
              {/* Notification Preferences */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Settings size={20} /> Bildirishnoma sozlamalari
                </h2>

                {prefsLoading ? (
                  <div className="text-center py-4 text-gray-500">
                    Yuklanmoqda...
                  </div>
                ) : preferences ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.email_notifications}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              email_notifications: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">Email bildirishnomalar</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.push_notifications}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              push_notifications: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">Push bildirishnomalar</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.assignment_notifications}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              assignment_notifications: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">Vazifa bildirshnomalari</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.submission_notifications}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              submission_notifications: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">
                          Topshiriq bildirshnomalari
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.progress_notifications}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              progress_notifications: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">
                          Progress bildirshnomalari
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.payment_notifications}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              payment_notifications: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm">To'lov bildirshnomalari</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bildirishnoma chastotasi
                      </label>
                      <select
                        value={preferences.digest_frequency}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            digest_frequency: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                      >
                        <option value="immediate">Darhol</option>
                        <option value="daily">Kunlik</option>
                        <option value="weekly">Haftalik</option>
                      </select>
                    </div>

                    <button
                      onClick={handleSavePreferences}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-indigo-700"
                    >
                      <Save size={16} /> Sozlamalarni saqlash
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Sozlamalar topilmadi
                  </div>
                )}
              </div>

              {/* System Settings */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Tizim sozlamalari
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Settings size={14} /> Mavzu
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) =>
                        setSettings({ ...settings, theme: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                    >
                      <option value="system">Tizim</option>
                      <option value="light">Yorug'</option>
                      <option value="dark">Qorong'</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Globe size={14} /> Til
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) =>
                        setSettings({ ...settings, language: e.target.value })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                    >
                      <option value="uz">O'zbek</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Elementlar sahifada
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={200}
                      value={settings.itemsPerPage}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          itemsPerPage: Number(e.target.value),
                        })
                      }
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showHints}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            showHints: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-sm">Ko'rsatmalarni ko'rsatish</span>
                    </label>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSaveSettings}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-indigo-700"
                    >
                      <Save size={16} /> Saqlash
                    </button>
                    <button
                      onClick={handleResetSettings}
                      className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                    >
                      Tiklash
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleExportSettings}
                      className="flex-1 px-4 py-2 rounded bg-gray-50 border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-100"
                    >
                      <DownloadCloud size={14} /> Export
                    </button>
                    <button
                      onClick={handleImportClick}
                      className="flex-1 px-4 py-2 rounded bg-gray-50 border border-gray-300 flex items-center justify-center gap-2 hover:bg-gray-100"
                    >
                      <UploadCloud size={14} /> Import
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {settings.showHints && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    💡 Yordam
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Bildirishnomalar real vaqtda yuboriladi</li>
                    <li>• Faqat adminlar bildirishnoma yuborishi mumkin</li>
                    <li>• Sozlamalar localStorage'da saqlanadi</li>
                    <li>
                      • Export/Import orqali sozlamalarni nusxalash mumkin
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
