"use client";
import React from "react";
import type { HotspotDef } from "@/lib/types";

interface HotspotProps {
  def: HotspotDef;
  onClick: () => void;
  label?: string;
  style?: React.CSSProperties;
}

/** A single transparent clickable region, positioned by fractions of parent size */
export function Hotspot({ def, onClick, label, style }: HotspotProps) {
  const [x, y, w, h] = def;
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={{
        position: "absolute",
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        width: `${w * 100}%`,
        height: `${h * 100}%`,
        background: "transparent",
        cursor: "pointer",
        zIndex: 10,
        ...style,
      }}
    />
  );
}

interface ImagePageProps {
  image: string;
  /** Natural pixel dimensions of the reference image (for aspect ratio) */
  iw: number;
  ih: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Full-viewport page that scales the background image to cover the screen
 * while keeping the hotspot coordinate system tied to the image dimensions.
 * Children are placed in an absolutely-positioned overlay that matches the
 * rendered image rectangle exactly.
 */
export function ImagePage({ image, iw, ih, children, style }: ImagePageProps) {
  const [rect, setRect] = React.useState({ left: 0, top: 0, width: 0, height: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function update() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const imgAr = iw / ih;
      const winAr = vw / vh;
      let w: number, h: number;
      if (winAr > imgAr) { w = vw; h = vw / imgAr; }
      else { h = vh; w = vh * imgAr; }
      setRect({ left: (vw - w) / 2, top: (vh - h) / 2, width: w, height: h });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [iw, ih]);

  return (
    <div ref={containerRef} style={{ position: "fixed", inset: 0, overflow: "hidden", ...style }}>
      {/* Background image */}
      <img
        src={image}
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
      {/* Hotspot overlay — same size/position as image */}
      <div
        style={{
          position: "absolute",
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        }}
      >
        {children}
      </div>
    </div>
  );
}
