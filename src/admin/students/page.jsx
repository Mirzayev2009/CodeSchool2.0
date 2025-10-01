// src/admin/students/StudentsManagement.uz.jsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../../components/AdminSidebar';
import {
  getStudents as apiGetStudents,
  deleteStudent as apiDeleteStudent,
  patchStudent as apiPatchStudent,
  getGroups as apiGetGroups,
} from '../API/AdminPanelApi';
import StudentsFilters from './StudentsFilters';
import StudentsTable from './StudentsTable';

// This file bundles StudentsManagement + StudentsFilters + StudentsTable
// - UI text is translated to Uzbek (Latin)
// - Classes (guruhlar/sinf) list in filters is loaded from backend via getGroups()
// - filterAttendanceStatus state was added and wired through

export default function StudentsManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAttendanceStatus, setFilterAttendanceStatus] = useState('');

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [classesList, setClassesList] = useState(['Barcha sinflar']);

  // normalize backend student shape to the UI shape used in table
  const normalizeStudent = (s) => {
    if (!s) return null;
    const id = s.id ?? s.pk ?? s.student_id ?? String(Math.random());
    const first = s.first_name ?? s.firstName ?? '';
    const last = s.last_name ?? s.lastName ?? '';
    const name =
      s.full_name ??
      s.fullName ??
      s.name ??
      ((`${(first ?? '')} ${(last ?? '')}`).trim() || s.username) ??
      'Unknown';
    const email = s.email ?? s.email_address ?? '';
    const phone = (s.phone ?? s.phone_number) ?? '';
    // class/group heuristics
    let className = '';
    if (typeof s.class === 'string' && s.class.trim()) className = s.class;
    else if (typeof s.group === 'string' && s.group.trim()) className = s.group;
    else if (Array.isArray(s.groups) && s.groups.length) {
      // try to map objects to titles
      className = s.groups
        .map((g) => (typeof g === 'string' ? g : (g.title ?? g.name ?? '')))
        .filter(Boolean)
        .join(', ');
    }
    // status normalization
    let status = '';
    if (typeof s.active === 'boolean') status = s.active ? 'Active' : 'Inactive';
    else if (s.status) status = (s.status ?? '').toString();
    else status = s.state ?? '';
    if (!status) status = 'Inactive';

    const enrollmentDate = s.enrollment_date ?? s.created_at ?? s.createdAt ?? '';
    const attendance = s.attendance ?? '-';
    const grades = s.grades ?? s.grade ?? '-';

    return {
      id,
      name,
      email,
      phone,
      class: className || '',
      enrollmentDate,
      status,
      attendance,
      grades,
      __raw: s,
    };
  };

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const res = await apiGetStudents(token).catch((e) => {
        console.error('getStudents error', e);
        throw e;
      });

      let list = [];
      if (Array.isArray(res)) list = res;
      else if (res && Array.isArray(res.results)) list = res.results;
      else if (res && Array.isArray(res.data)) list = res.data;
      else if (res && typeof res === 'object' && Object.keys(res).length === 0) list = [];
      else if (res && typeof res === 'object') {
        if (Array.isArray(res.students)) list = res.students;
        else if (Array.isArray(res.items)) list = res.items;
        else list = [];
      } else list = [];

      const normalized = list.map(normalizeStudent).filter(Boolean);
      setStudents(normalized);

      // after students loaded try to fetch classes/guruhlar from backend
      try {
        const groupsRes = await apiGetGroups(token);
        let groupsList = [];
        if (Array.isArray(groupsRes)) groupsList = groupsRes;
        else if (groupsRes && Array.isArray(groupsRes.results)) groupsList = groupsRes.results;
        else if (groupsRes && Array.isArray(groupsRes.data)) groupsList = groupsRes.data;
        else if (groupsRes && Array.isArray(groupsRes.groups)) groupsList = groupsRes.groups;
        else groupsList = [];

        const names = groupsList
          .map((g) => (typeof g === 'string' ? g : g.title ?? g.name ?? g.course_name ?? g.group_name ?? ''))
          .filter(Boolean);

        if (names.length) {
          setClassesList(['Barcha sinflar', ...Array.from(new Set(names))]);
        } else {
          // fallback: derive from students
          const derived = new Set();
          normalized.forEach((s) => {
            if (s.class) derived.add(s.class);
            else if (s.__raw?.group) derived.add(s.__raw.group);
            else if (Array.isArray(s.__raw?.groups)) {
              s.__raw.groups.forEach((g) => {
                const label = typeof g === 'string' ? g : (g.title ?? g.name ?? null);
                if (label) derived.add(label);
              });
            }
          });
          setClassesList(['Barcha sinflar', ...Array.from(derived)]);
        }
      } catch (err) {
        console.error('Failed to fetch groups:', err);
        // fallback: derive from students
        const derived = new Set();
        normalized.forEach((s) => {
          if (s.class) derived.add(s.class);
          else if (s.__raw?.group) derived.add(s.__raw.group);
          else if (Array.isArray(s.__raw?.groups)) {
            s.__raw.groups.forEach((g) => {
              const label = typeof g === 'string' ? g : (g.title ?? g.name ?? null);
              if (label) derived.add(label);
            });
          }
        });
        setClassesList(['Barcha sinflar', ...Array.from(derived)]);
      }
    } catch (err) {
      setError("Talabalarni yuklashda xato yuz berdi");
      setStudents([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Ushbu talabani o'chirmoqchimisiz?")) return;
    const token = localStorage.getItem('token');
    try {
      await apiDeleteStudent(id, token);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('deleteStudent error', err);
      alert("Talabani o'chirish muvaffaqiyatsiz tugadi. Batamom tafsilotlar konsolda.");
    }
  };

  const handleToggleStatus = async (student) => {
    const token = localStorage.getItem('token');
    const id = student.id;
    // determine new active value
    const currentActive = student.__raw?.active ?? (student.status === 'Active' ? true : (student.status === 'Inactive' ? false : undefined));
    const newActive = !(currentActive === true);
    try {
      await apiPatchStudent(id, { active: newActive, is_active: newActive }, token);
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newActive ? 'Active' : 'Inactive', __raw: { ...(s.__raw || {}), active: newActive } } : s))
      );
    } catch (err) {
      console.error('patchStudent error', err);
      alert("Talaba holatini yangilashda xato yuz berdi. Konsolga qarang.");
    }
  };

  const refresh = () => fetchStudents();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar isOpen={isSidebarOpen} />

        <main className="flex-1 ml-0 lg:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Talabalar boshqaruvi</h1>
                <p className="text-gray-600 mt-1">Barcha talabalar yozuvlari va ro'yxatga olishlarni boshqaring</p>
              </div>
              <Link
                to="/admin/students/add"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium whitespace-nowrap flex items-center"
              >
                <i className="ri-user-add-line w-5 h-5 flex items-center justify-center mr-2"></i>
                Yangi talaba qo'shish
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <StudentsFilters
                classesList={classesList}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterClass={filterClass}
                setFilterClass={setFilterClass}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterAttendanceStatus={filterAttendanceStatus}
                setFilterAttendanceStatus={setFilterAttendanceStatus}
              />

              <StudentsTable
                searchTerm={searchTerm}
                filterClass={filterClass}
                filterStatus={filterStatus}
                filterAttendanceStatus={filterAttendanceStatus}
                students={students}
                loading={loading}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                refresh={refresh}
              />

              {error && (
                <div className="p-4 text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
