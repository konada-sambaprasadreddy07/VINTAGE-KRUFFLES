import React from 'react';
import { ShoppingBag, MessageCircle, Star, ArrowRight, Sparkles, Clock, MapPin, Award } from 'lucide-react';

interface HeroProps {
  onExploreMenu: () => void;
  onOpenCart: () => void;
  whatsappNumber?: string;
  openingHours?: string;
  rating?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreMenu,
  onOpenCart,
  whatsappNumber = '918978941336',
  openingHours = '5:00 PM to 10:00 PM',
  rating = '4.5/5'
}) => {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:py-20 bg-gradient-to-b from-cream via-cream-warm to-cream">
      {/* Ambient background blur elements */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-golden/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-32 right-10 w-80 h-80 bg-burnt/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-peach/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach/50 border border-burnt/20 shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-burnt animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-burnt-dark flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-golden-dark" />
                Handcrafted at RK Beach, Vizag
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-espresso tracking-tight leading-[1.15] mb-6">
              A Little <span className="text-burnt relative inline-block">
                Sweetness,
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 250 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9C60 3 190 3 247 9" stroke="#FFC857" strokeWidth="5" strokeLinecap="round"/>
                </svg>
              </span>
              <br />
              A Lot of <span className="text-espresso">Happiness.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-espresso/80 font-medium leading-relaxed max-w-2xl mb-8">
              Freshly made pancakes, golden crispy waffles, and sweet moments at RK Beach.
              Experience the aroma of warm Belgian waffle grids by the Vizag sea breeze every evening.
            </p>

            {/* Prominent Action Buttons */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              {/* Explore Menu */}
              <button
                onClick={onExploreMenu}
                className="inline-flex items-center justify-center gap-2.5 bg-burnt hover:bg-burnt-dark text-white font-extrabold text-base px-7 py-4 rounded-2xl shadow-warm hover:shadow-warm-lg transition-all duration-300 active:scale-95 group cursor-pointer"
                id="btn-hero-explore-menu"
              >
                <span>Explore Our Menu</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Order on WhatsApp */}
              <a
                href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent('Hi Vintage Kruffles! I would like to order fresh waffles from your RK Beach cafe.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-base px-6 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
                id="btn-hero-whatsapp"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Order on WhatsApp</span>
              </a>

              {/* Pre-Order for Pickup */}
              <button
                onClick={onOpenCart}
                className="inline-flex items-center justify-center gap-2 bg-espresso hover:bg-espresso-light text-cream font-bold text-base px-6 py-4 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer border border-golden/30"
                id="btn-hero-pickup"
              >
                <ShoppingBag className="w-5 h-5 text-golden" />
                <span>Pre-Order Pickup</span>
              </button>
            </div>

            {/* Social Proof & Quick Details Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-peach/80 w-full max-w-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-golden/20 flex items-center justify-center text-golden-dark">
                  <Star className="w-5 h-5 fill-golden text-golden" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-espresso">{rating} Rating</div>
                  <div className="text-xs text-stone-600">850+ Beach Foodies</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-burnt/15 flex items-center justify-center text-burnt">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-espresso">{openingHours}</div>
                  <div className="text-xs text-stone-600">Daily Evening Hours</div>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-espresso/10 flex items-center justify-center text-espresso">
                  <MapPin className="w-5 h-5 text-burnt" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-espresso">RK Beach</div>
                  <div className="text-xs text-stone-600">Visakhapatnam, AP</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Feature Dessert Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-warm-lg border-4 border-white bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=900&q=85"
                  alt="Vintage Kruffles Belgian Golden Waffle"
                  className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent" />
                
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="inline-block px-3 py-1 bg-burnt text-white text-xs font-bold rounded-full mb-2 shadow-sm">
                    ⭐ Artisan Belgian Recipe
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white">
                    Golden Crisp Belgian Waffles
                  </h3>
                  <p className="text-xs text-cream/90 mt-1">
                    Pressed fresh with real butter, imported chocolate drizzle, and sea breeze magic.
                  </p>
                </div>
              </div>

              {/* Floating Mini Card: Today's Special Teaser */}
              <div className="absolute -top-5 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-warm border border-peach animate-soft-float max-w-[210px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1568051243851-f9b136146e97?auto=format&fit=crop&w=200&q=80"
                      alt="Triple Chocolate Waffle"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-burnt uppercase tracking-wider">Beach Favorite</div>
                    <div className="text-xs font-bold text-espresso line-clamp-1">Triple Chocolate Waffle</div>
                    <div className="text-xs font-extrabold text-burnt mt-0.5">₹199 <span className="text-[10px] text-stone-400 font-normal">sample</span></div>
                  </div>
                </div>
              </div>

              {/* Floating Mini Card: Rewards Teaser */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-espresso text-cream p-4 rounded-2xl shadow-warm-lg border border-golden/40 max-w-[220px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-golden/20 flex items-center justify-center text-golden shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-golden uppercase tracking-wide">Kruffles Rewards</div>
                    <div className="text-xs font-semibold text-cream-warm">10 Visits = Free Waffle</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
