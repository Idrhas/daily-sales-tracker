import React, { useState } from 'react';
import { 
  Camera, 
  Tag, 
  MapPin, 
  Calendar, 
  Maximize2, 
  Sparkles, 
  Filter 
} from 'lucide-react';
import GallerySlideShow from './GallerySlideShow';
import { GALLERY_ITEMS, BRAND } from './data';

export default function GalleryView({ onSelectImage }) {
  const [selectedTag, setSelectedTag] = useState('All');

  const tags = ['All', 'Unwind Sessions', 'KAPFest', 'Workshops', 'Open Mics', 'NAFASI Program', 'Publications'];

  const filteredItems = selectedTag === 'All' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category.toLowerCase().includes(selectedTag.toLowerCase()));

  return (
    <div className="w-full bg-[#FAF8F5]">
      {/* Title Banner with the iconic quote */}
      <section className="bg-[#171717] text-white py-16 border-b border-[#333] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F26B21]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="text-xs uppercase font-bold tracking-widest text-[#F26B21] block mb-2 font-sans">
              Visual Archives
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              PW Visual Gallery
            </h1>
            <p className="mt-4 font-serif italic text-xl sm:text-2xl text-[#F5EBDD] leading-relaxed border-l-4 border-[#F26B21] pl-4">
              “{BRAND.quote}”
            </p>
            <p className="mt-3 text-xs sm:text-sm text-stone-400 font-sans">
              Properly labeled photographic documentation of our journeys, readings, youth circles, and cultural gatherings.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Slideshow Component */}
      <GallerySlideShow onSelectImage={onSelectImage} />

      {/* Grid of All Pictures with Filters */}
      <section className="py-16 bg-white border-t border-[#E6DCCF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DCCF] mb-10">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#171717]">
                Full Photo Archive
              </h3>
              <p className="text-xs text-stone-500 font-sans mt-0.5">
                Click any picture to expand in high-definition lightbox.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTag(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium font-sans whitespace-nowrap transition-colors cursor-pointer ${
                    selectedTag === t
                      ? 'bg-[#F26B21] text-white font-bold shadow-2xs'
                      : 'bg-[#F5EBDD] text-[#3d2308] hover:bg-[#EADBC8]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectImage(item)}
                className="bg-[#FAF8F5] rounded-2xl overflow-hidden border border-[#E0D3C1] hover:border-[#F26B21] hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-black">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-3 rounded-full bg-white/90 text-[#171717] shadow-lg">
                      <Maximize2 className="w-5 h-5" />
                    </span>
                  </div>
                  <span className="absolute top-3 left-3 bg-[#171717]/80 text-[#F5EBDD] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded backdrop-blur-xs">
                    {item.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-stone-500 font-sans mb-1.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#F26B21]" />
                        {item.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#3a8a76]" />
                        {item.location}
                      </span>
                    </div>

                    <h4 className="font-serif text-xl font-bold text-[#171717] group-hover:text-[#F26B21] transition-colors leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-stone-600 font-sans mt-2 line-clamp-3 leading-relaxed">
                      {item.caption}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EAE2D5] flex items-center justify-between text-xs text-[#F26B21] font-semibold">
                    <span>Enlarge Photo</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
