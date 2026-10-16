import React from 'react';
import { TodaySpecial } from '../types';
import { Flame, Sparkles, Plus, Clock, Tag } from 'lucide-react';

interface TodaysSpecialProps {
  special: TodaySpecial | null;
  onAddToCart: (item: any) => void;
}

export const TodaysSpecial: React.FC<TodaysSpecialProps> = ({ special, onAddToCart }) => {
  if (!special || !special.isActive) {
    return null; // Automatically disappears if expired or inactive
  }

  const savings = special.originalPrice && special.originalPrice > special.offerPrice
    ? Math.round(special.originalPrice - special.offerPrice)
    : 0;

  const handleAdd = () => {
    // Formulate as menu item for cart
    onAddToCart({
      id: special.menuItemId || 9999,
      name: special.title,
      slug: 'today-special',
      description: special.description,
      price: special.offerPrice,
      image: special.image,
      categoryId: 3,
      isAvailable: true,
      isBestseller: true,
      isTodaySpecial: true,
      isVeg: true,
      prepTimeMins: 15
    });
  };

  return (
    <section id="special" className="py-14 bg-gradient-to-r from-espresso via-espresso-light to-espresso text-white relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-burnt/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-golden/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading Badge */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-golden/20 border border-golden/40 text-golden text-xs font-black tracking-widest uppercase mb-3">
            <Flame className="w-4 h-4 fill-golden text-golden animate-pulse" />
            TODAY'S CHEF SPECIAL
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-cream">
            Fresh Off The Griddle Tonight
          </h2>
          <p className="text-cream-warm/80 text-sm sm:text-base max-w-xl mt-2 font-medium">
            Handcrafted for this evening's beach stroll. Limited quantity prepared fresh daily!
          </p>
        </div>

        {/* Feature Banner Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 border border-golden/30 shadow-warm-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Image Showcase */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-2xl group">
              <img
                src={special.image}
                alt={special.title}
                className="w-full h-[280px] sm:h-[340px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 left-4 bg-burnt text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-golden" />
                {special.badgeText || "Chef's Beach Special"}
              </div>
              {savings > 0 && (
                <div className="absolute bottom-4 right-4 bg-golden text-espresso font-black text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  SAVE ₹{savings} TODAY
                </div>
              )}
            </div>

            {/* Details & Action */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 text-golden text-xs font-bold uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4" /> Available 5:00 PM – 10:00 PM Tonight
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-cream leading-tight mb-4">
                {special.title}
              </h3>

              <p className="text-cream-warm/90 text-base leading-relaxed mb-6 font-normal">
                {special.description}
              </p>

              {/* Price Row */}
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-3xl sm:text-4xl font-extrabold text-golden font-sans">
                  ₹{special.offerPrice}
                </span>
                {special.originalPrice && (
                  <span className="text-xl sm:text-2xl text-stone-400 line-through font-semibold font-sans">
                    ₹{special.originalPrice}
                  </span>
                )}
                <span className="text-xs text-cream/70 font-medium">
                  (Sample development price)
                </span>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-burnt to-golden text-espresso font-extrabold text-base px-8 py-4 rounded-2xl shadow-warm hover:brightness-110 active:scale-95 transition-all duration-300 cursor-pointer"
                id="btn-claim-today-special"
              >
                <Plus className="w-5 h-5 text-espresso stroke-[3]" />
                <span>Claim Today's Special & Add to Pre-Order</span>
              </button>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
