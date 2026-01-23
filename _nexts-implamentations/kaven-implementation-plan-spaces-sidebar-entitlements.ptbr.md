# Kaven — Especificação Técnica Profunda
## Arquitetura de Spaces, Autorização, Sidebar, Dashboards e Planos/Entitlements/Gating (com Space Supremo Break‑Glass)

**Status assumido:** sistema de **Plans / Products / Features / Subscriptions / Currencies** já está 100% implementado e em produção.  
**Contexto do problema:** vamos introduzir (ou consolidar) o pilar de **Spaces** (roles/capabilities/grants/requests/badges/policies/auditoria) e, ao mesmo tempo, reorganizar **sidebar** e **dashboards** para que:
1) a navegação reflita corretamente o contexto e as permissões,  
2) o gating por plano seja consistente (UI + backend + domínio),  
3) exista um **Space Supremo** (superadmin) para emergências **sem** virar um buraco de segurança nem um “atalho” para contornar governança,  
4) tudo isso minimize refatorações futuras (“contratos” estáveis).

---

## 0) TL;DR das decisões (ADR — Architecture Decision Records)

### ADR‑001 — Não existe “nível global” para usuários comuns
- **Decisão:** não expor qualquer “global navigation” que atravesse domínios para usuários não‑executivos.
- **Motivo:** reduz vazamento passivo, reduz confusão e impede que “qualquer um” navegue por dados internos.
- **Implicação:** a navegação e os dashboards são **Space-aware**.

### ADR‑002 — Existe um Space “Supremo”, mas ele é Break‑Glass (JIT + TTL + RO default)
- **Decisão:** manter um Space supremo para debug/contingência/testes end‑to‑end, **porém** com atrito intencional.
- **Guardrails:** Just‑in‑Time entry, expiração automática, read‑only por padrão, step‑up auth por ação crítica, logs premium, anti‑exfiltração.

### ADR‑003 — Planos são Entitlements; Spaces são Authorization
- **Decisão:** “o que o tenant pode usar” (entitlements) é separado de “quem pode fazer” (authorization).
- **Regra:** **Allow = Authorized(user, action, scope) ∧ Entitled(tenant, feature/quota)**.
- **Motivo:** evita UI-only gating, previne brechas e garante consistência entre monetização e segurança.

### ADR‑004 — Sidebar é projeção de metadados (data‑driven), não um mapa manual
- **Decisão:** menus e rotas devem ser gerados/validados por metadados: capabilities, entitlements, risco, badges.
- **Motivo:** remove “ifs espalhados”, reduz regressões e facilita auditoria.

### ADR‑005 — Governance é primeiro‑classe
- **Decisão:** adicionar um Space de governança (Access Control) com Requests/Grants/Policies/Audit (governança).
- **Motivo:** sem isso, grants viram caos e o founder vira gargalo.

---

## 1) Objetivos, anti‑objetivos e critérios de sucesso

### 1.1 Objetivos
- **Segurança**: impedir vazamento e reduzir blast radius; tornar acesso sempre intencional e auditável.
- **Escalabilidade organizacional**: times diferentes operam em Spaces diferentes com menus diferentes.
- **Velocidade com controle**: conceder acesso temporário/pontual com UX simples e governança forte.
- **Consistência com monetização**: gating por plano e quotas são aplicados no backend e no domínio.
- **Não refatorar depois**: congelar contratos (metadados, registry de entitlements/capabilities, taxonomia de Spaces).

### 1.2 Anti‑objetivos (por ora)
- Não definir layout visual final de cada dashboard (apenas contratos e fluxos).
- Não criar um “sistema de BI” completo (isso vem depois).
- Não implementar políticas extremas em todos os endpoints no dia 1 (faseamento).

### 1.3 Critérios de sucesso (objetivos mensuráveis)
- **Zero** endpoints sensíveis acessíveis quando `Authorized=false` ou `Entitled=false`.
- **100%** dos grants com expiração padrão (ou justificativa + owner approval para permanentes).
- Redução de “pedidos de acesso errados” (métrica: requests rejeitados por categoria) ao longo do tempo.
- Aumento de conversão por gating (métrica: `blocked_by_plan → upgrade_intent → upgrade_completed`).
- Uso do Space Supremo abaixo de um limiar (ex.: < 1% das sessões administrativas), com logs completos.

