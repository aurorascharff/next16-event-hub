// To switch databases, uncomment one block and comment the other.
// After switching, also update: prisma/schema.prisma, prisma.config.ts, prisma/seed.ts
// Then run: pnpm run prisma.generate && pnpm run prisma.push && pnpm run prisma.seed

// --- SQLite (local dev) ---
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '@/generated/prisma/client';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });

// --- PostgreSQL (Vercel) ---
// import { PrismaPg } from '@prisma/adapter-pg';
// import { PrismaClient } from '@/generated/prisma/client';
//
// const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_PRISMA_URL });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
