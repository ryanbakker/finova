"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
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
      <Button variant="outline" size="icon" disabled>
        <div className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="group relative overflow-hidden border-sky-500/20 dark:border-sky-400/20 bg-gradient-to-r from-sky-500/5 to-cyan-500/5 dark:from-sky-500/10 dark:to-cyan-500/10 hover:from-sky-500/15 hover:to-cyan-500/15 dark:hover:from-sky-500/20 dark:hover:to-cyan-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky-500/20 dark:hover:shadow-sky-400/20 hover:border-sky-500/40 dark:hover:border-sky-400/40 cursor-pointer"
    >
      <div className="relative z-10 text-sky-600 dark:text-sky-300">
        {theme === "light" ? (
          <Sun className="h-[1.2rem] w-[1.2rem] group-hover:rotate-180 transition-transform duration-500" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem] group-hover:rotate-12 transition-transform duration-300" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute inset-0 ring-1 ring-sky-500/0 group-hover:ring-sky-500/30 dark:group-hover:ring-sky-400/30 transition-all duration-300 rounded-md"></div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
