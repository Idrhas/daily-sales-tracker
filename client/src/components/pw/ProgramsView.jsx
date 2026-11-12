import React from 'react';
import { 
  Coffee, 
  Mic, 
  BookOpen, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { BRAND } from './data';

export default function ProgramsView({ onOpenVolunteer, setActiveTab }) {
  const corePrograms = [
    {
      id: "unwinds",
      title: "Unwind Sessions",
      badge: "Weekly Community Circle",
      icon: Coffee,
      color: "#F26B21",
      schedule: "Every Wednesday • 5:00 PM WAT",
      location: "PW Hub Kano & Partner Bookstores",
      audience: "Poets, writers, spoken word artists, listeners",
      description: "We host regular Unwind Sessions where poets and artists gather in relaxed, welcoming spaces to share their work, exchange ideas, and receive constructive peer feedback. These sessions are designed to encourage honest expression, build confidence, and foster meaningful connections within the creative community.",
      highlights: [
        "Peer-to-peer manuscript critique with empathy",
        "Safe haven for experimental verse and bilingual poetry",
        "Coffee, tea, and warm creative camaraderie"
      ]
    },
    {
      id: "open-mics",
      title: "Open Mics & Poet Interviews",
      badge: "Performance & Dialogue",
      icon: Mic,
      color: "#3a8a76",
      schedule: "Monthly Showcase • Last Friday",
      location: "Amphitheatre & Alliance Française Kano",
      audience: "All levels of experience & public audience",
      description: "Our poet interviews offer insight into the lives, processes, and inspirations of writers, while our open mic sessions create spaces for performance, experimentation, and discovery. Together, they nurture dialogue, confidence, and community across different levels of experience.",
      highlights: [
        "Live stage for first-time and seasoned performance poets",
        "In-depth spotlight interviews with guest master poets",
        "Recorded audio excerpts published to the Art Library"
      ]
    },
    {
      id: "workshops",
      title: "Creative Writing Workshops & Masterclasses",
      badge: "Skill-Building & Mentorship",
      icon: BookOpen,
      color: "#3d2308",
      schedule: "Bi-Monthly Intensive Series",
      location: "Hybrid (Physical Hub & Zoom)",
      audience: "Emerging authors, secondary & university students",
      description: "We organise learning sessions in the form of creative writing workshops and masterclasses, both online and offline. These sessions focus on skill-building, mentorship, and practical guidance, helping young writers deepen their craft and grow at every stage of their creative journey.",
      highlights: [
        "Intensive stanza craft, editing, and publishing guidance",
        "Mentorship pairings with established African authors",
        "Free participation sponsored through donor grants"
      ]
    }
  ];

  return (
    <div className="w-full bg-[#FAF8F5]">
      {/* Title Banner */}
      <section className="bg-[#171717] text-white py-14 border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs uppercase font-bold tracking-widest text-[#F26B21] block mb-2 font-sans">
              Spaces for Growth & Expression
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              PW Programs
            </h1>
            <p className="mt-3 font-serif italic text-lg sm:text-xl text-[#F5EBDD]">
              Nurturing literary craftsmanship through Unwinds, Open Mics, and masterclasses across Northern Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Main 3 Programs: Unwinds, Open Mics, Workshops (As specified in document) */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {corePrograms.map((prog, idx) => {
            const Icon = prog.icon;
            const isReversed = idx % 2 !== 0;

            return (
              <div
                key={prog.id}
                className="bg-white rounded-3xl border border-[#E0D3C1] overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 items-stretch ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* Info Box */}
                  <div className="lg:col-span-8 p-8 sm:p-12 space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F5EBDD] text-[#3d2308]">
                        {prog.badge}
                      </span>
                      <span className="text-xs font-sans text-stone-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#F26B21]" />
                        {prog.schedule}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FAF5EE] border border-[#E0D3C1] flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-[#F26B21]" />
                      </div>
                      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717]">
                        {prog.title}
                      </h2>
                    </div>

                    <p className="font-sans text-stone-700 text-base leading-relaxed">
                      {prog.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-[#EAE2D5]">
                      {prog.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 font-sans">
                          <CheckCircle className="w-4 h-4 text-[#3a8a76] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      <button
                        onClick={onOpenVolunteer}
                        className="px-5 py-2.5 rounded-lg bg-[#F26B21] hover:bg-[#D95F2B] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                      >
                        Participate or Facilitate
                      </button>
                      <span className="text-xs text-stone-500 font-sans flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        {prog.location}
                      </span>
                    </div>
                  </div>

                  {/* Aesthetic Side Panel */}
                  <div className="lg:col-span-4 bg-[#FAF5EE] border-t lg:border-t-0 lg:border-l border-[#E0D3C1] p-8 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#3d2308] block mb-2">
                        Target Participants
                      </span>
                      <h4 className="font-serif text-xl font-bold text-[#171717] mb-2">
                        Who is this for?
                      </h4>
                      <p className="text-xs text-stone-600 font-sans leading-relaxed">
                        {prog.audience}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-[#E0D3C1] mt-6">
                      <span className="text-[11px] font-bold text-[#F26B21] block">Free Community Access</span>
                      <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                        All regular sessions are free and open to ensure youth have unrestricted access to creative expression.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Special Program: NAFASI Partnership with Magamba Network */}
      <section className="py-16 bg-[#210c3b] text-white border-y border-[#3d186c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F26B21] text-white">
                <ShieldCheck className="w-3.5 h-3.5" /> Special Grant Program
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                NAFASI: Securing Digital Rights in Africa's Civic Space
              </h2>

              <p className="font-serif italic text-lg text-[#F5EBDD]">
                In partnership with Magamba Cultural Activist Network (Magamba)
              </p>

              <p className="font-sans text-stone-300 text-sm sm:text-base leading-relaxed">
                Poetic Wednesdays Initiative (PWI) is proud to execute the NAFASI program—a grant-backed initiative designed to build the capacity of African citizens, poets, writers, and community activists to safely navigate the digital space, protect their artistic rights, resist unlawful censorship, and drive positive civic change.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/10 border border-white/10">
                  <span className="block text-xs uppercase font-bold text-[#F26B21] mb-1">Focus 01</span>
                  <span className="font-serif text-base font-bold text-white">Digital Rights Awareness</span>
                </div>
                <div className="p-4 rounded-xl bg-white/10 border border-white/10">
                  <span className="block text-xs uppercase font-bold text-[#F26B21] mb-1">Focus 02</span>
                  <span className="font-serif text-base font-bold text-white">Capacity Building</span>
                </div>
                <div className="p-4 rounded-xl bg-white/10 border border-white/10">
                  <span className="block text-xs uppercase font-bold text-[#F26B21] mb-1">Focus 03</span>
                  <span className="font-serif text-base font-bold text-white">Civic Space Resilience</span>
                </div>
              </div>

              <div className="pt-2 text-xs text-stone-300 font-sans">
                <strong>Grant Duration:</strong> September 2026 – September 2027
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-sm rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
                <img
                  src="/nafasi-poster.jpg"
                  alt="NAFASI Program Poster"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Kano International Poetry Festival Crosslink */}
      <section className="py-16 bg-white border-t border-[#E6DCCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-[#3a8a76] block font-sans">
            Annual International Convergence
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717]">
            Kano International Poetry Festival (KAPFest)
          </h2>
          <p className="font-sans text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Our landmark annual festival uniting poets, oral historians, and literary critics from across the African continent and diaspora.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveTab('kapfest')}
              className="px-6 py-3 rounded-xl bg-[#171717] hover:bg-[#F26B21] text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              Explore KAPFest Portal <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
