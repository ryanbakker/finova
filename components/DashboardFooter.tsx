import { Heart } from "lucide-react";

export function DashboardFooter() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex flex-col items-center justify-between gap-4 py-6 md:h-10 !pt-5 md:flex-row md:py-0 max-w-7xl">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Finova. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Made with</span>
          <Heart className="h-4 w-4 text-red-500" fill="red" />
        </div>
      </div>
    </footer>
  );
}
