import { ChartNoAxesCombined, LogIn } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import Image from "next/image";

function WelcomeHero() {
  return (
    <section className="relative bg-gradient-to-tr from-sky-900 dark:from-sky-950 via-sky-600 dark:via-sky-700 to-sky-200 dark:to-sky-400 pt-16">
      <div className="w-full px-4 py-16 mx-auto max-w-7xl">
        <div className="flex flex-row items-center">
          <div className="flex flex-col gap-3">
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

          <div className="lg:flex items-center justify-center hidden text-center">
            <Image src="/" alt="Hero Image" width={500} height={500} />
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

      {/* Financial chart positioned in bottom right corner */}
      {/* <div className="absolute bottom-6 right-6">
        <div className="flex items-end space-x-1">
          <div className="w-6 bg-sky-300/60 h-28 animate-pulse rounded-md"></div>
          <div className="w-6 bg-sky-400/70 h-32 animate-pulse delay-300 rounded-md"></div>
          <div className="w-6 bg-sky-300/50 h-26 animate-pulse delay-600 rounded-md"></div>
          <div className="w-6 bg-sky-500/60 h-34 animate-pulse delay-900 rounded-md"></div>
          <div className="w-6 bg-sky-200/40 h-45 animate-pulse delay-1200 rounded-md"></div>
        </div>
      </div> */}
    </section>
  );
}

export default WelcomeHero;
