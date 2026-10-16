import { Router, Request, Response } from 'express';
import { db } from '../lib/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public: Get gallery images
router.get('/', (_req: Request, res: Response): void => {
  try {
    const gallery = db.getGallery();
    res.json({ success: true, gallery });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch gallery images.' });
  }
});

// Admin: Add gallery image
router.post('/', requireAdmin, (req: Request, res: Response): void => {
  try {
    const { title, caption, imageUrl, category, sortOrder } = req.body;
    if (!title || !imageUrl) {
      res.status(400).json({ error: 'Title and image URL are required.' });
      return;
    }

    const newImage = db.createGalleryImage({
      title: title.trim(),
      caption: caption || '',
      imageUrl,
      category: category || 'Waffles',
      sortOrder: Number(sortOrder) || 0
    });

    res.status(201).json({ success: true, image: newImage });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add gallery image.' });
  }
});

// Admin: Delete gallery image
router.delete('/:id', requireAdmin, (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = db.deleteGalleryImage(id);
    if (!deleted) {
      res.status(404).json({ error: 'Image not found.' });
      return;
    }
    res.json({ success: true, message: 'Gallery image deleted.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete gallery image.' });
  }
});

export default router;
