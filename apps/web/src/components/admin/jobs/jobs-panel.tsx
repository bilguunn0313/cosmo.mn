"use client";

import { BriefcaseBusiness, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ContentList } from "@/components/admin/content-list";
import { PanelHeader } from "@/components/admin/panel-header";
import { Button } from "@/components/ui/button";
import { formatJobDate } from "@/lib/job-dates";
import { useDeleteJob, useJobs, useToggleJob } from "@/lib/queries/jobs";
import { pickDefaultTranslation } from "@/lib/translations";
import type { JobPosting } from "@/lib/types";
import { DEPARTMENT_LABELS, STAGE_LABELS } from "./job-labels";

function JobThumbnail() {
  return (
    <div className="flex aspect-video items-center justify-center rounded-lg bg-muted text-muted-foreground">
      <BriefcaseBusiness className="size-4" />
    </div>
  );
}

function deadlineStatus(job: JobPosting) {
  if (!job.closesAt) {
    return "Байнга авна";
  }

  const date = formatJobDate(job.closesAt);
  return new Date(job.closesAt) < new Date()
    ? `Хугацаа дууссан (${date})`
    : `${date} хүртэл`;
}

interface JobsPanelProps {
  step?: number;
}

export function JobsPanel({ step }: JobsPanelProps) {
  const router = useRouter();
  const jobs = useJobs();
  const toggleJob = useToggleJob();
  const deleteJob = useDeleteJob();
  const [deletingJob, setDeletingJob] = useState<JobPosting | null>(null);

  const confirmDelete = () => {
    if (!deletingJob) {
      return;
    }

    deleteJob.mutate(deletingJob.id, {
      onSuccess: () => {
        toast.success("Ажлын байр устгагдлаа");
        setDeletingJob(null);
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <section className="grid gap-4">
      <PanelHeader
        step={step}
        title="Нээлттэй ажлын байр"
        description="«Нээлттэй ажлын байр» хуудсанд хамгийн сүүлд нээсэн нь эхэнд харагдана. Хаах огноо өнгөрөхөд сайтаас автоматаар нуугдана."
        action={
          <Button
            nativeButton={false}
            render={<Link href="/admin/human-resources/jobs/new" />}
          >
            <Plus />
            Ажлын байр нэмэх
          </Button>
        }
      />

      <ContentList
        items={jobs.data}
        emptyText="Одоогоор ажлын байр алга. «Ажлын байр нэмэх» дээр дарж эхэлнэ үү."
        visibilityLabels={{ on: "Нийтлэгдсэн", off: "Ноорог" }}
        view={(job) => ({
          thumbnail: <JobThumbnail />,
          title: pickDefaultTranslation(job.translations)?.title ?? job.slug,
          subtitle: [
            DEPARTMENT_LABELS[job.department],
            STAGE_LABELS[job.stage],
            deadlineStatus(job),
          ].join(" · "),
          isVisible: job.isPublished,
        })}
        onEdit={(job) => router.push(`/admin/human-resources/jobs/${job.id}`)}
        onDelete={setDeletingJob}
        onToggleVisible={(job, isPublished) =>
          toggleJob.mutate(
            { id: job.id, patch: { isPublished } },
            { onError: (error) => toast.error(error.message) },
          )
        }
      />

      <ConfirmDialog
        open={deletingJob !== null}
        onOpenChange={(open) => !open && setDeletingJob(null)}
        title="Ажлын байрыг устгах уу?"
        description="Ажлын байр сайтаас бүрмөсөн устна. Түр нуух бол «Нийтлэгдсэн» товчийг унтраана уу."
        isPending={deleteJob.isPending}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
