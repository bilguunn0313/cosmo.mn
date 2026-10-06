"use client";

import { ArrowUpRight, House, Images, Newspaper, Tags } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/lib/queries/auth";
import { useDashboardStats } from "@/lib/queries/dashboard";

const todayFormatter = new Intl.DateTimeFormat("mn-MN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
});

interface StatCardProps {
  title: string;
  value: number | undefined;
  detail?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ title, value, detail, href, icon: Icon }: StatCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full transition-shadow duration-200 ease-(--ease-out) group-hover:shadow-md">
        <CardContent className="grid gap-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">{title}</span>
            <Icon className="size-4" />
          </div>
          {value === undefined ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <span className="text-3xl font-semibold tabular-nums">{value}</span>
          )}
          <span className="text-xs text-muted-foreground">{detail ?? " "}</span>
        </CardContent>
      </Card>
    </Link>
  );
}

const QUICK_LINKS = [
  {
    title: "Мэдээ нэмэх",
    href: "/admin/news",
    description: "Медиа хэсэгт шинэ мэдээ, кампанит ажил",
  },
  {
    title: "Зураг, видео оруулах",
    href: "/admin/media",
    description: "Зургийн санд файл нэмэх",
  },
  {
    title: "Нүүр хуудсыг засах",
    href: "/admin/home",
    description: "Carousel, тойм хэсгүүд",
  },
];

export default function DashboardPage() {
  const me = useMe();
  const stats = useDashboardStats();
  const data = stats.data;

  return (
    <div className="grid gap-10">
      <PageHeader
        title={me.data ? `Сайн байна уу, ${me.data.name}` : "Сайн байна уу"}
        description={todayFormatter.format(new Date())}
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Carousel"
          value={data?.totalSlides}
          detail={data && `${data.activeSlides} нь идэвхтэй`}
          href="/admin/home"
          icon={House}
        />
        <StatCard
          title="Брэндүүд"
          value={data?.totalBrands}
          detail={data && `${data.publishedBrands} нь нийтлэгдсэн`}
          href="/admin/brands"
          icon={Tags}
        />
        <StatCard
          title="Мэдээ"
          value={data?.totalNews}
          href="/admin/news"
          icon={Newspaper}
        />
        <StatCard
          title="Зургийн сан"
          value={data?.totalMedia}
          href="/admin/media"
          icon={Images}
        />
      </section>

      <section className="grid gap-4">
        <h2 className="text-lg font-semibold">Хурдан үйлдэл</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-start justify-between gap-3 rounded-xl border p-4 transition-colors duration-150 hover:bg-muted/60"
            >
              <div className="grid gap-1">
                <span className="font-medium">{link.title}</span>
                <span className="text-sm text-muted-foreground">
                  {link.description}
                </span>
              </div>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-(--ease-out) group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
