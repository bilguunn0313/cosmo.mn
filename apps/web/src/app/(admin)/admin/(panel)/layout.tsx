import { cookies } from "next/headers";
import { AdminHeader } from "@/components/admin/admin-header";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isSidebarOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={isSidebarOpen}>
      <AppSidebar />
      <SidebarInset>
        <AdminHeader />
        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
