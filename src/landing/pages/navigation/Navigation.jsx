import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_HEIGHT = 72;
const items = [
  { label: "Kurslar", id: "courses-section" },
  { label: "O'qituvchilar", id: "experts-section" },
  { label: "Manzil", id: "location-section" },
  { label: "Bepul sinov dars", id: "forum-section" },
];

export default function Navigation({ currentPage, navigateToPage }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = [
    { label: "Bosh sahifa", page: "home" },
    { label: "Kurslar", page: "courses-section" },
    { label: "O'qituvchilar", page: "experts-section" },
    { label: "Manzil", page: "location-section" },
    { label: "FAQ", page: "faq-section" },
  ];

  const handleNavClick = (page) => {
    if (navigateToPage) {
      if (page === "home") {
        navigateToPage("/");
      } else {
        const section = document.getElementById(page);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-4 w-full">
        <Link to="/">
          <img
            src="/logo.png"
            alt="CodeSchool Logo"
            className="h-10 w-auto mr-2"
            style={{ maxHeight: 40 }}
          />
        </Link>
        <span className="text-2xl font-bold text-blue-700 hidden md:inline">CodeSchool</span>
        <ul className="hidden md:flex items-center gap-6 ml-8">
          {navItems.map((item) => (
            <li key={item.page}>
              <button
                className={`text-lg font-medium hover:text-blue-600 transition-colors duration-200 ${
                  currentPage === item.page ? "text-blue-600" : "text-gray-700"
                }`}
                onClick={() => handleNavClick(item.page)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="hidden md:flex items-center space-x-4 ml-auto">
          <a
            href="tel:+998504004000"
            className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors"
          >
            <Phone size={16} />
            <span className="font-semibold">+998 50 400 40 00</span>
          </a>
          <Link
            to="/cabinet"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300"
          >
            Shaxsiy kabinet
          </Link>
        </div>
        <div className="md:hidden ml-auto">
          <button onClick={() => setIsMenuOpen((s) => !s)}>
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
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
                  href="tel:+998504004000"
                  className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors"
                >
                  <Phone size={16} />
                  <span className="font-medium">+998 50 400 40 00</span>
                </a>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/cabinet");
                    console.log("success");
                    
                  }}
                  className="px-3 py-1 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  Shaxsiy kabinet
                </button>
                gfgf
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
