import { Router, Request, Response } from 'express';
import { db } from '../lib/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Publicly accessible cafe settings
router.get('/', (_req: Request, res: Response): void => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, settings });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch business settings.' });
  }
});

// Admin: Get all settings with descriptions
router.get('/all', requireAdmin, (_req: Request, res: Response): void => {
  try {
    const settingsList = db.getAllSettingsList();
    res.json({ success: true, settings: settingsList });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch admin settings list.' });
  }
});

// Admin: Update settings
router.put('/', requireAdmin, (req: Request, res: Response): void => {
  try {
    const { updates } = req.body; // Expects object { KEY: VALUE } or array [{ key, value }]
    if (!updates) {
      res.status(400).json({ error: 'Updates object is required.' });
      return;
    }

    if (Array.isArray(updates)) {
      for (const item of updates) {
        if (item.key && typeof item.value === 'string') {
          db.updateSetting(item.key, item.value);
        }
      }
    } else if (typeof updates === 'object') {
      for (const [key, value] of Object.entries(updates)) {
        if (typeof value === 'string') {
          db.updateSetting(key, value);
        }
      }
    }

    const updated = db.getSettings();
    res.json({ success: true, message: 'Settings updated successfully.', settings: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update settings.' });
  }
});

// Admin Dashboard stats
router.get('/dashboard-stats', requireAdmin, (_req: Request, res: Response): void => {
  try {
    const stats = db.getDashboardStats();
    res.json({ success: true, stats });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats.' });
  }
});

export default router;
