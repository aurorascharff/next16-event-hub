'use client';

import { useEffect, useRef } from 'react';

export function useFlashOnChange(items: { id: string; votes: number }[]) {
  const prevVotes = useRef<Map<string, number> | null>(null);

  useEffect(() => {
    const prev = prevVotes.current;
    prevVotes.current = new Map(
      items.map(q => {
        return [q.id, q.votes];
      }),
    );
    if (!prev) return;
    for (const q of items) {
      if (prev.get(q.id) !== undefined && prev.get(q.id) !== q.votes) {
        const el = document.querySelector(`[data-question-id="${q.id}"]`);
        if (!el) continue;
        el.classList.remove('animate-flash');
        void (el as HTMLElement).offsetWidth;
        el.classList.add('animate-flash');
      }
    }
  }, [items]);
}
