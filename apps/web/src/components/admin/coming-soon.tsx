import { Construction } from "lucide-react";
import { PageHeader } from "./page-header";

interface ComingSoonProps {
  title: string;
  description: string;
  step: number;
}

export function ComingSoon({ title, description, step }: ComingSoonProps) {
  return (
    <div className="grid gap-8">
      <PageHeader title={title} description={description} />
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
        <Construction className="size-8 text-muted-foreground" />
        <p className="font-medium">Энэ хэсэг хийгдэж байна</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Төлөвлөгөөний {step}-р алхамд хийгдэнэ.
        </p>
      </div>
    </div>
  );
}
