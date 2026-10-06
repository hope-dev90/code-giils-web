import React, { useState, useEffect, useRef } from 'react';
import {
  Mail, Lock, Eye, EyeOff, User, ArrowLeft, ShieldCheck, ArrowUpRight, ArrowRight,
  Swords, Trees, Crown, BookOpen, Music,
} from 'lucide-react';
import GoogleOAuthButton from './GoogleOAuthButton';
import authLeftBg from '../../assets/tra.png';
import authLeftBg2 from '../../assets/tradi.jpg';
import authLeftBg3 from '../../assets/rda.jpg';
import TribalLogo from '../../assets/Logo';
import { useLanguage } from '../../contexts/Language';
import { useAuth } from '../../contexts/AuthContext';

const getSlides = (t) => [
  {
    src: authLeftBg,
    heading: t('auth.signup.slide.heading1') || 'Begin your',
    accent: t('auth.signup.slide.accent1') || 'Journey.',
    quote: t('auth.signup.slide.quote1') || '"Preserve Rwanda\u2019s living heritage start your journey today."',
  },
  {
    src: authLeftBg2,
    heading: t('auth.signup.slide.heading2') || 'Enter the',
    accent: t('auth.signup.slide.accent2') || 'Archive.',
    quote: t('auth.signup.slide.quote2') || '"Be part of Rwanda\u2019s living treasury of culture and tradition."',
  },
  {
    src: authLeftBg3,
    heading: t('auth.signup.slide.heading3') || 'Become part of',
    accent: t('auth.signup.slide.accent3') || 'History.',
    quote: t('auth.signup.slide.quote3') || '"Your story matters\u2014preserved, celebrated, and passed on."',
  },
];

const EXPLORER_TYPES = [
  {
    id: 'warrior',
    label: 'Warrior',
    tagline: 'Battles, legends & brave deeds',
    icon: Swords,
    adventureTitle: 'Ready your shield, Warrior',
    adventureSubtitle: 'Your saga begins the moment you sign up. Stories of courage, battle and honor await.',
    cta: 'Begin the Battle',
  },
  {
    id: 'nature-lover',
    label: 'Nature Lover',
    tagline: 'Forests, hills & wild places',
    icon: Trees,
    adventureTitle: 'Step into the wild, Nature Lover',
    adventureSubtitle: "Rwanda's hills, forests and rivers are waiting to share their stories with you.",
    cta: 'Start the Trail',
  },
  {
    id: 'royal-historian',
    label: 'Royal Historian',
    tagline: 'Kings, courts & old dynasties',
    icon: Crown,
    adventureTitle: 'Enter the royal court, Historian',
    adventureSubtitle: 'Centuries of kings, courts and dynasties are ready to be uncovered.',
    cta: 'Claim the Throne',
  },
  {
    id: 'folktale-hunter',
    label: 'Folktale Hunter',
    tagline: 'Myths, proverbs & fireside tales',
    icon: BookOpen,
    adventureTitle: 'Follow the tale, Folktale Hunter',
    adventureSubtitle: 'Myths, proverbs and fireside stories are hidden throughout the archive, waiting to be found.',
    cta: 'Chase the Legend',
  },
  {
    id: 'music-explorer',
    label: 'Music Explorer',
    tagline: 'Rhythms, songs & instruments',
    icon: Music,
    adventureTitle: 'Follow the rhythm, Music Explorer',
    adventureSubtitle: 'Songs, instruments and rhythms passed down for generations are ready to be heard.',
    cta: 'Strike the First Note',
  },
];
const getExplorerCopy = (t, id, fallback = {}) => ({
  label: t(`explorer.${id}.label`) || fallback.label,
  tagline: t(`explorer.${id}.tagline`) || fallback.tagline,
  adventureTitle: t(`auth.explorer.${id}.title`) || fallback.adventureTitle,
  adventureSubtitle: t(`auth.explorer.${id}.subtitle`) || fallback.adventureSubtitle,
  cta: t(`auth.explorer.${id}.cta`) || fallback.cta,
});
function ExplorerTypeModal({ onContinue, onSkip }) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(null);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(44,26,20,0.35)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{
          background: 'rgba(253,251,247,0.96)',
          border: '1px solid rgba(234,219,200,0.6)',
        }}
      >
        <div className="px-8 pt-10 pb-2 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-[#8D493A]">
            {t('auth.explorer.kicker') || 'Optional'}
          </p>
          <h1 className="text-2xl font-bold mb-2 text-[#2C1A14]">
            {t('explorerPicker.title') || 'What kind of explorer are you?'}
          </h1>
          <p className="text-xs text-[#6F5B55]">
            {t('auth.explorer.subtitle') || "Pick a path and we'll tailor your first quests to it."}
          </p>
        </div>

        <div className="px-6 py-6 space-y-3 max-h-[50vh] overflow-y-auto">
          {EXPLORER_TYPES.map((type) => {
            const isSelected = selected === type.id;
            const TypeIcon = type.icon;
            const copy = getExplorerCopy(t, type.id, type);
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelected(type.id)}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all"
                style={{
                  background: isSelected ? 'rgba(141,73,58,0.10)' : 'rgba(255,255,255,0.6)',
                  border: isSelected ? '2px solid #8D493A' : '1px solid rgba(234,219,200,0.8)',
                }}
              >
                <span
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: isSelected ? '#8D493A' : 'rgba(141,73,58,0.10)',
                    color: isSelected ? '#fff' : '#8D493A',
                  }}
                >
                  <TypeIcon className="w-4 h-4" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-[#2C1A14]">{copy.label}</span>
                  <span className="block text-xs text-[#6F5B55]">{copy.tagline}</span>
                </span>
                <span
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{
                    border: `2px solid ${isSelected ? '#8D493A' : '#D9C6BC'}`,
                    background: isSelected ? '#8D493A' : 'transparent',
                  }}
                />
              </button>
            );
          })}
        </div>

        <div className="px-8 pb-8 pt-2 space-y-2">
          <button
            type="button"
            disabled={!selected}
            onClick={() => onContinue(selected)}
            className="w-full py-3.5 rounded-xl font-semibold text-xs tracking-widest uppercase transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 bg-[#8D493A] text-white hover:bg-[#3E2723]"
          >
            {t('auth.continue') || 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="w-full py-2 text-xs font-semibold text-[#8D493A] hover:underline bg-transparent border-none cursor-pointer"
          >
            Skip for now!
          </button>
        </div>
      </div>
    </div>
  );
}

