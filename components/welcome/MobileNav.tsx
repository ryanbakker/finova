"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { ThemeToggleMobile } from "../ThemeToggleMobile";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  LogIn,
  Shield,
  Rocket,
  Star,
  DollarSign as DollarSignIcon,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { Separator } from "@radix-ui/react-dropdown-menu";

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const {} = useClerk();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleHashLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsOpen(false);

    const href = e.currentTarget.getAttribute("href");
    if (href && href.startsWith("/#")) {
      const targetId = href.substring(2);
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          // Use scrollIntoView with a custom offset
          const yOffset = -50;
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 300); // Increased delay to ensure sheet closes completely
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="lg:hidden flex flex-col gap-1.5 items-end">
        <span
          className={`dark:bg-sky-100 bg-sky-900 h-1 rounded-full transition-all duration-300 ${
            isOpen ? "w-8" : "w-7"
          }`}
        />
        <span
          className={`dark:bg-sky-100 bg-sky-900 h-1 rounded-full transition-all duration-300 ${
            isOpen ? "w-8" : "w-4"
          }`}
        />
        <span
          className={`dark:bg-sky-100 bg-sky-900 h-1 rounded-full transition-all duration-300 ${
            isOpen ? "w-8" : "w-6"
          }`}
        />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-80 p-6 bg-gradient-to-br from-white via-sky-50 to-cyan-50 dark:from-neutral-950 dark:via-sky-950 dark:to-cyan-950 border-l border-sky-200/50 dark:border-sky-800/50"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader>
            <SheetTitle className="sr-only">Navigation</SheetTitle>
          </SheetHeader>

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto pt-10">
            {/* Welcome Page Navigation */}
            <div className="space-y-3">
              <SignInButton mode="modal">
                <button
                  className="mobile-nav-link w-full items-start justify-start"
                  onClick={handleLinkClick}
                >
                  <Rocket className="w-5 h-5" />
                  <span className="text-sm font-medium">Get Started</span>
                </button>
              </SignInButton>
              <Link
                href="/#welcome-features"
                onClick={handleHashLinkClick}
                className="mobile-nav-link"
              >
                <Star className="w-5 h-5" />
                <span className="text-sm font-medium">Features</span>
              </Link>
              <Link
                href="/#welcome-pricing"
                onClick={handleHashLinkClick}
                className="mobile-nav-link"
              >
                <DollarSignIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Pricing</span>
              </Link>
              <Link
                href="/#welcome-contact"
                onClick={handleHashLinkClick}
                className="mobile-nav-link"
              >
                <Mail className="w-5 h-5" />
                <span className="text-sm font-medium">Contact</span>
              </Link>
              <Link
                href="/privacy"
                onClick={handleLinkClick}
                className="mobile-nav-link"
              >
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Privacy Policy</span>
              </Link>
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className="space-y-3">
            <SignedIn>
              <Link href="/">
                <Button
                  variant="outline"
                  onClick={handleLinkClick}
                  className="w-full bg-gradient-to-r from-sky-500/5 to-cyan-500/5 dark:from-sky-500/10 dark:to-cyan-500/10 hover:from-sky-500/15 hover:to-cyan-500/15 dark:hover:from-sky-500/20 dark:hover:to-cyan-500/20 border-sky-500/20 dark:border-sky-400/20 hover:border-sky-500/40 dark:hover:border-sky-400/40 text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/20 dark:hover:shadow-sky-400/20"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <div className="flex justify-center flex-col gap-2">
                <SignInButton mode="modal">
                  <Button
                    className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white"
                    onClick={handleLinkClick}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </SignInButton>
              </div>
            </SignedOut>
            <ThemeToggleMobile />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;
