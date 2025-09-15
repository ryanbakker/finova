"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ThemeToggle";
import { LogIn } from "lucide-react";
import { navigationLinks } from "../../constants";
import MobileNav from "./MobileNav";
import { handleSmoothScrollClick } from "../../lib/utils/smoothScroll";
import FinovaLogo from "../FinovaLogo";

function WelcomeHeader() {
  return (
    <header className="w-full fixed left-0 right-0 top-0 z-[9999] backdrop-blur-xl bg-white/60 dark:bg-neutral-950/70 border-b border-white/20 dark:border-neutral-800/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      <nav className="welcome-nav flex justify-between items-center px-4 py-2 lg:py-4 mx-auto max-w-7xl">
        <FinovaLogo />

        <MobileNav />

        <ul className="lg:flex hidden flex-row items-center gap-8">
          {navigationLinks.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                onClick={(e) =>
                  handleSmoothScrollClick(e, link.href.replace("/#", ""), 50)
                }
                className="group relative text-sky-950 dark:text-sky-50 hover:text-sky-950! dark:hover:text-sky-50! transition-all duration-300 font-medium text-sm uppercase tracking-wide cursor-pointer"
              >
                <span className="relative z-10">{link.label}</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-500 to-cyan-500 group-hover:w-full transition-all duration-300 ease-out"></div>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 group-hover:opacity-0 transition-opacity duration-300"></div>
              </a>
            </li>
          ))}

          <SignedIn>
            <div className="flex flex-row items-center gap-6 justify-center">
              <li className="flex flex-row items-center">
                <div className="relative group flex flex-row items-center">
                  <UserButton
                    userProfileMode="modal"
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-8 h-8 ring-2 ring-sky-500/20 hover:ring-sky-500/40 transition-all duration-300 group-hover:scale-110",
                      },
                    }}
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </li>
              <li>
                <Link href="/">
                  <Button className="group relative overflow-hidden bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white border-0 transition-all duration-300 px-6 py-2.5 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                    <span className="relative z-10">Dashboard</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  </Button>
                </Link>
              </li>
            </div>
          </SignedIn>
          <li className="flex flex-row items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="group relative overflow-hidden bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white border-0 transition-all duration-300 px-6 py-2.5 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="relative z-10">Sign in</span>
                    <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                </Button>
              </SignInButton>
            </SignedOut>

            <div className="group">
              <ThemeToggle />
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default WelcomeHeader;
