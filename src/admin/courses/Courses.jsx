"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../../../components/AdminSidebar";
import { Search, Filter, Plus, Trash2, Edit } from "lucide-react";
import {
  getCourses as apiGetCourses,
  deleteCourse as apiDeleteCourse,
  createCourse as apiCreateCourse,
  patchCourse as apiPatchCourse,
} from "../API/AdminPanelApi";

const STORAGE_KEY = "admin_courses_v1";

// NOTE: SAMPLE and safeLoad removed — this component now uses real backend.
// localStorage is only used to read the token (localStorage.getItem('token')).

function formatCurrency(n) {
  return n?.toLocaleString?.() ?? n;
}

/**
 * Normalize backend course object into the shape used by the UI.
 * This is defensive: it accepts either createdAt or created_at, uz/ru fields etc.
 */
function normalizeCourse(c) {
  if (!c) return null;
  return {
    id: c.id ?? c.pk ?? c.pk_id ?? c.course_id ?? String(Math.random()),
    uz: c.uz ?? c.title ?? c.name ?? c.name_uz ?? "",
    ru: c.ru ?? c.title_ru ?? c.name_ru ?? c.name ?? "",
    price: typeof c.price === "number" ? c.price : Number(c.price || 0),
    address: c.address ?? c.location ?? c.address_line ?? "",
    createdAt: c.createdAt ?? c.created_at ?? c.created ?? "",
    active: typeof c.active === "boolean" ? c.active : c.is_active ?? true,
    description: c.description ?? "",
    image: c.image ?? null,
    // keep original payload for potential future use
    __raw: c,
  };
}

