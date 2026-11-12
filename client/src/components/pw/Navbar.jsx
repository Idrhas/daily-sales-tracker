import React, { useState } from 'react';
import { Search, Menu, X, BookOpen, ExternalLink, Sparkles, Heart } from 'lucide-react';
import { BRAND } from './data';

export default function Navbar({ activeTab, setActiveTab, onOpenSearch, onOpenDonate, onOpenVolunteer }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'we-are-pw', label: 'We are PW' },
    { id: 'art-library', label: 'Art Library' },
    { id: 'programs', label: 'Programs' },
    { id: 'kapfest', label: 'KAPFest' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'kalamai', label: 'Kalamai (subscribe)', isCta: true },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full bg-[#FFFFFF] border-b border-pw-cream-dark sticky top-0 z-40 shadow-xs">
      {/* Top Ticker / Announcement Bar */}
      <div className="bg-[#171717] text-[#F5EBDD] text-xs py-2 px-4 border-b border-[#333]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="bg-[#F26B21] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Program Announcement
            </span>
            <span className="text-stone-300">
              <strong className="text-white">NAFASI:</strong> Securing digital rights & strengthening civic space with Magamba Network
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button 
              onClick={() => handleNavClick('programs')}
              className="hover:text-[#F26B21] text-stone-300 transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              Explore Grant <ExternalLink className="w-3 h-3" />
            </button>
            <span className="text-stone-600 hidden md:inline">|</span>
            <button
              onClick={onOpenDonate}
              className="text-[#F26B21] hover:text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Heart className="w-3 h-3 fill-current" /> Donate
            </button>
          </div>
        </div>
      </div>

      {/* Main Masthead Header (Poetry Foundation style: Initiative text to Left, Logo to Right) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex items-center justify-between">
        {/* Left: Poetic Wednesdays Initiative + subtext */}
        <div 
          onClick={() => handleNavClick('home')}
          className="cursor-pointer group select-none text-left"
        >
          <div className="flex items-baseline gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#171717] group-hover:text-[#F26B21] transition-colors leading-tight">
              Poetic Wednesdays Initiative
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-sans tracking-wide text-[#3d2308] mt-1 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F26B21] inline-block animate-pulse"></span>
            Poetry, Arts, Culture & Youth Literacy
          </p>
        </div>

        {/* Right: Authentic PW Logo Emblem */}
        <div className="flex items-center gap-4">
          <div 
            onClick={() => handleNavClick('home')} 
            className="cursor-pointer flex items-center gap-3 group"
            title="Poetic Wednesdays Initiative"
          >
            <div className="hidden lg:block text-right">
              <span className="block text-[11px] uppercase tracking-widest text-stone-500 font-bold">Est. 2014 • Reg. 2020</span>
              <span className="text-xs font-serif italic text-[#3a8a76]">Northern Nigeria</span>
            </div>
            
            {/* Custom Brand Logo SVG reflecting interlocking letters and literary flame */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#F5EBDD] border-2 border-[#171717] p-1 flex items-center justify-center shadow-sm group-hover:border-[#F26B21] transition-all">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background decorative curve */}
                <path d="M15 80C35 85 65 75 85 85" stroke="#3a8a76" strokeWidth="3" strokeLinecap="round" />
                {/* Interlocking P and W letterforms with artistic ink flow */}
                <path d="M28 22V78M28 22H50C58 22 62 28 62 36C62 44 58 50 50 50H28" stroke="#171717" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M46 44L56 78L68 52L80 78L90 44" stroke="#F26B21" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="28" cy="22" r="5" fill="#F26B21" />
              </svg>
            </div>
          </div>

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#171717] hover:text-[#F26B21] hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Primary Navigation Bar (L - R: We are PW, Art Library, Programs, KAPFest, Gallery, Kalamai(subscribe)) */}
      <nav className="border-t border-[#EAE2D5] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3 overflow-x-auto py-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 text-sm font-serif font-semibold tracking-wide transition-all rounded-md cursor-pointer ${
                activeTab === 'home'
                  ? 'text-[#F26B21] bg-[#F5EBDD] font-bold shadow-2xs'
                  : 'text-[#171717] hover:text-[#F26B21] hover:bg-stone-100'
              }`}
            >
              Home
            </button>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              if (item.isCta) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`ml-2 px-3.5 py-1.5 text-xs uppercase tracking-wider font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      isActive
                        ? 'bg-[#171717] text-[#FAF5EE] ring-2 ring-[#F26B21]'
                        : 'bg-[#F26B21] hover:bg-[#D95F2B] text-white hover:shadow-sm'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 text-sm font-serif font-medium tracking-wide transition-all rounded-md cursor-pointer ${
                    isActive
                      ? 'text-[#F26B21] bg-[#F5EBDD] font-bold shadow-2xs'
                      : 'text-[#171717] hover:text-[#F26B21] hover:bg-[#F5EBDD]/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Quick Search & Volunteer Triggers */}
          <div className="hidden md:flex items-center gap-3 py-2">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#3d2308] bg-[#F5EBDD] hover:bg-[#EADBC8] border border-[#E0D3C1] rounded-md transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#F26B21]" />
              <span>Search Library & Poets...</span>
              <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] bg-white rounded text-stone-500 border border-stone-200">⌘K</kbd>
            </button>
            <button
              onClick={onOpenVolunteer}
              className="text-xs font-semibold text-[#3a8a76] hover:text-[#286354] hover:underline cursor-pointer"
            >
              Volunteer
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#EAE2D5] bg-[#FFFFFF] px-4 pt-3 pb-6 space-y-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left px-3 py-2.5 rounded font-serif text-base ${
                activeTab === 'home' ? 'bg-[#F5EBDD] text-[#F26B21] font-bold' : 'text-[#171717]'
              }`}
            >
              Home
            </button>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded font-serif text-base flex items-center justify-between ${
                  activeTab === item.id
                    ? 'bg-[#F5EBDD] text-[#F26B21] font-bold'
                    : 'text-[#171717] hover:bg-stone-50'
                } ${item.isCta ? 'text-[#F26B21] font-semibold' : ''}`}
              >
                <span>{item.label}</span>
                {item.isCta && <span className="text-[10px] bg-[#F26B21] text-white px-2 py-0.5 rounded font-sans uppercase">Get Copy</span>}
              </button>
            ))}
            <div className="pt-4 border-t border-stone-200 flex flex-col gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenSearch(); }}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm bg-[#F5EBDD] text-[#171717] rounded-md font-medium"
              >
                <Search className="w-4 h-4 text-[#F26B21]" /> Search Poems & Articles
              </button>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenVolunteer(); }}
                  className="py-2 text-xs font-bold text-center border border-[#3a8a76] text-[#3a8a76] rounded"
                >
                  Volunteer With Us
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenDonate(); }}
                  className="py-2 text-xs font-bold text-center bg-[#F26B21] text-white rounded"
                >
                  Donate to PW
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
