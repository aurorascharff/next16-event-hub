import { FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { BackButton } from '@/components/BackButton';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SpotNotFound() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <BackButton href="/" size="sm" className="mb-8">
          ← Back to spots
        </BackButton>
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-2">
              <FileQuestion className="text-muted-foreground size-8" />
            </div>
            <CardTitle className="text-2xl">Spot Not Found</CardTitle>
            <CardDescription className="text-base">
              The spot you&apos;re looking for doesn&apos;t exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/" className={buttonVariants({ variant: 'default' })}>
              Back to spots
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
