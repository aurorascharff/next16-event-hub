// --- SQLite (local dev) ---
// import { PrismaLibSql } from '@prisma/adapter-libsql';
// import { PrismaClient } from '@/generated/prisma/client';
// const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
// export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

// --- PostgreSQL (Vercel) ---
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
