import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/data/actions/auth';
import { getCurrentUser } from '@/data/queries/auth';
import { Avatar } from './Avatar';

export async function UserMenu() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="flex items-center gap-1.5">
      <Avatar name={user} size="xs" />
      <span className="text-muted-foreground max-w-20 truncate text-xs">{user}</span>
      <form action={logout}>
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground size-auto rounded p-1"
          aria-label="Log out"
        >
          <LogOut className="size-3" />
        </Button>
      </form>
    </div>
  );
}
