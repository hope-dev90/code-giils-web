"use client";
import { ImagePage } from "@/components/ImagePage";
import { NavHotspots698, NAV_698 } from "@/components/NavHotspots";

interface Props {
  image: string; iw: number; ih: number; title: string;
  onHome: () => void; onAbout: () => void; onNatural: () => void;
  onWater: () => void; onStats: () => void; onContact: () => void;
  onArticles: () => void; onLogout: () => void;
}

export default function DummyPage({ image, iw, ih, onHome, onAbout, onNatural, onWater, onStats, onContact, onArticles, onLogout }: Props) {
  return (
    <ImagePage image={image} iw={iw} ih={ih}>
      <NavHotspots698
        nav={NAV_698}
        onHome={onHome} onAbout={onAbout} onNatural={onNatural}
        onWater={onWater} onStats={onStats} onContact={onContact}
        onArticles={onArticles} onLogout={onLogout}
      />
    </ImagePage>
  );
}
