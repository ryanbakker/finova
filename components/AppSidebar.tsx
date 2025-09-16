"use client";

import {
  LogOut,
  Moon,
  Sun,
  LayoutDashboard,
  ChevronRight,
  ArrowRightLeft,
  ChartPie,
  ChartNoAxesCombined,
  ReceiptText,
  CreditCard,
  Target,
  FileChartColumn,
  WalletCards,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItems } from "@/constants";
import { useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useReports } from "@/hooks/use-reports";
import { onReportsRefresh } from "@/lib/utils/reports-events";

// Reports List Component
function ReportsList() {
  const { reports, loading, refetch } = useReports(5);
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  // Listen for global report refresh events
  useEffect(() => {
    const cleanup = onReportsRefresh(() => {
      refetch();
    });
    return cleanup;
  }, [refetch]);

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const formatReportDate = (date: Date) => {
    const reportDate = new Date(date);
    return reportDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="space-y-1">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-8 px-3 rounded-md flex items-center gap-3"
          >
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="h-3 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1">
      {reports.map((report) => {
        const isActive = pathname === `/reports/${report.id}`;
        return (
          <SidebarMenuSubItem key={report.id}>
            <SidebarMenuSubButton asChild>
              <Link
                href={`/reports/${report.id}`}
                className={`text-xs ${
                  isActive ? "bg-accent text-accent-foreground" : ""
                }`}
                onClick={handleNavClick}
              >
                {formatReportDate(report.createdAt)}
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        );
      })}
    </div>
  );
}

// Sidebar Theme Toggle Component
function SidebarThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      // If system, toggle to light first
      setTheme("light");
    }
  };

  const isDark = theme === "dark";

  return (
    <SidebarMenuButton
      onClick={toggleTheme}
      className="flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer w-fit hover:bg-slate-100 dark:hover:bg-neutral-800"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      <span className="text-sm">{isDark ? "Dark Mode" : "Light Mode"}</span>
    </SidebarMenuButton>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoaded } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const [isReportsOpen, setIsReportsOpen] = useState(
    pathname === "/reports" || pathname.startsWith("/reports/")
  );
  // Feature access control removed - all features are now available to all users

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleUserClick = () => {
    openUserProfile();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (_error) {}
  };

  const handleReportsClick = () => {
    setIsReportsOpen(!isReportsOpen);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Update dropdown state when pathname changes
  useEffect(() => {
    setIsReportsOpen(
      pathname === "/reports" || pathname.startsWith("/reports/")
    );
  }, [pathname]);

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {isLoaded && user ? (
              <SidebarMenuButton
                onClick={handleUserClick}
                className="flex items-center gap-3 w-full py-6 pr-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                title="User Profile"
              >
                <Avatar className="h-[32px] w-[32px] rounded-md -ml-1.5">
                  <AvatarImage
                    src={user.imageUrl}
                    alt={user.fullName || "User"}
                  />
                  <AvatarFallback>
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 text-left">
                  <div className="text-sm font-medium">
                    {user.fullName || "User"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.primaryEmailAddress?.emailAddress}
                  </div>
                </span>
              </SidebarMenuButton>
            ) : (
              <div className="flex items-center gap-3 p-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarGroup className="flex-1 space-y-1">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground  tracking-wider mb-3">
            Finova
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            {isLoaded
              ? menuItems.map((item, index) => {
                  const isActive = pathname === item.href;

                  // All features are now available to all users

                  return (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton
                        asChild
                        className={`h-9 px-3 rounded-md transition-colors ${
                          isActive
                            ? "button-blue-bg"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                        title={item.title}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-3"
                          onClick={handleNavClick}
                        >
                          {item.icon === "dashboard" && (
                            <LayoutDashboard className="w-6 h-6" />
                          )}
                          {item.icon === "transactions" && (
                            <ArrowRightLeft className="w-6 h-6" />
                          )}
                          {item.icon === "budgets" && (
                            <ChartPie className="w-6 h-6" />
                          )}
                          {item.icon === "assets" && (
                            <ChartNoAxesCombined className="w-6 h-6" />
                          )}
                          {item.icon === "liabilities" && (
                            <CreditCard className="w-6 h-6" />
                          )}
                          {item.icon === "bills" && (
                            <ReceiptText className="w-6 h-6" />
                          )}
                          {item.icon === "goals" && (
                            <Target className="w-6 h-6" />
                          )}
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              : // Skeleton loaders for menu items
                Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <div className="h-9 px-3 rounded-md flex items-center gap-3">
                      <Skeleton className="w-6 h-6 rounded" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  </SidebarMenuItem>
                ))}
          </SidebarMenu>
          <SidebarMenu>
            <Collapsible
              className="group/collapsible"
              id="reports-collapsible"
              open={isReportsOpen}
              onOpenChange={setIsReportsOpen}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild className="cursor-pointer mb-0.5">
                  <SidebarMenuButton
                    asChild
                    className={`h-9 px-3 rounded-md transition-colors ${
                      pathname === "/reports" ||
                      pathname.startsWith("/reports/")
                        ? "button-blue-bg"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Link
                      href="/reports"
                      className="flex items-center gap-3"
                      onClick={handleReportsClick}
                      title="Reports"
                    >
                      <FileChartColumn className="w-6 h-6" />
                      <span className="text-sm font-medium">Reports</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <ReportsList />
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          {isLoaded && user ? (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  title="Manage Plan"
                  className={`h-8 px-2 rounded-md transition-all w-fit ${
                    pathname === "/manage-plan"
                      ? "bg-neutral-200 dark:bg-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-800"
                      : "hover:bg-slate-100 hover:text-accent-foreground dark:hover:bg-neutral-800"
                  }`}
                >
                  <Link
                    href="/manage-plan"
                    className="flex items-center gap-3"
                    onClick={handleNavClick}
                  >
                    <WalletCards className="w-5 h-5" />
                    <span className="text-sm">Manage Plan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarThemeToggle />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleSignOut}
                  className="flex items-center gap-3 p-2 rounded-md  transition-colors cursor-pointer text-red-800 hover:text-red-950 dark:hover:text-red-400 dark:text-red-500 w-fit"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          ) : (
            <div className="flex items-center gap-3 p-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
