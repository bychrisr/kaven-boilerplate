# WORKFLOW: Tenant App BASE Implementation

> **Project:** Kaven Boilerplate v2.0  
> **Phase:** 1.5 - Tenant App Base  
> **Estimated Duration:** 2-3 weeks  
> **Prerequisites:** Micro-gaps completed (User Invite + Password Reset)

---

## 🎯 OBJECTIVE

Create a minimal but complete Tenant App structure that:

- Reuses 80%+ of existing Admin Panel code
- Provides core pages (dashboard, team, settings, profile)
- Includes 1-2 demo features (Projects & Tasks)
- Establishes patterns for developers to customize
- Maintains separate visual identity from Admin Panel

---

## 📦 DELIVERABLES

### Code Structure

```
production/tenant/               (New Next.js app)
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── team/
│   │   ├── settings/
│   │   ├── profile/
│   │   └── demo/
│   │       ├── projects/
│   │       └── tasks/
│   └── layout.tsx
├── components/
│   ├── ui/                      (shadcn)
│   ├── tenant-sidebar.tsx
│   ├── tenant-header.tsx
│   └── ...
└── lib/
    ├── api-client.ts
    └── auth.ts

production/backend/src/modules/app/  (New backend module)
├── projects/
│   ├── projects.controller.ts
│   ├── projects.service.ts
│   └── projects.routes.ts
└── tasks/
    ├── tasks.controller.ts
    ├── tasks.service.ts
    └── tasks.routes.ts
```

### Database Schema

- Project model (tenant-scoped)
- Task model (tenant-scoped)
- Relations and indexes

### Documentation

- README.md for tenant app
- Customization guide
- API endpoints documentation

---

## 🏗️ IMPLEMENTATION PHASES

---

# PHASE 0: STABILIZATION & HARDCODING AUDIT (Week 1, Day 0)

> **Critical:** Before starting any new development, we must ensure the codebase is robust and configurable.

## Step 0.1: Environment Variable Standardization

**Objective:** Remove all hardcoded URLs and ports.

1. **Audit Findings (To Fix):**
   - `apps/admin/sections/user/user-table-row.tsx`: Hardcoded `http://localhost:8000` for avatars.
   - `apps/api/src/app.ts`: Hardcoded CORS origins (`localhost:3000`, `3002`).
   - `apps/config/spaces.ts`: Hardcoded monitoring links.

2. **Actions:**
   - Define standard ENV variables in `packages/shared/src/config/env.ts`.
   - Update `.env.example` in all apps.
   - Refactor code to use `config.ts` or `process.env`.

**Validation:**

```bash
grep -r "localhost:3000" apps/
# Should return minimal/no results (except maybe in README or comments)
```

---

# PHASE 1: PROJECT SETUP (Week 1, Days 1-2)

## Step 1.1: Create Tenant App Structure

**Prompt:**

```
Create a new Next.js 14 app in production/tenant/ by copying the structure
from production/admin/ (or production/frontend/). This will be the Tenant App,
which is separate from the Admin Panel.

Requirements:
1. Copy entire production/admin directory to production/tenant
2. Update package.json:
   - name: "tenant"
   - port: 3001 (dev script should use PORT=3001)
3. Update all imports that reference "admin" to "tenant"
4. Clean up admin-specific routes and components (we'll adapt them next)

Do NOT modify the admin app - only create the new tenant app.
```

**Files to Create/Modify:**

- `production/tenant/` (entire directory)
- `production/tenant/package.json`
- `production/tenant/README.md`

**Validation:**

```bash
# Should start without errors
cd production/tenant
pnpm install
pnpm dev
# Visit http://localhost:3001
```

---

## Step 1.2: Configure Tenant App Identity

**Prompt:**

