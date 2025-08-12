"use client";

import * as React from "react";
import {
  BarChart3,
  CreditCard,
  TrendingUp,
  Shield,
  PieChart,
  LogOut,
  SunMoon,
  Moon,
  Sun,
  LayoutDashboard,
} from "lucide-react";
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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItems } from "@/constants";
import { useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";

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
  const isLight = theme === "light";

  return (
    <SidebarMenuButton
      onClick={toggleTheme}
      className="flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer w-fit"
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
  const { theme } = useTheme();
  const pathname = usePathname();

  const handleUserClick = () => {
    openUserProfile();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground  tracking-wider mb-3">
            Finova
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            {isLoaded
              ? menuItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton
                        asChild
                        className={`h-9 px-3 rounded-md transition-colors ${
                          isActive
                            ? "bg-sky-500 text-white hover:bg-sky-600 hover:text-white"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                        title={item.title}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-3"
                        >
                          {item.icon === "BarChart3" && (
                            <BarChart3 className="w-6 h-6" />
                          )}
                          {item.icon === "CreditCard" && (
                            <CreditCard className="w-6 h-6" />
                          )}
                          {item.icon === "TrendingUp" && (
                            <TrendingUp className="w-6 h-6" />
                          )}
                          {item.icon === "Shield" && (
                            <Shield className="w-6 h-6" />
                          )}
                          {item.icon === "PieChart" && (
                            <PieChart className="w-6 h-6" />
                          )}

                          {item.icon === "Dashboard" && (
                            <LayoutDashboard className="w-6 h-6" />
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
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          {isLoaded && user ? (
            <>
              <SidebarMenuItem>
                <SidebarThemeToggle />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleSignOut}
                  className="flex items-center gap-3 p-2 rounded-md  transition-colors cursor-pointer text-red-800 hover:text-red-950 w-fit"
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
