import type { Metadata } from "next";
import "./globals.css";
import { ThemeAwareClerkProvider } from "@/components/ThemeAwareClerkProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UserSync } from "@/components/UserSync";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Noto_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: {
    default: "Finova - Personal Finance Management",
    template: "%s | Finova",
  },
  description:
    "Take control of your financial future with Finova. Track assets, manage budgets, set goals, and gain insights into your spending patterns with our comprehensive personal finance management platform.",
  keywords: [
    "personal finance",
    "budget management",
    "financial planning",
    "asset tracking",
    "expense tracking",
    "financial goals",
    "money management",
    "financial dashboard",
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
    title: "Finova - Personal Finance Management",
    description:
      "Take control of your financial future with Finova. Track assets, manage budgets, set goals, and gain insights into your spending patterns.",
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
    title: "Finova - Personal Finance Management",
    description:
      "Take control of your financial future with Finova. Track assets, manage budgets, set goals, and gain insights into your spending patterns.",
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

const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${notoSans.className} antialiased dark:bg-gray-950`}
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
