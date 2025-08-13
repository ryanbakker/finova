"use client";

import { AppSidebar } from "@/components/AppSidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  TrendingUp,
  Shield,
  PieChart,
  LayoutDashboard,
} from "lucide-react";

function DynamicBreadcrumbs() {
  const pathname = usePathname();

  // Icon mapping for each route
  const getIconForRoute = (href: string) => {
    switch (href) {
      case "/":
        return <LayoutDashboard className="w-4 h-4 text-foreground" />;
      case "/transactions":
        return <BarChart3 className="w-4 h-4 text-sky-600" />;
      case "/budgeting":
        return <TrendingUp className="w-4 h-4 text-sky-600" />;
      case "/accounts":
        return <Shield className="w-4 h-4 text-sky-600" />;
      case "/analytics":
        return <PieChart className="w-4 h-4 text-sky-600" />;
      default:
        return null;
    }
  };

  // Remove the leading slash and split the path
  const segments = pathname.split("/").filter(Boolean);

  // For dashboard routes, we want to show the current page
  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <div className="flex items-center gap-2">
              {getIconForRoute("/")}
              <BreadcrumbPage className="text-sky-600">
                Dashboard
              </BreadcrumbPage>
            </div>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          const label = segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {isLast ? (
                  <div className="flex items-center gap-2">
                    {getIconForRoute(href)}
                    <BreadcrumbPage className="text-sky-600 font-medium">
                      {label}
                    </BreadcrumbPage>
                  </div>
                ) : (
                  <BreadcrumbLink href={href} className="text-sky-600">
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full min-w-0">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1 text-sky-600 cursor-pointer hover:text-sky-800" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DynamicBreadcrumbs />
          </header>
          <main className="flex-1 overflow-auto w-full page-content">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
