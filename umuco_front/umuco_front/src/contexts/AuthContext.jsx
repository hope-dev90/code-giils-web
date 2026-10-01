import { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { API_BASE, apiUrl, assetUrl } from '../config/api';

const AuthContext = createContext(null);

function normalizeUser(user) {
  if (!user) return null;
  return { ...user, profileImage: assetUrl(user.avatar) || null };
}

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || data.message || `Request failed (${response.status})`);
  return data;
}

async function authRequest(path, body, token) {
  let response;
  try {
    response = await fetch(apiUrl(`/api/auth${path}`), {
      method: body === undefined ? 'GET' : 'POST',
      headers: { ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new Error(`Cannot reach the Umuco API at ${API_BASE}. Start the backend and check VITE_API_BASE.`);
  }
  return readResponse(response);
}

function saveSession({ token, user }) {
  localStorage.setItem('token', token);
  return normalizeUser(user);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncUser = useCallback(async (token) => {
    if (!token) {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
      return null;
    }
    const data = await authRequest('/me', undefined, token);
    setUser(normalizeUser(data.user || data));
    setLoading(false);
    return data.user || data;
  }, []);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const oauthToken = hash.get('token');
    if (oauthToken) {
      localStorage.setItem('token', oauthToken);
      window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`);
    }
    syncUser(oauthToken || localStorage.getItem('token')).catch((error) => {
      console.error('Could not restore the Umuco account:', error);
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    });
  }, [syncUser]);

  const updateUser = useCallback((newUser) => setUser((previous) => ({ ...previous, ...newUser })), []);
  const getToken = useCallback(() => localStorage.getItem('token'), []);

  const login = useCallback(async (email, password, rememberMe = false) => {
    const data = await authRequest('/login', { email: email.trim(), password, rememberMe });
    const nextUser = saveSession(data);
    setUser(nextUser);
    return { success: true, user: nextUser, rememberMe };
  }, []);

  const register = useCallback((name, email, password) =>
    authRequest('/register', { name: name.trim(), email: email.trim(), password }), []);

  const verifyRegistration = useCallback(async (email, code) => {
    const data = await authRequest('/verify', { email: email.trim(), code });
    const nextUser = saveSession(data);
    setUser(nextUser);
    return { success: true, user: nextUser };
  }, []);

  const resendRegistrationCode = useCallback((email) => authRequest('/resend', { email: email.trim() }), []);
  const sendPasswordReset = useCallback((email) => authRequest('/password/reset/request', { email: email.trim() }), []);
  const verifyPasswordReset = useCallback((email, code) => authRequest('/password/reset/verify', { email: email.trim(), code }), []);
  const updatePassword = useCallback((password, resetToken) => authRequest('/password/reset/complete', { password, resetToken }), []);

  const googleLogin = useCallback(() => {
    localStorage.setItem('umuco_auth_redirect', 'dashboard');
    window.location.assign(apiUrl('/api/auth/google'));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, verifyRegistration, resendRegistrationCode,
    sendPasswordReset, verifyPasswordReset, updatePassword, googleLogin, logout, updateUser, getToken }), [
    user, loading, login, register, verifyRegistration, resendRegistrationCode, sendPasswordReset,
    verifyPasswordReset, updatePassword, googleLogin, logout, updateUser, getToken,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
