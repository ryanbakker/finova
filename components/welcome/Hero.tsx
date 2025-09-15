import { ChartNoAxesCombined, LogIn } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import { FadeInUp, FadeInLeft } from "../ui/animate-on-scroll";

function WelcomeHero() {
  return (
    <section
      id="welcome-hero"
      className="relative bg-gradient-to-tr from-sky-900 dark:from-sky-950 via-sky-600 dark:via-sky-700 to-sky-200 dark:to-sky-400 pt-16"
    >
      <div className="w-full px-4 py-8 lg:py-16 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <FadeInLeft
            delay={0}
            duration={1000}
            className="flex flex-col gap-3 flex-1"
          >
            <FadeInUp delay={200} duration={800}>
              <h1 className="uppercase text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-tr from-sky-100 to-neutral-100 dark:from-sky-200 dark:to-neutral-100">
                <span className="text-[35px]">Take Control,</span> <br />
                Manage Your <br />
                Finances
              </h1>
            </FadeInUp>

            <FadeInUp delay={400} duration={800}>
              <h2 className="text-white max-w-[610px] text-sm md:text-base">
                The first step is knowing your numbers. Our platform helps you
                track and visualise your financial habits. Effectively save and
                plan for your future.
              </h2>
            </FadeInUp>

            <FadeInUp delay={600} duration={800}>
              <p className="font-medium text-sm text-white/70 pt-10">
                Get started with Finova
              </p>
            </FadeInUp>

            <FadeInUp delay={800} duration={800}>
              <div className="flex flex-col-reverse md:flex-row gap-3 lg:gap-6 pt-1">
                <Link href="/">
                  <Button
                    className="group relative overflow-hidden bg-white/90 dark:bg-white/90 border border-white/20 text-sky-900 hover:bg-white hover:border-white/30 transition-all duration-300 px-8 py-4 rounded-md font-semibold text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 w-full md:w-auto"
                    size="lg"
                    variant="outline"
                  >
                    <div className="flex items-center gap-3">
                      <ChartNoAxesCombined className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      <span>Explore Features</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  </Button>
                </Link>
                <Button
                  className="group relative overflow-hidden bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white border-0 transition-all duration-300 px-8 py-4 rounded-md font-semibold text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  size="lg"
                >
                  <SignUpButton mode="modal">
                    <div>
                      <div className="flex items-center gap-3">
                        <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        <span>Sign Up</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                    </div>
                  </SignUpButton>
                </Button>
              </div>
            </FadeInUp>
          </FadeInLeft>

          <div className="flex items-center justify-center text-center z-10 max-w-[600px]">
            <div className="hidden dark:grid grid-cols-5 gap-2">
              {/* Top Left - Desktop Dashboard */}
              <div className="flex items-end justify-end col-span-4">
                <FadeInUp delay={600} duration={800}>
                  <Image
                    src="/hero/dark-desktop-dashboard.png"
                    alt="Dark Mode Desktop Dashboard"
                    width={600}
                    height={300}
                    className="rounded-lg shadow-lg hover:scale-[1.012] transition-all duration-300 ease-out"
                  />
                </FadeInUp>
              </div>

              {/* Top Right - Mobile Nav */}
              <div className="flex items-end justify-start col-span-1">
                <FadeInUp delay={800} duration={800}>
                  <Image
                    src="/hero/dark-mobile-nav.png"
                    alt="Dark Mode Mobile Nav"
                    width={200}
                    height={300}
                    className="rounded-lg shadow-lg hover:scale-[1.012] transition-all duration-300 ease-out"
                  />
                </FadeInUp>
              </div>

              {/* Bottom Left - Mobile Transactions */}
              <div className="flex items-start justify-end col-span-1">
                <FadeInUp delay={1000} duration={800}>
                  <Image
                    src="/hero/dark-mobile-transactions.png"
                    alt="Dark Mode Mobile Transactions"
                    width={200}
                    height={300}
                    className="rounded-lg shadow-lg hover:scale-[1.012] transition-all duration-300 ease-out"
                  />
                </FadeInUp>
              </div>

              {/* Bottom Right - Desktop Transactions */}
              <div className="flex items-start justify-start col-span-4">
                <FadeInUp delay={1200} duration={800}>
                  <Image
                    src="/hero/dark-desktop-transactions.png"
                    alt="Dark Mode Desktop Transactions"
                    width={600}
                    height={300}
                    className="rounded-lg shadow-lg hover:scale-[1.012] transition-all duration-300 ease-out"
                  />
                </FadeInUp>
              </div>
            </div>

            <div className="grid dark:hidden grid-cols-5 gap-2">
              {/* Top Left - Desktop Dashboard */}
              <div className="flex items-end justify-end col-span-4">
                <FadeInUp delay={600} duration={800}>
                  <Image
                    src="/hero/light-desktop-dashboard.png"
                    alt="Light Mode Desktop Dashboard"
                    width={600}
                    height={300}
                    className="rounded-lg shadow-lg hover:scale-[1.012] transition-all duration-300 ease-out"
                  />
                </FadeInUp>
              </div>

              {/* Top Right - Mobile Nav */}
              <div className="flex items-end justify-start col-span-1">
                <FadeInUp delay={800} duration={800}>
                  <Image
                    src="/hero/light-mobile-nav.png"
                    alt="Light Mode Mobile Nav"
                    width={200}
                    height={300}
                    className="rounded-lg shadow-lg hover:scale-[1.012] transition-all duration-300 ease-out"
                  />
                </FadeInUp>
              </div>

              {/* Bottom Left - Mobile Transactions */}
              <div className="flex items-start justify-end col-span-1">
                <FadeInUp delay={1000} duration={800}>
                  <Image
                    src="/hero/light-mobile-transactions.png"
                    alt="Light Mode Mobile Transactions"
                    width={200}
                    height={300}
                    className="rounded-lg shadow-lg hover:scale-[1.012] transition-all duration-300 ease-out"
                  />
                </FadeInUp>
              </div>

              {/* Bottom Right - Desktop Transactions */}
              <div className="flex items-start justify-start col-span-4">
                <FadeInUp delay={1200} duration={800}>
                  <Image
                    src="/hero/light-desktop-transactions.png"
                    alt="Light Mode Desktop Transactions"
                    width={600}
                    height={300}
                    className="rounded-lg shadow-lg hover:scale-[1.012] transition-all duration-300 ease-out"
                  />
                </FadeInUp>
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