```
Update the Tenant App to have a distinct identity from Admin Panel:

1. Update production/tenant/app/layout.tsx:
   - Change title metadata to "Tenant App - Kaven"
   - Update description

2. Create production/tenant/lib/config.ts:
   - APP_NAME: "Kaven Tenant"
   - APP_URL: "http://localhost:3001"
   - API_URL: "http://localhost:3000" (same backend)

3. Update Tailwind config (production/tenant/tailwind.config.ts):
   - Change primary color from blue (admin) to purple (tenant)
   - Keep same design tokens otherwise

4. Update production/tenant/.env.example:
   - NEXT_PUBLIC_APP_NAME="Kaven Tenant"
   - NEXT_PUBLIC_API_URL="http://localhost:3000"
```

**Files to Modify:**

- `production/tenant/app/layout.tsx`
- `production/tenant/lib/config.ts` (create)
- `production/tenant/tailwind.config.ts`
- `production/tenant/.env.example`

**Validation:**

```bash
# Check metadata
curl http://localhost:3001 | grep "Tenant App"

# Check theme color
# Open http://localhost:3001 and verify purple accents
```

---

## Step 1.3: Clean Admin-Only Routes

**Prompt:**

```
Remove all admin-only routes from production/tenant/app/(dashboard)/:

Routes to DELETE:
- tenants/ (tenant management is admin-only)
- users/ (global user management is admin-only)
- audit-logs/ (global logs are admin-only)
- platform/ (platform settings is admin-only)
- observability/ (global metrics are admin-only)

Routes to KEEP:
- page.tsx (dashboard - will adapt)
- team/ (will adapt for self-service)
- settings/ (will adapt for tenant-scoped)
- profile/ (user profile - stays same)

Do NOT delete components/ui/ - those are reusable.
```

**Files to Delete:**

- `production/tenant/app/(dashboard)/tenants/`
- `production/tenant/app/(dashboard)/users/`
- `production/tenant/app/(dashboard)/audit-logs/`
- `production/tenant/app/(dashboard)/platform/`
- `production/tenant/app/(dashboard)/observability/`

**Validation:**

```bash
# These routes should 404
curl -I http://localhost:3001/tenants
curl -I http://localhost:3001/users
curl -I http://localhost:3001/audit-logs
```

---

# PHASE 2: LAYOUT & NAVIGATION (Week 1, Days 3-4)

## Step 2.1: Create Tenant Sidebar

**Prompt:**

```
Create production/tenant/components/tenant-sidebar.tsx by adapting the admin sidebar:

Menu Structure:
- Dashboard (/)
- Projects (/demo/projects) [with badge "Demo"]
- Tasks (/demo/tasks) [with badge "Demo"]
- Team (/team)
- Settings (/settings)
- Profile (/profile)

Visual Changes:
- Logo: Display tenant name (fetch from API)
- Remove all admin-specific menu items
- Use purple accent color (primary)
- Add "Powered by Kaven" footer badge
- Keep same responsive behavior (collapsible)

Reuse:
- Sidebar component structure from admin
- Icon library (lucide-react)
- Animations and transitions
```

**Files to Create:**

- `production/tenant/components/tenant-sidebar.tsx`

**Validation:**

```typescript
// Should render with correct menu items
import { TenantSidebar } from '@/components/tenant-sidebar';

// Menu items
const expectedItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Projects', href: '/demo/projects', badge: 'Demo' },
  { label: 'Tasks', href: '/demo/tasks', badge: 'Demo' },
  { label: 'Team', href: '/team' },
  { label: 'Settings', href: '/settings' },
  { label: 'Profile', href: '/profile' },
];
```

---

## Step 2.2: Create Tenant Header

**Prompt:**

```
Create production/tenant/components/tenant-header.tsx by adapting admin header:

Components:
1. Breadcrumbs (reuse from admin)
2. Search (optional - can be placeholder)
3. Notifications dropdown (reuse from admin)
4. Tenant Switcher (NEW - if user belongs to multiple tenants)
5. User menu dropdown (reuse from admin)

Changes from Admin Header:
- Remove "Admin Panel" text
- Add tenant switcher dropdown (if user has multiple tenants)
- Keep user menu (profile, settings, logout)

Tenant Switcher (NEW component):
- Dropdown showing all tenants user belongs to
- Current tenant highlighted
- Click to switch tenant (updates context)
- "Manage tenants" link at bottom (goes to tenant settings)

Tenant Space Selector (NEW component):
- Dropdown showing available spaces for current user (Finance, Marketing, etc.)
- "All Spaces" option (if permission allows)
- Updates `spaceId` in URL or Context

```