function VerificationNotice({ email }) {
  const { t } = useLanguage();
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(44,26,20,0.28)', backdropFilter: 'blur(8px)' }}
      role="status"
      aria-live="polite"
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl bg-[#FDFBF7]"
        style={{ border: '1px solid rgba(234,219,200,0.9)' }}
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#8D493A]/10 text-[#8D493A]">
          <Mail className="h-5 w-5" />
        </div>
        <h2 className="mb-2 text-base font-bold text-[#2C1A14]">{t('auth.checkEmail') || 'Check your email'}</h2>
        <p className="text-xs leading-relaxed text-[#6F5B55]">
          {t('auth.receiveVerificationCode') || "We're sending a verification code"}
          {email ? (
            <> at <span className="font-semibold text-[#2C1A14]">{email}</span></>
          ) : null}
          .
        </p>
        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-[#8D493A]">
          <span
            className="h-3 w-3 rounded-full border-2 border-current border-t-transparent"
            style={{ animation: 'spin 0.8s linear infinite' }}
          />
          {t('auth.sendingCode') || 'Sending code...'}
        </div>
      </div>
    </div>
  );
}

function LeftSlideshow() {
  const { t } = useLanguage();
  const SLIDES = getSlides(t);
  const [current, setCurrent] = useState(0);
  const [textVisible, setTextVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTextVisible(false);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % SLIDES.length);
        setTextVisible(true);
      }, 250);
    }, 3900);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx) => {
    if (idx === current) return;
    setTextVisible(false);
    setTimeout(() => {
      setCurrent(idx);
      setTextVisible(true);
    }, 250);
  };

  const slide = SLIDES[current];

  return (
    <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-[#2C1A14]">
      {SLIDES.map((s, idx) => (
        <img
          key={idx}
          src={s.src}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'opacity 0.35s ease',
            opacity: idx === current ? 1 : 0,
            zIndex: idx === current ? 1 : 0,
          }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.40) 50%, rgba(0,0,0,0.10) 100%)',
          zIndex: 2,
        }}
      />
      <div className="absolute inset-0 flex flex-col justify-end p-12" style={{ zIndex: 3 }}>
        <div
          style={{
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0px)' : 'translateY(8px)',
          }}
        >
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            {slide.heading}{' '}
            <span className="text-[#FCDFD3]">{slide.accent}</span>
          </h2>

          <div className="w-16 h-[2px] bg-[#8D493A] mb-6" />

          <p className="text-sm text-gray-200/90 leading-relaxed font-light max-w-sm">
            {slide.quote}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-10">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                width: idx === current ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: idx === current ? '#FCDFD3' : 'rgba(255,255,255,0.35)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'width 0.4s ease, background 0.4s ease',
              }}
            />
          ))}
        </div>

        <div className="mt-6 text-xs font-semibold tracking-widest text-white/40">
          {t('auth.slide.footer') || 'Preserving Rwandan Roots and Culture.'}
        </div>
      </div>
    </div>
  );
}

