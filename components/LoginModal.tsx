"use client";
import React, { useState, useRef } from "react";
import { login } from "@/lib/userStore";
import { ImagePage, Hotspot } from "./ImagePage";
import type { HotspotDef } from "@/lib/types";

const IW = 1847, IH = 851;
const h = (x: number, y: number, w: number, ht: number): HotspotDef =>
  [x / IW, y / IH, w / IW, ht / IH];

const F_USER:  HotspotDef = h(200, 485, 440, 55);
const F_PASS:  HotspotDef = h(200, 563, 440, 55);
const B_LOGIN: HotspotDef = h(280, 648, 345, 44);

// Nav tiles (same grid)
const T_ABOUT   = h(310, 155, 155, 105);
const T_NATURAL = h(468, 155, 160, 105);
const T_WATER   = h(630, 155, 160, 105);
const T_STATS   = h(793, 155, 160, 105);
const T_CONTACT = h(956, 155, 160, 105);
const B_LOGOUT  = h(820, 760, 190,  55);

interface Props {
  onSuccess: () => void;
  onClose: () => void;
  onAbout: () => void; onNatural: () => void; onWater: () => void;
  onStats: () => void; onContact: () => void; onLogout: () => void;
}

export function LoginModal({ onSuccess, onClose, onAbout, onNatural, onWater, onStats, onContact, onLogout }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  function doLogin() {
    if (!username.trim() || !password) { setError("Please enter username and password."); return; }
    if (login(username.trim(), password)) {
      onSuccess();
    } else {
      setError("Incorrect username or password.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  const navClose = (fn: () => void) => () => { onClose(); fn(); };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
      <ImagePage image="/login-page.png" iw={IW} ih={IH}>
        {/* Username field */}
        <InputOverlay def={F_USER} value={username} onChange={setUsername}
          placeholder="Username" type="text" onEnter={doLogin} />
        {/* Password field */}
        <InputOverlay def={F_PASS} value={password} onChange={setPassword}
          placeholder="Password" type="password" onEnter={doLogin} />
        {/* Login button */}
        <Hotspot def={B_LOGIN} onClick={doLogin} label="Log In" />
        {/* Nav */}
        <Hotspot def={T_ABOUT}   onClick={navClose(onAbout)}   label="About" />
        <Hotspot def={T_NATURAL} onClick={navClose(onNatural)} label="Natural" />
        <Hotspot def={T_WATER}   onClick={navClose(onWater)}   label="Water" />
        <Hotspot def={T_STATS}   onClick={navClose(onStats)}   label="Stats" />
        <Hotspot def={T_CONTACT} onClick={navClose(onContact)} label="Contact" />
        <Hotspot def={B_LOGOUT}  onClick={navClose(onLogout)}  label="Logout" />

        {/* Error message */}
        {error && (
          <div style={{
            position: "absolute",
            left: `${(175 / IW) * 100}%`, top: `${(710 / IH) * 100}%`,
            width: `${(570 / IW) * 100}%`,
            color: "#CC0000", fontFamily: "sans-serif", fontWeight: 700,
            fontSize: "clamp(10px,1.2vw,14px)",
            animation: shake ? "shake 0.4s" : undefined,
          }}>{error}</div>
        )}

        {/* Close / backdrop click */}
        <div
          onClick={onClose}
          style={{ position: "absolute", inset: 0, zIndex: -1 }}
        />
      </ImagePage>
    </div>
  );
}

function InputOverlay({ def, value, onChange, placeholder, type, onEnter }: {
  def: HotspotDef; value: string; onChange: (v: string) => void;
  placeholder: string; type: string; onEnter: () => void;
}) {
  const [x, y, w, h] = def;
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => e.key === "Enter" && onEnter()}
      placeholder={placeholder}
      style={{
        position: "absolute",
        left: `${x * 100}%`, top: `${y * 100}%`,
        width: `${w * 100}%`, height: `${h * 100}%`,
        background: "transparent", border: "none", outline: "none",
        fontFamily: "sans-serif", fontWeight: 700, fontSize: "clamp(12px,1.4vw,20px)",
        color: "#2A1A04", paddingLeft: "3.5%", paddingRight: "1%",
        caretColor: "#2A1A04", zIndex: 10,
      }}
    />
  );
}
