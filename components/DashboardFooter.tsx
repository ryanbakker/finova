import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

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
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <ul className="flex items-center gap-4">
            <li>
              <a href="#" id="shielded-logo">
                <Image
                  alt="shielded"
                  src="https://shielded.co.nz/img/custom-logo.png"
                  height="30"
                  width="30"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
              </a>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="https://creativecommons.org/licenses/by-nc/4.0/"
                target="_blank"
                className="hover:text-foreground transition-colors"
              >
                License
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Third-party Shielded script */}
      <Script
        src="https://staticcdn.co.nz/embed/embed.js"
        strategy="afterInteractive"
      />
      <Script
        id="shielded-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              window.onload = function(){
                var frameName = new ds07o6pcmkorn({
                  openElementId: "#shielded-logo",
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
