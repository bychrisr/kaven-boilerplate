# Changelog

All notable changes to @kaven/cli will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-12-18

### Added

#### Phase 1: CLI Basics (Weeks 1-2)
- ✅ Initial CLI structure with TypeScript
- ✅ `create-kaven-app` command
- ✅ Interactive wizard for project configuration
  - Database selection (PostgreSQL/MySQL/MongoDB)
  - Multi-tenancy toggle
  - Payment gateway selection (Stripe/Mercado Pago)
  - Optional modules selection (Analytics, AI, Notifications)
- ✅ Template download via degit
- ✅ Automatic config generation (kaven.config.json)
- ✅ Automatic .env file creation
- ✅ Git initialization (clean, no Kaven history)
- ✅ Module cleanup based on selections
- ✅ Colored logging with ora spinners
- ✅ Git utilities (init, commit, branch management)
- ✅ File system utilities (config reading/writing)

#### Stub Commands (To be implemented in future phases)
- 🔄 `kaven update` (Phase 4)
- 🔄 `kaven module add` (Phase 2)
- 🔄 `kaven module remove` (Phase 2)
- ✅ `kaven module list` (basic version)

### Documentation
- ✅ Comprehensive README.md
- ✅ MIT License
- ✅ TypeScript configuration
- ✅ Project structure documentation

### Technical
- TypeScript 5.3+
- ESM modules
- Node.js 18+
- Dependencies:
  - commander (CLI framework)
  - inquirer (interactive prompts)
  - chalk (colored output)
  - ora (loading spinners)
  - degit (template download)
  - execa (process execution)
  - fs-extra (file operations)

## [Unreleased]

### Phase 2: Modules (Weeks 3-4)
- [ ] Module registry system
- [ ] Full `kaven module add` implementation
- [ ] Full `kaven module remove` implementation
- [ ] Dependency management
- [ ] Migration application for modules

### Phase 3: Schema (Weeks 5-6)
- [ ] Schema merger (base + extended → final)
- [ ] Prisma hook integration
- [ ] Schema validation

### Phase 4: Updates (Weeks 7-8)
- [ ] Version detection (GitHub API)
- [ ] Schema diff analyzer
- [ ] Intelligent file merger
- [ ] Migration runner
- [ ] Git branch creation for updates
- [ ] Breaking change detection

---

**Legend:**
- ✅ Implemented
- 🔄 Stub/Placeholder
- [ ] Not yet implemented

[2.0.0]: https://github.com/bychrisr/kaven-cli/releases/tag/v2.0.0
