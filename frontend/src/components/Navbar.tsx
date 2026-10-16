import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { ShoppingBag, Menu, X, MessageCircle, Clock, MapPin, Search } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenQRMenu: () => void;
  whatsappNumber?: string;
  openingHours?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenTracking,
  onOpenQRMenu,
  whatsappNumber = '918978941336',
  openingHours = '5:00 PM – 10:00 PM'
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Today's Special", href: "#special" },
    { name: "Our Menu", href: "#menu" },
    { name: "About Story", href: "#about" },
    { name: "Gallery", href: "#gallery" },
    { name: "Sweet Rewards", href: "#rewards" },
    { name: "Reviews", href: "#reviews" },
    { name: "Visit Us", href: "#visit" },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const cleanWhatsAppNumber = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <>
      {/* Top micro banner */}
      <div className="bg-espresso text-cream-warm text-xs py-1.5 px-4 hidden sm:block border-b border-espresso-light">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-golden" />
              Open Daily: {openingHours}
            </span>
            <span className="flex items-center gap-1.5 font-medium text-peach">
              <MapPin className="w-3.5 h-3.5 text-burnt" />
              Beach Road, Near RK Beach, Visakhapatnam
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={onOpenQRMenu}
              className="text-golden hover:underline cursor-pointer flex items-center gap-1"
            >
              📱 Digital QR Menu
            </button>
            <span className="text-espresso-light">|</span>
            <button
              onClick={onOpenTracking}
              className="text-cream-warm hover:text-golden cursor-pointer flex items-center gap-1"
            >
              <Search className="w-3 h-3 text-golden" /> Track Order
            </button>
            <span className="text-espresso-light">|</span>
            <a
              href="/#admin"
              className="text-stone-400 hover:text-white transition-colors"
            >
              Admin
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-panel shadow-warm py-3'
            : 'bg-cream/95 backdrop-blur-md py-4 border-b border-peach/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <a href="#" className="focus:outline-none focus:ring-2 focus:ring-burnt rounded-xl">
            <BrandLogo size="md" />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-espresso/90 hover:text-burnt font-semibold text-sm transition-colors relative group py-1"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-burnt transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </nav>

          {/* Desktop CTA actions */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hi Vintage Kruffles! I would like to order pancakes and waffles.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] font-bold text-xs px-3.5 py-2.5 rounded-full transition-all border border-[#25D366]/30 shadow-sm"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#25D366]" />
              <span>WhatsApp Order</span>
            </a>

            <button
              onClick={onOpenCart}
              className="relative inline-flex items-center gap-2 bg-gradient-to-r from-burnt to-burnt-dark hover:from-burnt-dark hover:to-espresso text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-warm hover:shadow-warm-lg transition-all duration-300 active:scale-95 cursor-pointer"
              aria-label="View pickup cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pre-Order</span>
              {cartCount > 0 && (
                <span className="ml-1 bg-golden text-espresso font-black text-xs px-2 py-0.5 rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Right Icons */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-burnt text-white shadow-warm"
              aria-label="View cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-golden text-espresso text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-espresso hover:bg-peach/30 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-espresso/60 backdrop-blur-sm animate-fadeIn">
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-cream-warm shadow-warm-lg p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-peach">
                <BrandLogo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-espresso hover:bg-peach/40 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={handleLinkClick}
                    className="text-espresso font-bold text-base py-2 px-3 rounded-xl hover:bg-burnt/10 hover:text-burnt transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
                <button
                  onClick={() => {
                    handleLinkClick();
                    onOpenQRMenu();
                  }}
                  className="text-left text-espresso font-bold text-base py-2 px-3 rounded-xl hover:bg-burnt/10 hover:text-burnt transition-colors flex items-center gap-2"
                >
                  <span>📱</span> Digital QR Menu
                </button>
                <button
                  onClick={() => {
                    handleLinkClick();
                    onOpenTracking();
                  }}
                  className="text-left text-espresso font-bold text-base py-2 px-3 rounded-xl hover:bg-burnt/10 hover:text-burnt transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-burnt" /> Track Pre-Order
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-peach flex flex-col gap-3">
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent('Hi Vintage Kruffles! I want to order waffles.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 rounded-xl shadow-md"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                Order on WhatsApp
              </a>
              <button
                onClick={() => {
                  handleLinkClick();
                  onOpenCart();
                }}
                className="w-full flex items-center justify-center gap-2 bg-burnt hover:bg-burnt-dark text-white font-bold py-3 rounded-xl shadow-warm"
              >
                <ShoppingBag className="w-5 h-5" />
                Pre-Order Pickup ({cartCount})
              </button>
              <div className="text-center text-xs text-stone-500 pt-2">
                Open Daily: 5:00 PM to 10:00 PM • RK Beach
              </div>
              <a
                href="/#admin"
                onClick={handleLinkClick}
                className="text-center text-xs text-stone-400 hover:text-stone-700 underline"
              >
                Cafe Staff Login
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
