import React from 'react';
import { BrandLogo } from './BrandLogo';
import { MapPin, Clock, Phone, Mail, MessageCircle, Heart, Shield, QrCode, Lock } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenQRMenu: () => void;
  locationText?: string;
  openingHours?: string;
  phone?: string;
  whatsappNumber?: string;
  email?: string;
  instagramUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenQRMenu,
  locationText = 'Near RK Beach, Visakhapatnam, Andhra Pradesh 530002, India',
  openingHours = '5:00 PM to 10:00 PM (Daily)',
  phone = '+91 89789 41336',
  whatsappNumber = '918978941336',
  email = 'hello@vintagekruffles.com',
  instagramUrl = 'https://instagram.com/vintagekruffles'
}) => {
  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-espresso text-cream pt-16 pb-8 border-t-4 border-burnt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-espresso-light">
          
          {/* Brand Intro */}
          <div className="lg:col-span-5 space-y-4">
            <BrandLogo light size="md" />
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm mt-3">
              Freshly made pancakes, golden crispy waffles, and sweet moments at RK Beach, Visakhapatnam.
              Experience artisan Belgian recipes paired with the evening sea breeze.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#25D366] text-white flex items-center justify-center transition-colors"
                title="WhatsApp Cafe"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-pink-600 text-white flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <span className="font-bold text-xs">IG</span>
              </a>
              <button
                onClick={onOpenQRMenu}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-golden/20 hover:bg-golden/30 text-golden text-xs font-bold transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Menu</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-golden">
              Explore
            </h4>
            <ul className="space-y-2 text-xs font-medium text-stone-300">
              <li><a href="#special" className="hover:text-golden transition-colors">Today's Special</a></li>
              <li><a href="#menu" className="hover:text-golden transition-colors">Complete Menu</a></li>
              <li><a href="#about" className="hover:text-golden transition-colors">Our Vizag Story</a></li>
              <li><a href="#gallery" className="hover:text-golden transition-colors">Photo Gallery</a></li>
              <li><a href="#rewards" className="hover:text-golden transition-colors">Kruffles Sweet Rewards</a></li>
              <li><a href="#reviews" className="hover:text-golden transition-colors">Customer Reviews</a></li>
              <li><a href="#visit" className="hover:text-golden transition-colors">Location & Timings</a></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-golden">
              Beachfront Location
            </h4>
            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-burnt shrink-0 mt-0.5" />
                <span>{locationText}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-golden shrink-0" />
                <span>{openingHours}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-burnt shrink-0" />
                <span>{phone} (WhatsApp: +{cleanWhatsApp})</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-golden shrink-0" />
                <span>{email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} VINTAGE KRUFFLES. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-burnt fill-burnt inline" />
            <span>at RK Beach, Vizag.</span>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <Shield className="w-3 h-3 text-stone-400" /> Privacy & Consent
            </button>
            <a
              href="/#admin"
              className="text-stone-400 hover:text-golden transition-colors flex items-center gap-1 font-semibold"
            >
              <Lock className="w-3 h-3" /> Admin Portal
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
