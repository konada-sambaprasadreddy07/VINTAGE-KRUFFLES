import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { Camera, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ galleryItems }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Waffles', 'Pancakes', 'Beverages'];

  const filteredItems = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="gallery" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach/60 border border-burnt/20 text-burnt-dark text-xs font-black tracking-widest uppercase mb-3">
            <Camera className="w-4 h-4 text-burnt" /> VISUAL FEAST
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-espresso">
            Moments at Vintage Kruffles
          </h2>
          <p className="text-espresso/70 text-base max-w-xl mt-3 font-medium">
            Take a peek at our handcrafted creations before you bite into the golden crunch.
          </p>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-burnt text-white shadow-warm'
                    : 'bg-white text-espresso/70 hover:bg-peach/30 border border-peach'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="relative h-72 rounded-3xl overflow-hidden shadow-sm hover:shadow-warm-lg transition-all duration-300 group cursor-pointer border border-peach/70 bg-stone-100"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <span className="text-[11px] font-bold text-golden uppercase tracking-wider">
                  {item.category}
                </span>
                <h4 className="font-serif font-bold text-lg mt-1 text-cream">
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="text-xs text-cream/80 mt-1 line-clamp-1">
                    {item.caption}
                  </p>
                )}
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-golden font-bold">
                  <Eye className="w-4 h-4" /> Click to View Fullscreen
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-golden p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 sm:left-8 text-white hover:text-golden p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Active Image Box */}
          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredItems[lightboxIndex].imageUrl}
              alt={filteredItems[lightboxIndex].title}
              className="max-h-[70vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain border-2 border-golden/30"
            />
            <div className="text-center mt-4 text-white">
              <span className="text-xs font-bold text-golden uppercase tracking-widest">
                {filteredItems[lightboxIndex].category}
              </span>
              <h3 className="font-serif font-bold text-xl sm:text-2xl mt-1 text-cream">
                {filteredItems[lightboxIndex].title}
              </h3>
              {filteredItems[lightboxIndex].caption && (
                <p className="text-sm text-stone-300 mt-1 max-w-xl">
                  {filteredItems[lightboxIndex].caption}
                </p>
              )}
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 sm:right-8 text-white hover:text-golden p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </section>
  );
};
