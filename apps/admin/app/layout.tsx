import type { Metadata } from "next";
import "./globals.css";
import { DesignSystemProvider } from "@/lib/design-system";

export const metadata: Metadata = {
  title: "Kaven Admin Panel",
  description: "Admin panel for Kaven Boilerplate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <DesignSystemProvider>
          {children}
        </DesignSystemProvider>
      </body>
    </html>
  );
}
