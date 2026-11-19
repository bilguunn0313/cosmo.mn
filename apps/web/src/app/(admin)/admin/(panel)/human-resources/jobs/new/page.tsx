import type { Metadata } from "next";
import { NewJob } from "@/components/admin/jobs/new-job";

export const metadata: Metadata = { title: "Шинэ ажлын байр" };

export default function NewJobPage() {
  return <NewJob />;
}
