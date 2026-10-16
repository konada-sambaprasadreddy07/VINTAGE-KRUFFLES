import { Router, Request, Response } from 'express';
import QRCode from 'qrcode';
import { db } from '../lib/db.js';

const router = Router();

// Generate QR Code data for Digital Menu
router.get('/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = db.getSettings();
    const defaultUrl = process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/#menu` : 'https://vintagekruffles.com/#menu';
    const targetUrl = (req.query.url as string) || defaultUrl;

    // High resolution PNG Data URL
    const pngDataUrl = await QRCode.toDataURL(targetUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 480,
      color: {
        dark: '#3B261C', // Espresso brown for contrast
        light: '#FFFFFF'
      }
    });

    // SVG string for scalable vector export
    const svgString = await QRCode.toString(targetUrl, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#3B261C',
        light: '#FFFFFF'
      }
    });

    res.json({
      success: true,
      targetUrl,
      pngDataUrl,
      svgString,
      branding: {
        cafeName: settings.CAFE_NAME || 'VINTAGE KRUFFLES',
        location: settings.LOCATION_TEXT || 'Near RK Beach, Visakhapatnam',
        tagline: 'Scan to View Our Fresh Digital Menu & Daily Specials'
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate QR code.', details: err.message });
  }
});

export default router;
