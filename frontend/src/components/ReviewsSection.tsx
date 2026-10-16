import React from 'react';
import { ReviewItem } from '../types';
import { Star, MessageSquarePlus, CheckCircle, Quote } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: ReviewItem[];
  onOpenFeedback: () => void;
  rating?: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onOpenFeedback,
  rating = '4.5/5'
}) => {
  return (
    <section id="reviews" className="py-20 bg-cream-warm border-t border-peach/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-14">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach border border-burnt/20 text-burnt-dark text-xs font-black tracking-widest uppercase mb-3">
              <Star className="w-4 h-4 fill-golden text-golden" /> GUEST EXPERIENCES
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-espresso">
              Loved by Vizag's Dessert Lovers
            </h2>
            <p className="text-espresso/70 text-base max-w-xl mt-3 font-medium">
              Real reviews from locals, beach walkers, and dessert enthusiasts who visit our RK Beach cafe.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-4">
            {/* Rating badge */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-peach/80 flex items-center gap-4">
              <div className="text-4xl sm:text-5xl font-serif font-black text-burnt">
                {rating.split('/')[0]}
              </div>
              <div>
                <div className="flex items-center gap-1 text-golden">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-golden text-golden" />
                  ))}
                </div>
                <div className="text-xs font-bold text-espresso mt-1">4.5 out of 5 Stars</div>
                <div className="text-[11px] text-stone-500">Based on verified guest feedback</div>
              </div>
            </div>

            {/* Leave Review Button */}
            <button
              onClick={onOpenFeedback}
              className="inline-flex items-center gap-2 bg-espresso hover:bg-espresso-light text-cream font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer border border-golden/30"
              id="btn-leave-review"
            >
              <MessageSquarePlus className="w-4 h-4 text-golden" />
              <span>Leave Your Feedback</span>
            </button>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-warm transition-all duration-300 border border-peach/70 flex flex-col justify-between relative group"
            >
              <Quote className="w-8 h-8 text-peach/50 absolute top-5 right-5 pointer-events-none group-hover:text-burnt/20 transition-colors" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(rev.rating)
                          ? 'fill-golden text-golden'
                          : 'fill-stone-200 text-stone-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-black text-espresso ml-1">
                    {rev.rating.toFixed(1)}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-espresso/80 text-sm leading-relaxed italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-4 border-t border-peach/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {rev.avatarUrl ? (
                    <img
                      src={rev.avatarUrl}
                      alt={rev.customerName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-golden"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-burnt/15 text-burnt font-bold flex items-center justify-center text-sm">
                      {rev.customerName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-espresso">
                      {rev.customerName}
                    </h4>
                    <span className="text-[11px] text-stone-500 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      {rev.platform || 'Verified Guest'}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] text-stone-400">
                  {new Date(rev.reviewDate).toLocaleDateString([], { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
