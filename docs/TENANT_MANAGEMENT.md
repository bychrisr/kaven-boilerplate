# Tenant Management in User Creation

## Overview

Users must be assigned to a tenant during creation. The system supports both creating a new tenant for the user or assigning them to an existing tenant.

## Implementation

### Form Field

**Location:** `apps/admin/sections/user/view/user-create-view.tsx`

**Field Type:** Required Select (dropdown)

**Options:**

1. **"Create own tenant"** (value: `'create-own'`)
   - First option in the list
   - Displays Plus icon
   - Triggers automatic tenant creation
2. **Existing tenants** (loaded from API)
   - Listed after separator
   - Shows tenant name
   - Value is tenant ID

### Schema Validation

```typescript
tenantId: z.string().min(1, 'Tenant is required');
```

**Note:** `tenantId` is a required field. Every user must have a tenant.

## Backend Integration

### Automatic Tenant Creation

When `tenantId === 'create-own'`, the backend automatically:

1. Generates slug from user's name
2. Ensures slug uniqueness
3. Creates tenant with status `ACTIVE`
4. Links user to created tenant

**Code:** `apps/api/src/modules/users/services/user.service.ts` (lines 149-175)

```typescript
if (tenantId === 'create-own') {
  const baseSlug = data.name
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-+)|(-+$)/g, '');

  // Ensure unique slug
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.tenant.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const tenant = await prisma.tenant.create({
    data: {
      name: data.name,
      slug,
      status: 'ACTIVE',
    },
  });

  tenantId = tenant.id;
}
```

### Existing Tenant Assignment

When selecting an existing tenant, the user is simply linked to that tenant ID.

## API Endpoints

### List Tenants

```
GET /api/tenants
```

**Response:**

```json
{
  "tenants": [
    {
      "id": "uuid",
      "name": "Tenant Name",
      "slug": "tenant-slug",
      "status": "ACTIVE"
    }
  ]
}
```

## UI/UX

### Visual States

- **Loading:** "Loading tenants..." (disabled)
- **Empty:** "No tenants available" (disabled)
- **Populated:** List of tenant names
- **Error:** Red border + error message

### Validation

- Required field (marked with \*)
- Shows error if not selected on submit
- Real-time validation on change

## Hook Usage

```typescript
import { useTenants } from '@/hooks/use-tenants';

const { tenants, isLoading: isLoadingTenants } = useTenants();
```

**Hook Location:** `apps/admin/hooks/use-tenants.ts`

## Migration from Company Field

**Previous:** Optional `company` text field
**Current:** Required `tenantId` select field

**Reason:** Multi-tenant architecture requires every user to belong to a tenant.

## Testing

### Test Case 1: Create Own Tenant

1. Select "Create own tenant"
2. Fill user details
3. Submit
4. **Expected:** New tenant created with user's name as base

### Test Case 2: Existing Tenant

1. Select tenant from list
2. Fill user details
3. Submit
4. **Expected:** User linked to selected tenant

### Test Case 3: Validation

1. Leave tenant unselected
2. Submit form
3. **Expected:** Error "Tenant is required"
