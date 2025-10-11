// src/pages/CourseDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Footer from "../footer/Footer";

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [openModule, setOpenModule] = useState(null);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch("/featuredCourses.json");
        const data = await res.json();
        const foundCourse = data.find((c)=> c.slug === slug)
        setCourse(foundCourse || null);
      } catch (error) {
        console.error("Error fetching course:", error);
        setCourse(null);
      }
    };

    fetchCourse();
  }, [slug]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Kurs topilmadi.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex flex-col">
      {/* Hero Section */}
      <div className="relative h-72 md:h-96">
        <img
          src={course.image}
          alt={course.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 bg-white bg-opacity-80 hover:bg-opacity-100 transition px-4 py-2 rounded-lg shadow text-gray-800"
          >
            ⬅️ Orqaga
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            {course.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        {/* Left Section */}
        <div className="md:col-span-2 space-y-10">
          {/* Info Cards */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 shadow rounded-xl text-center">
              <h3 className="text-xl font-semibold">⏱ Davomiyligi</h3>
              <p className="text-gray-600">{course.duration}</p>
            </div>
            <div className="bg-white p-6 shadow rounded-xl text-center">
              <h3 className="text-xl font-semibold">🎯 Daraja</h3>
              <p className="text-gray-600">{course.level}</p>
            </div>
            <div className="bg-white p-6 shadow rounded-xl text-center">
              <h3 className="text-xl font-semibold">📚 Darslar soni</h3>
              <p className="text-gray-600">{course.lessons}</p>
            </div>
          </div>

          {/* Highlights */}
          {course.highlights && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Nimalarni o‘rganasiz</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {course.highlights.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Curriculum */}
          {course.curriculum && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Dastur</h2>
              <div className="space-y-4">
                {course.curriculum.map((module, index) => (
                  <div key={index} className="bg-white shadow rounded-xl">
                    <button
                      onClick={() =>
                        setOpenModule(openModule === index ? null : index)
                      }
                      className="w-full flex justify-between items-center px-6 py-4 font-semibold text-gray-800 hover:bg-gray-100 transition"
                    >
                      <span>{module.module}</span>
                      <span>{openModule === index ? "−" : "+"}</span>
                    </button>
                    {openModule === index && (
                      <ul className="px-8 pb-4 text-gray-600 space-y-2 animate-fadeIn">
                        {module.classes.map((cls, i) => (
                          <li key={i}>📖 {cls}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Instructor */}
          {course.instructor && (
            <div className="bg-white p-6 shadow rounded-xl flex flex-col items-center text-center">
              <img
                src={course.instructor.photo}
                alt={course.instructor.name}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold">{course.instructor.name}</h3>
              <p className="text-gray-600">{course.instructor.role}</p>
              <p className="text-gray-500 mt-2">{course.instructor.bio}</p>
            </div>
          )}

          {/* Register Button */}
          <Link to="/enroll">
            <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow hover:scale-105 transition transform duration-200">
              🚀 Ro‘yxatdan o‘tish
            </button>
          </Link>
        </div>
      </div>I'm boot. 
    </div>
  );
}
