import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createHmac, randomInt } from 'node:crypto';
import nodemailer from 'nodemailer';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const otpDigest = (email, purpose, code) => createHmac('sha256', process.env.JWT_SECRET)
  .update(`${email}:${purpose}:${code}`).digest('hex');
const signSession = (user, expiresIn = '7d') => jwt.sign({ sub: String(user.id) }, process.env.JWT_SECRET, { expiresIn });
const safeUser = ({ id, name, email, role }) => ({ id, name, email, role });

async function sendOtp(email, code, purpose) {
  if (!process.env.SMTP_USER || !process.env.SMTP_APP_PASSWORD)
    throw Object.assign(new Error('Email delivery is not configured. Set SMTP_USER and SMTP_APP_PASSWORD.'), { status: 503 });
  const isSignup = purpose === 'signup';
  const subject = isSignup ? 'Your Umuco verification code' : 'Your Umuco password reset code';
  const title = isSignup ? 'Verify your email' : 'Reset your password';
  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_APP_PASSWORD.replace(/\s/g, '') },
  });
  try {
    await transporter.sendMail({
      from: `Umuco <${process.env.AUTH_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
      subject,
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#2c1a14"><h2>${title}</h2><p>Your six-digit Umuco code is:</p><p style="font-size:32px;letter-spacing:8px;font-weight:bold">${code}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p></div>`,
      text: `${title}. Your six-digit code is ${code}. It expires in 10 minutes.`,
    });
  } catch (error) {
    console.error('SMTP email delivery failed:', error.code || error.message);
    throw Object.assign(new Error('Could not send the email. Check the SMTP host, port, username, password, and verified sender address.'), { status: 502 });
  } finally {
    transporter.close();
  }
}

async function issueOtp(email, purpose, payload) {
  const { rows } = await query('SELECT created_at FROM auth_otps WHERE email=$1 AND purpose=$2', [email, purpose]);
  if (rows[0] && Date.now() - new Date(rows[0].created_at).getTime() < 60_000) {
    const error = new Error('Please wait a minute before requesting another code.');
    error.status = 429;
    throw error;
  }
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  await query(`INSERT INTO auth_otps(email,purpose,code_hash,payload,attempts,expires_at,created_at)
    VALUES($1,$2,$3,$4,0,NOW()+INTERVAL '10 minutes',NOW())
    ON CONFLICT(email,purpose) DO UPDATE SET code_hash=EXCLUDED.code_hash,payload=EXCLUDED.payload,
      attempts=0,expires_at=EXCLUDED.expires_at,created_at=EXCLUDED.created_at`,
  [email, purpose, otpDigest(email, purpose, code), JSON.stringify(payload || {})]);
  try {
    await sendOtp(email, code, purpose);
  } catch (error) {
    await query('DELETE FROM auth_otps WHERE email=$1 AND purpose=$2', [email, purpose]);
    if (!error.status) error.status = 502;
    throw error;
  }
}

async function consumeOtp(email, purpose, code) {
  const { rows } = await query('SELECT * FROM auth_otps WHERE email=$1 AND purpose=$2', [email, purpose]);
  const otp = rows[0];
  if (!otp || new Date(otp.expires_at) < new Date()) throw Object.assign(new Error('This code is invalid or expired.'), { status: 400 });
  if (otp.attempts >= 5) throw Object.assign(new Error('Too many attempts. Request a new code.'), { status: 429 });
  const supplied = otpDigest(email, purpose, String(code || '').trim());
  if (supplied !== otp.code_hash) {
    await query('UPDATE auth_otps SET attempts=attempts+1 WHERE email=$1 AND purpose=$2', [email, purpose]);
    throw Object.assign(new Error('This code is invalid or expired.'), { status: 400 });
  }
  await query('DELETE FROM auth_otps WHERE email=$1 AND purpose=$2', [email, purpose]);
  return otp;
}

router.post('/register', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');
    if (name.length < 2 || name.length > 120) return res.status(400).json({ error: 'Enter a name between 2 and 120 characters.' });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    const { rows } = await query('SELECT id FROM users WHERE email=$1', [email]);
    if (rows[0]) return res.status(409).json({ error: 'An account with this email already exists. Sign in instead.' });
    const passwordHash = await bcrypt.hash(password, 12);
    await issueOtp(email, 'signup', { name, passwordHash });
    return res.status(202).json({ success: true, verificationRequired: true });
  } catch (error) { return next(error); }
});