function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = ['#8D493A', '#8D493A', '#8D493A', '#8D493A', '#8D493A', '#FCDFD3', '#fff', '#C4724A', '#8D493A'];
    const SHAPES = ['circle', 'rect', 'star', 'ribbon'];

    const particles = Array.from({ length: 220 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      size: 6 + Math.random() * 12,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      speedY: 2.5 + Math.random() * 4,
      speedX: (Math.random() - 0.5) * 3,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8,
      opacity: 1,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.05 + Math.random() * 0.08,
    }));

    function drawStar(ctx, x, y, r) {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const fn = i === 0 ? 'moveTo' : 'lineTo';
        ctx[fn](x + r * Math.cos(angle), y + r * Math.sin(angle));
      }
      ctx.closePath();
      ctx.fill();
    }

    let animId;
    let frame = 0;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.wobble) * 1.2;
        p.wobble += p.wobbleSpeed;
        p.rotation += p.rotSpeed;
        if (frame > 120) p.opacity = Math.max(0, p.opacity - 0.008);

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === 'star') {
          drawStar(ctx, 0, 0, p.size / 2);
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 6, p.size, p.size / 3);
        }

        ctx.restore();
      });

      if (particles.some(p => p.opacity > 0)) {
        animId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}
    />
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const len = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasNum = /[0-9]/.test(password);
  const score = (len >= 8 ? 1 : 0) + (hasUpper ? 1 : 0) + (hasNum ? 1 : 0);
  const bars = [
    { filled: score >= 1, color: score === 1 ? '#e05a2b' : score === 2 ? '#f0a030' : '#3a9e60' },
    { filled: score >= 2, color: score === 2 ? '#f0a030' : '#3a9e60' },
    { filled: score >= 3, color: '#3a9e60' },
  ];
  const label = score === 1 ? 'Weak' : score === 2 ? 'Fair' : 'Strong';
  const labelColor = score === 1 ? '#e05a2b' : score === 2 ? '#f0a030' : '#3a9e60';

  return (
    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ display: 'flex', gap: 4, flex: 1 }}>
        {bars.map((b, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: b.filled ? b.color : '#EADBC8',
              transition: 'background 0.25s',
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: '0.6rem', fontWeight: 700, color: labelColor, minWidth: 36, textAlign: 'right' }}>
        {label}
      </span>
    </div>
  );
}

