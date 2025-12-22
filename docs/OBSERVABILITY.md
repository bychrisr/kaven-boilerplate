# Observabilidade e Auditoria

Esta documentação detalha o sistema de observabilidade nativa e auditoria do Kaven Boilerplate. O objetivo deste módulo é fornecer visibilidade operacional (métricas) e responsabilidade (auditoria) diretamente no painel administrativo, complementando soluções de infraestrutura como Prometheus/Grafana.

---

## 1. Monitoramento de Sistema (R.E.D. Method)

O dashboard de observabilidade (`/dashboard/observability`) implementa uma versão leve do método R.E.D. (Rate, Errors, Duration) utilizando métricas coletadas internamente pelo Node.js e `prom-client`.

### Métricas Coletadas

| Indicador               | Fonte Técnica                          | Descrição                                       | Utilidade                                              |
| ----------------------- | -------------------------------------- | ----------------------------------------------- | ------------------------------------------------------ |
| **Uptime**              | `process.uptime()`                     | Tempo em segundos desde o início do processo.   | Verificar estabilidade e reinicializações indesejadas. |
| **Requests/sec** (Rate) | `prom-client` counter                  | Média móvel de requisições HTTP por segundo.    | Identificar picos de tráfego e carga.                  |
| **Error Rate** (Errors) | `prom-client` counter (status 4xx/5xx) | Contagem e proporção de falhas nas requisições. | Alerta imediato de bugs ou ataques.                    |
| **Memory RSS**          | `process.memoryUsage().rss`            | Memória física residente alocada pelo processo. | Detectar memory leaks.                                 |

### Visualização

Os dados são exibidos em formato de **Sparklines** (gráficos de linha simplificados) que acumulam dados no frontend (React state) para simular uma janela de tempo real de 60 segundos, atualizada via polling a cada 2 segundos.

---

## 2. Sistema de Auditoria (Audit Logs)

O Sistema de Auditoria é a espinha dorsal de segurança para ambientes Multi-Tenant. Ele garante que _todas_ as ações críticas sejam registradas de forma imutável e contextualizada.

### Estrutura do Log

Cada entrada na tabela `AuditLog` responde às perguntas: **Quem? Onde? O Quê? Quando? Como?**

```json
{
  "actor": "User ID (UUID)",
  "tenant": "Tenant ID (UUID) [Opcional - null se for ação de sistema]",
  "action": "domínio.recurso.verbo",
  "entity": "Nome da Entidade (User, Invoice, etc.)",
  "entityId": "ID do recurso afetado",
  "metadata": { "json": "livre para detalhes" },
  "ipAddress": "1.2.3.4",
  "userAgent": "Mozilla/5.0...",
  "status": "SUCCESS | FAILURE"
}
```

### Taxonomia de Ações (Actions)

Use esta referência ao instrumentar novas funcionalidades. Mantenha o padrão `domain.event`.

#### Autenticação (`auth.*`)

- `auth.login.success`: Login bem-sucedido.
- `auth.login.failed`: Falha de login (senha errada, usuário não encontrado). _Metadata: { email }_
- `auth.register`: Novo usuário registrado.
- `auth.logout`: Logout explícito.
- `auth.password_reset.request`: Solicitação de reset enviada.
- `auth.password_reset.complete`: Senha alterada com sucesso.
- `auth.2fa.setup`: 2FA configurado.
- `auth.2fa.disable`: 2FA removido.

#### Usuários (`user.*`)

- `user.create`: Usuário criado manualmente (por admin).
- `user.update`: Perfil atualizado. _Metadata: { fields: ['name', 'role'] }_
- `user.delete`: Usuário removido/arquivado.
- `user.promote`: Mudança de Role (ex: USER -> TENANT_ADMIN).

#### Tenants (`tenant.*`)

- `tenant.create`: Novo tenant criado.
- `tenant.update`: Configurações de tenant alteradas.
- `tenant.subscription.change`: Mudança de plano.

#### Financeiro (`invoice.*`, `order.*`)

- `invoice.create`: Fatura gerada.
- `invoice.pay`: Pagamento registrado.
- `invoice.void`: Fatura cancelada.
- `order.create`: Pedido criado.

---

## 3. Guia de Implementação para Desenvolvedores

### Como registrar um novo evento?

Injete o `AuditService` no seu serviço ou controller e chame o método `create`.

**Exemplo:**

```typescript
import { AuditService } from '../../audit/services/audit.service';

export class FeatureService {
  constructor(private audit: AuditService) {}

  async doSomethingCritical(user: User, resourceId: string) {
    // 1. Executa a lógica
    const result = await db.update(...);

    // 2. Registra auditoria (Fire & Forget ou Await dependendo da criticidade)
    await this.audit.create({
      action: 'feature.critical_action',
      entity: 'FeatureResource',
      entityId: resourceId,
      actorId: user.id,
      tenantId: user.tenantId, // IMPORTANTE para isolamento!
      metadata: {
        previousValue: 'A',
        newValue: 'B',
        reason: 'User request'
      },
      req: request // Opcional: extrai IP/UserAgent automaticamente se passar o objeto Request
    });
  }
}
```

### Como consumir os dados?

1.  **Via API:**
    - `GET /api/audit-logs?action=auth.login.failed`
    - Filtros suportados: `startDate`, `endDate`, `actorId`, `entityType`.

2.  **Via Prisma (Backend):**
    ```typescript
    prisma.auditLog.findMany({
      where: {
        tenantId: currentTenantId, // RLS deve ser respeitado!
      },
    });
    ```

---

## 4. Segurança e Retenção

- **Isolamento:** Logs pertencentes a um tenant SÓ podem ser vistos por admins desse tenant ou SUPER_ADMINS.
- **Imutabilidade:** Não existem endpoints de API para `UPDATE` ou `DELETE` de logs. A remoção só deve ocorrer via scripts de retenção (ex: limpeza após 1 ano) diretamente no banco.
- **Dados Sensíveis:** NUNCA grave senhas, tokens completos ou PII sensível (CPF, Cartão) no campo `metadata`.
