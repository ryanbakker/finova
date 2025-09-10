import { ChartNoAxesCombined, LogIn } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import Image from "next/image";

function WelcomeHero() {
  return (
    <section className="relative bg-gradient-to-tr from-sky-900 dark:from-sky-950 via-sky-600 dark:via-sky-700 to-sky-200 dark:to-sky-400 pt-16">
      <div className="w-full px-4 py-16 mx-auto max-w-7xl">
        <div className="flex flex-row gap-10 items-center">
          <div className="flex flex-col gap-3 flex-1">
            <h1 className="uppercase text-6xl text-sky-50 font-extrabold">
              Take Control, <br />
              Manage Your <br />
              Finances
            </h1>

            <h2 className="text-white max-w-[610px]">
              The first step is knowing your numbers. Our platform automatically
              tracks, categorizes, and visualizes your spending and financial
              habits. Save more effectively, and plan for your future.
            </h2>

            <p className="font-medium text-sm text-white/70 pt-6">
              Get started with Finova
            </p>

            <div className="flex flex-row gap-4 pt-3">
              <Link href="/">
                <Button className="invert cursor-pointer w-[150px]" size="lg">
                  <ChartNoAxesCombined />
                  Features
                </Button>
              </Link>
              <SignUpButton mode="modal">
                <Button className="invert cursor-pointer w-[150px]" size="lg">
                  <LogIn />
                  Sign up
                </Button>
              </SignUpButton>
            </div>
          </div>

          <div className="lg:flex items-center justify-center hidden text-center z-20 max-w-[600px]">
            <div className="hidden dark:grid grid-cols-5 gap-2">
              <div className="flex items-end justify-end col-span-4">
                <Image
                  src="/hero/dark-desktop-dashboard.png"
                  alt="Dark Mode Desktop Dashboard"
                  width={600}
                  height={300}
                  className="rounded-lg shadow-lg hover:scale-[1.012] transition-all duration-300 ease-out"
                />
              </div>
              <div className="flex items-end justify-start col-span-1">
                <Image
                  src="/hero/dark-mobile-nav.png"
                  alt="Dark Mode Mobile Nav"
                  width={200}
                  height={300}
                  className="rounded-lg shadow-lg hover:scale-[1.012] transition-all duration-300 ease-out"
                />
              </div>

              <div className="flex items-start justify-end col-span-1">
                <Image
                  src="/hero/dark-mobile-transactions.png"
                  alt="Dark Mode Mobile Transactions"
                  width={200}
                  height={300}
                  className="rounded-lg shadow-lg hover:scale-[1.012] transition-all duration-300 ease-out"
                />
              </div>
              <div className="flex items-start justify-start col-span-4">
                <Image
                  src="/hero/dark-desktop-transactions.png"
                  alt="Dark Mode Desktop Transactions"
                  width={600}
                  height={300}
                  className="rounded-lg shadow-lg hover:scale-[1.012] transition-all duration-300 ease-out"
                />
              </div>
            </div>

            <div className="grid dark:hidden grid-cols-5 gap-2">
              <div className="flex items-end justify-end col-span-4">
                <Image
                  src="/hero/light-desktop-dashboard.png"
                  alt="Light Mode Desktop Dashboard"
                  width={600}
                  height={300}
                  className="rounded-lg shadow-lg hover:scale-[1.012] transition-all duration-300 ease-out"
                />
              </div>
              <div className="flex items-end justify-start col-span-1">
                <Image
                  src="/hero/light-mobile-nav.png"
                  alt="Light Mode Mobile Nav"
                  width={200}
                  height={300}
                  className="rounded-lg shadow-lg hover:scale-[1.012] transition-all duration-300 ease-out"
                />
              </div>

              <div className="flex items-start justify-end col-span-1">
                <Image
                  src="/hero/light-mobile-transactions.png"
                  alt="Light Mode Mobile Transactions"
                  width={200}
                  height={300}
                  className="rounded-lg shadow-lg hover:scale-[1.012] transition-all duration-300 ease-out"
                />
              </div>
              <div className="flex items-start justify-start col-span-4">
                <Image
                  src="/hero/light-desktop-transactions.png"
                  alt="Light Mode Desktop Transactions"
                  width={600}
                  height={300}
                  className="rounded-lg shadow-lg hover:scale-[1.012] transition-all duration-300 ease-out"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern with Fade Effect */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)
            `,
            backgroundSize: "41px 41px",
            maskImage:
              "linear-gradient(135deg, transparent 0%, transparent 30%, rgba(0,0,0,0.5) 100%)",
            WebkitMaskImage:
              "linear-gradient(135deg, transparent 0%, transparent 30%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      </div>
    </section>
  );
}

export default WelcomeHero;
