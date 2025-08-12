import type { Metadata } from "next";
import "./../../globals.css";

export const metadata: Metadata = {
  title: "Finova - Welcome",
  description: "Sign up to manage and understand your finances",
};

export default function WelcomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
