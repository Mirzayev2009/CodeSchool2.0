"use client";

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../../../components/AdminSidebar";

// import your API helper (already exists in your project)
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
} from "../API/AdminPanelApi";

export default function CourseCreate() {
  const [isSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const editingId = params.get("id");

  const [loadingExisting, setLoadingExisting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    duration_weeks: "",
    uz: "",
    ru: "",
    price: "",
    address: "",
    description: "",
    active: true,
    image: null, // base64 string
  });

  // Load existing course if editing
  useEffect(() => {
    if (editingId) {
      setLoadingExisting(true);
      const token = localStorage.getItem("token");
      getCourse(editingId, token)
        .then((data) => {
          setForm({
            title: data.title || "",
            duration_weeks: data.duration_weeks || "",
            uz: data.uz || "",
            ru: data.ru || "",
            price: data.price || "",
            address: data.address || "",
            description: data.description || "",
            active: !!data.active,
            image: data.image || null,
          });
        })
        .catch((err) => {
          console.error("Failed to load course", err);
          alert("Xatolik: kurs yuklanmadi");
        })
        .finally(() => setLoadingExisting(false));
    }
  }, [editingId]);

  const addresses = [
    "Iftixor ko'chasi, Yunusobod tumani, Toshkent",
    "Yunusobod 19-kvartal",
    "Boshqa manzil",
  ];

  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleImage = (file) => {
    if (!file) {
      setField("image", null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setField("image", reader.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    if (!form.title.trim()) {
      alert("Kurs nomi (Title) majburiy.");
      return false;
    }
    if (!form.duration_weeks || Number(form.duration_weeks) <= 0) {
      alert("Davomiyligi (haftalarda) majburiy va musbat son bo'lishi kerak.");
      return false;
    }
    if (!form.uz.trim()) {
      alert("Darslik nomi (Uz) majburiy.");
      return false;
    }
    if (!form.ru.trim()) {
      alert("Darslik nomi (Ru) majburiy.");
      return false;
    }
    if (!form.price || Number(form.price) <= 0) {
      alert("Narx musbat son bo'lishi kerak.");
      return false;
    }
    if (!form.address) {
      alert("Manzil majburiy.");
      return false;
    }
    return true;
  };

  const handleSave = async (stay = false) => {
    if (!validate()) return;
    const token = localStorage.getItem("token");
    try {
      const payload = {
        title: form.title,
        duration_weeks: Number(form.duration_weeks),
        uz: form.uz,
        ru: form.ru,
        price: Number(form.price),
        address: form.address,
        description: form.description,
        active: form.active,
        image: form.image,
      };

      if (editingId) {
        await updateCourse(editingId, payload, token);
        if (stay) {
          alert("Saqlandi");
        } else {
          navigate("/admin/courses");
        }
      } else {
        await createCourse(
          {
            ...payload,
            createdAt: new Date().toISOString().slice(0, 10),
          },
          token
        );
        if (stay) {
          setForm({
            title: "",
            duration_weeks: "",
            uz: "",
            ru: "",
            price: "",
            address: "",
            description: "",
            active: true,
            image: null,
          });
          alert("Saqlandi — endi boshqa qo'shishingiz mumkin");
        } else {
          navigate("/admin/courses");
        }
      }
    } catch (err) {
      console.error("Failed to save course", err);
      alert("Xatolik: kurs saqlanmadi");
    }
  };

  const handleCancel = () => {
    if (confirm("O'zgartirishlarni bekor qilasizmi?"))
      navigate("/admin/courses");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar isOpen={isSidebarOpen} />

        <main className="flex-1 ml-0 lg:ml-64 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {editingId ? "Darslikni tahrirlash" : "Yangi darslik qo'shish"}
              </h1>
              <p className="text-sm text-gray-600">
                Kerakli maydonlarni to'ldiring va saqlang.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-700">
                    Kurs nomi (Title) *
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                    placeholder="Masalan: Python Kursi"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">
                    Davomiyligi (haftalarda) *
                  </label>
                  <input
                    type="number"
                    value={form.duration_weeks}
                    onChange={(e) => setField("duration_weeks", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                    placeholder="Masalan: 12"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Narxi *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setField("price", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">
                    Darslik nomi (Uz) *
                  </label>
                  <input
                    value={form.uz}
                    onChange={(e) => setField("uz", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">
                    Darslik nomi (Ru) *
                  </label>
                  <input
                    value={form.ru}
                    onChange={(e) => setField("ru", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-700">Manzil *</label>
                  <select
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Manzilni tanlang</option>
                    {addresses.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm text-gray-700">Izoh</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  rows={6}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                  placeholder="Shu yerda yozishni boshlang..."
                />
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="text-sm text-gray-700">
                    Rasm (ixtiyoriy)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImage(e.target.files?.[0])}
                    className="mt-1"
                  />
                  {form.image && (
                    <img
                      src={form.image}
                      alt="preview"
                      className="mt-2 max-h-40 rounded-md border"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-700">Holat</div>
                      <div className="text-xs text-gray-500">
                        Kursning faol holatini o'zgartirish
                      </div>
                    </div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={form.active}
                        onChange={(e) => setField("active", e.target.checked)}
                        className="h-5 w-5"
                      />
                    </label>
                  </div>

                  <div className="text-xs text-gray-500">
                    Yangi darslik uchun yaratilgan sana avtomatik belgilanadi.
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border rounded-md"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md"
                >
                  Saqlash va yana qo'shish
                </button>
                <button
                  type="button"
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