---

## 2) Modelo conceitual: 2 camadas obrigatórias (Security vs Product Rights)

### 2.1 Security / Authorization (por usuário)
**Pergunta respondida:** “Este usuário pode fazer esta ação neste recurso, neste contexto?”  
Componentes:
- Space membership
- Role (por Space)
- Capabilities (resource.action)
- Grants (add/deny, RO/RW, TTL, escopo)
- Policies (MFA, step‑up, approvals, IP, horário, rate)

### 2.2 Product Rights / Entitlements (por tenant)
**Pergunta respondida:** “Este tenant tem direito a esta feature/nível/quota?”  
Componentes:
- Plan baseline
- Products/Add‑ons effects
- Entitlement overrides (exceção comercial, TTL)
- Quotas/usage tracking

### 2.3 Regra de avaliação (contrato)
Para qualquer ação sensível:
1) `authorized = authorize(user, action, resource, scope, spaceContext)`
2) `entitled  = entitle(tenant, feature/limit, context)`
3) se quota: `within = quota_check(tenant, metric)`
4) **allow = authorized ∧ entitled ∧ within**

**Importante:** UI pode melhorar UX (locked/CTA), mas backend/domínio são a verdade.

---

## 3) Taxonomia e registry de Spaces (contrato estável)

### 3.1 Princípios de criação de Space
- Um Space existe para **um domínio** (operações/dados) com **limites claros**.
- Se dois domínios não deveriam se ver por padrão → não compartilham Space.
- Cada Space deve ter um **Owner** (ou grupo).

### 3.2 Registry recomendado (mínimo robusto)
1. **Strategy** (Founder/Executivo) — decisões: Home + Analytics  
2. **Access Control** — governança: Spaces/Roles, Requests, Grants, Policies, Audit (governança)  
3. **Management** — entidades: Tenants, Users, Invites  
4. **Monetization** — configuração comercial: Plans, Products, Features, Subscriptions, Currencies  
5. **Finance** — fatos financeiros: Revenue, Orders, Invoices, Payments, Billing  
6. **Support** — atendimento: Tickets (+ ferramentas sensíveis sob policy)  
7. **DevOps** — observabilidade e infra: Observability, Alerts, Logs (técnicos), Infra, External services  
8. **Marketing** — CRM, Campaigns, Goals (opcional / ativar quando usar)  
9. **Resources** — Documentation  
10. **Supreme** — break‑glass (superadmin mode)

### 3.3 Ownership e approvals
- Owners aprovam:
  - grants sensíveis no Space,
  - overrides permanentes,
  - políticas específicas.
- Founder pode ser owner de múltiplos Spaces no início, mas o sistema deve permitir delegação.

---

## 4) Capabilities: naming, granularidade, versionamento e bundles

### 4.1 Naming
Formato: `domain.resource.action` (ou `resource.action` com domínio implícito do Space). Recomendação:
- Preferir `domain.resource.action` para evitar colisão e facilitar auditoria.
Exemplos:
- `support.tickets.read`
- `support.tickets.update_status`
- `security.impersonation.start`
- `security.2fa_reset.execute`
- `finance.invoices.view`
- `devops.observability.view_metrics`
- `strategy.analytics.monetization.read`

### 4.2 Granularidade
- **Leitura** separada de **escrita** (`read` vs `create/update/delete`).
- Ações críticas separadas em capabilities próprias (ex.: `refund.execute` separado de `payments.view`).
- “Export” sempre separado (`*.export`).

### 4.3 Bundles (para UX e para reduzir caos)
Defina bundles (não como permissão final, mas como “atalho” de concessão):
- `support.agent.basic` → read tickets + comment + update_status
- `finance.analyst.basic` → view invoices/payments/revenue
- `devops.sre.basic` → view observability/logs/alerts
- `strategy.viewer` → view home + analytics
Bundles ajudam admin a conceder acesso sem marcar 50 checkboxes.

### 4.4 Versionamento e compatibilidade
Se você mudar uma capability:
- **não** renomeie silenciosamente.
- crie nova e mantenha a antiga por um período, com migração.
Isso evita refatorar roles/grants existentes.

