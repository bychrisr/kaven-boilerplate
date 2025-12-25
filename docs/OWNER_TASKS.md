# Owner Tasks & Manual Actions

This document tracks tasks that require manual intervention, configuration, or decision-making by the project owner to fully leverage the Kaven Boilerplate features.

## 🎨 Branding & Customization

### 1. Define Brand Colors

The system supports color presets. To create a custom brand palette beyond the defaults:

- [ ] Edit `apps/admin/tailwind.config.ts` to define your `primary` range if not using CSS variables.
- [ ] Update `apps/admin/app/globals.css` if using the CSS Variable engine.

### 2. Logo Configuration

- [ ] Replace `public/logo.svg` and `public/favicon.ico` with your brand assets.
- [ ] Update `appName` in `apps/admin/lib/config.ts` (to be created).

## 🔐 Environment Variables

### 1. Authentication Providers (if extending beyond JWT)

If you enable Auth0, Firebase, or other providers:

- [ ] Create accounts on the respective platforms.
- [ ] Populate the `NEXT_PUBLIC_AUTH0_*` or `NEXT_PUBLIC_FIREBASE_*` variables in `.env`.

### 2. Maps (Optional)

- [ ] Get a Mapbox API Key if using map features: `NEXT_PUBLIC_MAPBOX_API_KEY`.

## ⚙️ SaaS Configuration

### 1. Feature Flags

- [ ] Decide which modules are active by default for new tenants in the database or config.

### 2. Multi-Language

- [ ] If supporting multiple languages, prepare translation JSON files in `apps/admin/locales/`.
