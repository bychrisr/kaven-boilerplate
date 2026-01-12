# QUICK START GUIDE - Tenant App BASE

> **Companion to:** WORKFLOW_TENANT_APP_BASE.md  
> **Purpose:** Quick reference for commands and validation

---

## 🚀 PHASE-BY-PHASE COMMANDS

### PHASE 1: Setup (Days 1-2)

```bash
# Step 1.1: Create structure
cd production/
cp -r admin tenant  # or cp -r frontend tenant
cd tenant
pnpm install

# Step 1.2: Configure
# Edit files:
# - app/layout.tsx (change title)
# - tailwind.config.ts (change primary color)
# - .env.example (update vars)

# Step 1.3: Clean admin routes
rm -rf app/\(dashboard\)/tenants
rm -rf app/\(dashboard\)/users
rm -rf app/\(dashboard\)/audit-logs
rm -rf app/\(dashboard\)/platform
rm -rf app/\(dashboard\)/observability

# Test
pnpm dev  # Should run on port 3002
```

---

### PHASE 2: Layout (Days 3-4)

```bash
# Create components
touch components/tenant-sidebar.tsx
touch components/tenant-header.tsx
touch components/tenant-switcher.tsx

# Create hooks/stores
touch lib/hooks/use-tenant.ts
touch lib/store/tenant-store.ts

# Test
# Visit http://localhost:3002
# Sidebar should show tenant menu
# Header should show tenant switcher
```

---

### PHASE 3: Core Pages (Days 5-7)

```bash
# Dashboard
# Edit app/(dashboard)/page.tsx
touch lib/api/dashboard.ts

# Team
mkdir -p app/\(dashboard\)/team
touch app/\(dashboard\)/team/page.tsx
touch components/team/team-members-table.tsx
touch components/team/invite-member-dialog.tsx

# Settings
mkdir -p app/\(dashboard\)/settings
touch app/\(dashboard\)/settings/page.tsx
touch components/settings/general-settings.tsx

# Profile (copy from admin)
cp -r ../admin/app/\(dashboard\)/profile app/\(dashboard\)/

# Test each page
curl http://localhost:3002/api/app/stats
curl http://localhost:3002/api/app/team/members
```

---

### PHASE 4: Demo Features (Days 8-10)

```bash
# Database
# Edit prisma/schema.prisma (add Project + Task models)
npx prisma migrate dev --name add_projects_tasks
npx prisma generate

# Backend - Projects
mkdir -p apps/backend/src/modules/app/projects
touch apps/backend/src/modules/app/projects/projects.service.ts
touch apps/backend/src/modules/app/projects/projects.controller.ts
touch apps/backend/src/modules/app/projects/projects.routes.ts
touch apps/backend/src/modules/app/projects/projects.dto.ts

# Backend - Tasks
mkdir -p apps/backend/src/modules/app/tasks
touch apps/backend/src/modules/app/tasks/tasks.service.ts
touch apps/backend/src/modules/app/tasks/tasks.controller.ts
touch apps/backend/src/modules/app/tasks/tasks.routes.ts
touch apps/backend/src/modules/app/tasks/tasks.dto.ts

# Frontend - Projects
mkdir -p app/\(dashboard\)/demo/projects
touch app/\(dashboard\)/demo/projects/page.tsx
mkdir -p app/\(dashboard\)/demo/projects/\[id\]
touch app/\(dashboard\)/demo/projects/\[id\]/page.tsx
touch components/demo/projects/projects-grid.tsx
touch components/demo/projects/project-card.tsx
touch components/demo/projects/project-form-dialog.tsx
touch lib/api/projects.ts

# Frontend - Tasks
mkdir -p app/\(dashboard\)/demo/tasks
touch app/\(dashboard\)/demo/tasks/page.tsx
touch components/demo/tasks/tasks-table.tsx
touch components/demo/tasks/task-form-dialog.tsx
touch lib/api/tasks.ts

# Test
curl -X POST http://localhost:3000/api/app/projects \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Test","description":"Demo"}'
```

---

### PHASE 5: Polish (Days 11-13)

```bash
# Error handling
touch components/error-boundary.tsx
touch components/loading-skeleton.tsx
touch components/empty-state.tsx

# Documentation
touch README.md
touch CUSTOMIZATION.md
touch API.md

# Demo data
touch ../backend/prisma/seeds/tenant-demo.ts
npx ts-node prisma/seeds/tenant-demo.ts

# Screenshots
mkdir -p ../../docs/screenshots/tenant
# Take screenshots and save
```

---

### PHASE 6: Integration (Days 14-15)

