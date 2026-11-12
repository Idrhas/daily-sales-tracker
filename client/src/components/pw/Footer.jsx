import React from 'react';
import { 
  Heart, 
  MapPin, 
  Mail, 
  Phone, 
  ArrowUpRight, 
  MessageCircle, 
  Send, 
  BookOpen, 
  Users, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import { BRAND } from './data';

export default function Footer({ onOpenVolunteer, onOpenDonate, onOpenSubstack, setActiveTab }) {
  return (
    <footer className="bg-[#171717] text-[#FAF8F5] border-t-4 border-[#F26B21] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Banner: "Come chat with us!" */}
        <div className="bg-[#222222] border border-[#333333] rounded-2xl p-6 md:p-8 mb-16 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F26B21]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5EBDD] text-[#3d2308] mb-3">
                <MessageCircle className="w-3.5 h-3.5 text-[#F26B21]" /> Come chat with us!
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Have a poem to share, a partnership idea, or want to host a session?
              </h3>
              <p className="text-stone-300 text-sm mt-2 font-sans leading-relaxed">
                Our doors, open mics, and inboxes are always welcoming. Whether you are an aspiring young writer in Kano or a cultural organization looking to collaborate, let's connect.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${BRAND.email}`}
                className="px-5 py-3 rounded-lg bg-[#F26B21] hover:bg-[#D95F2B] text-white font-semibold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                Email Our Team
              </a>
              <button
                onClick={onOpenVolunteer}
                className="px-5 py-3 rounded-lg bg-[#3a8a76] hover:bg-[#286354] text-white font-semibold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                Volunteer With Us
              </button>
              <button
                onClick={onOpenDonate}
                className="px-5 py-3 rounded-lg border border-[#F5EBDD]/40 text-[#F5EBDD] hover:bg-white hover:text-[#171717] font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 text-[#F26B21] fill-current" />
                Donate to PW
              </button>
            </div>
          </div>
        </div>

        {/* 4-Column Grid: Initiative Story, Quick Navigation, Find Us on Substack, Visit / Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-[#333]">
          
          {/* Column 1: Organization & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F26B21] flex items-center justify-center text-white font-serif font-bold text-xl">
                PW
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-white leading-none">
                  Poetic Wednesdays
                </h4>
                <p className="text-xs text-[#F5EBDD]/70 font-sans mt-1">
                  Youth-Focused Literary Initiative
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              Promoting poetry, creative writing, cultural expression, and literacy among young people in Northern Nigeria. Working towards legislative protection for creatives against censorship and piracy.
            </p>
            <div className="pt-2 text-xs text-[#F26B21] font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3a8a76]" />
              Formally Registered 2020 • Est. 2014
            </div>
            <div className="text-xs text-stone-400">
              Creative Director: <span className="text-white font-serif font-semibold">{BRAND.creativeDirector}</span>
            </div>
          </div>

          {/* Column 2: Navigation (We are PW, Art Library, Programs, KAPFest, Gallery, Kalamai) */}
          <div className="space-y-3">
            <h5 className="font-serif text-base font-bold text-[#F5EBDD] tracking-wide uppercase text-xs border-b border-[#333] pb-2">
              Explore Poetic Wednesdays
            </h5>
            <ul className="space-y-2 text-sm text-stone-300 font-sans">
              <li>
                <button 
                  onClick={() => { setActiveTab('we-are-pw'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F26B21] transition-colors flex items-center justify-between w-full text-left py-0.5 cursor-pointer"
                >
                  <span>We are PW (About, Mission, Team)</span>
                  <span className="text-xs text-stone-500">→</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('art-library'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F26B21] transition-colors flex items-center justify-between w-full text-left py-0.5 cursor-pointer"
                >
                  <span>Art Library (Poems, Essays, Reports)</span>
                  <span className="text-xs text-stone-500">→</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('programs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F26B21] transition-colors flex items-center justify-between w-full text-left py-0.5 cursor-pointer"
                >
                  <span>Programs (Unwinds & Workshops)</span>
                  <span className="text-xs text-stone-500">→</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('kapfest'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F26B21] transition-colors flex items-center justify-between w-full text-left py-0.5 cursor-pointer"
                >
                  <span>KAPFest (Kano Poetry Festival)</span>
                  <span className="text-xs text-stone-500">→</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('gallery'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F26B21] transition-colors flex items-center justify-between w-full text-left py-0.5 cursor-pointer"
                >
                  <span>Gallery ("Stomachs full of art")</span>
                  <span className="text-xs text-stone-500">→</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('kalamai'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#F26B21] text-[#F26B21] font-semibold transition-colors flex items-center justify-between w-full text-left py-0.5 cursor-pointer"
                >
                  <span>Kalamai Literary Journal (Subscribe)</span>
                  <span className="text-xs bg-[#F26B21] text-white px-1.5 py-0.2 rounded text-[10px]">Buy</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Find us on Substack / Newsletter */}
          <div className="space-y-3">
            <h5 className="font-serif text-base font-bold text-[#F5EBDD] tracking-wide uppercase text-xs border-b border-[#333] pb-2">
              Find us on Substack
            </h5>
            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              Subscribe to read weekly dispatches, featured poems, calls for submission, and critical cultural commentaries straight to your inbox.
            </p>
            <div className="pt-2">
              <a
                href={BRAND.substackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F5EBDD] hover:bg-[#EADBC8] text-[#171717] rounded-lg text-xs font-bold transition-all shadow cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#F26B21]" />
                Subscribe on Substack
                <ArrowUpRight className="w-3.5 h-3.5 text-stone-600" />
              </a>
            </div>

            <div className="pt-4">
              <span className="block text-xs uppercase tracking-wider text-stone-400 font-bold mb-2">
                Social Media Handles
              </span>
              <div className="flex flex-wrap gap-2">
                <a
                  href={BRAND.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs rounded bg-[#262626] hover:bg-[#F26B21] hover:text-white transition-colors text-stone-300 font-medium"
                >
                  X / Twitter
                </a>
                <a
                  href={BRAND.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs rounded bg-[#262626] hover:bg-[#F26B21] hover:text-white transition-colors text-stone-300 font-medium"
                >
                  Instagram
                </a>
                <a
                  href={BRAND.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs rounded bg-[#262626] hover:bg-[#F26B21] hover:text-white transition-colors text-stone-300 font-medium"
                >
                  Facebook
                </a>
                <a
                  href={BRAND.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs rounded bg-[#262626] hover:bg-[#F26B21] hover:text-white transition-colors text-stone-300 font-medium"
                >
                  LinkedIn
                </a>
                <a
                  href={BRAND.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs rounded bg-[#262626] hover:bg-[#F26B21] hover:text-white transition-colors text-stone-300 font-medium"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Visit (Google Map Location) */}
          <div className="space-y-3">
            <h5 className="font-serif text-base font-bold text-[#F5EBDD] tracking-wide uppercase text-xs border-b border-[#333] pb-2">
              Visit Us (Google Map)
            </h5>
            <div className="p-3 bg-[#222222] border border-[#333] rounded-xl space-y-2">
              <div className="flex items-start gap-2 text-xs text-stone-300">
                <MapPin className="w-4 h-4 text-[#F26B21] shrink-0 mt-0.5" />
                <span>{BRAND.address}</span>
              </div>
              <div className="relative rounded-lg overflow-hidden border border-[#444] bg-[#111] h-28 group">
                {/* Visual map preview representation */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#F26B21_1px,transparent_1px)] [background-size:12px_12px]"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                  <div className="w-7 h-7 rounded-full bg-[#F26B21] text-white flex items-center justify-center shadow-lg animate-bounce mb-1">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-white">PW Kano Creative Hub</span>
                  <span className="text-[9px] text-[#F5EBDD]">Northern Nigeria</span>
                </div>
                <a
                  href={BRAND.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-white font-bold backdrop-blur-xs"
                >
                  Open in Google Maps <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <a
                href={BRAND.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs text-[#F26B21] hover:underline font-semibold pt-1 cursor-pointer"
              >
                View on Google Maps Location →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Brand Guidelines adherence & Quote */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400 font-sans">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} <strong className="text-stone-200">Poetic Wednesdays Initiative (PW)</strong>. All rights reserved. 
            <span className="hidden sm:inline"> Dedicated to poetry, youth literacy, and cultural expression in Northern Nigeria.</span>
          </p>
          <div className="flex items-center gap-4 text-xs font-serif italic text-[#F5EBDD]/80">
            <span>“{BRAND.quote}”</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
