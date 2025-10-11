import React from "react";
import { Button } from "@/components/ui/button";

const Location = () => {
  return (
    <section id="location-section" className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Bizning manzilimiz
        </h1>

        {/* Motivational Text */}
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Zamonaviy auditoriyalar samarali ta’lim olish uchun barcha zarur
          jihozlar bilan ta’minlangan. Bizning markazimizga tashrif buyurib, o‘z
          ko‘zingiz bilan ko‘rishga taklif qilamiz!
        </p>

        {/* Main Image with Overlay */}
        <div className="relative mb-12">
          <img
            src="/images/20250321_144538.jpg"
            alt="Bizning joylashuv"
            className="w-full h-[250px] md:h-[400px] object-cover rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl"
          />

          {/* Overlay bottom left text */}
          <div className="absolute bottom-16 left-6 text-left text-white drop-shadow-md">
            <h2 className="text-2xl font-bold">CodeSchool «Choy fabrika»</h2>
            <p className="text-sm">
              Mirzo Ulug‘bek ko‘chasi 35, “Ona haykali” yonida
            </p>
          </div>

          {/* Yandex Maps Button under it */}
          <div className="absolute bottom-6 left-6">
            <Button
              onClick={() =>
                window.open(
                  "https://yandex.uz/maps/org/178211271511/?ll=66.942648%2C39.671529&mode=search&sctx=ZAAAAAgBEAAaKAoSCXHjFvNzvlBAETEnaJPD00NAEhIJm44AbhYvxj8REFg5tMh2vj8iBgABAgMEBSgKOABA3lBIAWoCdXqdAc3MzD2gAQCoAQC9AS05RRDCAQbX5uDxlwWCAgpDb2RlU2Nob29sigIAkgIAmgIMZGVza3RvcC1tYXBz&sll=66.942648%2C39.671529&source=morda&sspn=0.055275%2C0.027328&text=CodeSchool&z=14",
                  "_blank"
                )
              }
              className="bg-red-600 hover:bg-red-700 transition-transform duration-300 hover:scale-105"
            >
              Yandex Maps
            </Button>
          </div>
        </div>

        {/* Responsive Motivational Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              src: "/images/20250322_104251.jpg",
              text: "Bilim — kelajakning kaliti",
            },
            {
              src: "/images/20250322_104348.jpg",
              text: "Harakat qilsang, orzular amalga oshadi",
            },
            {
              src: "/images/20250322_104507.jpg",
              text: "Mehnat va sabr — muvaffaqiyat sari yo‘l",
            },
          ].map((img, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden rounded-2xl shadow-lg"
            >
              {/* Fix blur: use full width + fixed height with object-cover */}
              <img
                src={img.src}
                alt={`Motivatsiya ${idx + 1}`}
                className="w-full h-[300px] md:h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Motivational text overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-white text-xl md:text-2xl font-semibold drop-shadow-lg px-4">
                  {img.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Location;
