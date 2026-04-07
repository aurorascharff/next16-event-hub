import { X } from 'lucide-react';
import { logout } from '@/data/actions/auth';
import { getCurrentUser } from '@/data/queries/auth';
import { Avatar } from './Avatar';

export async function UserMenu() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5 transition-colors"
        aria-label="Clear name"
      >
        <Avatar name={user} size="xs" />
        <span className="max-w-20 truncate text-xs">{user}</span>
        <X className="size-3" />
      </button>
    </form>
  );
}
