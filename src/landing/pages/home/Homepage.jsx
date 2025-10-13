// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "@/components/ui/button";

import { Textarea } from "../../../components/ui/textarea";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  Autoplay,
  Navigation as SwiperNavigation,
} from "swiper/modules";

import Navigation from "../navigation/Navigation";
import Footer from "../footer/Footer";
import { useNavigate } from "react-router-dom";
import HomePageSections from "./sections";
import Location from "./Location";
import { Link } from "react-router-dom";
import HeroCarousel from "./Swiper";

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [codingCount, setCodingCount] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [mathCount, setMathCount] = useState(0);
  const [englishCount, setEnglishCount] = useState(0);
  const [isVisible, setIsVisible] = useState({
    success: false,
    courses: false,
    experts: false,
    forum: false,
    location: false,
  });
  const [clicked, setClicked] = useState(false);
  const [heroSlides, setHeroSlides] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [experts, setExperts] = useState([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id.split("-")[0]]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );
  const sections = ["success", "courses", "experts", "forum", "location"].map(
  (id) => document.getElementById(`${id}-section`)
);

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });
    return () =>
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
  }, [currentPage]);
  const swiperModules = [Pagination, Autoplay, SwiperNavigation];
  useEffect(() => {
    const animateCounter = (setter, target) => {
      let current = 0;
      const increment = target / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 20);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id === "success-section") {
          animateCounter(setCodingCount, 15420);
          animateCounter(setMathCount, 12890);
          animateCounter(setEnglishCount, 18650);
        }
      });
    });
    const successSection = document.getElementById("success-section");
    if (successSection) {
      observer.observe(successSection);
    }
    return () => observer.disconnect();
  }, [currentPage]);

  // Fetch Hero Slides
  useEffect(() => {
    fetch("/heroSlides.json")
      .then((res) => res.json())
      .then((data) => setHeroSlides(data))
      .catch((err) => console.error("Error loading heroSlides:", err));
  }, []);

  // Fetch Featured Courses
  useEffect(() => {
    fetch("/featuredCourses.json")
      .then((res) => res.json())
      .then((data) => setFeaturedCourses(data))
      .catch((err) => console.error("Error loading featuredCourses:", err));
  }, []);

  // Fetch Experts
  useEffect(() => {
    fetch("/experts.json")
      .then((res) => res.json())
      .then((data) => setExperts(data))
      .catch((err) => console.error("Error loading experts:", err));
  }, []);

  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    surname: "",
    location: "",
    phone: "",
    telegram: "",
    courseSlug: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !form.name ||
      !form.surname ||
      !form.location ||
      !form.phone ||
      !form.courseSlug
    ) {
      setError("Iltimos, barcha majburiy maydonlarni to‘ldiring.");
      return;
    }

    setLoading(true);
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
      console.error(error);
      setError("Xatolik yuz berdi. Qayta urinib ko‘ring.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentPage={currentPage} navigateToPage={navigate} />
      {/* Hero Section */}
      <section className="relative h-screen ">
        <HeroCarousel slides={heroSlides} />
      </section>
      {/* Bizning Yutuqlar Bo‘limi */}
      
      
      <section
        id="courses-section"
        className={`py-20 bg-white transform transition-all duration-1000 ${
          isVisible.courses
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular courses designed to help you achieve
              your learning goals
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {featuredCourses.map((course, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                onClick={() => navigate(`coursess/${course.slug}`)}
              >
                <div className="relative h-auto overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${course.color} opacity-0 group-hover:opacity-80 transition-opacity duration-300`}
                  ></div>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300">
                    {course.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 group-hover:text-gray-200 transition-colors duration-300">
                    {course.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Meet Experts Section */}
      <section
        id="experts-section"
        className={`py-20 bg-gray-50 transform transition-all duration-1000 ${
          isVisible.experts
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Bizning O'qituvchilarimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tajribali mutaxassislar jamoasi bilan tanishing, ular sizning
              o'rganish safarlaringizda yo'l-yo'riq ko'rsatishga tayyor va
              ilhomlantiradi
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {experts.slice(0, 4).map((expert, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <CardHeader onClick={() => navigate(`teachers/${expert.id}`)}>
                  <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {expert.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-600 font-semibold">
                    {expert.subject}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button
              onClick={() => navigate("teachers")}
              className="!rounded-button whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 cursor-pointer"
            >
              See All Teachers
            </Button>
          </div>
        </div>
      </section>
      <Location   />
      {/* Community Forum Section */}
      <section
        id="forum-section"
        className={`py-20 bg-white transform transition-all duration-1000 ${
          isVisible.forum
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Bepul sinov darsiga yoziling
            </h2>
            <p className="text-lg text-gray-600">
              Sizga ishonch bilan o‘rganishni boshlash uchun bepul sinov darsini
              taklif qilamiz
            </p>
          </div>

          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                O‘zingiz haqingizda aytib bering
              </CardTitle>
              <CardDescription className="text-gray-600">
                Ishtirok etish uchun ma’lumotlaringizni kiriting
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ism *
                    </label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ismingizni kiriting"
                      className="border border-gray-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Familiya *
                    </label>
                    <Input
                      name="surname"
                      value={form.surname}
                      onChange={handleChange}
                      placeholder="Familiyangizni kiriting"
                      className="border border-gray-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Joylashuv *
                  </label>
                  <Input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Shaharingiz yoki tumanningiz"
                    className="border border-gray-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon raqami *
                  </label>
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+998 90 123 45 67"
                    className="border border-gray-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telegram username (ixtiyoriy)
                  </label>
                  <Input
                    name="telegram"
                    value={form.telegram}
                    onChange={handleChange}
                    placeholder="@username"
                    className="border border-gray-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qiziqish fani *
                  </label>
                  <select
                    name="courseSlug"
                    value={form.courseSlug}
                    onChange={handleChange}
                    className="w-full border border-gray-300 text-sm rounded-md p-2"
                  >
                    <option value="">Fan tanlang</option>
                    <option value="frontend">Frontend Dasturlash</option>
                    <option value="backend">Backend Dasturlash</option>
                    <option value="python">Python Dasturlash</option>
                    <option value="ai">Sun’iy Intellekt</option>
                    <option value="design">Grafik Dizayn</option>
                    <option value="3dmax">3D Max</option>
                    <option value="smm">SMM (Marketing)</option>
                    <option value="foundation">Foundation</option>
                  </select>
                </div>

                {error && (
                  <p className="text-red-600 text-sm text-center">{error}</p>
                )}

                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="!rounded-button whitespace-nowrap bg-green-600 hover:bg-green-700 text-white px-12 py-3 cursor-pointer"
                  >
                    {loading ? "Yuborilmoqda..." : "Qo‘shilish"}
                  </Button>
                </div>
              </form>
              {submitted && (
                <p className="text-green-600 font-semibold mt-2 text-center">
                  {" "}
                  Biz siz bilan tez orada aloqaga chiqamiz ✅
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <HomePageSections />

      <Footer />
    </div>
  );
};

export default HomePage;
