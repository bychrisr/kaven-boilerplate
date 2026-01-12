# 🛠️ GUIA DE IMPLEMENTAÇÃO - Phase 1 Critical Gaps

> **Objetivo:** Fechar os 2 gaps críticos para atingir Phase 1 = 100%

---

## 🎯 GAP 1: USER INVITE SYSTEM

### **Arquitetura**

```
User Flow:
1. Admin clica "Invite User"
2. Form: email + role
3. Backend gera token + envia email
4. User clica link no email
5. Signup page (pre-filled email)
6. User completa signup
7. Auto-associado ao tenant
```

### **Backend Implementation**

#### 1. Criar Model (Prisma)

```prisma
// prisma/schema.prisma

model TenantInvite {
  id        String   @id @default(uuid())
  email     String
  role      Role     @default(MEMBER)
  token     String   @unique
  expiresAt DateTime
  usedAt    DateTime?
  
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  tenantId  String
  
  invitedBy User     @relation(fields: [invitedById], references: [id])
  invitedById String
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([email])
  @@index([token])
  @@index([tenantId])
}
```

#### 2. Service Layer

```typescript
// apps/api/src/modules/users/invite.service.ts

import { PrismaClient, Role } from '@prisma/client';
import crypto from 'crypto';
import { addHours } from 'date-fns';

export class InviteService {
  constructor(private prisma: PrismaClient) {}

  async createInvite(data: {
    email: string;
    role: Role;
    tenantId: string;
    invitedById: string;
  }) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Check for pending invite
    const pendingInvite = await this.prisma.tenantInvite.findFirst({
      where: {
        email: data.email,
        tenantId: data.tenantId,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (pendingInvite) {
      throw new Error('Invite already sent');
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
        tenantId: data.tenantId,
        invitedById: data.invitedById,
      },
      include: {
        tenant: true,
        invitedBy: true,
      },
    });

    // Send email (integrate with your email service)
    await this.sendInviteEmail(invite);

    return invite;
  }

  async validateInvite(token: string) {
    const invite = await this.prisma.tenantInvite.findUnique({
      where: { token },
      include: { tenant: true },
    });

    if (!invite) {
      throw new Error('Invalid invite token');
    }

    if (invite.usedAt) {
      throw new Error('Invite already used');
    }

    if (invite.expiresAt < new Date()) {
      throw new Error('Invite expired');
    }

    return invite;
  }

  async acceptInvite(token: string, userData: {
    password: string;
    name: string;
  }) {
    const invite = await this.validateInvite(token);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: invite.email,
        name: userData.name,
        password: await this.hashPassword(userData.password),
        tenantId: invite.tenantId,
        role: invite.role,
      },
    });

    // Mark invite as used
    await this.prisma.tenantInvite.update({
      where: { id: invite.id },
      data: { usedAt: new Date() },
    });

    return user;
  }

  private async sendInviteEmail(invite: any) {
    // TODO: Integrate with email service (SendGrid, AWS SES, etc)
    const inviteUrl = `${process.env.FRONTEND_URL}/signup?token=${invite.token}`;
    
    console.log(`
      Invite Email:
      To: ${invite.email}
      From: ${invite.invitedBy.name}
      Tenant: ${invite.tenant.name}
      Link: ${inviteUrl}
    `);
  }

  private async hashPassword(password: string): Promise<string> {
    const bcrypt = require('bcrypt');
    return bcrypt.hash(password, 10);
  }
}
```

#### 3. Controller

```typescript
// apps/api/src/modules/users/invite.controller.ts

import { FastifyRequest, FastifyReply } from 'fastify';
import { InviteService } from './invite.service';

export class InviteController {
  constructor(private inviteService: InviteService) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { email, role } = request.body as {
      email: string;
      role: 'ADMIN' | 'MEMBER';
    };

    const invite = await this.inviteService.createInvite({
      email,
      role,
      tenantId: request.user.tenantId,
      invitedById: request.user.id,
    });

    return reply.code(201).send({
      message: 'Invite sent successfully',
      invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt,
      },
    });
  }

  async validate(request: FastifyRequest, reply: FastifyReply) {
    const { token } = request.params as { token: string };

    try {
      const invite = await this.inviteService.validateInvite(token);

      return reply.send({
        valid: true,
        email: invite.email,
        tenant: invite.tenant.name,
      });
    } catch (error) {
      return reply.code(400).send({
        valid: false,
        error: error.message,
      });
    }
  }

  async accept(request: FastifyRequest, reply: FastifyReply) {
    const { token } = request.params as { token: string };
    const { password, name } = request.body as {
      password: string;
      name: string;
    };

    const user = await this.inviteService.acceptInvite(token, {
      password,
      name,
    });

    return reply.send({
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  }
}
```

#### 4. Routes

```typescript
// apps/api/src/modules/users/routes.ts

import { FastifyInstance } from 'fastify';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';

export async function inviteRoutes(app: FastifyInstance) {
  const inviteService = new InviteService(app.prisma);
  const inviteController = new InviteController(inviteService);

  // Create invite (authenticated, admin only)
  app.post('/invites', {
    preHandler: [app.authenticate, app.requireRole('ADMIN')],
    handler: inviteController.create.bind(inviteController),
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

### **Frontend Implementation**

#### 1. Admin UI - Invite Button

```tsx
// apps/admin/app/[locale]/(dashboard)/users/page.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InviteUserDialog } from '@/components/users/invite-dialog';

export default function UsersPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1>Users</h1>
        <Button onClick={() => setIsInviteOpen(true)}>
          Invite User
        </Button>
      </div>

      <InviteUserDialog
        open={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />

      {/* Users table */}
    </div>
  );
}
```

#### 2. Invite Dialog

```tsx
// apps/admin/components/users/invite-dialog.tsx

