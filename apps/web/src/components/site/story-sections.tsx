import Image from "next/image";
import { ImageReveal } from "@/components/site/image-reveal";
import { LogoMark } from "@/components/site/logo-mark";
import { Reveal } from "@/components/site/reveal";
import type { PublicSection } from "@/lib/public-api";
import { cn } from "@/lib/utils";

interface StoryRowProps {
  index: number;
  label: string;
  imageUrl: string | null;
  children: React.ReactNode;
}

export function StoryRow({ index, label, imageUrl, children }: StoryRowProps) {
  const isTextFirst = index % 2 === 1;

  return (
    <article className="grid pt-10 md:grid-cols-2 md:pt-16">
      <div
        className={cn(
          "relative h-[min(60vh,520px)] overflow-hidden rounded-card",
          isTextFirst && "md:order-2",
        )}
      >
        {imageUrl ? (
          <ImageReveal>
            <Image
              src={imageUrl}
              alt=""
              fill
              unoptimized
              loading="eager"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </ImageReveal>
        ) : (
          <div className="absolute inset-0 overflow-hidden bg-brand">
            <LogoMark className="absolute -right-[12%] -bottom-[18%] w-[78%] text-white/10" />
          </div>
        )}
      </div>

      <Reveal
        className={cn(
          "flex flex-col justify-end gap-4.5 py-10 md:py-12",
          isTextFirst ? "md:pr-12" : "md:pl-12",
        )}
      >
        <h2 className="type-h3 text-balance">{label}</h2>
        {children}
      </Reveal>
    </article>
  );
}

interface StorySectionsProps {
  sections: PublicSection[];
  startIndex?: number;
}

export function StorySections({
  sections,
  startIndex = 0,
}: StorySectionsProps) {
  return sections.map((section, index) => (
    <StoryRow
      key={section.id}
      index={startIndex + index}
      label={section.title}
      imageUrl={section.imageUrl}
    >
      <div
        className="rich-text max-w-150 text-base text-ink-2"
        dangerouslySetInnerHTML={{ __html: section.body }}
      />
    </StoryRow>
  ));
}