---

## 5) Grants: modelo, lifecycle, regras anti‑explosão

### 5.1 Tipos de grant
- **Add grant**: adiciona capabilities ou bundles.
- **Deny grant**: remove capabilities mesmo que role conceda (essencial para exceções).
- **Read‑only grant**: transforma um conjunto em RO (ou remove write).
- **Time‑bound grant**: expira automaticamente (default).

### 5.2 Campos mínimos de grant (contrato de auditoria)
- `grant_id`
- `user_id`
- `space_id`
- `capabilities[]` (ou bundles resolvidos)
- `effect` (add/deny)
- `access_level` (RO/RW)
- `scope` (tenant:<id>, global, assigned, self, etc.)
- `created_by`
- `created_at`
- `expires_at` (default obrigatório)
- `reason` (texto obrigatório)
- `approval_chain` (opcional)
- `status` (active/revoked/expired)

### 5.3 Defaults obrigatórios (para robustez)
- Expiração padrão (ex.: 7 dias).
- RO por padrão.
- Deny wins.
- Grants sensíveis exigem policy extra.

### 5.4 Revisões (Access Review)
- Relatório de grants ativos por Space.
- Alertas:
  - grants sem expiração,
  - grants sensíveis,
  - grants multi‑space,
  - grants de export/PII/impersonation.

---

## 6) Policies: step‑up auth, approvals, constraints

Policies são o “terceiro trilho” que impede abuso mesmo com capability.

### 6.1 Tipos de policy
- **MFA required** para certas actions/spaces.
- **Step‑up** por ação crítica (re‑MFA + confirmação).
- **4‑eyes approval** (dupla aprovação) para ações extremas (opcional).
- **IP allowlist** para acesso a determinados Spaces (ex.: Supreme).
- **Time window** (horário comercial, janelas).
- **Rate limits** por usuário/ação (ex.: 2FA reset, impersonation).

### 6.2 Onde policies se aplicam
- Em nível de Space
- Em nível de capability/action
- Em nível de riskLevel
- Em nível de usuário (exceção)

---

## 7) Space Supremo (Superadmin) — especificação completa (Break‑Glass)

> Objetivo: permitir debug e contingência sem destruir o modelo de segurança.

### 7.1 Filosofia
- Não é um Space “de trabalho”.
- É um **modo temporário**.
- Possui atrito intencional e rastreabilidade máxima.

### 7.2 Naming/UX (para evitar acidente)
UI label recomendado: **Break‑Glass Mode**  
Interno (config/flags): `SUPREME` ou `SUPERADMIN`

Elementos obrigatórios:
- Banner fixo “BREAK‑GLASS MODE”
- Contador de tempo (TTL)
- Motivo (reason) sempre visível
- Watermark leve
- Ações críticas agrupadas em “zona de risco”
- Botão “Encerrar modo” sempre acessível

### 7.3 Entrada JIT (Just‑in‑Time)
Requisitos para ativar:
- reautenticação (senha)
- MFA obrigatório
- reason obrigatório
- opcional: ticket/incidente (ID)
- opcional: confirmação de “responsabilidade” (checkbox + texto)

### 7.4 TTL e revogação
- TTL default: 30 minutos (configurável)
- renovação exige nova justificativa + MFA
- auto‑revoke ao expirar

### 7.5 Read‑only default + step‑up por ação crítica
- Ao entrar, tudo é RO onde possível.
- Para RW:
  - step‑up (MFA novamente)
  - confirmação textual
  - logs premium
  - rate limit

### 7.6 Anti‑exfiltração default
Mesmo no Supreme:
- Export desabilitado por padrão
- PII mascarada por padrão
- Unlock exige capability separada + step‑up + audit

### 7.7 Catálogo de ações críticas (mínimo)
- `security.impersonation.start`
- `security.2fa_reset.execute`
- `finance.refund.execute`
- `monetization.subscription.override`
- `strategy.data_export.execute`
- `management.user.disable`
- `management.tenant.disable`
- `security.grant.permanent_create`

### 7.8 Auditoria premium (campos adicionais)
Além do audit normal, logar:
- tempo total em break‑glass
- páginas visitadas (high level)
- tenant(s) afetados
- diffs/antes‑depois (quando aplicável)
- justificativa final para ações críticas

