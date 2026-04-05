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
      <div className="text-muted-foreground flex flex-col items-center gap-2 py-6 text-xs">
        <MessageCircle className="size-4" />
        <p>No tips yet. Be the first to share one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {tips.map(tip => {
        return (
          <div key={tip.id} className="bg-muted/50 group flex items-start gap-2.5 rounded-lg p-3">
            <div className="bg-primary/15 text-primary flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold">
              {tip.author[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">{tip.author}</span>
                <span className="text-muted-foreground text-[10px]">{formatDate(tip.createdAt)}</span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed">{tip.content}</p>
            </div>
            <DeleteTipButton tipId={tip.id} spotSlug={spotSlug} />
          </div>
        );
      })}
    </div>
  );
}
