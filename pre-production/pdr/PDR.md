# Product Design Requirements (PDR) - Kaven Boilerplate v2.0.0

> **Version:** 1.0.0  
> **Date:** 2025-12-05  
> **Type:** Boilerplate Template  
> **Objective:** Business (Multi-tenant SaaS)  
> **Author:** Chris (@bychrisr)

---

## Section 1: Overview

**Product Name:** Kaven Boilerplate

**Vision Statement:**
Enterprise-grade SaaS boilerplate that accelerates development of multi-tenant applications with built-in authentication, admin panel, and observability.

**Target Users:**
- SaaS founders building new products
- Development teams needing production-ready foundation
- Entrepreneurs launching B2B/B2C applications

**Core Value Proposition:**
Skip 2-4 weeks of boilerplate development and start building features on Day 1 with a battle-tested, secure, and scalable foundation.

**Problem Being Solved:**
Every SaaS project reinvents the wheel: auth, multi-tenancy, admin panel, observability. This wastes time and introduces security risks from inexperienced implementations.

---

## Section 2: User Stories

### Super Admin
- As a **super admin**, I want to **manage all tenants** so that **I can oversee the entire platform**
- As a **super admin**, I want to **view system-wide analytics** so that **I can monitor platform health**
- As a **super admin**, I want to **view audit logs** so that **I can track all system changes**
- As a **super admin**, I want to **configure system settings** so that **I can control platform behavior**

### Tenant Admin
- As a **tenant admin**, I want to **manage users in my organization** so that **I can control access**
- As a **tenant admin**, I want to **view my tenant's analytics** so that **I can track usage**
- As a **tenant admin**, I want to **configure tenant settings** so that **I can customize my workspace**
- As a **tenant admin**, I want to **invite new users** so that **I can grow my team**

### Regular User
- As a **user**, I want to **register with email** so that **I can create an account**
- As a **user**, I want to **verify my email** so that **I can activate my account**
- As a **user**, I want to **login with password** so that **I can access the platform**
- As a **user**, I want to **enable 2FA** so that **I can secure my account**
- As a **user**, I want to **reset my password** so that **I can recover access**
- As a **user**, I want to **update my profile** so that **I can manage my information**

### Developer (Using Boilerplate)
- As a **developer**, I want to **clone the boilerplate** so that **I can start a new project**
- As a **developer**, I want to **run migrations** so that **I can setup the database**
- As a **developer**, I want to **see working examples** so that **I can learn the patterns**
- As a **developer**, I want to **view metrics in Grafana** so that **I can monitor my app**

---

## Section 3: Features & Requirements

### 3.1 Core Features (MVP)

**Authentication & Authorization:**
- ✅ Email/Password registration
- ✅ Email verification (magic link)
- ✅ Login with JWT + Refresh Token
- ✅ 2FA TOTP (Google Authenticator)
- ✅ Password reset flow
- ✅ Session management
- ✅ Role-Based Access Control (RBAC)

**Multi-Tenancy:**
- ✅ Tenant model (organization/workspace)
- ✅ User-Tenant association (many-to-many)
- ✅ Row-Level Security (RLS) via Prisma middleware
- ✅ Tenant context in all queries
- ✅ Isolated data per tenant

**Admin Panel:**
- ✅ Dashboard with analytics
- ✅ User management (CRUD)
- ✅ Tenant management (CRUD)
- ✅ Audit log viewer
- ✅ System configuration

**Observability:**
- ✅ Prometheus metrics exposed
- ✅ Grafana dashboards (System, Tenant, Performance)
- ✅ Structured logging (Winston)
- ✅ Health checks endpoint
- ✅ Request tracing

**Security:**
- ✅ AES-256-CBC encryption (2FA secrets, backup codes)
- ✅ Rate limiting (per IP, per user, per endpoint)
- ✅ CSRF protection
- ✅ XSS prevention (input sanitization)
- ✅ SQL injection prevention (Prisma)
- ✅ Secure password hashing (bcrypt)

