'use client';

import { ErrorCard } from '@/components/errors/ErrorCard';
import { useTrackError } from '@/hooks/useTrackError';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function NewSpotError({ error, reset }: Props) {
  useTrackError(error);
  return <ErrorCard error={error} reset={reset} description="An unexpected error occurred while adding this spot." />;
}
