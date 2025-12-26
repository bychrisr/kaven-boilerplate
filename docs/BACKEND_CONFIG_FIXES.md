# Backend Configuration Fixes

## Overview

Critical fixes to backend configuration that prevented the server from starting and communicating with the frontend.

## Issues Fixed

### 1. API URL Fallback Incorrect

**File:** `apps/admin/lib/config/index.ts`

**Problem:**

```typescript
// BEFORE (WRONG)
baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
```

Frontend was trying to connect to itself (port 3000) instead of the backend (port 8000).

**Solution:**

```typescript
// AFTER (CORRECT)
baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

**Impact:**

- `ERR_CONNECTION_REFUSED` when creating users
- All API calls failed when env var not loaded

---

### 2. Dotenv Path Configuration

**File:** `apps/api/src/config/env.ts`

**Problem:**

```typescript
// BEFORE (WRONG)
dotenv.config(); // Tried to read .env from apps/api/
```

Backend couldn't find `.env` file because it was looking in `apps/api/` directory, but the file is in the monorepo root.

**Solution:**

```typescript
// AFTER (CORRECT)
import * as path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../../../.env'),
});
```

**Impact:**

```
❌ Environment validation failed:
DATABASE_URL: Invalid input: expected string, received undefined
REDIS_URL: Invalid input: expected string, received undefined
JWT_SECRET: Invalid input: expected string, received undefined
```

Backend failed to start without environment variables.

---

## Environment Variables

### Location

**Monorepo root:** `/home/bychrisr/projects/kaven-boilerplate/.env`

### Required Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Redis
REDIS_URL="redis://localhost:6379"

# JWT & Security
JWT_SECRET="..."
REFRESH_TOKEN_SECRET="..."
ENCRYPTION_KEY="..."

# Server
PORT=8000
CORS_ORIGIN="http://localhost:3000"
FRONTEND_URL="http://localhost:3000"
```

### Path Resolution

From `apps/api/src/config/env.ts`:

```
__dirname = apps/api/src/config/
../../../../.env = root/.env
```

## Verification

### Backend Started Successfully

```bash
api:dev: 🚀 Server running on http://localhost:8000
api:dev: 📚 API Documentation: http://localhost:8000/api/auth
api:dev: [dotenv@17.2.3] injecting env (21) from ../../.env
```

### Frontend Connected

```bash
admin:dev: ✓ Ready in 827ms
admin:dev: - Local: http://localhost:3002
```

## Testing

1. **Start dev server:**

   ```bash
   npm run dev
   ```

2. **Verify backend:**
   - Check for "Server running on http://localhost:8000"
   - No environment validation errors

3. **Verify frontend:**
   - Check for "Ready in Xms"
   - No connection refused errors

4. **Test API calls:**
   - Create user should work
   - No ERR_CONNECTION_REFUSED

## Related Files

- `apps/admin/lib/config/index.ts` - API URL configuration
- `apps/api/src/config/env.ts` - Environment loading
- `.env` - Environment variables (root)
- `apps/admin/.env.local` - Frontend env vars

## Commits

1. `fix: CRITICAL - correct API baseUrl fallback to port 8000`
2. `fix: configure dotenv to load .env from monorepo root`
