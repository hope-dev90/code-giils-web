import React, { useState, useEffect } from 'react';
import { ArrowRight, Compass, BookOpen, Users, Flag, BarChart3, Package } from 'lucide-react';
import { useLanguage } from '../../contexts/Language';

import cardImg1 from '../../assets/tradi.jpg';
import cardImg2 from '../../assets/book.png';
import cardImg3 from '../../assets/iraba.jpg';

function ImigongoPattern({ id, color, className = '', style }) {
  return (
    <svg className={className} style={style} aria-hidden="true" width="100%" height="100%">
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <path d="M28 0 L56 28 L28 56 L0 28 Z" fill="none" stroke={color} strokeWidth="2" />
          <path d="M28 12 L44 28 L28 44 L12 28 Z" fill="none" stroke={color} strokeWidth="2" />
          <path d="M28 22 L34 28 L28 34 L22 28 Z" fill={color} />
          <path
            d="M0 0 L6 0 L0 6 Z M56 0 L50 0 L56 6 Z M0 56 L6 56 L0 50 Z M56 56 L50 56 L56 50 Z"
            fill={color}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}


function Hero({ onNavigate }) {
  const [order, setOrder] = useState([0, 1, 2]);
  const [paused, setPaused] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (paused) return undefined;
    const interval = setInterval(() => {
      setOrder((prev) => prev.map((p) => (p + 2) % 3));
    }, 4000);
    return () => clearInterval(interval);
  }, [paused]);

  const bringToFront = (i) =>
    setOrder((prev) => {
      const shift = 2 - prev[i];
      return prev.map((p) => (p + shift + 3) % 3);
    });

  const stats = [
    { value: '200+', label: t('hero.stats.oralStories') },
    { value: '3', label: t('hero.stats.languageModules') },
    { value: '24/7', label: t('hero.stats.aiAssistant') },
  ];

  const features = [
    {
      title: t('hero.feature1.title'),
      desc: t('hero.feature1.desc'),
      img: cardImg3,
      icon: Users,
    },
    {
      title: t('hero.feature2.title'),
      desc: t('hero.feature2.desc'),
      img: cardImg2,
      icon: BookOpen,
    },
    {
      title: t('hero.feature3.title'),
      desc: t('hero.feature3.desc'),
      img: cardImg1,
      icon: Compass,
    },
  ];

  const questSteps = [
    { number: '1', title: t('landing.quest.pick'), icon: Flag },
    { number: '2', title: t('landing.quest.learn'), icon: BarChart3 },
    { number: '3', title: t('landing.quest.earn'), icon: Package },
  ];

  const positions = [
    'z-10 -rotate-6 -translate-x-14 translate-y-4 scale-90 opacity-80 shadow-[0_10px_25px_-12px_rgba(44,26,20,0.35)]',
    'z-20 rotate-6 translate-x-14 translate-y-2 scale-95 opacity-95 shadow-[0_18px_35px_-14px_rgba(44,26,20,0.4)]',
    'z-30 rotate-0 translate-x-0 translate-y-0 scale-100 opacity-100 shadow-[0_30px_60px_-20px_rgba(44,26,20,0.55)]',
  ];

  return (
    <section className="relative w-full bg-[#FDFBF7] font-sans overflow-hidden">
      <style>{`
        @keyframes flowLine {
          0% { stroke-dashoffset: 40; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.08); }
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: none; }
        }
        .animated-flow-line {
          stroke-dasharray: 8 6;
          animation: flowLine 1.8s linear infinite;
        }
        .animate-float-slow { animation: floatSlow 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulseGlow 8s ease-in-out infinite; }
        .hero-rise {
          opacity: 0;
          animation: rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
          animation-delay: calc(var(--i, 0) * 110ms);
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-rise { opacity: 1; animation: none; }
        `}</style>

      <ImigongoPattern
        id="imi-page"
        color="#8D493A"
        className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none"
      />

      <div className="relative px-4 sm:px-6 pt-28 pb-20 md:pt-40 md:pb-24">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#FCDFD3]/40 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#EADBC8]/30 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center relative z-10">
          <div className="col-span-1 lg:col-span-6 flex flex-col items-start text-left px-2 sm:px-6">
            <h1
              className="hero-rise font-poppins text-[2.1rem] sm:text-5xl lg:text-[3.6rem] font-extrabold tracking-tight text-[#2C1A14] leading-[1.12] mb-5 sm:mb-7"
              style={{ '--i': 1 }}
            >
              {t('hero.title1')} <br className="hidden sm:inline" />
              <span className="text-[#8D493A]">{t('hero.title2')}</span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-[#6F5B55] max-w-xl leading-relaxed mb-6 sm:mb-8 font-semibold">
            {t('hero.description')}
          </p>

            <div className="hero-rise flex w-full flex-nowrap items-center gap-2 sm:w-auto sm:gap-4" style={{ '--i': 3 }}>
              <button
                onClick={() => onNavigate('signup')}
                className="group inline-flex min-w-0 flex-1 items-center justify-between gap-1 h-[52px] pl-3 pr-1.5 bg-[#8D493A] hover:bg-[#3E2723] text-[#FDFBF7] rounded-full text-[10px] font-bold tracking-wide shadow-[0_12px_24px_-10px_rgba(141,73,58,0.75)] transition-colors duration-300 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D493A] sm:flex-none sm:justify-center sm:gap-3 sm:pl-6 sm:pr-2 sm:text-sm"
              >
                <span>{t('hero.getInvolved')}</span>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#FDFBF7] text-[#8D493A] transition-transform duration-300 group-hover:translate-x-0.5 sm:size-9">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>

              <button
                onClick={() => document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-[52px] min-w-0 flex-1 px-2 border-2 border-[#8D493A]/30 hover:border-[#8D493A] hover:bg-[#8D493A]/5 text-[#8D493A] rounded-full text-[10px] font-bold tracking-wide transition-colors duration-300 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D493A] sm:flex-none sm:px-6 sm:text-sm"
              >
                {t('hero.exploreMore')}
              </button>
            </div>

            <div
              className="hero-rise w-full max-w-lg mt-10 sm:mt-12 pt-6 border-t border-[#EADBC8] grid grid-cols-3 divide-x divide-[#EADBC8]"
              style={{ '--i': 4 }}
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${index === 0 ? 'pr-3 sm:pr-6' : 'px-3 sm:px-6'}`}
                >
                  <span className="font-sans text-2xl sm:text-3xl font-black text-[#8D493A] leading-none">
                    {stat.value}
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#6F5B55] font-semibold mt-2 leading-snug">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="col-span-1 lg:col-span-6 relative flex items-center justify-center h-[400px] sm:h-[460px] lg:h-[520px] mt-2 lg:mt-0"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="scale-[0.85] sm:scale-100 lg:scale-110">
              <div className="relative w-72 h-96 animate-float-slow">
                {features.map((item, index) => {
                  const IconComponent = item.icon;
                  const assignedPositionIndex = order[index];
                  const isFront = assignedPositionIndex === 2;

                  return (
                    <div
                      key={index}
                      role="button"
                      tabIndex={0}
                      aria-label={item.title}
                      onClick={() => bringToFront(index)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          bringToFront(index);
                        }
                      }}
                      className={`absolute inset-0 transform ${positions[assignedPositionIndex]} group rounded-3xl overflow-hidden border-[6px] border-[#FDFBF7] transition-all duration-700 ease-in-out bg-[#3E2723] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8D493A] ${
                        isFront ? 'cursor-default' : 'cursor-pointer'
                      }`}
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#2C1A14]/95 via-[#2C1A14]/35 to-transparent" />

                      <div className="absolute inset-x-5 bottom-5 text-left text-white z-10">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="p-1.5 rounded-lg bg-[#8D493A]/85 text-[#FCDFD3]">
                            <IconComponent className="w-4 h-4 shrink-0" />
                          </div>
                          <h3 className="font-sans text-base font-bold tracking-wide leading-tight text-white">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-[11px] text-gray-200/90 line-clamp-2 font-normal tracking-wide leading-relaxed pl-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative  bg-[#FCDFD3]/2 border-t border-[#EADBC8] px-4 sm:px-6 pt-20 pb-20 sm:pt-24 sm:pb-28">
        <div className="relative max-w-5xl mx-auto">
          <svg
            className="hidden md:block absolute top-2 left-0 w-full h-12 pointer-events-none"
            viewBox="0 0 1000 50"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M 167 25 C 300 5, 380 45, 500 25 C 620 5, 700 45, 833 25"
              stroke="#8D493A"
              strokeOpacity="0.6"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
              className="animated-flow-line"
            />
          </svg>

          <div className="md:hidden absolute left-[31px] top-8 bottom-8 border-l-2 border-dashed border-[#8D493A]/30" />

          <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {questSteps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <li
                  key={idx}
                  className="group flex md:flex-col items-center gap-5 md:gap-0 text-left md:text-center"
                >
                  <div className="relative shrink-0 w-16 h-16 rounded-full bg-[#FDFBF7]  border-2 border-[#EADBC8] shadow-sm grid place-items-center text-[#8D493A] transition-colors duration-300 group-hover:bg-[#8D493A] group-hover:border-[#8D493A] group-hover:text-white">
                    <StepIcon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
                  </div>

                  <div className="md:mt-6">
                    <span className="block font-serif text-3xl font-black text-[#8D493A]/40 transition-colors duration-300 group-hover:text-[#8D493A]">
                      0{step.number}
                    </span>
                    <h3 className="font-sans font-bold text-[#8D493A] mt-1 transition-colors duration-200 group-hover:text-[#2C1A14]">
                      {step.title}
                    </h3>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default Hero;
