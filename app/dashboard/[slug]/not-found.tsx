import { FileQuestion } from 'lucide-react';
import { BackButton } from '@/components/BackButton';
import { StatusCard } from '@/components/errors/StatusCard';

export default function SpotNotFound() {
  return (
    <StatusCard
      icon={FileQuestion}
      title="Spot Not Found"
      description="The spot you're looking for doesn't exist or has been removed."
    >
      <BackButton href="/dashboard" variant="default">
        Back to spots
      </BackButton>
    </StatusCard>
  );
}
