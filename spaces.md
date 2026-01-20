# Spaces & Permissions — Modelo Robusto de Autorização (Kaven)

**Versão:** 1.0  
**Objetivo:** Definir um pilar completo e seguro para **Spaces**, **permissões granulares**, **grants temporários**, **read-only**, **capabilities** e governança de acesso, evitando explosão de complexidade e vazamento de dados.  
**Escopo:** Administração interna (Founder/Admin), equipes (Support/Marketing/Finance/DevOps) e qualquer operação sensível em ambientes multi-tenant.

---

## 1. Visão Geral

O Kaven utiliza **Spaces** como unidade primária de segmentação funcional e de autorização. Um Space representa um **domínio operacional** (ex.: Support, DevOps, Finance, Marketing, Analytics) com:

- **Sidebar e navegação próprias**
- **Conjunto padrão de permissões** (por role)
- **Políticas de acesso e governança**
- **Limites de visibilidade e escopo de dados**
- **Trilhas de auditoria e justificativas de acesso**

Princípio fundamental:

> **Não existe acesso implícito.**  
> Todo acesso é **intencional**, **auditado**, **reversível** e **minimamente necessário**.

---

## 2. Princípios de Segurança e Governança

### 2.1 Least Privilege (Menor Privilégio)

Usuários recebem **apenas** o acesso necessário para executar suas responsabilidades.

### 2.2 Need-to-Know (Necessidade de Saber)

Além de permissões técnicas, cada acesso deve respeitar sensibilidade de dados e riscos organizacionais.

### 2.3 Separation of Duties (Separação de Funções)

Nenhum Space deve, por padrão, oferecer capacidades que permitam:

- agir e auditar a própria ação sem rastreabilidade,
- acessar dados de outros domínios sem justificativa,
- contornar processos internos (ex.: reset 2FA + impersonation + billing ao mesmo tempo para a mesma pessoa).

### 2.4 Explicit Overrides (Exceções Explícitas)

Acesso fora do padrão só via **grant**:

- explicitamente concedido,
- preferencialmente **read-only**,
- preferencialmente **temporário**,
- sempre **auditado**.

### 2.5 Auditability First (Auditabilidade Primeiro)

O sistema deve permitir responder com clareza:

- **Quem** acessou **o quê**
- **Quando**
- **Por quê**
- **Por quanto tempo**
- **Quem concedeu**
- **Qual era o nível de acesso (read-only vs write)**

---

## 3. Conceitos e Definições

### 3.1 Space

Um **Space** é um domínio operacional com:

- um conjunto de módulos/páginas (ex.: Tickets, Observability, Billing),
- políticas de acesso,
- roles locais,
- e um “universo” de navegação próprio.

**Exemplos de Spaces:**

- Support
- DevOps
- Finance
- Marketing
- Analytics (Strategy)
- Admin (somente para founders/super admins, se existir)

### 3.2 Role (por Space)

Role é um perfil de permissões dentro de um Space.

Exemplos:

- Support: `SUPPORT_AGENT`, `SUPPORT_LEAD`
- DevOps: `SRE`, `SRE_LEAD`
- Finance: `FINANCE_ANALYST`, `FINANCE_ADMIN`
- Marketing: `MARKETING_ANALYST`, `MARKETING_MANAGER`
- Analytics: `ANALYTICS_VIEWER`, `ANALYTICS_OWNER`

### 3.3 Capability

Capability é uma capacidade atômica que descreve o que um usuário pode fazer.

**Exemplos:**

- `tickets.read`
- `tickets.update_status`
- `impersonation.start`
- `billing.view_invoices`
- `observability.view_metrics`
- `users.manage`
- `tenants.read`
- `tenants.update`

Capacities devem ser:

- **atômicas**, sem ambiguidade,
- **nomeadas por domínio**,
- **estáveis** (mudam pouco),
- **versionáveis** se necessário.

### 3.4 Resource e Action

Uma capacidade geralmente pode ser entendida como:

- **Resource**: “o que”
- **Action**: “qual ação”

Ex.: `tickets.read` → Resource: Tickets, Action: Read.

### 3.5 Scope (Escopo)

Define **sobre quais dados** a capability se aplica.

Exemplos de escopo:

- `global` (uso extremamente restrito)
- `tenant:<tenantId>` (para ambientes multi-tenant)
- `space:<spaceId>` (limite natural)
- `self` (apenas dados do próprio usuário)
- `assigned` (apenas itens atribuídos ao usuário)

### 3.6 Policy

Políticas são regras condicionais adicionais:

- horário comercial,
- MFA obrigatório,
- aprovação dupla,
- restrição por IP,
- limite de ações por janela de tempo,
- obrigatoriedade de justificativa.