**Files to Create:**

- `production/tenant/components/tenant-header.tsx`
- `production/tenant/components/tenant-switcher.tsx` (new)

**Validation:**

```bash
# Header should render
# Tenant switcher should show current tenant
# User menu should work
```

---

## Step 2.3: Update Dashboard Layout

**Prompt:**

```
Update production/tenant/app/(dashboard)/layout.tsx to use new components:

Changes:
1. Import TenantSidebar instead of AdminSidebar
2. Import TenantHeader instead of AdminHeader
3. Keep same responsive layout structure
4. Add tenant context provider (wrap children)
5. Add tenant loading state

Tenant Context Provider:
- Fetch current tenant on mount
- Provide tenant data to all child components
- Handle tenant switching
- Fetch current tenant on mount
- Provide tenant data to all child components
- Handle tenant switching
- Cache tenant data in zustand store

Space Context Provider:
- Fetch user's allowed spaces
- Persist active space
- Filter navigation based on active space

```

**Files to Modify:**

- `production/tenant/app/(dashboard)/layout.tsx`

**Files to Create:**

- `production/tenant/lib/hooks/use-tenant.ts`
- `production/tenant/lib/store/tenant-store.ts` (zustand)

**Validation:**

```bash
# Layout should render with new sidebar/header
# Tenant context should be available
# No console errors
```

---

# PHASE 3: CORE PAGES (Week 1 Day 5 - Week 2 Day 2)

## Step 3.1: Tenant Dashboard

**Prompt:**

```
Create production/tenant/app/(dashboard)/page.tsx - the main tenant dashboard:

Layout:
1. Welcome header: "Welcome back, {user.name}!" + tenant name
2. Stats cards row (4 cards):
   - Active Team Members
   - Total Projects (demo)
   - Pending Tasks (demo)
   - Storage Used (placeholder)
3. Charts row (2 columns):
   - Activity chart (line chart - last 7 days)
   - Task status pie chart (demo)
4. Recent activity table:
   - Last 10 activities (from audit log, tenant-scoped)
   - Show: user, action, resource, timestamp

Reuse Components:
- StatsCard from admin (same component)
- Chart components from admin
- Table components from admin

Data Fetching:
- Use TanStack Query
- Endpoints:
  - GET /api/app/stats (tenant-scoped stats)
  - GET /api/app/activity (recent activity)
```

**Files to Create:**

- `production/tenant/app/(dashboard)/page.tsx`
- `production/tenant/lib/api/dashboard.ts`

**Backend Endpoints Required:**

```typescript
// apps/backend/src/modules/app/dashboard/
GET / api / app / stats;
// Returns: { members: number, projects: number, tasks: number, storage: string }

GET / api / app / activity;
// Returns: Activity[] (tenant-scoped audit logs)
```

**Validation:**

```bash
# Dashboard should load
# Stats cards should show data
# Charts should render
# Recent activity table should show entries
```

---

## Step 3.2: Team Page (Self-Service)

**Prompt:**

```
Create production/tenant/app/(dashboard)/team/page.tsx:

Purpose: Self-service team management (tenant-scoped, not global)

Features:
1. Team members table:
   - Columns: Avatar, Name, Email, Role, Status, Actions
   - Filter by role, status
   - Search by name/email
   - Sort by name, email, created date

2. Invite member button (uses User Invite gap you implemented):
   - Opens modal
   - Form: email, role (MEMBER or ADMIN)
   - Calls POST /api/users/invite
   - Shows success message

3. Row actions:
   - Edit role (if current user is ADMIN)
   - Remove from team (if current user is ADMIN)
   - Cannot remove self

Permissions:
- MEMBER: Can view team only
- ADMIN: Can invite, edit roles, remove members

Reuse:
- Table components from admin users page
- InviteUserDialog from admin (adapt for tenant context)
- PermissionGate component

4. Spaces Management (NEW):
   - Only for ADMIN
   - Column in table showing assigned spaces
   - Edit user dialog allows changing space assignments

```

