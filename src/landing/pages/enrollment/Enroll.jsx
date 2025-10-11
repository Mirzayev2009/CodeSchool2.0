import React, { use, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- Fake API Array (for now) ---

// --- Example real fetching process (commented for now) ---
// import { getCourses } from "../../lib/api";
// useEffect(() => {
//   if (step === 2) {
//     setLoading(true);
//     getCourses()
//       .then((res) => setCourses(Array.isArray(res) ? res : []))
//       .catch(() => setCourses([]))
//       .finally(() => setLoading(false));
//   }
// }, [step]);

const initialForm = {
  name: "",
  surname: "",
  location: "",
  phone: "",
  telegram: "",
  courseSlug: "",
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function Enroll() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [realCourses, setRealCourses] = useState([]); // New state for real courses

  useEffect(() => {
    const fetchRealCourses = async () => {
      try {
        const res = await fetch("/featuredCourses.json");
        const data = await res.json();
        setRealCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching real courses:", error);
        setRealCourses([]);
      }
    }
      fetchRealCourses()
  }, []);

  useEffect(() => {
    if (step === 2) {
      // Fake loading to simulate API
      setLoading(true);
      setTimeout(() => {
        setCourses(realCourses);
        setLoading(false);
      }, 600);
    }
  }, [step]);

  const canGoNext = useMemo(() => {
    return (
      form.name.trim() &&
      form.surname.trim() &&
      form.location.trim() &&
      form.phone.trim()
    );
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const [submitError, setSubmitError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!form.courseSlug) return;
    setLoading(true);
    // Insert into Supabase
    const { error } = await supabase.from("CodeSchoolForm").insert([
      {
        name: form.name,
        surname: form.surname,
        location: form.location,
        phone: form.phone,
        telegramUsername: form.telegram,
        chosenSubject: form.courseSlug,
        created_at: new Date().toISOString(),
      },
    ]);
    setLoading(false);
    if (error) {
      setSubmitError("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#059669"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-3 mt-6">
            Arizangiz yuborildi
          </h1>
          <p className="text-gray-700 mb-8">
            Tez orada siz bilan bog'lanamiz. Rahmat!
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow hover:shadow-md transition"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Ro'yxatdan o'tish
          </h1>
          <p className="text-gray-600 mt-2">
            2 qadamda ariza qoldiring. Juda oddiy va qulay.
          </p>
        </div>

        {/* Step progress bar */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className={`h-2 flex-1 rounded ${
              step >= 1 ? "bg-blue-600" : "bg-gray-200"
            }`}
          />
          <div
            className={`h-2 flex-1 rounded ${
              step >= 2 ? "bg-blue-600" : "bg-gray-200"
            }`}
          />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1 */}
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid md:grid-cols-2 gap-6"
              >
                {["name", "surname"].map((field, i) => (
                  <motion.div key={i} variants={item}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {field} *
                    </label>
                    <input
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      placeholder={
                        field === "name" ? "Ismingiz" : "Familiyangiz"
                      }
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid md:grid-cols-2 gap-6"
              >
                {["location", "phone"].map((field, i) => (
                  <motion.div key={i} variants={item}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {field} *
                    </label>
                    <input
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      placeholder={
                        field === "location"
                          ? "Shaharingiz yoki tumanningiz"
                          : "+998 90 123 45 67"
                      }
                      className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={container} initial="hidden" animate="show">
                <motion.div variants={item}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telegram (ixtiyoriy)
                  </label>
                  <input
                    name="telegram"
                    value={form.telegram}
                    onChange={handleChange}
                    placeholder="@username"
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </motion.div>
              </motion.div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  disabled={!canGoNext}
                  onClick={() => setStep(2)}
                  className={`px-8 py-3 rounded-md text-white font-medium transition shadow ${
                    canGoNext
                      ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Keyingi qadam →
                </button>
              </div>
            </motion.form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Kursni tanlang</h2>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:underline"
                >
                  ← Orqaga
                </button>
              </div>

              {loading ? (
                <p className="text-gray-600">Kurslar yuklanmoqda...</p>
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid md:grid-cols-3 gap-6"
                >
                  {courses.length === 0 && (
                    <p className="text-gray-600 col-span-3">
                      Hozircha kurslar mavjud emas.
                    </p>
                  )}
                  {courses.map((c, idx) => (
                    <motion.label
                      variants={item}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={c.slug || idx}
                      className={`border rounded-xl p-5 cursor-pointer transition-all bg-white ${
                        form.courseSlug === c.slug
                          ? "ring-2 ring-blue-600 shadow-md"
                          : "hover:shadow"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="courseSlug"
                          value={c.slug}
                          checked={form.courseSlug === (c.slug || "")}
                          onChange={handleChange}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {c.title || "Nomsiz kurs"}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {c.description || "Qisqacha ma'lumot tez orada"}
                          </div>
                          {Array.isArray(c.technologies) &&
                            c.technologies.length > 0 && (
                              <div className="mt-2 text-xs text-gray-500">
                                {c.technologies.slice(0, 3).join(", ")}
                              </div>
                            )}
                        </div>
                      </div>
                    </motion.label>
                  ))}
                </motion.div>
              )}

              <div className="flex flex-col items-end gap-2">
                {submitError && (
                  <p className="text-red-600 text-sm mb-2">{submitError}</p>
                )}
                <button
                  type="submit"
                  disabled={!form.courseSlug || loading}
                  className={`px-8 py-3 rounded-md text-white font-medium transition shadow ${
                    form.courseSlug && !loading
                      ? "bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Yuborilmoqda..." : "Yuborish ✅"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
