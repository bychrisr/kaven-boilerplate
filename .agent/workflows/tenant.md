---
description: Implementação completa do Tenant App (Setup, Spaces, Core Pages)
---

# Workflow: Tenant App Implementation

> **Reference:** `TENANT_APP_ARCHITECTURE.md` (Source of Truth)
> **Goal:** Create a standalone Tenant App with native Spaces support.

## Phase 0: Stabilization & Hardcoding Audit

> **Context:** Eliminate hardcoded values (ports, URLs) before scaling.

1. **Audit & Refactor**
   - [ ] Read `TENANT_APP_ARCHITECTURE.md` (Section: Phase 0 Stabilization)
   - [ ] Update `.env.example` across all apps
   - [ ] Refactor `apps/admin` (avatars, configs) to use ENV
   - [ ] Refactor `apps/api` (CORS) to use ENV
   - [ ] Verify no hardcoded `localhost:3000/3002` remain

## Phase 1: Foundation & Identity

> **Context:** Setup separate Next.js app for tenants (port 3001).

1. **Setup Structure**
   - [ ] Read `TENANT_APP_ARCHITECTURE.md` (Section: Phase 1 Setup)
   - [ ] Clone `apps/admin` to `apps/tenant`
   - [ ] Update `package.json` (name="tenant", port=3001)
   - [ ] Strip admin-only routes (`/users`, `/tenants`, `/audit-logs`)

2. **Configure Identity**
   - [ ] Update `tailwind.config.ts` (Set Primary Color: Purple)
   - [ ] Update `lib/config.ts` (APP_NAME="Kaven Tenant")
   - [ ] Verify `pnpm dev` runs on port 3001

## Phase 2: Navigation & Space Awareness

> **Context:** Implement Spaces as first-class navigation elements.

3. **Backend Seed (Prerequisite)**
   - [ ] Update `seed.ts` to include Global Spaces (Finance, Marketing, etc)
   - [ ] Run seed to populate DB

4. **Tenant Header & Sidebar**
   - [ ] Create `TenantSidebar` (Filter menus by active Space)
   - [ ] Create `TenantHeader` with `SpaceSelector` component
   - [ ] Implement `useSpace` hook (persist active space)
   - [ ] Wrap layout in `SpaceProvider`

## Phase 3: Core Features (Space-Scoped)

> **Context:** Adapt core pages to respect the selected Space.

5. **Team Management**
   - [ ] Create `apps/tenant/app/(dashboard)/team/page.tsx`
   - [ ] Update `InviteMemberDialog`: Add Multi-Select for Spaces
   - [ ] Implement `RequireSpace` guard for routes

6. **Settings & Space Management**
   - [ ] Create `apps/tenant/app/(dashboard)/settings/spaces/page.tsx`
   - [ ] Implement CRUD for Spaces (Tenant Admin only)
   - [ ] Implement Default Permissions editor per Space

7. **Dashboard**
   - [ ] Adapt Dashboard stats to filter by `activeSpace`

## Phase 4: Demo Features

> **Context:** Show developers how to build features.

8. **Projects Module**
   - [ ] Create Backend Module `apps/api/src/modules/projects`
   - [ ] Create Frontend Page `apps/tenant/app/(dashboard)/demo/projects`
   - [ ] Ensure all queries use `where: { spaceId: activeSpace }`

## Phase 5: Documentation

> **Context:** Ensure implementation is fully documented.

9. **Generate Documentation**
   - [ ] Run slash command: `/document`

## Critical Rules

- **Look Before Leaping:** Always read the relevant section in `TENANT_APP_ARCHITECTURE.md` before coding.
- **Space Isolation:** Every feature MUST check `activeSpace` context.
- **Validation:** Verify `3001` (Tenant) vs `3000` (Admin) isolation.
