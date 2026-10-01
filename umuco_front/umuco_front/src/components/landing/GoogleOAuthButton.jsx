export default function GoogleOAuthButton({ onClick, className = '', disabled = false, label = 'Continue with Google' }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`flex items-center justify-center gap-3 border border-[#EADBC8]/80 bg-white hover:bg-[#FDFBF7] disabled:opacity-60 rounded-2xl text-xs font-semibold text-[#2C1A14] transition-all duration-200 shadow-xs hover:border-[#8D493A]/50 ${className}`}>
      <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.64 14.96 1 12 1 7.36 1 3.4 3.68 1.48 7.6l3.8 2.96C6.24 7.4 8.88 5.04 12 5.04z" />
        <path fill="#4285F4" d="M23.52 12.32c0-.8-.08-1.56-.2-2.32H12v4.4h6.48c-.28 1.48-1.12 2.72-2.36 3.56l3.68 2.84c2.16-2 3.4-4.96 3.4-8.48z" />
        <path fill="#FBBC05" d="M5.28 14.76c-.24-.72-.36-1.48-.36-2.28s.12-1.56.36-2.28L1.48 7.24C.52 9.16 0 11.28 0 13.5s.52 4.34 1.48 6.26l3.8-3z" />
        <path fill="#34A853" d="M12 23c3.24 0 5.96-1.08 7.96-2.92l-3.68-2.84c-1.04.7-2.36 1.12-4.28 1.12-3.12 0-5.76-2.36-6.72-5.52l-3.8 2.96C3.4 20.32 7.36 23 12 23z" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