### 3.2 Nice-to-Have Features (Post-MVP)

- Magic link login (passwordless)
- OAuth providers (Google, GitHub)
- Email templates (Handlebars)
- Notification system (in-app + email)
- Export data (JSON, CSV)
- API rate limiting dashboard
- Advanced RBAC (permissions per resource)

---

## Section 4: User Flows

### 4.1 Registration Flow

```
1. User visits /register
2. Fills form (name, email, password, company name)
3. Submits → Backend creates:
   - Tenant (company)
   - User (as TENANT_ADMIN)
   - Sends verification email
4. User clicks email link → Email verified
5. Redirected to /login
6. Login → Redirected to /dashboard
```

### 4.2 Login Flow

```
1. User visits /login
2. Enters email + password
3. If 2FA enabled:
   → Prompt for TOTP code
   → Validate code
4. Backend generates:
   - Access token (JWT, 1h)
   - Refresh token (7 days)
5. Redirected to /dashboard
```

### 4.3 Admin User Management Flow

```
1. Tenant Admin visits /admin/users
2. Views table of users in their tenant
3. Clicks "Add User"
4. Fills form (name, email, role)
5. Backend creates User + sends invite email
6. New user clicks invite → Sets password → Active
```

### 4.4 Super Admin Tenant Management Flow

```
1. Super Admin visits /admin/tenants
2. Views table of all tenants
3. Can:
   - Create new tenant
   - Edit tenant (name, status)
   - Suspend tenant (all users lose access)
   - View tenant analytics
```

---

## Section 5: Wireframes & UI

