import { useState } from 'react';
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/Language';
import { STORY_LIBRARY } from '../../data/stories';
import StoryArticle from './StoryArticle';

const FEATURED_STORIES = STORY_LIBRARY;

export default function Discover({ onNavigate, initialStoryId }) {
  const { t, language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, FEATURED_STORIES.findIndex((item) => item.id === initialStoryId)));
  const story = FEATURED_STORIES[activeIndex];
  const showStory = (offset) => setActiveIndex((index) => (index + offset + FEATURED_STORIES.length) % FEATURED_STORIES.length);

  return (
    <section className="min-h-screen w-full bg-[#FAF8F5] px-4 py-8 font-sans sm:px-6 sm:py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <button type="button" onClick={() => onNavigate('home')} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#8D493A]"><ArrowLeft size={17} /> Back to UmucoCore</button>
        <div className="mb-8 flex flex-col items-center px-2 text-center sm:mb-12">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#EADBC8] bg-[#FCDFD3]/40 px-3.5 py-1 text-[9px] font-bold uppercase tracking-widest text-[#8D493A] sm:text-xs"><BookOpen size={15} /> {t('discover.kicker')} · QR REWARD</span>
          <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-[#8D493A] sm:mb-4 sm:text-4xl">{t('discover.title')}</h1>
          <p className="max-w-2xl text-xs font-semibold leading-relaxed text-[#6F5B55] sm:text-base">{t('discover.subtitle')}</p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="relative">
            <StoryArticle key={story.id} story={story} language={language} rewardLabel="Story unlocked by your QR scan" footer={<><p className="m-0 text-xs text-[#6F5B55]">You’ve reached the end of this oral history. Choose another story or return home.</p><button type="button" onClick={() => onNavigate('home')} className="mt-1 rounded-xl bg-[#8D493A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#723A2E]">Return to home</button></>} />
            <button type="button" onClick={() => showStory(-1)} aria-label="Previous story" className="absolute left-3 top-20 z-20 rounded-full border border-white/30 bg-black/40 p-2.5 text-white backdrop-blur-md transition hover:bg-[#8D493A] sm:top-32"><ChevronLeft /></button>
            <button type="button" onClick={() => showStory(1)} aria-label="Next story" className="absolute right-3 top-20 z-20 rounded-full border border-white/30 bg-black/40 p-2.5 text-white backdrop-blur-md transition hover:bg-[#8D493A] sm:top-32"><ChevronRight /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
