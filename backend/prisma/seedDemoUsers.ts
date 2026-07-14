import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = 'Password123!';

const DEMO_USERS = [
  { name: 'Alice Admin', email: 'admin@example.com', role: Role.ADMIN },
  { name: 'Jane Agent', email: 'agent@example.com', role: Role.AGENT },
  { name: 'Bob User', email: 'user@example.com', role: Role.USER },
] as const;

/**
 * Upserts demo login accounts without wiping existing data.
 * Safe to run against production for demo credentials.
 */
async function main() {
  console.log('Upserting demo users...');

  const passwordHash = await hashPassword(DEFAULT_PASSWORD);

  for (const demo of DEMO_USERS) {
    const user = await prisma.user.upsert({
      where: { email: demo.email },
      create: {
        name: demo.name,
        email: demo.email,
        role: demo.role,
        passwordHash,
      },
      update: {
        name: demo.name,
        role: demo.role,
        passwordHash,
      },
    });
    console.log(`  ${demo.role}: ${user.email}`);
  }

  console.log(`Done. Password for all demo accounts: ${DEFAULT_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error('Demo seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