### 3.7 Grant (Concessão / Override)

Grant é uma concessão explícita (exceção) que adiciona ou remove capacidades do usuário fora do role padrão do Space.

Tipos:

- **Add Grant**: adiciona capabilities/páginas/ações
- **Deny Grant**: remove/nega capacidades mesmo que o role conceda
- **Read-only Grant**: força modo leitura em um conjunto de ações
- **Time-bound Grant**: expira automaticamente

---

## 4. Modelo de Autorização (Visão Sistêmica)

O modelo é híbrido: **RBAC por Space + Capabilities + Grants + Policies**.

A autorização final é calculada por:

1. Identificação do usuário
2. Determinação do Space ativo (contexto)
3. Avaliação das roles do usuário nesse Space
4. Composição de capabilities base (Role → Capabilities)
5. Aplicação de Grants (Add/Deny)
6. Aplicação de Policies (condições adicionais)
7. Validação do Scope (sobre quais recursos/dados)
8. Decisão final: Allow / Deny + nível (Read/Write)

Princípio:

> **Deny wins** (negações têm precedência), e **Write nunca é o default** em exceções.

---

## 5. Estrutura Recomendada de Dados (Conceitual)

### 5.1 Entidades

- **User**
- **Space**
- **SpaceMembership** (User ↔ Space)
- **RoleAssignment** (User ↔ Space ↔ Role)
- **Capability**
- **RoleCapabilityMapping** (Role → Capabilities)
- **Grant**
- **Policy**
- **AuditEvent**

### 5.2 SpaceMembership

Para cada usuário:

- lista de Spaces que pode acessar,
- role principal por Space,
- flags de acesso (ex.: “canSwitchSpace”, “requiresMFA”),
- data de entrada e status.

### 5.3 Grant

Cada grant deve carregar:

- alvo: userId
- spaceId
- type: add/deny
- nível: read-only / read-write
- itens: capabilities (ou page routes associadas a capabilities)
- escopo: global/tenant/self/assigned/etc.
- justificativa (texto obrigatório para grants)
- concedido por: adminUserId
- data de início
- data de expiração (recomendado default)
- status: active/revoked/expired

### 5.4 Policy

Policies podem ser:

- por Space
- por Role
- por Capability
- por Usuário (caso excepcional)

---

## 6. Regras de Composição de Permissões

### 6.1 Ordem de Resolução

1. Base: capabilities do role no Space
2. Apply Grants:
   - Apply Deny Grants (removem)
   - Apply Add Grants (adicionam)
3. Apply Read-only constraints
4. Apply Policies condicionais
5. Validate scope
6. Resultado final

### 6.2 Precedência

- **Deny > Allow**
- **Read-only > Read-write**
- Policies de segurança podem impor Deny mesmo com Allow (ex.: falta de MFA)

### 6.3 Padrões de Segurança para Grants

- Grants devem ser **read-only por padrão**
- Grants devem ter **expiração por padrão**
- Grants write requerem:
  - justificativa reforçada
  - MFA obrigatório
  - se sensível, aprovação dupla (opcional)

---

## 7. Read-only (Modo Leitura) — Definição e Aplicação

Read-only não é “falta de botão de editar”. É uma **propriedade do motor de autorização**.

### 7.1 Read-only em nível de Capability

- `resource.read` permitido
- `resource.create|update|delete` negado

### 7.2 Read-only em nível de Route/Page

Mesmo com UI, o backend deve negar ações de escrita.

### 7.3 Read-only em Grants

Quando conceder acesso adicional, o default é:

- permitir leitura
- bloquear escrita
- registrar auditoria em cada acesso

---

## 8. Capabilities — Taxonomia Recomendável

Organização por domínio:

### 8.1 Support

- `tickets.read`
- `tickets.comment`
- `tickets.assign`
- `tickets.update_status`
- `impersonation.start` (altamente sensível)
- `impersonation.stop`
- `auth.2fa_reset.request` (altamente sensível)
- `auth.2fa_reset.execute` (mais sensível ainda)

### 8.2 DevOps

- `observability.view_metrics`
- `observability.view_traces`
- `observability.view_alerts`
- `logs.read`
- `infrastructure.view_status`
- `external_apis.view_health`
- `prometheus.open` (external link)
- `grafana.open` (external link)
- `server.view`
- `database.view`

### 8.3 Finance

- `billing.view`
- `payments.view`
- `payments.refund` (sensível)
- `invoices.view`
- `invoices.issue` (sensível)
- `orders.view`
- `revenue.view`

### 8.4 Marketing

- `crm.read`
- `crm.update`
- `campaigns.read`
- `campaigns.manage`
- `goals.manage`

### 8.5 Management

