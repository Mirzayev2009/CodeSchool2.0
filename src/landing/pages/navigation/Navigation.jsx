import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Phone, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_HEIGHT = 64; // was 72, h-16 == 64px

const items = [
  { label: "Kurslar", id: "courses-section" },
  { label: "O'qituvchilar", id: "experts-section" },
  { label: "Manzil", id: "location-section" },
  { label: "Bepul sinov dars", id: "forum-section" },
];

export default function Navigation({ currentPage, navigateToPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      const fromTop = window.scrollY + NAV_HEIGHT + 12;
      let current = "";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (!el) continue;
        if (el.offsetTop <= fromTop) {
          current = it.id;
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id) => {
    if (currentPage !== "home") {
      navigateToPage("home");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const top =
            el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 180);
    } else {
      const el = document.getElementById(id);
      if (el) {
        const top =
          el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div
            role="button"
            aria-label="Go to home"
            className="flex items-center cursor-pointer gap-2"
            onClick={() => navigate("/")}
          >
            {/* Responsive logo box */}
            <div className="w-13 h-13 md:w-14 md:h-14 lg:w-16 lg:h-16  overflow-hidden flex items-center justify-center bg-gray-200">
              <img
                className="w-full h-full object-contain"
                src="/images/ava_white.jpg"
                alt="Company logo"
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {items.map((it) => {
              const isActive = active === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => scrollToSection(it.id)}
                  className={`relative font-medium transition-transform duration-200
                    ${
                      isActive
                        ? "text-blue-600 scale-110"
                        : "text-gray-700 hover:text-blue-600 hover:scale-110"
                    }`}
                >
                  {it.label}
                  <span className="absolute left-0 right-0 bottom-[-6px] mx-auto h-[2px] rounded-full overflow-hidden">
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          exit={{ width: 0 }}
                          transition={{ duration: 0.3 }}
                          className="block h-[2px] bg-blue-600"
                        />
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Contact + Cabinet */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="tel:+998504004000"
              className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors"
            >
              <Phone size={16} />
              <span className="font-semibold">+998 50 400 40 00</span>
            </a>
            <button
              onClick={() => navigate("/cabinet")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300"
            >
              Shaxsiy kabinet
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              aria-label="Open menu"
              onClick={() => setIsMenuOpen((s) => !s)}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="md:hidden absolute top-full left-0 w-full bg-white border-t shadow-lg z-40"
          >
            <div className="px-4 py-3 space-y-2">
              {items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => scrollToSection(it.id)}
                  className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all"
                >
                  {it.label}
                </button>
              ))}
              <div className="pt-3 border-t mt-3 flex items-center justify-between">
                <a
                  href="tel:+998998888888"
                  className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors"
                >
                  <Phone size={16} />
                  <span className="font-medium">+998 50 400 40 00</span>
                </a>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/cabinet");
                  }}
                  className="px-3 py-1 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  Shaxsiy kabinet
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