### 7.9 Regra organizacional (“anti‑muleta”)
Se o uso do Supreme vira repetitivo:
- criar capability/policy no Space correto
- ou criar flow específico com approvals
- registrar como dívida técnica/governança

---

## 8) Sidebar: modelo data‑driven, algoritmo e metadados

### 8.1 Metadados de rota/página (contrato)
Cada página deve declarar:

- `route_id` (estável)
- `space_id`
- `title`
- `required_capabilities[]` (para ver/entrar)
- `required_entitlements[]` (para habilitar feature; opcional)
- `risk_level` (normal/sensitive/critical)
- `menu_behavior`:
  - `hidden_if_unauthorized` (sempre)
  - `locked_if_not_entitled` (opcional)
- `badge_rules`:
  - show TEMP se grant foi origem
  - show LOCKED se entitlement falta
  - show LIMITED se RO forçado
- `deep_link_behavior` (o que mostrar ao falhar)

### 8.2 Algoritmo de renderização do menu
Para cada item:
1) Calcular `authorized_for_read` (capabilities + grants + policies)
2) Se false → não renderizar (hidden)
3) Se true:
   - se entitlements exigidos existem:
     - se `entitled=false`:
       - se menu_behavior permite locked → render locked com CTA
       - senão → hidden
     - se `entitled=true` → render enabled
4) Aplicar badges:
   - TEMP/SPECIAL se origem foi grant
   - LIMITED se RO
   - LOCKED se não‑entitled
5) Exibir tooltip “why you have access” quando aplicável

### 8.3 “Why you have access” (explicabilidade)
Tooltip/painel deve mostrar:
- role no Space
- grants ativos relacionados (com expires_at)
- policies aplicadas (ex.: “MFA required”)
- owner/responsável

---

## 9) Gating por plano: entitlements, quotas e estados de UI

### 9.1 Registry de entitlements (contrato)
Cada entitlement tem:
- `key` (estável)
- `type` (bool, numeric, tiered, window)
- `default`
- `source_of_truth` (plan/product/override)
- `sensitivity` (normal/sensitive) para decisões de UI (mostrar locked vs hidden)

Exemplos:
- `crm.enabled` (bool)
- `files.enabled` (bool)
- `exports.level` (tiered: none/basic/full)
- `users.max` (numeric)
- `api.calls.month` (windowed numeric)

### 9.2 Quotas: enforcement no domínio
- O domínio que cria/consome recurso é responsável por:
  - incrementar usage
  - checar limites antes de executar
- Política de downgrade:
  - nunca deletar automaticamente
  - bloquear novas criações e guiar o usuário a resolver

### 9.3 Estados de menu (hidden/locked/enabled)
Definir por Space:
- **Strategy**: locked pode ser útil (upsell)
- **Spaces operacionais** (Support/DevOps/Finance): preferir hidden quando irrelevante

### 9.4 Eventos de produto (para Analytics e decisões)
Registrar:
- `blocked_by_plan`
- `limit_hit`
- `upgrade_intent`
- `upgrade_completed`
- `entitlement_override_granted`

---

## 10) Reorganização do sidebar atual (migração sem dor)

### 10.1 Problemas identificados no sidebar atual
- Duplicidade: “Logs” vs “Audit Logs”
- Duplicidade: “Observability Dashboard” vs “Grafana/Prometheus”
- Termo ambíguo: “Dashboard” (genérico)
- Itens de governança espalhados (2FA reset / impersonation / grants futuros)

### 10.2 Nova alocação (mapa final)
**Strategy**
- Home (novo nome para “Dashboard” executivo)
- Analytics

**Access Control**
- Spaces & Roles
- Access Requests
- Grants
- Policies
- Audit Logs (Governance)

**DevOps**
- Observability
- Alerts
- Logs (técnicos)
- Infrastructure (aba interna)
- External Services
- Grafana/Prometheus (links internos)

**Support**
- Tickets
- (opcional) Support Overview
- Impersonation (só com policy)
- 2FA Reset (request/execute com policy)

**Management** / **Finance** / **Monetization** / **Resources** mantêm como domínios puros.