**Files to Create:**

- `production/tenant/app/(dashboard)/team/page.tsx`
- `production/tenant/components/team/team-members-table.tsx`
- `production/tenant/components/team/invite-member-dialog.tsx` (adapt from admin)

**Backend Endpoints:**

```typescript
// Already exists from micro-gaps
POST /api/users/invite (tenant-scoped)

// New endpoints
GET /api/app/team/members (tenant-scoped)
PUT /api/app/team/members/:id/role
DELETE /api/app/team/members/:id (remove from tenant)
```

**Validation:**

```bash
# Team table loads with current tenant members
# Invite button works (opens modal)
# Permissions enforced (MEMBER can't invite)
```

---

## Step 3.3: Settings Page (Tenant-Scoped)

**Prompt:**

```
Create production/tenant/app/(dashboard)/settings/page.tsx:

Purpose: Tenant configuration (not platform settings)

Tabs:
1. General:
   - Tenant name
   - Logo upload
   - Description
   - Timezone selector

2. Branding (optional):
   - Primary color
   - Logo URL
   - Favicon URL

3. Notifications:
   - Email notifications toggle
   - Slack integration toggle
   - Webhook URL

Form Behavior:
- Auto-save on blur (with toast notification)
- Validation on client and server
- Optimistic updates
- Loading states

Permissions:
- Only ADMIN can edit
- MEMBER can view only

Reuse:
- Form components from admin settings
- Upload component from admin
- Toast notifications (sonner)

4. Spaces (NEW Tab):
   - List all spaces (Finance, Marketing, Support, etc.)
   - Create/Edit/Delete spaces
   - Manage default permissions per space
   - Toggle space visibility
   - Only accessible by TENANT_ADMIN

```

**Files to Create:**

- `production/tenant/app/(dashboard)/settings/page.tsx`
- `production/tenant/components/settings/general-settings.tsx`
- `production/tenant/components/settings/branding-settings.tsx`

**Backend Endpoints:**

```typescript
GET / api / app / settings(tenant - scoped);
PUT / api / app / settings(tenant - scoped);
// Returns/updates tenant configuration
```

**Validation:**

```bash
# Settings page loads with current tenant data
# Form saves correctly
# Permissions enforced
# Toast shows on save
```

---

## Step 3.4: Profile Page

**Prompt:**

```
Copy production/admin/app/(dashboard)/profile/ to production/tenant/app/(dashboard)/profile/

This page is identical for both admin and tenant apps.

No changes needed except:
- Update imports to use tenant paths
- Ensure API endpoints are same (they're user-scoped, not admin-scoped)
```

**Files to Copy:**

- `production/tenant/app/(dashboard)/profile/page.tsx`

**Validation:**

```bash
# Profile page loads
# User can update their info
# Avatar upload works
# 2FA settings work
```

---

# PHASE 4: DEMO FEATURES (Week 2, Days 3-5)

## Step 4.1: Database Models (Projects & Tasks)

**Prompt:**

```
Add Project and Task models to prisma/schema.prisma:

Requirements:
1. Both models MUST be tenant-scoped (tenantId field)
2. Proper indexes for performance
3. Cascading deletes (delete project → delete tasks)
4. Audit fields (createdAt, updatedAt, createdBy)

Note: These are DEMO features to show developers how to add features.
Developers will replace/remove these with their own features.
```

**Schema:**

