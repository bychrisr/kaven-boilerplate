# @kaven/cli

> Official CLI for Kaven Boilerplate v2.0

[![NPM Version](https://img.shields.io/npm/v/@kaven/cli.svg)](https://www.npmjs.com/package/@kaven/cli)
[![License](https://img.shields.io/npm/l/@kaven/cli.svg)](https://github.com/bychrisr/kaven-cli/blob/main/LICENSE)

---

## 📦 Installation

### Create New Project

```bash
# NPM
npx create-kaven-app my-saas

# PNPM (recommended)
pnpm create kaven-app my-saas

# Yarn
yarn create kaven-app my-saas
```

### Global Installation

```bash
npm install -g @kaven/cli
```

---

## 🚀 Commands

### `create-kaven-app`

Create a new Kaven project with interactive wizard.

```bash
npx create-kaven-app my-saas

# Or with global install
create-kaven-app my-saas
```

**Features:**
- ✅ Interactive project configuration
- ✅ Database selection (PostgreSQL/MySQL/MongoDB)
- ✅ Multi-tenancy toggle
- ✅ Payment gateway setup (Stripe/Mercado Pago)
- ✅ Optional modules selection
- ✅ Clean Git initialization (no Kaven history)
- ✅ Automatic dependency installation

---

### `kaven update`

Update your Kaven project to the latest version (non-destructive).

```bash
# Check for updates
pnpm kaven update --check

# Apply update
pnpm kaven update

# Force update (skip uncommitted changes check)
pnpm kaven update --force
```

**Features (Phase 4 - Coming Soon):**
- Version detection
- Schema diff analysis
- Intelligent file merging
- Migration application
- Git branch creation for review
- Rollback support

---

### `kaven module`

Manage optional modules.

```bash
# List all modules
pnpm kaven module list

# Add a module
pnpm kaven module add analytics

# Remove a module
pnpm kaven module remove ai-assistant
```

**Available Modules:**
- `payments-stripe` - Stripe integration
- `payments-mercadopago` - Mercado Pago integration
- `analytics` - Analytics & tracking
- `ai-assistant` - AI-powered features
- `notifications` - Email/SMS/Push notifications

---

## 🛠️ Development

### Setup

```bash
# Clone repository
git clone https://github.com/bychrisr/kaven-cli.git
cd kaven-cli

# Install dependencies
pnpm install

# Build
pnpm build

# Test locally
npm link

# Now you can use it
create-kaven-app test-project
```

### Project Structure

```
kaven-cli/
├── bin/                        # Entry points
│   ├── create-kaven-app.js
│   └── kaven.js
├── src/
│   ├── commands/               # CLI commands
│   │   ├── create.ts          # Installation
│   │   ├── update.ts          # Updates
│   │   └── module.ts          # Module management
│   ├── utils/                  # Utilities
│   │   ├── logger.ts          # Colored logging
│   │   ├── git.ts             # Git operations
│   │   └── fs.ts              # File system
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   └── index.ts               # Main entry
├── templates/                  # Config templates
│   └── kaven.config.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📋 Roadmap

### ✅ Phase 1: CLI Basics (Weeks 1-2) - **IN PROGRESS**
- [x] Package structure
- [x] `create-kaven-app` command
- [x] Interactive wizard
- [x] Git initialization
- [ ] NPM publication

### 🔄 Phase 2: Modules (Weeks 3-4)
- [ ] Module registry
- [ ] `kaven module add`
- [ ] `kaven module remove`
- [ ] Dependency management

### 🔄 Phase 3: Schema (Weeks 5-6)
- [ ] Schema merger
- [ ] Base + Extended schemas
- [ ] Auto-merge on generate

### 🔄 Phase 4: Updates (Weeks 7-8)
- [ ] Version detection
- [ ] Schema diff analyzer
- [ ] Intelligent file merger
- [ ] Migration runner

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

---

## 📄 License

MIT © Chris (@bychrisr)

---

## 🔗 Links

- [Kaven Boilerplate](https://github.com/bychrisr/kaven-boilerplate)
- [Documentation](https://docs.kaven.dev)
- [NPM Package](https://www.npmjs.com/package/@kaven/cli)
- [Issues](https://github.com/bychrisr/kaven-cli/issues)

---

**Made with ❤️ by Chris**
