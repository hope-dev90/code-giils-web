import React, {useState} from 'react';
import Logo from '../../assets/Logo'
import { Share2, MessageSquare } from 'lucide-react';
import {useLanguage} from '../../contexts/Language';
function Footer() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !email.includes('@')) {
      setError(language === 'rw' ? 'Injiza imeri yabo' : language === 'fr' ? 'Entrez votre email' : 'Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(apiUrl('/api/contributions/subscribe'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contributor_email: email,
          contributor_name: email.split('@')[0],
          title: 'Newsletter Subscription',
          description: 'User subscribed to newsletter',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 5000);
      } else if (data.error === 'already_subscribed') {
        setError(language === 'rw' ? 'Wiyandikishije kera!' : language === 'fr' ? 'Vous êtes déjà inscrit!' : 'You have already subscribed!');
      } else {
        setError(data.message || data.error || (language === 'rw' ? 'Byanze' : language === 'fr' ? 'Échec' : 'Subscription failed'));
      }
    } catch (err) {
      setError(language === 'rw' ? 'Habaye ikosa' : language === 'fr' ? 'Erreur' : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  return (
    <footer className="w-full bg-[#3E2319] text-white font-sans px-6 pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-16 border-b border-white/10">
          
          <div className="lg:col-span-4 flex flex-col items-start text-left">
           <h3 className="flex items-center gap-2 font-sans text-2xl font-bold tracking-wide text-[#FDFBF7] mb-3">
            <Logo style={{ width: 36, height: 36, minWidth: 36, maxWidth: 36, overflow: 'hidden', borderRadius: '50%', display: 'block' }}/>
             <span>UmucoCore</span>
            </h3>

            <p className="text-sm text-[#A39E93] leading-relaxed max-w-sm mb-6 font-normal">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center space-x-3">
              <button className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#A39E93] hover:text-white transition-colors duration-200">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#A39E93] hover:text-white transition-colors duration-200">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col items-start text-left">
            <h4 className="font-serif text-lg font-bold tracking-wide text-[#EADBC8] mb-4">
              {t('footer.explore')}
            </h4>
            <ul className="space-y-3 text-sm text-[#A39E93]">
              <li><a href="#" className="hover:text-white transition-colors duration-200">{t('footer.exploreCulture')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">{t('footer.kinyarwandaBasics')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">{t('footer.oralTraditions')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">{t('footer.virtualMuseum')}</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2 flex flex-col items-start text-left">
            <h4 className="font-serif text-lg font-bold tracking-wide text-[#EADBC8] mb-4">
              {t('footer.community')}
            </h4>
            <ul className="space-y-3 text-sm text-[#A39E93]">
              <li><a href="#" className="hover:text-white transition-colors duration-200">{t('footer.joinDiscussions')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">{t('footer.upcomingEvents')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">{t('footer.contributorProgram')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">{t('footer.partenerships')}</a></li>
            </ul>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start text-left">
            <h4 className="font-serif text-lg font-bold tracking-wide text-[#EADBC8] mb-4">
              {t('footer.subscribe')}
            </h4>
            <p className="text-sm text-[#A39E93] mb-4 font-normal">
             {t('footer.subscribeDesc')}
            </p>
            { subscribed ? (
              <div className="flex items-center space-x-2 text-green-400 bg-green-400/10 px-4 py-3 rounded-lg animate-pulse">
                <CheckCircle size={20} />
                <span className="text-sm font-medium">
                  {language === 'rw' ? 'Wiyandikishije neza!' : language === 'fr' ? 'Inscription réussie!' : 'Successfully subscribed!'}
                </span>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center space-x-2">
              <input 
                type="email" 
                placeholder= {t('footer.emailPlaceholder')}
                value={email}
                onChange = {(e)=> setEmail(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-[#A39E93]/60 focus:outline-none focus:border-[#8D493A] transition-colors duration-200"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#8D493A] hover:bg-[#614800] text-white px-5 py-3 text-sm font-semibold tracking-wide rounded-lg transition-colors duration-200"
              >
                {loading ? '...' : t('footer.send')}
              </button>
            </form>
            )}

            {error && (
              <p className = "text-red-400 text-xs mt-2">{error}</p>
            )}
          </div>

        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A39E93]/60 font-normal">
          <p>{t('footer.copyright')}</p>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-white transition-colors duration-200">{t('footer.privacyPolicy')}</a>
            <a href="#" className="hover:text-white transition-colors duration-200">{t('footer.termsOfUse')}</a>
            <a href="#" className="hover:text-white transition-colors duration-200">{t('footer.helpCenter')}</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;