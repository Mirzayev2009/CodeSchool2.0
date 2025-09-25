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
    phone: "",
    parentPhone: "",
    group: "",
    notes: "",
    status: "active",
  });

  const [groups, setGroups] = useState([]);
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

  // load groups on mount
  useEffect(() => {
    const token = getTokenFromStorage();
    if (!token) return;

    let mounted = true;
    (async () => {
      try {
        const res = await getGroups(token);
        const list = Array.isArray(res) ? res : (res.results ?? res.data ?? []);
        if (!mounted) return;
        setGroups(list);
      } catch (err) {
        // silently ignore — keep UI intact
        console.error("Failed to load groups", err);
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
        if (!mounted) return;

        const student = res ?? {};
        const name =
          student.full_name ??
          student.name ??
          `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() ??
          "";
        const phone = student.phone ?? student.mobile ?? student.phone_number ?? "";
        const parentPhone = student.parent_phone ?? student.parentPhone ?? student.parent_mobile ?? student.parent_phone_number ?? "";
        const group =
          (student.group && (typeof student.group === "object" ? (student.group.id ?? student.group.pk ?? "") : student.group)) ??
          student.group_id ??
          student.group_pk ??
          "";
        const notes = student.notes ?? student.note ?? student.description ?? student.motivation ?? student.admin_notes ?? "";
        const status = student.status ?? (student.is_active ? "active" : "inactive") ?? "active";

        setFormData({
          name,
          phone: phone ? String(phone) : "",
          parentPhone: parentPhone ? String(parentPhone) : "",
          group: group ? String(group) : "",
          notes: notes ? String(notes) : "",
          status,
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
    if (!formData.phone.trim()) { alert("Phone number is required"); return false; }
    if (!formData.parentPhone.trim()) { alert("Parent's phone number is required"); return false; }
    if (!formData.group) { alert("Please select a group"); return false; }
    if (!formData.notes.trim()) { alert("Please add notes / motivation"); return false; }
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
      phone: formData.phone || "",
      parent_phone: formData.parentPhone || "",
      group: formData.group || null, // group id or string
      notes: formData.notes || "",
      status: formData.status || "active",
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
              <label className="block font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                className="w-full border rounded p-2"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium">Parent's Phone</label>
              <input
                type="text"
                name="parentPhone"
                className="w-full border rounded p-2"
                value={formData.parentPhone}
                onChange={handleChange}
              />
            </div>
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
                const gid = (g.id ?? g.pk ?? g.group_id ?? g);
                const gname = (g.name ?? g.title ?? g.uz ?? String(gid));
                return <option key={String(gid)} value={String(gid)}>{gname}</option>;
              })}
            </select>
          </div>

          <div>
            <label className="block font-medium">Notes / Motivation</label>
            <textarea
              name="notes"
              className="w-full border rounded p-2 h-32"
              value={formData.notes}
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
