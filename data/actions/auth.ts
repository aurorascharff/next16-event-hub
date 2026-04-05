'use server';

import { refresh } from 'next/cache';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'event-hub-user';

export async function setUserName(formData: FormData) {
  const name = (formData.get('name') as string)?.trim();
  if (!name || name.length < 1 || name.length > 30) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, name, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
  });

  refresh();
}
