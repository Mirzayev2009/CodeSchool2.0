import React, { useMemo, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  patchStudent as apiPatchStudent,
  deleteStudent as apiDeleteStudent,
} from "../API/AdminPanelApi";

export default function StudentsTable({
  searchTerm,
  filterClass,
  filterStatus,
  filterAttendanceStatus,
  students = [],
  loading = false,
  onDelete = null,
  onToggleStatus = null,
  refresh = () => {},
}) {
  const filteredStudents = useMemo(() => {
    const q = (searchTerm ?? "").toLowerCase();
    return (students ?? []).filter((student) => {
      const matchesSearch =
        (student.name ?? "").toLowerCase().includes(q) ||
        (student.email ?? "").toLowerCase().includes(q);

      const matchesClass =
        (filterClass ?? "") === "" || (student.class ?? "") === filterClass;
      const matchesStatus =
        (filterStatus ?? "") === "" || (student.status ?? "") === filterStatus;
      const matchesAttendance =
        (filterAttendanceStatus ?? "") === "" ||
        (student.attendance ?? "") === filterAttendanceStatus;

      return (
        matchesSearch && matchesClass && matchesStatus && matchesAttendance
      );
    });
  }, [students, searchTerm, filterClass, filterStatus, filterAttendanceStatus]);

  const getStatusBadge = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getGradeBadge = (grade) => {
    if (!grade) return "bg-gray-100 text-gray-800";
    if (String(grade).startsWith("A")) return "bg-green-100 text-green-800";
    if (String(grade).startsWith("B")) return "bg-blue-100 text-blue-800";
    if (String(grade).startsWith("C")) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const localStatusLabel = (status) => {
    switch (String(status).toLowerCase()) {
      case "active":
        return "Faol";
      case "inactive":
        return "Faol emas";
      case "graduated":
        return "Bitirgan";
      case "suspended":
        return "To'xtatilgan";
      default:
        return status;
    }
  };

  // panel: { type: 'view' | 'edit' | 'delete' | null, student: object | null }
  const [panel, setPanel] = useState({ type: null, student: null });
  const [actionLoading, setActionLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    classVal: "",
    status: "",
    attendance: "",
    grades: "",
  });

  // populate edit form when opening edit
  useEffect(() => {
    if (panel.type === "edit" && panel.student) {
      const s = panel.student;
      setForm({
        name: s.name ?? "",
        email: s.email ?? "",
        phone: s.phone ?? "",
        classVal: s.class ?? s.group ?? "",
        status: s.status ?? "",
        attendance: s.attendance ?? "",
        grades: s.grades ?? s.grade ?? "",
      });
    }
  }, [panel.type, panel.student]);

  // Escape handling: closes only view/edit (NOT delete)
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        if (panel.type && panel.type !== "delete") {
          setPanel({ type: null, student: null });
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel.type]);

  const getToken = () => localStorage.getItem("token");

  // Save edit
  const saveEdit = async () => {
    if (!panel.student) return;
    setActionLoading(true);

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
    if (form.classVal) {
      payload.class = form.classVal;
      payload.group = form.classVal;
      payload.group_name = form.classVal;
      payload.course_name = form.classVal;
    }
    if (form.attendance) payload.attendance = form.attendance;
    if (form.grades) {
      payload.grades = form.grades;
      payload.grade = form.grades;
    }
    if (form.status) {
      payload.status = form.status;
      const activeBool = String(form.status).toLowerCase() === "active";
      payload.active = activeBool;
      payload.is_active = activeBool;
    }

    try {
      const token = getToken();
      await apiPatchStudent(panel.student.id, payload, token);
      alert("O'zgartirishlar saqlandi.");
      setPanel({ type: null, student: null });
      if (typeof refresh === "function") refresh();
    } catch (err) {
      console.error("saveEdit error", err);
      alert("Saqlashda xatolik yuz berdi. Konsolga qarang.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete confirmation
  const confirmDelete = async () => {
    if (!panel.student) return;
    setActionLoading(true);

    const useParentDelete = typeof onDelete === "function" && onDelete !== null;

    try {
      if (useParentDelete) {
        await onDelete(panel.student.id);
      } else {
        const token = getToken();
        await apiDeleteStudent(panel.student.id, token);
      }
      alert("Talaba o'chirildi.");
      setPanel({ type: null, student: null });
      if (typeof refresh === "function") refresh();
    } catch (err) {
      console.error("confirmDelete error", err);
      alert("O'chirishda xatolik yuz berdi. Konsolga qarang.");
    } finally {
      setActionLoading(false);
    }
  };

  const openView = (student) => setPanel({ type: "view", student });
  const openEdit = (student) => setPanel({ type: "edit", student });
  const openDelete = (student) => setPanel({ type: "delete", student });
  const closePanel = () => setPanel({ type: null, student: null });

  const toggleStatus = async (student) => {
    if (typeof onToggleStatus === "function" && onToggleStatus !== null) {
      onToggleStatus(student);
      return;
    }
    const currentActive =
      student.__raw?.active ??
      (student.status === "Active"
        ? true
        : student.status === "Inactive"
        ? false
        : undefined);
    const newActive = !(currentActive === true);
    setActionLoading(true);
    try {
      const token = getToken();
      await apiPatchStudent(
        student.id,
        { active: newActive, is_active: newActive },
        token
      );
      if (typeof refresh === "function") refresh();
    } catch (err) {
      console.error("patchStudent error", err);
      alert("Holatni yangilashda xatolik yuz berdi. Konsolga qarang.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="text-sm text-gray-500">
          {loading ? "Yuklanmoqda..." : `${filteredStudents.length} ta talaba`}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="px-3 py-2 bg-gray-100 rounded-md text-sm"
          >
            Yangilash
          </button>
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Talaba
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sinf
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ro'yxatga olish sanasi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Holat
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Qatnashuv
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bahosi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amallar
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredStudents.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">
                      {String(student.name || "")
                        .split(" ")
                        .map((n) => n?.[0] ?? "")
                        .join("")}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {student.name}
                    </div>
                    <div className="text-sm text-gray-500">{student.email}</div>
                    <div className="text-xs text-gray-400">{student.phone}</div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{student.class}</div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {student.enrollmentDate}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                    student.status
                  )}`}
                >
                  {localStatusLabel(student.status)}
                </span>
                <div className="mt-2">
                  <button
                    onClick={() => toggleStatus(student)}
                    className="mt-1 text-xs px-2 py-1 border rounded-md"
                  >
                    Holatni almashtirish
                  </button>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {student.attendance}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeBadge(
                    student.grades
                  )}`}
                >
                  {student.grades}
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openView(student)}
                    className="text-purple-600 hover:text-purple-900"
                    title="Ko'rish"
                  >
                    <i className="ri-eye-line w-4 h-4 flex items-center justify-center"></i>
                  </button>

                  <button
                    onClick={() => openEdit(student)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Tahrirlash"
                  >
                    <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                  </button>

                  <button
                    onClick={() => openDelete(student)}
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

      {filteredStudents.length === 0 && !loading && (
        <div className="text-center py-12">
          <i className="ri-user-search-line w-12 h-12 flex items-center justify-center text-gray-400 mx-auto mb-4"></i>
          <p className="text-gray-500">
            Sizning mezonlarga mos talaba topilmadi
          </p>
        </div>
      )}

      {/* ---------- Centered modal used for VIEW, EDIT, and DELETE (delete has stricter behavior) ---------- */}
      {panel.type && panel.student && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            // Only allow backdrop click to close for view/edit (NOT delete)
            onClick={() => {
              if (panel.type !== "delete") closePanel();
            }}
          />

          {/* Modal content */}
          <div className="relative z-10 bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {panel.type === "view" && `Talaba — Ko'rish`}
                {panel.type === "edit" && `Talaba — Tahrirlash`}
                {panel.type === "delete" && `Talabani o'chirish`}
              </h3>
              {/* Close button: for delete we still allow explicit cancel, but keep the 'X' to close as cancel */}
              <button
                onClick={() => {
                  // Do not allow closing by 'X' if you want stricter behavior — but user wanted centered delete with explicit cancel/confirm.
                  // Here X behaves same as Cancel for delete.
                  closePanel();
                }}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* VIEW */}
            {panel.type === "view" && panel.student && (
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Ism</div>
                  <div className="text-sm font-medium">
                    {panel.student.name}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-sm">{panel.student.email || "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Telefon</div>
                  <div className="text-sm">{panel.student.phone || "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Sinf / Guruh</div>
                  <div className="text-sm">{panel.student.class || "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">
                    Ro'yxatga olish sanasi
                  </div>
                  <div className="text-sm">
                    {panel.student.enrollmentDate || "-"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Holat</div>
                  <div className="text-sm">
                    {localStatusLabel(panel.student.status)}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Qatnashuv</div>
                  <div className="text-sm">
                    {panel.student.attendance || "-"}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Bahosi</div>
                  <div className="text-sm">{panel.student.grades || "-"}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Raw data (JSON)</div>
                  <pre className="bg-gray-50 p-3 rounded text-xs max-h-48 overflow-auto">
                    {JSON.stringify(
                      panel.student.__raw ?? panel.student,
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            )}

            {/* EDIT */}
            {panel.type === "edit" && panel.student && (
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
                  <label className="text-xs text-gray-500">Sinf / Guruh</label>
                  <input
                    value={form.classVal}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, classVal: e.target.value }))
                    }
                    className="w-full mt-1 px-3 py-2 border rounded"
                    placeholder="Sinf yoki guruh nomi"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                      <option value="Inactive">Faol emas</option>
                      <option value="Graduated">Bitirgan</option>
                      <option value="Suspended">To'xtatilgan</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Qatnashuv</label>
                    <select
                      value={form.attendance}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, attendance: e.target.value }))
                      }
                      className="w-full mt-1 px-3 py-2 border rounded"
                    >
                      <option value="">— Tanlang —</option>
                      <option value="Present">Kelgan</option>
                      <option value="Absent">Kelmagan</option>
                      <option value="Late">Kechikkan</option>
                      <option value="Excused">Ruxsatli</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Bahosi</label>
                    <input
                      value={form.grades}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, grades: e.target.value }))
                      }
                      className="w-full mt-1 px-3 py-2 border rounded"
                      placeholder="Bahosi (A, B, 90, ...)"
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
            {panel.type === "delete" && panel.student && (
              <div className="space-y-4">
                <p>
                  Siz <strong>{panel.student.name}</strong> ismli talabani{" "}
                  <span className="text-red-600 font-semibold">
                    o'chirmoqchi
                  </span>{" "}
                  siz. Bu amalni qaytara olmaysiz.
                </p>
                <div className="text-sm text-gray-500">
                  <ul className="list-disc pl-5 mt-2">
                    <li>
                      Talabaning barcha bog'liq maydonlari (agar backend
                      tomonidan shu tarzda) o'chirilishi mumkin.
                    </li>
                    <li>
                      Agar tizimingizda bog'langan yozuvlar (to'lovlar, darslar)
                      bo'lsa, ular alohida saqlanadi yoki cheklanishi mumkin.
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
