# 🚨 INVITE SYSTEM - CORREÇÃO CRÍTICA (Multi-Tenancy)

> **Issue:** User Invite não especifica QUAL tenant o usuário vai fazer parte  
> **Severidade:** 🔴 CRÍTICA - Segurança & Arquitetura  
> **Identificado por:** Chris (@bychrisr)

---

## 🎯 PROBLEMA IDENTIFICADO

### ❌ **Implementação INCORRETA (atual):**

```typescript
// Invite form (ERRADO)
POST /api/users/invite
{
  "email": "user@example.com",
  "role": "MEMBER"  // ← Falta tenantId!
}

// Problema:
// - Qual tenant o user vai fazer parte?
// - MEMBER sem tenant não faz sentido
// - ADMIN de qual tenant?
```

---

## ✅ SOLUÇÃO CORRETA

### **Arquitetura Multi-Tenancy:**

```
SUPER_ADMIN (role: SUPER_ADMIN)
├─ Acesso GLOBAL à plataforma
├─ Não pertence a nenhum tenant
├─ Gerencia TODOS os tenants
└─ Login: admin.kaven.site

TENANT_ADMIN (role: ADMIN)
├─ Acesso a UM tenant específico
├─ Gerencia users do SEU tenant
├─ Pode acessar admin.kaven.site E app.kaven.site
└─ tenantId OBRIGATÓRIO

MEMBER (role: MEMBER)
├─ Acesso a UM tenant específico
├─ Usa features do produto
├─ Acessa apenas app.kaven.site
└─ tenantId OBRIGATÓRIO
```

---

## 📋 MODELO CORRETO DO PRISMA

### **TenantInvite Model:**

```prisma
model TenantInvite {
  id        String   @id @default(uuid())
  email     String
  role      Role     @default(MEMBER)  // SUPER_ADMIN, ADMIN, or MEMBER
  token     String   @unique
  expiresAt DateTime
  usedAt    DateTime?
  
  // CRITICAL: tenantId pode ser NULL apenas para SUPER_ADMIN
  tenantId  String?
  tenant    Tenant?  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  invitedBy User     @relation(fields: [invitedById], references: [id])
  invitedById String
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([email])
  @@index([token])
  @@index([tenantId])
  
  // VALIDATION: If role != SUPER_ADMIN, tenantId MUST be set
  @@check("role = 'SUPER_ADMIN' OR tenantId IS NOT NULL")
}

enum Role {
  SUPER_ADMIN  // Platform-wide access (no tenant)
  ADMIN        // Tenant admin (tenantId required)
  MEMBER       // Tenant member (tenantId required)
}
```

---

## 🔧 BACKEND IMPLEMENTATION

### **1. Invite Service (Corrigido):**

```typescript
// apps/backend/src/modules/users/invite.service.ts

export class InviteService {
  constructor(private prisma: PrismaClient) {}

  async createInvite(data: {
    email: string;
    role: Role;
    tenantId?: string;  // ← AGORA É OPCIONAL
    invitedById: string;
  }) {
    // VALIDATION: Role vs Tenant
    if (data.role === 'SUPER_ADMIN') {
      if (data.tenantId) {
        throw new Error('SUPER_ADMIN cannot have tenantId');
      }
    } else {
      // ADMIN ou MEMBER OBRIGATORIAMENTE precisam de tenantId
      if (!data.tenantId) {
        throw new Error('ADMIN and MEMBER roles require tenantId');
      }
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Check for pending invite (same email + tenant)
    const pendingInvite = await this.prisma.tenantInvite.findFirst({
      where: {
        email: data.email,
        tenantId: data.tenantId || null,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (pendingInvite) {
      throw new Error('Invite already sent to this email for this tenant');
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Create invite (expires in 7 days)
    const invite = await this.prisma.tenantInvite.create({
      data: {
        email: data.email,
        role: data.role,
        token,
        expiresAt: addHours(new Date(), 168), // 7 days
        tenantId: data.tenantId || null,
        invitedById: data.invitedById,
      },
      include: {
        tenant: true,
        invitedBy: true,
      },
    });

    // Send email
    await this.sendInviteEmail(invite);

    return invite;
  }

  async listPendingInvites(filters?: {
    tenantId?: string;
    email?: string;
    role?: Role;
  }) {
    return this.prisma.tenantInvite.findMany({
      where: {
        usedAt: null,
        expiresAt: { gt: new Date() },
        tenantId: filters?.tenantId,
        email: filters?.email,
        role: filters?.role,
      },
      include: {
        tenant: true,
        invitedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async cancelInvite(inviteId: string, userId: string) {
    const invite = await this.prisma.tenantInvite.findUnique({
      where: { id: inviteId },
    });

    if (!invite) {
      throw new Error('Invite not found');
    }

    // Only inviter or super admin can cancel
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user.role !== 'SUPER_ADMIN' && invite.invitedById !== userId) {
      throw new Error('Unauthorized');
    }

    if (invite.usedAt) {
      throw new Error('Invite already used');
    }

    // Soft delete by setting expiration to now
    return this.prisma.tenantInvite.update({
      where: { id: inviteId },
      data: {
        expiresAt: new Date(),
      },
    });
  }

  private async sendInviteEmail(invite: any) {
    const inviteUrl = `${process.env.FRONTEND_URL}/signup?token=${invite.token}`;
    
    // Email template based on role
    const emailData = {
      to: invite.email,
      from: invite.invitedBy.email,
      subject: invite.role === 'SUPER_ADMIN' 
        ? 'Platform Admin Invitation' 
        : `Invitation to join ${invite.tenant?.name || 'the platform'}`,
      body: `
        You've been invited as ${invite.role}
        ${invite.tenant ? `to ${invite.tenant.name}` : 'to the platform'}
        
        Click here to accept: ${inviteUrl}
        
        This invitation expires in 7 days.
      `,
    };

    // TODO: Integrate with email service (SendGrid, AWS SES, etc)
    console.log('Invite Email:', emailData);
  }
}
```

