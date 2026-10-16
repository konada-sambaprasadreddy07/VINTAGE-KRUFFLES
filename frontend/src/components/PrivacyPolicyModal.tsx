import React, { useState } from 'react';
import { X, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName?: string;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  brandName = 'VINTAGE KRUFFLES'
}) => {
  const [optOutPhone, setOptOutPhone] = useState('');
  const [optOutLoading, setOptOutLoading] = useState(false);
  const [optOutSuccess, setOptOutSuccess] = useState<string | null>(null);
  const [optOutError, setOptOutError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOptOut = async (e: React.FormEvent) => {
    e.preventDefault();
    setOptOutError(null);
    setOptOutSuccess(null);

    const clean = optOutPhone.replace(/[^0-9]/g, '');
    if (clean.length < 10) {
      setOptOutError('Please enter a valid 10-digit phone number.');
      return;
    }

    setOptOutLoading(true);
    try {
      const res = await fetch('/api/leads/opt-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: clean.slice(-10) }),
      });
      const data = await res.json();
      if (data.success) {
        setOptOutSuccess(data.message);
        setOptOutPhone('');
      } else {
        setOptOutError(data.error || 'Failed to opt out.');
      }
    } catch {
      setOptOutError('Network error processing opt-out request.');
    } finally {
      setOptOutLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-peach/80 max-h-[90vh] flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-5 bg-cream-warm border-b border-peach flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-burnt" />
            <h3 className="font-serif font-bold text-lg text-espresso">Privacy & Data Consent Policy</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-espresso rounded-lg hover:bg-peach/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-stone-700 leading-relaxed">
          <div>
            <h4 className="font-bold text-sm text-espresso mb-1">1. Customer Data Protection</h4>
            <p>
              {brandName} respects your privacy. We collect customer names and mobile numbers exclusively for processing pre-order pickup confirmations, tracking loyalty rewards (Kruffles Sweet Rewards), and delivering optional promotional WhatsApp messages where explicit consent has been provided.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-espresso mb-1">2. Marketing Consent & Festival Greetings</h4>
            <p>
              We only send promotional WhatsApp communications (such as festival specials for Diwali, Sankranti, birthdays, etc.) to customers who have explicitly opted in via our website or in-store signup. We do not sell, rent, or share personal contact numbers with any third-party marketing brokers.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-espresso mb-1">3. Data Retention & Secure Storage</h4>
            <p>
              All customer records, order history, and feedback ratings are securely stored in our encrypted database. Session tokens are authenticated securely and protected against unauthorized access.
            </p>
          </div>

          {/* Opt-out section */}
          <div className="p-4 rounded-2xl bg-cream-warm border border-peach space-y-3">
            <h4 className="font-bold text-sm text-espresso">Withdraw Marketing Consent (Opt-Out)</h4>
            <p className="text-[11px] text-stone-600">
              If you no longer wish to receive promotional WhatsApp offers or festival greetings, simply enter your phone number below to withdraw your consent immediately:
            </p>

            {optOutSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{optOutSuccess}</span>
              </div>
            )}

            {optOutError && (
              <div className="p-2.5 rounded-xl bg-red-50 text-red-700 font-semibold border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{optOutError}</span>
              </div>
            )}

            <form onSubmit={handleOptOut} className="flex gap-2">
              <input
                type="tel"
                value={optOutPhone}
                onChange={(e) => setOptOutPhone(e.target.value)}
                placeholder="Enter 10-digit phone number"
                className="flex-1 px-3 py-2 bg-white rounded-xl border border-peach text-xs text-espresso"
              />
              <button
                type="submit"
                disabled={optOutLoading}
                className="px-4 py-2 bg-espresso hover:bg-espresso-light text-cream text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                {optOutLoading ? 'Processing...' : 'Opt Out'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-cream-warm border-t border-peach text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-burnt text-white font-bold text-xs rounded-xl shadow-warm"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};