'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
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
  const [role, setRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER');

  const inviteMutation = useMutation({
    mutationFn: async (data: { email: string; role: string }) => {
      const res = await fetch('/api/users/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to send invite');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Invite sent successfully!');
      setEmail('');
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inviteMutation.mutate({ email, role });
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
              required
            />
          </div>

          <div>
            <label>Role</label>
            <Select value={role} onValueChange={setRole}>
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </Select>
          </div>

          <Button type="submit" disabled={inviteMutation.isPending}>
            {inviteMutation.isPending ? 'Sending...' : 'Send Invite'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

#### 3. Signup Page with Token

```tsx
// apps/admin/app/signup/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);

  // Validate token on mount
  useEffect(() => {
    if (!token) return;

    fetch(`/api/users/invites/${token}/validate`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setIsValidToken(true);
          setEmail(data.email);
        } else {
          toast.error('Invalid or expired invite link');
        }
      });
  }, [token]);

  const signupMutation = useMutation({
    mutationFn: async (data: { name: string; password: string }) => {
      const res = await fetch(`/api/users/invites/${token}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to create account');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Account created! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    },
  });

  if (!token) {
    return <div>No invite token provided</div>;
  }

  if (!isValidToken) {
    return <div>Validating invite...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1>Complete Your Signup</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          signupMutation.mutate({ name, password });
        }}
        className="space-y-4"
      >
        <Input value={email} disabled />

        <Input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" disabled={signupMutation.isPending}>
          Create Account
        </Button>
      </form>
    </div>
  );
}
```

---

## 🎯 GAP 2: PASSWORD RESET FLOW

### **Backend Implementation**

#### 1. Service Layer

```typescript
// apps/api/src/modules/auth/password-reset.service.ts

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { addHours } from 'date-fns';

export class PasswordResetService {
  constructor(private prisma: PrismaClient) {}

  async requestReset(email: string) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return { message: 'If email exists, reset link sent' };
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Store token (expires in 1 hour)
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: addHours(new Date(), 1),
      },
    });

    // Send email
    await this.sendResetEmail(user.email, token);

    return { message: 'If email exists, reset link sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    // Hash token to compare
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find valid token
    const resetToken = await this.prisma.passwordResetToken.findFirst({
      where: {
        token: hashedToken,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!resetToken) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await this.prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    });

    // Invalidate all other tokens for this user
    await this.prisma.passwordResetToken.updateMany({
      where: {
        userId: resetToken.userId,
        usedAt: null,
      },
      data: { usedAt: new Date() },
    });

    return { message: 'Password reset successfully' };
  }

  private async sendResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // TODO: Integrate with email service
    console.log(`
      Password Reset Email:
      To: ${email}
      Link: ${resetUrl}
      (Link expires in 1 hour)
    `);
  }
}
```

#### 2. Prisma Model

```prisma
// prisma/schema.prisma

model PasswordResetToken {
  id        String   @id @default(uuid())
  token     String   @unique
  expiresAt DateTime
  usedAt    DateTime?
  
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  
  createdAt DateTime @default(now())
  
  @@index([token])
  @@index([userId])
}
```

#### 3. Controller & Routes

```typescript
// apps/api/src/modules/auth/password-reset.controller.ts

import { FastifyRequest, FastifyReply } from 'fastify';
import { PasswordResetService } from './password-reset.service';

export class PasswordResetController {
  constructor(private service: PasswordResetService) {}

  async requestReset(request: FastifyRequest, reply: FastifyReply) {
    const { email } = request.body as { email: string };
    const result = await this.service.requestReset(email);
    return reply.send(result);
  }

  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    const { token, password } = request.body as {
      token: string;
      password: string;
    };

    const result = await this.service.resetPassword(token, password);
    return reply.send(result);
  }
}

// Add routes
app.post('/auth/forgot-password', controller.requestReset);
app.post('/auth/reset-password', controller.resetPassword);
```

### **Frontend Implementation**

```tsx
// apps/admin/app/forgot-password/page.tsx

'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const mutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success('If email exists, reset link sent');
    },
  });

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1>Forgot Password</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(email);
        }}
      >
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
        />
        <Button type="submit">Send Reset Link</Button>
      </form>
    </div>
  );
}
```

---

## 📋 TESTING CHECKLIST

### User Invite
- [ ] Admin pode enviar convite
- [ ] Email é recebido com link correto
- [ ] Link expira após 7 dias
- [ ] User pode completar signup
- [ ] User é associado ao tenant correto
- [ ] Role é aplicado corretamente

### Password Reset
- [ ] User pode solicitar reset
- [ ] Email é recebido com link correto
- [ ] Link expira após 1 hora
- [ ] Token só pode ser usado uma vez
- [ ] Senha é atualizada corretamente
- [ ] User consegue fazer login com nova senha

---

## 🚀 IMPLEMENTAÇÃO RÁPIDA

```bash
# 1. Criar branch
git checkout -b fix/phase1-critical-gaps

# 2. Adicionar models ao Prisma
# Editar prisma/schema.prisma
# Adicionar TenantInvite e PasswordResetToken

# 3. Gerar migration
npx prisma migrate dev --name add_invite_and_reset_tokens

# 4. Implementar backend
# Criar arquivos conforme código acima

# 5. Implementar frontend
# Criar componentes conforme código acima

# 6. Testar
npm test

# 7. Commit
git add .
git commit -m "feat: implement user invite and password reset"

# 8. Merge
git checkout main
git merge fix/phase1-critical-gaps

# 9. Tag
git tag -a v2.0.0 -m "Phase 1 Complete - 100%"
```

---

**Tempo estimado total:** 2-3 dias  
**Prioridade:** 🔴 Alta  
**Bloqueador:** ❌ Não, mas altamente recomendado
