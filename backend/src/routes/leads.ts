import { Router, Request, Response } from 'express';
import { db } from '../lib/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public: Collect Lead from "Sweet Deals Are Waiting!" popup
router.post('/', (req: Request, res: Response): void => {
  try {
    const { name, phone, consent } = req.body;

    if (!phone) {
      res.status(400).json({ error: 'Indian mobile number is required.' });
      return;
    }

    if (consent !== true) {
      res.status(400).json({ error: 'Explicit promotional consent is required.' });
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    const recorded = db.recordMarketingConsent({
      phone: cleanPhone.slice(-10),
      name: name ? name.trim() : undefined,
      consentType: 'WHATSAPP_PROMO',
      source: 'WEBSITE_POPUP',
      ipAddress: req.ip || req.socket.remoteAddress
    });

    res.status(201).json({
      success: true,
      message: 'Welcome to the Vintage Kruffles Family! You are signed up for exclusive offers and surprises.',
      lead: recorded
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to record consent.' });
  }
});

// Public: Opt-out from promotional WhatsApp messages
router.post('/opt-out', (req: Request, res: Response): void => {
  try {
    const { phone } = req.body;
    if (!phone) {
      res.status(400).json({ error: 'Phone number is required.' });
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    db.optOutMarketing(cleanPhone);

    res.json({
      success: true,
      message: 'You have been opted out of promotional communications. We respect your privacy.'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to process opt-out.' });
  }
});

// Admin: View all leads
router.get('/', requireAdmin, (_req: Request, res: Response): void => {
  try {
    const leads = db.getAllLeads();
    res.json({ success: true, leads });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch leads.' });
  }
});

export default router;
