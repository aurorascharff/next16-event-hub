import Image from 'next/image';
import { cn, getAvatarUrl } from '@/lib/utils';

type Props = {
  name: string;
  variant?: 'speaker' | 'user';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  title?: string;
};

const sizeClasses = {
  lg: 'size-8',
  md: 'size-7',
  sm: 'size-5',
  xs: 'size-4',
} as const;

const sizePixels = {
  lg: 32,
  md: 28,
  sm: 20,
  xs: 16,
} as const;

export function Avatar({ name, variant = 'user', size = 'sm', className, title }: Props) {
  const px = sizePixels[size];
  return (
    <Image
      src={getAvatarUrl(name, variant)}
      alt=""
      width={px}
      height={px}
      title={title}
      unoptimized
      className={cn('shrink-0 rounded-full', sizeClasses[size], className)}
    />
  );
}
