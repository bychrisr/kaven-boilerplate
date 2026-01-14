import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Plus_Jakarta_Sans, Source_Code_Pro } from 'next/font/google';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-code',
});

export const metadata: Metadata = {
  title: 'Kaven Admin',
  description: 'SaaS Admin Dashboard',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
};

import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { prisma } from '@/lib/prisma';
import { generatePalette } from '@/utils/color';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 1. Fetch Platform Config (Server-side)
  let primaryColor = '#00A76F'; // Default
  let faviconUrl = '/favicon.ico'; // Default fallback

  try {
    // ✅ AXISOR/KAVEN STYLE: Use Prisma ORM instead of raw query to handle case-sensitivity and schema mapping
    const config = await prisma.platformConfig.findFirst({
      select: {
        primaryColor: true,
        faviconUrl: true,
      }
    });

    if (config) {
      if (config.primaryColor) primaryColor = config.primaryColor;
      if (config.faviconUrl) faviconUrl = config.faviconUrl;
    }
  } catch (error) {
     console.error('[RootLayout] Failed to fetch PlatformConfig:', error);
  }

  // 2. Generate Palette
  const palette = generatePalette(primaryColor);

  // 3. Generate CSS
  const themeStyles = `
    :root {
      --primary: ${palette.main};
      --primary-foreground: ${palette.contrastText};
      --primary-lighter: ${palette.lighter};
      --primary-light: ${palette.light};
      --primary-main: ${palette.main};
      --primary-dark: ${palette.dark};
      --primary-darker: ${palette.darker};
      --sidebar-primary: ${palette.main};
      --sidebar-primary-foreground: ${palette.contrastText};
    }
  `;

  // 4. Fetch i18n messages
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <link rel="icon" href={faviconUrl} />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} ${plusJakarta.variable} ${sourceCodePro.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <TooltipProvider delayDuration={200} skipDelayDuration={300}>
              <ThemeProvider defaultMode="dark">
               {children}
              </ThemeProvider>
            </TooltipProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
