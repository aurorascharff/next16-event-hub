'use client';

import { QrCode } from 'lucide-react';
import { useParams } from 'next/navigation';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Props = {
  eventName: string;
};

export function QrCodeDialog({ eventName }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const [svg, setSvg] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const url = typeof window !== 'undefined' ? `${window.location.origin}/${slug}/questions` : '';

  useEffect(() => {
    if (!open || !url) return;
    QRCode.toString(url, {
      type: 'svg',
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
      width: 300,
    }).then(setSvg);
  }, [open, url]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="ghost" size="icon-sm" className="text-muted-foreground shrink-0" />}
      >
        <QrCode className="size-4" />
      </DialogTrigger>
      <DialogContent className="items-center text-center">
        <DialogHeader className="items-center">
          <DialogTitle>{eventName}</DialogTitle>
          <DialogDescription>Scan to join the Q&A</DialogDescription>
        </DialogHeader>
        {svg ? (
          <div className="mx-auto w-64 overflow-hidden rounded-xl" dangerouslySetInnerHTML={{ __html: svg }} />
        ) : (
          <div className="mx-auto flex size-64 items-center justify-center">
            <QrCode className="text-muted-foreground size-8 animate-pulse" />
          </div>
        )}
        <p className="text-muted-foreground break-all text-xs">{url}</p>
      </DialogContent>
    </Dialog>
  );
}
