# Architecture Documentation

> **Version:** 2.0.0  
> **Last Updated:** 2025-12-05  
> **Status:** Draft - To be completed in Sprint 1-2

## System Overview

Kaven Boilerplate follows a **modular monolith** architecture with clear separation of concerns:

- **Backend API** (Fastify + Prisma)
- **Frontend UI** (Next.js + shadcn/ui)
- **Infrastructure** (Docker Compose + Observability)

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Auth UI    │  │  Admin Panel │  │  Dashboard   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
                            │ tRPC + Zod
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    BACKEND (Fastify)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Auth Module │  │ Tenant Module│  │ Admin Module │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │           Observability (Prometheus)              │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ PostgreSQL   │  │    Redis     │  │   Grafana    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

### Backend
- **Runtime:** Node.js 20
- **Framework:** Fastify 4
- **ORM:** Prisma 5
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Validation:** Zod

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** shadcn/ui + Tailwind CSS 4
- **State:** Zustand
- **Data Fetching:** TanStack Query v5
- **Forms:** React Hook Form + Zod

### Observability
- **Metrics:** Prometheus
- **Dashboards:** Grafana
- **Logging:** Winston (structured JSON)

## Database Schema

**To be documented in Sprint 1-2 (Task B3)**

Key models:
- Tenant
- User
- RefreshToken
- AuditLog
- SystemConfig

## Multi-Tenancy Strategy

**Approach:** Shared Database + Row-Level Security (RLS)

**To be documented in Sprint 1-2 (Task B3)**

## Authentication Flow

**Methods:**
1. Email/Password + JWT
2. 2FA TOTP (Google Authenticator)
3. Magic Link (passwordless)

**To be documented in Sprint 1-2 (Task B4)**

## Observability

**Metrics collected:**
- HTTP request duration
- Request rate (per endpoint)
- Active users (per tenant)
- Database query duration

**To be documented in Sprint 1-2 (Task B6)**

## Security

- **Encryption:** AES-256-CBC for sensitive data
- **CSRF Protection:** Token-based
- **XSS Prevention:** Input sanitization
- **Rate Limiting:** Per IP, per user, per endpoint
- **RBAC:** Role-based access control

**To be documented in Sprint 1-2 (Task B4)**

## Deployment Strategy

**Environments:**
1. Development (local Docker Compose)
2. Staging (Docker Compose on VPS)
3. Production (Docker Compose or cloud)

**To be documented in Sprint 1-2 (Task B7)**

---

**Next Steps:**
- Complete database schema design (Task B3)
- Document authentication flows (Task B4)
- Add deployment diagrams (Task B7)
