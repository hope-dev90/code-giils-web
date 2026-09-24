"use client";
import React, { useState } from "react";

interface Props {
  onClick?: () => void;
  href?: string;
}

export default function FloatingButton({ onClick }: Props) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      aria-label="Floating Action Button"
      style={{
        position: "fixed",
        right: 24,
        top: 120, // Lowered from 24 to 120 for better user accessibility
        zIndex: 500,
        width: 320, // Increased from 250 to 320 for even bigger size
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
        alt="Action Button"
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
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </button>
  );
}
