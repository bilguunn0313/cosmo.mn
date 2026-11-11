"use client";

import { BackLink } from "@/components/admin/back-link";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useJob } from "@/lib/queries/jobs";
import { pickDefaultTranslation } from "@/lib/translations";
import { JobForm } from "./job-form";

interface JobEditorProps {
  jobId: number;
}

export function JobEditor({ jobId }: JobEditorProps) {
  const job = useJob(jobId);

  if (job.isError) {
    return (
      <div className="grid gap-3">
        <BackLink href="/admin/human-resources" label="Хүний нөөц" />
        <p className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
          {job.error.message}
        </p>
      </div>
    );
  }

  if (!job.data) {
    return (
      <div className="grid max-w-3xl gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  const title = pickDefaultTranslation(job.data.translations)?.title;

  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <BackLink href="/admin/human-resources" label="Хүний нөөц" />
        <PageHeader
          title={title ?? job.data.slug}
          actions={
            <Badge variant={job.data.isPublished ? "default" : "secondary"}>
              {job.data.isPublished ? "Нийтлэгдсэн" : "Ноорог"}
            </Badge>
          }
        />
      </div>
      <JobForm key={job.data.id} job={job.data} />
    </div>
  );
}
