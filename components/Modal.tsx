"use client";
import React from "react";

interface ModalProps {
  onClose?: () => void;
  children: React.ReactNode;
  /** If true, clicking the backdrop closes the modal */
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
      }}
    >
      <div onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/** Styled popup card used by explore / info dialogs */
export function PopupCard({
  children, width = 440, style,
}: { children: React.ReactNode; width?: number; style?: React.CSSProperties }) {
  return (
    <div style={{
      width, background: "#FAF0DC",
      borderRadius: 22, border: "2.5px solid #8B5E2F",
      padding: "28px 36px 22px",
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 10, ...style,
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
        color: "#fff", border: "none", borderRadius: 14,
        padding: "8px 28px", fontFamily: "sans-serif",
        fontWeight: 700, fontSize: 13, cursor: "pointer",
        transition: "background 0.15s", ...style,
      }}
    >
      {children}
    </button>
  );
}