```prisma
model Project {
  id          String   @id @default(uuid())
  name        String
  description String?
  status      ProjectStatus @default(ACTIVE)
  color       String?  @default("#3B82F6")

  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  createdById String
  createdBy   User     @relation(fields: [createdById], references: [id])

  tasks       Task[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([tenantId])
  @@index([createdById])
}

enum ProjectStatus {
  ACTIVE
  ARCHIVED
  COMPLETED
}

model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    TaskPriority @default(MEDIUM)
  dueDate     DateTime?

  projectId   String
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  assigneeId  String?
  assignee    User?    @relation(fields: [assigneeId], references: [id])

  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  createdById String
  createdBy   User     @relation(fields: [createdById], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([tenantId])
  @@index([projectId])
  @@index([assigneeId])
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  IN_REVIEW
  DONE
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

**Files to Modify:**

- `prisma/schema.prisma`

**Commands:**

```bash
# Generate migration
npx prisma migrate dev --name add_projects_tasks

# Generate Prisma Client
npx prisma generate
```

**Validation:**

```bash
# Migration should create tables
# Prisma Client should have new types
```

---

## Step 4.2: Backend - Projects Module

**Prompt:**

```
Create backend module for Projects in apps/backend/src/modules/app/projects/:

Files to create:
1. projects.service.ts:
   - findAll(tenantId, filters) - list projects (tenant-scoped)
   - findOne(id, tenantId) - get single project
   - create(data, tenantId, userId) - create project
   - update(id, data, tenantId) - update project
   - delete(id, tenantId) - delete project (cascade tasks)
   - All methods MUST enforce tenantId

2. projects.controller.ts:
   - GET /api/app/projects
   - POST /api/app/projects
   - GET /api/app/projects/:id
   - PUT /api/app/projects/:id
   - DELETE /api/app/projects/:id
   - Use @TenantScoped decorator (middleware)
   - Validate inputs with zod

3. projects.routes.ts:
   - Register all routes
   - Apply authentication middleware
   - Apply tenant middleware (ensures tenantId)

Important: Use tenant middleware to auto-inject tenantId from JWT.
```

**Files to Create:**

- `apps/backend/src/modules/app/projects/projects.service.ts`
- `apps/backend/src/modules/app/projects/projects.controller.ts`
- `apps/backend/src/modules/app/projects/projects.routes.ts`
- `apps/backend/src/modules/app/projects/projects.dto.ts` (zod schemas)

**Validation:**

```bash
# Test endpoints
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/app/projects
# Should return empty array

curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","description":"Demo"}' \
  http://localhost:3000/api/app/projects
# Should create project
```

---

## Step 4.3: Backend - Tasks Module

**Prompt:**

```
Create backend module for Tasks in apps/backend/src/modules/app/tasks/:

Similar structure to Projects module:
1. tasks.service.ts
2. tasks.controller.ts
3. tasks.routes.ts
4. tasks.dto.ts

Additional endpoints:
- GET /api/app/projects/:projectId/tasks (tasks by project)
- PUT /api/app/tasks/:id/status (quick status update)
- PUT /api/app/tasks/:id/assign (assign to user)

All methods MUST enforce tenantId.
```

**Files to Create:**

- `apps/backend/src/modules/app/tasks/tasks.service.ts`
- `apps/backend/src/modules/app/tasks/tasks.controller.ts`
- `apps/backend/src/modules/app/tasks/tasks.routes.ts`
- `apps/backend/src/modules/app/tasks/tasks.dto.ts`

**Validation:**

```bash
# Test endpoints
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/app/tasks
# Should return empty array
```

---

## Step 4.4: Frontend - Projects Page

**Prompt:**

```
Create production/tenant/app/(dashboard)/demo/projects/page.tsx:

Purpose: Demonstrate CRUD operations for developers

Layout:
1. Header:
   - Title: "Projects" with "Demo" badge
   - "New Project" button (opens modal)
   - Search input
   - Filter dropdown (Active/Archived/All)

2. Projects Grid:
   - Card-based layout (3 columns)
   - Each card shows:
     - Project name
     - Description (truncated)
     - Status badge
     - Task count
     - Progress bar (completed tasks / total tasks)
     - Created date
     - Actions menu (Edit, Delete)

3. Empty state:
   - "No projects yet"
   - "Create your first project" button

4. Create/Edit Modal:
   - Form: name, description, color picker
   - Validation
   - Submit button

Tech:
- TanStack Query for data fetching
- React Hook Form for forms
- Zod for validation
- Sonner for toasts

