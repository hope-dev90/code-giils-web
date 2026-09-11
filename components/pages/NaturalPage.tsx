"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ImagePage, Hotspot } from "@/components/ImagePage";
import { NAV_1024 } from "@/components/NavHotspots";
import { ExplorePopup } from "@/components/ExplorePopup";
import type { HotspotDef } from "@/lib/types";

const IW = 1536, IH = 1024;
const h = (x: number, y: number, w: number, ht: number): HotspotDef =>
  [x / IW, y / IH, w / IW, ht / IH];

const EXPLORE: { def: HotspotDef; name: string }[] = [
  { def: h(149, 620, 128, 55), name: "Umuco Premium Tea" },
  { def: h(443, 620, 137, 55), name: "Logo Keychain" },
  { def: h(709, 620, 136, 55), name: "Sisal & Urubingo Reeds" },
  { def: h(988, 620, 132, 55), name: "Branded Pens" },
  { def: h(1275, 620, 135, 55), name: "Wide Design Tie Pins" },
  { def: h(145, 937, 149, 55), name: "T-Shirts / Polo" },
  { def: h(530, 937, 148, 55), name: "Tote Bags" },
  { def: h(867, 937, 147, 55), name: "Notebooks" },
  { def: h(1275, 937, 148, 55), name: "Rwandan Coffee Products" },
];

const SLIDES = [
  { src: "/t-shirt.png",  caption: "T-Shirts / Polo" },
  { src: "/tie.png",      caption: "Wide Design Tie Pins" },
  { src: "/book.png",     caption: "Notebooks" },
  { src: "/keys.png",     caption: "Logo Keychain" },
];

// Slideshow positioned center of page
const SLIDE_DEF: HotspotDef = [(768 - 240) / IW, (512 - 180) / IH, 480 / IW, 360 / IH];

interface Props {
  onHome: () => void; onAbout: () => void; onNatural: () => void;
  onWater: () => void; onStats: () => void; onContact: () => void;
  onArticles: () => void; onLogout: () => void;
}

