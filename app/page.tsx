"use client";
import React, { useState } from "react";
import HomePage from "@/components/pages/HomePage";
import AboutPage from "@/components/pages/AboutPage";
import NaturalPage from "@/components/pages/NaturalPage";
import ContactPage from "@/components/pages/ContactPage";
import DummyPage from "@/components/pages/DummyPage";
import SanctuaryPage from "@/components/pages/SanctuaryPage";
import ShowcasePage from "@/components/pages/ShowcasePage";
import FloatingButton from "@/components/FloatingButton";

type Page = "home" | "about" | "natural" | "water" | "stats" | "contact" | "articles" | "sanctuary" | "showcase";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const go = (p: Page) => () => setPage(p);

  const nav = {
    onHome:       go("home"),
    onAbout:      go("about"),
    onNatural:    go("natural"),
    onWater:      go("water"),
    onStats:      go("stats"),
    onContact:    go("contact"),
    onArticles:   go("articles"),
    onLogout:     go("home"),
    onSanctuary:  go("sanctuary"),
    onShowcase:   go("showcase"),
  };

  let content: React.ReactNode;
  switch (page) {
    case "home":     content = <HomePage {...nav} />; break;
    case "about":    content = <AboutPage {...nav} />; break;
    case "natural":  content = <NaturalPage {...nav} />; break;
    case "contact":  content = <ContactPage {...nav} />; break;
    case "water":
      content = <DummyPage image="/water-resources.webp" iw={1536} ih={698} title="Water Resources" {...nav} />;
      break;
    case "stats":
      content = <DummyPage image="/product-stats.webp" iw={1536} ih={698} title="Product Stats" {...nav} />;
      break;
    case "articles":
      content = <DummyPage image="/product-stats.webp" iw={1536} ih={698} title="Articles" {...nav} />;
      break;
    case "sanctuary":
      content = <SanctuaryPage {...nav} />;
      break;
    case "showcase":
      content = <ShowcasePage {...nav} />;
      break;
  }

  return (
    <>
      {content}
      <FloatingButton onClick={nav.onSanctuary} />
    </>
  );
}
