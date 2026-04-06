import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

dotenv.config({ path: '.env.local' });

// --- SQLite (local dev) ---
// export default defineConfig({
//   datasource: { url: 'file:./dev.db' },
//   migrations: { path: 'prisma/migrations', seed: 'npx tsx prisma/seed.ts' },
//   schema: 'prisma/schema.prisma',
// });

// --- PostgreSQL (Vercel) ---
export default defineConfig({
  datasource: {
    url: process.env.POSTGRES_PRISMA_URL!,
  },
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx tsx prisma/seed.ts',
  },
  schema: 'prisma/schema.prisma',
});
