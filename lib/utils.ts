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

export function timeAgo(date: Date | string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export const DAYS = [
  { label: 'Day 1', value: 'day-1' },
  { label: 'Day 2', value: 'day-2' },
] as const;

export const LABELS = [
  'react',
  'performance',
  'ai',
  'mobile',
  'design',
  'typescript',
  'security',
  'tooling',
  'css',
  'career',
  'social',
] as const;

export function parseLabels(labels: string): string[] {
  return labels
    ? labels
        .split(',')
        .map(l => {
          return l.trim();
        })
        .filter(Boolean)
    : [];
}

export function getDayLabel(value: string): string {
  return (
    DAYS.find(d => {
      return d.value === value;
    })?.label ?? value
  );
}

export function getAvatarUrl(name: string, variant: 'speaker' | 'user' = 'user'): string {
  const bg = variant === 'speaker' ? 'f472b6' : '52525b,71717a,a1a1aa';
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=${bg}&textColor=ffffff&fontSize=40`;
}

export function parseTime(time: string): number {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export async function slow(delay: number = 700) {
  await new Promise(resolve => {
    return setTimeout(resolve, delay);
  });
}
