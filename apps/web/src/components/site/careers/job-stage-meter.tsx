import { JOB_STAGES, type JobStage } from "@cosmo/shared";
import { cn } from "@/lib/utils";

interface JobStageMeterProps {
  stage: JobStage;
  label: string;
}

export function JobStageMeter({ stage, label }: JobStageMeterProps) {
  const step = JOB_STAGES.indexOf(stage) + 1;

  return (
    <span className="flex items-center gap-3 text-sm text-ink">
      <span aria-hidden className="flex gap-0.75">
        {JOB_STAGES.map((item, index) => (
          <span
            key={item}
            className={cn(
              "h-1.5 w-5 rounded-full",
              index < step ? "bg-brand" : "bg-brand-200",
            )}
          />
        ))}
      </span>
      {step}. {label}
    </span>
  );
}
