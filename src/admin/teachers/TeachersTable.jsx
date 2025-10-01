import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
// API helpers (update names if your API module exports different functions)
import {
  patchTeacher as apiPatchTeacher,
  deleteTeacher as apiDeleteTeacher,
} from "../API/AdminPanelApi";

/**
 * TeachersTable
 *
 * Props (all optional — component works with internal mock data if not provided):
 * - teachers: array of teacher objects
 * - loading: boolean
 * - onDelete: (id) => Promise|void  // if provided, used to delete
 * - onToggleStatus: (teacher) => Promise|void // if provided, handles toggling status
 * - onSave: (id, payload) => Promise|void // if provided, handles saving edits
 * - refresh: () => void // called after successful backend changes
 */
export default function TeachersTable({
  teachers: propsTeachers = null,
  loading = false,
  onDelete = null,
  onToggleStatus = null,
  onSave = null,
  refresh = () => {},
}) {
  // fallback/mock data (so UI works while backend is not ready)
  const fallbackTeachers = [
    {
      id: 1,
      name: "Dr. Robert Smith",
      email: "robert.smith@codeschool.com",
      phone: "+1 (555) 111-2222",
      specialization: "JavaScript & React",
      experience: "8 years",
      status: "Active",
      classes: 3,
      students: 45,
      hireDate: "2020-03-15",
      __raw: {},
    },
    {
      id: 2,
      name: "Sarah Williams",
      email: "sarah.williams@codeschool.com",
      phone: "+1 (555) 333-4444",
      specialization: "Python & Django",
      experience: "6 years",
      status: "Active",
      classes: 2,
      students: 32,
      hireDate: "2021-08-10",
      __raw: {},
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michael.johnson@codeschool.com",
      phone: "+1 (555) 555-6666",
      specialization: "Web Development",
      experience: "10 years",
      status: "Active",
      classes: 4,
      students: 58,
      hireDate: "2019-01-20",
      __raw: {},
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma.davis@codeschool.com",
      phone: "+1 (555) 777-8888",
      specialization: "Data Science",
      experience: "5 years",
      status: "On Leave",
      classes: 1,
      students: 18,
      hireDate: "2022-06-05",
      __raw: {},
    },
    {
      id: 5,
      name: "Alex Chen",
      email: "alex.chen@codeschool.com",
      phone: "+1 (555) 999-0000",
      specialization: "Mobile Development",
      experience: "7 years",
      status: "Active",
      classes: 2,
      students: 29,
      hireDate: "2020-11-12",
      __raw: {},
    },
  ];

  // If parent passes teachers use them, otherwise use fallback
  const teachers = useMemo(
    () => (Array.isArray(propsTeachers) ? propsTeachers : fallbackTeachers),
    [propsTeachers]
  );

  const [panel, setPanel] = useState({ type: null, teacher: null }); // type: 'view' | 'edit' | 'delete'
  const [actionLoading, setActionLoading] = useState(false);

  // edit form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    status: "",
    classes: "",
    students: "",
    hireDate: "",
  });

  // fill edit form when edit panel opens
  useEffect(() => {
    if (panel.type === "edit" && panel.teacher) {
      const t = panel.teacher;
      setForm({
        name: t.name ?? "",
        email: t.email ?? "",
        phone: t.phone ?? "",
        specialization: t.specialization ?? "",
        experience: t.experience ?? "",
        status: t.status ?? "",
        classes: t.classes ?? "",
        students: t.students ?? "",
        hireDate: t.hireDate ?? "",
      });
    }
  }, [panel.type, panel.teacher]);

  // Escape handling: closes view/edit (but not delete)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (panel.type && panel.type !== "delete") {
          setPanel({ type: null, teacher: null });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel.type]);

  const getToken = () => localStorage.getItem("token");

  // Toggle status (prefers parent handler)
  const toggleStatus = async (teacher) => {
    if (typeof onToggleStatus === "function" && onToggleStatus !== null) {
      try {
        await onToggleStatus(teacher);
        return;
      } catch (err) {
        console.error("onToggleStatus error", err);
        alert("Holatni yangilashda xato yuz berdi.");
        return;
      }
    }

    // fallback: try calling API patch
    const currentActive =
      teacher.__raw?.active ??
      (teacher.status === "Active"
        ? true
        : teacher.status === "Inactive"
        ? false
        : undefined);
    const newActive = !(currentActive === true);
    setActionLoading(true);
    try {
      const token = getToken();
      await apiPatchTeacher(
        teacher.id,
        { active: newActive, is_active: newActive },
        token
      );
      if (typeof refresh === "function") refresh();
    } catch (err) {
      console.error("patchTeacher error", err);
      alert("Holatni yangilashda xatolik yuz berdi. Konsolga qarang.");
    } finally {
      setActionLoading(false);
    }
  };

  // Save edit (prefers parent onSave)
  const saveEdit = async () => {
    if (!panel.teacher) return;
    setActionLoading(true);

    // build broadly compatible payload (you can trim to exact keys later)
    const payload = {};
    if (form.name !== undefined) {
      payload.full_name = form.name;
      payload.name = form.name;
      const parts = (form.name || "").trim().split(/\s+/);
      if (parts.length >= 2) {
        payload.first_name = parts.shift();
        payload.last_name = parts.join(" ");
      } else if (parts.length === 1) {
        payload.first_name = parts[0];
      }
    }
    if (form.email) payload.email = form.email;
    if (form.phone) {
      payload.phone = form.phone;
      payload.phone_number = form.phone;
    }
    if (form.specialization) payload.specialization = form.specialization;
    if (form.experience) payload.experience = form.experience;
    if (form.classes !== "") payload.classes = form.classes;
    if (form.students !== "") payload.students = form.students;
    if (form.hireDate) payload.hireDate = form.hireDate;
    if (form.status) {
      payload.status = form.status;
      const isActive = String(form.status).toLowerCase() === "active";
      payload.active = isActive;
      payload.is_active = isActive;
    }

    // Prefer parent onSave if available
    try {
      if (typeof onSave === "function" && onSave !== null) {
        await onSave(panel.teacher.id, payload);
      } else {
        const token = getToken();
        await apiPatchTeacher(panel.teacher.id, payload, token);
      }
      alert("O'zgartirishlar saqlandi.");
      setPanel({ type: null, teacher: null });
      if (typeof refresh === "function") refresh();
    } catch (err) {
      console.error("saveEdit error", err);
      alert("Saqlashda xatolik yuz berdi. Konsolga qarang.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete confirm
  const confirmDelete = async () => {
    if (!panel.teacher) return;
    setActionLoading(true);

    try {
      if (typeof onDelete === "function" && onDelete !== null) {
        await onDelete(panel.teacher.id);
      } else {
        const token = getToken();
        await apiDeleteTeacher(panel.teacher.id, token);
      }
      alert("O'qituvchi o'chirildi.");
      setPanel({ type: null, teacher: null });
      if (typeof refresh === "function") refresh();
    } catch (err) {
      console.error("confirmDelete error", err);
      alert("O'chirishda xatolik yuz berdi. Konsolga qarang.");
    } finally {
      setActionLoading(false);
    }
  };

  // small helpers for badges/labels
  const getStatusBadge = (status) => {
    if (status === "Active") return "bg-green-100 text-green-800";
    if ((String(status) || "").toLowerCase() === "on leave")
      return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const localStatusLabel = (status) => {
    switch (String(status).toLowerCase()) {
      case "active":
        return "Faol";
      case "on leave":
        return "Ta'tilda";
      default:
        return status;
    }
  };

  // open panels
  const openView = (t) => setPanel({ type: "view", teacher: t });
  const openEdit = (t) => setPanel({ type: "edit", teacher: t });
  const openDelete = (t) => setPanel({ type: "delete", teacher: t });
  const closePanel = () => setPanel({ type: null, teacher: null });

  return (
    <div className="overflow-x-auto">
      <div className="p-4">
        <div className="text-sm text-gray-500">
          {loading ? "Yuklanmoqda..." : `${teachers.length} ta o'qituvchi`}
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              O'qituvchi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mutaxassisligi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tajriba
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Darslar
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Talabalar
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Holat
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amallar
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {teachers.map((teacher) => (
            <tr key={teacher.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">
                      {String(teacher.name || "")
                        .split(" ")
                        .map((n) => n?.[0] ?? "")
                        .join("")}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {teacher.name}
                    </div>
                    <div className="text-sm text-gray-500">{teacher.email}</div>
                    <div className="text-xs text-gray-400">{teacher.phone}</div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {teacher.specialization}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {teacher.experience}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{teacher.classes}</div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{teacher.students}</div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                    teacher.status
                  )}`}
                >
                  {localStatusLabel(teacher.status)}
                </span>
                <div className="mt-2">
                  <button
                    onClick={() => toggleStatus(teacher)}
                    className="mt-1 text-xs px-2 py-1 border rounded-md"
                  >
                    Holatni almashtirish
                  </button>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  {/* View as modal */}
                  <button
                    onClick={() => openView(teacher)}
                    className="text-green-600 hover:text-green-900"
                    title="Ko'rish"
                  >
                    <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                  </button>

                  {/* Edit as modal */}
                  <button
                    onClick={() => openEdit(teacher)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Tahrirlash"
                  >
                    <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                  </button>

                  {/* Delete -> centered confirmation */}
                  <button
                    onClick={() => openDelete(teacher)}
                    className="text-red-600 hover:text-red-900"
                    title="O'chirish"
                  >
                    <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------- CENTERED MODAL for VIEW / EDIT / DELETE ---------- */}
      {panel.type && panel.teacher && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            // Only allow backdrop-to-close for view/edit, not for delete
            onClick={() => {
              if (panel.type !== "delete")
                setPanel({ type: null, teacher: null });
            }}
          />

          <div className="relative z-10 bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {panel.type === "view" && "O'qituvchi — Ko'rish"}
                {panel.type === "edit" && "O'qituvchi — Tahrirlash"}
                {panel.type === "delete" && "O'qituvchini o'chirish"}
              </h3>
              <button
                onClick={() => setPanel({ type: null, teacher: null })}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* VIEW */}
            {panel.type === "view" && (
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Ism</div>
                  <div className="text-sm font-medium">
                    {panel.teacher.name}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-sm">{panel.teacher.email || "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Telefon</div>
                  <div className="text-sm">{panel.teacher.phone || "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Mutaxassisligi</div>
                  <div className="text-sm">
                    {panel.teacher.specialization || "-"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Tajriba</div>
                  <div className="text-sm">
                    {panel.teacher.experience || "-"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Darslar</div>
                  <div className="text-sm">{panel.teacher.classes ?? "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Talabalar</div>
                  <div className="text-sm">{panel.teacher.students ?? "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Holat</div>
                  <div className="text-sm">
                    {localStatusLabel(panel.teacher.status)}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Hire date</div>
                  <div className="text-sm">{panel.teacher.hireDate || "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Raw data (JSON)</div>
                  <pre className="bg-gray-50 p-3 rounded text-xs max-h-48 overflow-auto">
                    {JSON.stringify(
                      panel.teacher.__raw ?? panel.teacher,
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            )}

            {/* EDIT */}
            {panel.type === "edit" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500">Ism</label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full mt-1 px-3 py-2 border rounded"
                    placeholder="Ism"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Email</label>
                    <input
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                      className="w-full mt-1 px-3 py-2 border rounded"
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Telefon</label>
                    <input
                      value={form.phone}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      className="w-full mt-1 px-3 py-2 border rounded"
                      placeholder="Telefon"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500">
                    Mutaxassisligi
                  </label>
                  <input
                    value={form.specialization}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, specialization: e.target.value }))
                    }
                    className="w-full mt-1 px-3 py-2 border rounded"
                    placeholder="Mutaxassisligi"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Tajriba</label>
                    <input
                      value={form.experience}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, experience: e.target.value }))
                      }
                      className="w-full mt-1 px-3 py-2 border rounded"
                      placeholder="Tajriba (masalan: 5 years)"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Darslar</label>
                    <input
                      value={form.classes}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, classes: e.target.value }))
                      }
                      className="w-full mt-1 px-3 py-2 border rounded"
                      placeholder="Darslar soni"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Talabalar</label>
                    <input
                      value={form.students}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, students: e.target.value }))
                      }
                      className="w-full mt-1 px-3 py-2 border rounded"
                      placeholder="Talabalar soni"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Holat</label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, status: e.target.value }))
                      }
                      className="w-full mt-1 px-3 py-2 border rounded"
                    >
                      <option value="">— Tanlang —</option>
                      <option value="Active">Faol</option>
                      <option value="On Leave">Ta'tilda</option>
                      <option value="Inactive">Faol emas</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Hire date</label>
                    <input
                      value={form.hireDate}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, hireDate: e.target.value }))
                      }
                      className="w-full mt-1 px-3 py-2 border rounded"
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={closePanel}
                    className="px-4 py-2 rounded border"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={saveEdit}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded bg-purple-600 text-white"
                  >
                    {actionLoading ? "Saqlanyapti..." : "Saqla"}
                  </button>
                </div>
              </div>
            )}

            {/* DELETE */}
            {panel.type === "delete" && (
              <div className="space-y-4">
                <p>
                  Siz <strong>{panel.teacher.name}</strong> ismli o'qituvchini{" "}
                  <span className="text-red-600 font-semibold">
                    o'chirmoqchi
                  </span>{" "}
                  siz. Bu amalni qaytara olmaysiz.
                </p>
                <div className="text-sm text-gray-500">
                  <ul className="list-disc pl-5 mt-2">
                    <li>
                      Agar backend shu tarzda sozlangan bo'lsa, bog'liq yozuvlar
                      ham o'chirilishi mumkin.
                    </li>
                    <li>
                      Iltimos, agar ishonchingiz komil bo'lmasa, avval zaxira
                      yoki testing muhitida sinab ko'ring.
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={closePanel}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded border"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded bg-red-600 text-white"
                  >
                    {actionLoading
                      ? "O'chirilmoqda..."
                      : "Ha, o'chirishni tasdiqlayman"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
