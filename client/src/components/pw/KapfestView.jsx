import React from 'react';
import { 
  Globe, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Users, 
  Music, 
  BookOpen, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { BRAND } from './data';

export default function KapfestView({ onSelectImage, onOpenVolunteer }) {
  const festivalHighlights = [
    {
      title: "Pan-African Poet Delegations",
      desc: "Bringing together performance poets, griots, and literary scholars from Nigeria, Ghana, Kenya, Niger, and the diaspora.",
      icon: Globe
    },
    {
      title: "Workshops & Stanza Clinics",
      desc: "Two full days of masterclasses on translation, manuscript development, and recording spoken word audio.",
      icon: BookOpen
    },
    {
      title: "Grand Evening Gala & Open Mics",
      desc: "Electrifying live stage with indigenous drumming, Hausa oral traditions, and contemporary slam poetry.",
      icon: Flame
    },
    {
      title: "Cultural Heritage Tours",
      desc: "Guided walks through ancient Kano City, Gidan Rumfa, and traditional dye pits connecting poetry to history.",
      icon: MapPin
    }
  ];

  return (
    <div className="w-full bg-[#FAF8F5]">
      {/* Editorial Banner */}
      <section className="bg-[#171717] text-white py-16 border-b border-[#333] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3a8a76]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#3a8a76] text-white mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Annual Flagship Festival
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Kano International Poetry Festival
            </h1>
            <p className="mt-3 font-serif italic text-2xl text-[#F26B21]">
              (KAPFest)
            </p>
            <p className="mt-4 font-sans text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              A celebration of literary exchange, oral heritage, and Pan-African creative dialogue hosted annually in the historic city of Kano.
            </p>

            <div className="pt-8 flex flex-wrap items-center gap-4">
              <a
                href={BRAND.kapfestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#F26B21] hover:bg-[#D95F2B] text-white font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Visit Official KAPFest Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <span className="text-xs font-mono text-stone-400">
                https://kapfest.org.ng/
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Overview & Mission */}
      <section className="py-16 sm:py-20 border-b border-[#E6DCCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-[#F26B21] block font-sans">
                Festival Purpose
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">
                Where Ancient Traditions Meet Contemporary Verse
              </h2>
              <p className="font-sans text-base sm:text-lg text-stone-800 leading-relaxed">
                We host the <strong>Kano International Poetry Festival (KAPFest)</strong> as a platform for literary exchange, celebration, and collaboration. The festival brings together poets, writers, and artists from diverse backgrounds to share work, ideas, and conversations that strengthen the literary ecosystem.
              </p>
              <p className="font-sans text-stone-700 leading-relaxed text-sm sm:text-base">
                Kano has for centuries served as an intellectual crossroads of trade, scholarship, and oral storytelling. KAPFest revitalizes this historic legacy by providing modern youth with a world-class festival platform.
              </p>

              <div className="p-4 rounded-2xl bg-[#F5EBDD] border border-[#E0D3C1] flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase text-[#3d2308] block">Next Edition Dates</span>
                  <span className="font-serif text-lg font-bold text-[#171717]">KAPFest 2026 • Kano, Nigeria</span>
                </div>
                <a
                  href={BRAND.kapfestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#171717] hover:bg-[#F26B21] text-white text-xs font-bold transition-colors shrink-0"
                >
                  Register as Attendee
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden border-4 border-white shadow-xl relative group">
                <img
                  src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"
                  alt="KAPFest Stage Performance"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 text-white">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#F26B21] block">Mainstage Showcase</span>
                    <h4 className="font-serif text-xl font-bold">KAPFest Poetry Gala</h4>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Festival Pillars Grid */}
      <section className="py-16 bg-white border-b border-[#E6DCCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="font-serif text-3xl font-bold text-[#171717]">
              What Makes KAPFest Special
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 font-sans mt-2">
              Four vibrant strands connecting emerging voices with African literary masters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {festivalHighlights.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E0D3C1] hover:border-[#F26B21] transition-all hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F5EBDD] text-[#F26B21] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#171717] mb-2">{feat.title}</h4>
                  <p className="text-xs text-stone-600 font-sans leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* External Portal Gateway */}
      <section className="py-16 bg-[#FAF5EE]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#3a8a76] text-white flex items-center justify-center mx-auto shadow-lg">
            <Globe className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717]">
            Visit the Dedicated KAPFest Portal
          </h2>
          <p className="text-stone-700 font-sans text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Find the full schedule, guest speaker lineups, hotel recommendations, and submission guidelines directly on the festival domain:
          </p>
          <div className="pt-2">
            <a
              href={BRAND.kapfestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#171717] hover:bg-[#F26B21] text-white font-bold text-sm transition-all shadow-md cursor-pointer"
            >
              <span>Go to https://kapfest.org.ng/</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
