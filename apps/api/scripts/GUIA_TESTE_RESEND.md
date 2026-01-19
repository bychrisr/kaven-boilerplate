# Guia: Re-configurar Resend e Testar Métricas

**Data:** 2026-01-19

---

## 🎯 Objetivo

Re-configurar integração Resend com a nova `ENCRYPTION_KEY` e testar fluxo completo de métricas.

---

## 📋 Passo a Passo

### 1. Re-configurar Resend via Admin Panel

**Acesso:**

- URL: `http://localhost:3000/admin` (ou URL do seu ambiente)
- Usuário: `admin@kaven.dev`
- Senha: `Admin@123`

**Navegação:**

1. Login no Admin Panel
2. Ir em **Platform Settings** (menu lateral)
3. Clicar na aba **Integrations**
4. Encontrar **Email Providers**
5. Clicar em **Edit** na integração **Resend**

**Configuração:**

- **Provider:** Resend (já selecionado)
- **Status:** Active ✅
- **Primary:** ❌ (deixar SMTP como primário por enquanto)
- **API Key:** `re_...` (sua chave Resend)
- **From Email:** `no-reply@kaven.site` (já configurado)
- **From Name:** `Kaven` (já configurado)

**Salvar:**

- Clicar em **Save**
- Sistema irá criptografar a API key com a nova `ENCRYPTION_KEY`

---

### 2. Verificar Integração Configurada

```bash
cd apps/api
npx tsx scripts/check-resend-integration.ts
```

**Resultado Esperado:**

```
✅ Integração encontrada:
ID: 75ddeb38-e8dc-4bcf-929b-33d9e07df92e
Provider: RESEND
Active: true
Primary: false
From Email: no-reply@kaven.site
From Name: Kaven
API Key (encrypted): 67e7bdf2e8ed03bc4f8c...  ← DEVE TER VALOR!
```

---

### 3. Tornar Resend Primário Temporariamente

```sql
docker exec kaven-postgres psql -U kaven -d kaven_dev -c "
  UPDATE email_integrations SET is_primary = false;
  UPDATE email_integrations SET is_primary = true WHERE provider = 'RESEND';
  SELECT provider, is_active, is_primary FROM email_integrations;
"
```

**Resultado Esperado:**

```
 provider | is_active | is_primary
----------+-----------+------------
 SMTP     | t         | f
 RESEND   | t         | t          ← Primário agora!
```

---

### 4. Executar Teste de Métricas com Resend

```bash
cd apps/api
npx tsx scripts/test-email-metrics.ts 2>&1 | tee /tmp/test-resend.log
```

**O que será testado:**

1. ✅ Email enviado via **Resend** (não SMTP)
2. ✅ Email chegará no destinatário real
3. ✅ Métricas Prometheus registradas com `provider="RESEND"`
4. ✅ Métricas persistidas no banco com `provider = 'RESEND'`
5. ✅ Agregação funcionando (DB + Prometheus)

**Resultado Esperado:**

```
✅ TESTE PASSOU! Métricas persistidas com sucesso!
📊 Total: X emails
📈 Provider: RESEND (100% delivery rate)
💾 Banco: 1 registro criado (RESEND)
```

---

### 5. Verificar Email Recebido

**Checar inbox:**

- Email: `test@example.com` (ou email configurado no teste)
- Subject: `[TESTE] Validação de Métricas de Email`
- Template: `test-metrics`
- Provider: Resend (verificar headers do email)

---

### 6. Verificar Métricas no Banco

```sql
docker exec kaven-postgres psql -U kaven -d kaven_dev -c "
  SELECT
    provider,
    email_type,
    sent_count,
    created_at
  FROM email_metrics
  WHERE provider = 'RESEND'
  ORDER BY created_at DESC
  LIMIT 5;
"
```

**Resultado Esperado:**

```
 provider | email_type | sent_count |       created_at
----------+------------+------------+-------------------------
 RESEND   | TEST       |          1 | 2026-01-19 20:XX:XX
```

---

### 7. Restaurar SMTP como Primário

```sql
docker exec kaven-postgres psql -U kaven -d kaven_dev -c "
  UPDATE email_integrations SET is_primary = false;
  UPDATE email_integrations SET is_primary = true WHERE provider = 'SMTP';
  SELECT provider, is_active, is_primary FROM email_integrations;
"
```

**Resultado Esperado:**

```
 provider | is_active | is_primary
----------+-----------+------------
 RESEND   | t         | f
 SMTP     | t         | t          ← Primário novamente
```

---

## 🎯 Teste com Template Definitivo (Opcional)

Se quiser testar com o template `observability-alert` ao invés de `test-metrics`:

**Modificar script de teste:**

```typescript
// Em test-email-metrics.ts, trocar:
template: 'test-metrics'

// Por:
template: 'observability-alert'

// E adicionar variáveis:
templateData: {
  severity: 'INFO',
  severityClass: 'info',
  alertType: 'Teste de Métricas',
  serviceName: 'Email Service',
  message: 'Este é um teste do sistema de métricas de email.',
  timestamp: new Date().toISOString(),
  companyName: 'Kaven',
  dashboardUrl: 'http://localhost:3000/admin/observability'
}
```

---

## ✅ Checklist

- [ ] Re-configurar Resend via Admin Panel
- [ ] Verificar API key criptografada no banco
- [ ] Tornar Resend primário
- [ ] Executar teste de métricas
- [ ] Verificar email recebido
- [ ] Verificar métricas no banco (provider = RESEND)
- [ ] Restaurar SMTP como primário
- [ ] (Opcional) Testar com template observability-alert

---

## 🚨 Troubleshooting

### Erro: "Resend API key is required"

**Causa:** API key não foi salva ou não foi descriptografada corretamente.

**Solução:**

1. Verificar se ENCRYPTION_KEY está na raiz (`.env`)
2. Re-salvar integração Resend via Admin Panel
3. Verificar logs do EmailService

### Erro: "Template not found: observability-alert"

**Causa:** Template não foi inserido no banco.

**Solução:**

```bash
cd apps/api
docker exec -i kaven-postgres psql -U kaven -d kaven_dev < scripts/seed-observability-alert-template.sql
```

### Email não chegou

**Causa:** Possível problema com domínio ou API key Resend.

**Solução:**

1. Verificar logs do Resend (dashboard Resend)
2. Verificar se domínio está verificado
3. Testar com email de teste do Resend

---

**Pronto para testar!** 🚀
