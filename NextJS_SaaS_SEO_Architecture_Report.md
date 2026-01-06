
# SEO & Indexing Architecture for SaaS Boilerplate (Next.js)

## Purpose of This Document
This document defines a **production-grade SEO, indexing, and crawl-control architecture** for a SaaS boilerplate built with **Next.js (App Router)**.

Audience:
- Software engineers
- Technical founders
- Platform architects

Goal:
- Ensure **public-facing pages rank aggressively**
- Ensure **admin/app surfaces are 100% invisible to search engines**
- Prevent irreversible SEO damage early
- Create a reusable, scalable, SEO-safe foundation

This is not marketing SEO. This is **systems SEO**.

---

## 1. Mental Model: Google as a Distributed Inference Engine

Google does not index pages.  
Google builds **probabilistic models of entities, intents, and trust**.

Your site feeds Google three categories of signals:
1. **Meaning** – what this thing is
2. **Utility** – what problem it solves
3. **Trust** – whether it deserves visibility

SEO architecture is about **signal hygiene**.

---

## 2. Surface Separation: Public vs Private

### 2.1 Two Logical Systems

You are not building one website.

You are building:
- **Public Knowledge Surface**
- **Private Application Surface**

These must be **architecturally isolated**.

| Surface | Indexable | Purpose |
|------|---------|--------|
| Marketing | Yes | Acquisition |
| Blog | Yes | Semantic authority |
| Docs | Yes | Technical authority |
| Pricing | Yes | Conversion |
| Auth | No | Gate |
| Admin/App | NO | Product usage |

---

## 3. Route Architecture (Next.js App Router)

### Recommended Structure

```
/app
 ├── (public)
 │   ├── page.tsx
 │   ├── pricing/
 │   ├── blog/
 │   ├── docs/
 │   ├── legal/
 │
 ├── (auth)
 │   ├── login/
 │   ├── register/
 │
 ├── (app)
 │   ├── dashboard/
 │   ├── settings/
 │   ├── billing/
 │   ├── users/
```

Route groups are **semantic boundaries**, not just folders.

---

## 4. Admin/App Surface: Zero Indexability Strategy

This section is **non-negotiable**.

### 4.1 Authentication as First Barrier

All app routes must:
- Require authentication
- Return `401` or `403` to unauthenticated requests

Bots do not authenticate.

---

### 4.2 Metadata-Level Blocking

Every admin layout must include:

```ts
export const metadata = {
  robots: {
    index: false,
    follow: false,
    noimageindex: true,
    nocache: true
  }
}
```

Metadata alone is insufficient, but mandatory.

---

### 4.3 HTTP-Level Blocking (Strongest Signal)

Add to all admin responses:

```
X-Robots-Tag: noindex, nofollow, noarchive
```

This overrides almost everything.

---

### 4.4 robots.txt (Defensive Layer)

```txt
User-agent: *
Disallow: /app/
Disallow: /admin/
Disallow: /dashboard/
```

robots.txt blocks crawling, **not indexing**.

Never rely on it alone.

---

### 4.5 Sitemap Exclusion

Admin routes must:
- Never appear in sitemap
- Never be internally linked from public pages

---

## 5. Public Surface SEO Architecture

### 5.1 Rendering Strategy

| Page Type | Strategy |
|---------|---------|
| Landing | SSG or SSR |
| Blog | SSG |
| Docs | SSG |
| Pricing | SSG |
| Admin | CSR / Streaming |

Public pages must:
- Render full HTML
- Be readable without JS

---

### 5.2 Metadata Strategy

Use `generateMetadata` per route.

Required:
- title
- description
- canonical
- robots
- OpenGraph
- Twitter

Admin pages must **never** use public metadata.

---

## 6. Structured Data (Schema.org)

Add **only** to public pages.

### Required Schemas
- Organization
- Website
- SoftwareApplication
- Product
- Article
- FAQPage
- BreadcrumbList

Never inject schema in admin layouts.

---

## 7. Sitemap Strategy

### Rules
- Only public URLs
- One canonical per page
- Updated automatically
- Exclude auth and app

### Advanced
- Separate sitemaps per content type
- Index sitemap for scale

---

## 8. Core Web Vitals Strategy

Public pages must meet:
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

Admin pages are irrelevant for CWV.

Optimize:
- TTFB
- HTML size
- Script deferral

---

## 9. Internal Linking Graph

Google evaluates **graph structure**, not menus.

Rules:
- No public → admin links
- Blog → product links
- Docs → feature links
- Breadcrumbs everywhere

Every important page ≤ 3 clicks from home.

---

## 10. Canonical & Duplication Control

Every public page must define:
- Self-referencing canonical
- No duplicate paths
- No query-based duplicates

Admin routes should never define canonicals.

---

## 11. Internationalization (Optional)

If used:
- hreflang only on public pages
- Separate URLs per locale
- Shared app/admin

---

## 12. Security & SEO Interactions

Avoid:
- Indexable error pages
- Stack traces in HTML
- Open directories

Errors should:
- Return correct HTTP codes
- Be noindex

---

## 13. Multi-Tenant SaaS Considerations

### Subdomains
- app.example.com → NOINDEX
- www.example.com → INDEX

### Customer Pages
- Only index if content is unique
- Otherwise noindex

---

## 14. Observability

Track:
- Index coverage
- Crawl stats
- CWV
- Sitemap errors

Admin errors are irrelevant.

---

## 15. Common Boilerplate SEO Failures

- Shared layouts between public and admin
- Sitemap auto-including all routes
- Admin accessible without auth
- robots.txt-only blocking
- Schema leakage into app

These failures compound over time.

---

## Final Principle

SEO is **not optimization**.

SEO is **damage prevention + signal clarity**.

A correct boilerplate:
- Makes mistakes impossible
- Makes good SEO the default
- Scales without regressions

This document is your guardrail.
