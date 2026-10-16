import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../lib/db.js';

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: number;
    email: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'vintage_kruffles_jwt_secret_key_change_in_prod_2026';

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required. Missing Bearer token.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string };

    const admin = db.findAdminById(decoded.id);
    if (!admin) {
      res.status(401).json({ error: 'Admin account not found or expired.' });
      return;
    }

    req.admin = {
      id: admin.id,
      email: admin.email,
      role: admin.role
    };

    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired authentication token.' });
    return;
  }
};
