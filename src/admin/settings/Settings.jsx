import React, { useEffect, useMemo, useState } from "react";
import {
  Globe,
  MessageSquare,
  List,
  CheckSquare,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Calendar,
  Tag,
  Save,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import AdminSidebar from "../../../components/AdminSidebar";

/**
 * AdminSettingsPage.jsx
 * - Single-screen: left = To-dos (50%), right = Settings (50%)
 * - No backups, no reset, no session timeout
 * - LocalStorage persistence for both todos and settings
 */

const SETTINGS_KEY = "admin_core_settings_v1";
const TODOS_KEY = "admin_todos_v1";

const DEFAULT_SETTINGS = {
  platformName: "XCourse",
  contactEmail: "support@xcourse.com",
  defaultRole: "Student", // Student | Teacher | Admin
  autoApproveStudents: false,
  emailNotifications: true,
  announcementEnabled: true,
  announcementText: "Welcome — short updates appear here.",
  systemTone: "Neutral", // Relaxed | Neutral | Strict
  showCompletedTasks: true,
};

const DEFAULT_TODOS = [
  {
    id: `${Date.now()}-1`,
    title: "Approve pending student signups",
    notes: "Review 12 pending signups in Supabase registration table.",
    priority: "High",
    dueDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    done: false,
    createdAt: new Date().toISOString(),
    tag: "Users",
  },
  {
    id: `${Date.now()}-2`,
    title: "Publish next week's schedule",
    notes: "Confirm rooms & teachers before publishing.",
    priority: "Medium",
    dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    done: false,
    createdAt: new Date().toISOString(),
    tag: "Content",
  },
  {
    id: `${Date.now()}-3`,
    title: "Review payment reconciliations",
    notes: "Match bank transfers to invoices for last 7 days.",
    priority: "High",
    dueDate: null,
    done: false,
    createdAt: new Date().toISOString(),
    tag: "Finance",
  },
  {
    id: `${Date.now()}-4`,
    title: "Draft webinar promo message",
    notes: "Short reel — add CTA to xcourse.tohirovdev.uz",
    priority: "Low",
    dueDate: null,
    done: true,
    createdAt: new Date().toISOString(),
    tag: "Marketing",
  },
];

function safeParse(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export default function AdminSettingsPage() {
  // sidebar open by default to match other pages
  const [isSidebarOpen] = useState(true);

  // Settings
  const [settings, setSettings] = useState(() => safeParse(SETTINGS_KEY, DEFAULT_SETTINGS));
  const [settingsSavedMsg, setSettingsSavedMsg] = useState("");

  // Todos
  const [todos, setTodos] = useState(() => safeParse(TODOS_KEY, DEFAULT_TODOS));
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  // UI: search & filters & selection
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all / active / completed
  const [priorityFilter, setPriorityFilter] = useState("all"); // all/High/Medium/Low
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // persist settings & todos immediately
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
    } catch {}
  }, [todos]);

  // Derived stats
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.done).length;
    const active = total - completed;
    const overdue = todos.filter((t) => {
      if (!t.dueDate || t.done) return false;
      const d = new Date(t.dueDate);
      const now = new Date();
      // compare to midnight today: we treat same-day as not overdue
      return d < new Date(now.toISOString().slice(0, 10));
    }).length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, active, overdue, progress };
  }, [todos]);

  // Filtered & sorted todos
  const filteredTodos = useMemo(() => {
    return todos
      .filter((t) => {
        if (statusFilter === "active" && t.done) return false;
        if (statusFilter === "completed" && !t.done) return false;
        if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            (t.title && t.title.toLowerCase().includes(q)) ||
            (t.notes && t.notes.toLowerCase().includes(q)) ||
            (t.tag && t.tag.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        // sort: undone with nearest dueDate first, then priority High > Medium > Low, then createdAt
        if (a.done !== b.done) return a.done ? 1 : -1;
        if (a.dueDate && b.dueDate) {
          const d = new Date(a.dueDate) - new Date(b.dueDate);
          if (d !== 0) return d;
        } else if (a.dueDate) return -1;
        else if (b.dueDate) return 1;

        const prioMap = { High: 0, Medium: 1, Low: 2 };
        if (prioMap[a.priority] !== prioMap[b.priority]) return prioMap[a.priority] - prioMap[b.priority];

        return new Date(a.createdAt) - new Date(b.createdAt);
      });
  }, [todos, search, statusFilter, priorityFilter]);

  // helpers for todos
  const createTodo = (payload) => {
    const next = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: (payload && payload.title) || "New task",
      notes: (payload && payload.notes) || "",
      priority: (payload && payload.priority) || "Medium",
      dueDate: (payload && payload.dueDate) || null,
      done: false,
      createdAt: new Date().toISOString(),
      tag: (payload && payload.tag) || "General",
    };
    setTodos((t) => [next, ...t]);
    return next;
  };

  const addNewTodoFromInput = () => {
    const title = newTodoTitle.trim();
    if (!title) return;
    createTodo({ title, priority: "Medium" });
    setNewTodoTitle("");
  };

  const toggleTodoDone = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const updateTodo = (id, patch) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const deleteTodo = (id) => {
    if (!confirm("Delete task? This action cannot be undone.")) return;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    setSelectedIds((s) => s.filter((x) => x !== id));
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const markSelectedDone = () => {
    if (selectedIds.length === 0) return;
    setTodos((prev) => prev.map((t) => (selectedIds.includes(t.id) ? { ...t, done: true } : t)));
    setSelectedIds([]);
  };

  const deleteSelected = () => {
    if (!confirm(`Delete ${selectedIds.length} selected tasks?`)) return;
    setTodos((prev) => prev.filter((t) => !selectedIds.includes(t.id)));
    setSelectedIds([]);
  };

  const clearCompleted = () => {
    if (!confirm("Delete all completed tasks?")) return;
    setTodos((prev) => prev.filter((t) => !t.done));
  };

  const toggleAllDone = () => {
    const allDone = todos.every((t) => t.done);
    setTodos((prev) => prev.map((t) => ({ ...t, done: !allDone })));
  };

  // Quick templates for admin tasks
  const QUICK_TEMPLATES = [
    { title: "Approve pending signups", priority: "High", tag: "Users" },
    { title: "Publish course schedule", priority: "Medium", tag: "Content" },
    { title: "Check today's payments", priority: "High", tag: "Finance" },
    { title: "Create promo reel", priority: "Low", tag: "Marketing" },
  ];

  // settings handlers
  const handleSettingChange = (key, value) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  const saveSettings = () => {
    // already persisted on change, but provide feedback
    setSettingsSavedMsg("Saved ✓");
    setTimeout(() => setSettingsSavedMsg(""), 1400);
  };

  // small util for formatting due date and overdue tag
  const dueInfo = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    const today = new Date(new Date().toISOString().slice(0, 10));
    const diffDays = Math.ceil((dt - today) / (24 * 3600 * 1000));
    if (diffDays < 0) return { label: `${Math.abs(diffDays)}d overdue`, overdue: true };
    if (diffDays === 0) return { label: "Due today", overdue: false };
    return { label: `Due in ${diffDays}d`, overdue: false };
  };

  // small progress bar component
  const ProgressBar = ({ value }) => (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div style={{ width: `${value}%` }} className="h-2 bg-indigo-600" />
    </div>
  );

  // UI return
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar isOpen={isSidebarOpen} />

        <main className="flex-1 ml-0 lg:ml-64 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Admin — Tasks & Core Settings</h1>
                <p className="text-sm text-gray-600">
                  Half the screen is for quick admin to-dos; the other half is only meaningful platform settings.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-500 text-right">
                  <div className="text-gray-500">Progress</div>
                  <div className="font-medium text-gray-900">{stats.progress}%</div>
                </div>

                <button
                  onClick={() => {
                    setTodos(DEFAULT_TODOS);
                    setSettings(DEFAULT_SETTINGS);
                    setSettingsSavedMsg("Reset to sample data");
                    setTimeout(() => setSettingsSavedMsg(""), 1400);
                  }}
                  title="Load sample data (for testing)"
                  className="px-3 py-2 rounded-md text-sm border hover:bg-gray-100"
                >
                  Sample
                </button>

                <button
                  onClick={() => saveSettings()}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Save size={14} /> Save
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT: TODOS */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                {/* Top: quick-add + templates */}
                <div className="flex gap-2 items-start mb-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">New admin task</label>
                    <div className="flex gap-2 mt-1">
                      <input
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") addNewTodoFromInput();
                        }}
                        placeholder="e.g. Approve 5 signups"
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                      />
                      <button
                        onClick={addNewTodoFromInput}
                        className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                        title="Add task"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setQuickAddOpen((s) => !s)}
                      className="px-3 py-2 border rounded-md text-sm flex items-center gap-2"
                      aria-expanded={quickAddOpen}
                    >
                      Templates <ChevronDown size={14} />
                    </button>
                    {quickAddOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow z-20 p-3">
                        <div className="text-xs text-gray-600 mb-2">Quick templates</div>
                        <div className="grid gap-2">
                          {QUICK_TEMPLATES.map((t) => (
                            <button
                              key={t.title}
                              onClick={() => {
                                createTodo({ title: t.title, priority: t.priority, tag: t.tag });
                                setQuickAddOpen(false);
                              }}
                              className="text-left px-2 py-2 rounded hover:bg-gray-50 text-sm border"
                            >
                              <div className="font-medium">{t.title}</div>
                              <div className="text-xs text-gray-500">{t.tag} · {t.priority}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Filters row */}
                <div className="flex gap-2 items-center mb-3">
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md flex-1">
                    <Search size={16} />
                    <input
                      placeholder="Search tasks, notes, tags..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="bg-transparent text-sm w-full outline-none"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">Any priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Stats and bulk actions */}
                <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                  <div className="flex gap-3">
                    <div>Total: <span className="font-medium text-gray-800">{stats.total}</span></div>
                    <div>Active: <span className="font-medium text-gray-800">{stats.active}</span></div>
                    <div>Done: <span className="font-medium text-gray-800">{stats.completed}</span></div>
                    <div>Overdue: <span className="font-medium text-red-600">{stats.overdue}</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleAllDone}
                      className="px-2 py-1 text-sm border rounded-md hover:bg-gray-50"
                    >
                      Toggle all
                    </button>
                    <button
                      onClick={markSelectedDone}
                      className="px-2 py-1 text-sm border rounded-md hover:bg-gray-50"
                    >
                      Mark selected done
                    </button>
                    <button
                      onClick={deleteSelected}
                      className="px-2 py-1 text-sm border rounded-md text-red-600 hover:bg-red-50"
                    >
                      Delete selected
                    </button>
                    <button
                      onClick={clearCompleted}
                      className="px-2 py-1 text-sm border rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Clear completed
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <ProgressBar value={stats.progress} />
                </div>

                {/* Todo list */}
                <div className="space-y-2 max-h-[56vh] overflow-auto pr-2">
                  {filteredTodos.length === 0 && (
                    <div className="text-sm text-gray-500 py-6 text-center">No tasks found.</div>
                  )}

                  {filteredTodos.map((t) => {
                    const dInfo = dueInfo(t.dueDate);
                    return (
                      <div
                        key={t.id}
                        className={`p-3 rounded-md border ${t.done ? "bg-gray-50" : "bg-white"} flex items-start gap-3`}
                      >
                        <div className="flex flex-col items-center">
                          <input
                            type="checkbox"
                            checked={t.done}
                            onChange={() => toggleTodoDone(t.id)}
                            className="h-5 w-5"
                          />
                          <div className="text-xs text-gray-400 mt-2">{t.tag}</div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className={`text-sm font-medium ${t.done ? "line-through text-gray-500" : "text-gray-900"}`}>
                                {t.title}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{t.notes}</div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-2">
                                <div className={`px-2 py-0.5 text-xs rounded-full ${
                                  t.priority === "High" ? "bg-red-100 text-red-700" :
                                  t.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                  "bg-green-100 text-green-700"
                                }`}>
                                  {t.priority}
                                </div>

                                {dInfo && (
                                  <div className={`text-xs ${dInfo.overdue ? "text-red-600" : "text-gray-600"}`}>
                                    {dInfo.label}
                                  </div>
                                )}

                                <div className="flex gap-1">
                                  <button
                                    title="Edit"
                                    onClick={() => setEditingId((s) => (s === t.id ? null : t.id))}
                                    className="p-1 rounded hover:bg-gray-100"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    title="Delete"
                                    onClick={() => deleteTodo(t.id)}
                                    className="p-1 rounded hover:bg-red-50 text-red-600"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Inline editor */}
                          {editingId === t.id && (
                            <div className="mt-3 border-t pt-3 text-sm">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <input
                                  value={t.title}
                                  onChange={(e) => updateTodo(t.id, { title: e.target.value })}
                                  className="px-3 py-2 border rounded-md text-sm"
                                />
                                <select
                                  value={t.priority}
                                  onChange={(e) => updateTodo(t.id, { priority: e.target.value })}
                                  className="px-3 py-2 border rounded-md text-sm"
                                >
                                  <option>High</option>
                                  <option>Medium</option>
                                  <option>Low</option>
                                </select>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                <input
                                  type="date"
                                  value={t.dueDate || ""}
                                  onChange={(e) => updateTodo(t.id, { dueDate: e.target.value || null })}
                                  className="px-3 py-2 border rounded-md text-sm"
                                />
                                <input
                                  value={t.tag || ""}
                                  onChange={(e) => updateTodo(t.id, { tag: e.target.value })}
                                  placeholder="Tag (e.g. Users, Finance)"
                                  className="px-3 py-2 border rounded-md text-sm"
                                />
                              </div>

                              <textarea
                                rows="2"
                                value={t.notes}
                                onChange={(e) => updateTodo(t.id, { notes: e.target.value })}
                                className="w-full px-3 py-2 mt-2 border rounded-md text-sm"
                                placeholder="Notes..."
                              />

                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="px-3 py-1 rounded-md border text-sm"
                                >
                                  Close
                                </button>
                                <button
                                  onClick={() => {
                                    updateTodo(t.id, { ...t });
                                    setEditingId(null);
                                  }}
                                  className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT: SETTINGS */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={16} className="text-indigo-600" />
                  <h2 className="text-sm font-medium text-gray-900">Core Settings</h2>
                </div>

                <div>
                  <label className="text-xs text-gray-600">Platform name</label>
                  <input
                    value={settings.platformName}
                    onChange={(e) => handleSettingChange("platformName", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md mb-3 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600">Contact email</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleSettingChange("contactEmail", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md mb-1 text-sm ${
                      settings.contactEmail && !validateEmail(settings.contactEmail) ? "border-red-400" : ""
                    }`}
                  />
                  {settings.contactEmail && !validateEmail(settings.contactEmail) && (
                    <div className="text-xs text-red-600 mb-2">Invalid email</div>
                  )}
                </div>

                <div className="mt-3">
                  <label className="text-xs text-gray-600">Default role for new users</label>
                  <select
                    value={settings.defaultRole}
                    onChange={(e) => handleSettingChange("defaultRole", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md mb-3 text-sm"
                  >
                    <option>Student</option>
                    <option>Teacher</option>
                    <option>Admin</option>
                  </select>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm">Auto-approve students</div>
                    <div className="text-xs text-gray-500">If on, new signups are auto-approved</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoApproveStudents}
                    onChange={() => handleSettingChange("autoApproveStudents", !settings.autoApproveStudents)}
                    className="h-4 w-4"
                  />
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm">Email notifications</div>
                    <div className="text-xs text-gray-500">System alert emails to admins</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleSettingChange("emailNotifications", !settings.emailNotifications)}
                    className="h-4 w-4"
                  />
                </div>

                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={16} className="text-indigo-600" />
                    <div className="text-sm font-medium text-gray-900">Announcement</div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm">Show announcement banner</div>
                    <input
                      type="checkbox"
                      checked={settings.announcementEnabled}
                      onChange={() => handleSettingChange("announcementEnabled", !settings.announcementEnabled)}
                      className="h-4 w-4"
                    />
                  </div>

                  <textarea
                    value={settings.announcementText}
                    onChange={(e) => handleSettingChange("announcementText", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    rows={3}
                  />
                  <div className="text-xs text-gray-500 mt-2">Short message shown to public page when enabled.</div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun size={14} className="text-gray-600" />
                    <div className="text-sm font-medium text-gray-900">System tone</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["Relaxed", "Neutral", "Strict"].map((t) => (
                      <button
                        key={t}
                        onClick={() => handleSettingChange("systemTone", t)}
                        className={`px-2 py-2 rounded-md text-sm border ${
                          settings.systemTone === t ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="text-xs text-gray-500">
                      <div>Show completed tasks in list</div>
                      <div className="text-xs text-gray-400">Toggle to hide finished items</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.showCompletedTasks}
                      onChange={() => handleSettingChange("showCompletedTasks", !settings.showCompletedTasks)}
                      className="h-4 w-4"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      // revert settings to defaults quickly
                      setSettings(DEFAULT_SETTINGS);
                      setSettingsSavedMsg("Restored defaults");
                      setTimeout(() => setSettingsSavedMsg(""), 1400);
                    }}
                    className="px-3 py-2 rounded-md border text-sm"
                  >
                    Defaults
                  </button>

                  <button
                    onClick={() => saveSettings()}
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm"
                  >
                    <Save size={14} /> Save
                  </button>
                </div>

                <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
                  <div>
                    <div>Platform: <span className="font-medium text-gray-700">{settings.platformName}</span></div>
                    <div>Contact: <span className="font-medium text-gray-700">{settings.contactEmail}</span></div>
                  </div>

                  <div className="text-right">
                    {settingsSavedMsg && <div className="text-sm text-green-600">{settingsSavedMsg}</div>}
                    <div className="text-xs text-gray-400">Settings version v3</div>
                  </div>
                </div>
              </div>
            </div>

            {/* bottom quick utilities */}
            <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
              <div>Tip: Use templates to add common admin tasks quickly.</div>
              <div>Made for admins — fast, practical, and not dramatic.</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
