import { Router, Request, Response } from 'express';
import { db } from '../lib/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public: Get currently active Today's Special
router.get('/', (_req: Request, res: Response): void => {
  try {
    const specials = db.getTodaySpecials(true);
    res.json({ success: true, specials, currentSpecial: specials[0] || null });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch Today's Special." });
  }
});

// Admin: Get all specials
router.get('/all', requireAdmin, (_req: Request, res: Response): void => {
  try {
    const specials = db.getTodaySpecials(false);
    res.json({ success: true, specials });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch specials history.' });
  }
});

// Admin: Create Today's Special
router.post('/', requireAdmin, (req: Request, res: Response): void => {
  try {
    const { menuItemId, title, description, image, originalPrice, offerPrice, badgeText, startDate, endDate, isActive } = req.body;
    if (!title || offerPrice === undefined || !endDate) {
      res.status(400).json({ error: 'Title, offerPrice, and endDate are required.' });
      return;
    }

    const newSpecial = db.createTodaySpecial({
      menuItemId: menuItemId ? Number(menuItemId) : null,
      title,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1568051243851-f9b136146e97?auto=format&fit=crop&w=1200&q=80',
      originalPrice: originalPrice ? Number(originalPrice) : null,
      offerPrice: Number(offerPrice),
      badgeText: badgeText || "Today's Beach Special",
      startDate: startDate || new Date().toISOString(),
      endDate,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    res.status(201).json({ success: true, special: newSpecial });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to create Today's Special." });
  }
});

// Admin: Update Today's Special
router.put('/:id', requireAdmin, (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    if (req.body.offerPrice !== undefined) req.body.offerPrice = Number(req.body.offerPrice);
    if (req.body.originalPrice !== undefined) req.body.originalPrice = Number(req.body.originalPrice);

    const updated = db.updateTodaySpecial(id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Special not found.' });
      return;
    }
    res.json({ success: true, special: updated });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update Today's Special." });
  }
});

export default router;
