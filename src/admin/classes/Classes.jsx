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

// Helper function to format date for display
function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Helper function to transform backend group data into frontend class format
const transformApiData = (group) => {
  return {
    // Direct mapping
    id: group.id,
    title: group.name, // 'name' from backend is 'title' in frontend
    createdAt: group.created_date,
    studentCount: group.student_count,
    teacherCount: group.teacher_count,
    teachers: group.teachers || [], // Assuming 'teachers' is an array of IDs

    // Adding placeholder data for fields missing in the API response
    // You can adjust these or connect them to real data if it becomes available
    code: `ID-${group.id}`,
    price: group.total_payments || 0, // Using total_payments as price, adjust if needed
    location: "Noma'lum", // Placeholder location
    tags: ["Umumiy"], // Placeholder tags
    active: true, // Defaulting to 'active', as the API doesn't provide this status
  };
};

export default function Classes() {
  const [isSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  // NOTE: 'active' status is not supported by your API data.
  // I've removed the filter, but left the logic here in case you add it back.
  // const [statusFilter, setStatusFilter] = useState("all");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState([]);

  const token = localStorage.getItem("token");

  // Load groups from API and transform data for the UI
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const res = await getGroups(token);
        if (cancelled) return;

        let rawData = [];
        if (Array.isArray(res)) {
          rawData = res;
        } else if (res && Array.isArray(res.results)) {
          rawData = res.results;
        } else if (res && Array.isArray(res.data)) {
          rawData = res.data;
        } else {
          console.warn("getGroups returned unexpected shape");
        }

        // Transform the raw API data to match the structure our component expects
        const transformedData = rawData.map(transformApiData);
        setClasses(transformedData);
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
  }, [token]);

  // The teacher list is now derived from teacher IDs.
  // In a real app, you would fetch teacher names based on these IDs.
  const teachers = useMemo(() => {
    const teacherIds = new Set();
    classes.forEach((c) => {
      (c.teachers || []).forEach((teacherId) => teacherIds.add(teacherId));
    });
    // Creating placeholder names like "O'qituvchi 23"
    return ["all", ...Array.from(teacherIds).map((id) => `O'qituvchi ${id}`)];
  }, [classes]);

  const filtered = useMemo(() => {
    let arr = [...classes];

    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (c) =>
          (c.title && c.title.toLowerCase().includes(q)) ||
          (c.code && c.code.toLowerCase().includes(q))
      );
    }

    if (teacherFilter !== "all") {
      const selectedTeacherId = parseInt(teacherFilter.split(" ")[1]);
      arr = arr.filter((c) => (c.teachers || []).includes(selectedTeacherId));
    }

    arr.sort((a, b) => {
      let res = 0;
      if (sortKey === "price") res = (a.price || 0) - (b.price || 0);
      if (sortKey === "createdAt")
        res = new Date(b.createdAt) - new Date(a.createdAt); // Note: Swapped for correct default desc
      if (sortKey === "title")
        res = (a.title || "").localeCompare(b.title || "");
      return sortDir === "asc" ? res : -res;
    });

    return arr;
  }, [classes, search, teacherFilter, sortKey, sortDir]);

  // --- Action Handlers ---

  const toggleSelect = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  const toggleSelectAllFiltered = (checked) =>
    setSelected(checked ? filtered.map((x) => x.id) : []);

  const deleteClass = async (id) => {
    if (!window.confirm("Ushbu guruhni o'chirishni tasdiqlaysizmi?")) return;
    const originalClasses = [...classes];
    setClasses((prev) => prev.filter((x) => x.id !== id));
    setSelected((s) => s.filter((x) => x !== id));
    try {
      await deleteGroup(id, token);
    } catch (err) {
      console.error("Delete failed, reverting UI change:", err);
      setClasses(originalClasses); // Revert on failure
    }
  };

  const bulkDelete = async () => {
    if (
      selected.length === 0 ||
      !window.confirm(
        `${selected.length} ta tanlangan guruhni o'chirishni tasdiqlaysizmi?`
      )
    )
      return;
    const originalClasses = [...classes];
    setClasses((prev) => prev.filter((c) => !selected.includes(c.id)));
    const oldSelected = [...selected];
    setSelected([]);
    try {
      await Promise.all(selected.map((id) => deleteGroup(id, token)));
    } catch (err) {
      console.error("Bulk delete encountered an error:", err);
      setClasses(originalClasses); // Revert on failure
      setSelected(oldSelected);
    }
  };

  const duplicateClass = async (id) => {
    const found = classes.find((c) => c.id === id);
    if (!found) return;

    // The payload for the API must match the backend's expected format
    const payload = {
      name: `${found.title} (nusxa)`,
      // Add other required fields for creation if your backend needs them
    };

    try {
      const createdGroup = await createGroup(payload, token);
      if (createdGroup && createdGroup.id) {
        // Transform the new group and add it to the state
        const newClass = transformApiData(createdGroup);
        setClasses((prev) => [newClass, ...prev]);
      }
    } catch (err) {
      console.error("Duplicate via API failed:", err);
      // You might want to show an error notification to the user
    }
  };

  const retryLoad = () => {
    // This effect will re-run automatically if you just clear the error
    // and set loading, because the dependency array [token] doesn't change.
    // So we manually call the logic again.
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getGroups(token);
        let rawData = Array.isArray(res) ? res : [];
        const transformedData = rawData.map(transformApiData);
        setClasses(transformedData);
      } catch (err) {
        setError("Ma'lumotlarni qayta yuklashda xato.");
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
                <h1 className="text-3xl font-bold text-gray-900">Guruhlar</h1>
                <p className="text-gray-600">
                  Mavjud guruhlarni boshqaring va yangilarini yarating.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  Total:{" "}
                  <span className="font-medium text-gray-900">
                    {loading ? "..." : classes.length}
                  </span>
                </div>
                <Link
                  to="/admin/classes/create"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus size={16} /> Yangi guruh
                </Link>
              </div>
            </div>

            {/* error banner */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-800 rounded">
                <div className="flex items-center justify-between">
                  <div>{error}</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={retryLoad}
                      className="px-3 py-1 bg-red-100 rounded text-sm font-semibold"
                    >
                      Qayta urinish
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
            <div className="mb-4 flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  className="absolute top-3 left-3 text-gray-400"
                  size={18}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Guruh nomi bo'yicha qidirish..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>

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
                  <option value="title">Sarlavha</option>
                  <option value="price">To'lovlar</option>
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
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
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
                  <span className="text-sm text-gray-600">
                    {selected.length} ta tanlangan
                  </span>
                </label>

                {selected.length > 0 && (
                  <button
                    onClick={bulkDelete}
                    className="px-3 py-1 text-sm border rounded-md text-red-600 hover:bg-red-50"
                  >
                    O'chirish
                  </button>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Ko'rsatilmoqda: {filtered.length} ta natija
              </div>
            </div>

            {/* grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                : filtered.map((c) => (
                    <div
                      key={c.id}
                      className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selected.includes(c.id)}
                            onChange={() => toggleSelect(c.id)}
                            className="mt-1.5 h-4 w-4"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {c.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {c.code}
                            </p>
                          </div>
                        </div>
                        <div className="text-right text-xs text-gray-500 flex-shrink-0">
                          {formatDate(c.createdAt)}
                        </div>
                      </div>

                      <div className="mt-4 border-t pt-3 text-sm text-gray-600 space-y-2">
                        <div className="flex justify-between">
                          <span>Talabalar:</span>
                          <span className="font-medium text-gray-800">
                            {c.studentCount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>O'qituvchilar:</span>
                          <span className="font-medium text-gray-800">
                            {c.teacherCount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Jami to'lov:</span>
                          <span className="font-semibold text-indigo-600">
                            {c.price.toLocaleString()} UZS
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2 border-t pt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/classes/edit/${c.id}`)
                            }
                            title="Tahrirlash"
                            className="px-3 py-1 border rounded-md text-sm flex items-center gap-2 hover:bg-gray-50"
                          >
                            <Edit size={14} /> Tahrir
                          </button>
                          <button
                            onClick={() => duplicateClass(c.id)}
                            className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50"
                          >
                            Nusxalash
                          </button>
                        </div>
                        <button
                          onClick={() => deleteClass(c.id)}
                          className="p-2 border rounded-md text-sm text-red-600 hover:bg-red-50"
                          title="O'chirish"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
            </div>

            {!loading && filtered.length === 0 && (
              <div className="mt-8 text-center text-gray-500 py-10 border-2 border-dashed rounded-lg">
                <h3 className="text-xl font-semibold">Guruhlar topilmadi</h3>
                <p className="mt-2">Boshlash uchun yangi guruh qo'shing.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