---

### **2. Invite Controller (Corrigido):**

```typescript
// apps/backend/src/modules/users/invite.controller.ts

export class InviteController {
  constructor(private inviteService: InviteService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { email, role, tenantId } = request.body as {
      email: string;
      role: 'SUPER_ADMIN' | 'ADMIN' | 'MEMBER';
      tenantId?: string;  // ← OPCIONAL agora
    };

    const currentUser = request.user;

    // AUTHORIZATION CHECKS
    if (role === 'SUPER_ADMIN') {
      // Only SUPER_ADMIN can invite SUPER_ADMIN
      if (currentUser.role !== 'SUPER_ADMIN') {
        return reply.code(403).send({
          error: 'Only SUPER_ADMIN can invite platform admins',
        });
      }
    } else {
      // ADMIN/MEMBER invites
      if (!tenantId) {
        return reply.code(400).send({
          error: 'tenantId is required for ADMIN and MEMBER roles',
        });
      }

      // Check if user has permission to invite to this tenant
      if (currentUser.role === 'SUPER_ADMIN') {
        // Super admin can invite to any tenant
      } else if (currentUser.role === 'ADMIN') {
        // Admin can only invite to their own tenant
        if (currentUser.tenantId !== tenantId) {
          return reply.code(403).send({
            error: 'You can only invite users to your own tenant',
          });
        }
      } else {
        // MEMBER cannot invite
        return reply.code(403).send({
          error: 'You do not have permission to invite users',
        });
      }
    }

    const invite = await this.inviteService.createInvite({
      email,
      role,
      tenantId,
      invitedById: currentUser.id,
    });

    return reply.code(201).send({
      message: 'Invite sent successfully',
      invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        tenantId: invite.tenantId,
        expiresAt: invite.expiresAt,
      },
    });
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const { tenantId, email, role } = request.query as {
      tenantId?: string;
      email?: string;
      role?: 'SUPER_ADMIN' | 'ADMIN' | 'MEMBER';
    };

    const currentUser = request.user;

    // Filter based on user role
    let filters: any = {};

    if (currentUser.role === 'SUPER_ADMIN') {
      // Super admin sees all invites
      filters = { tenantId, email, role };
    } else if (currentUser.role === 'ADMIN') {
      // Admin sees only their tenant's invites
      filters = {
        tenantId: currentUser.tenantId,
        email,
        role,
      };
    } else {
      return reply.code(403).send({
        error: 'You do not have permission to view invites',
      });
    }

    const invites = await this.inviteService.listPendingInvites(filters);

    return reply.send({ invites });
  }

  async cancel(request: FastifyRequest, reply: FastifyReply) {
    const { inviteId } = request.params as { inviteId: string };

    await this.inviteService.cancelInvite(inviteId, request.user.id);

    return reply.send({ message: 'Invite cancelled successfully' });
  }
}
```

---

### **3. Routes (Corrigido):**

