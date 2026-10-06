import type { Metadata } from "next";

export const metadata: Metadata = { title: "cosmo.mn" };

export default function ComingSoonPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-sm font-medium tracking-wide text-muted-foreground">
        cosmo.mn
      </p>
      <h1 className="text-3xl font-semibold">Тун удахгүй</h1>
      <p className="max-w-sm text-muted-foreground">
        Манай шинэ вэбсайт удахгүй нээгдэнэ.
      </p>
    </main>
  );
}
