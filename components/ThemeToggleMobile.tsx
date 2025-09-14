"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggleMobile() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Don't render theme-dependent content until mounted
  if (!mounted) {
    return (
      <Button
        variant="outline"
        className="w-full bg-gradient-to-r from-sky-500/5 to-cyan-500/5 dark:from-sky-500/10 dark:to-cyan-500/10 border-sky-500/20 dark:border-sky-400/20 text-sky-700 dark:text-sky-300"
        disabled
      >
        <div className="h-[1.2rem] w-[1.2rem]" />
        <span className="ml-2">Toggle Theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      className="w-full bg-gradient-to-r from-sky-500/5 to-cyan-500/5 dark:from-sky-500/10 dark:to-cyan-500/10 hover:from-sky-500/15 hover:to-cyan-500/15 dark:hover:from-sky-500/20 dark:hover:to-cyan-500/20 border-sky-500/20 dark:border-sky-400/20 hover:border-sky-500/40 dark:hover:border-sky-400/40 text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/20 dark:hover:shadow-sky-400/20"
    >
      <div className="flex items-center justify-center">
        {theme === "light" ? (
          <Sun className="h-[1.2rem] w-[1.2rem] mr-2 group-hover:rotate-180 transition-transform duration-500" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem] mr-2 group-hover:rotate-12 transition-transform duration-300" />
        )}
        <span className="text-sm font-medium">Toggle Theme</span>
      </div>
    </Button>
  );
}
