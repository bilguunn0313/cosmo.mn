interface PanelHeaderProps {
  step?: number;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function PanelHeader({
  step,
  title,
  description,
  action,
}: PanelHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="grid gap-1">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          {step !== undefined && (
            <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {step}
            </span>
          )}
          {title}
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
