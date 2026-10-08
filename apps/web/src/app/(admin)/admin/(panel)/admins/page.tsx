import type { Metadata } from "next";
import { AdminsPanel } from "@/components/admin/admins/admins-panel";
import { ChangePasswordForm } from "@/components/admin/admins/change-password-form";
import { PageHeader } from "@/components/admin/page-header";
import { PanelHeader } from "@/components/admin/panel-header";

export const metadata: Metadata = { title: "Админууд" };

export default function AdminsPage() {
  return (
    <div className="grid gap-12">
      <PageHeader
        title="Админууд"
        description="Админ панел ашиглах хүмүүс болон таны нууц үг."
      />

      <AdminsPanel step={1} />

      <section id="password" className="grid scroll-mt-20 gap-4">
        <PanelHeader
          step={2}
          title="Миний нууц үг"
          description="Анх өгсөн түр нууц үгээ заавал солиорой. Бусдад хэлэхгүй, өөр сайтад давтан ашиглахгүй нууц үг сонгоно уу."
        />
        <ChangePasswordForm />
      </section>
    </div>
  );
}
