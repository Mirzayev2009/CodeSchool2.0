// src/pages/admin/TeacherCreate.uz.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// adjust path if necessary:
import AdminSidebar from "../../../components/AdminSidebar";
import { createTeacher } from "../API/AdminPanelApi";

export default function TeacherCreate() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    subject: "",
    salary: "",
    status: "active",
  });
  const [errors, setErrors] = useState({}); // server validation errors
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null); // holds API success response
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

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

  const serverKey = (local) =>
    local === "firstName"
      ? "first_name"
      : local === "lastName"
      ? "last_name"
      : local === "phoneNumber"
      ? "phone_number"
      : local;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    // clear related server error while typing
    setErrors((prev) => ({ ...prev, [serverKey(name)]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!formData.firstName.trim()) e.first_name = ["Ism kiritilishi shart."];
    if (!formData.lastName.trim())
      e.last_name = ["Familiya kiritilishi shart."];
    if (!formData.phoneNumber.trim())
      e.phone_number = ["Telefon raqami kiritilishi shart."];
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email))
      e.email = ["Iltimos, to'g'ri elektron pochta manzili kiriting."];
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setErrors({});
    if (!validate()) return;

    const token = getTokenFromStorage();
    if (!token) {
      alert("LocalStorage'da autentifikatsiya tokeni topilmadi");
      return;
    }

    const payload = {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      phone_number: formData.phoneNumber.trim(),
      ...(formData.email ? { email: formData.email.trim() } : {}),
      ...(formData.subject ? { subject: formData.subject.trim() } : {}),
      ...(formData.salary ? { salary: Number(formData.salary) } : {}),
      status: formData.status,
    };

    try {
      setLoading(true);
      const res = await createTeacher(payload, token);

      // If API returns validation errors as object (bad request), show them
      if (
        res &&
        typeof res === "object" &&
        (res.first_name ||
          res.last_name ||
          res.phone_number ||
          res.email ||
          res.detail)
      ) {
        const normalized = {};
        Object.entries(res).forEach(([k, v]) => {
          normalized[k] = Array.isArray(v) ? v : [String(v)];
        });
        setErrors(normalized);
        return;
      }

      // Expect success response object
      setSuccessData(res);
      // keep form as-is (we show the success panel). Admin can "Create another" to reset.
    } catch (err) {
      // our API helper may throw with parsed body in err.body
      const body = err?.body ?? err?.response ?? null;
      if (body && typeof body === "object") {
        const normalized = {};
        Object.entries(body).forEach(([k, v]) => {
          normalized[k] = Array.isArray(v) ? v : [String(v)];
        });
        setErrors(normalized);
      } else {
        console.error(err);
        alert(
          "O'qituvchi yaratishda xato: " + (err?.message ?? JSON.stringify(err))
        );
      }
    } finally {
      setLoading(false);
    }
  };

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
    const { credentials = {}, user = {}, teacher = {} } = successData;
    const lines = [
      successData.message ?? "O'qituvchi muvaffaqiyatli ro'yxatga olindi",
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
      "O'QITUVCHI:",
      `id: ${teacher.id ?? ""}`,
      `ism: ${teacher.first_name ?? ""}`,
      `familiya: ${teacher.last_name ?? ""}`,
      `telefon: ${teacher.phone_number ?? ""}`,
    ]
      .filter(Boolean)
      .join("\n");

    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const name =
      (credentials.username ? `teacher-${credentials.username}` : "teacher") +
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
      subject: "",
      salary: "",
      status: "active",
    });
    setErrors({});
    setSuccessData(null);
    setShowPassword(false);
  };

  // Render
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar isOpen={true} />

      <main className="flex-1 ml-0 lg:ml-64 p-6">
        <h1 className="text-2xl font-bold mb-6">Yangi o'qituvchi qo'shish</h1>

        {/* If successData exists, show success panel instead of simple alert */}
        {successData ? (
          <div className="max-w-2xl bg-white p-6 rounded-xl shadow space-y-6">
            <div>
              <h2 className="text-xl font-semibold">
                {successData.message ??
                  "O'qituvchi muvaffaqiyatli ro'yxatga olindi"}
              </h2>
              {successData.message && (
                <p className="text-sm text-gray-600 mt-1">
                  {successData.message}
                </p>
              )}
            </div>

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
                        copyToClipboard(successData.credentials?.username ?? "")
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
                        copyToClipboard(successData.credentials?.password ?? "")
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

            <div className="border rounded p-4">
              <h3 className="font-medium mb-2">O'qituvchi / Foydalanuvchi</h3>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <span className="text-sm text-gray-500">O'qituvchi ID:</span>{" "}
                  <span className="font-medium">
                    {successData.teacher?.id ?? "—"}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Ism:</span>{" "}
                  <span className="font-medium">
                    {(successData.teacher?.first_name ?? "") +
                      " " +
                      (successData.teacher?.last_name ?? "")}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Telefon:</span>{" "}
                  <span className="font-medium">
                    {successData.teacher?.phone_number ?? "—"}
                  </span>
                </div>
                <div className="pt-2">
                  <span className="text-sm text-gray-500">
                    Foydalanuvchi ID:
                  </span>{" "}
                  <span className="font-medium">
                    {successData.user?.id ?? "—"}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">
                    Foydalanuvchi nomi:
                  </span>{" "}
                  <span className="font-medium">
                    {successData.user?.username ?? "—"}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">
                    Elektron pochta:
                  </span>{" "}
                  <span className="font-medium">
                    {successData.user?.email ?? "—"}
                  </span>
                </div>
              </div>
            </div>

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
                onClick={() => navigate("/admin/teachers")}
                className="px-4 py-2 border rounded"
              >
                O'qituvchilar ro'yxatiga o'tish
              </button>
            </div>

            <div className="text-sm text-yellow-700">
              <strong>Eslatma:</strong> Kirish ma'lumotlarini hozir nusxalash
              yoki yuklab oling — ular tizimda qayta ko'rsatilmaydi.
            </div>
          </div>
        ) : (
          // --- form ---
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Telefon (majburiy)</label>
                <input
                  type="text"
                  name="phoneNumber"
                  className="w-full border rounded p-2"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
                {serverError("phone_number")}
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
                />
                {serverError("email")}
              </div>
            </div>

            <div>
              <label className="block font-medium">Mutaxassisligi</label>
              <input
                type="text"
                name="subject"
                className="w-full border rounded p-2"
                value={formData.subject}
                onChange={handleChange}
              />
              {serverError("subject")}
            </div>

            <div>
              <label className="block font-medium">Maosh (UZS)</label>
              <input
                type="number"
                name="salary"
                className="w-full border rounded p-2"
                value={formData.salary}
                onChange={handleChange}
              />
              {serverError("salary")}
            </div>

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
              {loading ? "Saqlanmoqda..." : "O'qituvchini saqlash"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
