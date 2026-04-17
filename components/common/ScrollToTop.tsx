'use client';

import { useLayoutEffect } from 'react';

export function ScrollToTop() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
