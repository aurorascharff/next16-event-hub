type Props = {
  message: string;
  hint?: string;
};

export function EmptyState({ message, hint }: Props) {
  return (
    <div className="py-6 text-center">
      <p className="text-muted-foreground text-xs">{message}</p>
      {hint && <p className="text-muted-foreground mt-1 text-xs">{hint}</p>}
    </div>
  );
}