### 10.3 “Platform Settings”
Evitar virar um saco de gatos:
- Quebre em:
  - Security/Policies (Access Control)
  - Infra/Integrations técnicas (DevOps)
  - Config comercial (Monetization/Finance)
Se insistir em manter “Platform Settings” como menu único:
- coloque no **Access Control** e transforme em “Platform & Security Settings”.

---

## 11) Fluxos completos (end‑to‑end) — requests, grants, badges, revogação

### 11.1 Sistema de Solicitação de Acesso (Access Request)
**State machine:**
- `draft → submitted → triaged → approved|rejected → (approved → grant_created) → closed`
Campos:
- requester, target_space, target_page/capability, desired_level (RO/RW), duration, reason, urgency, attachments.

Regras:
- RW sempre exige justificativa reforçada
- duração default e limites máximos (ex.: 30 dias)
- owners aprovam; founder pode override (auditado)

### 11.2 UI de Concessão (Grant Creation)
O aprovador deve:
- ver preview do impacto (quais páginas aparecerão)
- ajustar:
  - RO/RW
  - escopo (tenant específico, assigned, etc.)
  - expiração
- confirmar com resumo final (anti‑erro)

### 11.3 Badges
- TEMP: concedido via grant temporário
- SPECIAL: exceção permanente (desencorajar; exigir approval)
- LIMITED: RO forçado
- LOCKED: falta entitlement do tenant

### 11.4 Revogação e expiração
- expiração automática remove imediatamente acesso
- UI notifica requester e owner
- logs registram revogação/expiração

---

## 12) Testes, validações e segurança (sem isso, o sistema “parece” robusto mas não é)

### 12.1 Matriz de personas (test plan)
Criar contas de teste:
- Support Agent (apenas Support)
- Support Lead (Support + approvals)
- SRE (DevOps)
- Finance Analyst (Finance)
- Monetization Admin (Monetization)
- Founder (Strategy + Access Control)
- Supreme operator (Founder + break‑glass)

### 12.2 Testes obrigatórios
- Navegação: itens não aparecem sem capability
- Deep link: sempre bloqueia corretamente
- Gating: endpoints bloqueiam sem entitlement
- Quotas: bloqueiam criação acima do limite
- Grants: expiram e revogam
- Badges: aparecem e explicam “why”
- Supreme:
  - exige MFA/reauth
  - TTL expira
  - RW exige step‑up
  - export/PII bloqueados por default

### 12.3 Auditoria e logging
- Eventos mínimos:
  - `access_request_submitted`
  - `grant_created/revoked/expired`
  - `break_glass_entered/exited`
  - `critical_action_attempted/executed/denied`
  - `blocked_by_plan/limit_hit`

### 12.4 Threat model (ameaças e mitigação)
- Curiosidade interna → mitigado por space separation + hidden menus + audit
- Exfiltração via export → mitigado por export capability + step‑up + logs
- Uso “rotineiro” do Supreme → mitigado por TTL + atrito + métricas de uso
- Misturar audit logs com logs técnicos → mitigado por separação de Space e nomenclatura

---

## 13) Plano de implementação (fases profundas, tarefas, critérios de aceite e rollback)

> O plano abaixo assume que você quer evitar refatorar depois, então a ordem privilegia **contratos estáveis primeiro**.

### Fase 0 — Congelar contratos (antes de mover qualquer página)
**Entregas**
- Space Registry (IDs estáveis)
- Capability Registry (naming + bundles)
- Entitlement Registry (keys estáveis)
- Route Metadata schema (capabilities/entitlements/risk/menu)
- Definição de Owners e regras de approval

**Aceite**
- documento assinado internamente (você + time)
- nenhum item de menu existe sem metadata

**Rollback**
- n/a (apenas documentos/metadata)

---

### Fase 1 — Navegação data‑driven + Space Switcher robusto
**Tarefas**
- Implementar Space Switcher com badges e search
- Implementar Sidebar renderizada por metadata
- Implementar “why you have access”
- Implementar deep‑link guard padrão (frontend) + enforcement backend

**Aceite**
- 0 páginas visíveis sem capability
- 100% das rotas passam por authorize()
- tooltips corretos para itens via grant