```bash
# Root package.json
# Add scripts:
# "dev:tenant": "cd production/tenant && pnpm dev"
# "build:tenant": "cd production/tenant && pnpm build"

# Docker
touch .docker/Dockerfile.tenant
# Edit docker-compose.yml (add tenant service)

# Test full stack
docker-compose up -d
# Visit http://localhost:3002
```

---

## ✅ VALIDATION COMMANDS

### Test Authentication
```bash
# Login should work
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Should return JWT token
```

### Test Tenant Isolation
```bash
# User 1 (Tenant A)
TOKEN_A="..."
curl -H "Authorization: Bearer $TOKEN_A" http://localhost:3000/api/app/projects
# Should return only Tenant A projects

# User 2 (Tenant B)
TOKEN_B="..."
curl -H "Authorization: Bearer $TOKEN_B" http://localhost:3000/api/app/projects
# Should return only Tenant B projects

# Critical: User A should NOT see User B's data
```

### Test All Endpoints
```bash
# Dashboard stats
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/app/stats

# Team members
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/app/team/members

# Projects CRUD
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/app/projects
curl -X POST -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/app/projects -d '{...}'
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/app/projects/:id
curl -X PUT -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/app/projects/:id -d '{...}'
curl -X DELETE -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/app/projects/:id

# Tasks CRUD
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/app/tasks
# ... (same pattern)
```

---

## 📋 DAILY CHECKLIST

### Day 1
- [ ] Copy admin → tenant
- [ ] Update package.json
- [ ] Configure colors/theme
- [ ] Clean admin routes
- [ ] Test dev server runs

### Day 2
- [ ] Create lib/config.ts
- [ ] Update .env.example
- [ ] Verify no admin-specific code
- [ ] Test build works

### Day 3
- [ ] Create tenant-sidebar.tsx
- [ ] Implement tenant menu items
- [ ] Add "Demo" badges
- [ ] Test responsive sidebar

### Day 4
- [ ] Create tenant-header.tsx
- [ ] Create tenant-switcher.tsx
- [ ] Update layout.tsx
- [ ] Test navigation works

### Day 5
- [ ] Dashboard page (stats cards)
- [ ] Dashboard charts
- [ ] Recent activity table
- [ ] Test data loads

### Day 6
- [ ] Team page (table)
- [ ] Invite member dialog
- [ ] Test invite flow
- [ ] Test permissions

### Day 7
- [ ] Settings page (general tab)
- [ ] Settings page (branding tab)
- [ ] Profile page (copy from admin)
- [ ] Test form saves

### Day 8
- [ ] Database models (Project, Task)
- [ ] Generate migration
- [ ] Backend projects service
- [ ] Backend projects controller/routes

### Day 9
- [ ] Backend tasks service
- [ ] Backend tasks controller/routes
- [ ] Register app routes in backend
- [ ] Test API endpoints

### Day 10
- [ ] Frontend projects page
- [ ] Projects grid component
- [ ] Project form dialog
- [ ] Test project CRUD

### Day 11
- [ ] Frontend project detail page
- [ ] Tasks table/kanban
- [ ] Task form dialog
- [ ] Test task CRUD in project

### Day 12
- [ ] Frontend tasks page (global)
- [ ] Advanced table with filters
- [ ] Inline editing
- [ ] Test all task operations

### Day 13
- [ ] Add loading states everywhere
- [ ] Add error boundaries
- [ ] Add empty states
- [ ] Test responsive design

### Day 14
- [ ] Write README.md
- [ ] Write CUSTOMIZATION.md
- [ ] Write API.md
- [ ] Create demo seed data

### Day 15
- [ ] Take screenshots
- [ ] Final testing
- [ ] Update root README
- [ ] Docker setup

---

## 🎯 KEY FILES TO CREATE