function Slideshow() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const [next, setNext] = useState(1);
  const [alpha, setAlpha] = useState(1);
  const [visible, setVisible] = useState(true);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [hoverClose, setHoverClose] = useState(false);
  const [hoverReopen, setHoverReopen] = useState(false);

  const goTo = useCallback((idx: number) => {
    setNext(idx);
    setAlpha(1);
    setFading(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(() => {
      setNext((current + 1) % SLIDES.length);
      setAlpha(1);
      setFading(true);
    }, 3000);
    return () => clearTimeout(id);
  }, [current, visible]);

  useEffect(() => {
    if (!fading) return;
    if (alpha <= 0) {
      setCurrent(next);
      setAlpha(1);
      setFading(false);
      return;
    }
    const id = setTimeout(() => setAlpha(a => a - 1 / 20), 40);
    return () => clearTimeout(id);
  }, [fading, alpha, next]);

  const shown = fading && alpha < 0.5 ? next : current;

  if (!visible) {
    return (
      <div style={{
        position: "absolute", left: `${SLIDE_DEF[0] * 100}%`, top: `${SLIDE_DEF[1] * 100}%`,
        width: `${SLIDE_DEF[2] * 100}%`, height: `${SLIDE_DEF[3] * 100}%`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <button
          onClick={() => { setVisible(true); }}
          onMouseEnter={() => setHoverReopen(true)}
          onMouseLeave={() => setHoverReopen(false)}
          style={{
            background: "rgba(20,12,5,0.85)", border: `1.5px solid ${hoverReopen ? "#FFD080" : "#C8A06A"}`,
            borderRadius: 16, padding: "8px 20px", color: hoverReopen ? "#FFD080" : "#fff",
            fontFamily: "sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}
        >▶&nbsp; Show Slideshow</button>
      </div>
    );
  }

  return (
    <div style={{
      position: "absolute",
      left: `${SLIDE_DEF[0] * 100}%`, top: `${SLIDE_DEF[1] * 100}%`,
      width: `${SLIDE_DEF[2] * 100}%`, height: `${SLIDE_DEF[3] * 100}%`,
      background: "rgba(20,12,5,0.87)", borderRadius: 18,
      border: "1.8px solid #C8A06A", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 26,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "sans-serif", fontWeight: 700, fontSize: 13, color: "#FFD080",
      }}>✦&nbsp; FEATURED PRODUCTS &nbsp;✦</div>

      {/* Close ✕ */}
      <button
        onMouseEnter={() => setHoverClose(true)}
        onMouseLeave={() => setHoverClose(false)}
        onClick={() => setVisible(false)}
        style={{
          position: "absolute", top: 6, right: 8, width: 22, height: 22,
          background: hoverClose ? "#CC3333" : "#884444",
          borderRadius: "50%", color: "#fff", fontSize: 12,
          fontWeight: 700, cursor: "pointer", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >✕</button>

      {/* Left arrow */}
      <button
        onMouseEnter={() => setHoverPrev(true)}
        onMouseLeave={() => setHoverPrev(false)}
        onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
        style={{
          position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)",
          width: 32, height: 54, background: hoverPrev ? "rgba(255,208,128,0.9)" : "rgba(200,160,106,0.6)",
          borderRadius: 10, color: "#fff", fontSize: 22, fontWeight: 700,
          cursor: "pointer", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >‹</button>

      {/* Right arrow */}
      <button
        onMouseEnter={() => setHoverNext(true)}
        onMouseLeave={() => setHoverNext(false)}
        onClick={() => goTo((current + 1) % SLIDES.length)}
        style={{
          position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
          width: 32, height: 54, background: hoverNext ? "rgba(255,208,128,0.9)" : "rgba(200,160,106,0.6)",
          borderRadius: 10, color: "#fff", fontSize: 22, fontWeight: 700,
          cursor: "pointer", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >›</button>

      {/* Images */}
      <div style={{ position: "absolute", left: 44, top: 34, right: 44, bottom: 50, overflow: "hidden" }}>
        {fading && (
          <img src={SLIDES[next].src} alt={SLIDES[next].caption}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "contain", opacity: 1 - alpha }} />
        )}
        <img src={SLIDES[current].src} alt={SLIDES[current].caption}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "contain", opacity: fading ? alpha : 1 }} />
      </div>

      {/* Caption */}
      <div style={{
        position: "absolute", bottom: 16, left: 0, right: 0, textAlign: "center",
        fontFamily: "sans-serif", fontWeight: 700, fontSize: 14, color: "#fff",
      }}>{SLIDES[shown].caption}</div>

      {/* Dots */}
      <div style={{
        position: "absolute", bottom: 4, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 5,
      }}>
        {SLIDES.map((_, i) => (
          <div key={i} style={{
            width: 9, height: 9, borderRadius: "50%",
            background: i === shown ? "#FFD080" : "#888",
          }} />
        ))}
      </div>
    </div>
  );
}

export default function NaturalPage({ onHome, onAbout, onNatural, onWater, onStats, onContact, onArticles, onLogout }: Props) {
  const [popup, setPopup] = useState<string | null>(null);

  return (
    <ImagePage image="/natural-resources.png" iw={IW} ih={IH}>
      {/* Nav */}
      <Hotspot def={NAV_1024.about}   onClick={onAbout}   label="About Us" />
      <Hotspot def={NAV_1024.natural} onClick={onNatural} label="Natural Resources" />
      <Hotspot def={NAV_1024.water}   onClick={onWater}   label="Water Products" />
      <Hotspot def={NAV_1024.stats}   onClick={onStats}   label="Product Stats" />
      <Hotspot def={NAV_1024.contact} onClick={onContact} label="Contact Us" />
      <Hotspot def={h(560, 970, 220, 50)} onClick={onArticles} label="Articles" />
      <Hotspot def={h(820, 970, 190, 50)} onClick={onLogout}   label="Logout" />

      {/* Explore buttons */}
      {EXPLORE.map(({ def, name }) => (
        <Hotspot key={name} def={def} onClick={() => setPopup(name)} label={name} />
      ))}

      {/* Slideshow */}
      <Slideshow />

      {/* Explore popup */}
      {popup && <ExplorePopup productName={popup} onClose={() => setPopup(null)} />}
    </ImagePage>
  );
}
