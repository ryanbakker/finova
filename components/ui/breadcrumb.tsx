"use client";

import * as React from "react";
import {
  ChevronRight,
  BarChart3,
  CreditCard,
  TrendingUp,
  Shield,
  PieChart,
  LayoutDashboard,
} from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground",
      className
    )}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight className="h-3.5 w-3.5 text-current" />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

// Dynamic breadcrumb component that automatically generates breadcrumbs
const DynamicBreadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<typeof Breadcrumb>
>(({ className, ...props }, ref) => {
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

  const generateBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
      return [{ label: "Dashboard", href: "/" }];
    }

    const breadcrumbs = [{ label: "Dashboard", href: "/" }];

    let currentPath = "";
    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ label, href: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Breadcrumb ref={ref} className={className} {...props}>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.href}>
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <div className="flex items-center gap-2">
                  {getIconForRoute(breadcrumb.href)}
                  <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                </div>
              ) : (
                <BreadcrumbLink href={breadcrumb.href}>
                  {breadcrumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
});
DynamicBreadcrumb.displayName = "DynamicBreadcrumb";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  DynamicBreadcrumb,
};
