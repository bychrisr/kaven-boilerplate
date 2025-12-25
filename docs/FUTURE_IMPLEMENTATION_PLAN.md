# Plano de Implementação Futura (Phase 1 Remaining)

Este documento detalha as etapas restantes para concluir a **Fase 1 (MVP)** do Kaven Boilerplate. Baseado na comparação entre o estado atual e os requisitos de `Phase 0 - FOUNDATION`.

---

## 📅 Visão Geral

- **Status Atual:** 60% Concluído (Backend Core OK, Frontend Core OK)
- **Foco:** Payments, Observability, Testes e CI/CD.

---

## 1. 💰 Módulo de Pagamentos (Weeks 5-6)

Falta implementar a integração real com gateways de pagamento.

### 1.1 Stripe Integration

- [ ] Setup do Stripe SDK no backend
- [ ] Criar Products/Prices no Stripe via seed ou script
- [ ] Implementar Checkout Session (Subscription)
- [ ] Webhook Handler (checkout.session.completed, invoice.payment_succeeded)
- [ ] Portal do Cliente (Billing Portal)

### 1.2 Pix Integration (Braspag ou Iugu ou Stripe)

- [ ] Decidir provedor (ex: Stripe boleto/pix ou provedor local)
- [ ] Implementar geração de QR Code
- [ ] Webhook para confirmação de pagamento

---

## 2. 📊 Observability & DevOps (Weeks 5-6)

Monitoramento real da infraestrutura.

### 2.1 Stack Prometheus + Grafana

- [ ] Configurar container `prometheus` no docker-compose
- [ ] Configurar container `grafana` com dashboards pré-carregados
- [ ] Expor métricas da API (`/metrics` endpoint no Fastify)
- [ ] Criar Dashboard: "Kaven Overview" (RPS, Error Rate, Latency)

### 2.2 Logging Centralizado

- [ ] Verificar persistência de logs do Winston/Pino
- [ ] Integrar logs com Loki ou visualizar via Docker

---

## 3. 🖥️ Frontend Completion (Weeks 7-8)

Telas faltantes para gestão completa.

### 3.1 Tenant & Admin Management

- [ ] **Tenant List:** Filtros avançados, Status toggle
- [ ] **Tenant Details:** Visualizar uso, plano atual
- [ ] **Invoices/Orders:** Telas de listagem e detalhe (apenas UI existe no menu)

### 3.2 Páginas de Erro e Suporte

- [ ] Página 404 Customizada (Not Found)
- [ ] Página 500 Customizada (Internal Error)
- [ ] Página "Maintenance Mode"
- [ ] Página "Coming Soon" (para features futuras)

---

## 4. 🧪 Quality Assurance & CI/CD

Garantia de qualidade antes do v1.0.

### 4.1 Testes Automatizados

- [ ] **Unit:** Jest/Vitest para Services e Utils (Target 80%)
- [ ] **Integration:** Supertest para Endpoints da API
- [ ] **E2E:** Playwright/Cypress para fluxos críticos (Login -> Dashboard -> Logout)

### 4.2 Pipeline CI/CD (GitHub Actions)

- [ ] Workflow `ci.yml`: Build + Test + Lint
- [ ] Workflow `release.yml`: Semantic Release + Docker Push
- [ ] Configurar proteção de branch (main)

---

## 📝 Resumo das Prioridades

1. **Frontend Pages (Tenant/Invoices)** - Valor visível imediato
2. **Payments** - Monetização
3. **Tests** - Estabilidade
4. **Observability** - Operação de Produção

---

**Última Atualização:** 25/12/2025
**Autor:** Antigravity Agent
