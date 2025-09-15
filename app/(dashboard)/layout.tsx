import type { Metadata } from "next";
import { AppSidebar } from "@/components/AppSidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DynamicBreadcrumb } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SubPageTimedLoadingPage } from "@/components/loading";
import Image from "next/image";

export const metadata: Metadata = {
  title: {
    default: "Dashboard - Finova",
    template: "%s | Finova",
  },
  description:
    "Manage your personal finances with Finova's comprehensive dashboard. Track assets, monitor budgets, set financial goals, and gain insights into your spending patterns.",
  keywords: [
    "personal finance",
    "budget management",
    "financial planning",
    "asset tracking",
    "expense tracking",
    "financial goals",
    "money management",
    "financial dashboard",
    "portfolio management",
    "net worth tracking",
  ],
  authors: [{ name: "Finova Team" }],
  creator: "Finova",
  publisher: "Finova",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://finova-management.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://finova-management.vercel.app",
    title: "Dashboard - Finova Personal Finance Management",
    description:
      "Manage your personal finances with Finova's comprehensive dashboard. Track assets, monitor budgets, set financial goals, and gain insights into your spending patterns.",
    siteName: "Finova",
    images: [
      {
        url: "/hero/light-desktop-dashboard.png",
        width: 1200,
        height: 630,
        alt: "Finova - Personal Finance Management Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard - Finova Personal Finance Management",
    description:
      "Manage your personal finances with Finova's comprehensive dashboard. Track assets, monitor budgets, set financial goals, and gain insights into your spending patterns.",
    images: ["/hero/light-desktop-dashboard.png"],
    creator: "@finova",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google9813fd8a60e2ef24",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />

        {/* BG transparent V */}
        <SidebarInset className="flex-1 shadow-none! w-full min-w-0 dark:lg:bg-[#171717] lg:bg-[#fafafa]">
          <header className="rounded-b-xl">
            <div className="flex h-16 shrink-0 items-center gap-2 px-4 rounded-xl mb-1 dark:bg-[#0a0a0a] bg-white shadow-sm mt-1">
              <div className="mx-auto max-w-7xl flex items-center gap-2 justify-between w-full">
                <SidebarTrigger className="-ml-1 text-sky-600 cursor-pointer hover:text-sky-800" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <DynamicBreadcrumb />
                <div className="ml-auto">
                  <Image
                    src="/finova-logo.svg"
                    alt="Finova"
                    width={80}
                    height={30}
                  />
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto w-full md:rounded-xl mt-1 md:pt-4 dark:bg-[#0a0a0a] lg:bg-white lg:shadow-sm">
            <SubPageTimedLoadingPage message="Loading your data...">
              {children}
            </SubPageTimedLoadingPage>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// dark:bg-[#0a0a0a]
// dark:bg-[#171717]