Reuse:
- Card components from shadcn
- Modal (Dialog) from shadcn
- Form components from shadcn
```

**Files to Create:**

- `production/tenant/app/(dashboard)/demo/projects/page.tsx`
- `production/tenant/components/demo/projects/projects-grid.tsx`
- `production/tenant/components/demo/projects/project-card.tsx`
- `production/tenant/components/demo/projects/project-form-dialog.tsx`
- `production/tenant/lib/api/projects.ts` (API client)

**Validation:**

```bash
# Page loads with empty state
# Can create project
# Projects display in grid
# Can edit/delete project
```

---

## Step 4.5: Frontend - Project Detail Page

**Prompt:**

```
Create production/tenant/app/(dashboard)/demo/projects/[id]/page.tsx:

Purpose: Show project details with embedded tasks

Layout:
1. Header:
   - Breadcrumb: Projects > {Project Name}
   - Back button
   - Edit project button
   - Delete project button (with confirmation)

2. Project Info Card:
   - Name, description, status
   - Created by, created date
   - Progress bar (task completion)

3. Tasks Section:
   - "Add Task" button
   - Tasks list (table or kanban - choose one)
   - Group by status
   - Drag & drop to change status (if kanban)

4. Task Actions:
   - Mark as complete
   - Edit task
   - Delete task
   - Assign to team member
```

**Files to Create:**

- `production/tenant/app/(dashboard)/demo/projects/[id]/page.tsx`
- `production/tenant/components/demo/tasks/tasks-table.tsx`
- `production/tenant/components/demo/tasks/task-form-dialog.tsx`

**Validation:**

```bash
# Project detail page loads
# Can add tasks
# Tasks display correctly
# Can update task status
```

---

## Step 4.6: Frontend - Tasks Page

**Prompt:**

```
Create production/tenant/app/(dashboard)/demo/tasks/page.tsx:

Purpose: Global tasks view (all tasks across projects)

Layout:
1. Header:
   - Title: "Tasks" with "Demo" badge
   - "New Task" button
   - Filters: Status, Priority, Assignee, Project

2. Tasks Table:
   - Columns: Title, Project, Status, Priority, Assignee, Due Date, Actions
   - Sortable columns
   - Row actions: Edit, Delete, Assign, Change Status
   - Bulk actions: Mark as done, Delete selected

3. Quick Actions:
   - Status dropdown (inline edit)
   - Priority badge (click to change)
   - Assignee avatar (click to reassign)

Tech:
- TanStack Table for advanced table features
- Drag & drop (optional)
```

**Files to Create:**

- `production/tenant/app/(dashboard)/demo/tasks/page.tsx`
- `production/tenant/components/demo/tasks/tasks-table-advanced.tsx`

**Validation:**

```bash
# Tasks page loads
# Filters work
# Can create/edit/delete tasks
# Inline editing works
```

---

# PHASE 5: POLISH & DOCUMENTATION (Week 3)

## Step 5.1: Error Handling & Loading States

**Prompt:**

```
Add proper error handling and loading states to all tenant app pages:

1. Loading States:
   - Skeleton loaders for tables/cards (using shadcn Skeleton)
   - Spinner for buttons during submit
   - Suspense boundaries with fallbacks

2. Error States:
   - Error boundaries at page level
   - Retry button on error
   - User-friendly error messages
   - Log errors to console (dev) or Sentry (prod)

3. Empty States:
   - Custom illustrations or icons
   - Helpful text
   - CTA button to create first item

Apply to all pages:
- Dashboard
- Team
- Settings
- Projects
- Tasks
```

**Files to Modify:**

- All page.tsx files
- `production/tenant/components/error-boundary.tsx` (create)
- `production/tenant/components/loading-skeleton.tsx` (create)
- `production/tenant/components/empty-state.tsx` (create)

---

## Step 5.2: Responsive Design

**Prompt:**

```
Ensure all pages are fully responsive:

Breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Changes:
1. Sidebar:
   - Collapsed by default on mobile
   - Overlay on mobile
   - Always visible on desktop

