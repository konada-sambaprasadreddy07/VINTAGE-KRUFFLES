import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { api } from '../services/api';
import { X, Trash2, Plus, Minus, ShoppingBag, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (menuItemId: number, quantity: number) => void;
  onClearCart: () => void;
  onOrderSuccess: (order: Order, whatsappUrl?: string) => void;
  whatsappNumber?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onClearCart,
  onOrderSuccess,
  whatsappNumber = '918978941336'
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

  // Generate sensible pickup time options for this evening (5:00 PM to 10:00 PM)
  const getPickupSlots = () => {
    const slots = [];
    const now = new Date();
    // Default today's date
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const datePrefix = `${yyyy}-${mm}-${dd}`;

    for (let hour = 17; hour <= 21; hour++) {
      for (const minute of [0, 15, 30, 45]) {
        const hh = String(hour).padStart(2, '0');
        const minStr = String(minute).padStart(2, '0');
        const isoString = `${datePrefix}T${hh}:${minStr}:00.000Z`;
        const displayTime = `${hour > 12 ? hour - 12 : hour}:${minStr} ${hour >= 12 ? 'PM' : 'AM'}`;
        slots.push({ value: isoString, label: displayTime });
      }
    }
    slots.push({ value: `${datePrefix}T22:00:00.000Z`, label: '10:00 PM (Closing)' });
    return slots;
  };

  const slots = getPickupSlots();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError('Your pre-order cart is empty.');
      return;
    }
    if (!customerName.trim()) {
      setError('Please enter your name.');
      return;
    }
    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!pickupTime) {
      setError('Please select an estimated pickup time.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: cleanPhone.slice(-10),
        pickupTime,
        orderNotes: orderNotes.trim(),
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
          options: i.options || ''
        })),
        isWhatsAppOrder: false,
        paymentMethod: 'PAY_AT_PICKUP'
      };

      const res = await api.submitOrder(payload);
      if (res.success) {
        onClearCart();
        onOrderSuccess(res.order, res.whatsappUrl);
        onClose();
      } else {
        setError(res.error || 'Failed to place order.');
      }
    } catch {
      setError('Network error while placing your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
        
        {/* Top Header */}
        <div className="p-5 border-b border-peach/80 bg-cream-warm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-burnt/15 text-burnt flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-espresso">Pre-Order for Pickup</h3>
              <span className="text-xs text-stone-500 font-medium">{items.length} items selected</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-espresso rounded-xl hover:bg-peach/30 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl">🧇</span>
              <h4 className="font-serif font-bold text-lg text-espresso mt-4">Your Cart is Empty</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Explore our handcrafted waffle and pancake menu to add sweet treats to your pre-order!
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 bg-burnt text-white font-bold text-xs rounded-xl shadow-warm"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Selected Items
                </h4>

                {items.map((cartItem) => (
                  <div
                    key={cartItem.menuItem.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-cream border border-peach/70 gap-3"
                  >
                    <img
                      src={cartItem.menuItem.image}
                      alt={cartItem.menuItem.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h5 className="font-serif font-bold text-sm text-espresso truncate">
                        {cartItem.menuItem.name}
                      </h5>
                      <span className="text-xs font-black text-burnt">
                        ₹{cartItem.menuItem.price * cartItem.quantity}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-peach">
                      <button
                        onClick={() => onUpdateQuantity(cartItem.menuItem.id, cartItem.quantity - 1)}
                        className="p-1 text-stone-500 hover:text-burnt"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black text-espresso px-1">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(cartItem.menuItem.id, cartItem.quantity + 1)}
                        className="p-1 text-stone-500 hover:text-burnt"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => onUpdateQuantity(cartItem.menuItem.id, 0)}
                      className="text-stone-400 hover:text-red-500 p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Checkout Form */}
              <form id="form-preorder" onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-peach/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Pickup Details
                </h4>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full px-4 py-2.5 bg-cream rounded-xl border border-peach text-sm text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-burnt"
                    id="input-cart-name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">
                    Mobile Number (For Order Tracking & Pickup Confirmation) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 font-bold text-xs">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="10-digit number"
                      maxLength={10}
                      className="w-full pl-12 pr-4 py-2.5 bg-cream rounded-xl border border-peach text-sm text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-burnt"
                      id="input-cart-phone"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-espresso mb-1 flex items-center justify-between">
                    <span>Estimated Pickup Time (5 PM – 10 PM) *</span>
                    <span className="text-[10px] text-stone-400">Freshly prepared</span>
                  </label>
                  <select
                    required
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-cream rounded-xl border border-peach text-sm text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-burnt"
                    id="select-cart-pickup-time"
                  >
                    <option value="">Select an evening slot</option>
                    {slots.map((s, idx) => (
                      <option key={idx} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">
                    Special Preparation Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Extra chocolate dip on the side, pack separately..."
                    className="w-full px-4 py-2 bg-cream rounded-xl border border-peach text-xs text-espresso focus:outline-none focus:ring-2 focus:ring-burnt"
                    id="textarea-cart-notes"
                  />
                </div>

                {/* Payment Clarification */}
                <div className="bg-golden/15 p-3.5 rounded-xl border border-golden/40 text-xs text-espresso leading-relaxed">
                  <strong>💳 Payment at Pickup:</strong> Online payments are not processed in advance. You can pay via UPI, Cash, or Card directly at the counter upon pickup.
                </div>
              </form>
            </>
          )}
        </div>

        {/* Bottom Total & Submit Bar */}
        {items.length > 0 && (
          <div className="p-5 border-t border-peach/80 bg-cream-warm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-stone-500 font-medium">Pre-Order Subtotal</span>
                <div className="text-xs text-stone-400">(Taxes included, transparent pricing)</div>
              </div>
              <span className="text-2xl font-black text-burnt">
                ₹{subtotal}
              </span>
            </div>

            <button
              type="submit"
              form="form-preorder"
              disabled={submitting}
              className="w-full bg-burnt hover:bg-burnt-dark text-white font-extrabold text-sm py-4 rounded-2xl shadow-warm hover:shadow-warm-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              id="btn-confirm-preorder"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{submitting ? 'Confirming Order...' : 'Confirm Pre-Order for Pickup'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
