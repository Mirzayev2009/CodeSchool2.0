// src/pages/Courses.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/Footer";

// Fake API Array (temporar, keyinchalik haqiqiy API chaqiruvi bilan almashtiriladi)
// const fetchCourses = async () => {
//   const { data } = await api.get("/courses");
//   return data;
// };
const fakeCourses = [
  {
    id: 1,
    slug: "web-dev",
    title: "Full-Stack Web Dasturlash",
    description:
      "HTML, CSS, JavaScript, React va Node.js orqali to‘liq dasturlar yaratishni o‘rganing.",
    image: "https://source.unsplash.com/800x500/?coding,web",
    level: "Boshlang‘ich",
    duration: "12 hafta",
    tag: "Ommabop",
  },
  {
    id: 2,
    slug: "data-science",
    title: "Data Science va Mashina O‘rganish",
    description:
      "Python, Pandas va ML modellarini amaliy loyihalar orqali o‘zlashtiring.",
    image: "https://source.unsplash.com/800x500/?data,science",
    level: "O‘rta",
    duration: "16 hafta",
    tag: "Yangi",
  },
  {
    id: 3,
    slug: "ui-ux",
    title: "UI/UX Dizayn Masterklass",
    description:
      "Go‘zal interfeyslar va mukammal foydalanuvchi tajribasini yaratishni o‘rganing.",
    image: "https://source.unsplash.com/800x500/?design,uiux",
    level: "Barcha darajalar",
    duration: "8 hafta",
    tag: "Boshlang‘ich",
  },
];

export default function Courses() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Animatsiyali fon */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-200 via-white to-pink-200 animate-gradient-x"></div>

      <div className="max-w-7xl mx-auto w-full flex-grow px-4 sm:px-8 py-10">
        {/* Orqaga tugmasi */}
        <button
          onClick={() => navigate("/")}
          className="mb-8 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition"
        >
          ← Bosh sahifaga qaytish
        </button>

        {/* Sarlavha */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Kurslarimizni Kashf Eting
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Soha mutaxassislari, real loyihalar va qo‘llab-quvvatlovchi
            hamjamiyat bilan birga o‘rganing.
          </p>
        </div>

        {/* Kurs kartalari */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fakeCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`/courses/${course.slug}`)}
              className="cursor-pointer bg-white shadow-md rounded-xl overflow-hidden hover:scale-105 hover:shadow-xl transition transform duration-300"
            >
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-40 w-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {course.tag}
                </span>
              </div>
              <div className="p-4 text-left">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {course.title}
                </h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>📅 {course.duration}</span>
                  <span>🎯 {course.level}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
