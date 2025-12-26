# Kaven UI Component Library

## Overview

Complete design system implementation based on Minimals.cc with mobile-first approach, full TypeScript support, and light/dark theme capabilities.

## Foundation Components

### Design System

- **Theme Config** (`lib/theme/theme-config.ts`): Complete design token system
- **Theme Provider** (`providers/theme-provider.tsx`): Light/dark mode with persistence
- **Shadow System** (`lib/theme/shadow-system.ts`): 25 elevation levels

### Layout

- **Container**: Responsive container with max-width breakpoints
- **Grid**: 12-column responsive grid system
- **GridItem**: Grid item with span control
- **Stack**: Flexible stack layout with direction and spacing
- **Box**: Generic utility container

### Typography

- **Typography**: Complete typography system (h1-h6, body1-2, caption, overline, subtitle1-2, button)
- Responsive font scaling
- Color variants
- Font weight control

### Icons

- **Icon**: Lucide React wrapper with size and color variants

## UI Components (MUI-based)

### Form Components

#### Button

**Variants**: contained, outlined, text, soft
**Colors**: primary, secondary, success, warning, error, info
**Sizes**: xs, sm, md, lg, xl
**Features**:

- Loading state with spinner
- Start/end icon support
- Full width option
- Disabled state

```tsx
import { Button } from '@/components/ui/button';

<Button variant="contained" color="primary" size="md">
  Click me
</Button>

<Button variant="outlined" color="success" loading>
  Loading...
</Button>

<Button variant="soft" color="warning" startIcon={<Icon icon={AlertCircle} />}>
  Warning
</Button>
```

#### TextField

**Variants**: outlined, filled, standard
**Sizes**: sm, md, lg
**Features**:

- Label and helper text
- Error states
- Start/end adornments
- Multiline support
- Full width option

```tsx
import { TextField } from '@/components/ui/text-field';

<TextField
  label="Email"
  variant="outlined"
  size="md"
  helperText="Enter your email address"
  fullWidth
/>

<TextField
  label="Password"
  type="password"
  error
  errorMessage="Password is required"
/>

<TextField
  multiline
  rows={4}
  label="Description"
/>
```

### Advanced Form Components

#### AvatarUpload

**Features**:

- Drag & drop support
- Click to upload
- Image cropping with zoom
- Preview in real-time
- Format validation (jpg, jpeg, png, gif)
- Size validation (max 5MB)
- Remove button

```tsx
import { AvatarUpload } from '@/components/avatar-upload';

<AvatarUpload
  value={avatarPreview}
  onChange={(file, preview) => {
    setAvatarFile(file);
    setAvatarPreview(preview);
  }}
/>;
```

#### AddressAutocomplete

**Features**:

- Google Places API integration
- Global autocomplete (any country)
- Auto-fill city, state, country, zipcode
- Fallback to normal Input if API key missing
- Loading state

```tsx
import { AddressAutocomplete } from '@/components/address-autocomplete';

<AddressAutocomplete
  value={watch('address') || ''}
  onChange={(value) => setValue('address', value)}
  onPlaceSelected={(place) => {
    setValue('city', place.city);
    setValue('state', place.state);
    setValue('country', place.country);
    setValue('zipcode', place.zipcode);
  }}
  placeholder="Enter address"
/>;
```

**Configuration**: Requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`

#### PhoneInput

**Features**:

- Country selector with flags
- Automatic DDI based on country
- Default: Brazil (+55)
- Country search in dropdown
- International validation (google-libphonenumber)
- Error message only after interaction
- Design system compliant

```tsx
import { PhoneInput } from '@/components/phone-input';

<PhoneInput
  value={watch('phone') || ''}
  onChange={(value) => setValue('phone', value)}
  placeholder="Enter phone number"
  error={errors.phone?.message}
  onValidationChange={(isValid) => {
    // Optional validation callback
  }}
/>;
```

**Dropdown Features**:

- Search by country name, ISO code, or DDI
- 2-line layout: Country name + ISO + DDI
- Large flags (36px height)
- Scrollable with max-height 300px

### Feedback Components

#### Alert

**Variants**: filled, outlined, standard
**Severity**: success, info, warning, error
**Features**:

- Custom title
- Custom icon
- Closable option
- Action buttons

```tsx
import { Alert } from '@/components/ui/alert';

<Alert severity="success" variant="filled">
  Operation completed successfully!
</Alert>

<Alert
  severity="error"
  variant="outlined"
  title="Error"
  closable
  onClose={() => console.log('closed')}
>
  Something went wrong
</Alert>
```

#### Chip

**Variants**: filled, outlined, soft
**Colors**: default, primary, secondary, success, warning, error, info
**Sizes**: sm, md, lg
**Features**:

- Avatar support
- Icon support
- Deletable
- Clickable

```tsx
import { Chip } from '@/components/ui/chip';

<Chip label="Default" />

<Chip
  label="Success"
  variant="soft"
  color="success"
  onDelete={() => console.log('deleted')}
/>

<Chip
  label="Clickable"
  onClick={() => console.log('clicked')}
  icon={<Icon icon={Star} />}
/>
```

#### Progress

**Linear Progress**:

- Variants: determinate, indeterminate, buffer
- All color options

**Circular Progress**:

- Variants: determinate, indeterminate
- Custom size and thickness

```tsx
import { LinearProgress, CircularProgress } from '@/components/ui/progress';

<LinearProgress value={75} color="primary" />
<LinearProgress variant="indeterminate" color="secondary" />

<CircularProgress size={40} />
<CircularProgress value={60} variant="determinate" color="success" />
```

## Theme System

### Using Theme Provider

```tsx
import { ThemeProvider } from '@/providers/theme-provider';

function App() {
  return <ThemeProvider defaultMode="light">{/* Your app */}</ThemeProvider>;
}
```

### Using Theme Hook

```tsx
import { useTheme } from '@/providers/theme-provider';

function MyComponent() {
  const { mode, toggleMode, setMode, theme } = useTheme();

  return <button onClick={toggleMode}>Current mode: {mode}</button>;
}
```

### Design Tokens

All design tokens are available as CSS variables:

```css
/* Colors */
--primary-main
--primary-dark
--primary-light
--primary-lighter
--primary-darker

/* Spacing */
--spacing-1 through --spacing-24

/* Border Radius */
--radius-xs through --radius-full

/* Shadows */
--shadow-xs through --shadow-2xl

/* Z-Index */
--z-dropdown, --z-modal, --z-tooltip, etc.
```

## Mobile-First Approach

All components are built mobile-first and scale up:

```tsx
<Grid responsive={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
  {/* Content */}
</Grid>

<Stack
  responsive={{
    xs: 'column',
    md: 'row'
  }}
  spacing={4}
>
  {/* Content */}
</Stack>
```

## TypeScript Support

All components are fully typed with TypeScript:

```tsx
import type { ButtonProps } from '@/components/ui/button';
import type { TextFieldProps } from '@/components/ui/text-field';
import type { ThemeConfig } from '@/lib/theme/theme-config';
```

## Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Color contrast compliant

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Next Steps

Additional components to be implemented:

- Dialog/Modal
- Drawer
- Menu/Dropdown
- Tabs
- Stepper
- Table/DataGrid
- And 80+ more components...

## Contributing

Follow the established patterns:

1. Use TypeScript strict mode
2. Follow mobile-first principles
3. Support light/dark themes
4. Include proper accessibility
5. Add comprehensive prop types
6. Test across breakpoints

## License

MIT
