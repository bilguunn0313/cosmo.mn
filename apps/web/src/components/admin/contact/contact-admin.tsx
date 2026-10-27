"use client";

import { PageBannerPanel } from "@/components/admin/page-banner-panel";
import { PageHeader } from "@/components/admin/page-header";
import { PanelHeader } from "@/components/admin/panel-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useSiteSetting } from "@/lib/queries/site-settings";
import { DepartmentsPanel } from "./departments-panel";
import { SiteSettingForm } from "./site-setting-form";

export function ContactAdmin() {
  const setting = useSiteSetting();

  return (
    <div className="grid gap-12">
      <PageHeader
        title="Холбоо барих"
        description="Сайтын «Холбоо барих» хуудас, хөл хэсэг болон холбоо барих формын тохиргоо."
      />

      <PageBannerPanel page="contact" step={1} />

      <section className="grid gap-4">
        <PanelHeader
          step={2}
          title="Холбоо барих мэдээлэл"
          description="Утас, имэйл, хаяг, байршил, сошиал хаягууд."
        />
        {setting.data ? (
          <SiteSettingForm setting={setting.data} />
        ) : (
          <Skeleton className="h-96 max-w-3xl rounded-xl" />
        )}
      </section>

      <DepartmentsPanel step={3} />
    </div>
  );
}
