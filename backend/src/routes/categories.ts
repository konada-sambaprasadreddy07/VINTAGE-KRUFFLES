import { Router, Request, Response } from 'express';
import { db } from '../lib/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public: Get active categories
router.get('/', (_req: Request, res: Response): void => {
  try {
    const categories = db.getCategories(true);
    res.json({ success: true, categories });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// Admin: Get all categories (including inactive)
router.get('/all', requireAdmin, (_req: Request, res: Response): void => {
  try {
    const categories = db.getCategories(false);
    res.json({ success: true, categories });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// Admin: Create category
router.post('/', requireAdmin, (req: Request, res: Response): void => {
  try {
    const { name, slug, description, icon, sortOrder, isActive } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Category name is required.' });
      return;
    }

    const newCat = db.createCategory({
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || '',
      icon: icon || '🧇',
      sortOrder: Number(sortOrder) || 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    res.status(201).json({ success: true, category: newCat });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create category.' });
  }
});

// Admin: Update category
router.put('/:id', requireAdmin, (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = db.updateCategory(id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }
    res.json({ success: true, category: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update category.' });
  }
});

// Admin: Delete category
router.delete('/:id', requireAdmin, (req: Request, res: Response): void => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = db.deleteCategory(id);
    if (!deleted) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete category.' });
  }
});

export default router;
