import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play, Camera, MapPin, Calendar, Tag } from 'lucide-react';
import { GALLERY_ITEMS, BRAND } from './data';

export default function GallerySlideShow({ onSelectImage }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play slideshow every 5 seconds when isPlaying is true
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % GALLERY_ITEMS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % GALLERY_ITEMS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
  };

  const currentItem = GALLERY_ITEMS[currentIndex];

  return (
    <section className="w-full bg-[#FAF5EE] py-14 border-y border-[#E6DCCF] relative overflow-hidden">
      {/* Decorative literary watermark */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Poetry Foundation / Literary elegance */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5EBDD] text-[#3d2308] border border-[#E0D3C1] mb-3">
            <Camera className="w-3.5 h-3.5 text-[#F26B21]" />
            Mid Section Feature: Visual Archive
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#171717] tracking-tight">
            Moments in Verse & Gathering
          </h2>
          <p className="mt-3 font-serif italic text-lg sm:text-xl text-[#3d2308] max-w-2xl mx-auto leading-relaxed">
            “{BRAND.quote}”
          </p>
          <div className="w-16 h-1 bg-[#F26B21] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Main Slideshow Stage */}
        <div 
          className="relative bg-[#171717] rounded-2xl overflow-hidden shadow-2xl border-4 border-white group"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          {/* Active Image Container */}
          <div className="relative aspect-16/10 sm:aspect-16/9 md:aspect-21/9 w-full overflow-hidden bg-black flex items-center justify-center">
            <img
              src={currentItem.image}
              alt={currentItem.title}
              className="w-full h-full object-cover sm:object-cover transition-transform duration-700 ease-out group-hover:scale-102"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20"></div>

            {/* Top Bar on image: Category badge and Lightbox expand */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#F26B21] text-white shadow-md flex items-center gap-1.5">
                <Tag className="w-3 h-3" />
                {currentItem.category}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-xs transition-colors cursor-pointer"
                  title={isPlaying ? "Pause Slideshow" : "Resume Slideshow"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => onSelectImage && onSelectImage(currentItem)}
                  className="p-2 rounded-full bg-black/60 hover:bg-[#F26B21] text-white backdrop-blur-xs transition-colors cursor-pointer"
                  title="View Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Caption & Information */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 text-white z-20 max-w-4xl">
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#F5EBDD] mb-2 font-sans">
                <span className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded backdrop-blur-xs">
                  <Calendar className="w-3.5 h-3.5 text-[#F26B21]" />
                  {currentItem.date}
                </span>
                <span className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded backdrop-blur-xs">
                  <MapPin className="w-3.5 h-3.5 text-[#3a8a76]" />
                  {currentItem.location}
                </span>
                <span className="text-stone-300">
                  Slide {currentIndex + 1} of {GALLERY_ITEMS.length}
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mb-2 leading-snug">
                {currentItem.title}
              </h3>
              <p className="text-stone-200 text-xs sm:text-sm md:text-base font-sans leading-relaxed line-clamp-2 sm:line-clamp-none max-w-3xl">
                {currentItem.caption}
              </p>
            </div>

            {/* Left & Right Slide Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-[#F26B21] text-white flex items-center justify-center transition-all z-20 backdrop-blur-xs cursor-pointer shadow-lg hover:scale-105"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-[#F26B21] text-white flex items-center justify-center transition-all z-20 backdrop-blur-xs cursor-pointer shadow-lg hover:scale-105"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Thumbnail Carousel Bar */}
          <div className="bg-[#1C1C1C] px-4 py-3 flex items-center justify-between gap-3 overflow-x-auto border-t border-[#333]">
            <div className="flex items-center gap-3 overflow-x-auto py-1">
              {GALLERY_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    currentIndex === idx 
                      ? 'border-[#F26B21] scale-105 ring-2 ring-[#F26B21]/50' 
                      : 'border-stone-700 opacity-60 hover:opacity-100 hover:border-stone-400'
                  }`}
                  style={{ width: '64px', height: '42px' }}
                >
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Quick Indicators */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              {GALLERY_ITEMS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? 'w-6 bg-[#F26B21]' : 'w-2 bg-stone-600 hover:bg-stone-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Quote Footer Badge */}
        <div className="mt-4 text-center">
          <p className="text-xs text-[#3d2308]/80 font-sans">
            Capturing the spirit of youth open mics, masterclasses, and community solidarity across Northern Nigeria.
          </p>
        </div>

      </div>
    </section>
  );
}
