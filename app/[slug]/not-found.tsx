import { FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { BackButton } from '@/components/BackButton';
import { StatusCard } from '@/components/errors/StatusCard';
import { buttonVariants } from '@/components/ui/button';

export default function SpotNotFound() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <BackButton href="/" size="sm" className="mb-8">
          ← Back to spots
        </BackButton>
        <StatusCard
          icon={FileQuestion}
          title="Spot Not Found"
          description="The spot you're looking for doesn't exist or has been removed."
        >
          <Link href="/" className={buttonVariants({ variant: 'default' })}>
            Back to spots
          </Link>
        </StatusCard>
      </div>
    </div>
  );
}
