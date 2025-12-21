import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
