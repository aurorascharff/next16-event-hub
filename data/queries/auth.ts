import 'server-only';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'event-hub-user';

export async function getCurrentUser(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}
