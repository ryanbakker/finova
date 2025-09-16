"use client";

import { AppSidebar } from "@/components/AppSidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DynamicBreadcrumb } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FinovaLogo from "@/components/FinovaLogo";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />

        {/* BG transparent V */}
        <SidebarInset className="flex-1 shadow-none! w-full min-w-0 dark:bg-[#171717] bg-[#fafafa]">
          <header className="rounded-b-xl">
            <div className="flex h-16 shrink-0 items-center gap-2 px-4 rounded-xl mb-1 dark:bg-[#0a0a0a] bg-white shadow-sm mt-1">
              <SidebarTrigger className="-ml-1 text-sky-600 cursor-pointer hover:text-sky-800" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <DynamicBreadcrumb />
              <div className="ml-auto">
                <FinovaLogo />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-hidden w-full rounded-xl mt-1 md:pt-4 dark:bg-[#0a0a0a] lg:bg-white shadow-sm">
            <div className="page-content">
              <div className="flex items-center justify-center min-h-[80vh]">
                {/* Main 404 Container */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-12 md:p-16 w-full max-w-4xl shadow-2xl">
                  {/* Animated Background Elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-sky-200 dark:bg-sky-800 rounded-full animate-float-left"></div>
                    <div className="absolute -top-8 -right-8 w-16 h-16 bg-blue-200 dark:bg-blue-800 rounded-full animate-float-right delay-1000"></div>
                    <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-indigo-200 dark:bg-indigo-800 rounded-full animate-float-center delay-2000"></div>
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-sky-300 dark:bg-sky-700 rounded-full animate-float-left delay-500"></div>
                  </div>

                  <div className="relative text-center">
                    {/* Animated 404 Number */}
                    <div className="mb-12">
                      <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent leading-none animate-pulse">
                        404
                      </h1>
                      <div className="w-32 h-1 bg-gradient-to-r from-sky-500 to-blue-500 mx-auto rounded-full animate-pulse"></div>
                    </div>

                    {/* Main Heading with Animation */}
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
                      Page Not Found
                    </h2>

                    {/* Descriptive Text */}
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                      The page you&apos;re looking for doesn&apos;t exist or has
                      been moved. Let&apos;s get you back on track with your
                      financial journey.
                    </p>

                    {/* Action Buttons with Animations */}
                    <div className="flex flex-col md:flex-row gap-4 animate-fade-in-up delay-300">
                      <Button
                        onClick={handleGoBack}
                        className="flex-1 h-14 button-blue-bg text-lg font-medium group hover:scale-105 transition-all duration-300 hover:shadow-lg"
                      >
                        <ArrowLeft className="w-6 h-6 mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
                        Go Back
                      </Button>

                      <Button
                        asChild
                        variant="outline"
                        className="flex-1 h-14 text-lg font-medium border-2 border-sky-200 hover:bg-sky-50 dark:border-sky-800 dark:hover:bg-sky-950/50 group hover:scale-105 transition-all duration-300 hover:shadow-lg"
                      >
                        <Link href="/">
                          <Home className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                          Return to Dashboard
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
