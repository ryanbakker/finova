import type { Metadata } from "next";
import "./../../globals.css";
import { Noto_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Finova - Welcome",
  description: "Sign up to manage and understand your finances",
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
