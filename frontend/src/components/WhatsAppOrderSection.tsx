import React from 'react';
import { MessageCircle, ArrowRight, Sparkles, Send, ShieldCheck } from 'lucide-react';

interface WhatsAppOrderSectionProps {
  whatsappNumber?: string;
}

export const WhatsAppOrderSection: React.FC<WhatsAppOrderSectionProps> = ({
  whatsappNumber = '918978941336'
}) => {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const quickCombos = [
    {
      title: 'Beach Sunset Duo',
      items: '1x Belgian Golden Waffle + 1x Vizag Iced Cold Coffee',
      price: '₹278',
      sampleTag: 'Sample Combo',
      message: 'Hi Vintage Kruffles! I would like to order the *Beach Sunset Duo* (1x Belgian Golden Waffle + 1x Vizag Iced Cold Coffee) for pickup at RK Beach.'
    },
    {
      title: 'Chocoholic Dream',
      items: '1x Triple Chocolate Overload Waffle + 1x Dark Choco-Chip Pancake',
      price: '₹388',
      sampleTag: 'Sample Combo',
      message: 'Hi Vintage Kruffles! I would like to order the *Chocoholic Dream* (1x Triple Chocolate Overload Waffle + 1x Dark Choco-Chip Pancake) for pickup.'
    },
    {
      title: 'RK Beach Family Fiesta',
      items: '2x Signature Waffles + 1x Biscoff Pancake Stack + 2x Coolers',
      price: '₹699',
      sampleTag: 'Sample Combo',
      message: 'Hi Vintage Kruffles! I would like to order the *RK Beach Family Fiesta* platter for my evening stroll.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-[#075E54] via-[#128C7E] to-[#075E54] text-white relative overflow-hidden">
      {/* Decorative WhatsApp bubbles */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Info */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/30 text-white text-xs font-black tracking-widest uppercase mb-4">
              <MessageCircle className="w-4 h-4 fill-white text-white" /> INSTANT WHATSAPP CHAT
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white leading-tight mb-4">
              Order Directly on WhatsApp
            </h2>

            <p className="text-white/80 text-base leading-relaxed mb-6 font-normal">
              Prefer chatting directly with our beach counter team? Tap any quick combo below or click to chat with custom requests. We will confirm your preparation time immediately!
            </p>

            <div className="flex items-center gap-2 text-xs text-white/70 bg-black/20 p-3 rounded-xl border border-white/10 mb-6">
              <ShieldCheck className="w-4 h-4 text-golden shrink-0" />
              <span>Note: Opening WhatsApp sends a prefilled chat message to the cafe. Website checkout orders are saved automatically to our kitchen screen.</span>
            </div>

            <a
              href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent('Hi Vintage Kruffles! I would like to place an order from your RK Beach menu.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold px-7 py-4 rounded-2xl shadow-lg transition-all duration-300 active:scale-95"
            >
              <Send className="w-5 h-5 fill-white" />
              <span>Chat with Us: +{cleanNumber}</span>
            </a>
          </div>

          {/* Right: Quick Combos Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickCombos.map((combo, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 flex flex-col justify-between hover:bg-white/15 transition-all shadow-md group"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-golden tracking-wider">
                    {combo.sampleTag}
                  </span>
                  <h4 className="font-serif font-bold text-lg text-white mt-1">
                    {combo.title}
                  </h4>
                  <p className="text-xs text-white/80 mt-2 leading-relaxed">
                    {combo.items}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
                  <span className="text-xl font-black text-golden">{combo.price}</span>
                  <a
                    href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(combo.message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white transition-all active:scale-95 shadow-sm"
                    title="Send to WhatsApp"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