```
production/tenant/
├── components/
│   ├── tenant-sidebar.tsx          ⭐ New
│   ├── tenant-header.tsx           ⭐ New
│   ├── tenant-switcher.tsx         ⭐ New
│   ├── error-boundary.tsx          ⭐ New
│   ├── loading-skeleton.tsx        ⭐ New
│   ├── empty-state.tsx             ⭐ New
│   ├── team/
│   │   ├── team-members-table.tsx  ⭐ New
│   │   └── invite-member-dialog.tsx ⭐ Adapt
│   ├── settings/
│   │   ├── general-settings.tsx    ⭐ Adapt
│   │   └── branding-settings.tsx   ⭐ New
│   └── demo/
│       ├── projects/
│       │   ├── projects-grid.tsx   ⭐ New
│       │   ├── project-card.tsx    ⭐ New
│       │   └── project-form-dialog.tsx ⭐ New
│       └── tasks/
│           ├── tasks-table.tsx     ⭐ New
│           └── task-form-dialog.tsx ⭐ New
├── lib/
│   ├── config.ts                   ⭐ New
│   ├── hooks/
│   │   └── use-tenant.ts           ⭐ New
│   ├── store/
│   │   └── tenant-store.ts         ⭐ New
│   └── api/
│       ├── dashboard.ts            ⭐ New
│       ├── projects.ts             ⭐ New
│       └── tasks.ts                ⭐ New
├── app/(dashboard)/
│   ├── page.tsx                    ⭐ Adapt
│   ├── team/page.tsx               ⭐ New
│   ├── settings/page.tsx           ⭐ Adapt
│   ├── profile/page.tsx            ✅ Copy
│   └── demo/
│       ├── projects/
│       │   ├── page.tsx            ⭐ New
│       │   └── [id]/page.tsx       ⭐ New
│       └── tasks/page.tsx          ⭐ New
├── README.md                       ⭐ New
├── CUSTOMIZATION.md                ⭐ New
└── API.md                          ⭐ New

apps/backend/src/modules/app/
├── projects/                       ⭐ New module
│   ├── projects.service.ts
│   ├── projects.controller.ts
│   ├── projects.routes.ts
│   └── projects.dto.ts
└── tasks/                          ⭐ New module
    ├── tasks.service.ts
    ├── tasks.controller.ts
    ├── tasks.routes.ts
    └── tasks.dto.ts
```

Legend:
- ⭐ New: Create from scratch
- ⭐ Adapt: Copy from admin and modify
- ✅ Copy: Copy as-is from admin

---

## 🧪 TESTING CHECKLIST

### Manual Testing
- [ ] Can create tenant user account
- [ ] Can login to tenant app
- [ ] Dashboard loads with correct data
- [ ] Can invite team member
- [ ] Invited user receives email
- [ ] Invited user can signup
- [ ] Can update tenant settings
- [ ] Can update user profile
- [ ] Can create project
- [ ] Can add tasks to project
- [ ] Can view all tasks
- [ ] Can edit/delete project
- [ ] Can edit/delete task
- [ ] Can assign task to user
- [ ] Mobile responsive works
- [ ] Tablet responsive works

### Security Testing
- [ ] User A cannot see User B's tenants
- [ ] User A cannot see User B's projects
- [ ] User A cannot see User B's tasks
- [ ] MEMBER cannot invite users (permission denied)
- [ ] MEMBER cannot edit tenant settings
- [ ] Unauthenticated requests return 401
- [ ] Invalid tenant context returns 403

### Performance Testing
- [ ] Dashboard loads in <2s
- [ ] Projects list loads in <1s
- [ ] Tasks list loads in <1s
- [ ] No N+1 queries (check backend logs)
- [ ] API responses are cached appropriately

---

## 🐛 COMMON ISSUES & FIXES

### Issue: Port 3002 already in use
```bash
# Find and kill process
lsof -ti:3002 | xargs kill -9

# Or change port
# Edit package.json: "dev": "PORT=3003 next dev"
```

### Issue: Cannot find module errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Issue: Prisma Client out of sync
```bash
# Regenerate Prisma Client
npx prisma generate
```

### Issue: Database migration errors
```bash
# Reset database (CAUTION: deletes all data)
npx prisma migrate reset

# Or create new migration
npx prisma migrate dev --name fix_issue
```

### Issue: Tenant isolation not working
```bash
# Check middleware is applied
# Verify tenantId in JWT
# Check backend logs for tenant context
# Add console.log to middleware
```

### Issue: Components not rendering
```bash
# Check imports use @/ alias correctly
# Verify tsconfig paths
# Check for typos in component names
```

---

## 📚 USEFUL REFERENCES

- shadcn/ui docs: https://ui.shadcn.com
- TanStack Query: https://tanstack.com/query
- React Hook Form: https://react-hook-form.com
- Zod: https://zod.dev
- Tailwind CSS: https://tailwindcss.com
- Next.js 14: https://nextjs.org/docs

---

## 🎉 SUCCESS INDICATORS

You know it's working when:

1. ✅ You can login to http://localhost:3002
2. ✅ Dashboard shows tenant-specific stats
3. ✅ Sidebar has tenant menu (not admin menu)
4. ✅ You can create a project
5. ✅ You can add tasks to project
6. ✅ You can invite a team member
7. ✅ Different tenant users see different data
8. ✅ No console errors
9. ✅ Responsive on all devices
10. ✅ Professional quality (looks like a real app)

---

**Ready to implement? Follow WORKFLOW_TENANT_APP_BASE.md step by step!**