2. Tables:
   - Horizontal scroll on mobile
   - Card view alternative on mobile (optional)

3. Forms:
   - Full width on mobile
   - Modal on mobile should be full screen

4. Grids:
   - 1 column on mobile
   - 2 columns on tablet
   - 3 columns on desktop

Test on:
- Mobile device (or Chrome DevTools)
- Tablet
- Desktop
```

---

## Step 5.3: Documentation

**Prompt:**

```
Create comprehensive documentation for the Tenant App:

Files to create:

1. production/tenant/README.md:
   - What is Tenant App vs Admin Panel
   - Architecture overview
   - How to run locally
   - How to customize
   - Deployment guide

2. production/tenant/CUSTOMIZATION.md:
   - How to add new features
   - How to remove demo features
   - How to customize branding
   - How to add new routes
   - How to integrate with backend

3. production/tenant/API.md:
   - List all API endpoints used
   - Request/response examples
   - Authentication
   - Tenant context

4. docs/TENANT_APP.md (in main docs):
   - Overview of Tenant App
   - User guide
   - Developer guide
   - Screenshots
```

**Files to Create:**

- `production/tenant/README.md`
- `production/tenant/CUSTOMIZATION.md`
- `production/tenant/API.md`
- `docs/TENANT_APP.md`

---

## Step 5.4: Screenshots & Demo Data

**Prompt:**

```
Create demo data and take screenshots:

1. Seed Script:
   - Create production/backend/prisma/seeds/tenant-demo.ts
   - Generate:
     - 3 sample projects
     - 10 sample tasks
     - Realistic data (names, descriptions, dates)
   - Run: npx ts-node prisma/seeds/tenant-demo.ts

2. Screenshots:
   - Take screenshots of all pages
   - Save to docs/screenshots/tenant/
   - Use for README and docs

Screenshots needed:
- Dashboard
- Projects list
- Project detail with tasks
- Tasks list
- Team page
- Settings page
```

**Files to Create:**

- `production/backend/prisma/seeds/tenant-demo.ts`
- Screenshots in `docs/screenshots/tenant/`

---

## Step 5.5: Testing

**Prompt:**

```
Add tests for critical flows:

1. Unit Tests:
   - API client functions
   - Utilities
   - Components (project-card, task-card)

2. Integration Tests:
   - Create project flow
   - Create task flow
   - Invite team member
   - Update settings

3. E2E Tests (optional):
   - Login → Dashboard → Create Project → Add Tasks
   - Team management flow

Test Framework:
- Vitest for unit tests
- React Testing Library for components
- Playwright for E2E (optional)

