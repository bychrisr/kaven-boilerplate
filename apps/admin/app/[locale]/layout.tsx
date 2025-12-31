import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '@fontsource-variable/dm-sans';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/barlow/800.css';
import '../globals.css';

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

import { ThemeProvider } from '@/providers/theme-provider';
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
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     const result: any[] = await prisma.$queryRaw`SELECT "primaryColor", "faviconUrl" FROM "PlatformConfig" LIMIT 1`;
     if (result && result.length > 0) {
        if (result[0].primaryColor) primaryColor = result[0].primaryColor;
        if (result[0].faviconUrl) faviconUrl = result[0].faviconUrl;
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
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
            <ThemeProvider defaultMode="dark">
             {children}
            </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
