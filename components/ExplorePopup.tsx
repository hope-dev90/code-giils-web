"use client";
import React from "react";
import { Modal, PopupCard, GreenButton } from "./Modal";

interface Props {
  productName: string;
  onClose: () => void;
}

export function ExplorePopup({ productName, onClose }: Props) {
  return (
    <Modal onClose={onClose}>
      <PopupCard width={420}>
        <p style={{ fontFamily: "serif", fontWeight: 700, fontSize: "clamp(14px,1.5vw,17px)", color: "#3A2005", textAlign: "center" }}>
          {productName}
        </p>
        <p style={{ fontFamily: "sans-serif", fontSize: "clamp(12px,1.2vw,14px)", color: "#5A3A10" }}>For more, visit</p>
        <a
          href="https://umucocore.rw"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: "clamp(13px,1.3vw,15px)", color: "#1A5C0F", cursor: "pointer" }}
        >
          UmucoCore →
        </a>
        <GreenButton onClick={onClose} style={{ marginTop: 6 }}>OK</GreenButton>
      </PopupCard>
    </Modal>
  );
}
