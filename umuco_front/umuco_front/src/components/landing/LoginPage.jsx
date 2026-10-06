import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, ArrowUpRight } from 'lucide-react';
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
    heading: t('auth.slide.heading1') || 'Heritage is our',
    accent: t('auth.slide.accent1') || 'Legacy.',
    quote: t('auth.slide.quote1') || '"Heritage connects ancestral wisdom to the digital future."',
  },
  {
    src: authLeftBg2,
    heading: t('auth.slide.heading2') || 'Culture is our',
    accent: t('auth.slide.accent2') || 'Identity.',
    quote: t('auth.slide.quote2') || '"Every tradition shapes who we are becoming."',
  },
   {
     src: authLeftBg3,
     heading: t('auth.signup.slide.heading3') || 'Become part of',
     accent: t('auth.signup.slide.accent3') || 'History.',
     quote: t('auth.signup.slide.quote3') || '"Your story matters\u2014preserved, celebrated, and passed on."',
   },
];

function ImigongoPattern({ id, color, className = '' }) {
  return (
    <svg className={className} aria-hidden="true" width="100%" height="100%">
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <path d="M28 0 L56 28 L28 56 L0 28 Z" fill="none" stroke={color} strokeWidth="2" />
          <path d="M28 12 L44 28 L28 44 L12 28 Z" fill="none" stroke={color} strokeWidth="2" />
          <path d="M28 22 L34 28 L28 34 L22 28 Z" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
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
    }, 4000);
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
      <div
        className="absolute inset-0 flex flex-col justify-end p-12"
        style={{ zIndex: 3 }}
      >
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

