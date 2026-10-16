import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X, Download, Printer, QrCode, Globe, Sparkles } from 'lucide-react';

interface PrintableQRMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName?: string;
  location?: string;
}

export const PrintableQRMenuModal: React.FC<PrintableQRMenuModalProps> = ({
  isOpen,
  onClose,
  brandName = 'VINTAGE KRUFFLES',
  location = 'Near RK Beach, Visakhapatnam'
}) => {
  const [targetUrl, setTargetUrl] = useState('https://vintagekruffles.com/#menu');
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);
  const [svgString, setSvgString] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadQRCode();
    }
  }, [isOpen]);

  const loadQRCode = async () => {
    setLoading(true);
    try {
      const res = await api.generateQRCode(targetUrl);
      if (res.success) {
        setPngDataUrl(res.pngDataUrl);
        setSvgString(res.svgString);
      }
    } catch (err) {
      console.error('Failed to load QR code:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleDownloadPNG = () => {
    if (!pngDataUrl) return;
    const link = document.createElement('a');
    link.href = pngDataUrl;
    link.download = `vintage-kruffles-digital-menu-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSVG = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vintage-kruffles-digital-menu-qr.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-peach/80">
        
        {/* Header */}
        <div className="p-5 bg-cream-warm border-b border-peach flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-burnt" />
            <h3 className="font-serif font-bold text-lg text-espresso">Digital Menu QR Code Card</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-espresso rounded-lg hover:bg-peach/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Configurable URL Bar */}
          <div>
            <label className="block text-xs font-bold text-espresso mb-1">
              Production Digital Menu URL (Never use localhost for real customers)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://vintagekruffles.com/#menu"
                className="flex-1 px-3 py-2 bg-cream text-xs rounded-xl border border-peach font-mono"
              />
              <button
                onClick={loadQRCode}
                className="px-3 py-2 bg-espresso text-cream text-xs font-bold rounded-xl hover:bg-espresso-light transition-colors"
              >
                Update QR
              </button>
            </div>
          </div>

          {/* Printable Brand Card Preview */}
          <div
            id="printable-qr-menu"
            className="bg-gradient-to-b from-cream via-cream-warm to-cream p-8 rounded-3xl border-2 border-burnt/30 text-center shadow-md flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full shadow-md mb-3 overflow-hidden bg-white p-1 border border-golden/40">
              <img src="/logo.png" alt="Vintage Kruffles Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <h2 className="text-2xl font-serif font-black text-espresso tracking-tight">
              {brandName}
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest text-golden-dark mt-0.5">
              PANCAKES & WAFFLES • {location}
            </p>

            {/* QR Image Box */}
            <div className="my-6 p-4 bg-white rounded-2xl shadow-warm border-2 border-golden/30 inline-block">
              {loading || !pngDataUrl ? (
                <div className="w-52 h-52 flex items-center justify-center text-stone-400 text-xs">
                  Generating high-res QR...
                </div>
              ) : (
                <img
                  src={pngDataUrl}
                  alt="Vintage Kruffles Digital Menu QR Code"
                  className="w-52 h-52 object-contain"
                />
              )}
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-burnt text-white text-[11px] font-bold rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-golden" /> Scan Camera to View Live Menu
            </div>
            <p className="text-xs text-espresso/70 max-w-xs mx-auto">
              Browse our freshly made Belgian waffles, daily specials & pre-order pickup right from your phone!
            </p>
            <div className="mt-4 pt-3 border-t border-peach/60 text-[10px] text-stone-400 font-mono">
              {targetUrl}
            </div>
          </div>

          {/* Download & Print Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleDownloadPNG}
              className="inline-flex items-center gap-2 bg-burnt hover:bg-burnt-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-warm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>

            <button
              onClick={handleDownloadSVG}
              className="inline-flex items-center gap-2 bg-espresso hover:bg-espresso-light text-cream font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <Download className="w-4 h-4 text-golden" />
              <span>Export SVG</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-white hover:bg-peach/30 text-espresso font-bold text-xs px-4 py-2.5 rounded-xl border border-peach shadow-sm transition-all"
            >
              <Printer className="w-4 h-4 text-burnt" />
              <span>Print Table Standee</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
