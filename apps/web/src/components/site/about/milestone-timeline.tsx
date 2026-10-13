import Image from "next/image";
import { ImageReveal } from "@/components/site/image-reveal";
import { Reveal } from "@/components/site/reveal";
import type { PublicMilestone } from "@/lib/public-api";
import { cn } from "@/lib/utils";
import { TimelineLine } from "./timeline-line";

interface MilestoneItemProps {
  milestone: PublicMilestone;
  isCardOnLeft: boolean;
}

function MilestoneItem({ milestone, isCardOnLeft }: MilestoneItemProps) {
  return (
    <li className="relative grid pl-12 lg:grid-cols-2 lg:gap-24 lg:pl-0">
      <span
        aria-hidden
        className="absolute top-8 left-0 size-4 rounded-full bg-primary ring-4 ring-canvas lg:left-1/2 lg:-translate-x-1/2"
      />

      <Reveal
        className={cn(
          "hidden pt-3 lg:block",
          isCardOnLeft ? "lg:order-2" : "text-right",
        )}
      >
        <p
          aria-hidden
          className="text-6xl font-semibold tracking-tight text-primary tabular-nums xl:text-7xl"
        >
          {milestone.year}
        </p>
      </Reveal>

      <Reveal
        delay={0.1}
        className={cn(
          "grid content-start gap-4 rounded-3xl bg-card p-6 md:rounded-[2rem] md:p-8",
          isCardOnLeft && "lg:order-1",
        )}
      >
        <h3 className="grid gap-1">
          <span className="text-3xl font-semibold tracking-tight text-primary tabular-nums lg:sr-only">
            {milestone.year}
          </span>
          <span className="text-xl leading-snug font-semibold tracking-tight md:text-2xl">
            {milestone.title}
          </span>
        </h3>
        {milestone.description && (
          <p className="leading-relaxed text-muted-foreground md:text-lg">
            {milestone.description}
          </p>
        )}
        {milestone.imageUrl && (
          <div className="relative mt-2 aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
            <ImageReveal>
              <Image
                src={milestone.imageUrl}
                alt=""
                fill
                unoptimized
                loading="eager"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </ImageReveal>
          </div>
        )}
      </Reveal>
    </li>
  );
}

interface MilestoneTimelineProps {
  milestones: PublicMilestone[];
}

export function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  return (
    <div className="relative">
      <TimelineLine />
      <ol className="relative grid gap-8 md:gap-14">
        {milestones.map((milestone, index) => (
          <MilestoneItem
            key={milestone.id}
            milestone={milestone}
            isCardOnLeft={index % 2 === 0}
          />
        ))}
      </ol>
    </div>
  );
}
