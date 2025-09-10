"use client";

import { DashboardFooter } from "@/components/DashboardFooter";
import { cn } from "@/lib/utils";

interface PageLoadingWrapperProps {
  children: React.ReactNode;
  className?: string;
  showFooter?: boolean;
}

export function PageLoadingWrapper({ 
  children, 
  className,
  showFooter = true 
}: PageLoadingWrapperProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {children}
      {showFooter && <DashboardFooter />}
    </div>
  );
}

// Specialized loading components for different page types
export function GoalsLoading() {
  return (
    <PageLoadingWrapper>
      <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div className="h-9 w-32 bg-muted rounded" />
            <div className="h-5 w-96 bg-muted rounded" />
          </div>
          <div className="h-10 w-32 bg-muted rounded" />
        </div>

        {/* Table skeleton */}
        <div className="space-y-4">
          <div className="h-10 w-full bg-muted rounded" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                <div className="h-4 w-4 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded-full" />
                <div className="space-y-1 flex-1">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-4 w-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLoadingWrapper>
  );
}

export function BudgetingLoading() {
  return (
    <PageLoadingWrapper>
      <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div className="h-9 w-32 bg-muted rounded" />
            <div className="h-5 w-96 bg-muted rounded" />
          </div>
          <div className="h-10 w-32 bg-muted rounded" />
        </div>

        {/* Metrics skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 w-full bg-muted rounded" />
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 w-full bg-muted rounded" />
          <div className="h-64 w-full bg-muted rounded" />
        </div>
      </div>
    </PageLoadingWrapper>
  );
}

export function LiabilitiesLoading() {
  return (
    <PageLoadingWrapper>
      <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div className="h-9 w-32 bg-muted rounded" />
            <div className="h-5 w-96 bg-muted rounded" />
          </div>
          <div className="h-10 w-32 bg-muted rounded" />
        </div>

        {/* Table skeleton */}
        <div className="space-y-4">
          <div className="h-10 w-full bg-muted rounded" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                <div className="h-4 w-4 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded-full" />
                <div className="space-y-1 flex-1">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-4 w-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLoadingWrapper>
  );
}

export function BillsLoading() {
  return (
    <PageLoadingWrapper>
      <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div className="h-9 w-32 bg-muted rounded" />
            <div className="h-5 w-96 bg-muted rounded" />
          </div>
          <div className="h-10 w-32 bg-muted rounded" />
        </div>

        {/* Table skeleton */}
        <div className="space-y-4">
          <div className="h-10 w-full bg-muted rounded" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                <div className="h-4 w-4 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded-full" />
                <div className="space-y-1 flex-1">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-4 w-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLoadingWrapper>
  );
}
