# Observabilidade e Auditoria

O Kaven Boilerplate inclui um sistema nativo de observabilidade e auditoria projetado para fornecer visibilidade operacional e segurança sem a complexidade de ferramentas externas no MVP.

## Arquitetura

### 1. Sistema de Auditoria (Audit Logs)

O sistema registra ações críticas de segurança e administração.

- **Armazenamento:** Tabela `AuditLog` no PostgreSQL.
- **Service:** `AuditService` (`apps/api/src/modules/audit/services/audit.service.ts`).
- **Contexto:** Cada log captura: `Actor` (quem), `Action` (o que), `Entity` (alvo), `Tenant` (onde) e `Metadata` (detalhes JSON).

**Eventos Registrados Atualmente:**

- `auth.login.success` / `auth.login.failed`
- `auth.register`
- `user.created`, `user.updated`, `user.deleted`

### 2. Métricas de Sistema

Dashboard em tempo real (`/dashboard/observability`) alimentado por endpoints internos.

- **Fonte de Dados:** `prom-client` (Prometheus) e APIs nativas do Node.js.
- **Métricas Expostas:**
  - Uptime (Tempo de atividade)
  - Consumo de Memória (RSS/Heap)
  - Requests HTTP (Total, Erros, Req/s)
  - Saúde do Banco de Dados (via health checks)

## Endpoints da API

| Método | Rota                       | Descrição                               | Acesso                        |
| ------ | -------------------------- | --------------------------------------- | ----------------------------- |
| GET    | `/api/audit-logs`          | Lista logs de auditoria com paginação   | SUPER_ADMIN / Admin do Tenant |
| GET    | `/api/observability/stats` | Retorna snapshot de métricas do sistema | SUPER_ADMIN                   |

## Frontend (Admin Panel)

O painel administrativo possui uma seção dedicada (`/observability`) construída com:

- **React Query:** Polling inteligente para sensação de "tempo real" (2s para métricas, 3s para logs).
- **Shadcn UI:** Componentes visuais modernos e acessíveis.

### Funcionalidades

1.  **Monitoramento:** Cards com indicadores de saúde do sistema.
2.  **Investigação:** Tabela de logs auditáveis com visualizador de metadados JSON.
