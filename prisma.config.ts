import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: 'file:./dev.db',
  },
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx tsx prisma/seed.ts',
  },
  schema: 'prisma/schema.prisma',
});
