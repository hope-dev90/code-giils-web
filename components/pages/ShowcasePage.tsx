"use client";
import React, { useState } from "react";
import { ImagePage, Hotspot } from "@/components/ImagePage";
import type { HotspotDef } from "@/lib/types";

const IW = 1536, IH = 1024;
const h = (x: number, y: number, w: number, ht: number): HotspotDef =>
  [x / IW, y / IH, w / IW, ht / IH];

// Product showcase hotspots - adjusted to match actual product positions
const PRODUCTS = [
  { 
    def: h(355, 280, 285, 480), // UmucoCore Bracelets - left card
    name: "UmucoCore Bracelets", 
    image: "/bracelet.png",
    id: "bracelet" 
  },
  { 
    def: h(665, 280, 285, 480), // UmucoCore Pens - center card
    name: "UmucoCore Pens", 
    image: "/penp.png",
    id: "pen" 
  },
  { 
    def: h(975, 280, 285, 480), // UmucoCore T-Shirt - right card
    name: "UmucoCore T-Shirt", 
    image: "/tt.png",
    id: "tshirt" 
  }
];

// Back button hotspot (bottom left)
const BACK_BTN = h(520, 770, 200, 60);

// Heritage link - we can add this as a clickable area on the header or create a separate button
const HERITAGE_HEADER = h(400, 50, 700, 180); // UmucoCore header area

interface ShowcasePageProps {
  onHome: () => void;
  onAbout: () => void;
  onNatural: () => void;
  onWater: () => void;
  onStats: () => void;
  onContact: () => void;
  onSanctuary: () => void;
  onShowcase: () => void;
  onArticles: () => void;
  onLogout: () => void;
}

export default function ShowcasePage({
  onHome, onAbout, onNatural, onWater, onStats, onContact, onSanctuary, onShowcase, onArticles, onLogout
}: ShowcasePageProps) {

  const [hoverProduct, setHoverProduct] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleProductClick = (productName: string) => {
    console.log(`${productName} clicked!`);
    alert(`${productName} selected! This will navigate to product details.`);
  };

  const handleHeritageClick = () => {
    console.log("Heritage header clicked!");
    // Open umucocore.rw in a new tab
    window.open("https://umucocore.rw", "_blank");
  };

  const handleBackClick = () => {
    console.log("Back button clicked!");
    // Navigate back to sanctuary page
    onSanctuary();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onMouseMove={handleMouseMove}>
      <ImagePage image="/showcase.webp" iw={IW} ih={IH}>
        {/* Product showcase hotspots with hover functionality */}
        {PRODUCTS.map((product, index) => (
          <div
            key={product.id}
            style={{
              position: "absolute",
              left: `${product.def[0] * 100}%`,
              top: `${product.def[1] * 100}%`,
              width: `${product.def[2] * 100}%`,
              height: `${product.def[3] * 100}%`,
              cursor: "pointer",
              zIndex: 10,
            }}
            onClick={() => handleProductClick(product.name)}
            onMouseEnter={() => setHoverProduct(product.id)}
            onMouseLeave={() => setHoverProduct(null)}
            title={product.name}
          />
        ))}

        {/* UmucoCore header - clickable area to visit heritage site */}
        <Hotspot 
          def={HERITAGE_HEADER} 
          onClick={handleHeritageClick} 
          label="Visit UmucoCore Heritage Site" 
        />

        {/* Back button */}
        <Hotspot 
          def={BACK_BTN} 
          onClick={handleBackClick} 
          label="Back to Sanctuary" 
        />

        {/* Hover pop-up images */}
        {hoverProduct && (
          (() => {
            const product = PRODUCTS.find(p => p.id === hoverProduct);
            if (!product || !product.image) return null;
            
            return (
              <div
                style={{
                  position: "fixed",
                  left: mousePos.x + 20,
                  top: mousePos.y - 100,
                  zIndex: 1000,
                  pointerEvents: "none",
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "2px solid #8B4513",
                  borderRadius: "12px",
                  padding: "8px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                  transform: "scale(1)",
                  animation: "popIn 0.2s ease-out",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "200px",
                    height: "auto",
                    display: "block",
                    borderRadius: "8px",
                  }}
                />
                <p style={{
                  margin: "8px 0 4px 0",
                  textAlign: "center",
                  fontFamily: "sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#2A1A04",
                }}>
                  {product.name}
                </p>
              </div>
            );
          })()
        )}

        {/* CSS for pop-in animation */}
        <style jsx>{`
          @keyframes popIn {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </ImagePage>
    </div>
  );
}
