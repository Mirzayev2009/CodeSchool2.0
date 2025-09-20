// components/AdminSidebar.jsx
"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BookOpen,
  Calendar,
  Settings,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminSidebar({ isOpen }) {
  const [active, setActive] = useState("dashboard");

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin",
    },
    {
      id: "students",
      name: "Students",
      icon: <Users size={20} />,
      path: "/admin/students",
    },
    {
      id: "teachers",
      name: "Teachers",
      icon: <UserPlus size={20} />,
      path: "/admin/teachers",
    },
    {
      id: "classes",
      name: "Classes",
      icon: <BookOpen size={20} />,
      path: "/admin/classes",
    },
    {
      id: "courses",
      name: "Courses",
      icon: <Calendar size={20} />,
      path: "/admin/courses",
    },
    {
      id: "settings",
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/admin/settings",
    },
    {
      id: "payment",
      name: "Payment",
      icon: <CreditCard size={20} />,
      path: "/admin/Payment",
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-200 ease-in-out lg:translate-x-0 z-40`}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <h2 className="text-xl font-bold text-indigo-600">CodeSchool Admin</h2>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-lg transition ${
                  active === item.id
                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActive(item.id)}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
