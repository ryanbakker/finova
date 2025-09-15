"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface ProgressMilestone {
  at: number; // time in seconds
  value: number; // progress value 0-100
}

interface TimedLoadingOverlayProps {
  duration?: number; // Duration in milliseconds
  message?: string;
  onComplete?: () => void;
  progressSchedule?: ProgressMilestone[]; // deprecated in favor of smooth animation
  progressDurationMs?: number; // total time for progress to reach 100
}

export function TimedLoadingOverlay({
  duration = 4000, // 4.0 seconds overlay duration
  onComplete,
  progressDurationMs = 3500, // 3.5 seconds to complete progress
}: TimedLoadingOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  // Smooth progress animation: starts slow and accelerates, completes at progressDurationMs
  useEffect(() => {
    let frameId: number | null = null;
    const startTime = performance.now();
    const durationMs = Math.max(0, progressDurationMs);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      // Linear progress: constant speed
      if (t >= 1) {
        setProgress(100);
        return; // stop without scheduling another frame
      }
      const currentProgress = t * 100;
      setProgress(currentProgress);
      frameId = requestAnimationFrame(tick);
    };

    // initialize to 0 and start animating
    setProgress(0);
    frameId = requestAnimationFrame(tick);

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [progressDurationMs]);

  // Disable scrolling while overlay is visible
  useEffect(() => {
    if (isVisible) {
      // Store original overflow values
      const originalOverflow = document.body.style.overflow;

      // Disable scrolling
      document.body.style.overflow = "hidden";

      // Cleanup: restore original overflow when component unmounts or becomes invisible
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isVisible]);

  // Auto-hide overlay after the specified duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-sky-100 dark:from-black via-white dark:via-gray-950 to-sky-100 dark:to-black/90">
      <div className="flex flex-col items-center gap-6 p-8 pb-16">
        {/* Finova Logo */}
        <Image src="/finova-logo.svg" alt="Finova" width={150} height={30} />

        {/* Loading message */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Loading your dashboard
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please wait while we prepare your data...
          </p>
        </div>

        {/* Progress indicator */}
        <div className="relative w-[85vw] max-w-[650px] mt-5">
          {/* Percentage display that follows progress */}
          <div
            className="absolute -top-6 text-sm font-medium text-gray-700 dark:text-gray-300"
            style={{
              left: `calc(${Math.min(100, Math.max(0, progress))}% - 12px)`,
            }}
          >
            {Math.round(progress)}%
          </div>
          {/* Custom progress bar */}
          <div className="relative h-[6px] w-full overflow-hidden rounded-full bg-primary/20">
            <div
              className="h-full w-full flex-1 bg-gradient-to-r from-[#196299] to-[#2AA3FF]"
              style={{ transform: `translateX(-${100 - progress}%)` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal timed loading overlay
export function MinimalTimedLoadingOverlay({
  duration = 4000, // 4.0 seconds for minimal overlay
  onComplete,
}: TimedLoadingOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide overlay after the specified duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-sky-100 dark:from-black via-white dark:via-gray-950 to-sky-100 dark:to-black/90">
      <div className="flex items-center space-x-3 p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
        <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          Loading...
        </span>
      </div>
    </div>
  );
}
