import Image from "next/image";
import { ImageReveal } from "@/components/site/image-reveal";
import { Reveal } from "@/components/site/reveal";
import type { PublicSection } from "@/lib/public-api";
import { cn } from "@/lib/utils";

interface StoryBlockProps {
  section: PublicSection;
  isFlipped: boolean;
}

function StoryBlock({ section, isFlipped }: StoryBlockProps) {
  return (
    <article
      className={cn(
        "grid gap-8 rounded-3xl bg-card p-5 sm:p-8 md:rounded-[2rem] lg:items-center lg:gap-14 lg:p-12",
        section.imageUrl && "lg:grid-cols-2",
      )}
    >
      {section.imageUrl && (
        <div
          className={cn(
            "relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted md:rounded-3xl",
            isFlipped && "lg:order-2",
          )}
        >
          <ImageReveal>
            <Image
              src={section.imageUrl}
              alt=""
              fill
              unoptimized
              loading="eager"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </ImageReveal>
        </div>
      )}

      <Reveal delay={0.2} className="grid max-w-3xl gap-5">
        {section.title && (
          <h2 className="text-2xl leading-[1.15] font-semibold tracking-tight md:text-4xl">
            {section.title}
          </h2>
        )}
        <div
          className="rich-text text-foreground/80 md:text-lg"
          dangerouslySetInnerHTML={{ __html: section.body }}
        />
      </Reveal>
    </article>
  );
}

interface StorySectionsProps {
  sections: PublicSection[];
}

export function StorySections({ sections }: StorySectionsProps) {
  return (
    <div className="grid gap-4 md:gap-6">
      {sections.map((section, index) => (
        <StoryBlock
          key={section.id}
          section={section}
          isFlipped={index % 2 === 1}
        />
      ))}
    </div>
  );
}
