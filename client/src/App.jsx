import React, { useState, useEffect } from 'react';
import Navbar from './components/pw/Navbar';
import Footer from './components/pw/Footer';
import HomeView from './components/pw/HomeView';
import WeArePwView from './components/pw/WeArePwView';
import ArtLibraryView from './components/pw/ArtLibraryView';
import ProgramsView from './components/pw/ProgramsView';
import KapfestView from './components/pw/KapfestView';
import GalleryView from './components/pw/GalleryView';
import KalamaiView from './components/pw/KalamaiView';
import { 
  VolunteerModal, 
  DonateModal, 
  ReaderModal, 
  LightboxModal, 
  SearchModal, 
  BioModal 
} from './components/pw/Modals';

export default function App() {
  // Navigation tab state (defaults to 'home')
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (['we-are-pw', 'art-library', 'programs', 'kapfest', 'gallery', 'kalamai'].includes(hash)) {
      return hash;
    }
    return 'home';
  });

  // Modals state
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);
  const [activeBioMember, setActiveBioMember] = useState(null);

  // Sync hash with activeTab
  useEffect(() => {
    if (activeTab === 'home') {
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
      }
    } else {
      window.location.hash = activeTab;
    }
  }, [activeTab]);

  // Listen to browser hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['we-are-pw', 'art-library', 'programs', 'kapfest', 'gallery', 'kalamai', 'home'].includes(hash)) {
        setActiveTab(hash);
      } else if (!hash) {
        setActiveTab('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Keyboard shortcut for search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171717]">
      {/* Masthead & Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenDonate={() => setIsDonateOpen(true)}
        onOpenVolunteer={() => setIsVolunteerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            setActiveTab={setActiveTab}
            onOpenVolunteer={() => setIsVolunteerOpen(true)}
            onOpenDonate={() => setIsDonateOpen(true)}
            onSelectArticle={(article) => setActiveArticle(article)}
            onSelectImage={(img) => setActiveLightboxImage(img)}
          />
        )}

        {activeTab === 'we-are-pw' && (
          <WeArePwView
            setActiveTab={setActiveTab}
            onSelectMember={(member) => setActiveBioMember(member)}
            onOpenVolunteer={() => setIsVolunteerOpen(true)}
            onOpenDonate={() => setIsDonateOpen(true)}
          />
        )}

        {activeTab === 'art-library' && (
          <ArtLibraryView
            setActiveTab={setActiveTab}
            onSelectArticle={(article) => setActiveArticle(article)}
          />
        )}

        {activeTab === 'programs' && (
          <ProgramsView
            setActiveTab={setActiveTab}
            onOpenVolunteer={() => setIsVolunteerOpen(true)}
          />
        )}

        {activeTab === 'kapfest' && (
          <KapfestView
            setActiveTab={setActiveTab}
            onSelectImage={(img) => setActiveLightboxImage(img)}
            onOpenVolunteer={() => setIsVolunteerOpen(true)}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryView
            onSelectImage={(img) => setActiveLightboxImage(img)}
          />
        )}

        {activeTab === 'kalamai' && (
          <KalamaiView
            onOpenSubstack={() => window.open('https://poeticwednesdays.substack.com', '_blank')}
          />
        )}
      </main>

      {/* Comprehensive Foot Section on every page */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenVolunteer={() => setIsVolunteerOpen(true)}
        onOpenDonate={() => setIsDonateOpen(true)}
        onOpenSubstack={() => window.open('https://poeticwednesdays.substack.com', '_blank')}
      />

      {/* Interactive Modals */}
      <VolunteerModal
        isOpen={isVolunteerOpen}
        onClose={() => setIsVolunteerOpen(false)}
      />

      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectItem={(item) => setActiveArticle(item)}
      />

      <ReaderModal
        item={activeArticle}
        onClose={() => setActiveArticle(null)}
      />

      <LightboxModal
        item={activeLightboxImage}
        onClose={() => setActiveLightboxImage(null)}
      />

      <BioModal
        member={activeBioMember}
        onClose={() => setActiveBioMember(null)}
      />
    </div>
  );
}
