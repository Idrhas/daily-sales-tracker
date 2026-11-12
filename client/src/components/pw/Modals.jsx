import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Send, 
  Users, 
  Sparkles, 
  BookOpen, 
  Search, 
  CheckCircle, 
  Copy, 
  ExternalLink,
  MapPin,
  Calendar,
  Volume2
} from 'lucide-react';
import { BRAND, ART_LIBRARY_ITEMS, WORK_PILLARS, POEM_OF_THE_DAY } from './data';

// 1. Volunteer Modal
export function VolunteerModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    interests: 'Unwind Sessions Facilitator',
    location: '',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // reset after feedback
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAF8F5] border border-[#E0D3C1] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="bg-[#171717] text-white p-6 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#F26B21]">Community Movement</span>
            <h3 className="font-serif text-2xl font-bold mt-1">Volunteer with PW</h3>
            <p className="text-xs text-stone-300 mt-1 font-sans">
              Lend your voice, skills, or venue to nurture young creative voices in Northern Nigeria.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#3a8a76]/10 text-[#3a8a76] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-[#171717]">Thank you for stepping forward!</h4>
            <p className="text-sm text-stone-600 font-sans">
              Our community team has received your application. We will reach out shortly to welcome you to our next volunteer onboarding circle.
            </p>
            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="mt-4 px-6 py-2.5 rounded-lg bg-[#F26B21] text-white font-semibold text-sm hover:bg-[#D95F2B] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3d2308] mb-1">
                Full Name *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Amina Mohammed"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#D5C7B4] focus:outline-hidden focus:border-[#F26B21] bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3d2308] mb-1">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  placeholder="amina@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#D5C7B4] focus:outline-hidden focus:border-[#F26B21] bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3d2308] mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="+234..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#D5C7B4] focus:outline-hidden focus:border-[#F26B21] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3d2308] mb-1">
                Area of Interest / Role
              </label>
              <select
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#D5C7B4] focus:outline-hidden focus:border-[#F26B21] bg-white"
              >
                <option value="Unwind Sessions Facilitator">Unwind Sessions Facilitator / Host</option>
                <option value="Writing Mentor / Workshop Tutor">Writing Mentor / Workshop Tutor</option>
                <option value="KAPFest Festival Volunteer">KAPFest (Kano Poetry Festival) Volunteer</option>
                <option value="Editorial & Kalamai Magazine Reviewer">Editorial & Kalamai Magazine Reviewer</option>
                <option value="Digital Rights & Advocacy (NAFASI)">Digital Rights & Advocacy (NAFASI Program)</option>
                <option value="Media, Photography & Sound">Media, Photography & Audio Production</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3d2308] mb-1">
                Location (City / State)
              </label>
              <input
                type="text"
                placeholder="e.g. Kano, Kaduna, Abuja, or Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#D5C7B4] focus:outline-hidden focus:border-[#F26B21] bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3d2308] mb-1">
                Tell us briefly why you'd like to join
              </label>
              <textarea
                rows={3}
                placeholder="Tell us about your love for poetry, literacy, or community organizing..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#D5C7B4] focus:outline-hidden focus:border-[#F26B21] bg-white"
              ></textarea>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-[#F26B21] hover:bg-[#D95F2B] text-white font-semibold text-sm transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Submit Application
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// 2. Donate Modal
export function DonateModal({ isOpen, onClose }) {
  const [selectedAmount, setSelectedAmount] = useState('5000');
  const [customAmount, setCustomAmount] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);

  if (!isOpen) return null;

  const amounts = ['2000', '5000', '10000', '25000', '50000'];

  const copyBankInfo = () => {
    navigator.clipboard.writeText("Poetic Wednesdays Initiative | Stanbic IBTC: 0038927110");
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAF8F5] border border-[#E0D3C1] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="bg-[#171717] text-white p-6 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#F26B21]">Support Literary Arts</span>
            <h3 className="font-serif text-2xl font-bold mt-1">Support Poetic Wednesdays</h3>
            <p className="text-xs text-stone-300 mt-1 font-sans">
              Help us sponsor youth workshops, print copies of Kalamai for public libraries, and protect vulnerable creatives.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3d2308] mb-2">
              Select Suggested Amount (NGN ₦)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {amounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    selectedAmount === amt && !customAmount
                      ? 'bg-[#F26B21] text-white border-[#F26B21] shadow-xs'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-[#F26B21]'
                  }`}
                >
                  ₦{parseInt(amt).toLocaleString()}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <input
                type="number"
                placeholder="Or enter custom amount in Naira..."
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(''); }}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#D5C7B4] bg-white focus:outline-hidden focus:border-[#F26B21]"
              />
            </div>
          </div>

          {/* Impact Statement */}
          <div className="p-3.5 rounded-xl bg-[#F5EBDD] border border-[#E0D3C1] text-xs text-[#3d2308] space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-[#F26B21]">
              <Sparkles className="w-4 h-4" /> Where your contribution goes:
            </span>
            <p className="text-stone-700">
              • <strong>₦5,000</strong> provides workshop materials and reading journals for two young poets.<br />
              • <strong>₦25,000</strong> sponsors one community Unwind Session with refreshments and open critique.<br />
              • <strong>₦50,000+</strong> supports digital rights training and legal advocacy under the NAFASI program.
            </p>
          </div>

          {/* Official Bank Account Details */}
          <div className="p-4 rounded-xl bg-white border border-[#E0D3C1] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-stone-500">Official Non-Profit Account</span>
              <button
                onClick={copyBankInfo}
                className="text-xs text-[#F26B21] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedBank ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedBank ? 'Copied Details!' : 'Copy Bank Details'}
              </button>
            </div>
            <div className="text-sm font-sans">
              <p className="font-bold text-[#171717]">Account Name: <span className="text-[#3d2308]">Poetic Wednesdays Initiative</span></p>
              <p className="font-mono text-stone-700">Bank: <span className="font-semibold text-stone-900">Stanbic IBTC Bank</span></p>
              <p className="font-mono text-stone-700">Account Number: <span className="font-bold text-[#F26B21] text-base tracking-wider">0038927110</span></p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <a
              href="https://paystack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#3a8a76] hover:bg-[#286354] text-white text-center text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              Pay via Paystack / Card <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Article / Poem Full Reader Modal
export function ReaderModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAF8F5] border border-[#E0D3C1] w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#171717] text-white p-5 flex items-start justify-between border-b border-[#333]">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#F26B21] text-white mb-2">
              {item.category || item.tag}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
              {item.title}
            </h3>
            <p className="text-xs text-[#F5EBDD] mt-1 font-sans">
              By {item.author || item.poet} • {item.date} {item.readingTime ? `• ${item.readingTime}` : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#171717] bg-[#FAF8F5]">
          {item.epigraph && (
            <blockquote className="border-l-4 border-[#F26B21] pl-4 italic font-serif text-[#3d2308] text-base">
              {item.epigraph}
            </blockquote>
          )}

          {item.stanzas ? (
            <div className="space-y-4 font-serif text-lg leading-relaxed text-[#171717]">
              {item.stanzas.map((line, idx) => (
                <p key={idx} className={line === "" ? "h-3" : ""}>
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <div className="font-sans text-sm sm:text-base leading-relaxed text-stone-800 whitespace-pre-line space-y-4">
              {item.content || item.fullDesc || item.excerpt}
            </div>
          )}

          {item.analysis && (
            <div className="p-4 rounded-xl bg-[#F5EBDD] border border-[#E0D3C1] text-xs text-[#3d2308] font-sans">
              <strong className="block text-sm font-serif font-bold text-[#171717] mb-1">Curatorial Context:</strong>
              {item.analysis}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F5EBDD] border-t border-[#E0D3C1] flex items-center justify-between">
          <span className="text-xs font-serif italic text-stone-600">Poetic Wednesdays Initiative Archive</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#171717] hover:bg-[#F26B21] text-white text-xs font-semibold transition-colors"
          >
            Close Reader
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. Lightbox Modal for Gallery
export function LightboxModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-center">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 sm:right-2 text-white hover:text-[#F26B21] p-1 transition-colors cursor-pointer"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="bg-[#171717] rounded-xl overflow-hidden border-2 border-stone-800 shadow-2xl w-full">
          <div className="max-h-[70vh] flex items-center justify-center bg-black">
            <img
              src={item.image}
              alt={item.title}
              className="max-h-[70vh] w-auto object-contain"
            />
          </div>
          <div className="p-4 sm:p-6 bg-[#171717] text-white border-t border-stone-800">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-[#F26B21] uppercase tracking-wider">
                {item.category}
              </span>
              <span className="text-xs text-stone-400 font-sans">
                {item.date} • {item.location}
              </span>
            </div>
            <h4 className="font-serif text-xl sm:text-2xl font-bold">{item.title}</h4>
            <p className="text-xs sm:text-sm text-stone-300 font-sans mt-2 leading-relaxed">
              {item.caption}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Global Search Modal
export function SearchModal({ isOpen, onClose, onSelectItem }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const results = ART_LIBRARY_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAF8F5] border border-[#E0D3C1] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 bg-white border-b border-[#E0D3C1] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#F26B21] shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search poems, authors, interviews, publications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-base font-sans focus:outline-hidden bg-transparent text-[#171717] placeholder-stone-400"
          />
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-2">
          {searchTerm.trim() === '' ? (
            <div className="p-6 text-center text-xs text-stone-500 font-sans">
              Type keywords like <span className="text-[#F26B21] font-semibold">"Nasiba"</span>, <span className="text-[#F26B21] font-semibold">"Kalamai"</span>, <span className="text-[#F26B21] font-semibold">"Sahel"</span>, or <span className="text-[#F26B21] font-semibold">"Unwind"</span> to explore the collection.
            </div>
          ) : results.length > 0 ? (
            results.map((res) => (
              <div
                key={res.id}
                onClick={() => { onSelectItem(res); onClose(); }}
                className="p-3 rounded-xl bg-white hover:bg-[#F5EBDD] border border-stone-200 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span className="font-semibold text-[#F26B21] uppercase tracking-wider">{res.category}</span>
                  <span>{res.date}</span>
                </div>
                <h5 className="font-serif text-base font-bold text-[#171717] group-hover:text-[#F26B21] transition-colors">
                  {res.title}
                </h5>
                <p className="text-xs text-stone-600 line-clamp-1 mt-0.5">
                  {res.excerpt}
                </p>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-stone-500 font-sans">
              No matching literary works found for "{searchTerm}".
            </div>
          )}
        </div>

        <div className="p-3 bg-[#F5EBDD] border-t border-[#E0D3C1] text-right">
          <button
            onClick={onClose}
            className="text-xs text-stone-600 hover:text-[#171717] font-semibold cursor-pointer"
          >
            Close Search (ESC)
          </button>
        </div>
      </div>
    </div>
  );
}

// 6. Bio Reader Modal
export function BioModal({ member, onClose }) {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAF8F5] border border-[#E0D3C1] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[#171717] p-5 text-white flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F26B21]">Team Profile</span>
          <button onClick={onClose} className="text-stone-400 hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 text-center space-y-4">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-[#F26B21] shadow-lg"
          />
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#171717]">{member.name}</h3>
            <p className="text-xs font-semibold text-[#3a8a76] uppercase tracking-wider mt-0.5">{member.role}</p>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 font-sans leading-relaxed text-left bg-white p-4 rounded-xl border border-stone-200">
            {member.bio}
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-[#171717] hover:bg-[#F26B21] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
