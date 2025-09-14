import type { Metadata } from "next";
import "./../../globals.css";
import { Noto_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Welcome to Finova - Personal Finance Management",
  description:
    "Sign up to manage and understand your finances with Finova. Take control of your financial future with our comprehensive personal finance management platform.",
  keywords: [
    "personal finance",
    "budget management",
    "financial planning",
    "asset tracking",
    "expense tracking",
    "financial goals",
    "money management",
    "financial dashboard",
    "sign up",
    "welcome",
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
    canonical: "/welcome",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://finova-management.vercel.app/welcome",
    title: "Welcome to Finova - Personal Finance Management",
    description:
      "Sign up to manage and understand your finances with Finova. Take control of your financial future with our comprehensive personal finance management platform.",
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
    title: "Welcome to Finova - Personal Finance Management",
    description:
      "Sign up to manage and understand your finances with Finova. Take control of your financial future with our comprehensive personal finance management platform.",
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

export default function WelcomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className={notoSans.className}>{children}</main>;
}
