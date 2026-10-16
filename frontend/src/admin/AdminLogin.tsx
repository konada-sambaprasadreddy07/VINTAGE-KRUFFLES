import React, { useState } from 'react';
import { api, setAuthToken } from '../services/api';
import { BrandLogo } from '../components/BrandLogo';
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (admin: any) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToSite }) => {
  const [email, setEmail] = useState('admin@vintagekruffles.com');
  const [password, setPassword] = useState('Admin@Kruffles2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.login({ email, password });
      if (res.success && res.token) {
        setAuthToken(res.token);
        onLoginSuccess(res.admin);
      } else {
        setError(res.error || 'Invalid credentials.');
      }
    } catch {
      setError('Network error connecting to backend authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-espresso via-espresso-dark to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-cream-warm rounded-3xl shadow-2xl p-8 border-2 border-golden/30 relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-burnt/15 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <BrandLogo size="md" className="justify-center mb-4" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-espresso text-golden text-xs font-black uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" /> Staff & Manager Portal
          </div>
          <p className="text-xs text-stone-600 mt-2 font-medium">
            Manage orders, menu items, Today's Special, WhatsApp campaigns, and loyalty rewards.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-bold text-espresso mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vintagekruffles.com"
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-peach text-xs text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-burnt"
                id="input-admin-email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-espresso mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-peach text-xs text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-burnt"
                id="input-admin-password"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-golden/20 border border-golden/40 text-[11px] text-espresso leading-snug">
            <strong>Default seed credentials:</strong><br />
            Email: <code className="font-mono font-bold">admin@vintagekruffles.com</code><br />
            Password: <code className="font-mono font-bold">Admin@Kruffles2026</code>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-burnt hover:bg-burnt-dark text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-warm transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            id="btn-admin-login"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-peach/80 text-center">
          <button
            onClick={onBackToSite}
            className="text-xs text-stone-500 hover:text-espresso font-bold transition-colors"
          >
            ← Return to Vintage Kruffles Public Site
          </button>
        </div>

      </div>
    </div>
  );
};
