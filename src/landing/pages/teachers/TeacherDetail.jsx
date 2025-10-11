// TeacherDetail.jsx
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Award, Star, BookOpen } from "lucide-react";


export default function TeacherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teachers, setTeachers] = React.useState([]);
  useEffect(() => {
    fetch("/experts.json")
      .then((res) => res.json())
      .then((data) => setTeachers(data))
      .catch(() => setTeachers([]));
  }, []);
  const teacher = teachers.find((t) => t.id === parseInt(id));

  if (!teacher) {
    return <div>O‘qituvchi topilmadi</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 p-6 relative overflow-hidden">
      {/* Animated gradient circles */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      {/* Go Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-xl shadow-md hover:bg-white transition fixed top-6 left-6 z-10"
      >
        <ArrowLeft size={18} /> Orqaga
      </button>

      {/* Teacher Profile Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-20 relative z-10">
        <div className="flex flex-col md:flex-row">
          <img
            src={teacher.image}
            alt={teacher.name}
            className="w-full md:w-1/3 object-cover"
          />
          <div className="p-6 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-800">{teacher.name}</h1>
            <p className="text-lg text-indigo-600">{teacher.subject}</p>
            <p className="mt-2 text-gray-600">{teacher.tagline}</p>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="max-w-4xl mx-auto bg-white mt-10 p-6 rounded-2xl shadow-lg relative z-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">O‘qituvchi haqida</h2>
        <p className="text-gray-600 leading-relaxed">{teacher.bio}</p>
      </div>

      {/* Achievements */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mt-10 relative z-10">
        {teacher.achievements.map((ach, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-3"
          >
            {i % 3 === 0 && <Award className="text-yellow-500" />}
            {i % 3 === 1 && <Star className="text-pink-500" />}
            {i % 3 === 2 && <BookOpen className="text-indigo-500" />}
            <p className="text-gray-700">{ach}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
