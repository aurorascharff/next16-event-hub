import 'server-only';

import { cookies } from 'next/headers';
import { cache } from 'react';

const COOKIE_NAME = 'event-hub-user';

export const getCurrentUser = cache(async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
});
