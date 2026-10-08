interface PrefixedInputProps extends React.ComponentProps<"input"> {
  prefix: string;
}

export function PrefixedInput({ prefix, ...props }: PrefixedInputProps) {
  return (
    <div className="flex items-center overflow-hidden rounded-lg border focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive">
      <span className="shrink-0 border-r bg-muted px-3 py-1.5 text-sm text-muted-foreground">
        {prefix}
      </span>
      <input
        className="h-8 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
        {...props}
      />
    </div>
  );
}
