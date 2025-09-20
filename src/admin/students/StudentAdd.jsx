'use client';

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../../../components/AdminSidebar";
import {
  getGroups,
  getStudent,
  createStudent,
  updateStudent
} from "../API/AdminPanelApi"; // use your existing API helper

export default function StudentCreate() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    teacher: "",
    group: "",
    tuition: "",
    status: "active",
    enrollmentDate: "",
  });

  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const editingId = params.get("id");

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

  // load groups (and derive teachers from groups) on mount
  useEffect(() => {
    const token = getTokenFromStorage();
    if (!token) return;

    let mounted = true;
    (async () => {
      try {
        const res = await getGroups(token);
        // getGroups returns parsed JSON. It might be an array or an object with results.
        const list = Array.isArray(res) ? res : (res.results ?? res.data ?? []);
        if (!mounted) return;

        setGroups(list);

        // derive teacher list from groups: handle many shapes (teacher id, teacher object, teacher name)
        const seen = new Map();
        list.forEach((g) => {
          const t = g.teacher ?? g.teacher_id ?? g.teacher_pk ?? g.teacher_name ?? null;
          if (!t) return;

          // if teacher is object:
          if (typeof t === "object" && t !== null) {
            const id = t.id ?? t.pk ?? t.teacher_id ?? JSON.stringify(t);
            const name = (t.name ?? t.full_name ?? `${t.first_name ?? ""} ${t.last_name ?? ""}`).trim() || String(id);
            if (!seen.has(id)) seen.set(id, { id, name });
          } else {
            // t is primitive (string or number)
            const id = String(t);
            const name = String(t);
            if (!seen.has(id)) seen.set(id, { id, name });
          }
        });

        setTeachers(Array.from(seen.values()));
      } catch (err) {
        // silently ignore — keep UI intact
        console.error("Failed to load groups/teachers", err);
      }
    })();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if editing - load existing student
  useEffect(() => {
    if (!editingId) return;
    const token = getTokenFromStorage();
    if (!token) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getStudent(editingId, token);
        // res is parsed JSON. Normalize fields safely.
        if (!mounted) return;

        const student = res ?? {};
        const name =
          student.full_name ??
          student.name ??
          `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() ??
          "";
        const email = student.email ?? student.email_address ?? "";
        const phone = student.phone ?? student.mobile ?? "";
        // group might be id or object
        const group =
          (student.group && (typeof student.group === "object" ? (student.group.id ?? student.group.pk ?? "") : student.group)) ??
          student.group_id ??
          student.group_pk ??
          "";
        const teacher =
          (student.teacher && (typeof student.teacher === "object" ? (student.teacher.id ?? student.teacher.pk ?? "") : student.teacher)) ??
          student.teacher_id ??
          student.teacher_pk ??
          "";
        const tuition = student.tuition ?? student.tuition_fee ?? student.fee ?? student.amount ?? "";
        const status = student.status ?? (student.is_active ? "active" : "inactive") ?? "active";
        const enrollmentDate = student.enrollment_date ?? student.enrolled_at ?? student.enrollmentDate ?? "";

        setFormData({
          name,
          email,
          phone,
          teacher: teacher ? String(teacher) : "",
          group: group ? String(group) : "",
          tuition: tuition === null || tuition === undefined ? "" : String(tuition),
          status,
          enrollmentDate: enrollmentDate ? String(enrollmentDate).slice(0, 10) : "",
        });
      } catch (err) {
        console.error("Failed to load student", err);
        // keep UI unchanged
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.name.trim()) { alert("Full name is required"); return false; }
    if (formData.tuition && Number(formData.tuition) < 0) { alert("Tuition must be >= 0"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const token = getTokenFromStorage();
    if (!token) {
      alert("Auth token not found in localStorage");
      return;
    }

    // Prepare payload with common field names; backend may accept subset.
    const payload = {
      full_name: formData.name,
      name: formData.name,
      email: formData.email || "",
      phone: formData.phone || "",
      teacher: formData.teacher || null, // teacher id or string
      group: formData.group || null, // group id or string
      tuition: formData.tuition ? Number(formData.tuition) : null,
      status: formData.status || "active",
      enrollment_date: formData.enrollmentDate || null,
    };

    try {
      setLoading(true);
      if (editingId) {
        await updateStudent(editingId, payload, token);
        alert("Saved");
      } else {
        await createStudent(payload, token);
        alert("Saved");
      }
      navigate("/admin/students");
    } catch (err) {
      console.error("Save failed", err);
      // try to show backend message if present
      if (err && err.message) alert("Save failed: " + err.message);
      else alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar isOpen={true} />

      <main className="flex-1 ml-0 lg:ml-64 p-6">
        <h1 className="text-2xl font-bold mb-6">{editingId ? "Edit Student" : "Add New Student"}</h1>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl shadow">
          <div>
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full border rounded p-2"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="w-full border rounded p-2"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                className="w-full border rounded p-2"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Assign Teacher</label>
              <select
                name="teacher"
                className="w-full border rounded p-2"
                value={formData.teacher}
                onChange={handleChange}
              >
                <option value="">Select teacher</option>
                {teachers.length === 0 && (
                  // keep original placeholder options if none fetched
                  <>
                    <option value="1">John Doe</option>
                    <option value="2">Jane Smith</option>
                  </>
                )}
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium">Assign Group</label>
              <select
                name="group"
                className="w-full border rounded p-2"
                value={formData.group}
                onChange={handleChange}
              >
                <option value="">Select group</option>
                {groups.length === 0 && (
                  <>
                    <option value="g1">JavaScript Fundamentals</option>
                    <option value="g2">Python Basics</option>
                  </>
                )}
                {groups.map((g) => {
                  // group might be object or primitive
                  const gid = (g.id ?? g.pk ?? g.group_id ?? g) ;
                  const gname = (g.name ?? g.title ?? g.uz ?? String(gid));
                  return <option key={String(gid)} value={String(gid)}>{gname}</option>;
                })}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium">Tuition Fee (UZS)</label>
            <input
              type="number"
              name="tuition"
              className="w-full border rounded p-2"
              value={formData.tuition}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Status</label>
              <select
                name="status"
                className="w-full border rounded p-2"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">Enrollment Date</label>
              <input
                type="date"
                name="enrollmentDate"
                className="w-full border rounded p-2"
                value={formData.enrollmentDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Student"}
          </button>
        </form>
      </main>
    </div>
  );
}
