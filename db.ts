// --- SQLite (local dev) ---
// import { PrismaLibSql } from '@prisma/adapter-libsql';
// import { PrismaClient } from '@/generated/prisma/client';
// const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
// export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// --- PostgreSQL (Vercel) ---
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_PRISMA_URL });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
