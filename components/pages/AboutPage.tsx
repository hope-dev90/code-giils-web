"use client";
import { ImagePage } from "@/components/ImagePage";
import { NavHotspots698, NAV_698 } from "@/components/NavHotspots";

interface Props {
  onHome: () => void; onAbout: () => void; onNatural: () => void;
  onWater: () => void; onStats: () => void; onContact: () => void;
  onArticles: () => void; onLogout: () => void; onSanctuary?: () => void; onShowcase?: () => void;
}

export default function AboutPage(props: Props) {
  return (
    <ImagePage image="/about-us.webp" iw={1536} ih={698}>
      <NavHotspots698 nav={NAV_698} {...props} />
    </ImagePage>
  );
}