function LoginPage({ onNavigate, onLoginSuccess, isGovLogin = false }) {
  const { t, language } = useLanguage();
  const { login, googleLogin, sendPasswordReset, verifyPasswordReset, updatePassword } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(() =>
    new URLSearchParams(window.location.search).has('resetPassword') || window.location.hash.includes('type=recovery'));
  const [newPassword, setNewPassword] = useState('');
  const [passwordResetToken, setPasswordResetToken] = useState('');
  const [verificationStep, setVerificationStep] = useState('email');
  const [resetEmail, setResetEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleOtpPaste = (e) => {
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


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const result = await login(formData.email, formData.password, formData.rememberMe);
      onLoginSuccess?.(result.user);
      onNavigate('dashboard');
    } catch (loginError) {
      setError(loginError.message || 'Could not sign you in. Check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setIsLoading(true);
    setError('');
    try {
      await googleLogin(credential);
      onNavigate('dashboard');
    } catch (loginError) {
      setError(loginError.message || t('auth.googleError') || 'Google Sign-In failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await sendPasswordReset(resetEmail);
      setVerificationStep('code');
    } catch (resetError) {
      setError(resetError.message || 'Could not send the password reset email.');
    } finally { setIsLoading(false); }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await updatePassword(newPassword, passwordResetToken);
      setIsPasswordRecovery(false);
      setIsForgotPassword(false);
      window.history.replaceState({}, '', window.location.pathname);
      setError('');
    } catch (resetError) {
      setError(resetError.message || 'Could not update your password.');
    } finally { setIsLoading(false); }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (verificationCode.join('').length !== 6) { setError('Enter all 6 digits to continue.'); return; }
    setIsLoading(true);
    setError('');
    try {
      const result = await verifyPasswordReset(resetEmail, verificationCode.join(''));
      setPasswordResetToken(result.resetToken);
      setVerificationStep('success');
    } catch (verifyError) { setError(verifyError.message || 'Could not verify your code.'); }
    finally { setIsLoading(false); }
  };

  const govTitle =
    language === 'rw'
      ? 'Murakaza neza, Abakozi ba Leta'
      : language === 'fr'
      ? 'Bienvenue, personnel gouvernemental'
      : 'Welcome, Government Staff';

  const govSubtitle =
    language === 'rw'
      ? "Injira ukoresheje konti yawe yemewe ya Leta."
      : language === 'fr'
      ? 'Connectez-vous avec vos identifiants gouvernementaux autorisés.'
      : 'Sign in with your authorized government credentials.';

  return (
    <section className="w-full min-h-screen flex font-sans bg-[#FDFBF7]">
      <style>{`
        @keyframes loginRise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: none; }
        }
        .login-rise {
          opacity: 0;
          animation: loginRise 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
          animation-delay: calc(var(--i, 0) * 90ms);
        }
        @media (prefers-reduced-motion: reduce) {
          .login-rise { opacity: 1; animation: none; }
        }
      `}</style>

      <LeftSlideshow />

      <div className="relative w-full lg:w-1/2 flex flex-col p-8 md:p-12 lg:p-16 bg-[#FAF8F5] lg:shadow-[-24px_0_48px_-32px_rgba(44,26,20,0.18)]">
        <ImigongoPattern
          id="imi-login-panel"
          color="#8D493A"
          className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none"
        />

        <div className="relative flex items-center justify-between w-full mb-8">
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

        <div className="relative w-full max-w-md mx-auto my-auto">
          {!isForgotPassword && !isPasswordRecovery ? (
            <>
              <div className="login-rise text-left mb-8" style={{ '--i': 0 }}>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#8D493A] mb-2 font-sans">
                  {isGovLogin ? govTitle : (t('auth.welcomeBack') || 'Welcome back.')}
                </h1>
                <p className="text-xs md:text-sm text-[#6F5B55]">
                  {isGovLogin ? govSubtitle : (t('auth.readyToAccess') || 'Access your heritage gateway and continue your journey.')}
                </p>
              </div>

              {error && (
                <div className="login-rise mb-4 rounded-2xl overflow-hidden" style={{ '--i': 0, border: '1px solid #e8dcd0', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
                  <div className="flex items-start gap-3 p-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#e8dcd0', color: '#6b3e26' }}>
                      <ShieldCheck className="w-5 h-5 text-[#8D493A]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold mb-0.5" style={{ color: '#4b2e1e' }}>
                        {error.toLowerCase().includes('no account') ? "Account not found" : "Couldn't sign you in"}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: '#6b4c3b' }}>{error}</p>
                      <p className="text-[11px] mt-1" style={{ color: '#8a6a58' }}>
                        {error.toLowerCase().includes('no account') ? (
                          <>
                            Want to join?{' '}
                            <button
                              type="button"
                              onClick={() => onNavigate('signup')}
                              className="font-bold bg-transparent border-none p-0 cursor-pointer hover:underline"
                              style={{ color: '#6b3e26' }}
                            >
                              Create an account
                            </button>
                          </>
                        ) : (
                          <>
                            Need help?{' '}
                            <button
                              type="button"
                              onClick={() => { setIsForgotPassword(true); setVerificationStep('email'); setError(''); }}
                              className="font-bold bg-transparent border-none p-0 cursor-pointer hover:underline"
                              style={{ color: '#6b3e26' }}
                            >
                              Reset your password
                            </button>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="login-rise relative text-left" style={{ '--i': 1 }}>
                  <label className="block text-[10px] font-bold text-[#2C1A14] tracking-wider uppercase mb-1.5">{t('auth.labelEmail') || 'Email Address'}</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t('auth.placeholder.email') || 'name@domain.com'}
                      className="w-full bg-white border border-[#EADBC8]/60 rounded-2xl pl-10 pr-4 py-3.5 text-xs text-[#2C1A14] placeholder-neutral-400/70 shadow-[0_1px_2px_rgba(44,26,20,0.04)] focus:outline-none focus:border-[#8D493A] focus:ring-4 focus:ring-[#8D493A]/10 transition-all duration-200"
                      required
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"><Mail className="w-4 h-4" /></span>
                  </div>
                </div>

                <div className="login-rise relative text-left" style={{ '--i': 2 }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold text-[#2C1A14] tracking-wider uppercase">{t('auth.labelPassword') || 'Password'}</label>
                    <button
                      type="button"
                      onClick={() => { setIsForgotPassword(true); setVerificationStep('email'); setError(''); }}
                      className="text-[10px] font-bold text-[#8D493A] hover:underline focus:outline-none"
                    >
                      {t('auth.forgotPassword') || 'Forgot password?'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={t('auth.placeholder.password') || '••••••••'}
                      className="w-full bg-white border border-[#EADBC8]/60 rounded-2xl pl-10 pr-10 py-3.5 text-xs text-[#2C1A14] placeholder-neutral-400/70 shadow-[0_1px_2px_rgba(44,26,20,0.04)] focus:outline-none focus:border-[#8D493A] focus:ring-4 focus:ring-[#8D493A]/10 transition-all duration-200"
                      required
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"><Lock className="w-4 h-4" /></span>
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <label className="login-rise flex items-center space-x-2 cursor-pointer select-none pt-1" style={{ '--i': 3 }}>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="accent-[#8D493A] h-4 w-4 rounded border-neutral-300"
                  />
                  <span className="text-xs text-[#6F5B55]">{t('auth.rememberMe') || 'Remember me for 30 days'}</span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="login-rise group w-full bg-[#8D493A] hover:bg-[#723A2E] disabled:opacity-70 text-white py-3.5 px-4 rounded-2xl font-bold text-xs tracking-widest uppercase transition-all duration-200 mt-4 flex items-center justify-center space-x-2 shadow-[0_10px_24px_-12px_rgba(141,73,58,0.65)] hover:shadow-[0_14px_28px_-12px_rgba(141,73,58,0.75)] hover:-translate-y-0.5"
                  style={{ '--i': 4 }}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      <span>{t('auth.loading.signingIn') || 'Signing In...'}</span>
                    </>
                  ) : (
                    <span className="flex items-center gap-1">
                      {t('auth.signIn') || 'Login'}
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  )}
                </button>
              </form>

              <div className="login-rise relative flex py-6 items-center" style={{ '--i': 5 }}>
                <div className="flex-grow border-t border-neutral-200"></div>
                <span className="flex-shrink mx-4 text-neutral-400 text-[11px] font-medium">{t('auth.orContinueWith') || 'or continue with'}</span>
                <div className="flex-grow border-t border-neutral-200"></div>
              </div>

              <div className="login-rise w-full mb-6" style={{ '--i': 6 }}>
                <GoogleOAuthButton onClick={handleGoogleSuccess} disabled={isLoading} className="w-full h-[52px]" label="Sign in with Google" />
              </div>

              <p className="login-rise text-xs text-[#6F5B55] mt-2 text-center" style={{ '--i': 7 }}>
                {t('auth.noAccount') || "Don't have an account?"}{' '}
                <button onClick={() => onNavigate('signup')} className="font-bold text-[#8D493A] hover:underline bg-transparent border-none p-0 cursor-pointer">
                  {t('auth.signUp') || 'Sign up'}
                </button>
              </p>
            </>
          ) : isPasswordRecovery ? (
            <>
              <div className="login-rise text-left mb-8" style={{ '--i': 0 }}>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#8D493A] mb-2">Choose a new password</h1>
                <p className="text-xs md:text-sm text-[#6F5B55]">Enter a new password for your Umuco account.</p>
              </div>
              {error && <p role="alert" className="mb-4 text-xs text-red-700">{error}</p>}
              <form onSubmit={handlePasswordUpdate} className="space-y-5">
                <label className="block text-[10px] font-bold text-[#2C1A14] tracking-wider uppercase">
                  New password
                  <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={6} required
                    className="mt-2 w-full bg-white border border-[#EADBC8] rounded-2xl px-4 py-3.5 text-xs text-[#2C1A14] focus:outline-none focus:border-[#8D493A] focus:ring-4 focus:ring-[#8D493A]/10" />
                </label>
                <button type="submit" disabled={isLoading}
                  className="w-full bg-[#8D493A] hover:bg-[#3E2723] disabled:opacity-60 text-white py-3.5 px-4 rounded-2xl font-semibold text-xs tracking-widest uppercase">
                  {isLoading ? 'Saving...' : 'Update password'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="login-rise text-left mb-8" style={{ '--i': 0 }}>
                <button onClick={() => { setIsForgotPassword(false); setError(''); }}
                  className="inline-flex items-center space-x-2 text-xs font-semibold text-[#8D493A] hover:text-[#3E2723] mb-4 transition-colors">
                  <ArrowLeft className="w-4 h-4" /><span>{t('auth.backToSignIn') || 'Back to Sign In'}</span>
                </button>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#8D493A] mb-2">{t('auth.resetPassword') || 'Reset Password'}</h1>
                <p className="text-xs md:text-sm text-[#6F5B55]">
                  {verificationStep === 'email' && 'Enter your account email to receive a six-digit password reset code.'}
                  {verificationStep === 'code' && `${t('auth.enterCode') || 'Enter the 6-digit code sent to'} ${resetEmail}.`}
                  {verificationStep === 'success' && (t('auth.reset.successLabel') || "Your verification is complete.")}
                </p>
              </div>

              {verificationStep === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-5">
                  <div className="login-rise relative text-left" style={{ '--i': 1 }}>
                    <label className="block text-[10px] font-bold text-[#2C1A14] tracking-wider uppercase mb-1.5">{t('auth.labelEmail') || 'Email Address'}</label>
                    <div className="relative">
                      <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
                        placeholder={t('auth.placeholder.email') || 'name@domain.com'}
                        className="w-full bg-white border border-[#EADBC8] rounded-2xl pl-10 pr-4 py-3 text-xs text-[#2C1A14] placeholder-neutral-400 shadow-[0_1px_2px_rgba(44,26,20,0.04)] focus:outline-none focus:border-[#8D493A] focus:ring-4 focus:ring-[#8D493A]/10 transition-all duration-200"
                        required />
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"><Mail className="w-4 h-4" /></span>
                    </div>
                  </div>
                  <button type="submit"
                    disabled={isLoading}
                    className="login-rise w-full bg-[#8D493A] hover:bg-[#3E2723] text-white py-3.5 px-4 rounded-2xl font-semibold text-xs tracking-widest uppercase transition-all duration-200 shadow-[0_10px_24px_-12px_rgba(141,73,58,0.65)] hover:-translate-y-0.5"
                    style={{ '--i': 2 }}>
                    {isLoading ? 'Sending...' : 'Send reset link'}
                  </button>
                </form>
              )}

              {verificationStep === 'code' && (
                <form onSubmit={handleCodeSubmit} className="space-y-6">
                  <div className="login-rise text-left" style={{ '--i': 1 }}>
                    <label className="block text-[10px] font-bold text-[#2C1A14] tracking-wider uppercase mb-3 text-center">{t('auth.verificationCode') || 'Verification Code'}</label>
                    <div className="flex justify-between gap-2 max-w-sm mx-auto" onPaste={handleOtpPaste}>
                      {verificationCode.map((data, index) => (
                        <input key={index} type="text" name="code" maxLength="1" value={data}
                          onChange={(e) => handleCodeChange(e.target, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onFocus={(e) => e.target.select()}
                          className="w-12 h-12 bg-white border border-[#EADBC8] rounded-2xl text-center text-sm font-bold text-[#2C1A14] shadow-[0_1px_2px_rgba(44,26,20,0.04)] focus:outline-none focus:border-[#8D493A] focus:ring-4 focus:ring-[#8D493A]/10 transition-all duration-200" />
                      ))}
                    </div>
                  </div>
                  <button type="submit"
                    className="login-rise w-full bg-[#8D493A] hover:bg-[#3E2723] text-white py-3.5 px-4 rounded-2xl font-semibold text-xs tracking-widest uppercase transition-all duration-200 shadow-[0_10px_24px_-12px_rgba(141,73,58,0.65)] hover:-translate-y-0.5"
                    style={{ '--i': 2 }}>
                    {t('auth.reset.verifyCode') || 'Verify Code'}
                  </button>
                </form>
              )}

              {verificationStep === 'success' && (
                <form onSubmit={handlePasswordUpdate} className="space-y-5">
                  <label className="block text-[10px] font-bold text-[#2C1A14] tracking-wider uppercase">New password
                    <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={8} required
                      className="mt-2 w-full bg-white border border-[#EADBC8] rounded-2xl px-4 py-3.5 text-xs text-[#2C1A14] focus:outline-none focus:border-[#8D493A]" />
                  </label>
                  <button type="submit" disabled={isLoading || !passwordResetToken}
                    className="w-full bg-[#8D493A] hover:bg-[#3E2723] disabled:opacity-60 text-white py-3.5 px-4 rounded-2xl font-semibold text-xs tracking-widest uppercase">
                    {isLoading ? 'Saving...' : 'Update password'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
