import { cn, getAvatarUrl } from '@/lib/utils';

type Props = {
  name: string;
  variant?: 'speaker' | 'user';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClasses = {
  lg: 'size-8',
  md: 'size-7',
  sm: 'size-5',
  xs: 'size-4',
} as const;

export function Avatar({ name, variant = 'user', size = 'sm', className }: Props) {
  return (
    <img
      src={getAvatarUrl(name, variant)}
      alt=""
      className={cn('shrink-0 rounded-full', sizeClasses[size], className)}
    />
  );
}
