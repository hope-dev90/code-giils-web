"use client";
import { ImagePage } from "@/components/ImagePage";
import { NavHotspots698, NAV_698 } from "@/components/NavHotspots";
import type { HotspotDef } from "@/lib/types";

// The Water Resources artwork is 1536×1024 and has a different navigation
// bar layout from the 1536×698 pages.
const WATER_NAV = {
  about: [136 / 1536, 274 / 1024, 234 / 1536, 174 / 1024] as HotspotDef,
  natural: [385 / 1536, 274 / 1024, 229 / 1536, 174 / 1024] as HotspotDef,
  water: [630 / 1536, 274 / 1024, 266 / 1536, 174 / 1024] as HotspotDef,
  stats: [909 / 1536, 274 / 1024, 246 / 1536, 174 / 1024] as HotspotDef,
  contact: [1167 / 1536, 274 / 1024, 238 / 1536, 174 / 1024] as HotspotDef,
  sanct: [0, 0, 0, 0] as HotspotDef,
  showcase: [0, 0, 0, 0] as HotspotDef,
  articles: [445 / 1536, 900 / 1024, 350 / 1536, 70 / 1024] as HotspotDef,
  logout: [850 / 1536, 900 / 1024, 280 / 1536, 70 / 1024] as HotspotDef,
  home: [0, 0, 0, 0] as HotspotDef,
};

interface Props {
  image: string; iw: number; ih: number; title: string;
  onHome: () => void; onAbout: () => void; onNatural: () => void;
  onWater: () => void; onStats: () => void; onContact: () => void;
  onArticles: () => void; onLogout: () => void; onSanctuary?: () => void;
}

export default function DummyPage({ image, iw, ih, title, onHome, onAbout, onNatural, onWater, onStats, onContact, onArticles, onLogout, onSanctuary }: Props) {
  return (
    <ImagePage image={image} iw={iw} ih={ih}>
      <NavHotspots698
        nav={title === "Water Resources" ? WATER_NAV : NAV_698}
        onHome={onHome} onAbout={onAbout} onNatural={onNatural}
        onWater={onWater} onStats={onStats} onContact={onContact}
        onArticles={onArticles} onLogout={onLogout} onSanctuary={onSanctuary}
      />
    </ImagePage>
  );
}