**Rollback**
- fallback para sidebar antiga (feature flag) enquanto valida

---

### Fase 2 — Access Control Space (governança)
**Tarefas**
- Páginas:
  - Spaces & Roles (capability selector, bundles)
  - Access Requests (fila, SLA, triage)
  - Grants (create/revoke/extend)
  - Policies (MFA, step‑up, approvals)
  - Audit Logs (governança)
- Expiração default + alertas de grants sem expiração
- Badges TEMP/SPECIAL/LIMITED

**Aceite**
- grants expiram automaticamente
- cada concessão registra reason + created_by
- owners aprovam requests
- auditoria completa

**Rollback**
- desabilitar requests/grants UI mantendo RBAC básico (temporário)

---

### Fase 3 — Reorganizar sidebar atual (mover itens para Spaces corretos)
**Tarefas**
- Renomear “Dashboard” → “Home” (Strategy)
- Garantir “Analytics” apenas em Strategy
- DevOps:
  - Observability como item principal
  - Grafana/Prometheus como links
  - Logs técnicos ficam aqui
- Mover Audit Logs (governança) para Access Control
- Ajustar Support:
  - separar request/execute para 2FA reset
  - Impersonation sob policy

**Aceite**
- zero duplicidade no menu
- usuários de um Space não veem itens de outro
- links e redirects funcionam

**Rollback**
- redirects reversíveis + feature flag por Space

---

### Fase 4 — Integrar entitlements ao menu (locked/hidden) + enforcement total
**Tarefas**
- Implementar estados hidden/locked/enabled por item (config por Space)
- Garantir backend: entitle() em endpoints e domain services
- Quota enforcement consistente
- Telemetria: blocked_by_plan e limit_hit

**Aceite**
- 100% endpoints gated corretamente
- locked mostra CTA correto (Strategy)
- hidden em spaces operacionais quando irrelevante

**Rollback**
- desligar locked/hidden states mantendo backend gating (seguro)

---

### Fase 5 — Space Supremo Break‑Glass
**Tarefas**
- Flow JIT entry (reauth + MFA + reason)
- TTL e auto‑revoke
- UI de risco
- step‑up por ação crítica
- anti‑exfiltração default
- logs premium

**Aceite**
- nenhum acesso ao Supreme sem MFA + reason
- TTL sempre expira
- ações críticas exigem step‑up e são auditadas
- export/PII bloqueados por default

**Rollback**
- desabilitar Supreme (hard off) sem afetar outros Spaces

---

### Fase 6 — Refinar dashboards (sem inflar)
**Tarefas**
- Strategy/Home: visão executiva enxuta
- Strategy/Analytics: métricas profundas e coerentes
- DevOps/Observability: remover redundâncias
- Support Overview opcional (se justificar)

**Aceite**
- 1 overview por Space (no máximo)
- termos consistentes
- dashboards não misturam domínios

---

## 14) Regras finais (lei do sistema)

1) **Metadata primeiro**: menus e rotas são gerados por contrato, não por if.
2) **Role cobre 90%**; grants são exceção com TTL.
3) **RO por default** sempre.
4) **Deny wins** sempre.
5) **Supreme é emergência**: se virou rotina, corrigir o modelo.
6) **Entitlement ≠ permissão**: tenant vs usuário.
7) **Audit logs (governança) ≠ logs técnicos**.
8) **Naming é segurança**: nomes claros evitam pedidos de acesso errados.
9) **Toda ação crítica tem step‑up + log premium**.

---

## 15) Apêndices

### Apêndice A — Checklist por página nova
1) Qual Space?  
2) Quais capabilities mínimas?  
3) Quais entitlements?  
4) Qual riskLevel?  
5) Quais policies?  
6) Qual audit requirement?  
7) Qual comportamento de menu (hidden/locked/enabled)?

### Apêndice B — Mínimo para “ações críticas”
- confirmação forte
- step‑up MFA
- rate limit
- log premium (diff + reason)

### Apêndice C — Métricas de governança recomendadas
- grants ativos por Space
- grants sem expiração
- requests por categoria (aprovado/rejeitado)
- uso do Supreme (sessões e ações)
- blocked_by_plan e limit_hit por feature/quota
