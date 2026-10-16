import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X, Sparkles, Gift, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

interface LeadPopupProps {
  onOpenPrivacy: () => void;
  onSuccess?: (msg: string) => void;
  delaySeconds?: number;
}

export const LeadPopup: React.FC<LeadPopupProps> = ({
  onOpenPrivacy,
  onSuccess,
  delaySeconds = 4
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check if dismissed before
    const isDismissed = sessionStorage.getItem('vk_lead_popup_dismissed');
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delaySeconds * 1000);

      return () => clearTimeout(timer);
    }
  }, [delaySeconds]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('vk_lead_popup_dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clean = phone.replace(/[^0-9]/g, '');
    if (clean.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!consent) {
      setError('Please check the consent box to receive festive WhatsApp surprises.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitLead({
        name: firstName.trim() || undefined,
        phone: clean.slice(-10),
        consent: true
      });

      if (res.success) {
        setSubmitted(true);
        sessionStorage.setItem('vk_lead_popup_dismissed', 'true');
        if (onSuccess) onSuccess(res.message);
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      } else {
        setError(res.error || 'Failed to submit.');
      }
    } catch {
      setError('Network error saving your details.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-b from-cream via-cream-warm to-cream rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border-2 border-burnt/30 relative">
        
        {/* Close Icon */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-espresso/60 hover:text-espresso rounded-full hover:bg-peach/30 transition-colors z-20"
          aria-label="Close offer popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative Top Accent */}
        <div className="bg-gradient-to-r from-burnt via-golden to-burnt p-2 text-center text-espresso text-[11px] font-black uppercase tracking-wider">
          🎉 RK Beach VIP Member Invitation
        </div>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-espresso">
                You're In the Kruffles Family!
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Watch out for festive secret codes, complimentary dessert dips, and birthday treats sent right to your WhatsApp.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-burnt/15 text-burnt flex items-center justify-center mx-auto text-2xl mb-3">
                  🧇
                </div>
                <h3 className="font-serif font-black text-2xl sm:text-3xl text-espresso tracking-tight">
                  Sweet Deals Are Waiting!
                </h3>
                <p className="text-xs sm:text-sm text-espresso/80 mt-2 font-medium leading-relaxed">
                  Join the Vintage Kruffles family for special offers, festive surprises, and birthday treats.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">
                    First Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Rahul"
                    className="w-full px-4 py-2.5 bg-white rounded-xl border border-peach text-xs text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-burnt"
                    id="input-lead-name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">
                    Indian Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 font-bold text-xs">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit number"
                      maxLength={10}
                      className="w-full pl-12 pr-4 py-2.5 bg-white rounded-xl border border-peach text-xs text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-burnt"
                      id="input-lead-phone"
                    />
                  </div>
                </div>

                {/* Explicit Consent Checkbox */}
                <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-espresso/80 pt-1 leading-snug">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded text-burnt focus:ring-burnt"
                    id="checkbox-lead-consent"
                  />
                  <span>
                    I agree to receive promotional WhatsApp updates, festive surprises, and birthday offers from Vintage Kruffles.
                  </span>
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-burnt hover:bg-burnt-dark text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-warm hover:shadow-warm-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
                  id="btn-lead-submit"
                >
                  <Gift className="w-4 h-4" />
                  <span>{submitting ? 'Unlocking Sweet Deals...' : 'Unlock Sweet Deals'}</span>
                </button>

                {/* Not now option */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="text-xs text-stone-500 hover:text-espresso font-semibold"
                  >
                    Not now, thanks
                  </button>
                </div>

                <div className="pt-2 text-center text-[10px] text-stone-400 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Your number is never shared. </span>
                  <button
                    type="button"
                    onClick={onOpenPrivacy}
                    className="underline hover:text-espresso"
                  >
                    Privacy Policy
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
