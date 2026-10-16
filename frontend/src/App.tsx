import React, { useState, useEffect } from 'react';
import { api, getAuthToken } from './services/api';
import { MenuCategory, MenuItem, TodaySpecial, GalleryItem, ReviewItem, CartItem, Order, BusinessSettings } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TodaysSpecial } from './components/TodaysSpecial';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { LoyaltySection } from './components/LoyaltySection';
import { WhatsAppOrderSection } from './components/WhatsAppOrderSection';
import { VisitSection } from './components/VisitSection';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { PrintableQRMenuModal } from './components/PrintableQRMenuModal';
import { FeedbackModal } from './components/FeedbackModal';
import { LeadPopup } from './components/LeadPopup';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { Footer } from './components/Footer';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, X } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation / Admin State
  const [isAdminView, setIsAdminView] = useState(window.location.hash.includes('admin'));
  const [adminUser, setAdminUser] = useState<any | null>(null);

  // Core Data
  const [settings, setSettings] = useState<BusinessSettings>({});
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [todaySpecial, setTodaySpecial] = useState<TodaySpecial | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  // Cart State (Persisted in localStorage for temporary convenience)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vk_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState('');
  const [isQRMenuOpen, setIsQRMenuOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Order Success Modal
  const [recentOrder, setRecentOrder] = useState<{ order: Order; whatsappUrl?: string } | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash.includes('admin'));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('vk_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    loadPublicData();
    checkAdminSession();
  }, []);

  const loadPublicData = async () => {
    try {
      const [setRes, catRes, menuRes, specRes, galRes, revRes] = await Promise.all([
        api.getSettings(),
        api.getCategories(),
        api.getMenu(),
        api.getTodaySpecials(),
        api.getGallery(),
        api.getReviews(),
      ]);

      if (setRes.success) setSettings(setRes.settings);
      if (catRes.success) setCategories(catRes.categories);
      if (menuRes.success) setMenuItems(menuRes.items);
      if (specRes.success) setTodaySpecial(specRes.currentSpecial);
      if (galRes.success) setGalleryItems(galRes.gallery);
      if (revRes.success) setReviews(revRes.reviews);
    } catch (err) {
      console.error('Failed to load initial cafe data:', err);
    }
  };

  const checkAdminSession = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        const res = await api.getMe();
        if (res.success && res.admin) {
          setAdminUser(res.admin);
        }
      } catch {
        // Token expired
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { menuItem: item, quantity: 1 }];
      }
    });

    showToast(`Added ${item.name} to pre-order!`);
  };

  const handleUpdateQuantity = (menuItemId: number, quantity: number) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.menuItem.id !== menuItemId);
      }
      return prev.map((i) =>
        i.menuItem.id === menuItemId ? { ...i, quantity } : i
      );
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOrderSuccess = (order: Order, whatsappUrl?: string) => {
    setRecentOrder({ order, whatsappUrl });
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartItemCounts = cartItems.reduce((acc, item) => {
    acc[item.menuItem.id] = item.quantity;
    return acc;
  }, {} as Record<number, number>);

  // Admin View
  if (isAdminView) {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={(admin) => setAdminUser(admin)}
          onBackToSite={() => {
            window.location.hash = '';
            setIsAdminView(false);
          }}
        />
      );
    }
    return (
      <AdminDashboard
        admin={adminUser}
        onLogout={() => {
          setAdminUser(null);
          window.location.hash = '';
          setIsAdminView(false);
        }}
        onBackToSite={() => {
          window.location.hash = '';
          setIsAdminView(false);
          loadPublicData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col font-sans selection:bg-burnt selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-espresso text-cream px-4 py-3 rounded-2xl shadow-warm-lg border border-golden/40 flex items-center gap-3 animate-fadeIn">
          <span className="text-xl">🧇</span>
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Responsive Navigation Bar */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => {
          setTrackingOrderNumber('');
          setIsTrackingOpen(true);
        }}
        onOpenQRMenu={() => setIsQRMenuOpen(true)}
        whatsappNumber={settings.WHATSAPP_NUMBER || '918978941336'}
        openingHours={settings.OPENING_HOURS || '5:00 PM – 10:00 PM'}
      />

      {/* Hero Section */}
      <Hero
        onExploreMenu={() => {
          const el = document.getElementById('menu');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCart={() => setIsCartOpen(true)}
        whatsappNumber={settings.WHATSAPP_NUMBER || '918978941336'}
        openingHours={settings.OPENING_HOURS || '5:00 PM to 10:00 PM'}
        rating={settings.BUSINESS_RATING || '4.5/5'}
      />

      {/* Today's Special Section */}
      <TodaysSpecial
        special={todaySpecial}
        onAddToCart={handleAddToCart}
      />

      {/* Complete Menu Section */}
      <MenuSection
        categories={categories}
        items={menuItems}
        onAddToCart={handleAddToCart}
        cartItemCounts={cartItemCounts}
      />

      {/* About Story Section */}
      <AboutSection />

      {/* Food Photo Gallery with Lightbox */}
      <GallerySection galleryItems={galleryItems} />

      {/* Customer Reviews & Ratings */}
      <ReviewsSection
        reviews={reviews}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        rating={settings.BUSINESS_RATING || '4.5/5'}
      />

      {/* Kruffles Sweet Rewards Loyalty Section */}
      <LoyaltySection onNotify={showToast} />

      {/* Instant WhatsApp Order Section */}
      <WhatsAppOrderSection
        whatsappNumber={settings.WHATSAPP_NUMBER || '918978941336'}
      />

      {/* Visit Us & Google Maps */}
      <VisitSection
        locationText={settings.LOCATION_TEXT}
        openingHours={settings.OPENING_HOURS}
        phone={settings.PHONE_NUMBER}
        whatsappNumber={settings.WHATSAPP_NUMBER}
        email={settings.EMAIL_ADDRESS}
        googleMapsEmbedUrl={settings.GOOGLE_MAPS_EMBED_URL}
      />

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenQRMenu={() => setIsQRMenuOpen(true)}
        locationText={settings.LOCATION_TEXT}
        openingHours={settings.OPENING_HOURS}
        phone={settings.PHONE_NUMBER}
        whatsappNumber={settings.WHATSAPP_NUMBER}
        email={settings.EMAIL_ADDRESS}
        instagramUrl={settings.INSTAGRAM_URL}
      />

      {/* Cart & Pre-Order Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onOrderSuccess={handleOrderSuccess}
        whatsappNumber={settings.WHATSAPP_NUMBER}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialOrderNumber={trackingOrderNumber}
        whatsappNumber={settings.WHATSAPP_NUMBER}
      />

      {/* Printable Digital QR Menu Modal */}
      <PrintableQRMenuModal
        isOpen={isQRMenuOpen}
        onClose={() => setIsQRMenuOpen(false)}
        brandName={settings.CAFE_NAME || 'VINTAGE KRUFFLES'}
        location={settings.LOCATION_TEXT || 'Near RK Beach, Visakhapatnam'}
      />

      {/* Customer Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSuccess={showToast}
      />

      {/* Privacy Policy & Consent Opt-Out Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        brandName={settings.CAFE_NAME || 'VINTAGE KRUFFLES'}
      />

      {/* Sweet Deals Lead Collection Popup */}
      <LeadPopup
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onSuccess={showToast}
        delaySeconds={Number(settings.POPUP_DELAY_SECONDS) || 4}
      />

      {/* Order Confirmation Celebratory Modal */}
      {recentOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-golden/40 text-center space-y-4 relative">
            <button
              onClick={() => setRecentOrder(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-espresso"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
              🧇
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-golden-dark">
                Pre-Order Confirmed!
              </span>
              <h3 className="font-serif font-black text-2xl text-espresso mt-1">
                Sweetness is Being Prepared
              </h3>
              <p className="text-xs text-stone-600 mt-2">
                Order Reference: <strong className="font-mono text-burnt text-sm">{recentOrder.order.orderNumber}</strong>
              </p>
            </div>

            <div className="bg-cream-warm p-4 rounded-2xl text-left text-xs space-y-1.5 border border-peach/80">
              <div className="flex justify-between">
                <span className="text-stone-500">Pickup Time:</span>
                <span className="font-bold text-espresso">{new Date(recentOrder.order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Amount Due:</span>
                <span className="font-black text-burnt text-sm">₹{recentOrder.order.total} (Pay at Pickup)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Pickup Spot:</span>
                <span className="font-bold text-espresso">Vintage Kruffles Counter, RK Beach</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              {recentOrder.whatsappUrl && (
                <a
                  href={recentOrder.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Send Order Copy to WhatsApp</span>
                </a>
              )}

              <button
                onClick={() => {
                  setTrackingOrderNumber(recentOrder.order.orderNumber);
                  setRecentOrder(null);
                  setIsTrackingOpen(true);
                }}
                className="inline-flex items-center justify-center gap-1.5 bg-espresso hover:bg-espresso-light text-cream font-bold text-xs py-3 rounded-xl transition-all"
              >
                <span>Track Pre-Order Status</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
