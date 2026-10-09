"use client";
import React, { useState } from "react";

interface Props {
  onClick?: () => void;
}

export default function FloatingButton({ onClick }: Props) {
  const [hover, setHover] = useState(false);

  return (
    <button
      className="floating-btn"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      aria-label="Open Sanctuary Kit"
      style={{
        position: "fixed",
        right: 24,
        top: 120,
        zIndex: 500,
        width: "clamp(100px, 18vw, 320px)",
        height: "auto",
        cursor: "pointer",
        border: "none",
        background: "transparent",
        padding: 0,
        transform: hover ? "scale(1.08) translateY(-2px)" : "scale(1)",
        transition: "transform 0.22s ease, filter 0.22s ease",
        filter: hover
          ? "drop-shadow(0 10px 24px rgba(255,180,80,0.55)) drop-shadow(0 4px 10px rgba(0,0,0,0.35))"
          : "drop-shadow(0 6px 16px rgba(0,0,0,0.35))",
        animation: "floaty 3.2s ease-in-out infinite",
      }}
    >
      <img
        src="/button.png"
        alt="Sanctuary Kit"
        draggable={false}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
      <style>{`
        @keyframes floaty {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        /* keep the hover scale working alongside floaty */
        .floating-btn:hover { animation-play-state: paused; }
      `}</style>
    </button>
  );
}