```typescript
// apps/backend/src/modules/users/routes.ts

export async function inviteRoutes(app: FastifyInstance) {
  const inviteService = new InviteService(app.prisma);
  const inviteController = new InviteController(inviteService);

  // Create invite
  // SUPER_ADMIN can invite anyone
  // ADMIN can invite to their tenant only
  // MEMBER cannot invite
  app.post('/invites', {
    preHandler: [app.authenticate],  // Must be logged in
    handler: inviteController.create.bind(inviteController),
  });

  // List pending invites
  // SUPER_ADMIN sees all
  // ADMIN sees only their tenant's
  // MEMBER cannot access
  app.get('/invites', {
    preHandler: [app.authenticate],
    handler: inviteController.list.bind(inviteController),
  });

  // Cancel invite
  // Only inviter or SUPER_ADMIN
  app.delete('/invites/:inviteId', {
    preHandler: [app.authenticate],
    handler: inviteController.cancel.bind(inviteController),
  });

  // Validate invite (public)
  app.get('/invites/:token/validate', {
    handler: inviteController.validate.bind(inviteController),
  });

  // Accept invite (public)
  app.post('/invites/:token/accept', {
    handler: inviteController.accept.bind(inviteController),
  });
}
```

---

## 🎨 FRONTEND IMPLEMENTATION

### **1. Admin Panel - Invite Dialog (Corrigido):**

