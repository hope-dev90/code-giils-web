"use client";
import React, { useState } from "react";
import HomePage from "@/components/pages/HomePage";
import AboutPage from "@/components/pages/AboutPage";
import NaturalPage from "@/components/pages/NaturalPage";
import ContactPage from "@/components/pages/ContactPage";
import DummyPage from "@/components/pages/DummyPage";

type Page = "home" | "about" | "natural" | "water" | "stats" | "contact" | "articles";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const go = (p: Page) => () => setPage(p);

  const nav = {
    onHome:     go("home"),
    onAbout:    go("about"),
    onNatural:  go("natural"),
    onWater:    go("water"),
    onStats:    go("stats"),
    onContact:  go("contact"),
    onArticles: go("articles"),
    onLogout:   go("home"),
  };

  switch (page) {
    case "home":     return <HomePage {...nav} />;
    case "about":    return <AboutPage {...nav} />;
    case "natural":  return <NaturalPage {...nav} />;
    case "contact":  return <ContactPage {...nav} />;
    case "water":
      return <DummyPage image="/water-resources.png" iw={1536} ih={698} title="Water Resources" {...nav} />;
    case "stats":
      return <DummyPage image="/product-stats.png" iw={1536} ih={698} title="Product Stats" {...nav} />;
    case "articles":
      return <DummyPage image="/product-stats.png" iw={1536} ih={698} title="Articles" {...nav} />;
  }
}
