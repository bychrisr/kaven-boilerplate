# Observabilidade e Auditoria

Esta documentação detalha o sistema de observabilidade nativa e auditoria do Kaven Boilerplate. O objetivo deste módulo é fornecer visibilidade operacional (métricas) e responsabilidade (auditoria) diretamente no painel administrativo, complementando soluções de infraestrutura como Prometheus/Grafana.

---

## 1. Monitoramento de Sistema (R.E.D. Method + Golden Signals)

O dashboard de observabilidade (`/dashboard/observability`) implementa uma combinação do método R.E.D. (Rate, Errors, Duration) e dos **Golden Signals** (Google SRE), utilizando métricas coletadas internamente pelo Node.js e `prom-client`.

### Métricas Básicas (R.E.D.)

| Indicador               | Fonte Técnica                          | Descrição                                       | Utilidade                                              |
| ----------------------- | -------------------------------------- | ----------------------------------------------- | ------------------------------------------------------ |
| **Uptime**              | `process.uptime()`                     | Tempo em segundos desde o início do processo.   | Verificar estabilidade e reinicializações indesejadas. |
| **Requests/sec** (Rate) | `prom-client` counter                  | Média móvel de requisições HTTP por segundo.    | Identificar picos de tráfego e carga.                  |
| **Error Rate** (Errors) | `prom-client` counter (status 4xx/5xx) | Contagem e proporção de falhas nas requisições. | Alerta imediato de bugs ou ataques.                    |
| **Memory RSS**          | `process.memoryUsage().rss`            | Memória física residente alocada pelo processo. | Detectar memory leaks.                                 |

### Golden Signals (Métricas Avançadas)

Implementadas no endpoint `/api/observability/advanced`:

#### 1. Latency (Tempo de Resposta)

- **p50 (mediana):** 50% das requisições são mais rápidas que este valor
- **p95:** 95% das requisições são mais rápidas (SLA típico)
- **p99:** 99% das requisições são mais rápidas (tail latency)

**Fonte:** Histograma de latências coletado via middleware `advanced-metrics.middleware.ts`

#### 2. Traffic (Volume de Requisições)

- **Requests/sec:** Taxa atual de requisições
- **Total Requests:** Contador acumulado desde o início

#### 3. Errors (Taxa de Falhas)

- **Error Requests:** Contagem de requisições com status 5xx
- **Error Rate (%):** Percentual de falhas sobre o total

#### 4. Saturation (Utilização de Recursos)

- **CPU Usage (%):** Percentual de uso de CPU
- **Memory Usage (%):** Heap usado / Heap total

### Métricas Específicas de Node.js

#### Event Loop Lag ⭐

**Crítico para Node.js!** Mede o atraso entre quando uma tarefa deveria executar vs quando realmente executa.

- **< 10ms:** ✅ Saudável
- **10-50ms:** ⚠️ Atenção
- **> 50ms:** 🔴 Crítico (event loop bloqueado)

**Fonte:** `perf_hooks` com monitoramento contínuo via `setInterval`

#### Memory Heap Detalhado

- **Used MB:** Memória heap atualmente em uso
- **Total MB:** Memória heap total alocada
- **External:** Memória C++ vinculada a objetos JavaScript

#### Active Handles/Requests

- **Active Handles:** File descriptors, sockets, timers ativos
- **Active Requests:** Requisições em andamento

### Visualização

Os dados são exibidos em formato de **Sparklines** (gráficos de linha simplificados) que acumulam dados no frontend (React state) para simular uma janela de tempo real de 60 segundos, atualizada via polling a cada 2 segundos.

#### Implementação Técnica (Frontend)

- **Biblioteca:** `recharts` (v3.6.0)
- **Componentes:**
  - `GoldenSignals` (4 cards principais)
  - `NodeJsMetrics` (métricas específicas de Node.js)
- **Características:**
  - Cards com status visual (cores baseadas em thresholds)
  - Tooltip interativo mostrando valores ao passar o mouse
  - Estado de loading com skeleton animado
  - Atualização automática a cada 2 segundos

**Cores por Métrica:**

- Latency: Azul (`#3B82F6`)
- Traffic: Verde (`#10B981`)
- Errors: Vermelho (`#EF4444`)
- Saturation: Roxo (`#8B5CF6`)

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

### Visualização no Frontend

A tabela de auditoria (`AuditLogTable`) utiliza **badges coloridos** para facilitar a identificação visual:

- 🔴 **Vermelho (destructive):** Ações de `delete` ou `failed`
- 🟢 **Verde (default):** Ações de `create` ou `success`
- 🟡 **Amarelo (secondary):** Ações de `update`
- ⚪ **Cinza (outline):** Outras ações

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
