import React, { useState } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Send, 
  Flame, 
  ShoppingBag,
  Award,
  Feather
} from 'lucide-react';
import { KALAMAI_DATA, BRAND } from './data';

export default function KalamaiView({ onOpenSubstack }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5]">
      {/* Title Banner */}
      <section className="bg-[#171717] text-white py-16 border-b border-[#333] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F26B21]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F26B21] text-white mb-3">
              <Flame className="w-3.5 h-3.5" /> Flagship Literary Journal
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Kalamai
            </h1>
            <p className="mt-3 font-serif italic text-xl sm:text-2xl text-[#F5EBDD]">
              “The Premier Literary Journal of Northern Nigeria”
            </p>
            <p className="mt-4 font-sans text-stone-300 text-base sm:text-lg leading-relaxed">
              Curating boundary-pushing poetry, cultural essays, visual arts, and bilingual translations. Get your print or digital copy now via Selar.
            </p>

            <div className="pt-8 flex flex-wrap items-center gap-4">
              <a
                href={KALAMAI_DATA.selarLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-[#F26B21] hover:bg-[#D95F2B] text-white font-bold text-sm transition-all shadow-xl flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Get a Copy of Kalamai on Selar</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <span className="text-xs text-[#F5EBDD]/80 font-sans">
                Available in Print & Instant PDF Download
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Showcase (Cover Photo + Selar details) */}
      <section className="py-16 sm:py-20 border-b border-[#E6DCCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Cover Photo Presentation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-sm w-full">
                <div className="absolute inset-0 bg-[#F26B21] rounded-2xl rotate-2 opacity-50 blur-xs group-hover:rotate-4 transition-all"></div>
                <div className="relative bg-white p-4 rounded-2xl shadow-2xl border-2 border-[#E0D3C1]">
                  <img
                    src={KALAMAI_DATA.coverImage}
                    alt="Kalamai Journal Cover"
                    className="w-full h-[460px] object-cover rounded-xl shadow-inner"
                  />
                  <div className="pt-4 text-center">
                    <span className="text-xs uppercase tracking-wider font-bold text-[#F26B21] block">
                      Current Issue
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#171717]">
                      {KALAMAI_DATA.currentIssue}
                    </h3>
                    <p className="text-xs text-stone-500 font-sans mt-1">
                      Poetic Wednesdays Press • Kano, Nigeria
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content & Ordering Info */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-[#3a8a76] block font-sans">
                About the Publication
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">
                Get a Copy of Kalamai
              </h2>
              
              <p className="font-sans text-base sm:text-lg text-stone-800 leading-relaxed">
                {KALAMAI_DATA.description}
              </p>

              <div className="bg-[#FAF5EE] rounded-2xl p-6 border border-[#E0D3C1] space-y-3">
                <h4 className="font-serif text-lg font-bold text-[#171717]">
                  What's Inside Volume 3:
                </h4>
                <div className="space-y-2">
                  {KALAMAI_DATA.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 font-sans">
                      <CheckCircle2 className="w-4 h-4 text-[#F26B21] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl border-2 border-[#F26B21]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-stone-500 block">Direct Store Link</span>
                  <span className="font-serif text-2xl font-bold text-[#171717]">{KALAMAI_DATA.price}</span>
                </div>
                <a
                  href={KALAMAI_DATA.selarLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#F26B21] hover:bg-[#D95F2B] text-white font-bold text-sm text-center transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Order on Selar Now</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Subscribe to Literary Dispatches & Future Issues */}
      <section className="py-16 bg-[#F5EBDD] border-b border-[#E6DCCF]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#3d2308] text-[#F5EBDD]">
            Subscriber Circle
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#171717]">
            Subscribe to Kalamai Updates & Substack
          </h2>
          <p className="font-sans text-sm sm:text-base text-stone-700 max-w-xl mx-auto leading-relaxed">
            Never miss an open call for submissions, editorial release, or free preview chapter from Kalamai Press.
          </p>

          {subscribed ? (
            <div className="p-4 bg-white rounded-xl border border-[#3a8a76] text-[#3a8a76] text-sm font-semibold max-w-md mx-auto">
              ✓ Thank you for subscribing! Check your email to confirm your Kalamai literary digest.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                required
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl border border-[#D5C7B4] bg-white focus:outline-hidden focus:border-[#F26B21]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#F26B21] hover:bg-[#D95F2B] text-white font-bold text-sm whitespace-nowrap shadow-sm transition-colors cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Archive / Past Issues */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="font-serif text-3xl font-bold text-[#171717]">
              Previous Anthologies
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 font-sans mt-1">
              Explore earlier editions of Kalamai and commemorative issues.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {KALAMAI_DATA.pastIssues.map((issue, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] border border-[#E0D3C1] rounded-2xl p-6 flex items-center gap-5 hover:border-[#F26B21] transition-all"
              >
                <img
                  src={issue.cover}
                  alt={issue.title}
                  className="w-24 h-32 object-cover rounded-lg shadow-sm"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F26B21]">Year {issue.year}</span>
                  <h4 className="font-serif text-xl font-bold text-[#171717]">{issue.title}</h4>
                  <p className="text-xs text-stone-600 font-sans">{issue.status}</p>
                  <a
                    href={KALAMAI_DATA.selarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-bold text-[#3a8a76] hover:underline pt-2"
                  >
                    View on Selar →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
