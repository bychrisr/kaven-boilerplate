# Development Guide

> **Version:** 2.0.0  
> **Last Updated:** 2025-12-05

## Prerequisites

- Node.js 20+
- npm 10+
- Docker & Docker Compose
- Git

## Setup

### 1. Clone Repository

```bash
git clone git@github.com:YOUR_USERNAME/your-project.git
cd your-project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 4. Start Infrastructure

```bash
npm run docker:up
```

### 5. Run Migrations

```bash
npm run prisma:migrate
npm run prisma:seed
```

### 6. Start Development

```bash
npm run dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start backend + frontend |
| `npm run build` | Build all workspaces |
| `npm test` | Run all tests |
| `npm run lint` | Lint all workspaces |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run docker:up` | Start Docker services |
| `npm run docker:down` | Stop Docker services |
| `npm run telemetry:analyze` | Analyze workflow metrics |

## Project Structure

See [README.md](../README.md#-project-structure)

## Testing

### Backend

```bash
cd production/backend
npm test
npm run test:coverage
```

### Frontend

```bash
cd production/frontend
npm test
```

## Debugging

### VS Code

See `.vscode/launch.json` for debug configurations.

### Chrome DevTools

Backend runs on port 3000 with Node.js inspector.

---

**Next Steps:** Complete implementation guide in Sprint 1-2
