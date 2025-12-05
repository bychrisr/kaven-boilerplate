# Backend

Fastify-based REST API with Prisma ORM.

## Quick Start

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run tests
- `npm run db:studio` - Open Prisma Studio

## Structure

```
src/
├── modules/          # Feature modules
│   ├── auth/        # Authentication
│   ├── tenant/      # Multi-tenancy
│   └── admin/       # Admin panel
├── middleware/      # Custom middleware
├── utils/           # Utilities
└── server.ts        # Entry point
```

*Full implementation in Sprint 1-2*
