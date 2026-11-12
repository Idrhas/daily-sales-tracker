import React from 'react';
import { 
  Users, 
  Target, 
  Eye, 
  History, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Heart, 
  ArrowRight,
  BookOpen,
  Coffee,
  Feather,
  Mic,
  Globe,
  Handshake
} from 'lucide-react';
import { BRAND, WORK_PILLARS, TEAM_MEMBERS } from './data';

export default function WeArePwView({ onSelectMember, onOpenVolunteer, onOpenDonate, setActiveTab }) {
  const iconMap = {
    Coffee,
    Feather,
    BookOpen,
    Mic,
    Globe,
    Handshake
  };

  return (
    <div className="w-full bg-[#FAF8F5]">
      {/* Editorial Title Banner */}
      <section className="bg-[#171717] text-white py-16 border-b border-[#333] relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#F26B21]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="text-xs uppercase font-bold tracking-widest text-[#F26B21] block mb-3 font-sans">
              Identity & Journey
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              We Are Poetic Wednesdays
            </h1>
            <p className="mt-4 font-serif italic text-lg sm:text-xl text-[#F5EBDD] leading-relaxed">
              Rooted in Northern Nigeria, cultivating spaces where young minds think critically, create freely, and speak truth with beauty.
            </p>
          </div>
        </div>
      </section>

      {/* About Us & Advocacy Section (Verbatim from prompt) */}
      <section className="py-16 sm:py-20 border-b border-[#E6DCCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5EBDD] text-[#3d2308] border border-[#E0D3C1]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F26B21]" /> About Our Movement
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">
                About Us
              </h2>

              <p className="font-sans text-base sm:text-lg text-stone-800 leading-relaxed drop-cap">
                Poetic Wednesdays Initiative is a youth-focused literary organization promoting poetry, creative writing, cultural expression, and literacy among young people in Northern Nigeria. Poetic Wednesdays also engages with education stakeholders, cultural institutions, and policymakers to advocate for funding of youth arts programmes, and the recognition of literary organizations as essential contributors to community development and social cohesion. We are working towards having strong legislation that protects creatives from censorship and piracy of their works.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-sans text-[#3d2308]">
                <div className="flex items-center gap-2 bg-[#F5EBDD] px-3.5 py-2 rounded-lg border border-[#E0D3C1]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F26B21]"></span>
                  <span>Youth Literary Empowerment</span>
                </div>
                <div className="flex items-center gap-2 bg-[#EBF5F2] px-3.5 py-2 rounded-lg border border-[#CDE5DE] text-[#3a8a76] font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3a8a76]"></span>
                  <span>Legislative Protection Against Censorship</span>
                </div>
              </div>
            </div>

            {/* Mission & Vision Cards (Verbatim from prompt) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Mission */}
              <div className="bg-[#FFFFFF] border-2 border-[#F26B21]/40 rounded-2xl p-6 sm:p-8 shadow-sm hover:border-[#F26B21] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F26B21] text-white flex items-center justify-center shadow-sm">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Our Purpose</span>
                    <h3 className="font-serif text-2xl font-bold text-[#171717]">Our Mission</h3>
                  </div>
                </div>
                <p className="font-serif italic text-base sm:text-lg text-[#3d2308] leading-relaxed">
                  “Our Mission is to provide an inclusive creative platform where young people learn, connect, and grow through poetry, writing, mentorship, and community.”
                </p>
              </div>

              {/* Vision */}
              <div className="bg-[#FFFFFF] border-2 border-[#3a8a76]/40 rounded-2xl p-6 sm:p-8 shadow-sm hover:border-[#3a8a76] transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3a8a76] text-white flex items-center justify-center shadow-sm">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">Our Horizon</span>
                    <h3 className="font-serif text-2xl font-bold text-[#171717]">Our Vision</h3>
                  </div>
                </div>
                <p className="font-serif italic text-base sm:text-lg text-[#3d2308] leading-relaxed">
                  “Our Vision: A generation of young people empowered by literature and arts to think critically, create freely, and engage meaningfully with the world around them.”
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* How We Got Here: 10-Year Timeline (Verbatim from prompt) */}
      <section className="py-20 bg-[#FAF5EE] border-b border-[#E6DCCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-14">
            <span className="text-xs uppercase font-bold tracking-widest text-[#F26B21] block mb-2 font-sans">
              Origins & Growth
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] tracking-tight">
              How We Got Here
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-[#E0D3C1] shadow-sm space-y-6">
              <p className="font-sans text-base sm:text-lg text-stone-800 leading-relaxed">
                Poetic Wednesdays Initiative began ten years ago as a simple hashtag <strong className="text-[#F26B21] font-semibold">#PoeticWednesdays</strong> among friends on facebook, who wanted to express themselves through poetry, to enjoy art, express themselves freely, and be heard. What started as an intimate gathering grew, organically, into a vibrant literary community as more young people found resonance, connection, and possibility in those shared moments.
              </p>

              <p className="font-sans text-base sm:text-lg text-stone-800 leading-relaxed">
                Today, Poetic Wednesdays has evolved into a youth-focused literary initiative creating spaces for learning, creativity, and collaboration both online and offline. The initiative was formally registered in <strong>2020</strong> and is currently led by <strong className="text-[#171717] font-serif text-lg">Nasiba Babale</strong>, our Creative Director, alongside a growing team committed to nurturing young literary voices and building a culture where poetry and storytelling can thrive.
              </p>

              <div className="pt-4 border-t border-[#EAE2D5] flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#F26B21]">
                  <img
                    src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80"
                    alt="Nasiba Babale"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#171717]">Nasiba Babale</h4>
                  <p className="text-xs text-[#3a8a76] font-semibold uppercase tracking-wider font-sans">Creative Director & Founder</p>
                </div>
              </div>
            </div>

            {/* Visual Milestones */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E0D3C1] shadow-xs flex items-start gap-4">
                <span className="font-serif text-2xl font-bold text-[#F26B21] shrink-0">2014</span>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#171717]">The Facebook Spark</h4>
                  <p className="text-xs text-stone-600 font-sans mt-0.5">Friends sharing weekly stanzas under #PoeticWednesdays, hungering for genuine self-expression in Kano.</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E0D3C1] shadow-xs flex items-start gap-4">
                <span className="font-serif text-2xl font-bold text-[#3a8a76] shrink-0">2017</span>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#171717]">First Physical Unwind Sessions</h4>
                  <p className="text-xs text-stone-600 font-sans mt-0.5">Transitioning from screens to physical living rooms, courtyards, and cultural spaces across Northern Nigeria.</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E0D3C1] shadow-xs flex items-start gap-4">
                <span className="font-serif text-2xl font-bold text-[#3d2308] shrink-0">2020</span>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#171717]">Formal Registration & Institutional Voice</h4>
                  <p className="text-xs text-stone-600 font-sans mt-0.5">Official non-profit status, launch of policy advocacy against censorship, and establishment of Kalamai Journal.</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E0D3C1] shadow-xs flex items-start gap-4">
                <span className="font-serif text-2xl font-bold text-[#451a75] shrink-0">Today</span>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#171717]">KAPFest & NAFASI Pan-African Grant</h4>
                  <p className="text-xs text-stone-600 font-sans mt-0.5">Partnering with Magamba Network, mentoring thousands of young poets, and hosting the Kano International Poetry Festival.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* What Our Work Looks Like (Detailed text from prompt) */}
      <section className="py-20 bg-white border-b border-[#E6DCCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold tracking-widest text-[#F26B21] block mb-2 font-sans">
              Methodology & Programs
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] tracking-tight">
              What Our Work Looks Like
            </h2>
            <div className="w-16 h-1 bg-[#F26B21] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WORK_PILLARS.map((pillar) => {
              const Icon = iconMap[pillar.icon] || Sparkles;
              return (
                <div
                  key={pillar.id}
                  className="bg-[#FAF8F5] border border-[#E0D3C1] rounded-2xl p-7 flex flex-col justify-between hover:shadow-lg hover:border-[#F26B21] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-10 h-10 rounded-xl bg-[#F5EBDD] text-[#F26B21] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white text-stone-600 border border-stone-200">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-[#171717] mb-3">
                      {pillar.title}
                    </h3>

                    <p className="font-sans text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {pillar.fullDesc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#EAE2D5]">
                    <button
                      onClick={() => setActiveTab(pillar.id === 'kapfest' ? 'kapfest' : 'programs')}
                      className="text-xs font-bold text-[#F26B21] hover:text-[#D95F2B] flex items-center gap-1.5 cursor-pointer"
                    >
                      Explore Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Our Team Section (As specified in document) */}
      <section className="py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#3a8a76] block font-sans">
              Leadership & Community Stewards
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] tracking-tight">
              Our Team
            </h2>
            <p className="font-serif italic text-lg sm:text-xl text-[#3d2308] leading-relaxed">
              “We are held together by people whose hearts and soul recognise the importance of critically engaging with art”
            </p>
            <div className="w-16 h-1 bg-[#3a8a76] mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Group 1: Executive & Operational Team */}
          <div className="mb-16">
            <div className="flex items-center gap-3 pb-3 border-b border-[#E0D3C1] mb-8">
              <span className="w-3 h-3 rounded-full bg-[#F26B21]"></span>
              <h3 className="font-serif text-2xl font-bold text-[#171717]">
                Creative Direction & Executive Team
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM_MEMBERS.executive.map((member, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectMember(member)}
                  className="bg-white rounded-2xl p-5 border border-[#E0D3C1] hover:border-[#F26B21] hover:shadow-md transition-all cursor-pointer group text-center flex flex-col items-center justify-between"
                >
                  <div>
                    <div className="relative mb-4">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-stone-200 group-hover:border-[#F26B21] transition-colors"
                      />
                      {member.featured && (
                        <span className="absolute bottom-0 right-0 bg-[#F26B21] text-white p-1 rounded-full shadow-xs" title="Founder & Director">
                          <Sparkles className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-lg font-bold text-[#171717] group-hover:text-[#F26B21] transition-colors">
                      {member.name}
                    </h4>
                    <p className="text-xs text-[#3a8a76] font-semibold font-sans mt-0.5 uppercase tracking-wider">
                      {member.role}
                    </p>
                    <p className="text-xs text-stone-600 font-sans mt-2 line-clamp-2">
                      {member.bio}
                    </p>
                  </div>
                  <span className="mt-4 text-xs text-[#F26B21] font-bold group-hover:underline">
                    View Full Bio →
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Group 2: Our Board */}
          <div className="mb-16">
            <div className="flex items-center gap-3 pb-3 border-b border-[#E0D3C1] mb-8">
              <span className="w-3 h-3 rounded-full bg-[#171717]"></span>
              <h3 className="font-serif text-2xl font-bold text-[#171717]">
                Our Board of Trustees
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {TEAM_MEMBERS.board.map((member, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectMember(member)}
                  className="bg-white rounded-2xl p-6 border border-[#E0D3C1] hover:border-[#171717] hover:shadow-md transition-all cursor-pointer group text-center flex flex-col items-center justify-between"
                >
                  <div>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-stone-200 group-hover:border-[#171717] transition-colors mx-auto mb-4"
                    />
                    <h4 className="font-serif text-lg font-bold text-[#171717] group-hover:text-[#F26B21] transition-colors">
                      {member.name}
                    </h4>
                    <p className="text-xs text-stone-500 font-sans mt-0.5 font-medium">
                      {member.role}
                    </p>
                    <p className="text-xs text-stone-600 font-sans mt-3 line-clamp-3">
                      {member.bio}
                    </p>
                  </div>
                  <span className="mt-4 text-xs text-stone-800 font-bold group-hover:text-[#F26B21]">
                    Read Biography →
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Group 3: Youth Advisory */}
          <div>
            <div className="flex items-center gap-3 pb-3 border-b border-[#E0D3C1] mb-8">
              <span className="w-3 h-3 rounded-full bg-[#3a8a76]"></span>
              <h3 className="font-serif text-2xl font-bold text-[#171717]">
                Youth Advisory Council
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {TEAM_MEMBERS.youthAdvisory.map((member, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectMember(member)}
                  className="bg-white rounded-2xl p-6 border border-[#E0D3C1] hover:border-[#3a8a76] hover:shadow-md transition-all cursor-pointer group text-center flex flex-col items-center justify-between"
                >
                  <div>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-stone-200 group-hover:border-[#3a8a76] transition-colors mx-auto mb-4"
                    />
                    <h4 className="font-serif text-lg font-bold text-[#171717] group-hover:text-[#3a8a76] transition-colors">
                      {member.name}
                    </h4>
                    <p className="text-xs text-[#3a8a76] font-sans mt-0.5 font-semibold">
                      {member.role}
                    </p>
                    <p className="text-xs text-stone-600 font-sans mt-3 line-clamp-3">
                      {member.bio}
                    </p>
                  </div>
                  <span className="mt-4 text-xs text-[#3a8a76] font-bold group-hover:underline">
                    Read Biography →
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
