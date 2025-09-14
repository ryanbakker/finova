import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans"; // import font
import "./globals.css";
import { ThemeAwareClerkProvider } from "@/components/ThemeAwareClerkProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UserSync } from "@/components/UserSync";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Finova",
  description: "Manage and understand your finances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.className} antialiased dark:bg-gray-950`}
      suppressHydrationWarning
    >
      <body className="w-full h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeAwareClerkProvider
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}
            signInUrl="/welcome"
            signUpUrl="/welcome"
            afterSignInUrl="/"
            afterSignUpUrl="/"
          >
            <UserSync />
            {children}
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </ThemeAwareClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