router.post('/verify', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = await consumeOtp(email, 'signup', req.body.code);
    const payload = typeof otp.payload === 'string' ? JSON.parse(otp.payload) : otp.payload;
    const { rows } = await query(`INSERT INTO users(name,email,password,email_verified_at)
      VALUES($1,$2,$3,NOW()) ON CONFLICT(email) DO NOTHING
      RETURNING id,name,email,role`, [payload.name, email, payload.passwordHash]);
    const user = rows[0];
    if (!user) return res.status(409).json({ error: 'An account with this email already exists.' });
    return res.json({ user, token: signSession(user) });
  } catch (error) { return next(error); }
});

router.post('/resend', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { rows } = await query('SELECT payload FROM auth_otps WHERE email=$1 AND purpose=$2', [email, 'signup']);
    if (!rows[0]) return res.status(400).json({ error: 'No pending signup was found. Start again to request a code.' });
    const payload = typeof rows[0].payload === 'string' ? JSON.parse(rows[0].payload) : rows[0].payload;
    await issueOtp(email, 'signup', payload);
    return res.json({ success: true });
  } catch (error) { return next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { rows } = await query('SELECT id,name,email,role,password,email_verified_at FROM users WHERE email=$1', [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(String(req.body.password || ''), user.password)))
      return res.status(401).json({ error: 'Email or password is incorrect.' });
    if (!user.email_verified_at) return res.status(403).json({ error: 'Verify your email before signing in.' });
    const responseUser = safeUser(user);
    return res.json({ user: responseUser, token: signSession(user, req.body.rememberMe ? '30d' : '7d') });
  } catch (error) { return next(error); }
});

router.post('/password/reset/request', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { rows } = await query('SELECT id FROM users WHERE email=$1 AND email_verified_at IS NOT NULL', [email]);
    if (rows[0]) await issueOtp(email, 'password_reset', {});
    return res.json({ success: true });
  } catch (error) { return next(error); }
});

router.post('/password/reset/verify', async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    await consumeOtp(email, 'password_reset', req.body.code);
    return res.json({ resetToken: jwt.sign({ email, purpose: 'password_reset' }, process.env.JWT_SECRET, { expiresIn: '10m' }) });
  } catch (error) { return next(error); }
});

router.post('/password/reset/complete', async (req, res, next) => {
  try {
    const { email, purpose } = jwt.verify(String(req.body.resetToken || ''), process.env.JWT_SECRET);
    const password = String(req.body.password || '');
    if (purpose !== 'password_reset') return res.status(400).json({ error: 'Invalid reset session.' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    const passwordHash = await bcrypt.hash(password, 12);
    await query('UPDATE users SET password=$1 WHERE email=$2 AND email_verified_at IS NOT NULL', [passwordHash, email]);
    return res.json({ success: true });
  } catch (error) { return next(error); }
});

router.get('/google', (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
    return res.status(503).json({ error: 'Google sign-in is not configured on the backend.' });
  const state = jwt.sign({ nonce: Math.random().toString(36).slice(2) }, process.env.JWT_SECRET, { expiresIn: '10m' });
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.PUBLIC_API_URL || `http://localhost:${process.env.PORT || 5000}`}/api/auth/google/callback`;
  const params = new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID, redirect_uri: redirectUri, response_type: 'code', scope: 'openid email profile', state, prompt: 'select_account' });
  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

router.get('/google/callback', async (req, res) => {
  const frontend = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim();
  try {
    jwt.verify(String(req.query.state || ''), process.env.JWT_SECRET);
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.PUBLIC_API_URL || `http://localhost:${process.env.PORT || 5000}`}/api/auth/google/callback`;
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code: String(req.query.code || ''), client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
    });
    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error('Google token exchange failed.');
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    const profile = await profileResponse.json();
    if (!profileResponse.ok || !profile.email || !profile.verified_email) throw new Error('Google did not return a verified email address.');
    const email = normalizeEmail(profile.email);
    const name = String(profile.name || email.split('@')[0]).slice(0, 120);
    let { rows } = await query('SELECT id,name,email,role FROM users WHERE email=$1', [email]);
    if (!rows[0]) {
      const passwordHash = await bcrypt.hash(jwt.sign({ nonce: Math.random() }, process.env.JWT_SECRET), 12);
      ({ rows } = await query(`INSERT INTO users(name,email,password,email_verified_at)
        VALUES($1,$2,$3,NOW()) ON CONFLICT(email) DO UPDATE SET email=EXCLUDED.email
        RETURNING id,name,email,role`, [name, email, passwordHash]));
    }
    return res.redirect(`${frontend.replace(/\/$/, '')}/?auth=google#token=${encodeURIComponent(signSession(rows[0]))}`);
  } catch (error) {
    console.error('Google sign-in failed:', error.message);
    return res.redirect(`${frontend.replace(/\/$/, '')}/?auth=google&error=google_sign_in_failed`);
  }
});

router.get('/me', requireAuth, (req, res) => res.json({ user: safeUser(req.user) }));

export default router;
