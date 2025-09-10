"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  TimedLoadingOverlay,
  MinimalTimedLoadingOverlay,
} from "./TimedLoadingOverlay";
import { cn } from "@/lib/utils";

interface TimedLoadingPageProps {
  children: React.ReactNode;
  duration?: number;
  message?: string;
  overlayType?: "full" | "minimal";
  className?: string;
  onLoadingComplete?: () => void;
  excludePaths?: string[]; // Paths to exclude from showing the overlay
}

export function TimedLoadingPage({
  children,
  duration = 4000,
  message = "Loading your financial data...",
  overlayType = "full",
  className,
  onLoadingComplete,
  excludePaths = [],
}: TimedLoadingPageProps) {
  const pathname = usePathname();
  const [showOverlay, setShowOverlay] = useState(true);

  // Check if current path should be excluded
  const shouldExclude = excludePaths.some((path) => pathname.startsWith(path));

  const handleLoadingComplete = () => {
    setShowOverlay(false);
    onLoadingComplete?.();
  };

  // Don't show overlay if path is excluded
  if (shouldExclude) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative", className)}>
      {children}

      {showOverlay && (
        <>
          {overlayType === "full" ? (
            <TimedLoadingOverlay
              duration={duration}
              message={message}
              onComplete={handleLoadingComplete}
            />
          ) : (
            <MinimalTimedLoadingOverlay
              duration={duration}
              onComplete={handleLoadingComplete}
            />
          )}
        </>
      )}
    </div>
  );
}

// Specialized timed loading page for root dashboard
export function DashboardTimedLoadingPage({
  children,
  duration = 4000,
  message = "Loading your financial dashboard...",
  onLoadingComplete,
}: {
  children: React.ReactNode;
  duration?: number;
  message?: string;
  onLoadingComplete?: () => void;
}) {
  return (
    <TimedLoadingPage
      duration={duration}
      message={message}
      overlayType="full"
      className="min-h-screen"
      onLoadingComplete={onLoadingComplete}
      excludePaths={["/welcome"]}
    >
      {children}
    </TimedLoadingPage>
  );
}

// Specialized timed loading page for dashboard sub-pages
export function SubPageTimedLoadingPage({
  children,
  duration = 4000,
  message = "Loading your data...",
  onLoadingComplete,
}: {
  children: React.ReactNode;
  duration?: number;
  message?: string;
  onLoadingComplete?: () => void;
}) {
  return (
    <TimedLoadingPage
      duration={duration}
      message={message}
      overlayType="minimal"
      className="min-h-screen"
      onLoadingComplete={onLoadingComplete}
      excludePaths={["/welcome"]}
    >
      {children}
    </TimedLoadingPage>
  );
}

// Hook for managing timed loading state
export function useTimedLoading(duration: number = 4000) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return isLoading;
}