function SignUpPage({ onNavigate, onAuthenticated }) {
  const { t } = useLanguage();
  const { register, verifyRegistration, resendRegistrationCode, googleLogin } = useAuth();
  const [showExplorerModal, setShowExplorerModal] = useState(false);
  const [explorerType, setExplorerType] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', termsAccepted: false });
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!resendCooldown) return undefined;
    const timer = setTimeout(() => setResendCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const selectedExplorer = EXPLORER_TYPES.find((type) => type.id === explorerType) || null;
  const selectedExplorerCopy = selectedExplorer ? getExplorerCopy(t, selectedExplorer.id, selectedExplorer) : null;
  const handleExplorerContinue = (typeId) => {
    setExplorerType(typeId);
    setShowExplorerModal(false);
    setIsSuccess(true);
  };
  const handleExplorerSkip = () => {
    setShowExplorerModal(false);
    setIsSuccess(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCodeChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newCode = [...verificationCode];
    newCode[index] = element.value;
    setVerificationCode(newCode);
    if (element.nextSibling && element.value) element.nextSibling.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !verificationCode[index] && e.target.previousSibling)
      e.target.previousSibling.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newCode = [...verificationCode];
    pasted.split('').forEach((char, i) => { newCode[i] = char; });
    setVerificationCode(newCode);
    const nextIndex = Math.min(pasted.length, 5);
    const inputs = e.target.closest('.flex')?.querySelectorAll('input');
    if (inputs && inputs[nextIndex]) inputs[nextIndex].focus();
  };
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      setShowVerificationNotice(false);
      setIsVerifying(true);
      setResendCooldown(60);
    } catch (registrationError) {
      setError(registrationError.message || 'Could not create your account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (verificationCode.join('').length !== 6) throw new Error('Enter all 6 digits to continue.');
      await verifyRegistration(formData.email, verificationCode.join(''));
      setIsVerifying(false);
      setShowExplorerModal(true);
    } catch (verificationError) {
      setError(verificationError.message || 'Could not verify your email. Please try again.');
    } finally { setIsLoading(false); }
  };
  const handleResendOtp = async () => {
    setResendLoading(true);
    setError('');
    try {
      await resendRegistrationCode(formData.email);
      setResendCooldown(60);
    } catch (resendError) { setError(resendError.message || 'Could not resend the code.'); }
    finally { setResendLoading(false); }
  };

  const handleGoogleSuccess = async (credential) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await googleLogin(credential);
      if (onAuthenticated) onAuthenticated(result.user);
      else onNavigate('dashboard');
    } catch (loginError) {
      setError(loginError.message || 'Google sign-in is not available. Use email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <Confetti />
        <div className="fixed inset-0 w-full min-h-screen flex items-center justify-center bg-[#FDFBF7]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          <div className="flex flex-col items-center text-center px-8 max-w-md mx-auto">
            <div className="relative mb-8">
              <div
                style={{
                  position: 'absolute',
                  inset: '-12px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,215,0,0.35) 0%, rgba(255,140,0,0.12) 60%, transparent 80%)',
                  animation: 'pulse-glow 1.5s ease-in-out infinite',
                }}
              />
              <TribalLogo style={{ width: 100, height: 100, display: 'block', overflow: 'hidden', borderRadius: '50%', position: 'relative', zIndex: 1 }} />
              {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <span
                  key={i}
                  style={{
                    position: 'absolute',
                    width: i % 2 === 0 ? '10px' : '7px',
                    height: i % 2 === 0 ? '10px' : '7px',
                    borderRadius: '50%',
                    background: i % 3 === 0 ? '#8D493A' : i % 3 === 1 ? '#8D493A' : '#FCDFD3',
                    top: `${50 - 55 * Math.cos((deg * Math.PI) / 180)}%`,
                    left: `${50 + 55 * Math.sin((deg * Math.PI) / 180)}%`,
                    transform: 'translate(-50%, -50%)',
                    animation: `bounce-dot 0.8s ease-in-out infinite`,
                    animationDelay: `${i * 0.13}s`,
                  }}
                />
              ))}
            </div>
            {selectedExplorer && (
              <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#8D493A]/10 border border-[#8D493A]/20">
                <selectedExplorer.icon className="w-4 h-4 text-[#8D493A]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#8D493A]">
                  {selectedExplorerCopy.label}
                </span>
              </div>
            )}

            <h1 className="text-3xl font-bold text-[#2C1A14] mb-3 leading-tight">
              {selectedExplorer ? selectedExplorerCopy.adventureTitle : (t('auth.youreIn') || "You're in! \ud83c\udf89")}
            </h1>
            <p className="text-sm text-[#6F5B55] leading-relaxed mb-1">
              {t('auth.welcomeTo') || 'Welcome to UmucoCore,'}{' '}
              <span className="font-semibold text-[#2C1A14]">{formData.name}</span>.
            </p>
            <p className="text-xs text-[#8D493A]/70 mb-10 tracking-wide">
              {selectedExplorer ? selectedExplorerCopy.adventureSubtitle : (t('auth.yourGatewayReady') || 'Your cultural gateway is ready.')}
            </p>

            <div className="w-12 h-[2px] bg-[#8D493A]/30 rounded-full mb-10" />

            <button
              onClick={() => onAuthenticated ? onAuthenticated() : onNavigate('dashboard')}
              className="w-full bg-[#8D493A] hover:bg-[#3E2723] text-white py-3.5 px-6 rounded-xl font-semibold text-sm tracking-wide transition-colors duration-200 mb-3"
            >
              {selectedExplorer ? `${selectedExplorerCopy.cta} \u2192` : 'Enter your dashboard \u2192'}
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="w-full border border-[#EADBC8] text-[#6F5B55] hover:bg-[#FCDFD3]/20 py-3 px-6 rounded-xl text-xs font-medium transition-colors duration-200"
            >
              {t('auth.backToHome') || 'Back to Home'}
            </button>

            <p className="text-[10px] text-[#8D493A]/40 mt-8 tracking-widest uppercase">
              {t('auth.success.preservingText') || 'Preserving Rwandan Roots and Culture'}
            </p>
          </div>

          <style>{`
            @keyframes pulse-glow {
              0%, 100% { opacity: 0.7; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.08); }
            }
            @keyframes bounce-dot {
              0%, 100% { transform: translate(-50%, -50%) scale(1); }
              50% { transform: translate(-50%, -50%) scale(1.5); }
            }
          `}</style>
        </div>
      </>
    );
  }

  return (
    <section className="w-full min-h-screen flex font-sans bg-[#FDFBF7]">
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {showExplorerModal && (
        <ExplorerTypeModal
          onContinue={handleExplorerContinue}
          onSkip={handleExplorerSkip}
        />
      )}

      {showVerificationNotice && !isVerifying && (
        <VerificationNotice email={formData.email} />
      )}

      <LeftSlideshow />

      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-10 bg-[#FAF8F5]">
        <div className="flex items-center justify-between w-full mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-[#8D493A] hover:text-[#3E2723] transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span style={{ fontFamily: 'Poppins, sans-serif' }} className="font-semibold">{t('auth.backToHome') || 'Back to Home'}</span>
          </button>
          <div className="flex items-center space-x-1.5">
            <TribalLogo style={{ width: 50, height: 50, display: 'block', flexShrink: 0, overflow: 'hidden', borderRadius: '50%' }} />
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto my-auto">
          {!isVerifying ? (
            <>
              <div className="text-left mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-[#8D493A] mb-2 font-sans">
                  {t('auth.createAccount') || 'Create Account.'}
                </h1>
                <p className="text-xs md:text-sm text-[#6F5B55]">
                  {t('auth.setUpProfile') || "Start exploring Rwanda's cultural heritage today."}
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-xl overflow-hidden" style={{ border: '1px solid #e8dcd0', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
                  <div className="flex items-start gap-3 p-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#e8dcd0', color: '#6b3e26' }}>
                      <ShieldCheck className="w-5 h-5 text-[#8D493A]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold mb-0.5" style={{ color: '#4b2e1e' }}>Something went wrong</p>
                      <p className="text-xs leading-relaxed" style={{ color: '#6b4c3b' }}>{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div className="relative text-left">
                  <label className="block text-[10px] font-bold text-[#2C1A14] tracking-wider uppercase mb-1.5">{t('auth.labelFullName') || 'Full Name'}</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('auth.placeholder.name') || 'Your full name'}
                      className="w-full bg-white border border-[#EADBC8]/60 rounded-xl pl-10 pr-4 py-3 text-xs text-[#2C1A14] placeholder-neutral-400/70 focus:outline-none focus:border-[#8D493A] transition-colors"
                      required
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"><User className="w-4 h-4" /></span>
                  </div>
                </div>

                <div className="relative text-left">
                  <label className="block text-[10px] font-bold text-[#2C1A14] tracking-wider uppercase mb-1.5">{t('auth.labelEmail') || 'Email Address'}</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t('auth.placeholder.email') || 'name@domain.com'}
                      className="w-full bg-white border border-[#EADBC8]/60 rounded-xl pl-10 pr-4 py-3 text-xs text-[#2C1A14] placeholder-neutral-400/70 focus:outline-none focus:border-[#8D493A] transition-colors"
                      required
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"><Mail className="w-4 h-4" /></span>
                  </div>
                </div>

                <div className="relative text-left">
                  <label className="block text-[10px] font-bold text-[#2C1A14] tracking-wider uppercase mb-1.5">{t('auth.labelPassword') || 'Password'}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      minLength={6}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={t('auth.placeholder.password') || 'Create a strong password'}
                      className="w-full bg-white border border-[#EADBC8]/60 rounded-xl pl-10 pr-10 py-3 text-xs text-[#2C1A14] placeholder-neutral-400/70 focus:outline-none focus:border-[#8D493A] transition-colors"
                      required
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"><Lock className="w-4 h-4" /></span>
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Password strength meter, added from the richer sign-up flow */}
                  <PasswordStrength password={formData.password} />
                </div>

                <div className="relative text-left">
                  <label className="block text-[10px] font-bold text-[#2C1A14] tracking-wider uppercase mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Repeat your password"
                      className="w-full bg-white border border-[#EADBC8]/60 rounded-xl pl-10 pr-10 py-3 text-xs text-[#2C1A14] placeholder-neutral-400/70 focus:outline-none focus:border-[#8D493A] transition-colors"
                      required
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"><Lock className="w-4 h-4" /></span>
                  </div>
                </div>

                <label className="flex items-start space-x-2 cursor-pointer select-none pt-2">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="accent-[#8D493A] h-4 w-4 rounded border-neutral-300 mt-0.5"
                    required
                  />
                  <span className="text-xs text-[#6F5B55] leading-normal">
                    {t('auth.agreePrefix') || 'I agree to the'} <a href="#" className="text-[#8D493A] font-medium hover:underline">{t('auth.termsLink') || 'Terms of Service'}</a> {t('auth.agreeAnd') || 'and'} <a href="#" className="text-[#8D493A] font-medium hover:underline">{t('auth.privacyLink') || 'Privacy Policy'}</a>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#AF8272] hover:bg-[#8D493A] disabled:opacity-70 text-white py-3.5 px-4 rounded-xl font-bold text-xs tracking-widest uppercase transition-all duration-200 mt-4 flex items-center justify-center space-x-2 shadow-xs"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      <span>{t('auth.loading.creatingAccount') || 'Creating Account...'}</span>
                    </>
                  ) : (
                    <span className="flex items-center gap-1">
                      {t('auth.signUp') || 'Create Account'} <ArrowUpRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </form>

              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-neutral-200"></div>
                <span className="flex-shrink mx-4 text-neutral-400 text-[11px] font-medium">{t('auth.orContinueWith') || 'or register with'}</span>
                <div className="flex-grow border-t border-neutral-200"></div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <GoogleOAuthButton onClick={handleGoogleSuccess} disabled={isLoading} className="col-span-2 h-[42px] rounded-full" label="Continue with Google" />
              </div>

              <p className="text-xs text-[#6F5B55] text-center mt-2">
                {t('auth.hasAccount') || 'Already have an account?'}{' '}
                <button onClick={() => onNavigate('login')} className="font-bold text-[#8D493A] hover:underline bg-transparent border-none p-0 cursor-pointer">
                  {t('auth.signIn') || 'Sign In'}
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="text-left mb-8">
                <button
                  onClick={() => setIsVerifying(false)}
                  className="text-xs font-semibold text-[#8D493A] hover:text-[#3E2723] mb-5 transition-colors block"
                >
                  {t('auth.backToSignup') || 'Back to Sign Up'}
                </button>

                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#8D493A] mb-2">{t('auth.verifyEmail') || 'Verify Your Email'}</h1>
                <p className="text-xs md:text-sm text-[#6F5B55]">
                  {t('auth.enterCodeSentTo') || 'Enter the 6-digit verification code sent to'}{' '}
                  <span className="font-semibold text-[#2C1A14]">{formData.email}</span>.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-xl overflow-hidden" style={{ border: '1px solid #e8dcd0', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
                  <div className="flex items-start gap-3 p-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#e8dcd0', color: '#6b3e26' }}>
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold mb-0.5" style={{ color: '#4b2e1e' }}>Verification failed</p>
                      <p className="text-xs leading-relaxed" style={{ color: '#6b4c3b' }}>{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleCodeSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-[#2C1A14] tracking-wider uppercase mb-3">
                    {t('auth.verificationCode') || 'Verification Code'}
                  </label>
                  <div className="flex justify-between gap-2" onPaste={handlePaste}>
                    {verificationCode.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        name="code"
                        maxLength="1"
                        value={data}
                        onChange={(e) => handleCodeChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onFocus={(e) => e.target.select()}
                        className="w-12 h-12 bg-white border border-[#EADBC8] rounded-xl text-center text-sm font-bold text-[#2C1A14] focus:outline-none focus:border-[#8D493A] focus:ring-1 focus:ring-[#8D493A] transition-all"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#8D493A] hover:bg-[#3E2723] disabled:opacity-70 text-white py-3 px-4 rounded-xl font-semibold text-xs tracking-widest uppercase transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      <span>{t('auth.loading.verifying') || 'Verifying...'}</span>
                    </>
                  ) : (
                    <span>{t('auth.confirmAccount') || 'Confirm Account'}</span>
                  )}
                </button>
              </form>
              <p className="text-xs text-[#6F5B55] mt-5 text-center">
                {t('auth.didntReceive') || "Didn't receive a code?"}{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || resendLoading}
                  className="font-bold text-[#8D493A] hover:underline bg-transparent border-none p-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading
                    ? (t('auth.sending') || 'Sending...')
                    : resendCooldown > 0
                    ? (t('auth.resendIn') ? t('auth.resendIn').replace('{seconds}', resendCooldown) : `Resend in ${resendCooldown}s`)
                    : (t('auth.resendOtp') || 'Resend code')}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default SignUpPage;
