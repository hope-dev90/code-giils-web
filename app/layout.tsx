import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code Hills 1001",
  description: "UmucoCore – Rwandan natural resources & products",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
