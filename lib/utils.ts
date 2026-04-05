import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export const DAYS = [
  { label: 'Day 1', value: 'day-1' },
  { label: 'Day 2', value: 'day-2' },
  { label: 'Workshops', value: 'workshop' },
] as const;

export const TRACKS = [
  { label: 'Main', value: 'main' },
  { label: 'Community', value: 'community' },
] as const;

export function getDayLabel(value: string): string {
  return DAYS.find(d => {return d.value === value})?.label ?? value;
}

export function getAvatarUrl(name: string, style: 'shapes' | 'thumbs' = 'thumbs'): string {
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(name)}`;
}

export async function slow(delay: number = 700) {
  await new Promise(resolve => {
    return setTimeout(resolve, delay);
  });
}
