# Internationalization (i18n) Architecture

**Status**: Implemented
**Version**: 1.0.0
**Library**: `next-intl`

## Overview

The application uses `next-intl` for comprehensive internationalization, supporting localized routing, server-side message loading, and type-safe translations.

## Core Components

### 1. Middleware (`middleware.ts`)

The middleware is the entry point for localization. It intercepts requests to:

- Detect the user's preferred locale.
- Redirect root paths (`/`) to localized paths (`/pt`, `/en`).
- **Critical Configuration**: The `matcher` must exclude API routes, static files, and Next.js internals to avoid hydration mismatches and "blank screen" issues.

```typescript
export const config = {
  // Match all pathnames EXCEPT:
  // - /api/*
  // - /_next/*
  // - /_vercel/*
  // - files with extensions (e.g. favicon.ico)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

### 2. Request Configuration (`i18n/request.ts`)

Configures how messages are loaded on the server.

- **Locales**: `['en', 'pt']`
- **Default**: `pt`
- **Messages**: JSON files located in `apps/admin/messages/{locale}.json`.

### 3. Routing (`i18n/routing.ts`)

Defines the `defineRouting` configuration and exports locale-aware navigation wrappers:

- `Link`
- `useRouter`
- `usePathname`
- `redirect`

**Usage Rule**: MUST use these wrappers instead of `next/link` or `next/navigation` within the `app/[locale]` tree to ensure the locale prefix is preserved.

### 4. Client Provider (`layout.tsx`)

`NextIntlClientProvider` wraps the application in the Root Layout, hydrating client components with the messages fetched server-side.

## Usage Guide

### Server Components

```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('Dashboard');
  return <h1>{t('title')}</h1>;
}
```

### Client Components

```typescript
'use client';
import { useTranslations } from 'next-intl';

export function Welcome() {
  const t = useTranslations('Common');
  return <div>{t('welcome')}</div>;
}
```

### Translating Routes

Routes are automatically prefixed (e.g., `/pt/dashboard`). The `middleware` handles the redirection. Code should link to the logical path `/dashboard`, and the `Link` component handles the prefix.
