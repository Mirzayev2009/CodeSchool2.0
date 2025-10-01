"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../../../components/AdminSidebar";
import {
  getGroups,
  getStudent,
  createStudent,
  updateStudent,
} from "../API/AdminPanelApi"; // keep your import path

export default function StudentCreate() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    parentsPhoneNumber: "",
    adminNotes: "",
    groups: [], // array of group ids (strings)
    status: "active",
  });

  const [groups, setGroups] = useState([]); // full group objects: { id, name }
  const [loading, setLoading] = useState(false);
  const [groupSearch, setGroupSearch] = useState("");
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

  const [errors, setErrors] = useState(null); // server validation errors
  const [successData, setSuccessData] = useState(null); // holds API success response (with credentials)
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const editingId = params.get("id");
  const dropdownRef = useRef(null);

  // helper: check common localStorage keys for token
  function getTokenFromStorage() {
    return (
      localStorage.getItem("token") ??
      localStorage.getItem("authToken") ??
      localStorage.getItem("apiToken") ??
      localStorage.getItem("admin_token") ??
      localStorage.getItem("accessToken") ??
      ""
    );
  }

  // normalize group(s) from various backend shapes into an array of ids (strings)
  function normalizeGroupsFromStudent(student) {
    if (!student) return [];
    if (Array.isArray(student.groups)) {
      return student.groups
        .map((g) => String(g?.id ?? g?.pk ?? g ?? ""))
        .filter(Boolean);
    }
    if (student.group) {
      if (Array.isArray(student.group)) {
        return student.group
          .map((g) => String(g?.id ?? g?.pk ?? g ?? ""))
          .filter(Boolean);
      }
      if (typeof student.group === "object") {
        return [String(student.group.id ?? student.group.pk ?? "")].filter(
          Boolean
        );
      }
      return [String(student.group)].filter(Boolean);
    }
    const maybeList =
      student.group_ids ??
      student.groups_ids ??
      student.group_id ??
      student.group_pk;
    if (Array.isArray(maybeList))
      return maybeList.map((g) => String(g)).filter(Boolean);
    if (maybeList) return [String(maybeList)];
    return [];
  }

  useEffect(() => {
    const token = getTokenFromStorage();
    if (!token) return;

    let mounted = true;
    (async () => {
      try {
        const res = await getGroups(token);
        // backend may return array or { results: [], data: [] }
        const list = Array.isArray(res) ? res : res.results ?? res.data ?? [];
        if (!mounted) return;
        // normalize into { id: string, name: string }
        const normalized = list.map((g) => ({
          id: String(g?.id ?? g?.pk ?? g?.group_id ?? g ?? ""),
          name: String(
            g?.name ??
              g?.title ??
              g?.uz ??
              g?.label ??
              String(g?.id ?? g) ??
              "Guruh"
          ),
        }));
        setGroups(normalized);
      } catch (err) {
        console.error("Failed to load groups", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // load student if editing
  useEffect(() => {
    if (!editingId) return;
    const token = getTokenFromStorage();
    if (!token) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getStudent(editingId, token);
        if (!mounted) return;
        const student = res ?? {};

        setFormData((prev) => ({
          ...prev,
          firstName: String(
            student.first_name ?? student.name ?? student.firstName ?? ""
          ),
          lastName: String(
            student.last_name ?? student.lastName ?? student.surname ?? ""
          ),
          email: String(student.email ?? student.contact_email ?? ""),
          phoneNumber: String(
            student.phone_number ??
              student.mobile ??
              student.phone ??
              student.number ??
              ""
          ),
          parentsPhoneNumber: String(
            student.parents_phone_number ??
              student.parent_phone ??
              student.parentPhone ??
              student.parent_number ??
              ""
          ),
          adminNotes: String(
            student.admin_notes ??
              student.adminNotes ??
              student.notes ??
              student.note ??
              student.description ??
              ""
          ),
          groups: normalizeGroupsFromStudent(student),
          status:
            student.status ??
            (student.is_active ? "active" : "inactive") ??
            "active",
        }));
      } catch (err) {
        console.error("Failed to load student", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [editingId]);

  // outside click to close dropdown
  useEffect(() => {
    function handler(e) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) {
        setShowGroupDropdown(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // map local -> state
    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear server errors for that field while typing
    const serverKey = localToServerKey(name);
    setErrors((prev) => (prev ? { ...prev, [serverKey]: undefined } : prev));
  };

  const handleGroupSearchChange = (e) => {
    setGroupSearch(e.target.value);
    setShowGroupDropdown(true);
  };

  const addGroup = (groupId) => {
    // add and close dropdown per your request
    setFormData((prev) => ({
      ...prev,
      groups: Array.from(new Set([...prev.groups, String(groupId)])),
    }));
    setGroupSearch("");
    setShowGroupDropdown(false); // <-- close dropdown immediately when group assigned
  };

  const removeGroup = (groupId) => {
    setFormData((prev) => ({
      ...prev,
      groups: prev.groups.filter((g) => String(g) !== String(groupId)),
    }));
  };

  const validate = () => {
    const e = {};
    if (!formData.firstName.trim()) e.first_name = ["Ism kiritilishi shart."];
    if (!formData.lastName.trim())
      e.last_name = ["Familiya kiritilishi shart."];
    if (!formData.phoneNumber.trim())
      e.phone_number = ["Telefon raqami kiritilishi shart."];
    if (!formData.parentsPhoneNumber.trim())
      e.parents_phone_number = ["Ota-onaning telefoni kiritilishi shart."];
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = [
        "To'g'ri elektron pochta manzili kiriting yoki bo'sh qoldiring",
      ];
    }
    setErrors(Object.keys(e).length ? e : null);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setSuccessData(null);

    if (!validate()) return;

    const token = getTokenFromStorage();
    if (!token) {
      alert("LocalStorage'da autentifikatsiya tokeni topilmadi");
      return;
    }

    // payload matching your API example
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      ...(formData.email ? { email: formData.email } : {}),
      phone_number: formData.phoneNumber || "",
      parents_phone_number: formData.parentsPhoneNumber || "",
      admin_notes: formData.adminNotes || "",
      groups: formData.groups || [],
    };

    try {
      setLoading(true);
      if (editingId) {
        // update flow
        const res = await updateStudent(editingId, payload, token);
        // if backend returns validation-like object:
        if (
          res &&
          typeof res === "object" &&
          (res.first_name ||
            res.last_name ||
            res.phone_number ||
            res.parents_phone_number ||
            res.detail)
        ) {
          const normalized = {};
          Object.entries(res).forEach(([k, v]) => {
            normalized[k] = Array.isArray(v) ? v : [String(v)];
          });
          setErrors(normalized);
          return;
        }
        // edited successfully — show small panel with returned student (no credentials expected for edit)
        setSuccessData({
          message: "Talaba muvaffaqiyatli yangilandi",
          student: res,
        });
      } else {
        // create flow
        const res = await createStudent(payload, token);

        // If API returns validation errors as object (400) — show them
        if (
          res &&
          typeof res === "object" &&
          (res.first_name ||
            res.last_name ||
            res.phone_number ||
            res.parents_phone_number ||
            res.detail)
        ) {
          const normalized = {};
          Object.entries(res).forEach(([k, v]) => {
            normalized[k] = Array.isArray(v) ? v : [String(v)];
          });
          setErrors(normalized);
          return;
        }

        // Expect success response with credentials/user/student
        // If response contains credentials -> show success panel
        if (res && typeof res === "object" && res.credentials) {
          setSuccessData(res);
          // do NOT navigate away — show panel with credentials
          return;
        }

        // If API returned created student directly:
        setSuccessData({
          message: "Talaba muvaffaqiyatli ro'yxatga olindi",
          student: res,
        });
      }
    } catch (err) {
      console.error("Save failed", err);
      // our API helper might throw with parsed body in err.body
      const body = err?.body ?? err?.response ?? null;
      if (body && typeof body === "object") {
        const normalized = {};
        Object.entries(body).forEach(([k, v]) => {
          normalized[k] = Array.isArray(v) ? v : [String(v)];
        });
        setErrors(normalized);
      } else {
        if (err && err.message)
          alert("Saqlash muvaffaqiyatsiz tugadi: " + err.message);
        else alert("Saqlash muvaffaqiyatsiz tugadi");
      }
    } finally {
      setLoading(false);
    }
  };

  // mapping helper for clearing errors
  function localToServerKey(local) {
    if (local === "firstName") return "first_name";
    if (local === "lastName") return "last_name";
    if (local === "phoneNumber") return "phone_number";
    if (local === "parentsPhoneNumber") return "parents_phone_number";
    if (local === "adminNotes") return "admin_notes";
    return local;
  }

  const serverError = (field) => {
    if (!errors) return null;
    const msg = errors[field];
    if (!msg) return null;
    return (
      <div className="text-red-600 text-sm mt-1">
        {Array.isArray(msg) ? msg.join(" ") : String(msg)}
      </div>
    );
  };

  // --- success helpers ---
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Buferga nusxalandi");
    } catch (e) {
      console.error("Copy failed", e);
      alert("Nusxalash muvaffaqiyatsiz tugadi");
    }
  };

  const downloadCredentials = () => {
    if (!successData) return;
    const { credentials = {}, user = {}, student = {} } = successData;
    const lines = [
      successData.message ?? "Talaba muvaffaqiyatli ro'yxatga olindi",
      "",
      "KIRISH MA'LUMOTLARI:",
      `foydalanuvchi: ${credentials.username ?? ""}`,
      `parol: ${credentials.password ?? ""}`,
      credentials.note ? `eslatma: ${credentials.note}` : "",
      "",
      "FOYDALANUVCHI:",
      `id: ${user.id ?? ""}`,
      `username: ${user.username ?? ""}`,
      `email: ${user.email ?? ""}`,
      "",
      "TALABA:",
      `id: ${student.id ?? ""}`,
      `ism: ${student.first_name ?? ""}`,
      `familiya: ${student.last_name ?? ""}`,
      `telefon: ${student.phone_number ?? ""}`,
      `ota-ona telefoni: ${student.parents_phone_number ?? ""}`,
      student.admin_notes
        ? `administrator eslatmalari: ${student.admin_notes}`
        : "",
      student.groups
        ? `guruhlar: ${
            Array.isArray(student.groups)
              ? student.groups.join(", ")
              : student.groups
          }`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const name =
      (credentials.username ? `student-${credentials.username}` : "student") +
      ".txt";
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const onCreateAnother = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      parentsPhoneNumber: "",
      adminNotes: "",
      groups: [],
      status: "active",
    });
    setErrors(null);
    setSuccessData(null);
    setShowPassword(false);
  };

  // helper to show group names if student.groups is array of ids
  const groupLabel = (id) => {
    const g = groups.find((x) => String(x.id) === String(id));
    return g ? g.name : String(id);
  };

  const availableOptions = groups.filter(
    (g) => !formData.groups.includes(String(g.id))
  );
  const filteredOptions = availableOptions.filter((g) =>
    g.name.toLowerCase().includes(groupSearch.trim().toLowerCase())
  );

  // Render
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar isOpen={true} />

      <main className="flex-1 ml-0 lg:ml-64 p-6">
        <h1 className="text-2xl font-bold mb-6">
          {editingId ? "Talabani tahrirlash" : "Yangi talaba qo'shish"}
        </h1>

        {successData ? (
          <div className="max-w-2xl bg-white p-6 rounded-xl shadow space-y-6">
            <div>
              <h2 className="text-xl font-semibold">
                {successData.message ??
                  "Talaba muvaffaqiyatli ro'yxatga olindi"}
              </h2>
              {successData.message && (
                <p className="text-sm text-gray-600 mt-1">
                  {successData.message}
                </p>
              )}
            </div>

            {successData.credentials && (
              <div className="border rounded p-4">
                <h3 className="font-medium mb-2">Kirish ma'lumotlari</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Foydalanuvchi</div>
                      <div className="font-medium">
                        {successData.credentials?.username ?? "—"}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            successData.credentials?.username ?? ""
                          )
                        }
                        className="px-3 py-1 border rounded text-sm"
                      >
                        Nusxalash
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Parol</div>
                      <div className="font-medium">
                        {showPassword
                          ? successData.credentials?.password ?? "—"
                          : "••••••••"}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="px-3 py-1 border rounded text-sm"
                      >
                        {showPassword ? "Yashirish" : "Ko'rsatish"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            successData.credentials?.password ?? ""
                          )
                        }
                        className="px-3 py-1 border rounded text-sm"
                      >
                        Nusxalash
                      </button>
                    </div>
                  </div>

                  {successData.credentials?.note && (
                    <div>
                      <div className="text-sm text-gray-500">Eslatma</div>
                      <div className="text-sm">
                        {successData.credentials.note}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `foydalanuvchi: ${
                          successData.credentials?.username ?? ""
                        }\nparol: ${successData.credentials?.password ?? ""}\n${
                          successData.credentials?.note
                            ? `eslatma: ${successData.credentials.note}`
                            : ""
                        }`
                      )
                    }
                    className="px-4 py-2 bg-gray-100 rounded"
                  >
                    Hammasini nusxalash
                  </button>

                  <button
                    type="button"
                    onClick={downloadCredentials}
                    className="px-4 py-2 bg-gray-100 rounded"
                  >
                    Yuklab olish (.txt)
                  </button>
                </div>
              </div>
            )}

            {successData.student && (
              <div className="border rounded p-4">
                <h3 className="font-medium mb-2">Talaba</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <span className="text-sm text-gray-500">Talaba ID:</span>{" "}
                    <span className="font-medium">
                      {successData.student?.id ?? "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Ism:</span>{" "}
                    <span className="font-medium">
                      {(successData.student?.first_name ?? "") +
                        " " +
                        (successData.student?.last_name ?? "")}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Telefon:</span>{" "}
                    <span className="font-medium">
                      {successData.student?.phone_number ?? "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Ota-onaning telefoni:
                    </span>{" "}
                    <span className="font-medium">
                      {successData.student?.parents_phone_number ??
                        successData.student?.parents_phone_number ??
                        successData.student?.parentsPhoneNumber ??
                        "—"}
                    </span>
                  </div>
                  {successData.student?.admin_notes && (
                    <div>
                      <span className="text-sm text-gray-500">
                        Administrator eslatmalari:
                      </span>{" "}
                      <span className="font-medium">
                        {successData.student.admin_notes}
                      </span>
                    </div>
                  )}
                  {successData.student?.groups &&
                    Array.isArray(successData.student.groups) && (
                      <div>
                        <div className="text-sm text-gray-500">Guruhlar</div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {successData.student.groups.map((gId) => (
                            <div
                              key={String(gId)}
                              className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                            >
                              {groupLabel(gId)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCreateAnother}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Yana birini yaratish
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/students")}
                className="px-4 py-2 border rounded"
              >
                Talabalar ro'yxatiga o'tish
              </button>
            </div>

            <div className="text-sm text-yellow-700">
              <strong>Eslatma:</strong> Kirish ma'lumotlarini hozir nusxalash
              yoki yuklab oling — ular tizimda qayta ko'rsatilmaydi.
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 max-w-2xl bg-white p-6 rounded-xl shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Ism</label>
                <input
                  type="text"
                  name="firstName"
                  className="w-full border rounded p-2"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                {serverError("first_name")}
              </div>

              <div>
                <label className="block font-medium">Familiya</label>
                <input
                  type="text"
                  name="lastName"
                  className="w-full border rounded p-2"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                {serverError("last_name")}
              </div>
            </div>

            <div>
              <label className="block font-medium">
                Elektron pochta (ixtiyoriy)
              </label>
              <input
                type="email"
                name="email"
                className="w-full border rounded p-2"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@example.com"
              />
              {serverError("email")}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Telefon</label>
                <input
                  type="text"
                  name="phoneNumber"
                  className="w-full border rounded p-2"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                {serverError("phone_number")}
              </div>
              <div>
                <label className="block font-medium">Ota-ona telefoni</label>
                <input
                  type="text"
                  name="parentsPhoneNumber"
                  className="w-full border rounded p-2"
                  value={formData.parentsPhoneNumber}
                  onChange={handleChange}
                />
                {serverError("parents_phone_number")}
              </div>
            </div>

            {/* Tag-style multi-select for groups */}
            <div ref={dropdownRef} className="relative">
              <label className="block font-medium">Guruh(lar) belgilash</label>

              <div className="mt-2 p-2 border rounded flex flex-wrap gap-2 min-h-[48px] items-center">
                {formData.groups.length === 0 && (
                  <span className="text-sm text-gray-400">
                    Guruhlar belgilanmagan
                  </span>
                )}

                {formData.groups.map((gid) => {
                  const g = groups.find((x) => String(x.id) === String(gid));
                  const label = g ? g.name : gid;
                  return (
                    <div
                      key={gid}
                      className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{label}</span>
                      <button
                        type="button"
                        onClick={() => removeGroup(gid)}
                        aria-label={`Remove ${label}`}
                        className="text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}

                <div className="flex-1 min-w-[180px]">
                  <input
                    type="text"
                    value={groupSearch}
                    onChange={handleGroupSearchChange}
                    onFocus={() => setShowGroupDropdown(true)}
                    placeholder="Guruh nomi bo'yicha qidirib qo'shing..."
                    className="w-full outline-none p-1"
                  />
                </div>
              </div>

              {showGroupDropdown && (
                <div className="absolute left-0 right-0 mt-2 bg-white border rounded shadow z-50 max-h-56 overflow-auto">
                  {filteredOptions.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">
                      Guruh topilmadi
                    </div>
                  ) : (
                    filteredOptions.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        className="w-full text-left p-3 hover:bg-gray-100"
                        onClick={() => addGroup(g.id)}
                      >
                        {g.name}
                      </button>
                    ))
                  )}
                </div>
              )}

              <p className="text-sm text-gray-500 mt-1">
                Guruh ustiga bosib uni qo'shing — tanlangach dropdown avtomatik
                yopiladi.
              </p>
            </div>

            <div>
              <label className="block font-medium">
                Administrator eslatmalari (ixtiyoriy)
              </label>
              <textarea
                name="adminNotes"
                className="w-full border rounded p-2 h-28"
                value={formData.adminNotes}
                onChange={handleChange}
                placeholder="Xodimlar uchun ichki eslatmalar (ixtiyoriy)"
              />
              {serverError("admin_notes")}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Holat</label>
                <select
                  name="status"
                  className="w-full border rounded p-2"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Faol</option>
                  <option value="inactive">Faol emas</option>
                </select>
                {serverError("status")}
              </div>
            </div>

            {(serverError("non_field_errors") || serverError("detail")) && (
              <div className="text-red-600 text-sm">
                {serverError("non_field_errors") || serverError("detail")}
              </div>
            )}

            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? "Saqlanmoqda..." : "Talabani saqlash"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
