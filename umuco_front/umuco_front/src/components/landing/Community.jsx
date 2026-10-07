import React, {useState} from 'react';
import { Quote, FilePlus, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../contexts/Language';
import joinImg from '../../assets/tra.webp'; 

function CommunityGuardian({onNavigate}) {
  const {t} = useLanguage();
  return (
    <div className="w-full bg-[#FDFBF7] font-sans scroll-mt-24">
      <section className="w-full px-4 sm:px-6 py-12 sm:py-20 text-center bg-[#FDFBF7] border-t border-[#EADBC8]/40">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="text-[#8D493A]/30 mb-2 sm:mb-4">
            <Quote className="w-8 h-8 sm:w-12 sm:h-12 fill-current" />
          </div>
          
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#8D493A] tracking-tight mb-2 sm:mb-4">
            "Ababiri baruta umwe."
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg font-medium text-[#8D493A] tracking-wide mb-2 sm:mb-3">
            {t('community.proverbTranslation')}
          </p>
          
          <p className="text-xs sm:text-sm text-[#6F5B55] italic font-normal max-w-md mb-6 sm:mb-8">
            {t('community.exploreWisdom')}
          </p>
          
          <button onClick={() => onNavigate('signup')} className="bg-[#8D493A] hover:bg-[#3E2723] text-[#FDFBF7] px-5 py-3 text-xs sm:text-sm font-semibold tracking-wide rounded-xl transition-all duration-200 shadow-sm w-full sm:w-auto">
            {t('community.createAccount')}
          </button>
        </div>
      </section>

      <section className="w-full px-4 sm:px-6 pb-12 sm:pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden bg-[#8B452B] text-white grid grid-cols-1 lg:grid-cols-12 min-h-fit lg:min-h-[460px] shadow-xl">
          <div className="col-span-1 lg:col-span-6 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center items-start text-left bg-[#8B452B]">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.2] lg:leading-[1.15] text-[#FDFBF7] mb-4 sm:mb-6">
             {t('community.becomeGuardian')}
            </h2>
            
            <p className="text-xs sm:text-sm text-[#EADBC8]/80 leading-relaxed font-normal max-w-xl mb-6 sm:mb-8">
            {t('community.joinNetwork')}
            </p>
            
            <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-3 w-full">
              <button onClick={() => onNavigate('signup')} className="inline-flex items-center justify-center space-x-1.5 sm:space-x-2.5 bg-[#FCDFD3] hover:bg-[#EADBC8] text-[#8D493A] px-3 sm:px-6 py-3 rounded-xl text-[11px] sm:text-sm font-bold transition-all duration-200 tracking-wide shadow-sm flex-1 sm:flex-initial whitespace-nowrap">
                <FilePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8D493A]" />
                <span>{t('community.contribute')}</span>
              </button>
              
              <button onClick={() => onNavigate('login')} className="inline-flex items-center justify-center space-x-1.5 sm:space-x-2.5 border border-[#EADBC8]/30 hover:bg-white/5 text-[#FDFBF7] px-3 sm:px-6 py-3 rounded-xl text-[11px] sm:text-sm font-bold transition-all duration-200 tracking-wide flex-1 sm:flex-initial whitespace-nowrap">
                <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#EADBC8]/60" />
                <span>{t('community.dashboard')}</span>
              </button>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-6 relative w-full h-auto min-h-[300px]">
            <img 
              src={joinImg} 
              alt="Rwandan Audio Archive Workstation Studio" 
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#3E2319]/10 blend-multiply" />
          </div>

        </div>
      </section>
    </div>
  );
}

export default CommunityGuardian;
