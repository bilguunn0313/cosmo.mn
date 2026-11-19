"use client";

import { useRouter } from "next/navigation";
import { BackLink } from "@/components/admin/back-link";
import { PageHeader } from "@/components/admin/page-header";
import { JobForm } from "./job-form";

export function NewJob() {
  const router = useRouter();

  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <BackLink href="/admin/human-resources" label="Хүний нөөц" />
        <PageHeader
          title="Шинэ ажлын байр"
          description="Нийтлэх унтраалгыг асаалгүй хадгалбал ноорог болж, зөвхөн админд харагдана."
        />
      </div>
      <JobForm
        job={null}
        onCreated={(job) =>
          router.replace(`/admin/human-resources/jobs/${job.id}`)
        }
      />
    </div>
  );
}
