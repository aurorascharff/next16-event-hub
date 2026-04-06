import { defineConfig } from 'prisma/config';

// --- PostgreSQL (Vercel) ---
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

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

// --- SQLite (local dev) ---
// export default defineConfig({
//   datasource: { url: 'file:./dev.db' },
//   migrations: { path: 'prisma/migrations', seed: 'npx tsx prisma/seed.ts' },
//   schema: 'prisma/schema.prisma',
// });
