"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { findActiveNavItem } from "./nav";

export function AdminHeader() {
  const pathname = usePathname();
  const activeItem = findActiveNavItem(pathname);

  return (
    <header className="glass sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border/60 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-4" />
      <span className="text-sm font-medium">{activeItem?.title}</span>
    </header>
  );
}
