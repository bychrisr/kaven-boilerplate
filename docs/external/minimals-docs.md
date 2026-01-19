# Documentação: https://docs.minimals.cc/introduction/

*Gerado automaticamente por Documentation Crawler v2.0.2*
*Data: 2026-01-06 00:56:43*

## Metadados da Execução

- **Total de páginas**: 43
- **Páginas falhas**: 1
- **Cache hits**: 43
- **Links encontrados**: 43
- **Code blocks extraídos**: 0

## Table of Contents

- [API calls](#api-calls)
- [changelog](#changelog)
- [Clean project](#clean-project)
- [Colors](#colors)
- [Credit assets](#credit-assets)
- [CSS variables](#css-variables)
- [Dependencies](#dependencies)
- [Deployment](#deployment)
- [Environment variables](#environment-variables)
- [Figma guide](#figma-guide)
- [Global configuration](#global-configuration)
- [Global styles](#global-styles)
- [Icons](#icons)
- [Minimal - Client & Admin Dashboard](#minimal---client--admin-dashboard)
- [Layout](#layout)
- [Logo](#logo)
- [Migrate to CRA](#migrate-to-cra)
- [Mock server](#mock-server)
- [Global overrides MUI components](#global-overrides-mui-components)
- [Multi language](#multi-language)
- [Navigation](#navigation)
- [Package & license](#package--license)
- [Quick start](#quick-start)
- [Routing](#routing)
- [Settings](#settings)
- [Shadows](#shadows)
- [Project structure](#project-structure)
- [Subfolder](#subfolder)
- [Faqs & support](#faqs--support)
- [Integration Tailwind](#integration-tailwind)
- [Typography](#typography)
- [Update guide](#update-guide)
- [Colors](#colors)
- [Layout](#layout)
- [Logo](#logo)
- [Settings](#settings)
- [Shadows](#shadows)
- [Typography](#typography)
- [Colors](#colors)
- [Settings](#settings)
- [Typography](#typography)
- [Settings](#settings)

---



*Fonte: [https://docs.minimals.cc/](https://docs.minimals.cc/)*

---

# API calls

##### Basic example

Example using base SWR

```tsx
import useSWR from 'swr';
import { fetcher } from 'src/utils/axios';
 
function ProductList() {
  const { data, error, isLoading } = useSWR('/api/product/list', fetcher);
 
  if (error) return <div>failed to load</div>;
 
  if (isLoading) return <div>loading...</div>;
 
  return (
    <>
      {data.products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </>
  );
}
```

##### Set base url

Define the base url in .env.

`.env`
```text
REACT_APP_HOST_API=https://www.your-domain.com
```

Setup axios instance

```javascript
const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_HOST_API });
```

Use Axios + SWR

```tsx
import useSWR from 'swr';
import axios, { fetcher } from 'src/utils/axios';
 
const fetcher = (url) => axios.get(url).then((res) => res.data);
 
function ProductList() {
  // const { data, error, isLoading } = useSWR(`https://www.your-domain.com/api/product/list`, fetcher);
  const { data, error, isLoading } = useSWR(`/api/product/list`, fetcher);
 
  if (error) return <div>failed to load</div>;
 
  if (isLoading) return <div>loading...</div>;
 
  return (
    <>
      {data.products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </>
  );
}
```

##### Without base url

We provide a demo API with a base URL. To avoid conflicts during development, you can work with parallel API calls without the base URL.

You can replace it after development is complete.

```tsx
import useSWR from 'swr';
import axios from 'axios';
 
const fetcher = (url) => axios.get(url).then((res) => res.data);
 
function ProductList() {
  const { data, error, isLoading } = useSWR(
    `https://www.your-domain.com/api/product/list`,
    fetcher
  );
 
  if (error) return <div>failed to load</div>;
 
  if (isLoading) return <div>loading...</div>;
 
  return (
    <>
      {data.products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </>
  );
}
```

*Fonte: [https://docs.minimals.cc/api-calls/](https://docs.minimals.cc/api-calls/)*

---

# changelog

### v7.6.1

###### Dec 15, 2025

- [Next.js] Resolved security vulnerabilities: Next.js Security Update: December 11, 2025.

- [React] Resolved security vulnerabilities: Denial of Service and Source Code Exposure in React Server Components.

- Updated dependencies.

### v7.6.0

###### Dec 6, 2025

- New Upgraded to Next.js v16.

- [Next.js] Resolved security vulnerabilities: Security Advisory: CVE-2025-66478.

- [React] Resolved security vulnerabilities: Critical Security Vulnerability in React Server Components.

- Updated TypeScript types in src/theme/with-settings/update-core.ts.

- Updated ESLint rules in in eslint.config.mjs.

- Updated dependencies.

`src/theme/with-settings/update-core.ts`
`eslint.config.mjs`
### v7.5.0

###### Oct 1, 2025

- Updated src/components/custom-popover/*.

- Updated src/components/mega-menu/mobile/*.

- Updated src/sections/kanban/column/styles.*

- Updated src/auth/guard/guest-guard.*

- Updated src/auth/view/auth0/auth0-sign-in-view.*

- Updated src/layouts/components/account-popover.*

- Updated src/layouts/components/contacts-popover.*

- Updated src/theme/core/mixins/global-styles-components.*

- Updated dependencies.

`src/components/custom-popover/*`
`src/components/mega-menu/mobile/*`
`src/sections/kanban/column/styles.*`
`src/auth/guard/guest-guard.*`
`src/auth/view/auth0/auth0-sign-in-view.*`
`src/layouts/components/account-popover.*`
`src/layouts/components/contacts-popover.*`
`src/theme/core/mixins/global-styles-components.*`
### v7.4.0

###### Aug 8, 2025

- New zod v4 (validation).

- Replace mapbox-gl with maplibre-gl (map).

- Replace @dnd-kit/* with @atlaskit/pragmatic-drag-and-drop/* (kanban).

- Updated src/theme/*.

- Updated src/components/map/*.

- Updated src/components/chart/*.

- Updated src/components/editor/*.

- Updated src/components/upload/*.

- Updated src/components/lightbox/*.

- Updated src/components/hook-form/*.

- Updated src/components/phone-input/*.

- Updated src/components/file-thumbnail/*.

- Updated src/locales/use-locales.*.

- Updated src/utils/format-time.*.

- Updated dependencies.

`zod`
`mapbox-gl`
`maplibre-gl`
`@dnd-kit/*`
`@atlaskit/pragmatic-drag-and-drop/*`
`src/theme/*`
`src/components/map/*`
`src/components/chart/*`
`src/components/editor/*`
`src/components/upload/*`
`src/components/lightbox/*`
`src/components/hook-form/*`
`src/components/phone-input/*`
`src/components/file-thumbnail/*`
`src/locales/use-locales.*`
`src/utils/format-time.*`
### v7.3.0

###### Jun 22, 2025

- Updated src/theme/*.

- Updated src/components/label/*.

- Updated src/components/carousel/*.

- Updated src/components/snackbar/*.

- Updated src/components/country-select/*.

- Updated src/components/loading-screen/*.

- Updated src/components/custom-data-grid/*.

- Updated src/components/hook-form/help-text.tsx.

- Updated src/components/animate/variants/fade.ts.

- Updated src/components/custom-date-range-picker/*.

- Updated src/components/hook-form/rhf-autocomplete.tsx.

- Updated src/sections/calendar/*.

- Updated borderRadius: theme.shape.borderRadius * 2 => borderRadius: Number(theme.shape.borderRadius) * 2.

- Replaced <CustomTabs/> to <Tabs indicatorColor="custom">.

- Updated dependencies.

- Updated Figma.

`src/theme/*`
`src/components/label/*`
`src/components/carousel/*`
`src/components/snackbar/*`
`src/components/country-select/*`
`src/components/loading-screen/*`
`src/components/custom-data-grid/*`
`src/components/hook-form/help-text.tsx`
`src/components/animate/variants/fade.ts`
`src/components/custom-date-range-picker/*`
`src/components/hook-form/rhf-autocomplete.tsx`
`src/sections/calendar/*`
`borderRadius: theme.shape.borderRadius * 2`
`borderRadius: Number(theme.shape.borderRadius) * 2`
`<CustomTabs/>`
`<Tabs indicatorColor="custom">`
### v7.2.0

###### May 26, 2025

- Updated src/theme/*.

- Updated src/components/settings/*.

- Updated src/components/hook-form/*.

- Updated src/components/phone-input/*.

- Updated dependencies.

`src/theme/*`
`src/components/settings/*`
`src/components/hook-form/*`
`src/components/phone-input/*`
### v7.1.0

###### May 19, 2025

- New MUI X v8. Upgrade guide

- Add src/components/custom-data-grid/*.

- Updated ./public.

- Updated src/theme/*.

- Updated src/locales/*.

- Updated src/components/editor/*.

- Updated src/components/settings/*.

- Updated src/components/nav-basic/*.

- Updated src/components/mega-menu/*.

- Updated src/components/hook-form/*.

- Updated src/components/nav-section/*.

- Updated src/components/phone-input/*.

- Updated src/components/progress-bar/*.

- Updated src/components/country-select/*.

- Updated src/routes/hooks/use-router.*.

- Updated src/lib/axios.*.

- Updated eslint.config.mjs.

- Updated next.config.*.

- Updated dependencies.

`src/components/custom-data-grid/*`
`./public`
`src/theme/*`
`src/locales/*`
`src/components/editor/*`
`src/components/settings/*`
`src/components/nav-basic/*`
`src/components/mega-menu/*`
`src/components/hook-form/*`
`src/components/nav-section/*`
`src/components/phone-input/*`
`src/components/progress-bar/*`
`src/components/country-select/*`
`src/routes/hooks/use-router.*`
`src/lib/axios.*`
`eslint.config.mjs`
`next.config.*`
### v7.0.0

###### Mar 30, 2025

- New React v19.

- New MUI v7. Upgrade guide

- New Next.js v15. Upgrade guide

- Updated ./public.

- Updated src/theme/*.

- Migrated social icons in src/assets/icons/social-icons.* to Iconify.

- Replaced currentRole logic with checkPermissions in src/components/nav-section/* for improved role handling.

- Removed all instances of forwardRef to leverage React 19’s built-in support.

- Enabled offline mode for Iconify icons. Learn more

- Migrated from deprecated MUI component APIs. Migration guide

- Temporarily remove walktour component (React 19 not supported).

- Updated dependencies.

`./public`
`src/theme/*`
`src/assets/icons/social-icons.*`
`currentRole`
`checkPermissions`
`src/components/nav-section/*`
`forwardRef`
`walktour`
### v6.3.0

###### Jan 01, 2025

- Update src/auth/context/amplify/auth-provider.*.

- Update src/auth/context/auth0/auth-provider.*.

- Update src/auth/guard/guest-guard.*.

- Update src/components/animate/scroll-progress/scroll-progress.*.

- Update src/components/settings/*.

- Update src/theme/core/components/*.

- Add ErrorBoundary router component for Vite.js (src/main.*).

- Update slots and slotProps ListItemText.

- Update dependencies.

`src/auth/context/amplify/auth-provider.*`
`src/auth/context/auth0/auth-provider.*`
`src/auth/guard/guest-guard.*`
`src/components/animate/scroll-progress/scroll-progress.*`
`src/components/settings/*`
`src/theme/core/components/*`
`ErrorBoundary`
`src/main.*`
`slots`
`slotProps`
### v6.2.0

###### Dec 06, 2024

- New MUI v6.

- New React router v7.

- New Eslint v9 (Flat config).

- Public hooks and utils folder on npm (npm i minimal-shared).

- Update src/theme.

- Update src/layout.

- Update src/components.

- Add new component number input

- Add new example pagination with API

- Add new example layout

- Update folder API minimal-api-dev-v6.2.0.zip.

- Remove react-lazy-load-image-component.

- Refactor and simplify project code.

- Update dependencies.

`hooks`
`utils`
`src/theme`
`src/layout`
`src/components`
`minimal-api-dev-v6.2.0.zip`
`react-lazy-load-image-component`
### v6.1.0

###### Aug 21, 2024

- Update public.

- Update src/theme.

- Update src/layout.

- Update src/global.css.

- Update src/config-global.ts.

- Update src/hooks/use-debounce.ts.

- Update src/hooks/use-countdown.ts.

- Update src/hooks/use-client-rect.ts.

- Update src/components/map.

- Update src/components/logo.

- Update src/components/chart.

- Update src/components/upload.

- Update src/components/editor.

- Update src/components/iconify.

- Update src/components/carousel.

- Update src/components/svg-color.

- Update src/components/hook-form.

- Update src/components/phone-input.

- Update src/components/table/utils.ts.

- Update src/components/country-select.

- Move src/sections/auth and src/sections/auth-demo into src/auth/view.

- Update dependencies.

`public`
`src/theme`
`src/layout`
`src/global.css`
`src/config-global.ts`
`src/hooks/use-debounce.ts`
`src/hooks/use-countdown.ts`
`src/hooks/use-client-rect.ts`
`src/components/map`
`src/components/logo`
`src/components/chart`
`src/components/upload`
`src/components/editor`
`src/components/iconify`
`src/components/carousel`
`src/components/svg-color`
`src/components/hook-form`
`src/components/phone-input`
`src/components/table/utils.ts`
`src/components/country-select`
`src/sections/auth`
`src/sections/auth-demo`
`src/auth/view`
### v6.0.1

###### Jun 16, 2024

- Vite.js

- Fix src/components/animate/motion-lazy.

- Update example src/sections/_examples/extra/multi-language-view/view.

- Update example src/pages/components/extra/multi-language/index.

- Next.js

- Update example src/sections/_examples/extra/multi-language-view/view.

- Update example src/app/components/extra/multi-language/page.

`src/components/animate/motion-lazy`
`src/sections/_examples/extra/multi-language-view/view`
`src/pages/components/extra/multi-language/index`
`src/sections/_examples/extra/multi-language-view/view`
`src/app/components/extra/multi-language/page`
### v6.0.0

###### Jun 14, 2024

- Remove lodash.

- Remove prop-types.

- Replace date-fns with dayjs.

- Replace @hello-pangea/dnd with dnd-kit.

- Replace notistack with sonner.

- Replace react-quill with tiptap.

- Replace react-slick with embla-carousel.

- Replace yup with zod.

- Integration font with @fontsource.

- Integration react-phone-number-input.

- Migrate to CssVarsProvider

- Update design.

- Update dependencies.

- Update eslint and prettier config.

- Refactor and simplify project code.

- Reimplement existing auth providers.

`lodash`
`prop-types`
`date-fns`
`dayjs`
`@hello-pangea/dnd`
`dnd-kit`
`notistack`
`sonner`
`react-quill`
`tiptap`
`react-slick`
`embla-carousel`
`yup`
`zod`
`@fontsource`
`react-phone-number-input`
### v5.7.0

###### Dec 11, 2023

- New support next.js 14.

- New component Walktour.

- New component CountrySelect.

- New method Supabase authenticate.

- Update src/utils/format-number.ts.

- Update src/utils/format-time.ts.

- Update src/theme/overrides.

- Update src/auth/context/amplify/auth-provider.tsx.

- Update src/components/hook-form/rhf-autocomplete.tsx.

- Update src/components/nav-basic.

- Update src/components/progress-bar. (Next.js)

- Update src/components/table/use-table.ts.

- Update src/locales/config-lang.ts.

- Update src/locales/i18n.ts.

- Fix Bug src/sections/user/view/user-list-view.tsx. (tableData/dataFiltered)

- Fix Bug src/sections/order/view/order-list-view.tsx. (tableData/dataFiltered)

- Fix Bug src/sections/invoice/view/invoice-list-view.tsx. (tableData/dataFiltered)

- Migrate Product Table to DataGrid.

- Update dependencies.

`src/utils/format-number.ts`
`src/utils/format-time.ts`
`src/theme/overrides`
`src/auth/context/amplify/auth-provider.tsx`
`src/components/hook-form/rhf-autocomplete.tsx`
`src/components/nav-basic`
`src/components/progress-bar`
`src/components/table/use-table.ts`
`src/locales/config-lang.ts`
`src/locales/i18n.ts`
`src/sections/user/view/user-list-view.tsx`
`src/sections/order/view/order-list-view.tsx`
`src/sections/invoice/view/invoice-list-view.tsx`
`Table`
### v5.6.0

###### Oct 08, 2023

- New src/components/nav-basic.

- Update src/components/nav-section.

- Update src/components/mega-menu.

- Update src/theme.

- Update src/auth/guard/auth-guard.

- Update src/auth/guard/guest-guard.

- Update src/locales/use-locales.

- Update <RHFMultiSelect/>.

- Remove <AuthConsumer/>.

- Remove .eslintrc.

- Change external style import strategy

- Temporarily stop supporting create-react-app version (tracking).

- Update dependencies.

`src/components/nav-basic`
`src/components/nav-section`
`src/components/mega-menu`
`src/theme`
`src/auth/guard/auth-guard`
`src/auth/guard/guest-guard`
`src/locales/use-locales`
`<RHFMultiSelect/>`
`<AuthConsumer/>`
`.eslintrc`
`create-react-app`
### v5.5.0

###### Aug 30, 2023

- Update src/components/progress-bar (Next.js version only).

- Update src/components/loading-screen/splash-screen.tsx.

- Update src/theme/overrides/components/avatar.tsx.

- Update src/layouts/_common/account-popover.tsx.

- Update src/layouts/_common/searchbar/searchbar.js.

- Update src/sections/chat/view/chat-view.tsx.

- Update src/sections/chat/chat-message-input.tsx.

- Update src/sections/chat/chat-message-item.tsx.

- Update src/sections/chat/chat-nav-item.tsx.

- Update src/sections/kanban/view/kanban-view.tsx.

- Fix bug dashboard layout src/layouts/dashboard/layout.tsx.

- Update dependencies.

`src/components/progress-bar`
`src/components/loading-screen/splash-screen.tsx`
`src/theme/overrides/components/avatar.tsx`
`src/layouts/_common/account-popover.tsx`
`src/layouts/_common/searchbar/searchbar.js`
`src/sections/chat/view/chat-view.tsx`
`src/sections/chat/chat-message-input.tsx`
`src/sections/chat/chat-message-item.tsx`
`src/sections/chat/chat-nav-item.tsx`
`src/sections/kanban/view/kanban-view.tsx`
`src/layouts/dashboard/layout.tsx`
### v5.4.0

###### Aug 10, 2023

- Update src/hooks/use-local-storage.ts.

- Update src/components/settings/context/settings-provider.tsx.

- Update src/sections/checkout/context/checkout-provider.tsx.

- Update src/locales/config-lang.ts.

- Update src/locales/localization-provider.tsx.

- Update src/components/animate/motion-lazy.tsx.

- Update src/components/upload.

- Update src/components/loading-screen/splash-screen.tsx.

- Update src/components/progress-bar (CRA / Vite version only).

- Update dependencies.

- [Figma] Migrate to variables.

`src/hooks/use-local-storage.ts`
`src/components/settings/context/settings-provider.tsx`
`src/sections/checkout/context/checkout-provider.tsx`
`src/locales/config-lang.ts`
`src/locales/localization-provider.tsx`
`src/components/animate/motion-lazy.tsx`
`src/components/upload`
`src/components/loading-screen/splash-screen.tsx`
`src/components/progress-bar`
### v5.3.0

###### Jul 17, 2023

- Update theme folder.

- Rename folder src/routes/hook => src/routes/hooks

- Fix Right-to-left (src/theme/options/right-to-left.tsx).

- Fix Next.js Dark mode (src/theme/next-emotion-cache.tsx).

- Update dependencies.

`theme`
`src/routes/hook`
`src/routes/hooks`
`Right-to-left`
`Dark mode`
### v5.2.0

###### Jul 04, 2023

- Completely remove redux.

- Migrate checkout redux-slice to react-context.

- Update src/auth/guard/guest-guard.

- Support dynamic routes with next output: 'export.(tracking)

- Update dependencies.

`redux-slice`
`react-context`
`src/auth/guard/guest-guard`
`dynamic routes`
`output: 'export`
### v5.1.0

###### Jun 17, 2023

- Add Vite version.

- Migrate redux to swr.

- Update src/auth/guard/auth-guard.tsx.

- Update src/layouts/auth/modern.tsx.

- Update src/layouts/dashboard/main.tsx.

- Update src/sections/auth/jwt/jwt-login-view.tsx.

- Update src/sections/auth/jwt/jwt-register-view.tsx.

- Update src/components/nav-section/mini/nav-item.tsx.

- Update src/sections/auth/amplify/amplify-login-view.tsx.

- Update src/sections/auth/firebase/firebase-login-view.tsx.

- Update src/components/nav-section/horizontal/nav-item.tsx.

- Update src/components/settings/drawer/settings-drawer.tsx.

- Update dependencies.

`redux`
`swr`
`src/auth/guard/auth-guard.tsx`
`src/layouts/auth/modern.tsx`
`src/layouts/dashboard/main.tsx`
`src/sections/auth/jwt/jwt-login-view.tsx`
`src/sections/auth/jwt/jwt-register-view.tsx`
`src/components/nav-section/mini/nav-item.tsx`
`src/sections/auth/amplify/amplify-login-view.tsx`
`src/sections/auth/firebase/firebase-login-view.tsx`
`src/components/nav-section/horizontal/nav-item.tsx`
`src/components/settings/drawer/settings-drawer.tsx`
### v5.0.0

###### Jun 05, 2023

- Support Next.js appDir version.

- Add Order pages.

- Add Job pages.

- Add Tour pages.

- Improve the performance.

- Update project folder structure.

- Refactor authentication flows.

- Refactor and simplify project code.

- Update dependencies.

- Update Figma.

- Discontinue support for Sketch files.

`Next.js`
### v4.3.0

###### Feb 21, 2023

- Add src/components/scroll-progress.

- Update src/components/chart/useChart.

- Update some rule in Yup (remove nullable(), update types...).

- Upgrade dependencies to the latest versions.

`src/components/scroll-progress`
`src/components/chart/useChart`
`nullable()`
### v4.2.0

###### Jan 18, 2023

- Update src/@types/calendar.

- Update src/pages/dashboard/CalendarPage.

- Update src/sections/@dashboard/calendar.

- Update src/redux/slices/calendar.

- Update src/hooks/useOffSetTop.

- Update src/auth/FirebaseContext.

- Update src/components/scrollbar.

- Update src/sections/home/HomeHero.

- Update src/components/carousel/CarouselDots.

- Update src/components/custom-breadcrumbs/LinkItem.

- Update src/sections/@dashboard/invoice/form/InvoiceAddressListDialog.

- Update types type RHFMultiSelectProps in src/components/hook-form/RHFSelect.

- Update import 'simplebar/src/simplebar.css'; =>import 'simplebar-react/dist/simplebar.min.css';

- Update next.config.js (Next.js).

- Update .eslintignore (Next.js).

- Upgrade dependencies to the latest versions.

`src/@types/calendar`
`src/pages/dashboard/CalendarPage`
`src/sections/@dashboard/calendar`
`src/redux/slices/calendar`
`src/hooks/useOffSetTop`
`src/auth/FirebaseContext`
`src/components/scrollbar`
`src/sections/home/HomeHero`
`src/components/carousel/CarouselDots`
`src/components/custom-breadcrumbs/LinkItem`
`src/sections/@dashboard/invoice/form/InvoiceAddressListDialog`
`type RHFMultiSelectProps`
`src/components/hook-form/RHFSelect`
`import 'simplebar/src/simplebar.css';`
`import 'simplebar-react/dist/simplebar.min.css';`
`next.config.js`
`.eslintignore`
### v4.1.0

###### Nov 26, 2022

- NEW Support next.js 13.

- Update src/components/lightbox/*.

- Update src/components/markdown/*.

- Update src/components/hook-form/*.

- Update src/components/editor/Editor.

- Update src/components/chart/useChart.

- Update src/components/nav-section/mini/NavList.

- Update src/components/custom-avatar/CustomAvatar.

- Update src/components/nav-section/horizontal/NavList.

- Update src/components/date-range-picker/useDateRangePicker.

- Update src/components/loading-screen/LoadingScreen (cra_version only).

- Update src/redux.

- Update src/theme.

- Update src/App (cra_version only).

- Update src/index (cra_version only).

- Update eslint.

- Migrate react-beautiful-dnd => @hello-pangea/dnd.

- Migrate react-image-lightbox => yet-another-react-lightbox.

- Improve & rename folder structure.

- Upgrade dependencies to the latest versions.

- Design: Update Sketch v4.

`src/components/lightbox/*`
`src/components/markdown/*`
`src/components/hook-form/*`
`src/components/editor/Editor`
`src/components/chart/useChart`
`src/components/nav-section/mini/NavList`
`src/components/custom-avatar/CustomAvatar`
`src/components/nav-section/horizontal/NavList`
`src/components/date-range-picker/useDateRangePicker`
`src/components/loading-screen/LoadingScreen`
`src/redux`
`src/theme`
`src/App`
`src/index`
`react-beautiful-dnd`
`@hello-pangea/dnd`
`react-image-lightbox`
`yet-another-react-lightbox`
### v4.0.0

###### Oct 15, 2022

- NEW Home page.

- NEW General file page.

- NEW File manager page.

- NEW Components date range picker.

- NEW Components nav section mini.

- Add Calendar filters.

- Add Reset Button when filters user list.

- Add Reset Button when filters product list.

- Add Reset Button when filters invoice list.

- Add confirmation dialog when deleting item.

- Add src/components/hook-form/RHFAutocomplete.

- Add src/components/file-thumbnail.

- Update src/layouts.

- Update src/theme.

- Remove src/components/Page.

- Remove src/components/emoji-picker.

- Remove src/components/SocialsButton.

- Remove src/components/TextIconLabel.

- Remove src/components/CopyClipboard.

- Remove src/contexts/CollapseDrawerContext.

- Remove and add some new hooks.

- Improve & rename folder structure.

- Upgrade dependencies to the latest versions.

- Design: Update Figma (Sketch no update)

`Reset Button`
`Reset Button`
`Reset Button`
`src/components/hook-form/RHFAutocomplete`
`src/components/file-thumbnail`
`src/layouts`
`src/theme`
`src/components/Page`
`src/components/emoji-picker`
`src/components/SocialsButton`
`src/components/TextIconLabel`
`src/components/CopyClipboard`
`src/contexts/CollapseDrawerContext`
### v3.5.0

###### Jul 04, 2022

- Support React 18.

- Resolve warning npm vulnerabilities when install. (React script version / skip if using yarn).

- Add src/components/organizational-chart (view).

- Update theme / overrides.

- Update src/guards/GuestGuard.

- Update src/contexts/AwsCognitoContext (TS version).

- Update src/components/emoji-picker.

- Update src/components/Image.

- Update src/components/Scrollbar (TS version).

- Update src/components/hook-form.

- Update src/components/map.

- Update src/components/nav-section. (Infinity menu level support)

- Update src/layouts/main/MenuDesktop.

- Update src/layouts/main/MenuMobile.

- Improve filter products src/pages/dashboard/EcommerceShop.

- Improve invoice create function.

- Remove src/utils/mapboxgl.

- Improve folder structure.

- Upgrade some dependencies to the latest versions.

`src/components/organizational-chart`
`theme / overrides`
`src/guards/GuestGuard`
`src/contexts/AwsCognitoContext`
`src/components/emoji-picker`
`src/components/Image`
`src/components/Scrollbar`
`src/components/hook-form`
`src/components/map`
`src/components/nav-section`
`src/layouts/main/MenuDesktop`
`src/layouts/main/MenuMobile`
`src/pages/dashboard/EcommerceShop`
`src/utils/mapboxgl`
### v3.4.0

###### Apr 11, 2022

- Add src/pages/auth/NewPassword.

- Add src/pages/Page403.

- Update /src/components/hook-form/*.

- Update /src/components/nav-section/*.(support for translation, role based guard)

- Update /src/components/settings/*.

- Update /src/components/upload/*.

- Update /src/components/table/*.

- Update /src/components/EmptyContent.

- Update /src/components/Label.

- Update /src/components/MenuPopover.

- Update /src/components/LightboxModal.

- Update /src/components/LoadingScreen.

- Update /src/components/NotistackProvider.

- Update /src/contexts/SettingsProvider.

- Update /src/guards/AuthGuard.

- Update /src/guards/RoleBasedGuard.

- Update /src/hooks/useLocales.

- Update /src/locales/*.

- Update src/pages/dashboard/Kanban.

- Update src/pages/dashboard/GeneralAnalytics.

- Update src/pages/dashboard/GeneralApp.

- Update src/pages/dashboard/GeneralBanking.

- Update src/pages/dashboard/GeneralBooking.

- Update src/utils/jwt.ts

- Update src/config.ts

- Improve folder structure

- Upgrade some dependencies to the latest versions.

`src/pages/auth/NewPassword`
`src/pages/Page403`
`/src/components/hook-form/*`
`/src/components/nav-section/*`
`/src/components/settings/*`
`/src/components/upload/*`
`/src/components/table/*`
`/src/components/EmptyContent`
`/src/components/Label`
`/src/components/MenuPopover`
`/src/components/LightboxModal`
`/src/components/LoadingScreen`
`/src/components/NotistackProvider`
`/src/contexts/SettingsProvider`
`/src/guards/AuthGuard`
`/src/guards/RoleBasedGuard`
`/src/hooks/useLocales`
`/src/locales/*`
`src/pages/dashboard/Kanban`
`src/pages/dashboard/GeneralAnalytics`
`src/pages/dashboard/GeneralApp`
`src/pages/dashboard/GeneralBanking`
`src/pages/dashboard/GeneralBooking`
`src/utils/jwt.ts`
`src/config.ts`
### v3.3.0

###### Mar 12, 2022

- Add src/components/table/TableSkeleton.

- Update src/components/table/TableMoreMenu.

- Change src/components/table/TableSearchNotFound => src/components/table/TableNoData.

- Update src/sections/@dashboard/e-commerce/product-list/ProductTableRow.

- Update src/sections/@dashboard/user/list/UserTableRow.

- Update nextjs_TS/src/sections/@dashboard/invoice/list/InvoiceTableRow.

- Update InvoiceList page.

- Update UserList page.

- Update EcommerceProductList page.

- Update logoutin src/contexts/Auth0Context.

- Demo handle loading EcommerceProductList (https://minimals.cc/dashboard/e-commerce/list/).

- Upgrade some dependencies to the latest versions.

`src/components/table/TableSkeleton`
`src/components/table/TableMoreMenu`
`src/components/table/TableSearchNotFound`
`src/components/table/TableNoData`
`src/sections/@dashboard/e-commerce/product-list/ProductTableRow`
`src/sections/@dashboard/user/list/UserTableRow`
`nextjs_TS/src/sections/@dashboard/invoice/list/InvoiceTableRow`
`InvoiceList`
`UserList`
`EcommerceProductList`
`logout`
`src/contexts/Auth0Context`
`EcommerceProductList`
### v3.2.0

###### Mar 4, 2022

- Add components table.

- Add hooks useTable.

- Add hooks useTabs.

- Add hooks useToggle.

- Add categories menu mobile in faqs page.

- Add Management Invoice part (view).

- Update User List page (view).

- Update Product List page (view).

- Upgrade some dependencies to the latest versions.

- Update design file.

`table`
`useTable`
`useTabs`
`useToggle`
`faqs`
`User List`
`Product List`
### v3.1.0

###### Feb 24, 2022

- Support react-scripts v5.0.0 (migrate to react-script v5.0.0).

- Update .eslintrc.

- Update src/utils/jwt.

- Upgrade some dependencies to the latest versions.

- Add src/utils/mapboxgl.

In src/sections/contact/ContactMap

import 'src/utils/mapboxgl';

- Fix handdle alert error:

In src/sections/auth/register/RegisterForm
In src/sections/auth/login/LoginForm

setError('afterSubmit', error);
// to
setError('afterSubmit', {
  ...error,
  message: error.message,
});

- Update In src/layouts/dashboard/navbar/NavbarHorizontal
const RootStyle = styled('div')(({ theme }) =>({})
// to
const RootStyle = styled(AppBar)(({ theme }) =>({})

Support react-scripts v5.0.0 (migrate to react-script v5.0.0).

Update .eslintrc.

`.eslintrc`
Update src/utils/jwt.

`src/utils/jwt`
Upgrade some dependencies to the latest versions.

Add src/utils/mapboxgl.

`src/utils/mapboxgl`
- In src/sections/contact/ContactMap

`src/sections/contact/ContactMap`
```javascript
import 'src/utils/mapboxgl';
```

Fix handdle alert error:

- In src/sections/auth/register/RegisterForm

- In src/sections/auth/login/LoginForm

`src/sections/auth/register/RegisterForm`
`src/sections/auth/login/LoginForm`
```text
setError('afterSubmit', error);
// to
setError('afterSubmit', {
  ...error,
  message: error.message,
});
```

Update In src/layouts/dashboard/navbar/NavbarHorizontal

`src/layouts/dashboard/navbar/NavbarHorizontal`
```javascript
const RootStyle = styled('div')(({ theme }) =>({})
// to
const RootStyle = styled(AppBar)(({ theme }) =>({})
```

###### Next.js

- Change import { yupResolver } from '@hookform/resolvers/yup/dist/yup' to import { yupResolver } from '@hookform/resolvers/yup'.

`import { yupResolver } from '@hookform/resolvers/yup/dist/yup'`
`import { yupResolver } from '@hookform/resolvers/yup'`
### v3.0.0

###### Dec 23, 2021

- NEW Add Next.JS full version for Javascript.

- NEW Migrate all formik form to react-hook-form.

- Add src/components/hook-form as fast field support for react-hook-form (use version 2.8.0 if you like working with formik).

- Add vertical-layout with navbar-horizontal in settings (apply for dashboard layout only).

- Update src/components/nav-section.

- Update src/components/upload.

- Update src/components/MenuPopover.

- Update src/theme/overrides. (can copy and override).

- Update src/theme/shadows (add value card, dialog,dropdown).

- Update src/components/SearchNotFound.

- Update src/contexts/FirebaseContext (support for firebase v9).

- Move src/theme/globalStyles to src/theme/overrides/CssBaseline.

- Move components overview to next.js source.

- Upgrade some dependencies to the latest versions.

`formik form`
`react-hook-form`
`src/components/hook-form`
`2.8.0`
`src/components/nav-section`
`src/components/upload`
`src/components/MenuPopover`
`src/theme/overrides`
`src/theme/shadows`
`card`
`dialog`
`dropdown`
`src/components/SearchNotFound`
`src/contexts/FirebaseContext`
`src/theme/globalStyles`
`src/theme/overrides/CssBaseline`
`components overview`
### v2.8.0

###### Dec 14, 2021

- NEW - Add Next.JS full version (TypeScript only).

- Fix src/components/settings on Safari (Can be copied and overwritten).

- Improve the blog.

- Improve src/guards/AuthGuard.

- Improve src/pages/auth/VerifyCode (support copy and next focus input when type).

- Update handleLogout in src/layouts/dashboard/header/AccountPopover.

- Update src/theme/overrides/Autocomplete.

- Support external link full_version_TS/src/components/nav-section/NavItem.

- Upgrade some dependencies to the latest versions.

`src/components/settings`
`src/guards/AuthGuard`
`src/pages/auth/VerifyCode`
`handleLogout`
`src/layouts/dashboard/header/AccountPopover`
`src/theme/overrides/Autocomplete`
`full_version_TS/src/components/nav-section/NavItem`
### v2.7.0

###### Dec 7, 2021

##### Design

- Figma support full dark mode and mobile version (Learn more)

- Sketch no change

##### Code

- Add src/components/Image support lazyload and aspect ratio

- Add src/components/TextMaxLine (learn)

- Update and support nav-section 3 level item.

- Update src/components/LightboxModal.

- Update src/components/SvgIconStyle.

- Update src/components/Scrollbar.

- Upgrade src/routes.

- Upgrade src/layouts.

- Update src/guards/AuthGuard.

- Update src/components/settings

- Update src/theme (can copy and replace)

Remove src/theme/shape
borderRadiusSm => theme.shape.borderRadius * 1.5
borderRadiusMd => theme.shape.borderRadius * 2

- Remove src/components/@material-extend

Move src/components/@material-extend/MAvatar => src/components/Avatar.
Move src/components/@material-extend/MBreadcrumbs => src/components/Breadcrumbs.
Change src/components/@material-extend/MFab => src/components/animate/FabButtonAnimate.
Change src/components/@material-extend/MIconButton => src/components/animate/IconButtonAnimate.
Change src/components/@material-extend/MHidden => src/hooks/useResponsive.

- Remove src/components/LazySize

- Remove src/components/draft

- Remove src/layouts/AuthLayout

- Upgrade src/components/animate.

Wrap MotionLazyContainer in src/App
Change <motion.div> => <m.div>/ <motion.a> => <m.a>...

`src/components/Image`
`src/components/TextMaxLine`
`src/components/LightboxModal`
`src/components/SvgIconStyle`
`src/components/Scrollbar`
`src/routes`
`src/layouts`
`src/guards/AuthGuard`
`src/components/settings`
`src/theme`
- Remove src/theme/shape

- borderRadiusSm => theme.shape.borderRadius * 1.5

- borderRadiusMd => theme.shape.borderRadius * 2

`src/theme/shape`
`borderRadiusSm => theme.shape.borderRadius * 1.5`
`borderRadiusMd => theme.shape.borderRadius * 2`
`src/components/@material-extend`
- Move src/components/@material-extend/MAvatar => src/components/Avatar.

- Move src/components/@material-extend/MBreadcrumbs => src/components/Breadcrumbs.

- Change src/components/@material-extend/MFab => src/components/animate/FabButtonAnimate.

- Change src/components/@material-extend/MIconButton => src/components/animate/IconButtonAnimate.

- Change src/components/@material-extend/MHidden => src/hooks/useResponsive.

`src/components/@material-extend/MAvatar`
`src/components/Avatar`
`src/components/@material-extend/MBreadcrumbs`
`src/components/Breadcrumbs`
`src/components/@material-extend/MFab`
`src/components/animate/FabButtonAnimate`
`src/components/@material-extend/MIconButton`
`src/components/animate/IconButtonAnimate`
`src/components/@material-extend/MHidden`
`src/hooks/useResponsive`
`src/components/LazySize`
`src/components/draft`
`src/layouts/AuthLayout`
`src/components/animate`
- Wrap MotionLazyContainer in src/App

- Change <motion.div> => <m.div>/ <motion.a> => <m.a>...

`MotionLazyContainer`
`src/App`
`<motion.div>`
`<m.div>`
`<motion.a>`
`<m.a>`
```text
// before
variants = { varFadeInUp }
 
// after
variants = {
  varFade({
    distance:120,
    durationIn:1,
    durationOut:0.5,
    easeIn:'easeIn',
    easeOut:'easeInOut',
    }).inUp }
```

- Migrate @iconify/react to use via API

`@iconify/react`
```tsx
// before
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
 
<Icon icon={menu2Fill} />;
 
// after
import Iconify from 'src/components/Iconify';
 
<Iconify icon="eva:bell-fill" sx={{ width: 20, height: 20, color: 'red' }} />;
```

- Improve folder structure

- Upgrade some dependencies to the latest versions

### v2.6.0

###### Sep 18, 2021

- Support MUI v5.0.0 official release

- Upgrade dependencies react-router changelog

- Change dependencies notistack5 => notistack

- Change dependencies @material-ui/core => @mui/material

Support MUI v5.0.0 official release

Upgrade dependencies react-router changelog

`react-router`
Change dependencies notistack5 => notistack

`notistack5`
`notistack`
Change dependencies @material-ui/core => @mui/material

`@material-ui/core`
`@mui/material`
```javascript
// Example
// Learn more : https://github.com/mui-org/material-ui/blob/master/CHANGELOG.md
import {Button} from '@material/core'; => import {Button} from '@mui/material';
```

- Change dependencies @material-ui/icons => @mui/icons-material

- Change dependencies @material-ui/lab => @mui/lab

- Change dependencies @material-ui/styles => @mui/styles

- Change dependencies @material-ui/system => @mui/system

- Change dependencies @material-ui/utils => @mui/utils

- Change dependencies @material-ui/data-grid => @mui/data-grid

- Change styleProps => ownerState

- Update src/theme/globalStyles

- Update src/components/NotistackProvider

- Update src/components/LoadingScreen

- Update src/components/LightboxModal

- Update src/components/BaseOptionChart

- Update src/routes/index

- Update src/theme/overrides

- Remove GlobalStyles in src/theme/index

- Add GlobalStyles, ProgressBarStyle, BaseOptionChartStyle in src/App

- Upgrade some dependencies to the latest versions

- More changelog MUI

`@material-ui/icons`
`@mui/icons-material`
`@material-ui/lab`
`@mui/lab`
`@material-ui/styles`
`@mui/styles`
`@material-ui/system`
`@mui/system`
`@material-ui/utils`
`@mui/utils`
`@material-ui/data-grid `
`@mui/data-grid`
`styleProps`
`ownerState`
`src/theme/globalStyles`
`src/components/NotistackProvider`
`src/components/LoadingScreen`
`src/components/LightboxModal`
`src/components/BaseOptionChart`
`src/routes/index`
`src/theme/overrides`
`GlobalStyles`
`src/theme/index`
`GlobalStyles`
`ProgressBarStyle`
`BaseOptionChartStyle`
`src/App`
### v2.5.0

###### Aug 18, 2021

- Add example for Form Validation

- Update src/components/editor/draft

- Update src/components/editor/quill

- Update src/components/RtlLayout

- Update src/utils/formatTime

- Update type src/components/Markdown

- Improve version demo_next (Issuse css first render)

- Upgrade some dependencies to the latest versions

`src/components/editor/draft`
`src/components/editor/quill`
`src/components/RtlLayout`
`src/utils/formatTime`
`src/components/Markdown`
`demo_next`
### v2.4.0

###### Aug 7, 2021

- Add page dashboard banking

- Add page dashboard booking

- Update landing page

- Update src/theme/overrides/Card

- Update src/theme/overrides/Alert

- Update src/theme/overrides/DataGrid

- Update src/components/editor/draft

- Update src/theme/palette

- Update src/theme/typography

- Update src/components/carousel/controls

- Update src/components/Markdown

- Update src/@types/mega-menu

- Upgrade some dependencies to the latest versions

- Replace faker dependencies =>src/utils/mock-data

- More changelog React Material UI

`src/theme/overrides/Card`
`src/theme/overrides/Alert`
`src/theme/overrides/DataGrid`
`src/components/editor/draft`
`src/theme/palette`
`src/theme/typography`
`src/components/carousel/controls`
`src/components/Markdown`
`src/@types/mega-menu`
`faker`
`src/utils/mock-data`
### v2.3.0

###### Jul 23, 2021

- Support MUI v5.0.0-beta.1

- Support layout stretch in settings

- Support localization for MUI components https://next.material-ui.com/guides/localization/#main-content

- Support mini Menu (Dashboard sidebar) demo

- Add component DataGrid example demo

- Remove MButton, MTimelineDot, MChip, MBadge, MButtonGroup, MCircularProgress, MLinearProgress, MRadio, MSwitch, MCheckbox form src/components/@material-extend (MUI v5.0.0-beta.1 is now supported)

- Changes some illustration

- Change dependencies notistack to notistack5 (for support MUI v5.0.0-beta.1)

- Update landing page

- Upgrade some dependencies to the latest versions

`MButton`
`MTimelineDot`
`MChip`
`MBadge`
`MButtonGroup`
`MCircularProgress`
`MLinearProgress`
`MRadio`
`MSwitch`
`MCheckbox`
`src/components/@material-extend`
`notistack`
`notistack5`
### v2.2.0

###### Jun 25, 2021

- Add kanban board

- Upgrade some dependencies to the latest versions

### v2.1.0

###### May 22, 2021

- Add primary color change support

- Add guard based role support

- Add page about us

- Add page contact us

- Add page faqs

- Add component mega menu

- Add method auth auth0

- Add method auth aws cognito

- Add <MHidden>into src/components/@material-extend support v33

- Update folder simple_version

- Update folder simple_next_js

- Update some components from src/components

- Upgrade to react router v6

- Upgrade dependencies to the latest versions

- Change some layouts and graphic

- Migrate some components to the context instead of redux (auth, settings)

- Improve folder structure

- Clean code

`<MHidden>`
`src/components/@material-extend`
`src/components`
### v2.0.0

###### Apr 18, 2021

- Add Typescript support

- Add a simple_version example for next js

- Add animation examples

- Update package.json

- Upgrade to calendar v5

- Upgrade dependencies to the latest versions

- Remove google map

- Remove recharts

- Improve routers

- Improve folder structure

- Change the directory tree structure

- Clean code

### v1.2.0

###### Mar 1, 2021

- Add design Figma source file (variants and auto layout)

- Add Right-to-Left layout support

- Add JWT login support (see in doc Authentication)

- Add simple version

- Update components override

- Update .babelrc

- Update .eslintrc

- Update jsconfig.json

- Update package.json

- Upgraded depdendecy

- Change import xxx from '~/...' to import xxx from 'src/...'

- Improve folder structure

`.babelrc`
`.eslintrc`
`jsconfig.json`
`package.json`
`import xxx from '~/...'`
`to import xxx from 'src/...'`
### v1.1.0

###### Feb 3, 2021

- Depdendecy versions @material-ui from 5.0.0-alpha.23 to 5.0.0-alpha.24

- Fix the injection order of the CSS with yarn. JSS and emotion are still cohabitating until v5 reaches a stable version. We need to tell emotion to inject before JSS

- Fix layout doc src/layouts/DocsLayout breakpoints

- Fix double scroll bar on mobile src/components/Scrollbars.js

- Improvement Carousel implementation

`@material-ui`
`src/layouts/DocsLayout`
`src/components/Scrollbars.js`
### v1.0.0

###### Jan 26, 2021

Initial release.

*Fonte: [https://docs.minimals.cc/changelog/](https://docs.minimals.cc/changelog/)*

---

# Clean project

Improve your codebase by removing unused code to optimize performance and reduce project size.

Each project has different needs, so some components or pages might no longer be necessary.

This guide walks you through a simple and safe process to clean up your project.

##### 🔍 Step 1: remove unused pages

Delete unused pages in /pages or /app.

`/pages`
`/app`
Example: src/pages/contact-us.tsx

`src/pages/contact-us.tsx`
##### 🛠️ Step 2: Create knip.jsonc file

`knip.jsonc`
Set up knip configuration to scan your project.

`knip`
```text
{
"$schema": "https://unpkg.com/knip@5/schema-jsonc.json",
"paths": {
"src/*": ["./src/*"],
},
"project": ["src/**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}"],
"ignoreExportsUsedInFile": true,
"ignoreDependencies": [
// ignore dependencies
"@fontsource.+",
],
"ignore": [
// ignore folders or files
"src/_mock/**",
],
}
```

##### 🧼 Step 3: Identify and delete unused files

Use knip to detect and remove unused files, dependencies, and more.

`knip`
```text
npx knip
```

```text
Unused dependencies (10)
@emotion/styled               package.json
@fullcalendar/core            package.json
@tiptap/core                  package.json
@tiptap/extension-code-block  package.json
@tiptap/pm                    package.json
apexcharts                    package.json
embla-carousel                package.json
mapbox-gl                     package.json
react-dom                     package.json
stylis                        package.json
 
Unused devDependencies (1)
eslint  package.json
 
Unlisted binaries (3)
eslint    package.json
next      package.json
prettier  package.json
 
Configuration hints (3)
```

> This is a helper tool — use judgment when removing files!

This is a helper tool — use judgment when removing files!

##### 🔗 Reference:

- Knip getting started guide

*Fonte: [https://docs.minimals.cc/clean-project/](https://docs.minimals.cc/clean-project/)*

---

# Colors

##### Customize theme colors

To customize global theme colors, update the following files:

- src/theme/theme-config.ts

- src/theme/core/palette.ts

`src/theme/theme-config.ts`
`src/theme/core/palette.ts`
```css
{
  "primary": {
    "lighter": "#C8FAD6",
    "light": "#5BE49B",
    "main": "#00A76F",
    "dark": "#007867",
    "darker": "#004B50",
    "contrastText": "#FFFFFF"
  },
  // ...other colors
}
```

##### Color tools & references

Eva design colors (recommended)

Another great tool for generating harmonious palettes:

🔗 colors.eva.design

👉 Recommended token mapping:

- 100 → lighter

- 300 → light

- 500 → main

- 700 → dark

- 900 → darker

`100`
`300`
`500`
`700`
`900`
Material UI colors

Use the official Material UI color tool:

🔗 mui.com/customization/color

##### 🔗 Reference:

- https://minimals.cc/components/foundation/colors

*Fonte: [https://docs.minimals.cc/colors/](https://docs.minimals.cc/colors/)*

---

# Credit assets

All assets used in this project — such as icons and images — are either created in-house or sourced from platforms that provide content under the MIT license or equivalent permissive licenses.

If you'd like to explicitly credit the sources, here are the platforms we recommend referencing:

##### 🖼️ Image sources

- Pexels

- Unsplash

- Freepik

- ChatGPT

##### 🔣 Icon sources

- Iconify Design

- Flaticon

- Freepik

> All listed resources are free to use, with most offering content under open or royalty-free licenses. Be sure to check the individual license terms if you're using them in commercial projects.

All listed resources are free to use, with most offering content under open or royalty-free licenses. Be sure to check the individual license terms if you're using them in commercial projects.

*Fonte: [https://docs.minimals.cc/credit-assets/](https://docs.minimals.cc/credit-assets/)*

---

# CSS variables

This guide explains how to use CSS theme variables in Material UI v6+ with the Minimal design system.

✅ Applies from v6.0.0 and above.

##### 🎨 Color

🔗 Reference:

- MUI – Using theme variables

```text
// Old
color: theme.palette.common.white,
 
// ✅ New
color: theme.vars.palette.common.white,
```

##### 💧 Alpha transparency

Replace alpha() with varAlpha() for full support with CSS variables.

`alpha()`
`varAlpha()`
```javascript
// Old
import { alpha } from '@mui/material/styles';
alpha(theme.palette.text.primary, 0.2)
 
// ✅ New
import { varAlpha } from 'minimal-shared/utils';
varAlpha(theme.vars.palette.text.primaryChannel, 0.2)
```

##### 🌙 Dark mode support

Use theme.applyStyles('dark', { ... }) to apply overrides for dark mode.

`theme.applyStyles('dark', { ... })`
🔗 Related docs:

- MUI – Styling with theme variables

- MUI – Migration guide: dark mode

```tsx
import { alpha } from '@mui/material/styles';
 
<Box
  sx={{
    color: theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
    boxShadow: `-80px 80px 80px ${
      // Old
      theme.palette.mode === 'light'
        ? alpha(theme.palette.grey[500], 0.48)
        : alpha(theme.palette.common.black, 0.24)
    }`,
  }}
>
  Box
</Box>
```

```tsx
import { varAlpha } from 'minimal-shared/utils';
 
<Box
  sx={{
    color: 'primary.main',
    boxShadow: `-80px 80px 80px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.48)}`,
    // ✅ Dark mode support
    ...theme.applyStyles('dark', {
      color: 'primary.light',
      boxShadow: `-80px 80px 80px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
    }),
  }}
>
  Box
</Box>
```

*Fonte: [https://docs.minimals.cc/css-vars/](https://docs.minimals.cc/css-vars/)*

---

# Dependencies

Manage your project dependencies effectively.

Below is a categorized list to help you decide what to keep, remove, or install.

```markdown
# Core framework and react
- next
- react
- react-dom
 
# UI Framework and styling
- @mui/material
- @mui/material-nextjs
- @mui/lab
- @mui/x-data-grid
- @mui/x-date-pickers
- @mui/x-tree-view
- @emotion/react
- @emotion/styled
- @emotion/cache
 
# RTL & styling utilities
- stylis
- stylis-plugin-rtl
 
# Custom scrollbars
- simplebar-react
 
# One-time password input (OTP)
- mui-one-time-password-input
 
# Fonts
- @fontsource-variable/dm-sans
- @fontsource-variable/inter
- @fontsource-variable/nunito-sans
- @fontsource-variable/public-sans
- @fontsource/barlow
 
# Drag-and-drop
- @dnd-kit/core
- @dnd-kit/sortable
- @dnd-kit/utilities
 
# Forms and validation
- react-hook-form
- @hookform/resolvers
- zod
 
# Internationalization (i18n)
- i18next
- i18next-browser-languagedetector
- i18next-resources-to-backend
- react-i18next
 
# Charts and data visualization
- apexcharts
- react-apexcharts
 
# Rich text editor
- @tiptap/core
- @tiptap/react
- @tiptap/starter-kit
- @tiptap/extension-code-block
- @tiptap/extension-code-block-lowlight
- @tiptap/extension-image
- @tiptap/extension-link
- @tiptap/extension-placeholder
- @tiptap/extension-text-align
- @tiptap/extension-underline
- @tiptap/pm
- lowlight
 
# Authentication
- @auth0/auth0-react
- aws-amplify
- firebase
- @supabase/supabase-js
 
# Maps
- mapbox-gl
- react-map-gl
 
# Carousel
- embla-carousel
- embla-carousel-auto-height
- embla-carousel-auto-scroll
- embla-carousel-autoplay
- embla-carousel-fade
- embla-carousel-react
 
# Markdown
- react-markdown
- rehype-highlight
- rehype-raw
- remark-gfm
- turndown
 
# Notifications
- sonner
 
# Utilities
- axios
- dayjs
- nprogress
- swr
- autosuggest-highlight
- react-dropzone
- react-phone-number-input
- react-organizational-chart
- minimal-shared
- yet-another-react-lightbox
 
# Animations
- framer-motion
```

#### Eslint

```text
@eslint/js
eslint
eslint-import-resolver-alias
eslint-plugin-import
eslint-plugin-perfectionist
eslint-plugin-react
eslint-plugin-react-hooks
eslint-plugin-unused-imports
globals
```

*Fonte: [https://docs.minimals.cc/dependencies/](https://docs.minimals.cc/dependencies/)*

---

# Deployment

Each deployment platform has its own setup process and configuration steps.

Please ensure that your environment is properly configured according to your service provider's documentation.

##### 📦 Demo servers

We have tested this template across various platforms to ensure compatibility before release.

###### Vercel

- Vite.js

- Next.js

###### Netlify

- Next.js

###### Azure

- Next.js

###### Firebase

- Next.js

###### Cloudflare

- Vite.js

##### 🔐 Environment variables

To ensure your app works correctly in production, don’t forget to add the required environment variables from your .env file.

`.env`
> Environment variables must be set manually on your deployment platform unless otherwise automated.

Environment variables must be set manually on your deployment platform unless otherwise automated.

✅ Example: setting up on Vercel

*Fonte: [https://docs.minimals.cc/deployment/](https://docs.minimals.cc/deployment/)*

---

# Environment variables

Learn how to use environment variables in different frameworks.

##### Next.js

- Use the prefix: NEXT_PUBLIC_

- Next.js – environment variables

`NEXT_PUBLIC_`
```text
NEXT_PUBLIC_MAP=
NEXT_PUBLIC_WEBSITE_URL=
```

```text
process.env.NEXT_PUBLIC_MAP;
process.env.NEXT_PUBLIC_WEBSITE_URL;
```

##### Vite.js

- Use the prefix: VITE_

- Vite.js – environment variables

`VITE_`
```text
VITE_MAP=
VITE_WEBSITE_URL=
```

```text
import.meta.env.VITE_MAP;
import.meta.env.VITE_WEBSITE_URL;
```

##### Create React App

- Use the prefix: REACT_APP_.

- CRA – environment variables

`REACT_APP_`
```text
REACT_APP_MAP=
REACT_APP_WEBSITE_URL=
```

```text
process.env.REACT_APP_MAP;
process.env.REACT_APP_WEBSITE_URL;
```

*Fonte: [https://docs.minimals.cc/environment-variables/](https://docs.minimals.cc/environment-variables/)*

---

# Figma guide

Quick instructions for working with Figma design resources.

##### 📺 Video tutorials

- 🔧 Install Figma https://youtu.be/mjMpdvMMPDs

- 🎨 Customize colors & typography https://youtu.be/NvfAODqWkFQ

- 🌗 Change light/dark mode https://youtu.be/e8uaVwfBAL0

- 🎯 Change primary color https://youtu.be/ksGpHGUUklA

##### 📝 Notes

- The design resources are provided in .zip format. To use Dev mode, you’ll need to upgrade your Figma account.

- 👉 Learn more about Figma plans

`.zip`

*Fonte: [https://docs.minimals.cc/figma/](https://docs.minimals.cc/figma/)*

---

# Global configuration

##### Setup

Generic configuration for several APIs.

```javascript
export const CONFIG: ConfigValue = {
  appName: 'Minimal UI', // Application name
  appVersion: packageJson.version, // Application version from package.json
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL ?? '', // Server URL from environment variables
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? '', // Assets directory from environment variables
  isStaticExport: JSON.parse(`${process.env.BUILD_STATIC_EXPORT}`), // Static export option (next.config.mjs)
  /**
   * Auth
   * @method jwt | amplify | firebase | supabase | auth0
   */
  auth: {
    method: 'jwt', // Authentication method
    skip: false, // Skip authentication
    redirectPath: paths.dashboard.root, // Redirect path after authentication
  },
  /**
   * Mapbox
   */
  mapboxApiKey: process.env.NEXT_PUBLIC_MAPBOX_API_KEY ?? '', // Mapbox API key from environment variables
  /**
   * Firebase
   */
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '', // Firebase API key from environment variables
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '', // Firebase Auth Domain from environment variables
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '', // Firebase Project ID from environment variables
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '', // Firebase Storage Bucket from environment variables
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '', // Firebase Messaging Sender ID from environment variables
    appId: process.env.NEXT_PUBLIC_FIREBASE_APPID ?? '', // Firebase App ID from environment variables
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? '', // Firebase Measurement ID from environment variables
  },
  /**
   * Amplify
   */
  amplify: {
    userPoolId: process.env.NEXT_PUBLIC_AWS_AMPLIFY_USER_POOL_ID ?? '', // AWS Amplify User Pool ID from environment variables
    userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID ?? '', // AWS Amplify User Pool Web Client ID from environment variables
    region: process.env.NEXT_PUBLIC_AWS_AMPLIFY_REGION ?? '', // AWS Amplify Region from environment variables
  },
  /**
   * Auth0
   */
  auth0: {
    clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? '', // Auth0 Client ID from environment variables
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? '', // Auth0 Domain from environment variables
    callbackUrl: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL ?? '', // Auth0 Callback URL from environment variables
  },
  /**
   * Supabase
   */
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', // Supabase URL from environment variables
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '', // Supabase Key from environment variables
  },
};
```

##### With static export option in next.js

```javascript
const isStaticExport = 'true';
```

*Fonte: [https://docs.minimals.cc/global-config/](https://docs.minimals.cc/global-config/)*

---

# Global styles

For case you are using the starter version and want to add some components from the full version, you need to add the corresponding styles to src/global.css.

`src/global.css`
##### Setup

When installing components like chart or lightbox...

`chart`
`lightbox`
Don't forget to add the corresponding styles to src/global.css.

`src/global.css`
Or you can define additional html tags.

```javascript
/* scrollbar */
/* https://minimals.cc/components/extra/scroll*/
/* src/components/scrollbar */
@import './components/scrollbar/styles.css';
 
/* map */
/* https://minimals.cc/components/extra/map*/
/* src/components/map */
@import './components/map/styles.css';
 
/* lightbox */
/* https://minimals.cc/components/extra/lightbox*/
/* src/components/lightbox */
@import './components/lightbox/styles.css';
 
/* chart */
/* https://minimals.cc/components/extra/chart*/
/* src/components/chart */
@import './components/chart/styles.css';
 
a {
  color: red;
  text-decoration: none;
}
...
```

*Fonte: [https://docs.minimals.cc/global-styles/](https://docs.minimals.cc/global-styles/)*

---

# Icons

This guide explains how to use and manage icons with Iconify in your project.

✅ Applies from v7.0.0 and above.

##### Why change the default Iconify setup?

By default, icons from Iconify are loaded directly from their CDN/API:
🔗 Iconify documentation

While convenient, this approach has some drawbacks:

- ❌ No offline support

- ❌ Flickering and layout shift during load

To improve performance and stability, we’ve changed how icons are used in the project.

Follow the steps below to register, customize, and clean up icons effectively.

##### 🔧 1. Register and use available icons from Iconify

You can browse and choose icons directly from Iconify icon sets.

To control and configure icons used in your project, visit: 🔗 Minimal iconify icon.

🎬 Watch the guide: Watch

##### 🎨 2. Register and use custom icons

Need your own icon set? You can also register custom icons easily.

🎬 Watch the guide: Watch

##### 🧹 3. Find and remove unused icons

To keep your code clean and optimized, use the following tool to detect and remove unused icons:

🎬 Watch the guide: Watch

```text
npx find-unused-iconify
```

```text
npx find-unused-iconify -d
```

*Fonte: [https://docs.minimals.cc/icons/](https://docs.minimals.cc/icons/)*

---

# Minimal - Client & Admin Dashboard

A professional React Kit that comes with plenty of ready-to-use Material-UI components that will
help you to build more beautiful frontend pages.

- Built with MUI with two versions Next.js | Vite.

- Includes a complete design component Figma file to extend your project development.

- The theme is ready to change to any style you want.

Learn more: package

#### Documents

In addition to the documentation provided from Minimal you can refer to other relevant documents
regarding the components used in this template.

###### 🔸MUI

Because** Minimal UI** is built on top of MUI components. You can read the documentation and
use all of the MUI components here: https://mui.com/components/.

###### 🔸3rd party libraries

We include direct links to third-party used libraries:

Example:

- Carousel: https://minimals.cc/components/extra/carousel/.

- Reference: https://www.embla-carousel.com/.

#### Feedback

We are always open to your feedback at [email protected]

If something is missing in the documentation, or if you found some part confusing, contact us with
your suggestions for improvement.

We love hearing from you!

> This project is just the user interface not including the backend and database.

This project is just the user interface not including the backend and database.

*Fonte: [https://docs.minimals.cc/introduction/](https://docs.minimals.cc/introduction/)*

---

# Layout

##### Core layout

Update layout size settings in:

src/layouts/core/css-vars.ts

`src/layouts/core/css-vars.ts`
```javascript
export function layoutSectionVars(theme: Theme) {
  return {
    '--layout-nav-zIndex': theme.zIndex.drawer + 1,
    '--layout-nav-mobile-width': '288px',
    '--layout-header-blur': '8px',
    '--layout-header-zIndex': theme.zIndex.appBar + 1,
    '--layout-header-mobile-height': '64px',
    '--layout-header-desktop-height': '72px',
  };
}
```

##### Dashboard layout

Update layout size settings in:

src/layouts/dashboard/css-vars.ts

`src/layouts/dashboard/css-vars.ts`
```javascript
export function dashboardLayoutVars(theme: Theme) {
  return {
    '--layout-transition-easing': 'linear',
    '--layout-transition-duration': '120ms',
    '--layout-nav-mini-width': '88px',
    '--layout-nav-vertical-width': '300px',
    '--layout-nav-horizontal-height': '64px',
    '--layout-dashboard-content-pt': theme.spacing(1),
    '--layout-dashboard-content-pb': theme.spacing(8),
    '--layout-dashboard-content-px': theme.spacing(5),
  };
}
```

##### Change navigation items

To adjust navigation items, update the relevant nav-config.(ts|js) files:

`nav-config.(ts|js)`
- <MainLayout /> → src/layouts/config-nav-main

- <DashboardLayout /> → src/layouts/config-nav-dashboard

`<MainLayout />`
`src/layouts/config-nav-main`
`<DashboardLayout />`
`src/layouts/config-nav-dashboard`
##### 🔗 Reference:

- https://minimals.cc/components/extra/layout/

*Fonte: [https://docs.minimals.cc/layout/](https://docs.minimals.cc/layout/)*

---

# Logo

To customize your branding:

- Change the logo in src/components/logo.

- Update the favicon at public/favicon.ico.

`src/components/logo`
`public/favicon.ico`
##### 🧩 Change favicon

- Use favicon.io to generate a favicon from your logo.

- Download and unzip the generated assets.

- Copy and overwrite the file in public/favicon.ico.

`public/favicon.ico`
```tsx
// src/app/layout.(tsx | jsx)
 
export const metadata: Metadata = {
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
  ],
};
```

##### 🖼️ Change logo (image file)

Use a static image from the public directory.

`public`
```tsx
const logo = (
  <Box
    alt="logo"
    component="img"
    src="/logo/logo-single.svg"
    width={width}
    height={height}
  />
);
```

##### 🧬 Change logo (svg component)

Inline SVG with gradients and theming support.

```tsx
const logo = (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512">
    <defs>
      <linearGradient id={`${gradientId}-1`} x1="100%" x2="50%" y1="9.946%" y2="50%">
        <stop offset="0%" stopColor={PRIMARY_DARK} />
        <stop offset="100%" stopColor={PRIMARY_MAIN} />
      </linearGradient>
 
      <linearGradient id={`${gradientId}-2`} x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" stopColor={PRIMARY_LIGHT} />
        <stop offset="100%" stopColor={PRIMARY_MAIN} />
      </linearGradient>
 
      <linearGradient id={`${gradientId}-3`} x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" stopColor={PRIMARY_LIGHT} />
        <stop offset="100%" stopColor={PRIMARY_MAIN} />
      </linearGradient>
    </defs>
 
    <g fill={PRIMARY_MAIN} fillRule="evenodd" stroke="none" strokeWidth="1">
      <path
        fill={`url(#${`${gradientId}-1`})`}
        d="M183.168 285.573l-2.918 5.298-2.973 5.363-2.846 5.095-2.274 4.043-2.186 3.857-2.506 4.383-1.6 2.774-2.294 3.939-1.099 1.869-1.416 2.388-1.025 1.713-1.317 2.18-.95 1.558-1.514 2.447-.866 1.38-.833 1.312-.802 1.246-.77 1.18-.739 1.111-.935 1.38-.664.956-.425.6-.41.572-.59.8-.376.497-.537.69-.171.214c-10.76 13.37-22.496 23.493-36.93 29.334-30.346 14.262-68.07 14.929-97.202-2.704l72.347-124.682 2.8-1.72c49.257-29.326 73.08 1.117 94.02 40.927z"
      />
      <path
        fill={`url(#${`${gradientId}-2`})`}
        d="M444.31 229.726c-46.27-80.956-94.1-157.228-149.043-45.344-7.516 14.384-12.995 42.337-25.267 42.337v-.142c-12.272 0-17.75-27.953-25.265-42.337C189.79 72.356 141.96 148.628 95.69 229.584c-3.483 6.106-6.828 11.932-9.69 16.996 106.038-67.127 97.11 135.667 184 137.278V384c86.891-1.611 77.962-204.405 184-137.28-2.86-5.062-6.206-10.888-9.69-16.994"
      />
      <path
        fill={`url(#${`${gradientId}-3`})`}
        d="M450 384c26.509 0 48-21.491 48-48s-21.491-48-48-48-48 21.491-48 48 21.491 48 48 48"
      />
    </g>
  </svg>
);
```

##### 📦 Usage

Import and use the logo component.

```tsx
import Logo from 'src/components/logo';
 
<Logo sx={{ width: 64, height: 64 }} />
```

*Fonte: [https://docs.minimals.cc/logo/](https://docs.minimals.cc/logo/)*

---

# Migrate to CRA

This guide helps you migrate a Vite.js project to Create React App (CRA).

- Migrating to vite.js or next.js is (recommended)

- If you want to use CRA version please check here migrate to CRA

- Learn more: https://github.com/reactjs/react.dev/pull/5487

##### Step 1: Prepare your project

- Do not delete or modify any files before running the migration command.

- Run the command inside the root directory of the project.

```text
Minimal_Typescript
  ├─ vite-ts
  ├─ starter-vite-ts
```

```text
cd vite-ts
# OR
cd starter-vite-ts
```

##### Step 2: Run migration command

- Run the appropriate version of the vite-to-cra CLI tool based on your current Minimal UI version.

- In the vite-ts or starter-vite-ts folder.

`vite-ts`
`starter-vite-ts`
Minimal UI v6.2.0 | v6.3.0| v7.0.0

`v6.2.0`
`v6.3.0`
`v7.0.0`
```text
npx vite-to-cra@latest
```

Minimal UI v6.0.0 | v6.0.1 | v6.1.0

`v6.0.0`
`v6.0.1`
`v6.1.0`
```text
npx [email protected]
```

Minimal UI v5

`v5`
```text
npx [email protected]
```

*Fonte: [https://docs.minimals.cc/migrate-to-cra/](https://docs.minimals.cc/migrate-to-cra/)*

---

# Mock server

We provide some simple examples on how to set up a mock API so you can work in your localhost.

`localhost`
##### 💻 Usage in localhost Watch

Step 1: Download resource

Download resource inside the README.md or MOCK_API.md.

`README.md`
`MOCK_API.md`
```text
next-ts
  ├── README.md
  ├── ...
```

```text
Minimal_Typescript
  ├── MOCK_API.md
  ├── ...
```

Step 2: Start local server

- Start project minimal-api-dev folder.

- Make sure you are running on the correct port http://localhost:7272.

`minimal-api-dev`
`http://localhost:7272`
```text
DEV_API: "http://localhost:7272",
```

```text
"dev": "next dev -p 7272",
"start": "next start -p 7272",
```

```text
yarn install
yarn dev
```

Step 3:
Update .env in your current project:

`.env`
- next.js

- vite.js

- starter-next-ts

- starter-vite-ts

- ...

`next.js`
`vite.js`
`starter-next-ts`
`starter-vite-ts`
```text
VITE_SERVER_URL=http://localhost:7272
VITE_ASSET_URL=http://localhost:7272
```

##### ☁️ Usage on production

Support for Vercel and Cloudflare servers.

Step 1:

- Push source code minimal-api-dev to your github.

- Deploy on your vercel.com.

`minimal-api-dev`
Step 2:

In next.config.mjs of minimal-api-dev.

`next.config.mjs`
`minimal-api-dev`
```javascript
const nextConfig = {
reactStrictMode: true,
  env: {
    DEV_API: 'http://localhost:7272',
    PRODUCTION_API: 'https://your-domain-api.vercel.app',
  },
};
 
export default nextConfig;
```

Step 3:
Update .env in your current project:

`.env`
- next.js

- vite.js

- starter-next-ts

- starter-vite-ts

- ...

`next.js`
`vite.js`
`starter-next-ts`
`starter-vite-ts`
```text
VITE_SERVER_URL=https://your-domain-api.vercel.app
VITE_ASSET_URL=https://your-domain-api.vercel.app
```

*Fonte: [https://docs.minimals.cc/mock-server/](https://docs.minimals.cc/mock-server/)*

---

# Global overrides MUI components

Customize and override MUI components globally by modifying files in the directory: src/theme/core/components

`src/theme/core/components`
##### 🎨 styleOverrides

- Customize the styles of MUI components globally using styleOverrides.

- 📘 Official docs – Style overrides

`styleOverrides`
##### ⚙️ defaultProps

- Set default props for MUI components globally using defaultProps.

- 📘 Official docs – Default props

`defaultProps`
```text
src
  ├── theme/core/components
    ├── accordion.jsx
    ├── alert.jsx
    ├── appbar.jsx
    ├── ...
...
```

```tsx
// src/theme/core/components/appbar.tsx
 
const MuiAppBar: Components<Theme>['MuiAppBar'] = {
  defaultProps: { color: 'transparent' },
  styleOverrides: {
    root: {
      boxShadow: 'none',
    },
  },
};
```

##### 🧩 Example

###### Before Overrides (MUI default theme)

Before Overrides (MUI default theme)

###### After Overrides (Minimal theme)

After Overrides (Minimal theme)

##### 🔗 Reference:

- MUI components

- Theme customization

- Global style overrides

> The change will apply globally for MUI component.

The change will apply globally for MUI component.

> This helps you to deeply customize your style, to suit your design.

This helps you to deeply customize your style, to suit your design.

*Fonte: [https://docs.minimals.cc/mui-overrides/](https://docs.minimals.cc/mui-overrides/)*

---

# Multi language

Enable and manage multilingual support for your project.

##### Setup / remove

Search for the keyword src/locales to find and configure relevant components and files.

`src/locales`
##### Add new content

Add translations in language-specific JSON files inside src/locales.

`src/locales`
```json
{
"heading": "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
"nested": {
"nested1": "nested En"
}
}
```

```json
{
"heading": "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression",
"nested": {
"nested1": "nested Fr"
}
}
```

##### Usage example

Example usage of custom localization hooks.

```tsx
import { useLocales, useTranslate } from 'src/locales';
 
function MultiLanguage() {
const { t, onChangeLang } = useTranslate();
const { allLang, currentLang } = useLocales();
 
return (
<>
  <RadioGroup
    row
    value={currentLang.value}
    onChange={(event) => onChangeLang(event.target.value)}
  >
    {allLang.map((lang) => (
      <FormControlLabel
        key={lang.label}
        value={lang.value}
        label={lang.label}
        control={<Radio />}
      />
    ))}
  </RadioGroup>
 
  <Typography variant="h2">{t('heading')}</Typography>
  <Typography variant="body2">{t('nested.nested1')}</Typography>
</>
);
}
```

##### Enable RTL when selecting Arabic language (Minimal UI >= v7.1.0)

This guide ensures the following behavior:

- Selecting the AR language will automatically apply RTL (Right-to-Left) layout.

- Selecting RTL layout will automatically apply the AR language.

```javascript
export const themeConfig = {
  ...
  direction: 'rtl'
};
```

```javascript
export const fallbackLng: LangCode = 'ar';
```

```javascript
  import { useLocaleDirectionSync } from 'src/locales';
 
  export function ThemeProvider({ themeOverrides, children, ...other }: ThemeProviderProps) {
    ...
 
    useLocaleDirectionSync();
 
    return (
      ...
    );
  }
```

```tsx
import { useTranslate } from 'src/locales';
 
const { onResetLang, onChangeLang } = useTranslate();
 
const handleReset = useCallback(() => {
  settings.onReset();
  onResetLang();
  setMode(defaultSettings.colorScheme as ThemeColorScheme);
}, [defaultSettings.colorScheme, onResetLang, setMode, settings]);
 
const renderRtl = () => (
<BaseOption
  label="Right to left"
  selected={settings.state.direction === 'rtl'}
  icon={<SvgIcon>{settingIcons.alignRight}</SvgIcon>}
  onChangeOption={() => {
    settings.setState({ direction: settings.state.direction === 'ltr' ? 'rtl' : 'ltr' });
    onChangeLang(settings.state.direction === 'ltr' ? 'ar' : 'en');
  }}
/>
);
```

##### 🔗 Reference

- Multi language guide

- react-i18next

- MUI localization guide

*Fonte: [https://docs.minimals.cc/multi-language/](https://docs.minimals.cc/multi-language/)*

---

# Navigation

Instructions to change the default menu to multiple menus.

Results:

*Fonte: [https://docs.minimals.cc/navigation/](https://docs.minimals.cc/navigation/)*

---

# Package & license

A summary of available resources and how licenses apply.

##### 📄 License overview

- Licenses do not apply to open source redistribution.

- One licenses / one end product (3 licenses / 3 products...).

- Standard / Plus license → for free products (e.g. internal use, management tools).

- Extended license → for commercial products that charge users (e.g. SaaS apps).

##### 🟢 Standard license

Use for free products

```text
Minimal_Javascript
├─ next-js
├─ vite-js
├─ starter-next-js
├─ starter-vite-js
```

- Migrating to vite.js or next.js is (recommended)

- If you want to use CRA version please check here migrate to CRA

- Learn more: https://github.com/reactjs/react.dev/pull/5487

##### 🔵 Plus license

Also used for free products

```text
Minimal_Javascript
├─ next-js
├─ vite-js
├─ starter-next-js
├─ starter-vite-js
 
Minimal_Typescript
├─ next-ts
├─ vite-ts
├─ starter-next-ts
├─ starter-vite-ts
 
Minimal_Design
├─ Figma file
```

##### 🟣 Extended license

Required for commercial products

```text
Minimal_Javascript
├─ next-js
├─ vite-js
├─ starter-next-js
├─ starter-vite-js
 
Minimal_Typescript
├─ next-ts
├─ vite-ts
├─ starter-next-ts
├─ starter-vite-ts
 
Minimal_Design
├─ Figma file
```

##### 📝 Notes

- next-ts, vite-ts: full version → see: https://minimals.cc

- starter-next-ts, starter-vite-ts: starter version → see: https://starter.minimals.cc

- Starter versions are slimmed down from full versions. You can freely add components from full to starter as needed.

`next-ts`
`vite-ts`
`starter-next-ts`
`starter-vite-ts`
> ✅ Free Product? → Use Standard or Plus license

✅ Free Product? → Use Standard or Plus license

> 💰 Commercial Product? → You must use an Extended license

💰 Commercial Product? → You must use an Extended license

> 💡 Each license is for one end product. For example, 3 licenses = 3 products.

💡 Each license is for one end product. For example, 3 licenses = 3 products.

👉 Learn more: mui.com/store/license

*Fonte: [https://docs.minimals.cc/package/](https://docs.minimals.cc/package/)*

---

# Quick start

A simple and clear guide to get your project up and running quickly.

##### 1. Requirements

- Node.js >=20.

- Yarn (recommended).

- Do not delete lock files (package-lock.json / yarn.lock).

- When copying folders, make sure to also include hidden files like .env → These often contain critical environment variables.

`package-lock.json`
`yarn.lock`
`.env`
##### 2. Installation

🟢 Start the project Watch

- Using pnpm instead of npm/yarn → migration guide

- Creating a new folder and copying files → copy guide

🟡 Start the server Watch

By default, a demo API is provided from our server. For more reliable development, you should run it locally: start local server

##### CRA deprecation notice

- Migrating to vite.js or next.js is (recommended)

- If you want to use CRA version please check here migrate to CRA

- Learn more: https://github.com/reactjs/react.dev/pull/5487

##### Tracking discussions

- react.dev#5487

- create-react-app#13080

- create-react-app#13283

> This project includes only the UI — it does not include backend or database integration.

This project includes only the UI — it does not include backend or database integration.

*Fonte: [https://docs.minimals.cc/quick-start/](https://docs.minimals.cc/quick-start/)*

---

# Routing

This article focuses on routing for Vite.js, Create React App (CRA) and Next.js, excluding specific Next.js configuration details.

Refer to the Next.js routing docs for more.

##### Overview

For Vite.js and CRA routing is based on react-router.
This guide explains how to:

`react-router`
- Add a new navigation item

- Define new routes

- Configure the index (default) page

##### Add a new item navigation

- Applies to Vite.js, CRA and Next.js.

- Add a new item in the dashboard layout navigation.

```tsx
// src/layouts/nav-config-dashboard.tsx
 
export const navData = [
  {
    subheader: 'Overview',
    items: [
      {
        title: 'One',
        path: paths.dashboard.root,
        icon: ICONS.dashboard,
        info: <Label>v{CONFIG.appVersion}</Label>,
      },
      { title: 'Two', path: paths.dashboard.two, icon: ICONS.ecommerce },
      { title: 'Three', path: paths.dashboard.three, icon: ICONS.analytics },
      { title: 'New page', path: '/dashboard/new-page', icon: ICONS.analytics },
    ],
  },
  {
    subheader: 'Management',
    items: [
      {
        title: 'Group',
        path: paths.dashboard.group.root,
        icon: ICONS.user,
        children: [
          { title: 'Four', path: paths.dashboard.group.root },
          { title: 'Five', path: paths.dashboard.group.five },
          { title: 'Six', path: paths.dashboard.group.six },
        ],
      },
    ],
  },
];
 
```

##### Add a new route (Vite.js | CRA)

How to register a new route in the Vite.js | CRA version.

```tsx
// src/routes/sections/dashboard.tsx
 
const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const PageTwo = lazy(() => import('src/pages/dashboard/two'));
const PageThree = lazy(() => import('src/pages/dashboard/three'));
const PageFour = lazy(() => import('src/pages/dashboard/four'));
const PageFive = lazy(() => import('src/pages/dashboard/five'));
const PageSix = lazy(() => import('src/pages/dashboard/six'));
const NewPage = lazy(() => import('src/pages/dashboard/new-page'));
 
const dashboardLayout = () => (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);
 
export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? dashboardLayout() : <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      { path: 'two', element: <PageTwo /> },
      { path: 'three', element: <PageThree /> },
      { path: 'new page', element: <NewPage /> },
      {
        path: 'group',
        children: [
          { element: <PageFour />, index: true },
          { path: 'five', element: <PageFive /> },
          { path: 'six', element: <PageSix /> },
        ],
      },
    ],
  },
];
```

##### Add a new route (Next.js)

- Create a new file at src/app/dashboard/new-page/page.tsx.

- Docs Next.js App Router routing

`src/app/dashboard/new-page/page.tsx`
##### Set the index page

Set default page when visit website.

```tsx
export const routesSection = [
    {
      // Redirect to default path (skip homepage)
      path: '/',
      element: <Navigate to={CONFIG.auth.redirectPath} replace />,
    },
    {
      // Show homepage as index
      path: '/',
      element: (
        <MainLayout>
          <Outlet />
        </MainLayout>
      ),
      children: [{ element: <HomePage />, index: true }],
    },
];
```

##### Navigation usage example

Linking to routes using a custom component

```tsx
import Link from '@mui/material/Link';
import { RouterLink } from 'src/routes/components';
 
<Link component={RouterLink} href="/new" underline="none" variant="subtitle2">
  Go to About us
</Link>;
```

##### Role-Based navigation

- Navigation with roles

- Permission-based demo

```tsx
const navData = [
  {
    subheader: 'Marketing',
    items: [
      {
        title: 'Landing',
        path: '/landing',
        icon: <Iconify icon="carbon:bat" width={1} />,
        roles: ['admin'],
        caption: 'Display only admin role',
      },
      {
        title: 'Services',
        path: '/services',
        icon: <Iconify icon="carbon:cyclist" width={1} />,
        roles: ['admin', 'user'],
      },
    ],
  },
];
```

*Fonte: [https://docs.minimals.cc/routing/](https://docs.minimals.cc/routing/)*

---

# Settings

This section explains how to configure and apply theme settings in your project.

##### Change default settings

When modifying default settings, be sure to clear localStorage or cookies to avoid conflicts.

`localStorage`
`cookies`
```tsx
// src/App.(jsx | tsx) or src/app/layout.(jsx | tsx)
 
import { defaultSettings } from 'src/components/settings';
 
<SettingsProvider defaultSettings={defaultSettings}>
  ...
</SettingsProvider>
```

```tsx
// src/App.(jsx | tsx) or src/app/layout.(jsx | tsx)
 
import { defaultSettings } from 'src/components/settings';
import { detectSettings } from 'src/components/settings/server';
 
export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieSettings = await detectSettings();
 
  return (
    <html lang="en" dir={cookieSettings.direction} suppressHydrationWarning>
      <body>
        <SettingsProvider cookieSettings={cookieSettings} defaultSettings={defaultSettings}>
          ...
        </SettingsProvider>
      </body>
    </html>
  );
}
```

##### Base theme (no localization or settings)

Use a simple base theme when no localization or settings are needed.

```javascript
// src/theme/create-theme.(js | ts)
 
export const baseTheme = {
  colorSchemes: {
    light: {
      palette: palette.light,
      shadows: shadows.light,
      customShadows: customShadows.light
    },
    dark: {
      palette: palette.dark,
      shadows: shadows.dark,
      customShadows: customShadows.dark
    },
  },
  mixins,
  components,
  typography,
  shape: { borderRadius: 8 },
  direction: themeConfig.direction,
  cssVariables: themeConfig.cssVariables,
}
 
export function createTheme({ themeOverrides }) {
  const theme = createMuiTheme(baseTheme, themeOverrides);
 
  return theme;
}
```

##### With localization

Add localization support by injecting MUI locale components.

- https://mui.com/material-ui/guides/localization/.

```javascript
// src/theme/create-theme.(js | ts)
 
export const baseTheme = {
  colorSchemes: {
    light: {
      palette: palette.light,
      shadows: shadows.light,
      customShadows: customShadows.light
    },
    dark: {
      palette: palette.dark,
      shadows: shadows.dark,
      customShadows: customShadows.dark
    },
  },
  mixins,
  components,
  typography,
  shape: { borderRadius: 8 },
  direction: themeConfig.direction,
  cssVariables: themeConfig.cssVariables,
}
 
export function createTheme({ themeOverrides, localeComponents }) {
  const theme = createMuiTheme(baseTheme, localeComponents, themeOverrides);
 
  return theme;
}
```

##### With settings

Apply user-defined settings to customize theme behavior.

```javascript
// src/theme/create-theme.(js | ts)
 
export const baseTheme = {
  colorSchemes: {
    light: {
      palette: palette.light,
      shadows: shadows.light,
      customShadows: customShadows.light
    },
    dark: {
      palette: palette.dark,
      shadows: shadows.dark,
      customShadows: customShadows.dark
    },
  },
  mixins,
  components,
  typography,
  shape: { borderRadius: 8 },
  direction: themeConfig.direction,
  cssVariables: themeConfig.cssVariables,
}
 
export function createTheme({ settingsState, themeOverrides }) {
  const updatedCore = settingsState ? applySettingsToTheme(baseTheme, settingsState) : baseTheme;
 
  const updatedComponents = settingsState
    ? applySettingsToComponents(baseTheme.components, settingsState)
    : {};
 
  const theme = createMuiTheme(updatedCore, updatedComponents, themeOverrides);
 
  return theme;
}
```

##### Change mode

To change the default mode, update the themeConfig in your theme configuration file. This will set the initial mode for your application.

`themeConfig`
```javascript
// src/theme/theme-config.(js | ts)
 
export const themeConfig = {
  ...
  defaultMode: 'light', // light | dark | system
};
```

##### 🔗 Reference:

- src/App.js or src/app/layout.js

- src/components/settings

`src/App.js`
`src/app/layout.js`
`src/components/settings`

*Fonte: [https://docs.minimals.cc/settings/](https://docs.minimals.cc/settings/)*

---

# Shadows

- Custom shadows inside src/theme/core/shadows

- Custom customShadows inside src/theme/core/customShadows

`shadows`
`src/theme/core/shadows`
`customShadows`
`src/theme/core/customShadows`
##### 🔗 Reference:

- https://minimals.cc/components/foundation/shadows

*Fonte: [https://docs.minimals.cc/shadows/](https://docs.minimals.cc/shadows/)*

---

# Project structure

```text
├── .editorconfig
├── .env
├── .prettierignore
├── .vscode/
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── prettier.config.mjs
├── tsconfig.json
├── public/
│   ├── assets/
│   ├── fonts/
│   └── logo/
└── src/
    ├── _mock/
    ├── actions/
    ├── app/
    ├── assets/
    ├── auth/
    ├── components/
    ├── global-config.ts
    ├── global.css
    ├── layouts/
    ├── lib/
    ├── locales/
    ├── routes/
    ├── sections/
    ├── theme/
    ├── types/
    └── utils/
```

##### Configuration files

- .editorconfig: Defines coding style rules (e.g., indentation, charset).

- .env: Contains environment variables for the project.

- .prettierignore: Lists files and directories to ignore when running Prettier.

- eslint.config.mjs: ESLint configuration for linting the codebase.

- next.config.ts: Configuration file for Next.js.

- prettier.config.mjs: Prettier configuration for code formatting.

- tsconfig.json: TypeScript configuration file.

- .vscode/: Visual Studio Code-specific settings.

`.editorconfig`
`.env`
`.prettierignore`
`eslint.config.mjs`
`next.config.ts`
`prettier.config.mjs`
`tsconfig.json`
`.vscode/`
##### Main directories

- public/: Contains static assets like images, fonts, and logos.

- src/: Main source code directory.

_mock/: Mock data for testing purposes.
actions/: Contains actions or related logic.
app/: Main application structure.
assets/: Resources like images and icons.
auth/: Handles user authentication.
components/: Reusable UI components.
global-config.ts: Global configuration for the application.
layouts/: Shared layouts for the application.
lib/: Additional libraries or utilities.
locales/: Supports internationalization (i18n).
routes/: Defines application routes.
sections/: Large sections of the application UI.
theme/: Theme configuration for styling.
types/: TypeScript type definitions.
utils/: Utility functions.

`public/`
`src/`
- _mock/: Mock data for testing purposes.

- actions/: Contains actions or related logic.

- app/: Main application structure.

- assets/: Resources like images and icons.

- auth/: Handles user authentication.

- components/: Reusable UI components.

- global-config.ts: Global configuration for the application.

- layouts/: Shared layouts for the application.

- lib/: Additional libraries or utilities.

- locales/: Supports internationalization (i18n).

- routes/: Defines application routes.

- sections/: Large sections of the application UI.

- theme/: Theme configuration for styling.

- types/: TypeScript type definitions.

- utils/: Utility functions.

`_mock/`
`actions/`
`app/`
`assets/`
`auth/`
`components/`
`global-config.ts`
`layouts/`
`lib/`
`locales/`
`routes/`
`sections/`
`theme/`
`types/`
`utils/`

*Fonte: [https://docs.minimals.cc/structure/](https://docs.minimals.cc/structure/)*

---

# Subfolder

✅ Applies from v6.1.0 and above.

##### Vite.js

```text
VITE_ASSETS_DIR=/sub
```

```javascript
export default defineConfig({
  base: '/sub/',
  ...
});
```

```tsx
<BrowserRouter basename="sub">
  ...
</BrowserRouter>
 
// or
 
const router = createBrowserRouter(
  [
    {
      Component: () => (
        <App>
          <Outlet />
        </App>
      ),
      errorElement: <ErrorBoundary />,
      children: routesSection,
    },
  ],
  {
    basename: '/sub',
  }
);
```

##### Next.js

```text
NEXT_PUBLIC_ASSETS_DIR=/sub
```

```javascript
const nextConfig = {
  basePath: '/sub',
  ...
};
```

*Fonte: [https://docs.minimals.cc/subfolder/](https://docs.minimals.cc/subfolder/)*

---

# Faqs & support

Our support mainly covers pre-sales questions, basic template questions, and bug reports through our support email: [email protected]

Customers are always welcome to ask for feature requests and give suggestions that can improve our premium themes. All feature requests will be considered, and the new features released with upcoming releases.

##### How can I get the update?

You can get the update in your purchase dashboard.

a.If you are already logged in:

`already`
- Select tab : Downloads

b. If you haven't logged in yet

`haven't`
- Login here: https://mui.com/store/sign-in/

- In your menu dropdown account select : Download history

##### What's in the product packages?

- Which license should I choose to buy to suit my needs?

- Learn more: package

##### How can I upgrade my product plan?

When you intend to upgrade the product package, please contact us, we will provide you with a discount code.

After having a discount code, you can follow the steps below to apply:

- Select the package product to upgrade.

- Enter discount code.(contact us to get the code)

- Payment.

- Done.

##### How long is my license valid for?

After successfully purchasing the product, you get 6 months of technical support and free updates for 1 year

Once the license has expired you will no longer be able to receive new updates from us. And you need to renew or purchase a new license to receive updates.

##### How can I get help?

To be eligible to request technical support you must have purchased the template and have at least one regular or extended license.

When you send a support request please describe your issue in detail. If you can provide a link to your developing site then this can help us to solve your issue more quickly.

All 3rd party plugins used in the theme are provided as bonus and we do not give any guarantee to their functionality. Our support does not cover any 3rd party plugin customization or bug fixes that are not in our control.

> Please attach invoice/email or customer name when submitting support request.

Please attach invoice/email or customer name when submitting support request.

##### 📝 Notes

- We only provide the UI interface and will not support logic outside of the product.

- You can request a feature. We will look into it if it makes sense we will release it in the next version.

- We also provide a fee-based service, customized to the customer's wishes.

*Fonte: [https://docs.minimals.cc/support/](https://docs.minimals.cc/support/)*

---

# Integration Tailwind

##### 1. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
```

##### 2. Create configuration files

Create the following files in the root directory of your project:

- tailwind.config.js

- postcss.config.js or (postcss.config.cjs for Vite.js)

`tailwind.config.js`
`postcss.config.js`
`postcss.config.cjs`
```tsx
const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  corePlugins: {
    // Remove the Tailwind CSS preflight styles so it can use Material UI's preflight instead (CssBaseline).
    preflight: false,
  },
  plugins: [],
};
 
export default config;
```

```text
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

##### 3. Update global styles

Modify src/global.css to include Tailwind's layers.

`src/global.css`
```javascript
...
/* scrollbar */
@import 'simplebar-react/dist/simplebar.min.css';
 
@tailwind base;
@tailwind components;
@tailwind utilities;
 
html {
  ...
}
```

##### 🔗 Reference:

- Tailwind CSS + Vite Guide

- Material UI + CRA + Tailwind Example

*Fonte: [https://docs.minimals.cc/tailwind/](https://docs.minimals.cc/tailwind/)*

---

# Typography

Typography is defined globally and managed in:

- src/theme/theme-config.ts

- src/theme/core/typography.ts

`src/theme/theme-config.ts`
`src/theme/core/typography.ts`
##### Install a custom font

Step 1: Install font

```bash
npm install @fontsource-variable/inter
```

Step 2: Update global files

- src/global.css

- src/theme/theme-config.ts

`src/global.css`
`src/theme/theme-config.ts`
```javascript
@import '@fontsource-variable/inter';
```

```text
fontFamily: {
primary: 'Inter Variable',
// other font configurations
},
```

##### 🔗 References:

- Fontsource

- MUI Typography

*Fonte: [https://docs.minimals.cc/typography/](https://docs.minimals.cc/typography/)*

---

# Update guide

This section explains how to apply updates to your project effectively.

##### Key areas to update

When upgrading to a new version, the core areas you should focus on include:

- src/theme

- src/layouts

- src/components

- src/utils

- src/hooks

`src/theme`
`src/layouts`
`src/components`
`src/utils`
`src/hooks`
We recommend updating only the parts you are actively working with. You can copy and overwrite components from the latest version as needed.

> 💡 Use Git to track changes and review differences before applying them.

💡 Use Git to track changes and review differences before applying them.

You can always check and reference the latest components here:
🔗 minimals.cc/components

##### Tips for a smooth update

- Only copy and overwrite the components you are customizing.

- Install or upgrade the exact versions of dependencies we provide. (npm i @mui/[email protected] not npm i @mui/material@latest)

- Avoid blindly replacing the entire folders unless necessary.

- Ensure you check for breaking changes in dependencies.

`npm i @mui/[email protected]`
`npm i @mui/material@latest`
##### Changelog & references

Since the product is based on React and MUI, be sure to review changelogs:

- Changelog (This product)

- MUI official changelog

##### Final note

- This project relies on many third-party dependencies and custom components.

- To ensure stability, manually review and test any component you're updating.

> Since this is a product that uses many dependencies and has many components, you will also need to manually check the components you are working on to update it.

Since this is a product that uses many dependencies and has many components, you will also need to manually check the components you are working on to update it.

> Keeping changes isolated and well-tracked ensures a smoother upgrade process.

Keeping changes isolated and well-tracked ensures a smoother upgrade process.

*Fonte: [https://docs.minimals.cc/update/](https://docs.minimals.cc/update/)*

---

# Colors

Custom global color inside src/theme/palette.

`src/theme/palette`
###### Material color tool

https://mui.com/customization/color/.

###### Eva color tool

https://colors.eva.design/.

We recommend picking colors with these values for Eva tool:

- Lighter : 100

- Light : 300

- Main : 500

- Dark : 700

- Darker : 900

`100`
`300`
`500`
`700`
`900`
```javascript
const PRIMARY = {
  lighter: '#C8FACD',
  light: '#5BE584',
  main: '#00AB55',
  dark: '#007B55',
  darker: '#005249'
};
const SECONDARY = {...};
const INFO = { ... };
const SUCCESS = {...};
const WARNING = {...};
const ERROR = {...};
...
```

###### Reference:

- https://minimals.cc/components/foundation/colors

*Fonte: [https://docs.minimals.cc/v5/colors/](https://docs.minimals.cc/v5/colors/)*

---

# Layout

##### Change Size

```javascript
export const HEADER = {
  H_MOBILE: 64,
  H_DESKTOP: 80,
  H_DESKTOP_OFFSET: 80 - 16,
}
 
export const NAV = {
  W_VERTICAL: 280,
  W_MINI: 88,
};
```

##### Change Menu, Navigation

Find config-navigation files to adjust items.

`config-navigation`
Example:

- <MainLayout/> : src/layouts/main/config-navigation

- <DashboardLayout> : src/layouts/dashboard/config-navigation

`<MainLayout/>`
`<DashboardLayout>`
##### Variants

###### Main

###### Dashboard

###### Compact

###### Simple

###### Auth modern

###### Auth compact

*Fonte: [https://docs.minimals.cc/v5/layout/](https://docs.minimals.cc/v5/layout/)*

---

# Logo

##### Use from public folder

```tsx
const logo = (
  <Box
    component="img"
    src="/logo.svg" // => Your path in public folder
    sx={{
      width: 40,
      height: 40,
      cursor: 'pointer',
      ...sx,
    }}
  />
);
```

##### Use internally with svg

```tsx
const logo = (
  <Box
    ref={ref}
    component="div"
    sx={{
      width: 40,
      height: 40,
      display: 'inline-flex',
      ...sx,
    }}
    {...other}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512">
      <defs>
        <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
          <stop offset="0%" stopColor={PRIMARY_DARK} />
          <stop offset="100%" stopColor={PRIMARY_MAIN} />
        </linearGradient>
 
        <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" stopColor={PRIMARY_LIGHT} />
          <stop offset="100%" stopColor={PRIMARY_MAIN} />
        </linearGradient>
 
        <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" stopColor={PRIMARY_LIGHT} />
          <stop offset="100%" stopColor={PRIMARY_MAIN} />
        </linearGradient>
      </defs>
 
      <g fill={PRIMARY_MAIN} fillRule="evenodd" stroke="none" strokeWidth="1">
        <path fill="url(#BG1)" d="M183.168 285.573l-2.918 5.298-2.973 5.363-2.846 5.095-2.274 4.043-2.186 3.857-2.506 4.383-1.6 2.774-2.294 3.939-1.099 1.869-1.416 2.388-1.025 1.713-1.317 2.18-.95 1.558-1.514 2.447-.866 1.38-.833 1.312-.802 1.246-.77 1.18-.739 1.111-.935 1.38-.664.956-.425.6-.41.572-.59.8-.376.497-.537.69-.171.214c-10.76 13.37-22.496 23.493-36.93 29.334-30.346 14.262-68.07 14.929-97.202-2.704l72.347-124.682 2.8-1.72c49.257-29.326 73.08 1.117 94.02 40.927z" />
        <path fill="url(#BG2)" d="M444.31 229.726c-46.27-80.956-94.1-157.228-149.043-45.344-7.516 14.384-12.995 42.337-25.267 42.337v-.142c-12.272 0-17.75-27.953-25.265-42.337C189.79 72.356 141.96 148.628 95.69 229.584c-3.483 6.106-6.828 11.932-9.69 16.996 106.038-67.127 97.11 135.667 184 137.278V384c86.891-1.611 77.962-204.405 184-137.28-2.86-5.062-6.206-10.888-9.69-16.994" />
        <path fill="url(#BG3)" d="M450 384c26.509 0 48-21.491 48-48s-21.491-48-48-48-48 21.491-48 48 21.491 48 48 48" />
      </g>
    </svg>
  </Box>
);
```

##### Change Size

```tsx
import Logo from 'src/components/logo';
 
<Logo sx={{ width: 64, height: 64 }} />
```

##### Change Favicon

Step 1: Upload logo in https://favicon.io/favicon-converter/.

Step 2: Download the resource and unzip.

Step 3: Copy and overwrite to folder public/favicon.

`public/favicon`

*Fonte: [https://docs.minimals.cc/v5/logo/](https://docs.minimals.cc/v5/logo/)*

---

# Settings

This section will describe how you settings your theme.

##### Change Default Settings

Remove local storage when you change settings.

`local storage`
```css
<SettingsProvider
  defaultSettings={{
    themeMode: 'light', // 'light' | 'dark'
    themeDirection: 'ltr', //  'rtl' | 'ltr'
    themeContrast: 'default', // 'default' | 'bold'
    themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
    themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
    themeStretch: false,
  }}
/>
```

##### Base Theme

```tsx
export default function ThemeProvider({ children }: Props) {
  const memoizedValue = useMemo(
    () => ({
      palette: palette('light'), // or palette('dark')
      shadows: shadows('light'), // or shadows('dark')
      customShadows: customShadows('light'), // or customShadows('dark')
      shape: { borderRadius: 8 },
      typography,
    }),
    []
  );
 
  const theme = createTheme(memoizedValue as ThemeOptions);
 
  theme.components = componentsOverrides(theme);
 
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
```

##### Dark Mode Option

```tsx
export default function ThemeProvider({ children }: Props) {
  const settings = useSettingsContext();
 
  const memoizedValue = useMemo(
    () => ({
      palette: palette(settings.themeMode),
      shadows: shadows(settings.themeMode),
      customShadows: customShadows(settings.themeMode),
      shape: { borderRadius: 8 },
      typography,
    }),
    [settings.themeMode]
  );
 
  const theme = createTheme(memoizedValue as ThemeOptions);
 
  theme.components = componentsOverrides(theme);
 
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
```

##### Right-To-Left Option

```tsx
export default function ThemeProvider({ children }: Props) {
  const settings = useSettingsContext();
 
  const memoizedValue = useMemo(
    () => ({
      palette: palette('light'),
      shadows: shadows('light'),
      customShadows: customShadows('light'),
      direction: settings.themeDirection,
      shape: { borderRadius: 8 },
      typography,
    }),
    [settings.themeDirection]
  );
 
  const theme = createTheme(memoizedValue as ThemeOptions);
 
  theme.components = componentsOverrides(theme);
 
  return (
    <MuiThemeProvider theme={theme}>
      <RTL themeDirection={settings.themeDirection}>
        <CssBaseline />
        {children}
      </RTL>
    </MuiThemeProvider>
  );
}
```

##### Presets Option

```tsx
export default function ThemeProvider({ children }: Props) {
  const settings = useSettingsContext();
 
  const presets = createPresets(settings.themeColorPresets);
 
  const memoizedValue = useMemo(
    () => ({
      palette: {
        ...palette('light'),
        ...presets.palette,
      },
      customShadows: {
        ...customShadows('light'),
        ...presets.customShadows,
      },
      shadows: shadows('light'),
      shape: { borderRadius: 8 },
      typography,
    }),
    [presets.customShadows, presets.palette]
  );
 
  const theme = createTheme(memoizedValue as ThemeOptions);
 
  theme.components = componentsOverrides(theme);
 
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
```

##### Contrast Option

```tsx
export default function ThemeProvider({ children }: Props) {
  const settings = useSettingsContext();
 
  const contrast = createContrast(settings.themeContrast, settings.themeMode);
 
  const memoizedValue = useMemo(
    () => ({
      palette: {
        ...palette('light'),
        ...contrast.palette,
      },
      customShadows: {
        ...customShadows('light'),
      },
      shadows: shadows('light'),
      shape: { borderRadius: 8 },
      typography,
    }),
    [contrast.palette]
  );
 
  const theme = createTheme(memoizedValue as ThemeOptions);
 
  theme.components = merge(componentsOverrides(theme), contrast.components);
 
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
```

##### Localization

Combined with settings here: multi-language

https://mui.com/material-ui/guides/localization/

```tsx
export default function ThemeProvider({ children }: Props) {
  const { currentLang } = useLocales();
 
  const memoizedValue = useMemo(
    () => ({
      palette: palette('light'),
      shadows: shadows('light'),
      customShadows: customShadows('light'),
      shape: { borderRadius: 8 },
      typography,
    }),
    []
  );
 
  const theme = createTheme(memoizedValue as ThemeOptions);
 
  theme.components = componentsOverrides(theme);
 
  const themeWithLocale = useMemo(
    () => createTheme(theme, currentLang.systemValue),
    [currentLang.systemValue, theme]
  );
 
  return (
    <MuiThemeProvider theme={themeWithLocale}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
```

##### Full

```tsx
export default function ThemeProvider({ children }: Props) {
  const { currentLang } = useLocales();
 
  const settings = useSettingsContext();
 
  const presets = createPresets(settings.themeColorPresets);
 
  const contrast = createContrast(settings.themeContrast, settings.themeMode);
 
  const memoizedValue = useMemo(
    () => ({
      palette: {
        ...palette(settings.themeMode),
        ...presets.palette,
        ...contrast.palette,
      },
      customShadows: {
        ...customShadows(settings.themeMode),
        ...presets.customShadows,
      },
      direction: settings.themeDirection,
      shadows: shadows(settings.themeMode),
      shape: { borderRadius: 8 },
      typography,
    }),
    [
      settings.themeMode,
      settings.themeDirection,
      presets.palette,
      presets.customShadows,
      contrast.palette,
    ]
  );
 
  const theme = createTheme(memoizedValue as ThemeOptions);
 
  theme.components = merge(componentsOverrides(theme), contrast.components);
 
  const themeWithLocale = useMemo(
    () => createTheme(theme, currentLang.systemValue),
    [currentLang.systemValue, theme]
  );
 
  return (
    <MuiThemeProvider theme={themeWithLocale}>
      <RTL themeDirection={settings.themeDirection}>
        <CssBaseline />
        {children}
      </RTL>
    </MuiThemeProvider>
  );
}
```

###### Related files:

- src/App.js or src/app/layout.js

- src/components/settings

`src/App.js`
`src/app/layout.js`
`src/components/settings`

*Fonte: [https://docs.minimals.cc/v5/settings/](https://docs.minimals.cc/v5/settings/)*

---

# Shadows

- Custom shadows inside src/theme/shadows

- Custom customShadows inside src/theme/customShadows

`src/theme/shadows`
`src/theme/customShadows`
###### Reference:

- https://minimals.cc/components/foundation/shadows

*Fonte: [https://docs.minimals.cc/v5/shadows/](https://docs.minimals.cc/v5/shadows/)*

---

# Typography

Custom global typography inside src/theme/typography.

`src/theme/typography`
##### Create react app, Vite.js

Google fonts

```html
<!doctype html>
<html lang="en">
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700;800&display=swap"
      rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@900&display=swap" rel="stylesheet" />
  </head>
</html>
```

```javascript
const primaryFont = 'Public Sans, sans-serif';
const secondaryFont = 'Barlow, sans-serif';
 
const typography = {
  fontFamily: primaryFont,
  h1: {
    fontFamily: primaryFont,
  },
  h2: {
    fontFamily: secondaryFont,
},
};
```

Local fonts

```html
<!doctype html>
<html lang="en">
  <head>
    <link rel="stylesheet" type="text/css" href="%PUBLIC_URL%/fonts/index.css" />
  </head>
</html>
```

```text
public/fonts
  ├── index.css
  ├── CircularStd-Medium.otf
  ├── CircularStd-Bold.otf
  ├── Barlow-Medium.ttf
  ├── ...
```

```text
@font-face {
  font-family: 'CircularStd';
  font-weight: 500;
  font-style: normal;
  src:
    local('CircularStd'),
    url('CircularStd-Medium.otf') format('opentype');
}
@font-face {
  font-family: 'CircularStd';
  font-weight: 700;
  font-style: normal;
  src:
    local('CircularStd'),
    url('CircularStd-Bold.otf') format('opentype');
}
@font-face {
  font-family: 'Barlow';
  font-weight: 500;
  font-style: normal;
  src:
    local('Barlow'),
    url('Barlow-Medium.ttf') format('truetype');
}
```

Usage

```javascript
import { secondaryFont } from 'src/theme/typography';
 
const StyledTextH1 = styled('h1')(({ theme }) => ({
  fontSize: 16,
  fontFamily: theme.typography.fontFamily,
}));
 
const StyledTextH2 = styled('h1')({
  fontSize: 16,
  fontFamily: secondaryFont,
});
```

##### Next.js

Google fonts

https://nextjs.org/docs/app/building-your-application/optimizing/fonts#google-fonts

```javascript
import { Public_Sans, Barlow } from 'next/font/google';
 
export const primaryFont = Public_Sans({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});
 
export const secondaryFont = Barlow({
  weight: ['900'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});
```

Local fonts

https://nextjs.org/docs/app/building-your-application/optimizing/fonts#local-fonts

```text
public/fonts
  ├── CircularStd-Bold.otf
  ├── CircularStd-Book.otf
  ├── CircularStd-Medium.otf
```

```javascript
import localFont from 'next/font/local';
import { Barlow } from 'next/font/google';
 
export const primaryFont = localFont({
  src: [
    {
      path: '../../public/fonts/CircularStd-Book.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/CircularStd-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/CircularStd-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
});
 
export const secondaryFont = Barlow({
  weight: ['900'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});
```

Usage

```tsx
import { primaryFont } from 'src/theme/typography';
 
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
```

```javascript
import { primaryFont, secondaryFont } from 'src/theme/typography';
 
const StyledTextH1 = styled('h1')({
  fontSize: 16,
  fontFamily: primaryFont.style.fontFamily,
});
 
const StyledTextH2 = styled('h2')({
  fontSize: 16,
  fontFamily: secondaryFont.style.fontFamily,
});
```

###### Reference:

- https://minimals.cc/components/foundation/typography

*Fonte: [https://docs.minimals.cc/v5/typography/](https://docs.minimals.cc/v5/typography/)*

---

# Colors

Custom global color inside src/theme/core/colors.json.

`src/theme/core/colors.json`
###### Material color tool

https://mui.com/customization/color/.

###### Eva color tool

https://colors.eva.design/.

We recommend picking colors with these values for Eva tool:

- Lighter : 100

- Light : 300

- Main : 500

- Dark : 700

- Darker : 900

`100`
`300`
`500`
`700`
`900`
```text
{
  "primary": {
    "lighter": "#C8FAD6",
    "light": "#5BE49B",
    "main": "#00A76F",
    "dark": "#007867",
    "darker": "#004B50",
    "contrastText": "#FFFFFF"
  },
...
}
```

###### Reference:

- https://minimals.cc/components/foundation/colors

*Fonte: [https://docs.minimals.cc/v6/colors/](https://docs.minimals.cc/v6/colors/)*

---

# Settings

This section will describe how you settings your theme.

##### Change default settings

Remove local storage or cookies when you change settings.

`local storage`
`cookies`
```css
<SettingsProvider
  defaultSettings={{
    colorScheme: 'light',
    direction: 'ltr',
    contrast: 'default',
    navLayout: 'vertical',
    primaryColor: 'default',
    navColor: 'integrate',
    compactLayout: true,
    fontFamily: defaultFont,
  }}
/>
```

##### Base theme

Without settings and locales.

```javascript
export function createTheme() {
  const initialTheme = {
    colorSchemes,
    shadows: shadows('light'),
    customShadows: customShadows('light'),
    shape: { borderRadius: 8 },
    components,
    typography,
    cssVarPrefix: '',
    shouldSkipGeneratingVar,
  };
 
  const theme = extendTheme(initialTheme, overridesTheme);
 
  return theme;
}
```

##### With localization

```javascript
export function createTheme(
  localeComponents,
) {
  const initialTheme = {
    colorSchemes,
    shadows: shadows('light'),
    customShadows: customShadows('light'),
    shape: { borderRadius: 8 },
    components,
    typography,
    cssVarPrefix: '',
    shouldSkipGeneratingVar,
  };
 
  const theme = extendTheme(
    initialTheme,
    localeComponents,
  );
 
  return theme;
}
```

##### With settings

```javascript
export function createTheme(
  settings
) {
  const initialTheme = {
    colorSchemes,
    shadows: shadows(settings.colorScheme),
    customShadows: customShadows(settings.colorScheme),
    direction: settings.direction,
    shape: { borderRadius: 8 },
    components,
    typography,
    cssVarPrefix: '',
    shouldSkipGeneratingVar,
  };
 
  const updateTheme = updateCoreWithSettings(initialTheme, settings);
 
  const theme = extendTheme(
    updateTheme,
    updateComponentsWithSettings(settings),
  );
 
  return theme;
}
```

###### Related files:

- src/App.js or src/app/layout.js

- src/components/settings

`src/App.js`
`src/app/layout.js`
`src/components/settings`

*Fonte: [https://docs.minimals.cc/v6/settings/](https://docs.minimals.cc/v6/settings/)*

---

# Typography

Custom global typography inside src/theme/core/typography.

`src/theme/core/typography`
Install

```bash
npm install @fontsource-variable/inter
```

src/global.css

```javascript
@import '@fontsource-variable/inter';
```

src/theme/core/typography.js

```javascript
const primaryFont = setFont('Inter Variable');
```

###### Reference:

- https://fontsource.org/fonts/inter

- https://minimals.cc/components/foundation/typography

*Fonte: [https://docs.minimals.cc/v6/typography/](https://docs.minimals.cc/v6/typography/)*

---

# Settings

This section will describe how you settings your theme.

##### Change default settings

Remove local storage or cookies when you change settings.

`local storage`
`cookies`
```css
<SettingsProvider
  defaultSettings={{
    colorScheme: 'light',
    direction: 'ltr',
    contrast: 'default',
    navLayout: 'vertical',
    primaryColor: 'default',
    navColor: 'integrate',
    compactLayout: true,
    fontFamily: defaultFont,
  }}
/>
```

##### Base theme

Without settings and locales.

```javascript
export function createTheme() {
  const initialTheme = {
    colorSchemes,
    shadows: shadows('light'),
    customShadows: customShadows('light'),
    shape: { borderRadius: 8 },
    components,
    typography,
    cssVarPrefix: '',
    shouldSkipGeneratingVar,
  };
 
  const theme = extendTheme(initialTheme, overridesTheme);
 
  return theme;
}
```

##### With localization

```javascript
export function createTheme(
  localeComponents,
) {
  const initialTheme = {
    colorSchemes,
    shadows: shadows('light'),
    customShadows: customShadows('light'),
    shape: { borderRadius: 8 },
    components,
    typography,
    cssVarPrefix: '',
    shouldSkipGeneratingVar,
  };
 
  const theme = extendTheme(
    initialTheme,
    localeComponents,
  );
 
  return theme;
}
```

##### With settings

```javascript
export function createTheme(
  settings
) {
  const initialTheme = {
    colorSchemes,
    shadows: shadows(settings.colorScheme),
    customShadows: customShadows(settings.colorScheme),
    direction: settings.direction,
    shape: { borderRadius: 8 },
    components,
    typography,
    cssVarPrefix: '',
    shouldSkipGeneratingVar,
  };
 
  const updateTheme = updateCoreWithSettings(initialTheme, settings);
 
  const theme = extendTheme(
    updateTheme,
    updateComponentsWithSettings(settings),
  );
 
  return theme;
}
```

###### Related files:

- src/App.js or src/app/layout.js

- src/components/settings

`src/App.js`
`src/app/layout.js`
`src/components/settings`

*Fonte: [https://docs.minimals.cc/v7/settings/](https://docs.minimals.cc/v7/settings/)*

---

