"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogout, useMe } from "@/lib/queries/auth";

export default function AdminHomePage() {
  const router = useRouter();
  const me = useMe();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => router.replace("/admin/login"),
    });
  };

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center gap-4 px-6">
      {me.data ? (
        <h1 className="text-3xl font-semibold">Сайн байна уу, {me.data.name}</h1>
      ) : (
        <Skeleton className="h-9 w-72" />
      )}
      <p className="text-muted-foreground">
        Нэвтрэлт ажиллаж байна. Дараагийн алхам: цэс болон толгой хэсэг.
      </p>
      <div>
        <Button variant="outline" onClick={handleLogout} disabled={logout.isPending}>
          <LogOut />
          Гарах
        </Button>
      </div>
    </main>
  );
}
