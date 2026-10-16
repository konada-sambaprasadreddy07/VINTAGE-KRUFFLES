import { Router, Request, Response } from 'express';
import { db } from '../lib/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public: Get menu items (supports ?categoryId=..., ?search=..., ?onlyAvailable=true)
router.get('/', (req: Request, res: Response): void => {
  try {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string, 10) : undefined;
    const search = req.query.search as string | undefined;
    const onlyAvailable = req.query.onlyAvailable === 'false' ? false : true;

    const items = db.getMenuItems({ categoryId, search, onlyAvailable });
    res.json({ success: true, items });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch menu items.' });
  }
});

// Admin: Get all items including unavailable
router.get('/all', requireAdmin, (req: Request, res: Response): void => {
  try {
    const items = db.getMenuItems({ onlyAvailable: false });
    res.json({ success: true, items });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch all menu items.' });
  }
});

// Public: Get single menu item by ID
router.get('/:id', (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    const item = db.getMenuItemById(id);
    if (!item) {
      res.status(404).json({ error: 'Menu item not found.' });
      return;
    }
    res.json({ success: true, item });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch menu item.' });
  }
});

// Admin: Create menu item
router.post('/', requireAdmin, (req: Request, res: Response): void => {
  try {
    const {
      name,
      slug,
      description,
      price,
      image,
      categoryId,
      isAvailable,
      isBestseller,
      isTodaySpecial,
      isVeg,
      prepTimeMins,
      calories,
      allergens
    } = req.body;

    if (!name || price === undefined || !categoryId) {
      res.status(400).json({ error: 'Name, price, and categoryId are required.' });
      return;
    }

    const newItem = db.createMenuItem({
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || '',
      price: Number(price),
      image: image || 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80',
      categoryId: Number(categoryId),
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      isBestseller: Boolean(isBestseller),
      isTodaySpecial: Boolean(isTodaySpecial),
      isVeg: isVeg !== undefined ? Boolean(isVeg) : true,
      prepTimeMins: Number(prepTimeMins) || 15,
      calories: calories || '',
      allergens: allergens || ''
    });

    res.status(201).json({ success: true, item: newItem });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create menu item.' });
  }
});

// Admin: Update menu item
router.put('/:id', requireAdmin, (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    if (req.body.price !== undefined) {
      req.body.price = Number(req.body.price);
    }
    if (req.body.categoryId !== undefined) {
      req.body.categoryId = Number(req.body.categoryId);
    }

    const updated = db.updateMenuItem(id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Menu item not found.' });
      return;
    }
    res.json({ success: true, item: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update menu item.' });
  }
});

// Admin: Delete menu item
router.delete('/:id', requireAdmin, (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = db.deleteMenuItem(id);
    if (!deleted) {
      res.status(404).json({ error: 'Menu item not found.' });
      return;
    }
    res.json({ success: true, message: 'Menu item deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete menu item.' });
  }
});

export default router;
