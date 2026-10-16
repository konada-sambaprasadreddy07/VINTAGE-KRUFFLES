import React from 'react';
import { MapPin, Clock, Phone, Mail, Navigation, MessageCircle } from 'lucide-react';

interface VisitSectionProps {
  locationText?: string;
  openingHours?: string;
  phone?: string;
  whatsappNumber?: string;
  email?: string;
  googleMapsEmbedUrl?: string;
}

export const VisitSection: React.FC<VisitSectionProps> = ({
  locationText = 'Near RK Beach, Visakhapatnam, Andhra Pradesh 530002, India',
  openingHours = '5:00 PM to 10:00 PM (Daily)',
  phone = '+91 89789 41336',
  whatsappNumber = '918978941336',
  email = 'hello@vintagekruffles.com',
  googleMapsEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15201.258414407842!2d83.3150005!3d17.712613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39433c2a6ff4a1%3A0x6b0938634a475ef!2sRK%20Beach%2C%20Visakhapatnam!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin'
}) => {
  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <section id="visit" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach/60 border border-burnt/20 text-burnt-dark text-xs font-black tracking-widest uppercase mb-3">
            <MapPin className="w-4 h-4 text-burnt" /> VISIT THE CAFE
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-espresso">
            Come Savor at RK Beach
          </h2>
          <p className="text-espresso/70 text-base max-w-xl mt-3 font-medium">
            Take an evening walk along the Vizag promenade and follow the sweet aroma of freshly griddled Belgian waffles.
          </p>
        </div>

        {/* Location & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Cards: Details */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-peach/80 shadow-sm">
            <div>
              <h3 className="text-2xl font-serif font-bold text-espresso mb-6">
                Cafe Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-burnt/10 text-burnt flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-espresso">Address</h4>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                      {locationText}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-golden/20 text-golden-dark flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-espresso">Opening Hours</h4>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1">
                      {openingHours}
                    </p>
                    <span className="inline-block mt-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Open Every Evening
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-burnt/10 text-burnt flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-espresso">Phone & WhatsApp</h4>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1">
                      {phone}
                    </p>
                    <p className="text-xs text-stone-500">
                      WhatsApp: +{cleanWhatsApp}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-espresso/10 text-espresso flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-espresso">Inquiries</h4>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1">
                      {email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Map Directions CTA */}
            <div className="pt-6 border-t border-peach flex flex-col sm:flex-row gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('RK Beach, Visakhapatnam, Andhra Pradesh')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-espresso hover:bg-espresso-light text-cream font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-sm transition-all"
              >
                <Navigation className="w-4 h-4 text-golden" />
                <span>Get Directions</span>
              </a>

              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right: Embedded Google Map */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden shadow-warm border-2 border-white min-h-[380px] bg-stone-200">
            <iframe
              src={googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Vintage Kruffles RK Beach Location"
              className="w-full h-full rounded-3xl"
            />
          </div>

        </div>

      </div>
    </section>
  );
};
