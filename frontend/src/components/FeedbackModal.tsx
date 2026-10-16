import React, { useState } from 'react';
import { api } from '../services/api';
import { X, Star, MessageSquarePlus, CheckCircle2, AlertCircle } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [overallRating, setOverallRating] = useState(5);
  const [foodQualityRating, setFoodQualityRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderReference, setOrderReference] = useState('');
  const [comments, setComments] = useState('');
  const [allowFollowUp, setAllowFollowUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!comments.trim()) {
      setError('Please provide comments regarding your cafe experience.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitFeedback({
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        overallRating,
        foodQualityRating,
        serviceRating,
        orderReference: orderReference.trim() || undefined,
        comments: comments.trim(),
        allowFollowUp
      });

      if (res.success) {
        setSubmitted(true);
        if (onSuccess) onSuccess('Thank you! Your feedback has been received and sent for verification.');
      } else {
        setError(res.error || 'Failed to submit feedback.');
      }
    } catch {
      setError('Network error submitting feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (value: number, onChange: (v: number) => void) => {
    return (
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => onChange(star)}
            className="p-1 focus:outline-none transition-transform hover:scale-110"
            aria-label={`Rate ${star} stars`}
          >
            <Star
              className={`w-6 h-6 ${
                star <= value ? 'fill-golden text-golden' : 'fill-stone-200 text-stone-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-peach/80 max-h-[90vh] flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-5 bg-cream-warm border-b border-peach flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-burnt" />
            <h3 className="font-serif font-bold text-lg text-espresso">Share Your Experience</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-espresso rounded-lg hover:bg-peach/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-serif font-bold text-espresso">
                Thank You for Helping Us Grow!
              </h4>
              <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                Your feedback helps our kitchen team craft sweeter moments at RK Beach. Verified reviews are published upon team moderation.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-burnt text-white font-bold text-xs rounded-xl shadow-warm"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Star Ratings Grid */}
              <div className="p-4 rounded-2xl bg-cream-warm border border-peach/60 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-espresso">Overall Experience *</span>
                  {renderStars(overallRating, setOverallRating)}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-peach/40">
                  <span className="text-xs font-bold text-espresso">Food Quality (Waffles & Crunch)</span>
                  {renderStars(foodQualityRating, setFoodQualityRating)}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-peach/40">
                  <span className="text-xs font-bold text-espresso">Service & Ambience</span>
                  {renderStars(serviceRating, setServiceRating)}
                </div>
              </div>

              {/* Written Comments */}
              <div>
                <label className="block text-xs font-bold text-espresso mb-1">
                  Your Comments & Suggestions *
                </label>
                <textarea
                  required
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Tell us what you enjoyed most or what we can improve..."
                  className="w-full px-4 py-2.5 bg-cream rounded-xl border border-peach text-xs text-espresso focus:outline-none focus:ring-2 focus:ring-burnt"
                  id="textarea-feedback-comments"
                />
              </div>

              {/* Optional Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">Your Name (Optional)</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Sneha"
                    className="w-full px-3 py-2 bg-cream rounded-xl border border-peach text-xs text-espresso"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-espresso mb-1">Order # (Optional)</label>
                  <input
                    type="text"
                    value={orderReference}
                    onChange={(e) => setOrderReference(e.target.value)}
                    placeholder="e.g. VK-2026-1001"
                    className="w-full px-3 py-2 bg-cream rounded-xl border border-peach text-xs text-espresso font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-espresso mb-1">Mobile Number (Optional)</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="w-full px-3 py-2 bg-cream rounded-xl border border-peach text-xs text-espresso"
                />
              </div>

              {/* Follow-up consent */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-600">
                <input
                  type="checkbox"
                  checked={allowFollowUp}
                  onChange={(e) => setAllowFollowUp(e.target.checked)}
                  className="mt-0.5 rounded text-burnt focus:ring-burnt"
                />
                <span>You may follow up with me regarding my experience if needed.</span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-burnt hover:bg-burnt-dark text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-warm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                id="btn-submit-feedback"
              >
                {submitting ? 'Submitting...' : 'Submit Cafe Feedback'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
