import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ThemeToggle";
import { LogIn } from "lucide-react";
import { navigationLinks } from "../../constants";

function WelcomeHeader() {
  return (
    <header className="w-full fixed left-0 right-0 top-0 z-50 backdrop-blur-xl bg-white/85 dark:bg-neutral-950/70 border-b border-white/20 dark:border-neutral-800/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      <nav className="welcome-nav flex justify-between items-center px-4 py-4 mx-auto max-w-7xl">
        <Image
          src="/logos/logo-full.svg"
          alt="Finova"
          width={100}
          height={40}
        />

        <ul className="flex flex-row items-center gap-7">
          {navigationLinks.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className="text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 transition-all duration-300 hover:scale-105 font-medium"
              >
                {link.label}
              </Link>
            </li>
          ))}

          <SignedIn>
            <li>
              <UserButton userProfileMode="modal" />
            </li>
            <li>
              <Link href="/">
                <Button className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Dashboard
                </Button>
              </Link>
            </li>
          </SignedIn>
          <li className="flex flex-row items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Sign in <LogIn className="ml-2" />
                </Button>
              </SignInButton>
            </SignedOut>

            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default WelcomeHeader;