export default function Courses() {
  const [isSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // now backed by API
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive
  const [addressFilter, setAddressFilter] = useState("all");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetch courses from backend on mount
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const data = await apiGetCourses(token);
        // Expect data to be an array; if not, guard
        const arr = Array.isArray(data)
          ? data.map(normalizeCourse).filter(Boolean)
          : [];
        if (mounted) setCourses(arr);
      } catch (err) {
        console.error("Failed to load courses from API", err);
        if (mounted) setCourses([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // derive unique addresses for filter dropdown
  const addresses = useMemo(() => {
    const setAddr = new Set(courses.map((c) => c.address).filter(Boolean));
    return ["all", ...Array.from(setAddr)];
  }, [courses]);

  const filtered = useMemo(() => {
    let arr = courses.slice();

    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (c) =>
          (c.uz && c.uz.toLowerCase().includes(q)) ||
          (c.ru && c.ru.toLowerCase().includes(q)) ||
          (c.address && c.address.toLowerCase().includes(q))
      );
    }

    if (statusFilter === "active") arr = arr.filter((c) => c.active);
    if (statusFilter === "inactive") arr = arr.filter((c) => !c.active);
    if (addressFilter !== "all")
      arr = arr.filter((c) => c.address === addressFilter);

    arr.sort((a, b) => {
      let res = 0;
      if (sortKey === "price") res = (a.price || 0) - (b.price || 0);
      if (sortKey === "createdAt")
        res = new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortKey === "uz") res = (a.uz || "").localeCompare(b.uz || "");
      return sortDir === "asc" ? res : -res;
    });

    return arr;
  }, [courses, search, statusFilter, addressFilter, sortKey, sortDir]);

  const toggleSelect = (id) => {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  };

  // delete single course
  const deleteCourse = async (id) => {
    if (!confirm("Ushbu darslikni o'chirishni tasdiqlaysizmi?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await apiDeleteCourse(id, token);
      // apiDeleteCourse returns a fetch promise (Response). Check res.ok if it's Response.
      if (res && typeof res.ok !== "undefined") {
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Delete failed: ${res.status} ${txt}`);
        }
      }
      // remove from UI state
      setCourses((prev) => prev.filter((c) => c.id !== id));
      setSelected((s) => s.filter((x) => x !== id));
    } catch (err) {
      console.error("Failed to delete course", err);
      alert(
        "Darslikni o'chirish muvaffaqiyatsiz. Tafsilotlar uchun konsolni tekshiring."
      );
    }
  };

  // bulk delete
  const bulkDelete = async () => {
    if (selected.length === 0) return;
    if (
      !confirm(
        `Tanlangan ${selected.length} darslikni o'chirishni tasdiqlaysizmi?`
      )
    )
      return;
    const token = localStorage.getItem("token");
    try {
      // run delete requests in parallel
      const promises = selected.map((id) =>
        apiDeleteCourse(id, token).catch((e) => ({ error: e, id }))
      );
      const results = await Promise.all(promises);
      // filter out successfully deleted from UI (we'll assume success when no error object and response ok or no response)
      // If the API returns Response objects, check res.ok
      const failed = [];
      const succeededIds = [];
      for (const r of results) {
        if (r && r.error) {
          failed.push(r.id);
        } else if (r && typeof r.ok !== "undefined") {
          if (r.ok) {
            // handled below by removing all selected except failed
          } else {
            // mark as failed (best-effort)
          }
        }
      }
      // compute final succeeded: selected minus failed
      const finalSucceeded = selected.filter((id) => !failed.includes(id));
      setCourses((prev) => prev.filter((c) => !finalSucceeded.includes(c.id)));
      setSelected([]);
      if (failed.length > 0) {
        alert(
          `Ba'zi darsliklarni o'chirish muvaffaqiyatsiz (${failed.length}). Tafsilotlar uchun konsolni tekshiring.`
        );
        console.error("Failed to delete ids:", failed);
      }
    } catch (err) {
      console.error("Bulk delete failed", err);
      alert(
        "Bir nechta o'chirish amalga oshmadi. Tafsilotlar uchun konsolni tekshiring."
      );
    }
  };

  // toggle single active using PATCH
  const toggleActive = async (id) => {
    const found = courses.find((c) => c.id === id);
    if (!found) return;
    try {
      const token = localStorage.getItem("token");
      const payload = { active: !found.active };
      const updated = await apiPatchCourse(id, payload, token);
      // apiPatchCourse returns parsed json per helper
      const norm = normalizeCourse(updated);
      setCourses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...norm } : c))
      );
    } catch (err) {
      console.error("Failed to toggle active", err);
      alert(
        "Faol holatini o'zgartirish muvaffaqiyatsiz. Tafsilotlar uchun konsolni tekshiring."
      );
    }
  };

  // bulk mark active (PATCH each)
  const bulkToggleActive = async () => {
    if (selected.length === 0) return;
    const token = localStorage.getItem("token");
    try {
      const promises = selected.map((id) =>
        apiPatchCourse(id, { active: true }, token).catch((e) => ({
          error: e,
          id,
        }))
      );
      const results = await Promise.all(promises);
      // update UI for successful ones
      const failed = [];
      const updatedIds = [];
      for (const r of results) {
        if (r && r.error) failed.push(r.id);
        else if (r && (r.id || r.pk)) {
          updatedIds.push(String(r.id ?? r.pk));
        }
      }
      // fallback: if results don't include ids, assume all succeeded
      if (updatedIds.length === 0 && failed.length === 0) {
        // mark all selected as active
        setCourses((prev) =>
          prev.map((c) =>
            selected.includes(c.id) ? { ...c, active: true } : c
          )
        );
      } else {
        setCourses((prev) =>
          prev.map((c) =>
            updatedIds.includes(String(c.id)) ? { ...c, active: true } : c
          )
        );
      }
      setSelected([]);
      if (failed.length > 0) {
        alert(
          `Ba'zi darsliklarni faol qilish muvaffaqiyatsiz (${failed.length}). Tafsilotlar uchun konsolni tekshiring.`
        );
        console.error("Failed ids: ", failed);
      }
    } catch (err) {
      console.error("bulkToggleActive failed", err);
      alert(
        "Tanlanganlarni faol qilish muvaffaqiyatsiz. Tafsilotlar uchun konsolni tekshiring."
      );
    }
  };

  // duplicate course -> create a new course in backend with same data (minus id/createdAt)
  const duplicateCourse = async (id) => {
    const found = courses.find((c) => c.id === id);
    if (!found) return;
    try {
      const token = localStorage.getItem("token");
      const payload = {
        uz: `${found.uz} (nusxa)`,
        ru: found.ru,
        price: found.price,
        address: found.address,
        description: found.description,
        image: found.image,
        active: found.active,
      };
      const created = await apiCreateCourse(payload, token);
      const norm = normalizeCourse(created);
      setCourses((p) => [norm, ...p]);
    } catch (err) {
      console.error("Failed to duplicate course", err);
      alert(
        "Nusxalash muvaffaqiyatsiz. Tafsilotlar uchun konsolni tekshiring."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar isOpen={isSidebarOpen} />

        <main className="flex-1 ml-0 lg:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            {/* header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Darslik</h1>
                <p className="text-gray-600">Darslik ro‘yxati va boshqaruv</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  <div>
                    Jami:{" "}
                    <span className="font-medium text-gray-900">
                      {courses.length}
                    </span>
                  </div>
                </div>
                <Link
                  to="/admin/courses/create"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus size={16} /> Yangi darslik
                </Link>
              </div>
            </div>

            {/* filters */}
            <div className="mb-4 flex flex-col md:flex-row gap-3 items-stretch">
              <div className="relative flex-1">
                <Search
                  className="absolute top-3 left-3 text-gray-400"
                  size={18}
                />
                <input
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  placeholder="Qidirish... (uz/ru/manzil)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="all">Hammasi</option>
                <option value="active">Faol</option>
                <option value="inactive">Faol emas</option>
              </select>

              <select
                value={addressFilter}
                onChange={(e) => setAddressFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                {addresses.map((a) => (
                  <option key={a} value={a}>
                    {a === "all" ? "Barcha manzillar" : a}
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
                  <option value="createdAt">Yaratilgan (sana)</option>
                  <option value="price">Narx</option>
                  <option value="uz">Nomi (Uz)</option>
                </select>

                <button
                  className="px-2 py-2 border rounded-lg"
                  onClick={() =>
                    setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                  }
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
                    selected.length > 0 && selected.length === filtered.length
                  }
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelected(filtered.map((c) => c.id));
                    else setSelected([]);
                  }}
                  className="h-4 w-4"
                />
                <div className="text-sm text-gray-600">
                  {selected.length} tanlangan
                </div>

                <button
                  onClick={bulkToggleActive}
                  className="px-2 py-1 text-sm border rounded-md"
                >
                  Faol etish
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
              {filtered.map((c) => (
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
                            Uz: {c.uz}
                          </h3>
                          {c.active && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                              Faol
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Ru: {c.ru}</p>
                      </div>
                    </div>

                    <div className="text-right text-xs text-gray-500">
                      <div>{c.createdAt}</div>
                      <div className="mt-2 font-semibold text-indigo-600">
                        {formatCurrency(c.price)} UZS
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mt-3">{c.address}</p>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/course/create?id=${c.id}`)
                        }
                        title="Tahrirlash"
                        className="px-2 py-1 border rounded-md text-sm flex items-center gap-2"
                      >
                        <Edit size={14} /> Tahrirlash
                      </button>
                      <button
                        onClick={() => duplicateCourse(c.id)}
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
                        {c.active ? "Faol emas qilish" : "Faollashtirish"}
                      </button>
                      <button
                        onClick={() => deleteCourse(c.id)}
                        className="px-2 py-1 border rounded-md text-sm text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* empty */}
            {filtered.length === 0 && (
              <div className="mt-6 text-center text-gray-500">
                Hech qanday darslik topilmadi. Filtrlarni tozalab yoki yangi
                darslik qo'shing.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