Critical: Test tenant isolation (user can only see their tenant's data)
```

**Files to Create:**

- `production/tenant/__tests__/` (test directory)
- Example tests for each feature

---

# PHASE 6: INTEGRATION & DEPLOYMENT (Week 3, End)

## Step 6.1: Backend Integration

**Prompt:**

```
Register new app module in backend:

1. Update apps/backend/src/app.ts:
   - Import app routes
   - Register /api/app/* prefix
   - Apply tenant middleware

2. Update production/backend/src/modules/app/index.ts:
   - Export all app modules
   - Barrel export

3. Test all endpoints:
   - Authentication works
   - Tenant isolation enforced
   - CRUD operations work
```

---

## Step 6.2: Update Root Package.json

**Prompt:**

```
Add tenant app scripts to root package.json:

Scripts to add:
- "dev:tenant": "cd production/tenant && pnpm dev"
- "build:tenant": "cd production/tenant && pnpm build"
- "start:tenant": "cd production/tenant && pnpm start"

Update dev:all script:
- Run backend, admin, AND tenant in parallel
```

**Files to Modify:**

- `package.json` (root)

---

## Step 6.3: Docker Configuration

**Prompt:**

```
Add tenant app to Docker Compose:

1. docker-compose.yml:
   - Add tenant service
   - Port 3001
   - Environment variables
   - Depends on backend

2. .docker/Dockerfile.tenant:
   - Multi-stage build
   - Production optimized

Test:
docker-compose up tenant
# Should start and be accessible
```

**Files to Modify:**

- `docker-compose.yml`

**Files to Create:**

- `.docker/Dockerfile.tenant`

---

## Step 6.4: Update Main README

**Prompt:**

```
Update root README.md to document Tenant App:

Sections to add:
1. Architecture overview (3 apps now: backend, admin, tenant)
2. URL structure:
   - api.kaven.site → Backend
   - admin.kaven.site → Admin Panel
   - app.kaven.site → Tenant App
3. Quick start commands for tenant
4. Link to tenant docs

Keep existing admin documentation.
```

**Files to Modify:**

- `README.md` (root)

---

# VALIDATION CHECKLIST

## Final Step: Documentation Update

**Objective:** Regenerate documentation to reflect all changes.

**Command:**

```bash
/document
```

## ✅ Functional Requirements

- [ ] Tenant App runs on port 3001
- [ ] Login/Register work
- [ ] Dashboard loads with stats
- [ ] Team page shows tenant members
- [ ] Invite member works (uses micro-gap implementation)
- [ ] Settings page saves correctly
- [ ] Profile page works
- [ ] Projects CRUD works
- [ ] Tasks CRUD works
- [ ] Project detail shows tasks
- [ ] All pages are tenant-scoped (can't see other tenants' data)
- [ ] Responsive on mobile/tablet/desktop

## ✅ Visual Requirements

- [ ] Sidebar shows tenant-specific menu
- [ ] Header has tenant switcher
- [ ] Purple theme (vs blue for admin)
- [ ] "Demo" badges on demo features
- [ ] "Powered by Kaven" footer
- [ ] Consistent design system (shadcn/ui)

## ✅ Technical Requirements

- [ ] 80%+ code reused from admin
- [ ] Tenant middleware enforces isolation
- [ ] All API calls authenticated
- [ ] No errors in console
- [ ] TypeScript types correct
- [ ] Loading states implemented
- [ ] Error handling implemented
- [ ] Forms validated (client + server)

## ✅ Documentation

- [ ] README.md complete
- [ ] CUSTOMIZATION.md complete
- [ ] API.md complete
- [ ] Screenshots taken
- [ ] Demo data seeded

## ✅ Testing

- [ ] Manual testing done
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Tenant isolation verified
- [ ] Cross-browser tested

---

# SUCCESS CRITERIA

The Tenant App BASE is complete when:

1. ✅ Developer can clone boilerplate and run both admin + tenant
2. ✅ Clear separation between admin (platform management) and tenant (app usage)
3. ✅ Example features (projects/tasks) demonstrate how to add features
4. ✅ Documentation explains how to customize/extend
5. ✅ All core pages functional (dashboard, team, settings, profile)
6. ✅ Tenant isolation enforced (security tested)
7. ✅ Professional quality (no "WIP" or placeholder text)

---

# TELEMETRY

Track completion:

- [ ] Phase 1: Setup (2 days)
- [ ] Phase 2: Layout (2 days)
- [ ] Phase 3: Core Pages (3 days)
- [ ] Phase 4: Demo Features (3 days)
- [ ] Phase 5: Polish (3-4 days)
- [ ] Phase 6: Integration (1-2 days)

Total: 14-16 days (2-3 weeks)

---

# NOTES FOR ANTIGRAVITY

- Reuse components aggressively (80% target)
- Keep demo features simple (they'll be replaced)
- Focus on establishing patterns, not building complete app
- Tenant isolation is CRITICAL - validate at every step
- Test with multiple users in same tenant
- Test with users in different tenants
- Document customization process clearly

---

# NEXT STEPS AFTER COMPLETION

After Tenant App BASE is complete:

1. ✅ Phase 1.6: Finish micro-gaps (User Invite + Password Reset)
2. 🔄 Phase 2: Module System
3. 🔄 Phase 3: Schema & Updates
4. 🔄 Phase 4+: Tenant App Commercial (app.kaven.site with store features)

---

**End of Workflow**
