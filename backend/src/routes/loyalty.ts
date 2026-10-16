import { Router, Request, Response } from 'express';
import { db } from '../lib/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public: Lookup loyalty account by phone number
router.get('/lookup/:phone', (req: Request, res: Response): void => {
  try {
    const rawPhone = req.params.phone.replace(/[^0-9]/g, '');
    if (rawPhone.length < 10) {
      res.status(400).json({ error: 'Please provide a valid 10-digit phone number.' });
      return;
    }
    const phone = rawPhone.slice(-10);
    const account = db.getLoyaltyAccount(phone);

    // Calculate visits needed for next reward
    const visitsRemaining = Math.max(0, 10 - account.currentCycleVisits);
    const isBirthdayMonth = account.birthdayMonth !== null && (new Date().getMonth() + 1) === account.birthdayMonth;

    res.json({
      success: true,
      programName: 'Kruffles Sweet Rewards',
      account: {
        ...account,
        visitsRemaining,
        isBirthdayMonth,
        isRewardReady: account.rewardsAvailable > 0
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to lookup loyalty account.' });
  }
});

// Public: Save Birthday for Member
router.post('/birthday', (req: Request, res: Response): void => {
  try {
    const { phone, month, day, name } = req.body;
    if (!phone || !month || !day) {
      res.status(400).json({ error: 'Phone number, birthday month, and day are required.' });
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    if (name) {
      db.findOrCreateCustomer(cleanPhone, name);
    }
    const updated = db.updateLoyaltyBirthday(cleanPhone, Number(month), Number(day));

    res.json({
      success: true,
      message: 'Birthday saved! Your 20% Sweet Birthday discount will be ready during your birthday month.',
      account: updated
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update birthday.' });
  }
});

// Admin: Get all loyalty members
router.get('/all', requireAdmin, (_req: Request, res: Response): void => {
  try {
    const accounts = db.getAllLoyaltyAccounts();
    res.json({ success: true, accounts });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch loyalty accounts.' });
  }
});

// Admin: Manual credit of a visit
router.post('/credit', requireAdmin, (req: Request, res: Response): void => {
  try {
    const { phone, customerName } = req.body;
    if (!phone) {
      res.status(400).json({ error: 'Phone number is required.' });
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const updated = db.creditLoyaltyVisit(cleanPhone, undefined, customerName);
    res.json({ success: true, message: 'Visit credited successfully!', account: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to credit visit.' });
  }
});

// Admin: Redeem reward
router.post('/redeem', requireAdmin, (req: Request, res: Response): void => {
  try {
    const { phone, description } = req.body;
    if (!phone) {
      res.status(400).json({ error: 'Phone number is required.' });
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const updated = db.redeemReward(cleanPhone, description);
    res.json({ success: true, message: 'Reward successfully redeemed!', account: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to redeem reward.' });
  }
});

export default router;
