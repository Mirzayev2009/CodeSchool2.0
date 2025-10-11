// This file maps course titles to react-icons icon components

import { FaCode, FaPaintBrush, FaRobot, FaLanguage, FaCalculator, FaFlask, FaBook, FaGlobe, FaBrain, FaLaptopCode, FaPalette, FaAtom, FaGraduationCap, FaChalkboardTeacher, FaCogs, FaMobileAlt, FaPython, FaJs, FaHtml5, FaCss3Alt } from "react-icons/fa";
import { GiArtificialIntelligence, GiTeacher, GiBookshelf, GiWorld, GiPencilRuler, Gi3dStairs, GiChemicalDrop, GiGraduateCap, GiNotebook, GiFeather, GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { MdOutlineScience, MdOutlineCalculate, MdOutlineLanguage, MdOutlineDraw, MdOutlineComputer, MdOutlineMenuBook } from "react-icons/md";
import { SiFlutter, SiJavascript, SiPython, SiHtml5, SiCss3, SiReact, SiAdobephotoshop, SiAdobexd, SiBlender, SiCplusplus } from "react-icons/si";


// Map course keywords to more visually interesting icons
export const courseIcons = {
  "Frontend": SiReact,
  "Backend": FaLaptopCode,
  "Grafik dizayn": SiAdobephotoshop,
  "3D Max": Gi3dStairs,
  "AI": GiArtificialIntelligence,
  "Ingliz tili": MdOutlineLanguage,
  "Matematika": MdOutlineCalculate,
  "Fizika": MdOutlineScience,
  "SAT": GiNotebook,
  "Turk tili": GiWorld,
  "Flutter": SiFlutter,
  "Python": SiPython,
  "JavaScript": SiJavascript,
  "HTML": SiHtml5,
  "CSS": SiCss3,
  "Graphic": FaPalette,
  "Design": MdOutlineDraw,
  "SMM": FaGlobe,
  "Teacher": GiTeacher,
  "Foundation": FaBook,
  // Add more mappings as needed
};
// Map course keywords to unique gradients
export const courseGradients = {
  "Frontend": "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
  "Backend": "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
  "Grafik dizayn": "linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)",
  "3D Max": "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
  "AI": "linear-gradient(135deg, #8f94fb 0%, #4e54c8 100%)",
  "Ingliz tili": "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
  "Matematika": "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
  "Fizika": "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
  "SAT": "linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)",
  "Turk tili": "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
  "Flutter": "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
  "Python": "linear-gradient(135deg, #8f94fb 0%, #4e54c8 100%)",
  "JavaScript": "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
  "HTML": "linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)",
  "CSS": "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
  "Graphic": "linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)",
  "Design": "linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)",
  "SMM": "linear-gradient(135deg, #8f94fb 0%, #4e54c8 100%)",
  "Teacher": "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
  "Foundation": "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
};

export function getCourseGradient(title) {
  for (const key in courseGradients) {
    if (title.toLowerCase().includes(key.toLowerCase())) {
      return courseGradients[key];
    }
  }
  // Default gradient
  return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
}

export function getCourseIcon(title) {
  // Try to find a matching icon by checking if the title includes a key
  for (const key in courseIcons) {
    if (title.toLowerCase().includes(key.toLowerCase())) {
      return courseIcons[key];
    }
  }
  return FaBook; // default icon
}




