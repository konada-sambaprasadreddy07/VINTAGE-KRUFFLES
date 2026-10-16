import React, { useState } from 'react';
import { Order } from '../types';
import { api } from '../services/api';
import { X, Search, Clock, CheckCircle2, AlertCircle, ShoppingBag, MessageCircle } from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
  whatsappNumber?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderNumber = '',
  whatsappNumber = '918978941336'
}) => {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderNumber.trim()) {
      setError('Please enter your order reference (e.g. VK-2026-1001).');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.trackOrder(orderNumber.trim());
      if (res.success) {
        setOrder(res.order);
      } else {
        setError(res.error || 'Order reference not found.');
      }
    } catch {
      setError('Network error while looking up order.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'PENDING', label: 'Order Received', desc: 'Sent to cafe counter' },
    { key: 'CONFIRMED', label: 'Confirmed', desc: 'Kitchen accepted' },
    { key: 'PREPARING', label: 'Baking', desc: 'Hot in cast-iron griddle' },
    { key: 'READY', label: 'Ready for Pickup', desc: 'Packaged at counter' },
    { key: 'COMPLETED', label: 'Completed', desc: 'Enjoy your dessert!' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'CONFIRMED': return 1;
      case 'PREPARING': return 2;
      case 'READY': return 3;
      case 'COMPLETED': return 4;
      default: return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;
  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-peach/80 max-h-[90vh] flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-5 bg-cream-warm border-b border-peach flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-burnt" />
            <h3 className="font-serif font-bold text-lg text-espresso">Live Pre-Order Tracking</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-espresso rounded-lg hover:bg-peach/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Search box */}
          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter order reference (e.g. VK-2026-1001)"
              className="flex-1 px-4 py-3 bg-cream rounded-xl border border-peach text-xs font-mono font-bold uppercase text-espresso focus:outline-none focus:ring-2 focus:ring-burnt"
              id="input-track-reference"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 bg-burnt hover:bg-burnt-dark text-white font-bold text-xs rounded-xl shadow-warm transition-all disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {order && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Order status card */}
              <div className="p-5 rounded-2xl bg-cream-warm border border-peach">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-500">Order Reference</span>
                    <h4 className="text-xl font-serif font-black text-burnt">{order.orderNumber}</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                    order.status === 'READY'
                      ? 'bg-emerald-600 text-white animate-bounce'
                      : order.status === 'COMPLETED'
                      ? 'bg-stone-800 text-white'
                      : 'bg-golden text-espresso'
                  }`}>
                    {order.status}
                  </span>
                </div>

                {/* Progress Bar Steps */}
                <div className="relative pt-4 pb-2">
                  <div className="grid grid-cols-5 gap-1 text-center">
                    {steps.map((st, idx) => {
                      const isPastOrCurrent = idx <= currentStep;
                      return (
                        <div key={st.key} className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isPastOrCurrent
                              ? 'bg-burnt text-white shadow-sm'
                              : 'bg-stone-200 text-stone-500'
                          }`}>
                            {idx + 1}
                          </div>
                          <span className="text-[10px] font-bold text-espresso mt-1.5 line-clamp-1">
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pickup Time Note */}
                <div className="mt-4 pt-3 border-t border-peach/60 flex items-center justify-between text-xs text-stone-600">
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-burnt" />
                    Pickup Time: {new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </span>
                  <span className="font-bold text-espresso">
                    Total: ₹{order.total} (Pay at Pickup)
                  </span>
                </div>
              </div>

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Items in This Order
                  </h5>
                  <div className="space-y-2">
                    {order.items.map((it) => (
                      <div key={it.id} className="flex items-center justify-between text-xs p-3 rounded-xl bg-white border border-peach">
                        <span className="font-medium text-espresso">
                          {it.quantity}x {it.itemName}
                        </span>
                        <span className="font-bold text-burnt">
                          ₹{it.lineTotal}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Support Button */}
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hi Vintage Kruffles! Inquiring about my pre-order #${order.orderNumber}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-xs py-3 rounded-xl shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Message Cafe Counter on WhatsApp</span>
              </a>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