- `tenants.read`
- `tenants.update` (sensível)
- `users.read`
- `users.manage` (sensível)
- `invites.manage` (sensível)

### 8.6 Analytics

- `analytics.overview.read`
- `analytics.acquisition.read`
- `analytics.activation.read`
- `analytics.retention.read`
- `analytics.monetization.read`
- `analytics.export` (sensível)
- `analytics.see_pii` (extremamente sensível, se existir)

---

## 9. Visibilidade e Sidebar Dinâmico

A navegação deve ser **uma projeção do que o usuário pode acessar**, jamais o contrário.

Regras:

1. Itens só aparecem se o usuário tiver capability de leitura correspondente.
2. Um item pode existir como container (ex.: “Analytics”), mas suas subpáginas aparecem conforme permissão.
3. Se um usuário tem acesso temporário a uma subpágina em outro Space:
   - a subpágina pode aparecer com badge “TEMP”
   - com expiração visível
   - com escopo e nível (read-only) visível

---

## 10. Padrões para Evitar Explosão de Complexidade

O maior risco de um modelo robusto é virar “permissão por usuário” em escala. Para evitar:

### 10.1 Roles devem cobrir 90% dos casos

- Roles são o padrão.
- Grants são exceção.

### 10.2 Grants precisam de governança

- expiração padrão (ex.: 7 dias)
- justificativa obrigatória
- badge visual constante (“ACESSO ESPECIAL”)
- relatório periódico de grants ativos

### 10.3 Grants devem ser “narrow”

Conceder “CRM read” é aceitável.  
Conceder “Marketing Space inteiro” como exceção é quase sempre erro.

### 10.4 Deny Grants são essenciais

Permitem remover uma capability de um role amplo sem criar outro role novo.

---

## 11. Modelo de Acesso Temporário (Access Leasing)

O “acesso temporário” deve ser um conceito de primeira classe.

### 11.1 Regras recomendadas

- Default: expira em 7 dias
- Extensão exige justificativa adicional
- Pode exigir aprovação do Space Owner
- Ao expirar: notificação + log

### 11.2 Exemplo de uso

João (Support) pede acesso ao CRM (Marketing) para investigar um padrão.

Concessão:

- Space: Marketing
- Página: CRM
- Nível: Read-only
- Escopo: agregado (sem PII) se possível
- Expiração: 7 dias
- Justificativa: “Identifiquei padrão X em tickets; preciso validar hipótese Y.”

Resultado:

- João vê CRM apenas em leitura
- com badge TEMP
- expiração visível
- auditoria de acessos registrada

---

## 12. Controles para Dados Sensíveis (PII, Financeiro, Segurança)

Além de capabilities, certos dados exigem camadas adicionais:

### 12.1 Data Classes (Classificação de Dados)

- Public
- Internal
- Confidential
- Restricted (PII / credenciais / tokens / dados financeiros detalhados)

### 12.2 Regras por classificação

- Restricted exige MFA
- Restricted exige logging detalhado
- Exportação de dados (CSV/JSON) exige capability específica e pode exigir aprovação

### 12.3 Masking (Mascaramento)

Usuários em leitura podem ver dados agregados sem ver PII:

- email mascarado
- valores aproximados ou faixas
- identificadores substituídos

Isso permite insights sem vazamento.

---

## 13. Auditoria e Trilhas de Acesso

A auditoria deve registrar:

- userId
- spaceId
- capability
- action (read/update/delete)
- resourceId (quando aplicável)
- scope
- timestamp
- origem (IP/device)
- motivo (se foi via grant)
- grantId (se aplicável)

### 13.1 Auditoria de concessão (Grant Audit)

Quando um grant é criado:

- quem concedeu
- justificativa
- tempo
- nível (read-only / write)
- escopo

### 13.2 Revisões Periódicas (Access Review)

Relatório (quinzenal ou mensal):

- grants ativos por Space
- grants expirados recentemente
- acessos a dados Restricted
- tentativas de acesso negadas (para detectar abuso)

---

## 14. Delegação e Ownership por Space

Cada Space deve ter um **Owner** (ou grupo) responsável por:

- roles e capabilities do Space
- aprovações de grants sensíveis
- revisão periódica

Isso evita centralização excessiva no founder e reduz risco operacional.

---

## 15. Multi-tenancy e Escopos de Dados

Em ambientes multi-tenant, o modelo precisa deixar claro:

- **Quem pode ver dados de múltiplos tenants**
- **Quem pode agir em tenants específicos**
- **Quando existe cross-tenant visibility**

Recomendações:

1. Spaces operacionais (Support) devem trabalhar com:
   - escopo `tenant:<id>` por padrão
2. Acesso cross-tenant deve ser:
   - capability específica (`tenants.cross_read`)
   - e frequentemente read-only
