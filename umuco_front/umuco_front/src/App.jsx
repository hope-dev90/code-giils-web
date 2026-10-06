import React, { useState, useEffect, useCallback } from 'react';
import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import { LanguageProvider } from './contexts/Language';
import { AuthProvider, useAuth } from './contexts/AuthContext'; 
import DigitalArchive from "./components/landing/Archive";
import CommunityGuardian from "./components/landing/Community";
import Footer from "./components/landing/Footer";
import LoginPage from "./components/landing/LoginPage";
import SignUpPage from "./components/landing/AuthPage";
import Dashboard from "./components/dashboard/Dashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import QRScanner from "./components/landing/QRScanner";
import Discover from "./components/landing/Discover";
import { gihangaStory, STORY_LIBRARY as STORIES } from './data/stories';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState(() => {
    if (new URLSearchParams(window.location.search).get('auth') === 'google') {
      return localStorage.getItem('umuco_auth_redirect') || 'dashboard';
    }
    const recovery = new URLSearchParams(window.location.search).has('resetPassword') || window.location.hash.includes('type=recovery');
    return recovery ? 'login' : 'home';
  });
  const [activeSection, setActiveSection] = useState('Home'); 
  const [scannedStoryId, setScannedStoryId] = useState(gihangaStory.id);

  const navigateTo = useCallback((view, storyId) => {
    if (view === 'storyQuest' && storyId) setScannedStoryId(storyId);
    setCurrentView(view);
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('auth') !== 'google' || loading) return;
    localStorage.removeItem('umuco_auth_redirect');
    window.history.replaceState({}, '', window.location.pathname);
    navigateTo(user ? 'dashboard' : 'login');
  }, [loading, user, navigateTo]);

  const handleStoryScan = (rawValue) => {
    const story = STORIES.find(({ id }) => rawValue.includes(id));
    if (!story) return false;
    setScannedStoryId(story.id);
    navigateTo('storyQuest');
    return true;
  };

  useEffect(() => {
    if (currentView !== 'home') return;

    const sections = [
      { id: 'home-section', label: 'Home' },
      { id: 'scan-qr', label: 'Scan QR' },
      { id: 'archive', label: 'About' },
      { id: 'community', label: 'Community' }
    ];

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const matched = sections.find(sec => sec.id === entry.target.id);
          if (matched) {
            setActiveSection(matched.label);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (el) observer.unobserve(el);
      });
    };
  }, [currentView]);

  const renderView = () => {
    if (currentView === 'login') {
      return <LoginPage onNavigate={navigateTo} />;
    }

    if (currentView === 'signup') {
      return <SignUpPage onNavigate={navigateTo} />;
    }

    if (currentView === 'dashboard') {
      if (loading) return <div className="min-h-screen grid place-items-center bg-[#FDFBF7] text-[#8D493A]">Signing you in...</div>;
      if (user?.role === 'ADMIN') return <AdminDashboard onNavigate={navigateTo} />;
      return <Dashboard onNavigate={navigateTo} onLogout={() => navigateTo('home')} />;
    }

    if (currentView === 'admin') {
      if (loading) return <div className="min-h-screen grid place-items-center bg-[#FDFBF7] text-[#8D493A]">Loading…</div>;
      if (!user || user.role !== 'ADMIN') return navigateTo('home') ?? null;
      return <AdminDashboard onNavigate={navigateTo} />;
    }

    if (currentView === 'storyQuest') {
      return <Discover initialStoryId={scannedStoryId} onNavigate={navigateTo} />;
    }

    return (
        
      <div className="w-full min-h-screen bg-[#FDFBF7] antialiased scroll-smooth">
        <Navbar onNavigate={navigateTo} activeSection={activeSection} />
        
        <div id="home-section">
          <Hero onNavigate={navigateTo} />
        </div>
        <QRScanner onScan={handleStoryScan} />
        <div id="archive" className="scroll-mt-20">
          <DigitalArchive onNavigate={navigateTo} />
        </div>
        <div id="community" className="scroll-mt-20">
          <CommunityGuardian onNavigate={navigateTo} />
        </div>
        
        <Footer />
      </div>
    );
  };

  return (
      <LanguageProvider>
        {renderView()}
      </LanguageProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
