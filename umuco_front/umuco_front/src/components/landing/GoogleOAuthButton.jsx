import { useEffect, useRef } from 'react';
import { GOOGLE_CLIENT_ID } from '../../config/api';

const GOOGLE_SCRIPT_ID = 'google-identity-services';

export default function GoogleOAuthButton({ onClick, className = '', disabled = false, label = 'Continue with Google' }) {
  const buttonRef = useRef(null);
  const callbackRef = useRef(onClick);
  callbackRef.current = onClick;

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !buttonRef.current) return;

    let cancelled = false;
    const renderButton = () => {
      if (cancelled || !window.google?.accounts?.id || !buttonRef.current) return;
      buttonRef.current.replaceChildren();
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: ({ credential }) => {
          if (credential) callbackRef.current(credential);
        },
        use_fedcm_for_button: true,
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: label.toLowerCase().includes('sign in') ? 'sign_in_with' : 'continue_with',
        shape: 'pill',
        width: Math.max(200, Math.floor(buttonRef.current.getBoundingClientRect().width)),
      });
    };

    let script = document.getElementById(GOOGLE_SCRIPT_ID);
    if (window.google?.accounts?.id) {
      renderButton();
    } else {
      if (!script) {
        script = document.createElement('script');
        script.id = GOOGLE_SCRIPT_ID;
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', renderButton);
    }

    return () => {
      cancelled = true;
      script?.removeEventListener('load', renderButton);
    };
  }, [label]);

  if (!GOOGLE_CLIENT_ID) {
    return <div className={`flex items-center justify-center text-xs text-red-700 ${className}`} role="alert">
      Google sign-in is not configured.
    </div>;
  }

  return <div ref={buttonRef} aria-disabled={disabled} className={`${disabled ? 'pointer-events-none opacity-60' : ''} ${className}`} />;
}
