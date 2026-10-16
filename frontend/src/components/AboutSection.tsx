import React from 'react';
import { Heart, Sparkles, Coffee, ShieldCheck, Sun, Compass } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-cream-warm border-y border-peach/60 relative overflow-hidden">
      {/* Subtle background flourishes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Visual Grid */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden shadow-warm border-2 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1598214886806-c87b84b7078b?auto=format&fit=crop&w=600&q=80"
                    alt="Nutella Waffle Crafting"
                    className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="bg-espresso text-cream p-6 rounded-3xl shadow-warm">
                  <div className="text-3xl font-serif font-black text-golden">5 - 10 PM</div>
                  <div className="text-xs uppercase font-bold tracking-wider text-peach mt-1">Evening Desserts</div>
                  <p className="text-xs text-cream/80 mt-2">
                    Catching the cool sea breeze while savoring hot, crispy waffles.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="bg-burnt text-white p-6 rounded-3xl shadow-warm">
                  <div className="text-3xl font-serif font-black text-golden">100%</div>
                  <div className="text-xs uppercase font-bold tracking-wider text-white/90 mt-1">Fresh Batter</div>
                  <p className="text-xs text-white/80 mt-2">
                    Mixed daily in small batches using premium buttermilk and pure vanilla.
                  </p>
                </div>
                <div className="rounded-3xl overflow-hidden shadow-warm border-2 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=600&q=80"
                    alt="Fluffy Pancake Stack"
                    className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Vintage Kruffles Official Seal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-4 border-white shadow-warm-lg overflow-hidden bg-white select-none p-1">
              <img
                src="/logo.png"
                alt="Vintage Kruffles Official Seal"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>

          {/* Right Text Content */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach border border-burnt/20 text-burnt-dark text-xs font-black tracking-widest uppercase mb-4">
              <Compass className="w-4 h-4 text-burnt" /> OUR VIZAG STORY
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-espresso leading-tight mb-6">
              Sweet Beachside Memories, One Waffle at a Time.
            </h2>

            <p className="text-base sm:text-lg text-espresso/80 leading-relaxed font-normal mb-6">
              Born near the iconic Ramakrishna Beach in Visakhapatnam, <strong className="text-burnt">VINTAGE KRUFFLES</strong> was created with a heartfelt philosophy: 
              <em>"A Little Sweetness, A Lot of Happiness."</em>
            </p>

            <p className="text-sm sm:text-base text-espresso/70 leading-relaxed mb-8">
              Whether you are walking along the shoreline with family, hanging out after college with friends, or enjoying a romantic sunset dessert date, our cafe brings you authentic Belgian waffles with that unmistakable golden crunch, alongside cloud-like pancake stacks drizzled in rich molten chocolates and fresh fruits.
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-peach/80 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-burnt/15 flex items-center justify-center text-burnt shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-espresso">Artisan Belgian Grids</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Heavy cast-iron presses for deep crunchy pockets.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-peach/80 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-golden/20 flex items-center justify-center text-golden-dark shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-espresso">100% Vegetarian</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Pure vegetarian batters crafted with care.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-peach/80 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-burnt/15 flex items-center justify-center text-burnt shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-espresso">RK Beach Sunset Vibe</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Evening treats from 5 PM to 10 PM daily.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-peach/80 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-golden/20 flex items-center justify-center text-golden-dark shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-espresso">Kruffles Rewards</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Earn a free waffle every 10 sweet visits.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
