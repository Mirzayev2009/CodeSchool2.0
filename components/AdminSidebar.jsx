// components/AdminSidebar.jsx
"use client";

import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BookOpen,
  Calendar,
  Settings,
  CreditCard,
} from "lucide-react";

const menuItems = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/admin/dashboard",
  },
  {
    id: "students",
    name: "O'quvchilar",
    icon: <Users size={20} />,
    path: "/admin/students",
  },
  {
    id: "teachers",
    name: "O'qituvchilar",
    icon: <UserPlus size={20} />,
    path: "/admin/teachers",
  },
  {
    id: "classes",
    name: "Guruhlar",
    icon: <BookOpen size={20} />,
    path: "/admin/classes",
  },
  {
    id: "courses",
    name: "Darslar",
    icon: <Calendar size={20} />,
    path: "/admin/coursesad",
  },
  {
    id: "settings",
    name: "Sozlamalar",
    icon: <Settings size={20} />,
    path: "/admin/settings",
  },
  {
    id: "payment",
    name: "To'lovlar",
    icon: <CreditCard size={20} />,
    path: "/admin/payment",
  }, // normalized to lowercase
];

// Active classes per menu id (static strings so Tailwind picks them up)
const activeClasses = {
  dashboard: "bg-purple-100 text-purple-700 font-semibold",
  students: "bg-purple-100 text-purple-700 font-semibold", // same indigo as the sidebar title
  teachers: "bg-purple-100 text-purple-700 font-semibold",
  classes: "bg-purple-100 text-purple-700 font-semibold",
  courses: "bg-purple-100 text-purple-700 font-semibold",
  settings: "bg-purple-100 text-purple-700 font-semibold",
  payment: "bg-purple-100 text-purple-700 font-semibold",
};

export default function AdminSidebar({ isOpen = true }) {
  const location = useLocation();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-200 ease-in-out lg:translate-x-0 z-40`}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        {/* Keep the brand color consistent */}
        <h2 className="text-xl font-bold text-indigo-600">CodeSchool Admin</h2>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.path}
                end={item.path === "/admin/dashboard"} // ensures exact match for dashboard
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-lg transition ${
                    isActive
                      ? activeClasses[item.id]
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
