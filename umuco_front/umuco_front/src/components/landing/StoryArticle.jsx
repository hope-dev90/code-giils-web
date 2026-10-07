import { BookOpen, Clock, MapPin, Sparkles } from 'lucide-react';
import { localizeStory } from '../../utils/storyLocalization';

/** Shared long-form editorial layout for purchased rewards and QR stories. */
export default function StoryArticle({ story: sourceStory, language = 'en', rewardLabel, compact = false, footer }) {
  const story = localizeStory(sourceStory, language);
  const paragraphs = String(story.content || '').split('\n\n').filter(Boolean);
  const readMinutes = Math.max(2, Math.round(String(story.content || '').split(/\s+/).length / 200));

  return (
    <article className="mx-auto w-full overflow-hidden border border-[#EADBC8]/70 bg-white shadow-[0_12px_40px_rgba(68,38,23,0.08)] sm:rounded-sm">
      <header className={`group relative w-full overflow-hidden bg-[#30221E] ${compact ? 'h-44 sm:h-56' : 'h-64 sm:h-80 md:h-96'}`}>
        {story.image && <img src={story.image} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-80" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
        <div className="absolute inset-x-5 bottom-5 z-10 text-white sm:inset-x-10 sm:bottom-7">
          <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-white/80"><BookOpen size={13} /> Umuco story</p>
          <h2 className={`m-0 font-bold tracking-tight text-white ${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-4xl'}`}>{story.title}</h2>
        </div>
      </header>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 pt-5 text-[10px] font-bold uppercase tracking-wider text-[#8D493A] sm:px-10 sm:pt-7 sm:text-xs">
        <span className="rounded-full border border-[#EADBC8] bg-[#FCDFD3]/30 px-3 py-1">{story.category}</span>
        <span className="inline-flex items-center gap-1.5 font-semibold normal-case text-[#6F5B55]"><Clock size={14} />{readMinutes} min read</span>
        {story.location && <span className="inline-flex items-center gap-1.5 font-semibold normal-case text-[#6F5B55]"><MapPin size={14} />{story.location}</span>}
      </div>
      <div className={`px-5 pb-7 pt-5 sm:px-10 sm:pb-10 sm:pt-6 ${compact ? 'sm:px-8' : ''}`}>
        <div className="mx-auto max-w-[68ch] space-y-5 text-left font-serif text-[15px] leading-[1.9] text-[#34241F] sm:space-y-6 sm:text-base sm:leading-[2]">
          {paragraphs.map((paragraph, index) => (
            <p key={`${story.id}-${index}`} className={`m-0 ${index === 0 ? 'first-letter:float-left first-letter:mr-2 first-letter:text-5xl first-letter:font-bold first-letter:leading-[.82] first-letter:text-[#8D493A] sm:first-letter:text-6xl' : ''}`}>{paragraph}</p>
          ))}
        </div>
      </div>
      {(rewardLabel || footer) && (
        <footer className="flex flex-col items-center gap-3 border-t border-[#EADBC8]/70 px-5 py-6 text-center sm:py-8">
          {rewardLabel && <span className="inline-flex items-center gap-2 rounded-full bg-[#F5EEE5] px-4 py-2 text-xs font-bold text-[#8D493A]"><Sparkles size={14} />{rewardLabel}</span>}
          {footer}
        </footer>
      )}
    </article>
  );
}
