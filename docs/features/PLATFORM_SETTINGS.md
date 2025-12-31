# Platform Settings & White-labeling

**Status**: Implemented
**Scope**: Admin Panel

## Overview

The Platform Settings module allows dynamic configuration of the SaaS white-label properties, including branding, SEO, and social media integration. Settings are persisted in the `PlatformConfig` database table and applied globally via `RootLayout`.

## Features

### 1. Branding Configuration

- **Company Name**: Overrides the default application title.
- **Description**: Meta description for SEO.
- **Primary Color**: dynamic theming overriding CSS variables.
- **Logo URL**: External or internal URL for the application logo.
- **Favicon URL**: Dynamic favicon injection.

### 2. SEO & Social

- **Twitter Handle**: Integrated into social metadata.
- **OG Image**: Open Graph image URL for social sharing.

### 3. Implementation Details

#### Database Schema (`PlatformConfig`)

- Single-row table pattern (fetched via `LIMIT 1`).
- Fields: `companyName`, `description`, `primaryColor`, `logoUrl`, `faviconUrl`, `twitterHandle`, `ogImageUrl`.

#### Theme Application (`layout.tsx`)

The `RootLayout` fetches the configuration server-side and injects CSS variables into the `:root` scope before hydration to prevent flash of unstyled content (FOUC).

```typescript
// layout.tsx logic
const palette = generatePalette(primaryColor);
const themeStyles = `
  :root {
    --primary: ${palette.main};
    /* ... other tokens */
  }
`;
```

#### Settings Interface (`/saas-settings`)

- **Form**: Uses `react-hook-form` + `zod`.
- **Live Preview**: Changes to color and branding are previewed instantly.
- **Uploads**: Supports direct file uploads (mocks or cloud storage) for Logos and OG Images.

## API Endpoints

- `GET /api/settings/platform`: Retrives the current configuration.
- `PUT /api/settings/platform`: Updates the configuration. Validates input using Zod.
