import type { Metadata } from 'next';
import '@fontsource-variable/dm-sans';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/barlow/800.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kaven Admin Panel',
  description: 'Admin panel for Kaven Boilerplate',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
