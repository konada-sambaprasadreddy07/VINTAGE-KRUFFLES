import React, { useState } from 'react';
import { LoyaltyAccount } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { Award, Gift, Cake, CheckCircle, Search, Sparkles, ChevronRight } from 'lucide-react';

interface LoyaltySectionProps {
  onNotify?: (msg: string) => void;
}

export const LoyaltySection: React.FC<LoyaltySectionProps> = ({ onNotify }) => {
  const [phone, setPhone] = useState('');
  const [account, setAccount] = useState<LoyaltyAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Birthday form state
  const [showBirthdayForm, setShowBirthdayForm] = useState(false);
  const [birthMonth, setBirthMonth] = useState('1');
  const [birthDay, setBirthDay] = useState('1');
  const [customerName, setCustomerName] = useState('');
  const [savingBirthday, setSavingBirthday] = useState(false);

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = phone.replace(/[^0-9]/g, '');
    if (clean.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await api.lookupLoyalty(clean);
      if (data.success) {
        setAccount(data.account);
        if (data.account.isRewardReady) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } else {
        setError(data.error || 'Failed to lookup account.');
      }
    } catch {
      setError('Network error checking loyalty balance.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBirthday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    setSavingBirthday(true);
    try {
      const res = await api.saveBirthday({
        phone: account.phone,
        month: parseInt(birthMonth, 10),
        day: parseInt(birthDay, 10),
        name: customerName || undefined
      });
      if (res.success) {
        setAccount(res.account);
        setShowBirthdayForm(false);
        if (onNotify) onNotify(res.message);
      }
    } catch {
      alert('Failed to save birthday.');
    } finally {
      setSavingBirthday(false);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <section id="rewards" className="py-20 bg-gradient-to-b from-cream via-cream-warm to-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-golden/20 border border-golden/40 text-espresso text-xs font-black tracking-widest uppercase mb-3">
            <Award className="w-4 h-4 text-golden-dark" /> KRUFFLES SWEET REWARDS
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-espresso">
            Punch Your Way to Free Waffles
          </h2>
          <p className="text-espresso/70 text-base max-w-xl mt-3 font-medium">
            Every 10 qualifying visits or pickup orders earns you 1 Free Signature Waffle of your choice!
            Plus, enjoy exclusive birthday month discounts.
          </p>
        </div>

        {/* Main Loyalty Card Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-warm-lg border border-peach/80">
          
          {/* Phone Lookup Strip */}
          <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 font-bold text-sm">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className="w-full pl-14 pr-4 py-3.5 bg-cream-warm/60 rounded-2xl border border-peach focus:outline-none focus:ring-2 focus:ring-burnt text-sm text-espresso font-semibold"
                maxLength={10}
                id="input-loyalty-phone"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-burnt hover:bg-burnt-dark text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-warm transition-all active:scale-95 cursor-pointer disabled:opacity-60"
              id="btn-loyalty-check"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Checking...' : 'Check My Rewards'}</span>
            </button>
          </form>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {error}
            </div>
          )}

          {/* Account Balance Card */}
          {account && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Member Status Top Banner */}
              <div className="bg-gradient-to-r from-espresso via-espresso-light to-espresso text-cream p-6 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="text-xs uppercase font-bold text-golden tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-golden" />
                    Member: {account.customerName || 'Dessert Lover'} (+91 {account.phone})
                  </div>
                  <div className="text-2xl font-serif font-black text-white mt-1">
                    {account.currentCycleVisits} of 10 Visits Completed
                  </div>
                  <div className="text-xs text-cream/70 mt-0.5">
                    {account.visitsRemaining === 0
                      ? '🎉 Target reached! Free waffle reward available!'
                      : `${account.visitsRemaining} more visits until your next Free Signature Waffle.`}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-golden/20 border border-golden/40 px-4 py-2.5 rounded-xl text-center">
                    <span className="block text-2xl font-black text-golden">{account.rewardsAvailable}</span>
                    <span className="text-[10px] uppercase font-bold text-cream">Free Rewards</span>
                  </div>
                </div>
              </div>

              {/* 10-Stamp Visual Punch Card */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center justify-between">
                  <span>Current Stamp Cycle Progress</span>
                  <span>{account.currentCycleVisits}/10</span>
                </h4>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3">
                  {[...Array(10)].map((_, i) => {
                    const isStamped = i < account.currentCycleVisits;
                    const isTenth = i === 9;

                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all ${
                          isStamped
                            ? 'bg-burnt text-white shadow-sm scale-100'
                            : isTenth
                            ? 'bg-golden/20 border-2 border-dashed border-golden text-golden-dark animate-pulse'
                            : 'bg-cream-warm border border-peach text-stone-400'
                        }`}
                      >
                        {isStamped ? (
                          <>
                            <span className="text-base sm:text-lg">🧇</span>
                            <span className="text-[9px] font-black uppercase mt-0.5">#{i + 1}</span>
                          </>
                        ) : isTenth ? (
                          <>
                            <Gift className="w-4 h-4 text-burnt" />
                            <span className="text-[8px] font-black uppercase text-burnt mt-0.5">FREE!</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-bold">#{i + 1}</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Birthday Reward Strip & Registration */}
              <div className="p-5 rounded-2xl bg-peach/40 border border-peach flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-burnt/15 flex items-center justify-center text-burnt shrink-0">
                    <Cake className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-espresso">
                      Sweet Birthday Treat (20% OFF)
                    </h5>
                    <p className="text-xs text-stone-600">
                      {account.birthdayMonth
                        ? `Registered Birthday: ${months[account.birthdayMonth - 1]} ${account.birthdayDay}`
                        : 'Register your birthday to unlock 20% OFF during your birthday week.'}
                    </p>
                  </div>
                </div>

                {!account.birthdayMonth && !showBirthdayForm && (
                  <button
                    onClick={() => setShowBirthdayForm(true)}
                    className="text-xs font-bold bg-burnt text-white px-4 py-2 rounded-xl hover:bg-burnt-dark transition-colors"
                  >
                    Add My Birthday
                  </button>
                )}
              </div>

              {/* Birthday registration mini form */}
              {showBirthdayForm && (
                <form onSubmit={handleSaveBirthday} className="p-5 rounded-2xl bg-white border border-peach space-y-4">
                  <h5 className="text-sm font-bold text-espresso">Register Your Birthday for Sweet Surprises</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Your Name</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Ananya"
                        className="w-full px-3 py-2 bg-cream rounded-xl border border-peach text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Month</label>
                      <select
                        value={birthMonth}
                        onChange={(e) => setBirthMonth(e.target.value)}
                        className="w-full px-3 py-2 bg-cream rounded-xl border border-peach text-xs font-medium"
                      >
                        {months.map((m, idx) => (
                          <option key={m} value={idx + 1}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Day</label>
                      <select
                        value={birthDay}
                        onChange={(e) => setBirthDay(e.target.value)}
                        className="w-full px-3 py-2 bg-cream rounded-xl border border-peach text-xs font-medium"
                      >
                        {[...Array(31)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowBirthdayForm(false)}
                      className="px-3 py-1.5 text-xs text-stone-500 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingBirthday}
                      className="px-4 py-2 bg-burnt text-white text-xs font-bold rounded-xl shadow-sm"
                    >
                      {savingBirthday ? 'Saving...' : 'Save Birthday'}
                    </button>
                  </div>
                </form>
              )}

              {/* Transactions History */}
              {account.transactions && account.transactions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Recent Rewards Ledger
                  </h4>
                  <div className="space-y-2">
                    {account.transactions.slice(-3).map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between text-xs p-3 rounded-xl bg-cream-warm/70 border border-peach/50"
                      >
                        <span className="font-semibold text-espresso">{tx.description}</span>
                        <span className="text-[10px] text-stone-400">
                          {new Date(tx.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* How It Works Explainer if not looked up yet */}
          {!account && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-peach/60">
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-2xl bg-burnt/10 text-burnt flex items-center justify-center mx-auto text-xl mb-3">
                  1️⃣
                </div>
                <h4 className="font-bold text-sm text-espresso">Order & Share Phone</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Mention your phone number during pre-order pickup or counter visits.
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-2xl bg-golden/20 text-golden-dark flex items-center justify-center mx-auto text-xl mb-3">
                  2️⃣
                </div>
                <h4 className="font-bold text-sm text-espresso">Collect 10 Stamps</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Each completed visit automatically punches a virtual stamp on your card.
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-2xl bg-espresso/10 text-espresso flex items-center justify-center mx-auto text-xl mb-3">
                  3️⃣
                </div>
                <h4 className="font-bold text-sm text-espresso">Claim Free Waffle!</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Redeem 1 free eligible signature waffle or pancake of your choice!
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
