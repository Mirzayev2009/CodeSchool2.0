// src/pages/Teachers.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/Footer"; // your existing footer
import { motion } from "framer-motion";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Real API would be like: fetch("/api/teachers")
    fetch("/experts.json")
      .then((res) => res.json())
      .then((data) => setTeachers(data))
      .catch(() => setTeachers([]));
  }, []);

  const filteredTeachers = filter
    ? teachers.filter((t) => t.subject.toLowerCase().includes(filter.toLowerCase()))
    : teachers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <button
          onClick={() => navigate("/")}
          className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          ← Orqaga
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Bizning Ustozlar</h1>
        <p className="text-gray-600 mb-6">O‘z sohasining mutaxassislari bilan tanishing</p>

        {/* Subject Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-md p-2 mb-8"
        >
          <option value="">Barcha fanlar</option>
          {teachers.map((t, i) => (
            <option key={i} value={t.subject}>
              {t.subject}
            </option>
          ))}
        </select>

        {/* Teacher Grid */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {filteredTeachers.map((t, idx) => (
            <motion.div
              key={idx}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/teachers/${idx + 1}`)}
              className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-xl overflow-hidden transition"
            >
              <img src={t.image} alt={t.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">{t.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{t.subject}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
