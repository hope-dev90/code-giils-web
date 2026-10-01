import React, { useState } from 'react';
import { ArrowRight, Globe, Menu, X } from 'lucide-react';
import Logo from '../../assets/Logo';
import { useLanguage } from '../../contexts/Language';

function Navbar({ onNavigate, activeSection }) {
  const { language, setLanguage, t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const languages = [
    { code: 'en', short: 'EN', label: t('settings.english') },
    { code: 'rw', short: 'RW', label: t('settings.kinyarwanda') },
    { code: 'fr', short: 'FR', label: t('settings.french') },
  ];

  const navItems = [
    { label: t('nav.home'), section: 'Home', id: '#home-section' },
    { label: 'Scan QR', section: 'Scan QR', id: '#scan-qr' },
    { label: t('nav.about'), section: 'About', id: '#archive' },
    { label: t('nav.community'), section: 'Community', id: '#community' }
  ];

  const toggleLanguage = (lang) => {
    if (typeof setLanguage === 'function') {
      setLanguage(lang);
    }
    setIsDropdownOpen(false);
  };

  const handleMobileNavClick = (view, sectionId) => {
    setIsMobileMenuOpen(false);
    onNavigate(view);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId.replace('#', ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const currentLanguageShort = languages.find((item) => item.code === language)?.short || 'EN';

  return (
    <header className="w-full bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EADBC8] px-4 md:px-6 py-3 font-sans shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div onClick={() => handleMobileNavClick('home', '#home-section')} className="flex items-center space-x-3 cursor-pointer">
          <Logo style={{ width: 36, height: 36, minWidth:36, maxWidth:36, overflow: 'hidden', borderRadius: '50%',  display:'block' }}/>
          <span className="text-[20px] font-bold tracking-wide text-[#8D493A]">
            UmucoCore
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeSection === item.section;
            return (
              <a
                key={item.label}
                href={item.id}
                className={`group relative pb-2 font-semibold text-[#6F5B55] transition-colors duration-200 hover:text-[#8D493A] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D493A] ${isActive ? 'text-[#8D493A]' : ''}`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 h-[2px] w-full origin-left bg-[#8D493A] transition-transform duration-200 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </a>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center space-x-6">
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-1.5 text-sm font-semibold text-[#8D493A] transition-colors tracking-wide hover:text-[#71392E] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D493A]"
            >
              <Globe size={18} />
              <span className="text-xs uppercase font-bold">{currentLanguageShort}</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-[#FDFBF7] border border-[#EADBC8] rounded-xl shadow-lg py-1 z-50 animate-fadeIn">
                {languages.map((item)=>(
                  <button
                    key={item.code}
                    onClick={()=>toggleLanguage(item.code)}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-[#6F5B55] hover:bg-[#FCDFD3]/30 hover:text-[#8D493A] transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => onNavigate('login')}
            className="text-sm font-semibold text-[#8D493A] transition-colors hover:text-[#71392E] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8D493A]"
          >
            {t('nav.login')}
          </button>

          <button 
            onClick={() => onNavigate('signup')}
            className="flex items-center space-x-2 bg-[#8D493A] hover:bg-[#3E2723] text-[#FDFBF7] px-5 py-2 text-sm font-medium tracking-wide transition-all rounded-[25px] shadow-sm group"
          >
            <span>{t('nav.signup')}</span>
            <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[#8D493A] hover:text-[#3E2723] p-1 focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bg-[#FDFBF7] border-b border-[#EADBC8] shadow-xl z-40 animate-fadeIn flex flex-col px-6 py-6 space-y-6 max-h-[calc(100vh-57px)] overflow-y-auto">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => {
              const isActive = activeSection === item.section;
              return (
                <a
                  key={item.label}
                  href={item.id}
                  onClick={() => handleMobileNavClick('home', item.id)}
                  className={`rounded-lg border-b border-[#EADBC8]/30 px-3 py-2 text-base font-semibold transition-colors hover:bg-[#FCDFD3]/30 hover:text-[#8D493A] ${isActive ? 'bg-[#FCDFD3]/30 text-[#8D493A]' : 'text-[#6F5B55]'}`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center justify-between py-2 border-b border-[#EADBC8]/30">
            <span className="text-sm font-medium text-[#6F5B55]">{t('landing.language')}</span>
            <div className="flex space-x-2">
              {languages.map((item)=>(
                <button
                  key={item.code}
                  onClick={() => toggleLanguage(item.code)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg ${
                    language === item.code ? 'bg-[#8D493A] text-white' : 'border border-[#EADBC8] text-[#6F5B55]'
                  }`}
                >
                  {item.short}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-3 pt-2">
            <button
              onClick={() => handleMobileNavClick('login', null)}
              className="w-full text-center border border-[#8D493A] text-[#8D493A] font-semibold py-3 rounded-xl text-sm hover:bg-[#8D493A]/5 transition-colors"
            >
              {t('nav.login')}
            </button>
            <button
              onClick={() => handleMobileNavClick('signup', null)}
              className="w-full text-center bg-[#8D493A] hover:bg-[#3E2723] text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>{t('nav.signup')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
