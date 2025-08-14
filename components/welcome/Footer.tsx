"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

function WelcomeFooter() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* GitHub Banner */}
      {showBanner && (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mx-4 mt-4 mb-0 rounded-md">
          <div className="w-full px-4 py-3 mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">
                  Love this project? Star it on GitHub!
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <a
                  href="https://github.com/yourusername/finova"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 bg-white text-gray-900 text-xs font-medium rounded-md hover:bg-gray-100 transition-colors"
                >
                  View on GitHub
                </a>
                <button
                  onClick={() => setShowBanner(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close banner"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full px-4 py-8 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Column 1 - Company Info & Bottom Section */}
          <div className="col-span-1">
            <Image
              src="/logos/logo-full.svg"
              alt="Finova"
              width={120}
              height={48}
              className="mb-4"
            />
            <p className="text-gray-600 text-sm mb-6">
              Transform your financial life <br />
              with our powerful platform.
            </p>

            <div className="mt-8">
              <p className="text-gray-500 text-sm mb-4">
                © 2024 Finova. All rights reserved.
              </p>
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                  Currently in Beta - 100% Free!
                </span>
              </div>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="col-span-1">
            <div className="text-right flex flex-col items-end mt-2.5">
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/#welcome-hero"
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#welcome-features"
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#welcome-pricing"
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#welcome-contact"
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default WelcomeFooter;
