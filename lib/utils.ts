import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export const NEIGHBORHOODS = [
  'South Beach',
  'Wynwood',
  'Little Havana',
  'Brickell',
  'Downtown',
  'Coconut Grove',
  'Design District',
  'Coral Gables',
] as const;

export const CATEGORIES = [
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Bar', value: 'bar' },
  { label: 'Beach', value: 'beach' },
  { label: 'Art', value: 'art' },
  { label: 'Nightlife', value: 'nightlife' },
  { label: 'Café', value: 'cafe' },
] as const;

export function getCategoryLabel(value: string): string {
  return CATEGORIES.find(c => {return c.value === value})?.label ?? value;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    art: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    bar: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    beach: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    cafe: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    nightlife: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    restaurant: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };
  return colors[category] ?? 'bg-muted text-muted-foreground';
}

export async function slow(delay: number = 700) {
  await new Promise(resolve => {
    return setTimeout(resolve, delay);
  });
}
