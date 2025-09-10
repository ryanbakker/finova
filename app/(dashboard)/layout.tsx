"use client";

import { AppSidebar } from "@/components/AppSidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DynamicBreadcrumb } from "@/components/ui/breadcrumb";
import React from "react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />

        {/* BG transparent V */}
        <SidebarInset className="flex-1 shadow-none! w-full min-w-0 dark:bg-[#171717] bg-[#fafafa]">
          <header className="rounded-b-xl">
            <div className="flex h-16 shrink-0 items-center gap-2 px-4 rounded-xl mb-1 dark:bg-[#0a0a0a] bg-white shadow-sm mt-1">
              <SidebarTrigger className="-ml-1 text-sky-600 cursor-pointer hover:text-sky-800" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DynamicBreadcrumb />
              <div className="ml-auto">
                <Image
                  src="/finova-logo.svg"
                  alt="Finova"
                  width={80}
                  height={30}
                />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto w-full rounded-xl mt-1 md:pt-4 dark:bg-[#0a0a0a] lg:bg-white shadow-sm">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// dark:bg-[#0a0a0a]
// dark:bg-[#171717]
