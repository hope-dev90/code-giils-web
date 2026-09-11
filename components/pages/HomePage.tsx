"use client";
import React, { useState, useRef } from "react";
import { ImagePage, Hotspot } from "@/components/ImagePage";
import { Modal, PopupCard, GreenButton } from "@/components/Modal";
import { LoginModal } from "@/components/LoginModal";
import { userExists, signUp, login } from "@/lib/userStore";
import type { HotspotDef } from "@/lib/types";

const IW = 1847, IH = 851;
const h = (x: number, y: number, w: number, ht: number): HotspotDef =>
  [x / IW, y / IH, w / IW, ht / IH];

// Nav tiles
const T_ABOUT   = h(385,  235, 193, 124);
const T_NATURAL = h(588,  235, 193, 124);
const T_WATER   = h(791,  235, 193, 124);
const T_STATS   = h(994,  235, 193, 124);
const T_CONTACT = h(1197, 235, 193, 124);

// Form fields
const F_USER    = h(470,  530, 400,  56);
const F_PASS    = h(820,  530, 400,  56);
const F_CONF    = h(1170, 530, 400,  56);

// Buttons
const B_SIGNUP  = h(422,  622, 314,  60);
const B_LOGIN   = h(740,  621, 359,  78);
const B_ADMIN   = h(1107, 621, 316,  59);
const B_TERMS   = h(560,  775, 360,  55);
const B_FORGOT  = h(930,  775, 350,  55);

interface Props {
  onHome: () => void; onAbout: () => void; onNatural: () => void;
  onWater: () => void; onStats: () => void; onContact: () => void;
  onArticles: () => void; onLogout: () => void;
}

function InputOverlay({ def, value, onChange, placeholder, type }: {
  def: HotspotDef; value: string; onChange: (v: string) => void;
  placeholder: string; type?: string;
}) {
  const [x, y, w, hh] = def;
  return (
    <input
      type={type || "text"}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        position: "absolute",
        left: `${x * 100}%`, top: `${y * 100}%`,
        width: `${w * 100}%`, height: `${hh * 100}%`,
        background: "transparent", border: "none", outline: "none",
        fontFamily: "sans-serif", fontWeight: 600,
        fontSize: "clamp(11px, 1.2vw, 18px)",
        color: "#2A1A04", paddingLeft: "2%",
        caretColor: "#2A1A04", zIndex: 10,
      }}
    />
  );
}

export default function HomePage({ onAbout, onNatural, onWater, onStats, onContact }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");

  const [showLogin, setShowLogin]   = useState(false);
  const [showAdmin, setShowAdmin]   = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [showTerms, setShowTerms]   = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [infoMsg, setInfoMsg]       = useState<string | null>(null);
  const [statusMsg, setStatusMsg]   = useState<{ text: string; ok: boolean } | null>(null);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showStatus(text: string, ok: boolean) {
    setStatusMsg({ text, ok });
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setStatusMsg(null), 3500);
  }

  function doSignUp() {
    const u = username.trim();
    if (u.length < 3)        { showStatus("✗  Username must be at least 3 characters.", false); return; }
    if (password.length < 4) { showStatus("✗  Password must be at least 4 characters.", false); return; }
    if (password !== confirm) { showStatus("✗  Passwords do not match.", false); return; }
    if (userExists(u))        { showStatus("✗  Username already taken.", false); return; }
    signUp(u, password);
    setShowSuccess(true);
    setUsername(""); setPassword(""); setConfirm("");
  }

  return (
    <>
      <ImagePage image="/landingscreen.png" iw={IW} ih={IH}>
        {/* Nav */}
        <Hotspot def={T_ABOUT}   onClick={onAbout}   label="About Us" />
        <Hotspot def={T_NATURAL} onClick={onNatural} label="Natural Resources" />
        <Hotspot def={T_WATER}   onClick={onWater}   label="Water Products" />
        <Hotspot def={T_STATS}   onClick={onStats}   label="Product Stats" />
        <Hotspot def={T_CONTACT} onClick={onContact} label="Contact Us" />

        {/* Form inputs */}
        <InputOverlay def={F_USER} value={username} onChange={setUsername} placeholder="Username" />
        <InputOverlay def={F_PASS} value={password} onChange={setPassword} placeholder="Password" type="password" />
        <InputOverlay def={F_CONF} value={confirm}  onChange={setConfirm}  placeholder="Confirm password" type="password" />

        {/* Action buttons */}
        <Hotspot def={B_SIGNUP} onClick={doSignUp}              label="Sign Up" />
        <Hotspot def={B_LOGIN}  onClick={() => setShowLogin(true)} label="User Login" />
        <Hotspot def={B_ADMIN}  onClick={() => setShowAdmin(true)} label="Admin Login" />
        <Hotspot def={B_TERMS}  onClick={() => setShowTerms(true)} label="Terms" />
        <Hotspot def={B_FORGOT} onClick={() => setShowForgot(true)} label="Forgot Password" />

        {/* Status label */}
        {statusMsg && (
          <div style={{
            position: "absolute",
            left: `${(380 / IW) * 100}%`, top: `${(710 / IH) * 100}%`,
            width: `${(1080 / IW) * 100}%`,
            fontFamily: "sans-serif", fontWeight: 700,
            fontSize: "clamp(10px,1.1vw,15px)",
            color: statusMsg.ok ? "#2E7D32" : "#B00020",
            pointerEvents: "none",
          }}>{statusMsg.text}</div>
        )}
      </ImagePage>

      {/* Login modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => { setShowLogin(false); setShowLoginSuccess(true); }}
          onAbout={onAbout} onNatural={onNatural} onWater={onWater}
          onStats={onStats} onContact={onContact} onLogout={() => setShowLogin(false)}
        />
      )}

      {/* Login success screen */}
      {showLoginSuccess && <LoginSuccessScreen onOk={() => { setShowLoginSuccess(false); onAbout(); }} />}

      {/* Sign-up success */}
      {showSuccess && <SignUpSuccessScreen onOk={() => { setShowSuccess(false); setShowLogin(true); }} />}

      {/* Admin login */}
      {showAdmin && <AdminLoginModal onClose={() => setShowAdmin(false)} />}

      {/* Terms */}
      {showTerms && (
        <Modal onClose={() => setShowTerms(false)}>
          <PopupCard width={500}>
            <p style={{ fontFamily: "serif", fontWeight: 700, fontSize: 18, color: "#3A2005" }}>Terms &amp; Conditions</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#5A3A10", textAlign: "center", lineHeight: 1.6 }}>
              By using Code Hills 1001 you agree to use it responsibly.<br />
              All products are the property of UmucoCore Rwanda.<br />
              Contact us at info@umucocore.rw for any queries.
            </p>
            <GreenButton onClick={() => setShowTerms(false)}>Close</GreenButton>
          </PopupCard>
        </Modal>
      )}

      {/* Forgot password */}
      {showForgot && (
        <Modal onClose={() => setShowForgot(false)}>
          <PopupCard width={420}>
            <p style={{ fontFamily: "serif", fontWeight: 700, fontSize: 17, color: "#3A2005" }}>Forgot Password</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#5A3A10", textAlign: "center" }}>
              Please contact the administrator at<br />
              <strong>info@umucocore.rw</strong>
            </p>
            <GreenButton onClick={() => setShowForgot(false)}>OK</GreenButton>
          </PopupCard>
        </Modal>
      )}
    </>
  );
}

