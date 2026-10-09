"use client";
import React from "react";

interface ModalProps {
  onClose?: () => void;
  children: React.ReactNode;
  closeOnBackdrop?: boolean;
}

export function Modal({ onClose, children, closeOnBackdrop = true }: ModalProps) {
  return (
    <div
      onClick={closeOnBackdrop && onClose ? onClose : undefined}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

export function PopupCard({
  children, width = 440, style,
}: { children: React.ReactNode; width?: number; style?: React.CSSProperties }) {
  return (
    <div style={{
      width: `min(${width}px, 92vw)`,
      background: "#FAF0DC",
      borderRadius: "clamp(14px, 3vw, 22px)",
      border: "2.5px solid #8B5E2F",
      padding: "clamp(16px, 4vw, 28px) clamp(14px, 4vw, 36px) clamp(14px, 3vw, 22px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "clamp(8px, 1.5vw, 12px)",
      ...style,
    }}>
      {children}
    </div>
  );
}

export function GreenButton({
  onClick, children, style,
}: { onClick: () => void; children: React.ReactNode; style?: React.CSSProperties }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "#3A6B1F" : "#2E5C18",
        color: "#fff", border: "none",
        borderRadius: "clamp(10px, 2vw, 14px)",
        padding: "clamp(8px, 1.5vw, 10px) clamp(18px, 3vw, 28px)",
        fontFamily: "sans-serif",
        fontWeight: 700,
        fontSize: "clamp(12px, 1.3vw, 14px)",
        cursor: "pointer",
        transition: "background 0.15s",
        minHeight: 40, // touch-friendly
        ...style,
      }}
    >
      {children}
    </button>
  );
}
