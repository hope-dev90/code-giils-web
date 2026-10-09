"use client";
import React, { useState } from "react";
import { ImagePage, Hotspot } from "@/components/ImagePage";
import { Modal, PopupCard, GreenButton } from "@/components/Modal";
import type { HotspotDef } from "@/lib/types";

const IW = 1837, IH = 856;
const h = (x: number, y: number, w: number, ht: number): HotspotDef =>
  [x / IW, y / IH, w / IW, ht / IH];

const NAV = {
  home:     h( 90,  85, 200, 155),
  about:    h(385, 235, 190, 120),
  natural:  h(585, 235, 190, 120),
  water:    h(788, 235, 190, 120),
  stats:    h(991, 235, 190, 120),
  contact:  h(1194,235, 190, 120),
  sanct:    h(1398,235, 190, 120),
};

const CARD_ROW1 = [
  { def: h(120, 410, 280, 320), name: "Herbal Tea Kit",     desc: "Organic Rwandan herbal tea blend, hand-picked from the highlands. 20 servings per box." },
  { def: h(420, 410, 280, 320), name: "Honey & Beeswax",    desc: "Pure raw honey from Nyungwe forest paired with artisanal beeswax candles." },
  { def: h(720, 410, 280, 320), name: "Coffee Selection",   desc: "Medium roast single-origin coffee beans from Lake Kivu region. 500g bag." },
  { def: h(1020,410, 280, 320), name: "Handwoven Basket",   desc: "Traditional sisal basket woven by artisans from Rwanda's southern province." },
  { def: h(1320,410, 280, 320), name: "Amate Art Print",    desc: "Framed bark-cloth artwork depicting Rwandan cultural motifs." },
];

const FOOTER = {
  articles: h(460, 780, 220, 60),
  logout:   h(820, 780, 190, 60),
  explore:  h(1100,780, 260, 60),
};

interface Props {
  onHome: () => void; onAbout: () => void; onNatural: () => void;
  onWater: () => void; onStats: () => void; onContact: () => void;
  onArticles: () => void; onLogout: () => void; onSanctuary: () => void;
  onShowcase: () => void;
}

export default function SanctuaryPage({ onHome, onAbout, onNatural, onWater, onStats, onContact, onArticles, onLogout, onSanctuary, onShowcase }: Props) {
  const [popup, setPopup] = useState<{ name: string; desc: string } | null>(null);
  const [showExplore, setShowExplore] = useState(false);

  return (
    <>
      <ImagePage image="/sanctury.webp" iw={IW} ih={IH}>
        {/* Navbar */}
        <Hotspot def={NAV.home}     onClick={onHome}      label="Home" />
        <Hotspot def={NAV.about}    onClick={onAbout}     label="About Us" />
        <Hotspot def={NAV.natural}  onClick={onNatural}   label="Natural Resources" />
        <Hotspot def={NAV.water}    onClick={onWater}     label="Water Products" />
        <Hotspot def={NAV.stats}    onClick={onStats}     label="Product Stats" />
        <Hotspot def={NAV.contact}  onClick={onContact}   label="Contact Us" />
        <Hotspot def={NAV.sanct}    onClick={onSanctuary} label="Sanctuary Kit" />

        {/* Product cards */}
        {CARD_ROW1.map(({ def, name, desc }) => (
          <Hotspot key={name} def={def} onClick={() => setPopup({ name, desc })} label={name}
            style={{ borderRadius: 12 }} />
        ))}

        {/* Footer actions */}
        <Hotspot def={FOOTER.articles} onClick={onArticles}        label="Articles" />
        <Hotspot def={FOOTER.logout}   onClick={onLogout}          label="Logout" />
        <Hotspot def={FOOTER.explore}  onClick={() => setShowExplore(true)} label="Explore All Kits" />
      </ImagePage>

      {/* Product detail popup */}
      {popup && (
        <Modal onClose={() => setPopup(null)} closeOnBackdrop>
          <PopupCard width={460} style={{ gap: 14 }}>
            <p style={{ fontFamily: "serif", fontWeight: 700, fontSize: "clamp(16px,1.8vw,22px)", color: "#2E4A1F" }}>{popup.name}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: "clamp(12px,1.2vw,14px)", color: "#5A3A10", lineHeight: 1.6, textAlign: "center" }}>
              {popup.desc}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 6, flexWrap: "wrap" }}>
              <GreenButton onClick={() => setPopup(null)}>Add to Cart</GreenButton>
              <button onClick={() => setPopup(null)} style={{
                background: "#B4552E", color: "#fff", border: "none", borderRadius: "clamp(10px,2vw,14px)",
                padding: "clamp(7px,1.2vw,9px) clamp(14px,2.5vw,22px)", fontWeight: 700,
                fontSize: "clamp(11px,1.1vw,13px)", cursor: "pointer", minHeight: 40,
              }}>Close</button>
            </div>
          </PopupCard>
        </Modal>
      )}

      {/* Explore all kits modal */}
      {showExplore && (
        <Modal onClose={() => setShowExplore(false)} closeOnBackdrop>
          <PopupCard width={520} style={{ gap: 14 }}>
            <p style={{ fontFamily: "serif", fontWeight: 700, fontSize: "clamp(16px,1.8vw,22px)", color: "#2E4A1F" }}>✦ Sanctuary Collection ✦</p>
            <div style={{ fontFamily: "sans-serif", fontSize: "clamp(12px,1.2vw,13px)", color: "#5A3A10", lineHeight: 1.7 }}>
              <p><strong>🌿 Wellness Kit</strong> — Essential oils, herbal soaps, and aroma diffuser.</p>
              <p><strong>☕ Morning Ritual Kit</strong> — Coffee, tea, honey &amp; ceramic mugs set.</p>
              <p><strong>🧺 Home Essentials Kit</strong> — Woven baskets, candles &amp; hand towels.</p>
              <p><strong>🎁 Gift of Culture Kit</strong> — Art prints, jewelry and notebook bundle.</p>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 6, flexWrap: "wrap" }}>
              <GreenButton onClick={() => { setShowExplore(false); onShowcase(); }}>Browse All</GreenButton>
              <button onClick={() => setShowExplore(false)} style={{
                background: "#B4552E", color: "#fff", border: "none", borderRadius: "clamp(10px,2vw,14px)",
                padding: "clamp(7px,1.2vw,9px) clamp(14px,2.5vw,22px)", fontWeight: 700,
                fontSize: "clamp(11px,1.1vw,13px)", cursor: "pointer", minHeight: 40,
              }}>Close</button>
            </div>
          </PopupCard>
        </Modal>
      )}
    </>
  );
}
