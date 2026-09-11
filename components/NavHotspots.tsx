"use client";
import { Hotspot } from "./ImagePage";
import type { HotspotDef } from "@/lib/types";

// ── Shared nav definitions for 1536×698 pages (About, Water, Stats, Articles) ──
const IW = 1536, IH = 698;
const h = (x: number, y: number, w: number, ht: number): HotspotDef =>
  [x / IW, y / IH, w / IW, ht / IH];

export const NAV_698 = {
  about:    h(310, 155, 155, 105),
  natural:  h(468, 155, 160, 105),
  water:    h(630, 155, 160, 105),
  stats:    h(793, 155, 160, 105),
  contact:  h(956, 155, 160, 105),
  articles: h(560, 634, 220,  55),
  logout:   h(820, 634, 190,  55),
  home:     h( 80, 100, 210, 160),
};

// ── Shared nav for 1536×1024 pages (Natural Resources, Contact) ──
const IH2 = 1024;
const h2 = (x: number, y: number, w: number, ht: number): HotspotDef =>
  [x / IW, y / IH2, w / IW, ht / IH2];

export const NAV_1024 = {
  about:   h2(218, 148, 160, 105),
  natural: h2(380, 148, 162, 105),
  water:   h2(544, 148, 162, 105),
  stats:   h2(708, 148, 160, 105),
  contact: h2(870, 148, 162, 105),
};

interface NavProps {
  nav: typeof NAV_698;
  onHome: () => void;
  onAbout: () => void;
  onNatural: () => void;
  onWater: () => void;
  onStats: () => void;
  onContact: () => void;
  onArticles?: () => void;
  onLogout: () => void;
}

export function NavHotspots698({ nav, onHome, onAbout, onNatural, onWater, onStats, onContact, onArticles, onLogout }: NavProps) {
  return (
    <>
      <Hotspot def={nav.home}     onClick={onHome}     label="Home" />
      <Hotspot def={nav.about}    onClick={onAbout}    label="About Us" />
      <Hotspot def={nav.natural}  onClick={onNatural}  label="Natural Resources" />
      <Hotspot def={nav.water}    onClick={onWater}    label="Water Products" />
      <Hotspot def={nav.stats}    onClick={onStats}    label="Product Stats" />
      <Hotspot def={nav.contact}  onClick={onContact}  label="Contact Us" />
      {onArticles && <Hotspot def={nav.articles} onClick={onArticles} label="Articles" />}
      <Hotspot def={nav.logout}   onClick={onLogout}   label="Logout" />
    </>
  );
}
