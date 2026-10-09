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
        /* Prevent iOS callout / text selection on long press */
        WebkitTapHighlightColor: "transparent",
        WebkitTouchCallout: "none",
        touchAction: "manipulation",
        ...style,
      }}
    />
  );
}

interface ImagePageProps {
  image: string;
  iw: number;
  ih: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Full-viewport page that keeps the hotspot coordinate system tied to the
 * image dimensions. Portrait screens use `contain` so controls stay visible;
 * wider screens retain the original cover presentation.
 */
export function ImagePage({ image, iw, ih, children, style }: ImagePageProps) {
  const [rect, setRect] = React.useState({ left: 0, top: 0, width: 0, height: 0 });

  React.useEffect(() => {
    function update() {
      const vw = window.innerWidth;
      const vh = window.visualViewport?.height ?? window.innerHeight;
      const imgAr = iw / ih;
      const winAr = vw / vh;
      let w: number, h: number;
      if (winAr < 1) {
        if (winAr > imgAr) { w = vh * imgAr; h = vh; }
        else { w = vw; h = vw / imgAr; }
      } else if (winAr > imgAr) { w = vw; h = vw / imgAr; }
      else { h = vh; w = vh * imgAr; }
      setRect({ left: (vw - w) / 2, top: (vh - h) / 2, width: w, height: h });
    }
    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    // Also re-run on orientation change (mobile)
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [iw, ih]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, overflow: "hidden",
        /* Prevent pull-to-refresh and scroll bounce on mobile */
        touchAction: "none",
        userSelect: "none",
        ...style,
      }}
    >
      {/* Background image */}
      <img
        src={image}
        alt=""
        draggable={false}
        fetchPriority="high"
        decoding="async"
        style={{
          position: "absolute",
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          userSelect: "none",
          pointerEvents: "none",
          // Improve rendering sharpness on hi-dpi displays
          imageRendering: "auto",
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
