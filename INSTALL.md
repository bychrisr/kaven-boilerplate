# 🚀 Installation Guide

## Quick Start (5 minutes)

### 1. Use This Template

1. Click "Use this template" on GitHub
2. Create your repository
3. Clone locally:

```bash
git clone git@github.com:YOUR_USERNAME/your-project.git
cd your-project
```

### 2. Install Dependencies

```bash
npm install
```

This will install dependencies for:
- Root workspace
- Backend
- Frontend
- Shared

### 3. Setup Environment

```bash
cp .env.example .env
```

**Edit `.env` with your credentials:**

```bash
# Generate secure secrets
openssl rand -hex 32  # JWT_SECRET
openssl rand -hex 32  # JWT_REFRESH_SECRET
openssl rand -hex 32  # ENCRYPTION_KEY
```

### 4. Start Infrastructure

```bash
npm run docker:up
```

Wait ~30 seconds for services to be ready.

**Verify services:**
```bash
docker ps
```

You should see:
- kaven-postgres
- kaven-redis
- kaven-prometheus
- kaven-grafana

### 5. Setup Database

```bash
npm run prisma:migrate
npm run prisma:seed
```

### 6. Start Development

```bash
npm run dev
```

**Access:**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- Grafana: http://localhost:3000 (admin/admin)
- Prometheus: http://localhost:9090

### 7. Login

```
Email: admin@kaven.local
Password: Password123!
```

## Next Steps

1. Read [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
2. Explore the admin panel
3. Check Grafana dashboards
4. Start building your SaaS!

## Troubleshooting

### Port Already in Use

```bash
# Stop all Docker containers
npm run docker:down

# Check ports
lsof -i :3000  # Backend
lsof -i :3001  # Frontend
lsof -i :5432  # PostgreSQL
```

### Database Connection Error

```bash
# Restart PostgreSQL
docker restart kaven-postgres

# Check logs
docker logs kaven-postgres
```

### Prisma Errors

```bash
# Regenerate Prisma client
cd production/backend
npx prisma generate

# Reset database
npx prisma migrate reset
```

## Support

- [Documentation](docs/)
- [GitHub Issues](https://github.com/bychrisr/kaven-boilerplate/issues)
- [Discussions](https://github.com/bychrisr/kaven-boilerplate/discussions)
