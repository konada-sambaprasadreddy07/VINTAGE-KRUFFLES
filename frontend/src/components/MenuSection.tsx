import React, { useState } from 'react';
import { MenuCategory, MenuItem } from '../types';
import { Search, Plus, Check, Sparkles, Flame, Clock, Leaf } from 'lucide-react';

interface MenuSectionProps {
  categories: MenuCategory[];
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  cartItemCounts: Record<number, number>;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  categories,
  items,
  onAddToCart,
  cartItemCounts
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategoryId === null || item.categoryId === selectedCategoryId;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = !vegOnly || item.isVeg;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  return (
    <section id="menu" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach/60 border border-burnt/20 text-burnt-dark text-xs font-black tracking-widest uppercase mb-3">
            <span>🧇</span> ARTISAN DESSERT COLLECTION
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-espresso tracking-tight">
            Our Handcrafted Menu
          </h2>
          <p className="text-espresso/70 text-base sm:text-lg max-w-2xl mt-3 font-medium">
            Every waffle is poured fresh into cast-iron grids and baked to golden perfection.
            Pancakes are griddled hot with buttermilk fluffiness.
          </p>
          <div className="mt-2 text-xs font-semibold text-burnt bg-peach/40 px-3 py-1 rounded-full border border-burnt/10">
            ℹ️ Sample development prices shown. Cafe prices editable anytime in Admin Portal.
          </div>
        </div>

        {/* Filter Controls Bar: Search & Veg Toggle */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 max-w-4xl mx-auto">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search waffles, pancakes, Nutella..."
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-peach shadow-sm focus:outline-none focus:ring-2 focus:ring-burnt text-sm text-espresso placeholder-stone-400"
              id="input-menu-search"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-espresso font-bold p-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* 100% Veg / Eggless filter toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              vegOnly
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>100% Vegetarian Only</span>
          </button>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none justify-start sm:justify-center">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategoryId === null
                ? 'bg-burnt text-white shadow-warm'
                : 'bg-white text-espresso/80 hover:bg-peach/40 border border-peach/60'
            }`}
          >
            All Goodies ({items.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategoryId === cat.id
                  ? 'bg-burnt text-white shadow-warm'
                  : 'bg-white text-espresso/80 hover:bg-peach/40 border border-peach/60'
              }`}
            >
              <span>{cat.icon || '🧇'}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white/70 rounded-3xl border border-dashed border-peach max-w-lg mx-auto p-8">
            <span className="text-4xl">🧇</span>
            <h3 className="text-lg font-serif font-bold text-espresso mt-3">No dessert found</h3>
            <p className="text-sm text-stone-500 mt-1">
              Try searching with another keyword or pick a different category tab.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryId(null);
                setVegOnly(false);
              }}
              className="mt-4 inline-block bg-burnt text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => {
              const inCartCount = cartItemCounts[item.id] || 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden border border-peach/70 shadow-sm hover:shadow-warm transition-all duration-300 flex flex-col group"
                >
                  {/* Item Image with Badges */}
                  <div className="relative h-52 sm:h-56 overflow-hidden bg-cream-warm">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {item.isBestseller && (
                        <span className="inline-flex items-center gap-1 bg-golden text-espresso text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
                          <Flame className="w-3 h-3 fill-espresso" />
                          BESTSELLER
                        </span>
                      )}
                      {item.isTodaySpecial && (
                        <span className="inline-flex items-center gap-1 bg-burnt text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
                          <Sparkles className="w-3 h-3" />
                          TODAY'S SPECIAL
                        </span>
                      )}
                    </div>

                    {/* Veg Icon Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
                      <div className="w-4 h-4 border-2 border-emerald-600 flex items-center justify-center p-0.5 rounded-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-600" />
                      </div>
                    </div>

                    {/* Prep Time Tag */}
                    <div className="absolute bottom-3 right-3 bg-espresso/80 backdrop-blur-sm text-cream text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-golden" />
                      <span>{item.prepTimeMins || 15} mins</span>
                    </div>
                  </div>

                  {/* Item Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-espresso group-hover:text-burnt transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-espresso/70 mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Price and Add Button */}
                    <div className="mt-5 pt-4 border-t border-peach/50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-stone-500 font-medium">Sample Price</span>
                        <div className="text-xl sm:text-2xl font-extrabold text-burnt font-sans">
                          ₹{item.price}
                        </div>
                      </div>

                      <button
                        onClick={() => onAddToCart(item)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 ${
                          inCartCount > 0
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-burnt hover:bg-burnt-dark text-white shadow-warm'
                        }`}
                        id={`btn-add-item-${item.id}`}
                      >
                        {inCartCount > 0 ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Added ({inCartCount})</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Add to Order</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
