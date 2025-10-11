import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brend qismi */}
          <div>
            <div className="flex items-center mb-4">
              <i className="fas fa-graduation-cap text-2xl text-blue-400 mr-2"></i>
              <span className="text-xl font-bold">CodeSchool</span>
            </div>
            <p className="text-gray-400 mb-4">
              Dunyodagi talabalar uchun sifatli ta’lim: dasturlash, matematika
              va ingliz tili.
            </p>
            <div className="flex space-x-4">
              <i className="fab fa-facebook text-xl text-gray-400 hover:text-blue-400 cursor-pointer"></i>
              <i className="fab fa-twitter text-xl text-gray-400 hover:text-blue-400 cursor-pointer"></i>
              <i className="fab fa-instagram text-xl text-gray-400 hover:text-blue-400 cursor-pointer"></i>
              <i className="fab fa-linkedin text-xl text-gray-400 hover:text-blue-400 cursor-pointer"></i>
            </div>
          </div>

          {/* Tezkor havolalar */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tezkor havolalar</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 hover:text-white cursor-default">
                Natijalar
              </li>
              <li className="text-gray-400 hover:text-white cursor-default">
                Kurslar
              </li>
              <li className="text-gray-400 hover:text-white cursor-default">
                O‘qituvchilar
              </li>
              <li className="text-gray-400 hover:text-white cursor-default">
                Ro‘yxatdan o‘tish
              </li>
            </ul>
          </div>

          {/* Kurslar */}
          <div className="w-40 ">
            <h3 className="text-lg font-semibold mb-4">GUVOHNOMA</h3>
            <div className="flex  space-y-2   ">
              <img className="w-40" src="images\certificate.png" alt="" />
              <img
                className="w-40 h-25 "
                src="images\CODE SCHOOL IT Park sertifikati.jpg"
                alt=""
              />
            </div>
          </div>

          {/* Aloqa */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Aloqa</h3>
            <div className="space-y-2">
              <p className="text-gray-400 flex items-center">
                <i className="fas fa-envelope mr-2"></i>
                info@codeschool.uz
              </p>
              <p className="text-gray-400 flex items-center">
                <i className="fas fa-phone mr-2"></i>
                +998 (90) 123-45-67
              </p>
              <p className="text-gray-400 flex items-center">
                <i className="fas fa-map-marker-alt mr-2"></i>
                123 Ta’lim ko‘chasi, Samarqand shahri
              </p>
            </div>
          </div>
        </div>

        {/* Pastki qism */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 CodeSchool. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
