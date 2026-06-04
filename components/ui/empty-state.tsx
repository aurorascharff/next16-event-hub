type Props = {
  message: string;
  hint?: string;
  icon?: React.ReactNode;
};

export function EmptyState({ message, hint, icon }: Props) {
  return (
    <div className="py-6 text-center">
      {icon && <div className="text-muted-foreground/40 mb-3 flex justify-center">{icon}</div>}
      <p className="text-muted-foreground text-xs">{message}</p>
      {hint && <p className="text-muted-foreground mt-1 text-xs">{hint}</p>}
    </div>
  );
}
