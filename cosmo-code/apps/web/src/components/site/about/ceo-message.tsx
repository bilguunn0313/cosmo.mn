import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import type { CeoMessage as CeoMessageData } from "@/lib/about";

interface CeoMessageProps {
  title: string;
  data: CeoMessageData;
}

export function CeoMessage({ title, data }: CeoMessageProps) {
  return (
    <section className="mx-auto flex max-w-[1440px] flex-col-reverse gap-8 px-4 pt-20 md:px-6 md:pt-28 lg:flex-row lg:items-end lg:gap-24 xl:px-12 xl:pt-36">
      <Reveal className="flex flex-col gap-8 pb-2 lg:flex-[1.2]">
        <span className="text-[13px] font-bold tracking-[0.08em] text-brand-700 uppercase">
          {title}
        </span>
        <blockquote className="m-0 text-[clamp(28px,3vw,44px)] leading-[1.15] font-semibold tracking-[-0.03em] text-balance">
          “{data.quote}”
        </blockquote>
        <p className="m-0 max-w-[600px] text-lg leading-relaxed text-pretty text-ink-2">
          {data.body}
        </p>
        <div className="flex flex-col gap-1 border-t-2 border-rule pt-5">
          <span className="text-[21px] font-bold">{data.name}</span>
          <span className="text-[15px] text-ink-3">{data.role}</span>
        </div>
      </Reveal>

      <Reveal
        delay={0.1}
        className="relative aspect-[4/5] w-full max-w-[560px] overflow-hidden bg-surface lg:flex-1"
      >
        {data.imageUrl && (
          <Image
            src={data.imageUrl}
            alt={data.name}
            fill
            unoptimized
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        )}
      </Reveal>
    </section>
  );
}