3. Impersonation deve:
   - exigir justificativa
   - registrar sessão
   - ser time-bound
   - exigir MFA e/ou aprovação (opcional)

---

## 16. Impersonation — Modelo Seguro

Impersonation é uma das features mais perigosas se mal desenhada.

Regras robustas:

- Somente roles específicas em Support podem iniciar
- Requer justificativa obrigatória
- Sessão tem expiração curta (ex.: 15–30 min)
- Logs completos:
  - quem iniciou
  - qual usuário impersonado
  - quais ações executadas
- Ações sensíveis durante impersonation podem ser bloqueadas:
  - billing, refund, 2FA reset
  - exportação de dados

---

## 17. 2FA Reset — Modelo Seguro

2FA Reset é um “break glass”.

Regras:

- Dividir em duas capabilities:
  - `auth.2fa_reset.request`
  - `auth.2fa_reset.execute`
- `execute` pode exigir:
  - aprovação dupla
  - MFA
  - janela de tempo
- Auditoria completa + notificação para o usuário impactado

---

## 18. Exportação de Dados (CSV/JSON) — Modelo Seguro

Exportações são vias comuns de vazamento.

- Capability separada: `*.export`
- Default: negado
- Se permitido:
  - limitar colunas
  - evitar PII
  - watermark/trace (opcional)
  - auditoria reforçada

---

## 19. Experiência do Admin (UX) — Sem virar inferno

Para o admin/founder conceder acessos sem explosão de complexidade:

### 19.1 Fluxo recomendado de concessão

1. Selecionar Space
2. Selecionar Role base
3. (Opcional) Ajustes por grants:
   - toggles por página/capability
   - read-only default
   - expiração default
4. Exigir justificativa textual
5. Confirmar com “resumo” do acesso concedido

### 19.2 Representação visual recomendada

- Badge “SPECIAL” em itens de menu concedidos por grant
- Tooltip com:
  - expiração
  - concedido por
  - justificativa
  - nível (RO/RW)

---

## 20. Estratégia de Implementação (Fases)

### Fase 1 — Fundacional

- Definir Spaces e Owners
- Definir roles por Space
- Criar capability registry (catálogo)
- Implementar motor de autorização (RBAC + capabilities)
- Sidebar dinâmico por capabilities

### Fase 2 — Grants e Governança

- Implementar grants (add/deny)
- Implementar expiração e revisões
- Implementar read-only enforcement no backend
- Implementar auditoria completa

### Fase 3 — Dados Sensíveis e Policies

- Data classification
- Masking
- Policies condicionais (MFA, IP, approvals)

---

## 21. Exemplos de Uso (Sem Código)

### 21.1 Agente de Support padrão

- Space: Support
- Role: SUPPORT_AGENT
- Pode:
  - ler tickets
  - comentar
  - mudar status
- Não pode:
  - ver billing
  - ver logs internos
  - exportar dados
  - acessar analytics

### 21.2 DevOps/SRE padrão

- Space: DevOps
- Role: SRE
- Pode:
  - ver métricas
  - ver logs
  - ver alertas
- Não pode:
  - ver tickets
  - fazer impersonation
  - acessar CRM

### 21.3 Exceção controlada (Support → CRM read-only)

- Usuário: João (Support)
- Grant:
  - `crm.read`
  - read-only
  - expira em 7 dias
  - justificativa obrigatória
- Resultado:
  - acesso pontual
  - auditável
  - reversível
  - sem mudar role nem criar nova role

---

## 22. Checklist de Robustez (Validação)

Um sistema de Spaces e permissões é robusto se:

- [ ] Todo acesso depende de capability explícita
- [ ] Sidebar não mostra itens não permitidos
- [ ] Grants têm expiração padrão
- [ ] Grants são read-only por default
- [ ] Deny overrides funcionam
- [ ] Auditoria registra concessão e uso
- [ ] Exportação de dados é tratada como sensível
- [ ] Impersonation e 2FA Reset têm controles reforçados
- [ ] Há revisão periódica de acessos
- [ ] Roles cobrem a maioria dos casos sem customização por usuário

---

## 23. Glossário (Rápido)

- **Space:** Domínio operacional com navegação e permissões próprias
- **Role:** Perfil padrão de permissões dentro de um Space
- **Capability:** Permissão atômica (resource.action)
- **Scope:** Limite sobre quais dados a capability se aplica
- **Grant:** Exceção explícita que adiciona ou remove capabilities
- **Policy:** Regra condicional (MFA, tempo, IP, aprovação)
- **Read-only:** Permissão que só autoriza leitura, bloqueando escrita no backend
- **Audit Log:** Registro rastreável de ações e concessões de acesso

---
