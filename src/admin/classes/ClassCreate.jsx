"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../../../components/AdminSidebar";
import { Plus, Trash2 } from "lucide-react";
import {
  getCourse,
  createCourse,
  updateCourse,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../API/AdminPanelApi";

// NOTE: keep UI exactly as originally provided. This file only replaces localStorage CRUD
// with real API calls using adminPanelApi.js. LocalStorage is used only to read token.

function uid(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
}

export default function ClassCreate() {
  const [isSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const editingId = params.get("id");

  // MAIN form state (UI unchanged)
  const [form, setForm] = useState({
    title: "",
    code: "",
    price: "",
    location: "",
    description: "",
    tags: [],
    image: null, // base64
    active: true,
    materials: [], // {id, title, url}
    prerequisites: [], // strings
    enrollmentLimit: "",
    notificationsEnabled: false,
    duration_weeks: "",
    groups: [
      // default group
      {
        id: uid("g"),
        name: "Guruh 1",
        teacher: "",
        capacity: 20,
        startDate: "",
        endDate: "",
        price: "",
        schedule: [
          // { id, day, start, end, location }
        ],
      },
    ],
  });

  const [loadingExisting, setLoadingExisting] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [originalGroupIds, setOriginalGroupIds] = useState([]); // used to detect deletions

  // load existing when editing from real backend (NOT localStorage)
  useEffect(() => {
    async function loadFromApi() {
      if (!editingId) return;
      setLoadingExisting(true);
      try {
        const token = localStorage.getItem("token");
        const data = await getCourse(editingId, token);
        // Map backend fields into form shape while preserving UI fields
        setForm({
          title: data.title ?? "",
          code: data.code ?? "",
          price: data.price ?? "",
          location: data.location ?? "",
          description: data.description ?? "",
          tags: data.tags ?? [],
          image: data.image ?? null,
          active: data.active ?? true,
          materials: data.materials ?? [],
          prerequisites: data.prerequisites ?? [],
          enrollmentLimit: data.enrollmentLimit ?? "",
          notificationsEnabled: data.notificationsEnabled ?? false,
          duration_weeks: Number(data.duration_weeks) || "",
          // If backend returned groups nested under course use them, otherwise keep empty/default
          groups:
            data.groups && Array.isArray(data.groups) && data.groups.length
              ? data.groups.map((g) => ({
                  // keep whatever keys backend returns (so UI fields exist)
                  id: g.id ?? uid("g"),
                  name: g.name ?? "",
                  teacher: g.teacher ?? "",
                  capacity: g.capacity ?? 20,
                  startDate: g.startDate ?? "",
                  endDate: g.endDate ?? "",
                  price: g.price ?? "",
                  schedule: g.schedule ?? [],
                }))
              : [
                  {
                    id: uid("g"),
                    name: "Guruh 1",
                    teacher: "",
                    capacity: 20,
                    startDate: "",
                    endDate: "",
                    price: "",
                    schedule: [],
                  },
                ],
        });

        // capture original group ids (for deletion detection)
        if (data.groups && Array.isArray(data.groups)) {
          setOriginalGroupIds(data.groups.map((g) => String(g.id)));
        } else {
          setOriginalGroupIds([]);
        }
      } catch (err) {
        console.error("Failed to load course from API", err);
        // keep default UI state if load fails
      } finally {
        setLoadingExisting(false);
      }
    }
    loadFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId]);

  // ----------------------
  // MANY small helper functions (kept as in original)
  // ----------------------
  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  // Tags
  const addTag = (tag) => {
    if (!tag) return;
    setForm((s) => ({
      ...s,
      tags: Array.from(new Set([...(s.tags || []), tag])),
    }));
  };
  const removeTag = (tag) =>
    setForm((s) => ({ ...s, tags: (s.tags || []).filter((t) => t !== tag) }));

  // Materials
  const addMaterial = (title, url) => {
    if (!title) return;
    setForm((s) => ({
      ...s,
      materials: [{ id: uid("m"), title, url }, ...(s.materials || [])],
    }));
  };
  const removeMaterial = (id) =>
    setForm((s) => ({
      ...s,
      materials: (s.materials || []).filter((m) => m.id !== id),
    }));

  // Image upload
  const handleImage = (file) => {
    if (!file) {
      setField("image", null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setField("image", reader.result);
    reader.readAsDataURL(file);
  };

  // Groups management (detailed) - keep UI behavior identical
  const addGroup = () => {
    setForm((s) => ({
      ...s,
      groups: [
        {
          id: uid("g"),
          name: `Guruh ${s.groups.length + 1}`,
          teacher: "",
          capacity: 20,
          startDate: "",
          endDate: "",
          price: "",
          schedule: [],
        },
        ...(s.groups || []),
      ],
    }));
  };

  const updateGroupField = (groupId, key, value) => {
    setForm((s) => ({
      ...s,
      groups: (s.groups || []).map((g) =>
        g.id === groupId ? { ...g, [key]: value } : g
      ),
    }));
  };

  const removeGroup = (groupId) => {
    if (
      !confirm(
        "Guruhni olib tashlashni tasdiqlaysizmi? Uning barcha jadval elementlari o'chiriladi."
      )
    )
      return;
    setForm((s) => ({
      ...s,
      groups: (s.groups || []).filter((g) => g.id !== groupId),
    }));
  };

  // group schedule functions
  const addGroupSchedule = (
    groupId,
    payload = { day: "Mon", start: "18:00", end: "20:00", location: "" }
  ) => {
    const sid = uid("s");
    setForm((s) => ({
      ...s,
      groups: (s.groups || []).map((g) =>
        g.id === groupId
          ? { ...g, schedule: [{ id: sid, ...payload }, ...(g.schedule || [])] }
          : g
      ),
    }));
  };

  const updateGroupSchedule = (groupId, scheduleId, patch) => {
    setForm((s) => ({
      ...s,
      groups: (s.groups || []).map((g) =>
        g.id === groupId
          ? {
              ...g,
              schedule: (g.schedule || []).map((sch) =>
                sch.id === scheduleId ? { ...sch, ...patch } : sch
              ),
            }
          : g
      ),
    }));
  };

  const removeGroupSchedule = (groupId, scheduleId) => {
    setForm((s) => ({
      ...s,
      groups: (s.groups || []).map((g) =>
        g.id === groupId
          ? {
              ...g,
              schedule: (g.schedule || []).filter((x) => x.id !== scheduleId),
            }
          : g
      ),
    }));
  };

  // prerequisites
  const addPrerequisite = (text) => {
    if (!text) return;
    setForm((s) => ({
      ...s,
      prerequisites: [text, ...(s.prerequisites || [])],
    }));
  };
  const removePrerequisite = (index) =>
    setForm((s) => ({
      ...s,
      prerequisites: (s.prerequisites || []).filter((_, i) => i !== index),
    }));

  const validate = () => {
    if (!form.title.trim()) {
      alert("Sarlavha kiritilishi shart.");
      return false;
    }
    if (!form.code.trim()) {
      alert("Kod kiritilishi shart.");
      return false;
    }
    if (!form.price || Number(form.price) <= 0) {
      alert("Narx musbat son bo'lishi kerak.");
      return false;
    }
    if (!form.location.trim()) {
      alert("Manzil kiritilishi shart.");
      return false;
    }

    // NEW: duration_weeks must be present and positive
    if (!form.duration_weeks || Number(form.duration_weeks) <= 0) {
      alert("Davomiylik (hafta) musbat son bo'lishi kerak.");
      return false;
    }

    for (const g of form.groups) {
      if (!g.name.trim()) {
        alert("Har bir guruhga nom kerak.");
        return false;
      }
      if (!g.teacher.trim()) {
        if (
          !confirm(
            `"${g.name}" guruhiga o'qituvchi belgilanmagan. Davom etilsinmi?`
          )
        )
          return false;
      }
    }
    return true;
  };

  // ------------------------------
  // SAVE / SYNC with backend (real CRUD)
  // ------------------------------
  const handleSave = async (stay = false) => {
    if (!validate()) return;

    const token = localStorage.getItem("token");

    // Prepare course payload: send course fields but do not include nested groups here (we will sync groups separately)
    const coursePayload = {
      title: form.title,
      code: form.code,
      price: Number(form.price),
      location: form.location,
      description: form.description,
      tags: form.tags,
      image: form.image,
      active: form.active,
      materials: form.materials,
      prerequisites: form.prerequisites,
      enrollmentLimit: form.enrollmentLimit,
      notificationsEnabled: form.notificationsEnabled,
      duration_weeks: Number(form.duration_weeks) || null,
      // do NOT include groups array to avoid double handling; backend may accept nested groups but we'll manage groups explicitly
    };

    try {
      let courseRes;
      if (editingId) {
        courseRes = await updateCourse(editingId, coursePayload, token);
      } else {
        courseRes = await createCourse(coursePayload, token);
      }

      // determine course id
      const courseId =
        (courseRes && (courseRes.id ?? courseRes.pk)) || editingId;

      // SYNC groups:
      // - create groups that have local ids (start with 'g-' or no numeric id)
      // - update groups that have server ids
      // - delete groups that existed originally but no longer present
      const currentGroups = form.groups || [];
      const currentGroupIds = currentGroups
        .filter((g) => g.id && !String(g.id).startsWith("g-"))
        .map((g) => String(g.id));

      // delete removed groups
      const toDelete = originalGroupIds.filter(
        (origId) => !currentGroupIds.includes(String(origId))
      );
      await Promise.all(
        toDelete.map(async (id) => {
          try {
            await deleteGroup(id, token);
          } catch (err) {
            console.error("Failed to delete group", id, err);
          }
        })
      );

      // create or update current groups
      for (const g of currentGroups) {
        // prepare payload for group (attach course if backend needs it)
        const groupPayload = {
          name: g.name,
          teacher: g.teacher,
          capacity: g.capacity,
          startDate: g.startDate,
          endDate: g.endDate,
          price: g.price,
          schedule: g.schedule,
          // attach course if backend expects a course FK
          course: courseId,
        };

        if (g.id && !String(g.id).startsWith("g-")) {
          // existing group -> update
          try {
            await updateGroup(g.id, groupPayload, token);
          } catch (err) {
            console.error("Failed to update group", g.id, err);
          }
        } else {
          // new group -> create
          try {
            await createGroup(groupPayload, token);
          } catch (err) {
            console.error("Failed to create group", g, err);
          }
        }
      }

      setSaveMsg(editingId ? "Saqlangan ✓" : "Yaratildi ✓");

      if (!stay) {
        navigate("/admin/classes");
      } else {
        // reset minimal UI states while keeping UI intact
        setTimeout(() => setSaveMsg(""), 1600);
        // if creating and stay === true, reset form but keep initial UI structure
        if (!editingId) {
          setForm({
            title: "",
            code: "",
            price: "",
            location: "",
            description: "",
            tags: [],
            image: null,
            active: true,
            materials: [],
            prerequisites: [],
            enrollmentLimit: "",
            notificationsEnabled: false,
            duration_weeks: "",
            groups: [
              {
                id: uid("g"),
                name: "Guruh 1",
                teacher: "",
                capacity: 20,
                startDate: "",
                endDate: "",
                price: "",
                schedule: [],
              },
            ],
          });
          setOriginalGroupIds([]);
        }
      }
    } catch (err) {
      console.error("Save failed", err);
      alert(
        "Saqlash muvaffaqiyatsiz tugadi. Tafsilotlar uchun konsolni tekshiring."
      );
    }
  };

  const handleCancel = () => {
    if (!confirm("O'zgartirishlar bekor qilinsinmi?")) return;
    navigate("/admin/classes");
  };

  // small utility for showing group schedule summary
  const scheduleSummary = (schedule) => {
    if (!schedule || schedule.length === 0) return "Jadval yo'q";
    return (
      schedule
        .slice(0, 2)
        .map((s) => `${s.day} ${s.start}-${s.end}`)
        .join(", ") + (schedule.length > 2 ? "..." : "")
    );
  };

  // sample teachers to select from (in real app you'd fetch)
  const TEACHERS_SAMPLE = ["Mr. Adams", "Ms. Brown", "Dr. Lee", "Mr. Johnson"];

  // UI kept exactly as original
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar isOpen={isSidebarOpen} />

        <main className="flex-1 ml-0 lg:ml-64 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {editingId ? "Kursni tahrirlash" : "Kurs yaratish"}
                </h1>
                <p className="text-sm text-gray-600">
                  Kurs haqida ma'lumot va guruh tafsilotlarini (jadval,
                  o'qituvchi, sig'im) belgilang.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-500">
                  {saveMsg && (
                    <span className="text-sm text-green-600">{saveMsg}</span>
                  )}
                </div>
                <button
                  onClick={() => handleSave(true)}
                  className="px-3 py-2 bg-gray-800 text-white rounded-md"
                >
                  Saqlab yana qo'shish
                </button>
                <button
                  onClick={() => handleSave(false)}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md"
                >
                  Saqlash
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow grid grid-cols-1 gap-6">
              {/* Top basic fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700">
                    Sarlavha *
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700">Kod *</label>
                  <input
                    value={form.code}
                    onChange={(e) => setField("code", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700">
                    Narx (UZS) *
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setField("price", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                  />
                </div>
                {/* add this next to the other top fields */}
                <div>
                  <label className="block text-sm text-gray-700">
                    Davomiylik (hafta) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.duration_weeks}
                    onChange={(e) => setField("duration_weeks", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                    placeholder="Masalan: 8"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700">
                    Manzil *
                  </label>
                  <input
                    value={form.location}
                    onChange={(e) => setField("location", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700">Tavsif</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  rows={4}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                  placeholder="Shu yerda yozishni boshlang..."
                />
              </div>

              {/* Tags & image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700">Teglar</label>
                  <div className="flex gap-2 items-center mt-2">
                    <input
                      id="tag-input"
                      className="flex-1 px-3 py-2 border rounded-md"
                      placeholder="Teg qo'shib Enter ni bosing"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag(e.target.value.trim());
                          e.target.value = "";
                        }
                      }}
                    />
                    <div className="flex flex-wrap gap-2">
                      {(form.tags || []).map((t) => (
                        <div
                          key={t}
                          className="px-2 py-1 bg-gray-100 rounded flex items-center gap-2 text-sm"
                        >
                          {t}
                          <button
                            onClick={() => removeTag(t)}
                            className="text-xs text-gray-500"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700">
                    Rasm (ixtiyoriy)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImage(e.target.files?.[0])}
                    className="mt-2"
                  />
                  {form.image && (
                    <img
                      src={form.image}
                      alt="preview"
                      className="mt-2 max-h-40 rounded-md border"
                    />
                  )}
                </div>
              </div>

              {/* Materials & prerequisites */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm text-gray-700">
                      Materiallar
                    </label>
                    <button
                      onClick={() => {
                        const t = prompt("Material nomi");
                        const u = prompt("Material URL (ixtiyoriy)");
                        if (t) addMaterial(t, u || "");
                      }}
                      className="px-2 py-1 text-sm border rounded-md"
                    >
                      + Qo'shish
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {(form.materials || []).map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>
                          <div className="font-medium">{m.title}</div>
                          <div className="text-xs text-gray-500">{m.url}</div>
                        </div>
                        <button
                          onClick={() => removeMaterial(m.id)}
                          className="text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {(!form.materials || form.materials.length === 0) && (
                      <div className="text-xs text-gray-500">
                        Materiallar mavjud emas.
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm text-gray-700">
                      Oldingi talablar
                    </label>
                    <button
                      onClick={() => {
                        const t = prompt(
                          "Oldingi talab (masalan: Boshlang'ich ingliz tili darajasi)"
                        );
                        if (t) addPrerequisite(t);
                      }}
                      className="px-2 py-1 text-sm border rounded-md"
                    >
                      + Qo'shish
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {(form.prerequisites || []).map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>{p}</div>
                        <button
                          onClick={() => removePrerequisite(i)}
                          className="text-red-600"
                        >
                          O'chirish
                        </button>
                      </div>
                    ))}
                    {(!form.prerequisites ||
                      form.prerequisites.length === 0) && (
                      <div className="text-xs text-gray-500">
                        Oldingi talablar mavjud emas.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* groups: detailed nested editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    Guruhlar (batafsil)
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={addGroup}
                      className="px-3 py-1 text-sm border rounded-md flex items-center gap-2"
                    >
                      <Plus size={14} /> Guruh qo'shish
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {(form.groups || []).map((g) => (
                    <div
                      key={g.id}
                      className="border rounded-md p-3 bg-gray-50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input
                              value={g.name}
                              onChange={(e) =>
                                updateGroupField(g.id, "name", e.target.value)
                              }
                              placeholder="Guruh nomi"
                              className="px-3 py-2 border rounded-md"
                            />
                            <select
                              value={g.teacher}
                              onChange={(e) =>
                                updateGroupField(
                                  g.id,
                                  "teacher",
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 border rounded-md"
                            >
                              <option value="">O'qituvchi tanlash</option>
                              {TEACHERS_SAMPLE.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                            <input
                              type="number"
                              value={g.capacity}
                              onChange={(e) =>
                                updateGroupField(
                                  g.id,
                                  "capacity",
                                  Number(e.target.value || 0)
                                )
                              }
                              className="px-3 py-2 border rounded-md"
                              placeholder="Sig'im"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                            <input
                              type="date"
                              value={g.startDate || ""}
                              onChange={(e) =>
                                updateGroupField(
                                  g.id,
                                  "startDate",
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 border rounded-md"
                            />
                            <input
                              type="date"
                              value={g.endDate || ""}
                              onChange={(e) =>
                                updateGroupField(
                                  g.id,
                                  "endDate",
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 border rounded-md"
                            />
                            <input
                              type="number"
                              value={g.price || ""}
                              onChange={(e) =>
                                updateGroupField(g.id, "price", e.target.value)
                              }
                              className="px-3 py-2 border rounded-md"
                              placeholder="Guruh narxi (ixtiyoriy)"
                            />
                          </div>

                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-medium">Jadval</div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => addGroupSchedule(g.id)}
                                  className="px-2 py-1 border rounded-md text-sm"
                                >
                                  + Qo'shish
                                </button>
                                <div className="text-xs text-gray-500">
                                  {scheduleSummary(g.schedule)}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              {(g.schedule || []).map((sch) => (
                                <div
                                  key={sch.id}
                                  className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center"
                                >
                                  <select
                                    value={sch.day}
                                    onChange={(e) =>
                                      updateGroupSchedule(g.id, sch.id, {
                                        day: e.target.value,
                                      })
                                    }
                                    className="px-2 py-2 border rounded-md"
                                  >
                                    {[
                                      "Mon",
                                      "Tue",
                                      "Wed",
                                      "Thu",
                                      "Fri",
                                      "Sat",
                                      "Sun",
                                    ].map((d) => (
                                      <option key={d} value={d}>
                                        {d}
                                      </option>
                                    ))}
                                  </select>
                                  <input
                                    type="time"
                                    value={sch.start}
                                    onChange={(e) =>
                                      updateGroupSchedule(g.id, sch.id, {
                                        start: e.target.value,
                                      })
                                    }
                                    className="px-2 py-2 border rounded-md"
                                  />
                                  <input
                                    type="time"
                                    value={sch.end}
                                    onChange={(e) =>
                                      updateGroupSchedule(g.id, sch.id, {
                                        end: e.target.value,
                                      })
                                    }
                                    className="px-2 py-2 border rounded-md"
                                  />
                                  <div className="flex items-center gap-2">
                                    <input
                                      value={sch.location || ""}
                                      onChange={(e) =>
                                        updateGroupSchedule(g.id, sch.id, {
                                          location: e.target.value,
                                        })
                                      }
                                      placeholder="Manzil"
                                      className="px-2 py-2 border rounded-md"
                                    />
                                    <button
                                      onClick={() =>
                                        removeGroupSchedule(g.id, sch.id)
                                      }
                                      className="text-red-600"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {(!g.schedule || g.schedule.length === 0) && (
                                <div className="text-xs text-gray-500">
                                  Jadval slotlari yo'q. + Qo'shish bilan
                                  qo'shing.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex-shrink-0 ml-3">
                          <div className="text-sm text-gray-500">
                            Guruh boshqaruvi
                          </div>
                          <div className="mt-2 space-y-2">
                            <button
                              onClick={() =>
                                updateGroupField(g.id, "price", "")
                              }
                              className="px-2 py-1 border rounded-md text-sm"
                            >
                              Narxni tozalash
                            </button>
                            <button
                              onClick={() => removeGroup(g.id)}
                              className="px-2 py-1 border rounded-md text-sm text-red-600"
                            >
                              Guruhni olib tashlash
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* final quick settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="text-sm text-gray-700">Qabul limit</label>
                  <input
                    type="number"
                    value={form.enrollmentLimit}
                    onChange={(e) =>
                      setField("enrollmentLimit", e.target.value)
                    }
                    className="mt-1 px-3 py-2 border rounded-md w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700">
                    Bildirishnomalar
                  </label>
                  <div className="mt-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={form.notificationsEnabled}
                        onChange={(e) =>
                          setField("notificationsEnabled", e.target.checked)
                        }
                        className="h-4 w-4"
                      />
                      <span className="ml-2 text-sm">
                        Ro'yxatdan o'tishda o'qituvchilarni ogohlantirish
                      </span>
                    </label>
                  </div>
                </div>

                <div className="text-right">
                  <label className="text-sm text-gray-700">Faol</label>
                  <div className="mt-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={form.active}
                        onChange={(e) => setField("active", e.target.checked)}
                        className="h-5 w-5"
                      />
                      <span className="ml-2 text-sm">
                        {form.active ? "Faol" : "Faol emas"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* bottom actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border rounded-md"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={() => handleSave(true)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md"
                >
                  Saqlab yana qo'shish
                </button>
                <button
                  onClick={() => handleSave(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
