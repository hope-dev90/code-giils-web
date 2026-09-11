"use client";
import { ImagePage, Hotspot } from "@/components/ImagePage";
import { NAV_1024 } from "@/components/NavHotspots";
import type { HotspotDef } from "@/lib/types";

const IW = 1536, IH = 1024;
const h = (x: number, y: number, w: number, ht: number): HotspotDef =>
  [x / IW, y / IH, w / IW, ht / IH];

const B_HOME:   HotspotDef = h( 20,   5, 200, 200);
const B_LOGOUT: HotspotDef = h(560, 855, 300,  60);
const B_SEND:   HotspotDef = h(700, 748, 240,  65);

interface Props {
  onHome: () => void; onAbout: () => void; onNatural: () => void;
  onWater: () => void; onStats: () => void; onContact: () => void;
  onArticles: () => void; onLogout: () => void;
}

function openMail() {
  const subject = encodeURIComponent("Enquiry from Code Hills 1001");
  const body    = encodeURIComponent("Hello UmucoCore team,\n\n");
  window.location.href = `mailto:info@umucocore.rw?subject=${subject}&body=${body}`;
}

export default function ContactPage({ onHome, onAbout, onNatural, onWater, onStats, onContact, onLogout }: Props) {
  return (
    <ImagePage image="/contact-us.png" iw={IW} ih={IH}>
      <Hotspot def={B_HOME}          onClick={onHome}    label="Home" />
      <Hotspot def={NAV_1024.about}  onClick={onAbout}   label="About Us" />
      <Hotspot def={NAV_1024.natural}onClick={onNatural} label="Natural Resources" />
      <Hotspot def={NAV_1024.water}  onClick={onWater}   label="Water Products" />
      <Hotspot def={NAV_1024.stats}  onClick={onStats}   label="Product Stats" />
      <Hotspot def={NAV_1024.contact}onClick={onContact} label="Contact Us" />
      <Hotspot def={B_LOGOUT}        onClick={onLogout}  label="Logout" />
      <Hotspot def={B_SEND}          onClick={openMail}  label="Send Message" />
    </ImagePage>
  );
}