/* ── Login success full-screen ─────────────────────────────── */
function LoginSuccessScreen({ onOk }: { onOk: () => void }) {
  const IW2 = 1320, IH2 = 880;
  const okDef: HotspotDef = [430 / IW2, 590 / IH2, 460 / IW2, 90 / IH2];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300 }}>
      <ImagePage image="/login-success.png" iw={IW2} ih={IH2}>
        <Hotspot def={okDef} onClick={onOk} label="OK" />
      </ImagePage>
    </div>
  );
}

/* ── Sign-up success full-screen ───────────────────────────── */
function SignUpSuccessScreen({ onOk }: { onOk: () => void }) {
  return (
    <div
      onClick={onOk}
      style={{ position: "fixed", inset: 0, zIndex: 300, cursor: "pointer" }}
    >
      <ImagePage image="/success-message.png" iw={1386} ih={778}>
        {/* entire surface is clickable via the outer div */}
      </ImagePage>
    </div>
  );
}

/* ── Admin login modal ─────────────────────────────────────── */
function AdminLoginModal({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function attempt() {
    if (user === "admin" && pass === "hills123") { setSuccess(true); }
    else { setError("Incorrect admin credentials."); }
  }

  if (success) {
    return (
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, cursor: "pointer" }}>
        <ImagePage image="/success-message.png" iw={1386} ih={778} />
      </div>
    );
  }

  return (
    <Modal onClose={onClose} closeOnBackdrop>
      <PopupCard width={360} style={{ gap: 14 }}>
        <p style={{ fontFamily: "serif", fontWeight: 700, fontSize: 20, color: "#22301F" }}>Overseer Access</p>
        <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#888" }}>Demo: admin / hills123</p>
        <input value={user} onChange={e => setUser(e.target.value)}
          placeholder="Username" autoComplete="off"
          style={inputStyle} />
        <input value={pass} onChange={e => setPass(e.target.value)}
          placeholder="Password" type="password"
          onKeyDown={e => e.key === "Enter" && attempt()}
          style={inputStyle} />
        {error && <p style={{ color: "#B00020", fontSize: 13, fontFamily: "sans-serif" }}>{error}</p>}
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <GreenButton onClick={attempt}>Submit</GreenButton>
          <button onClick={onClose} style={{
            background: "#B4552E", color: "#fff", border: "none", borderRadius: 14,
            padding: "8px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}>Cancel</button>
        </div>
      </PopupCard>
    </Modal>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px",
  border: "1.5px solid #6E8C5B", borderRadius: 10,
  fontFamily: "sans-serif", fontSize: 14, background: "#fff",
  outline: "none",
};
