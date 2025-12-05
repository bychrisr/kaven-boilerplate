#!/bin/bash

# Backend package.json
cat > production/backend/package.json << 'EOF'
{
  "name": "@kaven/backend",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext .ts",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@fastify/cors": "^9.0.1",
    "@fastify/helmet": "^11.1.1",
    "@fastify/jwt": "^8.0.0",
    "@fastify/rate-limit": "^9.1.0",
    "@prisma/client": "^5.10.0",
    "fastify": "^4.26.0",
    "ioredis": "^5.3.2",
    "prom-client": "^15.1.0",
    "winston": "^3.11.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "prisma": "^5.10.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3",
    "vitest": "^1.2.0"
  }
}
EOF

# Frontend package.json
cat > production/frontend/package.json << 'EOF'
{
  "name": "@kaven/frontend",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint",
    "test": "vitest"
  },
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.17.0",
    "@tanstack/react-table": "^8.11.0",
    "react-hook-form": "^7.49.0",
    "zustand": "^4.5.0",
    "zod": "^3.22.4",
    "tailwindcss": "^3.4.1",
    "lucide-react": "^0.309.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.3.3",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0",
    "vitest": "^1.2.0"
  }
}
EOF

# Shared package.json
cat > production/shared/package.json << 'EOF'
{
  "name": "@kaven/shared",
  "version": "2.0.0",
  "private": true,
  "main": "index.ts",
  "types": "index.ts",
  "dependencies": {
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
EOF

# Shared index.ts
cat > production/shared/index.ts << 'EOF'
export * from './types';
export * from './constants';
EOF

# Shared types/index.ts
cat > production/shared/types/index.ts << 'EOF'
// Shared TypeScript types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'USER';
  tenantId?: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
}
EOF

# Shared constants/index.ts
cat > production/shared/constants/index.ts << 'EOF'
// Shared constants
export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  TENANT_ADMIN: 'TENANT_ADMIN',
  USER: 'USER',
} as const;

export const TENANT_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  TRIAL: 'TRIAL',
} as const;
EOF

echo "✅ Package.json dos workspaces criados!"