**Design Reference:** [Minimals Dashboard](https://minimals.cc/dashboard) - Modern, clean, shadcn/ui aesthetic

### 5.1 Login Page
- Centered card
- Logo + "Welcome back"
- Email + Password fields
- "Forgot password?" link
- "Don't have an account? Register"
- 2FA code input (conditional)

### 5.2 Dashboard (Tenant Admin)
- Sidebar navigation (Dashboard, Users, Settings)
- Top navbar (breadcrumbs, profile dropdown)
- 4 metric cards (Total Users, Active Sessions, Today's Activity, Growth %)
- Chart: Users over time (line chart)
- Recent activity table

### 5.3 Admin - Users Table
- Search bar
- Filters (Role, Status)
- Table columns: Name, Email, Role, Status, Created At, Actions
- Actions: Edit, Delete, Suspend
- Pagination
- "Add User" button (top right)

### 5.4 Admin - Tenants Table (Super Admin Only)
- Search bar
- Filters (Status, Plan)
- Table columns: Name, Users Count, Created At, Status, Actions
- Actions: View Details, Edit, Suspend
- "Create Tenant" button

---

## Section 6: Data Models

### 6.1 Core Entities

**Tenant**
- id (UUID)
- name (String)
- slug (String, unique)
- status (ACTIVE, SUSPENDED)
- settings (JSON)
- createdAt, updatedAt

**User**
- id (UUID)
- email (String, unique)
- passwordHash (String)
- name (String)
- role (SUPER_ADMIN, TENANT_ADMIN, USER)
- emailVerified (Boolean)
- emailVerifiedAt (DateTime?)
- twoFactorEnabled (Boolean)
- twoFactorSecret (String?, encrypted)
- createdAt, updatedAt

**UserTenant** (Junction Table)
- id (UUID)
- userId (UUID, FK)
- tenantId (UUID, FK)
- role (TENANT_ADMIN, MEMBER)
- createdAt

**RefreshToken**
- id (UUID)
- userId (UUID, FK)
- token (String, unique)
- expiresAt (DateTime)
- createdAt

**AuditLog**
- id (UUID)
- tenantId (UUID?, FK) - null for system events
- userId (UUID?, FK)
- action (String) - e.g., "user.created", "tenant.suspended"
- entityType (String) - e.g., "User", "Tenant"
- entityId (String)
- changes (JSON)
- ipAddress (String)
- userAgent (String)
- createdAt

**SystemConfig**
- id (UUID)
- key (String, unique)
- value (JSON)
- description (String)
- updatedBy (UUID, FK → User)
- updatedAt

### 6.2 Relationships

```
Tenant 1:N UserTenant N:1 User
User 1:N RefreshToken
User 1:N AuditLog
Tenant 1:N AuditLog
```

### 6.3 Multi-Tenancy Strategy

**Approach:** Shared Database + Row-Level Security (RLS)

**Implementation:**
- Prisma middleware intercepts all queries
- Automatically adds `WHERE tenantId = currentTenantId`
- Exception: Super Admin can query across tenants
- Tenant context stored in request (extracted from JWT)

---

## Section 7: API Contracts

### 7.1 Authentication Endpoints

**POST /api/auth/register**
```typescript
Request: {
  name: string
  email: string
  password: string
  companyName: string
}
Response: {
  message: "Verification email sent"
}
```

**POST /api/auth/login**
```typescript
Request: {
  email: string
  password: string
  totpCode?: string
}
Response: {
  accessToken: string
  refreshToken: string
  user: { id, email, name, role }
}
```

**POST /api/auth/refresh**
```typescript
Request: {
  refreshToken: string
}
Response: {
  accessToken: string
}
```

**POST /api/auth/logout**
```typescript
Request: {
  refreshToken: string
}
Response: {
  message: "Logged out successfully"
}
```

### 7.2 User Endpoints

**GET /api/users**
```typescript
Query: {
  page?: number
  limit?: number
  search?: string
  role?: string
}
Response: {
  users: User[]
  total: number
  page: number
  totalPages: number
}
```

**POST /api/users**
```typescript
Request: {
  name: string
  email: string
  role: "TENANT_ADMIN" | "USER"
}
Response: {
  user: User
}
```

**PATCH /api/users/:id**
```typescript
Request: {
  name?: string
  role?: string
  status?: string
}
Response: {
  user: User
}
```

**DELETE /api/users/:id**
```typescript
Response: {
  message: "User deleted"
}
```

### 7.3 Admin Endpoints (Super Admin)

**GET /api/admin/tenants**
```typescript
Response: {
  tenants: Tenant[]
  total: number
}
```

**POST /api/admin/tenants**
```typescript
Request: {
  name: string
  slug: string
}
Response: {
  tenant: Tenant
}
```

**GET /api/admin/audit-logs**
```typescript
Query: {
  page?: number
  limit?: number
  tenantId?: string
  userId?: string
  action?: string
}
Response: {
  logs: AuditLog[]
  total: number
}
```

---

## Section 8: Business Rules

### 8.1 Authentication Rules

1. **Password Requirements:**
   - Minimum 8 characters
   - At least 1 uppercase, 1 lowercase, 1 number
   - No common passwords (check against list)

2. **Email Verification:**
   - Required before login
   - Verification link expires in 24h
   - Can resend verification email (rate limited)

3. **2FA Rules:**
   - Optional but recommended
   - TOTP codes expire after 30 seconds
   - Backup codes generated on 2FA enable (10 codes)
   - Cannot disable 2FA without backup code

4. **Session Management:**
   - Access token expires in 1 hour
   - Refresh token expires in 7 days
   - Refresh token rotation on use
   - Max 5 active sessions per user

### 8.2 Multi-Tenancy Rules

1. **Tenant Isolation:**
   - Users can only see data from their tenant(s)
   - Super Admin can see all tenants
   - Cross-tenant queries blocked at DB level

2. **User-Tenant Association:**
   - User can belong to multiple tenants
   - Each association has a role (TENANT_ADMIN, MEMBER)
   - Tenant context required in all API requests (from JWT)

3. **Tenant Status:**
   - ACTIVE: Normal operation
   - SUSPENDED: Users cannot login
   - Suspend cascades to all users in tenant

### 8.3 Admin Panel Rules

1. **User Management:**
   - Tenant Admin can only manage users in their tenant
   - Cannot delete themselves
   - Cannot change own role
   - Super Admin can manage all users

2. **Audit Logging:**
   - All CUD operations logged (Create, Update, Delete)
   - Logs immutable (cannot be deleted/edited)
   - Super Admin can see all logs
   - Tenant Admin sees only their tenant's logs

---

## Section 9: Security & Compliance

### 9.1 Security Measures

**Encryption:**
- AES-256-CBC for sensitive data (2FA secrets, backup codes)
- HTTPS required in production
- Bcrypt (cost factor 12) for passwords

**Rate Limiting:**
- Login: 5 attempts per 15 minutes (per IP)
- Registration: 3 attempts per hour (per IP)
- API: 100 requests per 15 minutes (per user)
- Password reset: 3 requests per hour (per IP)

**Headers:**
- CSRF tokens required for state-changing operations
- CSP headers configured
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff

**Input Validation:**
- Zod schemas for all inputs
- SQL injection prevented by Prisma
- XSS prevented by sanitization

### 9.2 Compliance (GDPR Ready)

**Data Access:**
- Users can export their data (JSON)
- Users can delete their account
- Audit logs show all data access

**Data Retention:**
- Audit logs: 1 year retention
- Deleted users: Soft delete, anonymize after 30 days
- Refresh tokens: Purge expired tokens daily

---

## Section 10: Tech Stack

```yaml
backend:
  runtime: Node.js 20
  framework: Fastify 4
  orm: Prisma 5
  database: PostgreSQL 16
  cache: Redis 7
  validation: Zod
  
frontend:
  framework: Next.js 14
  ui_library: shadcn/ui
  styling: Tailwind CSS 4
  state: Zustand
  data_fetching: TanStack Query v5
  forms: React Hook Form
  charts: Recharts
  tables: TanStack Table v8

observability:
  metrics: Prometheus
  dashboards: Grafana
  logging: Winston
  
devops:
  containerization: Docker Compose
  ci_cd: GitHub Actions
  
security:
  jwt: @fastify/jwt
  encryption: Node.js crypto
  rate_limiting: @fastify/rate-limit
```

---

## Section 11: Performance Requirements

### 11.1 Response Times

- API endpoints: < 200ms (p95)
- Login: < 500ms
- Dashboard load: < 1s
- Table pagination: < 300ms

### 11.2 Scalability

- Support 1000+ tenants
- Support 10,000+ users per tenant
- Database: Indexed queries on tenantId, userId
- Caching: Redis for session data

### 11.3 Availability

- Target: 99.9% uptime
- Health checks: /health, /ready
- Graceful degradation if Redis down

---

## Section 12: Dependencies & Integrations

### 12.1 External Services

**Email (Required):**
- SMTP server for transactional emails
- Templates: Verification, Password Reset, User Invite
- Provider examples: SendGrid, AWS SES, Resend

**Monitoring (Optional):**
- Sentry for error tracking
- LogRocket for session replay

### 12.2 Future Integrations

- Stripe (payments)
- OAuth providers (Google, GitHub, Microsoft)
- S3 (file uploads)
- Twilio (SMS 2FA)

---

## Section 13: Roadmap

### Week 1-2: Foundation (Sprint 1-2) - 67h

**Database & Schema (8h):**
- Prisma schema with multi-tenant models
- Migrations
- Seed script (super admin + demo tenant)

**Backend - Auth Module (12h):**
- Registration + email verification
- Login + JWT + Refresh Token
- 2FA TOTP
- Password reset

**Backend - Admin Module (16h):**
- User CRUD (tenant-scoped)
- Tenant CRUD (super admin only)
- Audit log recording
- System config management

**Frontend - Auth Pages (8h):**
- Login, Register, Verify Email, Reset Password, 2FA Setup

**Frontend - Admin Panel (12h):**
- Dashboard with charts
- Users table (TanStack Table)
- Tenants table (Super Admin)
- Audit logs viewer
- System config form

**Observability (6h):**
- Prometheus metrics endpoint
- Grafana dashboards (3 dashboards)
- Winston structured logging
- Health checks

**DevOps (6h):**
- Docker Compose (dev, staging, prod)
- GitHub Actions CI
- Deployment scripts

### Week 3-4: Refinement (Post-Sprint 1-2)

- Testing (unit + integration)
- Documentation improvements
- Bug fixes
- Performance optimization

### Week 5-6: Advanced Features

- Magic link login
- OAuth providers
- Email templates
- Notification system

---

## Section 14: Success Metrics

### For Boilerplate Users (Developers)

**Time-to-First-Deploy:**
- Target: < 2 hours from clone to deployed
- Measure: Time from `git clone` to working app on staging

**Developer Satisfaction:**
- Target: 4.5/5 stars on GitHub
- Measure: GitHub stars, feedback, issues

**Code Quality:**
- Target: 90%+ test coverage
- Target: 0 critical vulnerabilities (Snyk)
- Target: A grade on security headers (securityheaders.com)

### For End Users (Built with Boilerplate)

**Authentication Success Rate:**
- Target: > 99% successful logins
- Track: Failed login attempts / Total attempts

**Performance:**
- Target: < 200ms API response time (p95)
- Target: < 1s dashboard load time

**Security:**
- Target: 0 security incidents in first 6 months
- Target: 100% of accounts using 2FA (for admins)

---

## Section 15: Risks & Mitigation

### Technical Risks

**Risk 1: Multi-Tenancy RLS Performance**
- Impact: High
- Mitigation: Database indexes on tenantId, query performance monitoring
- Contingency: Move to separate databases per tenant (schema-per-tenant)

**Risk 2: Prisma Middleware Overhead**
- Impact: Medium
- Mitigation: Benchmark queries, optimize middleware logic
- Contingency: Custom Prisma Client extension

**Risk 3: JWT Security (Refresh Token Rotation)**
- Impact: High
- Mitigation: Implement token rotation, short access token TTL
- Contingency: Move to session-based auth with Redis

### Adoption Risks

**Risk 4: Complex Setup for Beginners**
- Impact: Medium
- Mitigation: Detailed INSTALL.md, video tutorial
- Contingency: One-click deploy templates (Railway, Render)

**Risk 5: Missing Features Users Expect**
- Impact: Medium
- Mitigation: User research, GitHub discussions
- Contingency: Roadmap with requested features

---

## Appendix A: Environment Variables

See `.env.example` in repository for complete list (50+ variables).

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret for signing access tokens
- `JWT_REFRESH_SECRET`: Secret for signing refresh tokens
- `ENCRYPTION_KEY`: 32-byte key for AES-256-CBC
- `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASSWORD`: SMTP config
- `CORS_ORIGIN`: Allowed origins for CORS

---

## Appendix B: Development Commands

```bash
# Install dependencies
npm install

# Start infrastructure
npm run docker:up

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Start development
npm run dev

# Run tests
npm test

# Build for production
npm run build

# View metrics
npm run telemetry:analyze
```

---

## Appendix C: Testing Strategy

**Unit Tests (Vitest):**
- Business logic functions
- Utility functions
- Validation schemas

**Integration Tests:**
- API endpoints (all routes)
- Database operations (CRUD)
- Multi-tenancy isolation
- Authentication flows

**E2E Tests (Playwright):**
- Registration flow
- Login flow
- Admin user management
- Dashboard loading

**Security Tests:**
- OWASP Top 10 checks
- SQL injection attempts
- XSS attempts
- CSRF validation

---

**End of PDR**

---

## Metadata

**Document Type:** Product Design Requirements  
**Target Audience:** Development team, workflows, stakeholders  
**Maintenance:** Updated as boilerplate evolves  
**Related Docs:** 
- B0_COMPLETE_RESEARCH.md (technical research)
- ROADMAP_v2.0.0.md (project timeline)
- README.md (user-facing overview)

**Changelog:**
- v1.0.0 (2025-12-05): Initial PDR for boilerplate workflow input
