import React from 'react';
import { ArrowRight, History, Landmark, Music } from 'lucide-react';
import { useLanguage } from '../../contexts/Language';

function DigitalArchive({ onNavigate }) {
  const { t } = useLanguage();

  const collections = [
    {
      title: t('archive.collection1.title'),
      desc: t('archive.collection1.desc'),
      icon: History,
    },
    {
      title: t('archive.collection2.title'),
      desc: t('archive.collection2.desc'),
      icon: Landmark,
    },
    {
      title: t('archive.collection3.title'),
      desc: t('archive.collection3.desc'),
      icon: Music,
    },
  ];

  return (
    <div className="w-full">
      <section className="w-full bg-[#FDFBF7] font-sans px-4 sm:px-6 lg:px-10 py-12 sm:py-16 md:py-24 border-t border-[#EADBC8]/40 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-16 px-2 sm:px-0">
            <div className="text-left max-w-xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#8D493A] mb-2 sm:mb-4">
                {t('archive.title')}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-[#6F5B55] leading-relaxed font-normal">
                {t('archive.description')}
              </p>
            </div>

            <button
              onClick={() => onNavigate('signup')}
              className="inline-flex items-center space-x-2 text-[#8D493A] hover:text-[#3E2723] font-semibold text-xs sm:text-sm tracking-wide transition-colors duration-200 group self-start sm:self-auto shrink-0 pt-2 sm:pt-0 cursor-pointer"
            >
              <span>{t('archive.viewAll')}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {collections.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className={`bg-[#FCDFD3]/15 border border-[#EADBC8]/30 rounded-2xl p-6 sm:p-8 text-left flex flex-col justify-between min-h-[220px] sm:h-64 shadow-xs hover:shadow-md transition-all duration-300 sm:hover:-translate-y-1 group ${
                    index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#FCDFD3]/40 border border-[#EADBC8]/50 flex items-center justify-center mb-4 sm:mb-6 text-[#8D493A] sm:group-hover:bg-[#8D493A] sm:group-hover:text-[#FDFBF7] transition-colors duration-300">
                      <IconComponent className="w-4 sm:w-5 h-4 sm:h-5" />
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-[#2C1A14] mb-2 sm:mb-3 tracking-tight">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#6F5B55] leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>

                  <div className="w-8 h-1 bg-[#8D493A]/30 rounded-full mt-4 sm:group-hover:w-16 sm:group-hover:bg-[#8D493A] transition-all duration-300" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default DigitalArchive;
