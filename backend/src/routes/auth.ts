import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../lib/db.js';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'vintage_kruffles_jwt_secret_key_change_in_prod_2026';

// Admin Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const admin = db.findAdminByEmail(email);
    if (!admin) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal login error.', details: err.message });
  }
});

// Check Current Admin Session
router.get('/me', requireAdmin, (req: AuthenticatedRequest, res: Response): void => {
  res.json({
    success: true,
    admin: req.admin
  });
});

export default router;
