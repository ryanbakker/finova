import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
