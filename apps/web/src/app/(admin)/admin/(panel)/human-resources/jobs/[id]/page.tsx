import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobEditor } from "@/components/admin/jobs/job-editor";

export const metadata: Metadata = { title: "Ажлын байр засах" };

export default async function EditJobPage({
  params,
}: PageProps<"/admin/human-resources/jobs/[id]">) {
  const { id } = await params;
  const jobId = Number(id);

  if (!Number.isInteger(jobId) || jobId < 1) {
    notFound();
  }

  return <JobEditor jobId={jobId} />;
}
