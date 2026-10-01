import { useState } from 'react';
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/Language';
import { gihangaStory } from '../../data/stories/gihanga';
import { nyirarucyabaStory } from '../../data/stories/nyirarucyaba';
import { ruganzuStory } from '../../data/stories/ruganzu';
import { kigeliStory } from '../../data/stories/kigeli';
import { localizeStory } from '../../utils/storyLocalization';

const FEATURED_STORIES = [gihangaStory, nyirarucyabaStory, ruganzuStory, kigeliStory];

export default function Discover({ onNavigate, initialStoryId }) {
  const { t, language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, FEATURED_STORIES.findIndex((item) => item.id === initialStoryId)));
  const story = localizeStory(FEATURED_STORIES[activeIndex], language);
  const paragraphs = story.content.split('\n\n');
  const readMinutes = Math.max(2, Math.round(story.content.split(/\s+/).length / 200));
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

        <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-[#EADBC8]/60 bg-white shadow-md">
          <div className="group relative h-64 w-full overflow-hidden bg-neutral-900 sm:h-80 md:h-96">
            <img src={story.image} alt={story.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
            <button type="button" onClick={() => showStory(-1)} aria-label="Previous story" className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2.5 text-white backdrop-blur-md transition hover:bg-[#8D493A] sm:left-5"><ChevronLeft /></button>
            <button type="button" onClick={() => showStory(1)} aria-label="Next story" className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2.5 text-white backdrop-blur-md transition hover:bg-[#8D493A] sm:right-5"><ChevronRight /></button>
            <div className="absolute inset-x-6 bottom-6 z-10 text-left text-white sm:inset-x-12 sm:bottom-8">
              <span className="rounded-md bg-[#8D493A]/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#FCDFD3] sm:text-xs">{t('discover.featuredStory')} · {activeIndex + 1} of {FEATURED_STORIES.length}</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-4xl">{story.title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 pt-6 text-[10px] font-bold uppercase tracking-wider text-[#8D493A] sm:px-10 sm:text-xs"><span className="rounded-full border border-[#EADBC8] bg-[#FCDFD3]/40 px-3.5 py-1">{story.category}</span><span className="inline-flex items-center gap-1.5 font-semibold normal-case text-[#6F5B55]"><Clock size={14} className="text-[#8D493A]" />{readMinutes} min read</span></div>
          <div className="px-5 pb-5 pt-5 sm:px-10 sm:pb-8">
            <div key={story.id} className="mx-auto max-w-[68ch] space-y-5 text-left font-sans text-[15px] leading-[1.85] text-[#2C1A14] sm:space-y-6 sm:text-lg sm:leading-[1.9]">
              {paragraphs.map((paragraph, index) => <p key={`${story.id}-${index}`} className={index === 0 ? 'first-letter:float-left first-letter:mr-2.5 first-letter:text-5xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-[#8D493A] sm:first-letter:text-6xl' : ''}>{paragraph}</p>)}
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 border-t border-[#EADBC8]/60 px-5 py-7 text-center sm:py-9">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F5EEE5] px-4 py-2 text-xs font-bold text-[#8D493A]"><Sparkles size={15} /> Story unlocked by your QR scan</div>
            <p className="m-0 text-xs text-[#6F5B55]">You’ve reached the end of this oral history. Choose another story or return home.</p>
            <button type="button" onClick={() => onNavigate('home')} className="mt-2 rounded-xl bg-[#8D493A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#723A2E]">Return to home</button>
          </div>
        </article>
      </div>
    </section>
  );
}
