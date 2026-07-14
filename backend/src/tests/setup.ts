import dotenv from 'dotenv';

// Use only .env.test — never fall back to .env (may point at shared Neon production).
dotenv.config({ path: '.env.test' });