```tsx
// apps/admin/components/users/invite-dialog.tsx

'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface InviteUserDialogProps {
  open: boolean;
  onClose: () => void;
}

export function InviteUserDialog({ open, onClose }: InviteUserDialogProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MEMBER' | 'SUPER_ADMIN'>('MEMBER');
  const [tenantId, setTenantId] = useState<string>('');

  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => fetch('/api/users/me').then((r) => r.json()),
  });

  // Fetch tenants (for Super Admin)
  const { data: tenants } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => fetch('/api/tenants').then((r) => r.json()),
    enabled: currentUser?.role === 'SUPER_ADMIN',
  });

  const inviteMutation = useMutation({
    mutationFn: async (data: { email: string; role: string; tenantId?: string }) => {
      const res = await fetch('/api/users/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to send invite');
      }
      
      return res.json();
    },
    onSuccess: () => {
      toast.success('Invite sent successfully!');
      setEmail('');
      setRole('MEMBER');
      setTenantId('');
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (role === 'SUPER_ADMIN') {
      // Super admin doesn't need tenantId
      inviteMutation.mutate({ email, role });
    } else {
      // ADMIN and MEMBER need tenantId
      if (!tenantId) {
        toast.error('Please select a tenant');
        return;
      }
      inviteMutation.mutate({ email, role, tenantId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>

          <div>
            <label>Role</label>
            <Select value={role} onValueChange={setRole}>
              {currentUser?.role === 'SUPER_ADMIN' && (
                <option value="SUPER_ADMIN">Platform Admin (SUPER_ADMIN)</option>
              )}
              <option value="ADMIN">Tenant Admin (ADMIN)</option>
              <option value="MEMBER">Member (MEMBER)</option>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              {role === 'SUPER_ADMIN' && 'Full platform access, no tenant restriction'}
              {role === 'ADMIN' && 'Can manage users and settings within their tenant'}
              {role === 'MEMBER' && 'Regular user, access to tenant features'}
            </p>
          </div>

          {role !== 'SUPER_ADMIN' && (
            <div>
              <label>Tenant</label>
              {currentUser?.role === 'SUPER_ADMIN' ? (
                <Select value={tenantId} onValueChange={setTenantId}>
                  <option value="">Select tenant...</option>
                  {tenants?.map((tenant: any) => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  value={currentUser?.tenant?.name || ''}
                  disabled
                  readOnly
                />
              )}
              <p className="text-sm text-muted-foreground mt-1">
                User will be assigned to this tenant
              </p>
            </div>
          )}

          <Button type="submit" disabled={inviteMutation.isPending}>
            {inviteMutation.isPending ? 'Sending...' : 'Send Invite'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

---

### **2. Pending Invites List (NEW):**

```tsx
// apps/admin/app/(dashboard)/invites/page.tsx

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function InvitesPage() {
  const queryClient = useQueryClient();

  const { data: invites, isLoading } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: () => fetch('/api/users/invites').then((r) => r.json()),
  });

  const cancelMutation = useMutation({
    mutationFn: async (inviteId: string) => {
      const res = await fetch(`/api/users/invites/${inviteId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to cancel invite');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-invites'] });
      toast.success('Invite cancelled');
    },
    onError: () => {
      toast.error('Failed to cancel invite');
    },
  });

  const copyInviteLink = (token: string) => {
    const url = `${window.location.origin}/signup?token=${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Invite link copied to clipboard');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pending Invites</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead>Invited By</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invites?.invites?.map((invite: any) => (
            <TableRow key={invite.id}>
              <TableCell>{invite.email}</TableCell>
              <TableCell>
                <Badge variant={
                  invite.role === 'SUPER_ADMIN' ? 'destructive' :
                  invite.role === 'ADMIN' ? 'default' :
                  'secondary'
                }>
                  {invite.role}
                </Badge>
              </TableCell>
              <TableCell>
                {invite.tenant ? invite.tenant.name : (
                  <span className="text-muted-foreground">Platform</span>
                )}
              </TableCell>
              <TableCell>{invite.invitedBy.name}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(invite.expiresAt), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyInviteLink(invite.token)}
                  >
                    Copy Link
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => cancelMutation.mutate(invite.id)}
                    disabled={cancelMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {invites?.invites?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No pending invites
        </div>
      )}
    </div>
  );
}
```

---

### **3. Sidebar - Add Invites Link:**

```tsx
// apps/admin/components/admin-sidebar.tsx

<SidebarItem icon={Mail} href="/invites">
  Pending Invites
  {pendingInvitesCount > 0 && (
    <Badge variant="destructive" className="ml-auto">
      {pendingInvitesCount}
    </Badge>
  )}
</SidebarItem>
```

---

## 🧪 VALIDATION CHECKLIST

### **Scenarios to Test:**

#### **1. SUPER_ADMIN inviting SUPER_ADMIN:**
```bash
POST /api/users/invites
{
  "email": "newadmin@kaven.site",
  "role": "SUPER_ADMIN"
  // No tenantId
}

Expected: ✅ Success
Result: User becomes SUPER_ADMIN with global access
```

#### **2. SUPER_ADMIN inviting ADMIN to Tenant A:**
```bash
POST /api/users/invites
{
  "email": "admin@tenantA.com",
  "role": "ADMIN",
  "tenantId": "tenant-a-uuid"
}

Expected: ✅ Success
Result: User becomes ADMIN of Tenant A only
```

#### **3. ADMIN (Tenant A) inviting MEMBER to Tenant A:**
```bash
POST /api/users/invites
{
  "email": "user@tenantA.com",
  "role": "MEMBER",
  "tenantId": "tenant-a-uuid"
}

Expected: ✅ Success (same tenant)
```

#### **4. ADMIN (Tenant A) inviting to Tenant B:**
```bash
POST /api/users/invites
{
  "email": "user@tenantB.com",
  "role": "MEMBER",
  "tenantId": "tenant-b-uuid"  // Different tenant!
}

Expected: ❌ 403 Forbidden
Error: "You can only invite users to your own tenant"
```

#### **5. MEMBER trying to invite:**
```bash
POST /api/users/invites
{...}

Expected: ❌ 403 Forbidden
Error: "You do not have permission to invite users"
```

#### **6. Missing tenantId for ADMIN role:**
```bash
POST /api/users/invites
{
  "email": "admin@example.com",
  "role": "ADMIN"
  // Missing tenantId
}

Expected: ❌ 400 Bad Request
Error: "ADMIN and MEMBER roles require tenantId"
```

---

## 📊 DATABASE CONSTRAINTS

```sql
-- Ensure role/tenant consistency
ALTER TABLE tenant_invites ADD CONSTRAINT check_tenant_role 
CHECK (
  role = 'SUPER_ADMIN' OR tenantId IS NOT NULL
);

-- Index for querying pending invites
CREATE INDEX idx_pending_invites ON tenant_invites(usedAt, expiresAt, tenantId);

-- Prevent duplicate pending invites (same email + tenant)
CREATE UNIQUE INDEX idx_unique_pending_invite 
ON tenant_invites(email, tenantId)
WHERE usedAt IS NULL AND expiresAt > NOW();
```

---

## 🎯 UI/UX IMPROVEMENTS

### **Pending Invites Dashboard Card:**

```tsx
// apps/admin/app/(dashboard)/page.tsx

<Card>
  <CardHeader>
    <CardTitle>Pending Invites</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">{pendingInvitesCount}</div>
    <p className="text-sm text-muted-foreground">
      Waiting for acceptance
    </p>
    <Button asChild className="mt-4">
      <Link href="/invites">View All</Link>
    </Button>
  </CardContent>
</Card>
```

---

## 📝 SUMMARY OF CHANGES

### **What Changed:**

1. ✅ `tenantId` is now OPTIONAL in invite (NULL for SUPER_ADMIN)
2. ✅ Database constraint ensures role/tenant consistency
3. ✅ Authorization checks prevent cross-tenant invites
4. ✅ Frontend shows tenant selector based on role
5. ✅ NEW: Pending invites list page with cancel functionality
6. ✅ NEW: Copy invite link feature
7. ✅ NEW: Sidebar badge showing pending invites count
8. ✅ Better UX with role descriptions

### **What This Fixes:**

- ❌ ~~Users invited without tenant context~~
- ❌ ~~No way to see pending invites~~
- ❌ ~~No way to cancel invites~~
- ❌ ~~Admins could invite to any tenant~~
- ❌ ~~SUPER_ADMIN stuck with tenantId~~

---

**Pronto! Agora o Invite System está correto para multi-tenancy! 🎉**
