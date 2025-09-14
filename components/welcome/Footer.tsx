"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { handleSmoothScrollClick } from "../../lib/utils/smoothScroll";

function WelcomeFooter() {
  return (
    <footer className="bg-gradient-to-br from-sky-100 dark:from-black via-white dark:via-gray-950 to-sky-100 dark:to-black/90 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden pl-3 md:pl-0">
      <div className="w-full px-4 py-8 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Quick Links - First on mobile, second on md+ */}
          <div className="flex-1 order-1 md:order-2">
            <div className="text-left md:text-right flex flex-col md:items-end mt-2.5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase mb-4">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/#welcome-hero"
                    onClick={(e) =>
                      handleSmoothScrollClick(e, "welcome-hero", 50)
                    }
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#welcome-features"
                    onClick={(e) =>
                      handleSmoothScrollClick(e, "welcome-features", 50)
                    }
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#welcome-pricing"
                    onClick={(e) =>
                      handleSmoothScrollClick(e, "welcome-pricing", 50)
                    }
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#welcome-contact"
                    onClick={(e) =>
                      handleSmoothScrollClick(e, "welcome-contact", 50)
                    }
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Company Info & Bottom Section - Second on mobile, first on md+ */}
          <div className="flex-1 order-2 md:order-1">
            <Image
              src="/finova-logo.svg"
              alt="Finova"
              width={100}
              height={40}
              className="mb-4"
            />
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Transform your financial life <br />
              with our powerful platform.
            </p>

            <div className="mt-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                © 2025 Finova. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm underline"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="https://creativecommons.org/licenses/by-nc/4.0/"
                  target="_blank"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm underline"
                >
                  License
                </Link>
                <a href="#" id="shielded-logo-welcome">
                  <Image
                    alt="shielded"
                    src="https://shielded.co.nz/img/custom-logo.png"
                    height="24"
                    width="24"
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Pattern with Fade Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Desktop grid pattern - hidden on mobile */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "41px 41px",
            maskImage:
              "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.2) 75%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.9) 50%, rgba(0,0,0,0.2) 75%, transparent 100%)",
          }}
        />
        {/* Mobile grid pattern - visible from right, transparent on left */}
        <div
          className="absolute top-0 right-0 w-3/4 h-full md:hidden"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "41px 41px",
            maskImage:
              "linear-gradient(90deg, transparent 0%, transparent 20%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.9) 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, transparent 20%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.9) 100%)",
          }}
        />
        {/* Dark mode desktop grid overlay - hidden on mobile */}
        <div
          className="absolute inset-0 dark:block hidden md:block"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "41px 41px",
            maskImage:
              "linear-gradient(90deg, transparent 0%, transparent 5%, rgba(0,0,0,0.3) 25%, rgba(0,0,0,0.3) 75%, transparent 95%, transparent 100%) !important",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, transparent 5%, rgba(0,0,0,0.3) 25%, rgba(0,0,0,0.3) 75%, transparent 95%, transparent 100%) !important",
          }}
        />
        {/* Dark mode mobile grid pattern - visible from right, transparent on left */}
        <div
          className="absolute top-0 right-0 w-3/4 h-full dark:hidden md:hidden"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "41px 41px",
            maskImage:
              "linear-gradient(90deg, transparent 0%, transparent 20%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.9) 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, transparent 20%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.9) 100%)",
          }}
        />
      </div>

      {/* Third-party Shielded script */}
      <Script
        src="https://staticcdn.co.nz/embed/embed.js"
        strategy="afterInteractive"
      />
      <Script
        id="shielded-script-welcome"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              window.onload = function(){
                var frameName = new ds07o6pcmkorn({
                  openElementId: "#shielded-logo-welcome",
                  modalID: "modal",
                });
                frameName.init();
              }
            })();
          `,
        }}
      />
    </footer>
  );
}

export default WelcomeFooter;
