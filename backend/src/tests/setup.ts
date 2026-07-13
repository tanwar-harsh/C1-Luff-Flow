import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

// Fall back to .env when .env.test still points at local PostgreSQL (e.g. Neon in .env only)
const dbUrl = process.env.DATABASE_URL ?? '';
if (!dbUrl || dbUrl.includes('localhost')) {
  dotenv.config({ override: true });
}
