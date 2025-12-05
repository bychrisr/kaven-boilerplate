---
description: "Kaven Phase 1.4 - Generate tRPC contracts from PDR + schema (with telemetry)"
---

# PDR to Contracts (Instrumented)

You are generating tRPC API contracts with Zod validation.
**This workflow automatically tracks execution metrics.**

## STEP 0: INITIALIZE TELEMETRY 🔍

// turbo
echo '{
  "timestamp_start": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
  "workflow_name": "contracts",
  "task_description": "Generate tRPC contracts with Zod validation",
  "files_created": [],
  "files_modified": [],
  "commands_executed": [],
  "success": true,
  "agent_mode": "plan"
}' > .agent/telemetry/current_execution.json

// Track command
// turbo
jq '.commands_executed += ["echo {...} > .agent/telemetry/current_execution.json"]' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json && mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

## Prerequisites:

1. Verify that `PDR.md` exists.
2. Verify that `schema.prisma` exists.
3. Read PDR Section 5: User Stories.
4. Read `schema.prisma` to understand models.

## Steps:

**CRITICAL for SQLite:** If schema.prisma uses String fields for enums (due to SQLite limitation), you MUST create Zod enums to enforce validation at the application level. This is the ONLY way to prevent invalid values in SQLite databases.

1. For EACH model in `schema.prisma`, generate tRPC router with:
   - CREATE mutation (input: Zod schema with required fields)
   - READ query: `getAll` (with filters) + `getById`
   - UPDATE mutation (input: partial Zod schema)
   - DELETE mutation (input: id only)

2. Generate Zod schemas for validation:
   - CreateSchema: all required fields + optional fields
   - UpdateSchema: CreateSchema.partial() (all fields optional)
   - GetAllSchema: filters (status, search, dates)

3. Use Prisma types for type safety.

## Contract Structure:

**IMPORTANT - Prisma Client Singleton:**
Before creating routers, ensure tRPC context uses singleton pattern:

```typescript
// src/server/trpc/trpc.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const createTRPCContext = async () => {
  return { prisma };
};
```

// Track file creation
// turbo
jq '.files_created += ["src/server/trpc/trpc.ts"]' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json && mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

Then create routers:

```typescript
import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

// Enums (if any in schema)
export const EntityStatus = z.enum(['VALUE1', 'VALUE2']);

// Schemas
export const CreateEntitySchema = z.object({
  field1: z.string().min(1).max(200),  // ALWAYS add max length
  field2: z.string().optional(),
  status: EntityStatus.default('VALUE1'),
});

export const UpdateEntitySchema = CreateEntitySchema.partial();

export const GetEntitiesSchema = z.object({
  status: EntityStatus.optional(),
  search: z.string().optional(),
});

// Router
export const entityRouter = router({
  // CREATE
  create: publicProcedure
    .input(CreateEntitySchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.entity.create({ data: input });
    }),

  // READ (with filters)
  getAll: publicProcedure
    .input(GetEntitiesSchema)
    .query(async ({ ctx, input }) => {
      return ctx.prisma.entity.findMany({
        where: {
          ...(input.status && { status: input.status }),
          ...(input.search && {
            OR: [
              { field1: { contains: input.search } },
              { field2: { contains: input.search } },
            ],
          }),
        },
        orderBy: { createdAt: 'desc' },
      });
    }),

  // READ ONE
  getById: publicProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.entity.findUnique({ 
        where: { id: input } 
      });
    }),

  // UPDATE
  update: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: UpdateEntitySchema,
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.entity.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  // DELETE
  delete: publicProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.entity.delete({ 
        where: { id: input } 
      });
    }),
});
```

## STEP 1: Create router directory

// turbo
mkdir -p src/server/trpc/routers

// Track command
// turbo
jq '.commands_executed += ["mkdir -p src/server/trpc/routers"]' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json && mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

## STEP 2: Generate router files

For each model in schema.prisma, create `src/server/trpc/routers/[model].ts`

// Track file creation (example for task model)
// turbo
jq '.files_created += ["src/server/trpc/routers/task.ts"]' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json && mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

## STEP 3: Create main router

Save `src/server/trpc/router.ts` that imports all routers

// Track file creation
// turbo
jq '.files_created += ["src/server/trpc/router.ts"]' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json && mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

## Validation Rules:

- **All string inputs MUST have `.min()` and `.max()`** (NEVER allow unbounded strings)
- Date inputs use `z.string().datetime()` (not `z.date()`)
- Enums MUST match Prisma schema exactly (even if stored as String in SQLite)
- **For SQLite String-based enums:** Create `z.enum(['VALUE1', 'VALUE2'])` to enforce validation
- getAll MUST support at least: status filter + text search
- Use `contains` for text search (SQLite compatible)
- **Optional:** Add `mode: 'insensitive'` for case-insensitive search (if needed)

## STEP 4: Validation

After generating, validate TypeScript compilation:

```bash
npx tsc --noEmit src/server/trpc/routers/*.ts
```

// Track command
// turbo
jq '.commands_executed += ["npx tsc --noEmit src/server/trpc/routers/*.ts"]' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json && mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

Must compile with zero errors.

**If compilation fails:**

// turbo
jq '.success = false | .error_message = "TypeScript compilation failed"' .agent/telemetry/current_execution.json > .agent/telemetry/current_execution.tmp.json && mv .agent/telemetry/current_execution.tmp.json .agent/telemetry/current_execution.json

// Then finalize telemetry
// turbo
node .agent/scripts/finalize_telemetry.js

**STOP here and fix errors before continuing.**

## Output Summary:

1. ✅ `src/server/trpc/trpc.ts` (context)
2. ✅ `src/server/trpc/routers/[model].ts` (one per model)
3. ✅ `src/server/trpc/router.ts` (main router)
4. ✅ TypeScript validation passed

Show me the generated contracts and ask for approval before finalizing.

## STEP 5: FINALIZE TELEMETRY 🏁

After user approves:

// turbo
node .agent/scripts/finalize_telemetry.js

---

**📊 Execution metrics will be saved to:** `.agent/telemetry/metrics.json`
