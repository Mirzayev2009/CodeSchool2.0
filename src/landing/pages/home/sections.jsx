import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const HomePageSections = () => {
  const [isVisible, setIsVisible] = useState({
    faq: false,
    advantages: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id.split('-')[0]]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = ['faq', 'advantages'].map((id) =>
      document.getElementById(`${id}-section`)
    );
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () =>
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
  }, []);

  const [openFaq, setOpenFaq] = useState(null);

  const faqData = [
    {
      question: "Bepul ochiq dars nima?",
      answer: "Bepul ochiq dars - bu sizga kurslarni tanishtirishdan oldin, o'qituvchilarimiz va o'qitish uslublarimiz bilan tanishish imkoniyatidir."
    },
    {
      question: "Qanday qilib kursga yozilish mumkin?",
      answer: "Kursga yozilish uchun saytimizdan ro'yxatdan o'ting yoki bizning ofisimizga tashrif buyuring. Sizga eng mos kursni tanlashda yordam beramiz."
    },
    {
      question: "O'qituvchilarimiz kimlar?",
      answer: "Bizning o'qituvchilarimiz soha mutaxassislari bo'lib, ko'p yillik tajribaga ega va zamonaviy o'qitish metodlarini qo'llaydilar."
    },
    {
      question: "O'qish va ishlashni birga olib borishim mumkinmi?",
      answer: "Albatta! Bizning moslashuvchan jadvallarimiz sizga ish va o'qishni muvaffaqiyatli birlashtirishga imkon beradi."
    },
    {
      question: "Men yangi boshlovchiman, o'qishim mumkinmi?",
      answer: "Ha, biz barcha darajadagi o'quvchilar uchun kurslar taklif qilamiz. Boshlang'ich darajadan boshlab professional darajaga yetkazamiz."
    },
    {
      question: "Uy vazifalarini qanday tekshirasiz?",
      answer: "Har bir uy vazifasi individual tekshiriladi va batafsil fikr-mulohaza beriladi. Shuningdek, qo'shimcha yordam taklif qilamiz."
    },
    {
      question: "Darslar qaysi tilda o'tiladi?",
      answer: "Darslar asosan o'zbek tilida o'tiladi, lekin ba'zi texnik terminlar ingliz tilida tushuntiriladi."
    },
    {
      question: "Men darsni o'tkazib yubordim, nima qilish kerak?",
      answer: "Xavotir olmang! Barcha darslar video shaklida saqlanadi va siz istalgan vaqtda qayta ko'rishingiz mumkin."
    },
    {
      question: "Maktabda o'qiyman. Darslarga qatnashishim mumkinmi?",
      answer: "Albatta! Bizning jadvallarimiz maktab o'quvchilari uchun ham qulay vaqtlarda tashkil etilgan."
    }
  ];

  const advantages = [
    {
      icon: "💻",
      title: "Kuchli kompyuterlar",
      description: "Qulay ta'lim jarayoni uchun jhozlangan sinflar",
      gradient: "from-green-400 to-green-600"
    },
    {
      icon: "📱",
      title: "Mobil ilova",
      description: "Shaxsiy kabinetga kirish uchun mobil ilovani yuklab oling",
      gradient: "from-purple-400 to-purple-600"
    },
    {
      icon: "👥",
      title: "Eng yaxshi mutaxassislar",
      description: "Biz ta'lim jarayonini qiziqarli va samarali qiladigan professionallar bilan ishlayotganimizdanfaxrlanamiz",
      gradient: "from-pink-400 to-pink-600"
    },
    {
      icon: "💼",
      title: "Bepul kovorking",
      description: "Bo'sh vaqtingizda kelib va vazifalarni bizning markarda bajarib",
      gradient: "from-orange-400 to-orange-600"
    },
    {
      icon: "🎁",
      title: "Ta'lim uchun sovrinlar",
      description: "Yaxshi ko'rsatkichlar uchun Yandex Stantsiyasi, Apple AirPods yoki Mi Band kabi sovrinlarni qo'lga kiriting",
      gradient: "from-red-400 to-red-600"
    }
  ];

  return (
    <div className="w-full">
      {/* FAQ Section */}
      <section
        id="faq-section"
        className={`py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 transform transition-all duration-1000 ${
          isVisible.faq
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
              <div className="bg-white rounded-full p-3">
                <span className="text-3xl">❓</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Tez-tez so'raladigan savollar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Eng ko'p beriladigan savollar va ularning javoblari
            </p>
          </div>

          <div className="space-y-5">
            {faqData.map((faq, index) => (
              <Card
                key={index}
                className={`overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl border-l-4 ${
                  openFaq === index
                    ? 'border-l-blue-500 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50'
                    : 'border-l-gray-200 hover:border-l-blue-400'
                } transform hover:scale-[1.02] animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 flex-1">
                      {faq.question}
                    </h3>
                    <div
                      className={`w-5 h-5 flex items-center justify-center rounded-full transition-all duration-300 ${
                        openFaq === index
                          ? 'bg-blue-500 text-white rotate-45'
                          : 'bg-gray-100 text-gray-600 hover:bg-blue-100'
                      }`}
                    >
                      <span className="text-xl font-bold">+</span>
                    </div>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openFaq === index ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="text-gray-600 leading-relaxed p-4 bg-white rounded-lg border-l-4 border-l-blue-200">
                      {faq.answer}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section
        id="advantages-section"
        className={`py-20 bg-white transform transition-all duration-1000 ${
          isVisible.advantages
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-4">
                <span className="text-white text-3xl">✨</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Sizning muvaffaqiyatli ta'limingiz uchun
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              ideal sharoitlar
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Zamonaviy texnologiyalar va professional yondashuv bilan ta'lim oling
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <Card
                key={index}
                className={`group relative overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer border-0 bg-gradient-to-br ${advantage.gradient} animate-fade-in-up`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl">{advantage.icon}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-200 transition-colors duration-300">
                      {advantage.title}
                    </h3>
                    <p className="text-white/90 leading-relaxed group-hover:text-white transition-colors duration-300">
                      {advantage.description}
                    </p>
                  </div>
                </CardContent>
                
                {/* Animated background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-500"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default HomePageSections;