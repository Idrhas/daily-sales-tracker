import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Feather, 
  Calendar, 
  User, 
  Tag, 
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ART_LIBRARY_ITEMS, BRAND } from './data';

export default function ArtLibraryView({ onSelectArticle, setActiveTab }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Poems and Poets',
    'Interviews',
    'Blog',
    'Reports',
    'Newsletters',
    'Publications'
  ];

  const filteredItems = ART_LIBRARY_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-[#FAF8F5]">
      {/* Literary Masthead */}
      <section className="bg-[#171717] text-white py-14 border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs uppercase font-bold tracking-widest text-[#F26B21] block mb-2 font-sans">
              Archive & Digital Repository
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              The Art Library
            </h1>
            <p className="mt-3 font-serif italic text-lg sm:text-xl text-[#F5EBDD]">
              An accessible archive of contemporary poetry, critical dialogues, policy reports, and grassroots publications from Northern Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar (Poetry Foundation Style) */}
      <section className="bg-white border-b border-[#E6DCCF] sticky top-[73px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Category Pills (Poems and Poets, Interviews, Blog, Reports, Newsletters, Publications) */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-serif font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#F26B21] text-white font-bold shadow-xs'
                      : 'bg-[#F5EBDD] text-[#3d2308] hover:bg-[#EADBC8]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search repository..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs font-sans rounded-full border border-[#D5C7B4] bg-[#FAF8F5] focus:outline-hidden focus:border-[#F26B21] focus:bg-white"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8 flex items-center justify-between text-xs text-stone-500 font-sans border-b border-[#E6DCCF] pb-4">
            <span>Showing <strong className="text-[#171717]">{filteredItems.length}</strong> literary entries</span>
            <span>Category: <strong className="text-[#F26B21]">{selectedCategory}</strong></span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#E0D3C1] p-8 max-w-md mx-auto space-y-4">
              <BookOpen className="w-12 h-12 text-[#F26B21] mx-auto opacity-80" />
              <h3 className="font-serif text-2xl font-bold text-[#171717]">No works matched your search</h3>
              <p className="text-xs text-stone-600 font-sans">
                Try selecting "All" categories or searching for different keywords like "Kalamai", "Dirge", or "Poetry".
              </p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="px-4 py-2 rounded-lg bg-[#F26B21] text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  onClick={() => onSelectArticle(item)}
                  className="bg-white rounded-2xl border border-[#E0D3C1] p-6 hover:border-[#F26B21] hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500 font-sans mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F5EBDD] text-[#3d2308] font-bold text-[10px] uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span>{item.readingTime}</span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-[#171717] group-hover:text-[#F26B21] transition-colors leading-snug mb-3">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 font-sans line-clamp-4 leading-relaxed mb-4">
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EAE2D5] flex items-center justify-between text-xs font-sans">
                    <span className="text-stone-500 font-medium">By {item.author}</span>
                    <span className="font-bold text-[#F26B21] group-hover:text-[#D95F2B] flex items-center gap-1">
                      Read Online <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Special Feature: Kalamai and Dirge Publications highlight */}
          <div className="mt-16 bg-[#F5EBDD] border border-[#E0D3C1] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#F26B21] block mb-1">
                Print & Digital Publications
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717]">
                Looking for our Anthologies: Kalamai and Dirge?
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 font-sans mt-2">
                Order official copies of our physical journals or download the digital editions directly through our Selar storefront.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('kalamai')}
                className="px-5 py-2.5 rounded-lg bg-[#F26B21] hover:bg-[#D95F2B] text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
              >
                Go to Kalamai Feature
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
