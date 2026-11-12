import React, { useState } from 'react';
import { 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  Volume2, 
  Share2, 
  Heart, 
  Calendar, 
  MapPin, 
  Feather, 
  ShieldCheck, 
  Users, 
  ExternalLink,
  Flame,
  CheckCircle2,
  Play,
  Pause
} from 'lucide-react';
import GallerySlideShow from './GallerySlideShow';
import { 
  BRAND, 
  POEM_OF_THE_DAY, 
  WORK_PILLARS, 
  ART_LIBRARY_ITEMS, 
  KALAMAI_DATA 
} from './data';

export default function HomeView({ 
  setActiveTab, 
  onOpenVolunteer, 
  onOpenDonate, 
  onSelectArticle, 
  onSelectImage 
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasCopiedPoem, setHasCopiedPoem] = useState(false);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    // simulated audio speech or speech synthesis
    if ('speechSynthesis' in window) {
      if (!isPlayingAudio) {
        window.speechSynthesis.cancel();
        const textToRead = `${POEM_OF_THE_DAY.title}, by ${POEM_OF_THE_DAY.poet}. ${POEM_OF_THE_DAY.stanzas.join(' ')}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handleSharePoem = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${POEM_OF_THE_DAY.title} by ${POEM_OF_THE_DAY.poet} - Poetic Wednesdays Initiative`);
      setHasCopiedPoem(true);
      setTimeout(() => setHasCopiedPoem(false), 3000);
    }
  };

  return (
    <div className="w-full">
      {/* Poetry Foundation Style Masthead Bar */}
      <div className="bg-[#FFFFFF] border-b border-[#EADBC8] py-2 px-4 text-xs font-serif text-[#3d2308]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-sans font-bold uppercase tracking-wider text-[10px] text-[#F26B21]">Literary Gazette</span>
            <span>•</span>
            <span className="italic">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>•</span>
            <span className="text-[#3a8a76] font-sans font-medium">Northern Nigeria Cultural Hub</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-sans">
            <span className="text-stone-500">Advocating for creative freedom & youth voice</span>
          </div>
        </div>
      </div>

      {/* Hero Section: Poetry Foundation Split (Featured Poem + NAFASI Partnership Spotlight) */}
      <section className="bg-[#FAF8F5] pt-10 pb-16 border-b border-[#E6DCCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left 7 Cols: Poem of the Day (Classical Editorial Format) */}
            <div className="lg:col-span-7 bg-[#FFFFFF] rounded-2xl p-6 sm:p-10 border border-[#E0D3C1] shadow-sm relative">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE2D5] mb-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#F26B21] flex items-center gap-1.5 font-sans">
                    <Feather className="w-3.5 h-3.5" /> Poem of the Week
                  </span>
                  <span className="text-xs text-stone-500 font-sans mt-0.5 block">
                    Curated from the Northern Literary Archive
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleAudio}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-sans transition-all cursor-pointer ${
                      isPlayingAudio 
                        ? 'bg-[#F26B21] text-white animate-pulse' 
                        : 'bg-[#F5EBDD] text-[#3d2308] hover:bg-[#EADBC8]'
                    }`}
                    title="Listen to Poem Reading"
                  >
                    {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#F26B21]" />}
                    <span>{isPlayingAudio ? 'Pause Reading' : 'Listen Spoken'}</span>
                  </button>

                  <button
                    onClick={handleSharePoem}
                    className="p-1.5 rounded-full bg-[#F5EBDD] hover:bg-[#EADBC8] text-[#3d2308] transition-colors cursor-pointer"
                    title="Share Poem"
                  >
                    <Share2 className="w-3.5 h-3.5 text-stone-700" />
                  </button>
                </div>
              </div>

              {hasCopiedPoem && (
                <div className="mb-4 text-xs font-sans bg-[#EBF5F2] text-[#3a8a76] p-2 rounded text-center border border-[#3a8a76]/30">
                  Poem citation copied to clipboard!
                </div>
              )}

              {/* Poem Header */}
              <div className="mb-6">
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight leading-tight">
                  {POEM_OF_THE_DAY.title}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#3d2308]">
                  <span className="font-serif italic font-semibold text-lg text-[#F26B21]">
                    By {POEM_OF_THE_DAY.poet}
                  </span>
                  <span className="text-stone-400">•</span>
                  <span className="text-xs font-sans text-stone-600">{POEM_OF_THE_DAY.poetRole}</span>
                </div>
                {POEM_OF_THE_DAY.epigraph && (
                  <p className="font-serif italic text-sm text-stone-600 mt-3 pl-3 border-l-2 border-[#D95F2B]">
                    {POEM_OF_THE_DAY.epigraph}
                  </p>
                )}
              </div>

              {/* Stanzas in rich literary typography */}
              <div className="poetry-verse space-y-4 text-lg text-[#171717] my-8 pl-1 sm:pl-3">
                {POEM_OF_THE_DAY.stanzas.map((line, idx) => (
                  <p key={idx} className={line === "" ? "h-3" : "leading-relaxed"}>
                    {line}
                  </p>
                ))}
              </div>

              {/* Curatorial Note */}
              <div className="pt-6 border-t border-[#EAE2D5] mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans text-stone-600">
                <div className="space-y-1">
                  <span className="font-bold text-[#171717] block">Context & Reflection</span>
                  <p className="text-stone-600 leading-normal max-w-lg">
                    {POEM_OF_THE_DAY.analysis}
                  </p>
                </div>
                <button
                  onClick={() => onSelectArticle(POEM_OF_THE_DAY)}
                  className="shrink-0 px-4 py-2 rounded-lg bg-[#171717] hover:bg-[#F26B21] text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Read Analysis
                </button>
              </div>
            </div>

            {/* Right 5 Cols: NAFASI Program Feature + Magamba Network Partnership */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Official Announcement Card featuring the actual user poster */}
              <div className="bg-[#FFFFFF] border-2 border-[#451a75]/20 rounded-2xl overflow-hidden shadow-md group hover:border-[#451a75] transition-all">
                <div className="relative overflow-hidden bg-[#240d42]">
                  <img
                    src="/nafasi-poster.jpg"
                    alt="NAFASI Program Announcement - Poetic Wednesdays Initiative"
                    className="w-full h-auto object-cover max-h-[380px] sm:max-h-[420px] transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute top-3 left-3 bg-[#451a75] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded shadow-md">
                    Pan-African Partnership
                  </div>
                </div>

                <div className="p-6 bg-[#FAF5EE]">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#451a75]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>In partnership with Magamba Cultural Activist Network</span>
                  </div>
                  
                  <h3 className="font-serif text-2xl font-bold text-[#171717] leading-snug">
                    NAFASI: Securing Digital Rights in Africa's Civic Space
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-stone-700 font-sans mt-2 leading-relaxed">
                    Building the capacity of African citizens, poets, and cultural activists to safely navigate digital space, protect their expression from censorship, and drive positive civic change.
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#E0D3C1] flex items-center justify-between text-xs font-sans">
                    <span className="font-semibold text-stone-800">
                      Grant: Sept 2026 – Sept 2027
                    </span>
                    <button
                      onClick={() => setActiveTab('programs')}
                      className="text-[#451a75] hover:text-[#F26B21] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      Read Program Details →
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Action Pillars */}
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setActiveTab('we-are-pw')}
                  className="bg-[#F5EBDD] p-4 rounded-xl border border-[#E0D3C1] hover:border-[#F26B21] transition-all cursor-pointer group"
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#3d2308] block mb-1">Our Origins</span>
                  <h4 className="font-serif text-lg font-bold text-[#171717] group-hover:text-[#F26B21] transition-colors">
                    A 10-Year Journey
                  </h4>
                  <p className="text-xs text-stone-600 font-sans mt-1">
                    From a Facebook hashtag to a registered national literary vanguard.
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('kapfest')}
                  className="bg-[#EBF5F2] p-4 rounded-xl border border-[#CDE5DE] hover:border-[#3a8a76] transition-all cursor-pointer group"
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#3a8a76] block mb-1">Flagship Event</span>
                  <h4 className="font-serif text-lg font-bold text-[#171717] group-hover:text-[#3a8a76] transition-colors">
                    KAPFest 2026
                  </h4>
                  <p className="text-xs text-stone-600 font-sans mt-1">
                    Kano International Poetry Festival connecting Africa & the globe.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* MID SECTION: Gallery Slide Show (as specified in document) */}
      <GallerySlideShow onSelectImage={onSelectImage} />

      {/* What Our Work Looks Like (The 6 Pillars from Document) */}
      <section className="py-20 bg-white border-b border-[#E6DCCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#F26B21] block mb-2 font-sans">
                Active Initiatives
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] tracking-tight">
                What Our Work Looks Like
              </h2>
            </div>
            <p className="text-sm font-sans text-stone-600 max-w-md leading-relaxed">
              Rooted in Northern Nigeria, we weave weekly grassroots gatherings with Pan-African advocacy, youth mentorship, and cultural festivals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WORK_PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className="bg-[#FAF8F5] border border-[#E0D3C1] rounded-2xl p-7 hover:shadow-xl hover:border-[#F26B21] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#F5EBDD] text-[#3d2308]">
                      {pillar.badge}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white border border-[#E0D3C1] flex items-center justify-center text-[#F26B21] group-hover:bg-[#F26B21] group-hover:text-white transition-colors">
                      <Sparkles className="w-4 h-4" />
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#171717] group-hover:text-[#F26B21] transition-colors mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-sans text-stone-700 leading-relaxed">
                    {pillar.shortDesc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#EAE2D5] flex items-center justify-between">
                  <button
                    onClick={() => setActiveTab(pillar.id === 'kapfest' ? 'kapfest' : 'programs')}
                    className="text-xs font-bold text-[#F26B21] group-hover:text-[#D95F2B] flex items-center gap-1 cursor-pointer"
                  >
                    Learn More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <span className="text-[11px] text-stone-400 font-sans">PW Program</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Kalamai Magazine Spotlight (Selar link + Cover) */}
      <section className="py-20 bg-[#FAF5EE] border-b border-[#E6DCCF] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#171717] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
            {/* Background artistic glow */}
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#F26B21]/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Magazine Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#F26B21] text-white uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5" /> Flagship Literary Journal
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                  Kalamai: {KALAMAI_DATA.currentIssue}
                </h2>

                <p className="font-serif italic text-lg text-[#F5EBDD]">
                  "{KALAMAI_DATA.tagline}"
                </p>

                <p className="text-sm text-stone-300 font-sans leading-relaxed">
                  {KALAMAI_DATA.description}
                </p>

                <div className="space-y-2 pt-2">
                  {KALAMAI_DATA.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-stone-200 font-sans">
                      <CheckCircle2 className="w-4 h-4 text-[#F26B21] shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 flex flex-wrap items-center gap-4">
                  <a
                    href={KALAMAI_DATA.selarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-[#F26B21] hover:bg-[#D95F2B] text-white font-bold text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <span>Get a Copy on Selar</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setActiveTab('kalamai')}
                    className="px-6 py-3.5 rounded-xl border border-white/30 text-white hover:bg-white hover:text-[#171717] font-semibold text-sm transition-all cursor-pointer"
                  >
                    Read Journal Details & Archive
                  </button>
                </div>
              </div>

              {/* Right Column: Magazine Cover Preview */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group max-w-sm">
                  <div className="absolute inset-0 bg-[#F26B21] rounded-2xl rotate-3 scale-95 opacity-60 group-hover:rotate-6 transition-all duration-300"></div>
                  <div className="relative bg-[#FAF5EE] p-3 rounded-2xl shadow-2xl border-4 border-[#333]">
                    <img
                      src={KALAMAI_DATA.coverImage}
                      alt="Kalamai Literary Journal Cover"
                      className="rounded-xl w-full h-[400px] object-cover"
                    />
                    <div className="p-3 text-center text-[#171717]">
                      <span className="font-serif text-lg font-bold block">{KALAMAI_DATA.currentIssue}</span>
                      <span className="text-xs text-[#3a8a76] font-bold font-sans">Order Digital & Print via Selar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Selected Works from Art Library */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-[#E6DCCF] mb-10 gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#3a8a76] block mb-1 font-sans">
                Curated Repository
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717]">
                From the Art Library
              </h2>
            </div>
            
            <button
              onClick={() => setActiveTab('art-library')}
              className="text-sm font-serif font-bold text-[#F26B21] hover:text-[#D95F2B] flex items-center gap-1.5 cursor-pointer"
            >
              Browse All Poems, Essays & Reports →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ART_LIBRARY_ITEMS.slice(0, 3).map((item) => (
              <article
                key={item.id}
                onClick={() => onSelectArticle(item)}
                className="bg-[#FAF8F5] border border-[#E0D3C1] rounded-2xl p-6 hover:border-[#F26B21] hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-3 font-sans">
                    <span className="px-2 py-0.5 rounded bg-[#F5EBDD] text-[#3d2308] font-semibold text-[10px] uppercase">
                      {item.category}
                    </span>
                    <span>{item.readingTime}</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#171717] group-hover:text-[#F26B21] transition-colors leading-snug mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-stone-600 font-sans line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[#EAE2D5] flex items-center justify-between text-xs font-sans text-stone-500">
                  <span>By {item.author}</span>
                  <span className="font-semibold text-[#F26B21]">Read Piece →</span>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* Community Callout & Policy Advocacy Banner */}
      <section className="bg-[#FAF5EE] py-16 border-t border-[#E6DCCF]">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#3a8a76] text-white">
            Policy & Legal Protections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] tracking-tight">
            Advocating for Creative Freedom in Northern Nigeria
          </h2>
          <p className="font-sans text-sm sm:text-base text-stone-700 leading-relaxed max-w-3xl mx-auto">
            Poetic Wednesdays actively engages education stakeholders, cultural institutions, and policymakers to champion funding for youth arts and enact legislation safeguarding young creatives from censorship and piracy.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('we-are-pw')}
              className="px-6 py-3 rounded-xl bg-[#171717] hover:bg-[#F26B21] text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Learn About Our Advocacy
            </button>
            <button
              onClick={onOpenVolunteer}
              className="px-6 py-3 rounded-xl bg-[#F5EBDD] border border-[#D5C7B4] hover:bg-[#EADBC8] text-[#3d2308] font-semibold text-sm transition-colors cursor-pointer"
            >
              Join the Advocacy Committee
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
