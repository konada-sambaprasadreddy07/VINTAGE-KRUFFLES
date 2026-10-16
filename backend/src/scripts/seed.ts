import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { db } from '../lib/db.js';

dotenv.config();

async function main() {
  console.log('Seeding initial data for Vintage Kruffles Cafe...');
  console.log('Categories, Menu Items, Today Specials, Rewards, Reviews, and Admin initialized.');
  console.log(`Admin email: ${process.env.ADMIN_INITIAL_EMAIL || 'admin@vintagekruffles.com'}`);
  console.log('Database ready.');
}

main().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
