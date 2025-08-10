"use client";

import * as React from "react";
import {
  BarChart3,
  CreditCard,
  TrendingUp,
  Shield,
  PieChart,
  Settings2,
  LogOut,
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
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { menuItems } from "@/constants";
import { useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoaded } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const { theme } = useTheme();

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
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image
                  src={
                    theme === "dark"
                      ? "/logos/logo-small-dark.svg"
                      : "/logos/finova-small.svg"
                  }
                  alt="Finova"
                  height={30}
                  width={30}
                />
                <div className="flex-1 text-left -m-0.5">
                  <span className="truncate font-medium">inova</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Menu
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            {isLoaded
              ? menuItems.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton
                      asChild
                      className="h-9 px-3 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
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
                        {item.icon === "Settings2" && (
                          <Settings2 className="w-6 h-6" />
                        )}
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              : // Skeleton loaders for menu items
                Array.from({ length: 6 }).map((_, index) => (
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
        {isLoaded && user ? (
          <>
            <button
              onClick={handleUserClick}
              className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user.imageUrl}
                  alt={user.fullName || "User"}
                />
                <AvatarFallback>
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer mt-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </>
        ) : (
          // Skeleton loader for user profile
          <div className="flex items-center gap-3 w-full p-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
