import { MessageCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { DeleteTipButton } from './DeleteTipButton';

type Tip = {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  spotSlug: string;
};

type Props = {
  tips: Tip[];
  spotSlug: string;
};

export function TipList({ tips, spotSlug }: Props) {
  if (tips.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center gap-2 py-8 text-sm">
        <MessageCircle className="size-5" />
        <p>No tips yet. Be the first to share one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tips.map(tip => {
        return (
          <div key={tip.id} className="group flex items-start gap-3">
            <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
              {tip.author[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{tip.author}</span>
                <span className="text-muted-foreground text-xs">{formatDate(tip.createdAt)}</span>
              </div>
              <p className="mt-0.5 text-sm leading-relaxed">{tip.content}</p>
            </div>
            <DeleteTipButton tipId={tip.id} spotSlug={spotSlug} />
          </div>
        );
      })}
    </div>
  );
}
