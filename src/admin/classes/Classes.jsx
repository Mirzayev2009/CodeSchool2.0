"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/AdminSidebar";
import { Search, Plus, Trash2, Edit } from "lucide-react";

// NOTE: classes === groups in your backend
import {
  getGroups,
  deleteGroup,
  patchGroup,
  createGroup,
} from "../API/AdminPanelApi";

function formatCurrency(n) {
  if (n == null) return "-";
  return n.toLocaleString();
}

export default function Classes() {
  const [isSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // No sample data — start empty and show loading state while we fetch from API
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState([]);

  const token = localStorage.getItem("token"); // adjust if you store token elsewhere

  // load groups from API and replace local list when successful
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const res = await getGroups(token);
        if (cancelled) return;

        if (Array.isArray(res)) {
          setClasses(res);
        } else if (res && Array.isArray(res.results)) {
          setClasses(res.results);
        } else if (res && Array.isArray(res.data)) {
          setClasses(res.data);
        } else {
          // unexpected shape — set to empty and report
          console.warn("getGroups returned unexpected shape");
          setClasses([]);
        }
      } catch (err) {
        console.error("Failed to load groups from API:", err);
        setError(
          "Ma'lumotlarni olishda xato. Tarmoqli ulanishni tekshiring yoki keyinroq urinib ko'ring."
        );
        setClasses([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const teachers = useMemo(() => {
    const setT = new Set();
    classes.forEach((c) =>
      (c.groups || []).forEach((g) => g.teacher && setT.add(g.teacher))
    );
    return ["all", ...Array.from(setT)];
  }, [classes]);

  const filtered = useMemo(() => {
    let arr = classes.slice();

    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (c) =>
          (c.title && c.title.toLowerCase().includes(q)) ||
          (c.code && c.code.toLowerCase().includes(q)) ||
          (c.location && c.location.toLowerCase().includes(q)) ||
          (c.tags && c.tags.join(" ").toLowerCase().includes(q))
      );
    }

    if (statusFilter === "active") arr = arr.filter((c) => c.active);
    if (statusFilter === "inactive") arr = arr.filter((c) => !c.active);
    if (teacherFilter !== "all") {
      arr = arr.filter((c) =>
        (c.groups || []).some((g) => g.teacher === teacherFilter)
      );
    }

    arr.sort((a, b) => {
      let res = 0;
      if (sortKey === "price") res = (a.price || 0) - (b.price || 0);
      if (sortKey === "createdAt")
        res = new Date(a.createdAt) - new Date(b.createdAt);
      if (sortKey === "title")
        res = (a.title || "").localeCompare(b.title || "");
      return sortDir === "asc" ? res : -res;
    });

    return arr;
  }, [classes, search, statusFilter, teacherFilter, sortKey, sortDir]);

  // selection helpers
  const toggleSelect = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  const toggleSelectAllFiltered = (checked) =>
    setSelected(checked ? filtered.map((x) => x.id) : []);

  // Delete single class (group) via API; keep UI responsive on failure
  const deleteClass = async (id) => {
    if (!confirm("Ushbu kursni o'chirishni tasdiqlaysizmi?")) return;
    try {
      await deleteGroup(id, token);
      setClasses((prev) => prev.filter((x) => x.id !== id));
      setSelected((s) => s.filter((x) => x !== id));
    } catch (err) {
      console.error("Delete failed, applying local remove:", err);
      setClasses((prev) => prev.filter((x) => x.id !== id));
      setSelected((s) => s.filter((x) => x !== id));
    }
  };

  // Bulk delete selected classes via API (best-effort)
  const bulkDelete = async () => {
    if (selected.length === 0) return;
    if (
      !confirm(
        `${selected.length} ta tanlangan kursni o'chirishni tasdiqlaysizmi?`
      )
    )
      return;
    try {
      await Promise.all(
        selected.map((id) =>
          deleteGroup(id, token).catch((e) => {
            console.error(`Delete failed for ${id}`, e);
          })
        )
      );
      setClasses((prev) => prev.filter((c) => !selected.includes(c.id)));
      setSelected([]);
    } catch (err) {
      console.error("Bulk delete encountered an error:", err);
      setClasses((prev) => prev.filter((c) => !selected.includes(c.id)));
      setSelected([]);
    }
  };

  // Duplicate a class: tries to create new group via API; if fails, creates local copy
  const duplicateClass = async (id) => {
    const found = classes.find((c) => c.id === id);
    if (!found) return;
    const payload = { ...found };
    delete payload.id;
    payload.title = `${found.title} (nusxa)`;
    payload.createdAt = new Date().toISOString().slice(0, 10);

    try {
      const created = await createGroup(payload, token);
      if (created && (created.id || created.pk)) {
        setClasses((prev) => [created, ...prev]);
      } else if (created && Array.isArray(created)) {
        setClasses((prev) => [created[0], ...prev]);
      } else {
        const copy = {
          ...found,
          id: `cl-${Date.now()}`,
          title: `${found.title} (nusxa)`,
          createdAt: payload.createdAt,
        };
        setClasses((prev) => [copy, ...prev]);
      }
    } catch (err) {
      console.error(
        "Duplicate via API failed, creating local copy instead:",
        err
      );
      const copy = {
        ...found,
        id: `cl-${Date.now()}`,
        title: `${found.title} (nusxa)`,
        createdAt: payload.createdAt,
      };
      setClasses((prev) => [copy, ...prev]);
    }
  };

  // Toggle active flag by PATCHing group on backend (or local fallback)
  const toggleActive = async (id) => {
    const current = classes.find((c) => c.id === id);
    if (!current) return;
    const newActive = !current.active;
    try {
      const updated = await patchGroup(id, { active: newActive }, token);
      if (updated && updated.id) {
        setClasses((prev) => prev.map((c) => (c.id === id ? updated : c)));
      } else {
        setClasses((prev) =>
          prev.map((c) => (c.id === id ? { ...c, active: newActive } : c))
        );
      }
    } catch (err) {
      console.error("Toggle active failed, applying locally:", err);
      setClasses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, active: newActive } : c))
      );
    }
  };

  // Bulk activate selected classes
  const bulkActivate = async () => {
    if (selected.length === 0) return;
    try {
      await Promise.all(
        selected.map((id) =>
          patchGroup(id, { active: true }, token).catch((e) => {
            console.error(`Activate failed for ${id}`, e);
          })
        )
      );
      setClasses((prev) =>
        prev.map((c) => (selected.includes(c.id) ? { ...c, active: true } : c))
      );
      setSelected([]);
    } catch (err) {
      console.error("Bulk activate encountered an error:", err);
      setClasses((prev) =>
        prev.map((c) => (selected.includes(c.id) ? { ...c, active: true } : c))
      );
      setSelected([]);
    }
  };

  const retryLoad = () => {
    // re-run effect by toggling loading and calling API again
    setLoading(true);
    setError(null);
    // effect will rerun only if token changes, so directly call API
    (async () => {
      try {
        const res = await getGroups(token);
        if (Array.isArray(res)) setClasses(res);
        else if (res && Array.isArray(res.results)) setClasses(res.results);
        else if (res && Array.isArray(res.data)) setClasses(res.data);
        else setClasses([]);
      } catch (err) {
        console.error("Retry failed:", err);
        setError("Ma'lumotlarni olishda xato. Keyinroq urinib ko'ring.");
        setClasses([]);
      } finally {
        setLoading(false);
      }
    })();
  };

  // Skeleton card used while loading
  const SkeletonCard = () => (
    <div className="bg-white border rounded-xl p-4 shadow-sm animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-full mb-4" />
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded w-24" />
        <div className="h-8 bg-gray-200 rounded w-20" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar isOpen={isSidebarOpen} />

        <main className="flex-1 ml-0 lg:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            {/* header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Kurslar</h1>
                <p className="text-gray-600">
                  Guruhlar va kurslarni boshqaring — tezkor harakatlar pastda.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  <div>
                    Total:{" "}
                    <span className="font-medium text-gray-900">
                      {loading ? (
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></span>
                      ) : (
                        classes.length
                      )}
                    </span>
                  </div>
                </div>
                <Link
                  to="/admin/classes/create"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus size={16} /> Yangi kurs
                </Link>
              </div>
            </div>

            {/* error banner */}
            {error && (
              <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
                <div className="flex items-center justify-between">
                  <div>{error}</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={retryLoad}
                      className="px-3 py-1 bg-yellow-100 rounded text-sm"
                    >
                      Qayta yuklash
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

            {/* filters */}
            <div className="mb-4 flex flex-col md:flex-row gap-3 items-stretch">
              <div className="relative flex-1">
                <Search
                  className="absolute top-3 left-3 text-gray-400"
                  size={18}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Sarlavha, kod, manzil yoki teg bo'yicha qidirish..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="all">Barcha holatlar</option>
                <option value="active">Faol</option>
                <option value="inactive">Faol emas</option>
              </select>

              <select
                value={teacherFilter}
                onChange={(e) => setTeacherFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                {teachers.map((t) => (
                  <option key={t} value={t}>
                    {t === "all" ? "Barcha o'qituvchilar" : t}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500">Saralash</label>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="px-2 py-2 border rounded-lg"
                >
                  <option value="createdAt">Yaratilgan sana</option>
                  <option value="price">Narx</option>
                  <option value="title">Sarlavha</option>
                </select>

                <button
                  onClick={() =>
                    setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                  }
                  className="px-2 py-2 border rounded-lg"
                >
                  {sortDir === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>

            {/* bulk actions */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    selected.length > 0 &&
                    selected.length === filtered.length &&
                    filtered.length > 0
                  }
                  onChange={(e) => toggleSelectAllFiltered(e.target.checked)}
                  className="h-4 w-4"
                />
                <div className="text-sm text-gray-600">
                  {selected.length} ta tanlangan
                </div>

                <button
                  onClick={bulkActivate}
                  className="px-2 py-1 text-sm border rounded-md"
                >
                  Faol qilish
                </button>
                <button
                  onClick={bulkDelete}
                  className="px-2 py-1 text-sm border rounded-md text-red-600"
                >
                  O'chirish
                </button>
              </div>

              <div className="text-sm text-gray-500">
                Ko'rsatilmoqda: {filtered.length} ta natija
              </div>
            </div>

            {/* grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? // show skeletons while loading
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                : filtered.map((c) => (
                    <div
                      key={c.id}
                      className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selected.includes(c.id)}
                            onChange={() => toggleSelect(c.id)}
                            className="mt-1"
                          />
                          <div>
                            <div className="flex gap-2 items-center">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {c.title}
                              </h3>
                              {c.active && (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                  Faol
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {c.code} • {c.tags?.join(", ")}
                            </p>
                            <p className="text-sm text-gray-700 mt-2">
                              {c.location}
                            </p>
                          </div>
                        </div>

                        <div className="text-right text-xs text-gray-500">
                          <div>{c.createdAt}</div>
                          <div className="mt-2 font-semibold text-indigo-600">
                            {formatCurrency(c.price)} UZS
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-gray-600">
                        Guruhlar:{" "}
                        <span className="font-medium text-gray-800">
                          {(c.groups || []).length}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/classes/create?id=${c.id}`)
                            }
                            title="Tahrirlash"
                            className="px-2 py-1 border rounded-md text-sm flex items-center gap-2"
                          >
                            <Edit size={14} /> Tahrirlash
                          </button>
                          <button
                            onClick={() => duplicateClass(c.id)}
                            className="px-2 py-1 border rounded-md text-sm"
                          >
                            Nusxalash
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleActive(c.id)}
                            className="px-2 py-1 border rounded-md text-sm"
                          >
                            {c.active ? "Faoliyatni o'chirish" : "Faol qilish"}
                          </button>
                          <button
                            onClick={() => deleteClass(c.id)}
                            className="px-2 py-1 border rounded-md text-sm text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>

            {!loading && filtered.length === 0 && (
              <div className="mt-6 text-center text-gray-500">
                Kurs topilmadi. Boshlash uchun yangi kurs qo'shing.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
