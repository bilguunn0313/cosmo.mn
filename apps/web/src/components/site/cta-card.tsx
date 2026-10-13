interface CtaCardProps {
  id: string;
  title: string;
  text: string;
  children: React.ReactNode;
}

export function CtaCard({ id, title, text, children }: CtaCardProps) {
  return (
    <section
      aria-labelledby={id}
      className="relative grid gap-6 overflow-hidden rounded-3xl bg-card p-6 sm:p-10 md:rounded-[2rem] lg:grid-cols-[1fr_auto] lg:items-center lg:p-14"
    >
      <span
        aria-hidden
        className="bg-brand-gradient absolute inset-x-0 top-0 h-1"
      />
      <div className="grid max-w-2xl gap-3">
        <h2
          id={id}
          className="text-2xl leading-[1.15] font-semibold tracking-tight md:text-4xl"
        >
          {title}
        </h2>
        <p className="text-lg text-muted-foreground">{text}</p>
      </div>
      <div className="flex flex-wrap gap-3">{children}</div>
    </section>
  );
}

export const ctaButtonClass =
  "inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-medium transition-[background-color,scale] duration-150 ease-(--ease-out) motion-safe:active:scale-[0.97]";
