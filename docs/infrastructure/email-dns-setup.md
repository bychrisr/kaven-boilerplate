# Guia de Configuração DNS para E-mail

**Projeto:** Kaven v2.0 SaaS Platform  
**Última Atualização:** 2026-01-15

---

## 📋 Visão Geral

Este guia detalha a configuração completa de DNS necessária para garantir alta entregabilidade de e-mails (83%+ inbox placement) e conformidade com padrões de autenticação (SPF, DKIM, DMARC).

### Objetivos

- ✅ Configurar autenticação SPF/DKIM/DMARC
- ✅ Isolar fluxos transacionais vs. marketing
- ✅ Atingir score 10/10 no Mail Tester
- ✅ Prevenir spoofing e phishing
- ✅ Habilitar BIMI (Brand Indicators for Message Identification)

---

## 🎯 Arquitetura de Subdomínios

### Por que usar subdomínios isolados?

**Benefícios:**

1. **Proteção de Reputação**: Se e-mails de marketing receberem spam complaints, não afeta e-mails transacionais críticos
2. **Políticas DMARC Diferentes**: Permite `p=reject` em transacional e `p=quarantine` em marketing
3. **Warm-up Independente**: Cada subdomínio pode ter seu próprio cronograma de aquecimento
4. **Monitoramento Granular**: Métricas separadas por tipo de e-mail

### Estrutura Proposta

```
kaven.com (domínio principal)
├── auth.kaven.com → E-mails Transacionais
│   ├── Welcome emails
│   ├── Password reset
│   ├── Email verification
│   ├── Invoices
│   └── Security alerts
│
└── mail.kaven.com → E-mails de Marketing
    ├── Newsletters
    ├── Product updates
    ├── Lifecycle campaigns
    └── Announcements
```

---

## 🔧 Configuração no Cloudflare

### Passo 1: Acessar DNS Management

1. Login no Cloudflare: https://dash.cloudflare.com/
2. Selecione o domínio `kaven.com`
3. Navegue para **DNS** > **Records**

### Passo 2: Adicionar Registros DNS

Copie e cole os registros abaixo, substituindo os valores conforme seu provedor:

#### Tabela de Registros Completa

| Tipo    | Nome                 | Conteúdo                                    | TTL  | Proxy Status | Notas                   |
| ------- | -------------------- | ------------------------------------------- | ---- | ------------ | ----------------------- |
| **A**   | `auth`               | `IP_DO_SERVIDOR` ou CNAME do provedor       | 3600 | DNS only     | Subdomínio transacional |
| **A**   | `mail`               | `IP_DO_SERVIDOR` ou CNAME do provedor       | 3600 | DNS only     | Subdomínio marketing    |
| **MX**  | `@`                  | `10 mail.kaven.com`                         | 3600 | DNS only     | Mail exchange principal |
| **TXT** | `@`                  | `v=spf1 include:spf.postmarkapp.com ~all`   | 3600 | DNS only     | SPF record              |
| **TXT** | `_dmarc`             | Ver abaixo                                  | 3600 | DNS only     | DMARC policy            |
| **TXT** | `pm._domainkey.auth` | Fornecido pelo provedor                     | 3600 | DNS only     | DKIM auth subdomain     |
| **TXT** | `pm._domainkey.mail` | Fornecido pelo provedor                     | 3600 | DNS only     | DKIM mail subdomain     |
| **TXT** | `_mta-sts`           | `v=STSv1; id=TIMESTAMP`                     | 3600 | DNS only     | TLS enforcement         |
| **TXT** | `default._bimi`      | `v=BIMI1; l=https://kaven.com/logo.svg; a=` | 3600 | DNS only     | Brand logo              |

---

## 📝 Detalhamento dos Registros

### 1. SPF (Sender Policy Framework)

**Registro TXT para `@` (domínio raiz):**

```
v=spf1 include:spf.postmarkapp.com ~all
```

**Explicação:**

- `v=spf1`: Versão do SPF
- `include:spf.postmarkapp.com`: Autoriza servidores do Postmark a enviar e-mails
- `~all`: Soft fail (recomendado inicialmente, mudar para `-all` após validação)

**Provedores Alternativos:**

- **Resend**: `v=spf1 include:_spf.resend.com ~all`
- **SendGrid**: `v=spf1 include:sendgrid.net ~all`
- **AWS SES**: `v=spf1 include:amazonses.com ~all`

**⚠️ Importante:**

- Máximo de 10 lookups DNS (limite do SPF)
- Use SPF Flattener se tiver múltiplos includes: https://dmarcian.com/spf-survey/

---

### 2. DKIM (DomainKeys Identified Mail)

**Registros TXT para subdomínios:**

```
Nome: pm._domainkey.auth.kaven.com
Valor: [FORNECIDO PELO PROVEDOR APÓS ADICIONAR DOMÍNIO]

Nome: pm._domainkey.mail.kaven.com
Valor: [FORNECIDO PELO PROVEDOR APÓS ADICIONAR DOMÍNIO]
```

**Como obter a chave DKIM:**

#### Postmark

1. Acesse: https://account.postmarkapp.com/servers
2. Clique no servidor
3. Vá em **Settings** > **Sender Signatures**
4. Adicione `auth.kaven.com` e `mail.kaven.com`
5. Copie os valores DKIM fornecidos

#### Resend

1. Acesse: https://resend.com/domains
2. Clique em **Add Domain**
3. Adicione `auth.kaven.com` e `mail.kaven.com`
4. Copie os registros DKIM

**Exemplo de valor DKIM (Postmark):**

```
k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
```

---

### 3. DMARC (Domain-based Message Authentication)

**Registro TXT para `_dmarc.kaven.com`:**

#### Fase 1: Monitoramento (Primeiros 30 dias)

```
v=DMARC1; p=none; rua=mailto:dmarc@kaven.com; ruf=mailto:dmarc@kaven.com; aspf=s; adkim=s; pct=100; fo=1
```

#### Fase 2: Quarentena (Dias 31-60)

```
v=DMARC1; p=quarantine; rua=mailto:dmarc@kaven.com; ruf=mailto:dmarc@kaven.com; aspf=s; adkim=s; pct=100; fo=1
```

#### Fase 3: Rejeição (Após 60 dias - Estado Final)

```
v=DMARC1; p=reject; rua=mailto:dmarc@kaven.com; ruf=mailto:dmarc@kaven.com; aspf=s; adkim=s; pct=100; fo=1
```

**Explicação dos parâmetros:**

- `v=DMARC1`: Versão do DMARC
- `p=none|quarantine|reject`: Política de enforcement
- `rua=`: E-mail para relatórios agregados (diários)
- `ruf=`: E-mail para relatórios forenses (falhas individuais)
- `aspf=s`: SPF strict alignment
- `adkim=s`: DKIM strict alignment
- `pct=100`: Aplicar política em 100% dos e-mails
- `fo=1`: Gerar relatório se SPF ou DKIM falhar

**📊 Análise de Relatórios DMARC:**

- Use ferramentas como https://dmarcian.com/ ou https://dmarc.postmarkapp.com/
- Monitore relatórios semanalmente durante warm-up

---

### 4. MTA-STS (SMTP TLS Reporting)

**Registro TXT para `_mta-sts.kaven.com`:**

```
v=STSv1; id=20260115000000
```

**Arquivo de política (hospedar em `https://mta-sts.kaven.com/.well-known/mta-sts.txt`):**

```
version: STSv1
mode: enforce
mx: mail.kaven.com
max_age: 604800
```

**Benefício:** Força uso de TLS em conexões SMTP, prevenindo downgrade attacks.

---

### 5. BIMI (Brand Indicators for Message Identification)

**Registro TXT para `default._bimi.kaven.com`:**

```
v=BIMI1; l=https://kaven.com/logo.svg; a=
```

**Requisitos:**

- Logo em formato SVG Tiny PS (profile específico)
- DMARC com `p=quarantine` ou `p=reject`
- Certificado VMC (Verified Mark Certificate) - opcional mas recomendado

**Onde aparece:**

- Gmail (desktop e mobile)
- Yahoo Mail
- Apple Mail (iOS 16+)

**Ferramenta de validação:** https://bimigroup.org/bimi-generator/

---

## ✅ Checklist de Validação

### Após Configurar DNS (aguardar 24-48h para propagação)

- [ ] **SPF Validado**
  - Ferramenta: https://mxtoolbox.com/spf.aspx
  - Resultado esperado: "SPF Record found" com status verde

- [ ] **DKIM Ativo**
  - Enviar e-mail de teste
  - Ver headers (Gmail: "Show original")
  - Procurar por `dkim=pass`

- [ ] **DMARC Configurado**
  - Ferramenta: https://mxtoolbox.com/dmarc.aspx
  - Resultado esperado: Registro encontrado e válido

- [ ] **MX Records Resolvendo**

  ```bash
  dig MX kaven.com +short
  # Deve retornar: 10 mail.kaven.com
  ```

- [ ] **Subdomínios Resolvendo**
  ```bash
  dig auth.kaven.com +short
  dig mail.kaven.com +short
  # Devem retornar IPs ou CNAMEs
  ```

---

## 🔍 Scripts de Validação

### Script Bash (Linux/Mac)

Salve como `validate-dns.sh`:

```bash
#!/bin/bash

DOMAIN="kaven.com"
AUTH_SUBDOMAIN="auth.kaven.com"
MAIL_SUBDOMAIN="mail.kaven.com"

echo "🔍 Validando DNS para $DOMAIN..."
echo ""

# SPF
echo "📧 SPF Record:"
dig TXT $DOMAIN +short | grep "v=spf1"
echo ""

# DKIM (auth)
echo "🔐 DKIM (auth subdomain):"
dig TXT pm._domainkey.$AUTH_SUBDOMAIN +short
echo ""

# DKIM (mail)
echo "🔐 DKIM (mail subdomain):"
dig TXT pm._domainkey.$MAIL_SUBDOMAIN +short
echo ""

# DMARC
echo "🛡️ DMARC Record:"
dig TXT _dmarc.$DOMAIN +short
echo ""

# MX
echo "📬 MX Records:"
dig MX $DOMAIN +short
echo ""

# Subdomains
echo "🌐 Auth Subdomain:"
dig A $AUTH_SUBDOMAIN +short
echo ""

echo "🌐 Mail Subdomain:"
dig A $MAIL_SUBDOMAIN +short
echo ""

echo "✅ Validação completa!"
```

**Executar:**

```bash
chmod +x validate-dns.sh
./validate-dns.sh
```

### Script Node.js

Criar em `apps/api/scripts/validate-email-dns.ts`:

```typescript
import { execSync } from 'child_process';

const DOMAIN = 'kaven.com';
const AUTH_SUBDOMAIN = 'auth.kaven.com';
const MAIL_SUBDOMAIN = 'mail.kaven.com';

interface ValidationResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

const results: ValidationResult[] = [];

function checkDNS(
  type: string,
  domain: string,
  expected?: string,
): ValidationResult {
  try {
    const output = execSync(`dig ${type} ${domain} +short`, {
      encoding: 'utf-8',
    });

    if (!output.trim()) {
      return {
        name: `${type} ${domain}`,
        status: 'fail',
        message: 'Nenhum registro encontrado',
      };
    }

    if (expected && !output.includes(expected)) {
      return {
        name: `${type} ${domain}`,
        status: 'warning',
        message: `Encontrado: ${output.trim()}, Esperado: ${expected}`,
      };
    }

    return {
      name: `${type} ${domain}`,
      status: 'pass',
      message: output.trim(),
    };
  } catch (error) {
    return {
      name: `${type} ${domain}`,
      status: 'fail',
      message: 'Erro ao verificar DNS',
    };
  }
}

console.log('🔍 Validando configuração DNS de e-mail...\n');

// SPF
results.push(checkDNS('TXT', DOMAIN, 'v=spf1'));

// DKIM
results.push(checkDNS('TXT', `pm._domainkey.${AUTH_SUBDOMAIN}`));
results.push(checkDNS('TXT', `pm._domainkey.${MAIL_SUBDOMAIN}`));

// DMARC
results.push(checkDNS('TXT', `_dmarc.${DOMAIN}`, 'v=DMARC1'));

// MX
results.push(checkDNS('MX', DOMAIN));

// Subdomains
results.push(checkDNS('A', AUTH_SUBDOMAIN));
results.push(checkDNS('A', MAIL_SUBDOMAIN));

// Print results
console.log('📊 Resultados:\n');
results.forEach((result) => {
  const icon =
    result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
  console.log(`${icon} ${result.name}`);
  console.log(`   ${result.message}\n`);
});

const failCount = results.filter((r) => r.status === 'fail').length;
const warnCount = results.filter((r) => r.status === 'warning').length;

console.log('\n📈 Resumo:');
console.log(`   Passou: ${results.length - failCount - warnCount}`);
console.log(`   Avisos: ${warnCount}`);
console.log(`   Falhou: ${failCount}`);

if (failCount === 0 && warnCount === 0) {
  console.log('\n🎉 Todos os registros DNS estão configurados corretamente!');
  process.exit(0);
} else {
  console.log('\n⚠️ Alguns registros precisam de atenção.');
  process.exit(1);
}
```

**Executar:**

```bash
cd apps/api
pnpm tsx scripts/validate-email-dns.ts
```

---

## 🚨 Troubleshooting

### Problema: SPF "Too Many DNS Lookups"

**Causa:** SPF tem limite de 10 lookups DNS.

**Solução:**

1. Use SPF Flattener: https://dmarcian.com/spf-survey/
2. Ou simplifique includes:
   ```
   v=spf1 ip4:192.0.2.1 ip4:192.0.2.2 ~all
   ```

### Problema: DKIM não validando

**Causas comuns:**

- Chave DKIM não propagada (aguardar 24-48h)
- Selector incorreto (deve ser `pm` para Postmark)
- Espaços extras no valor TXT

**Validação:**

```bash
dig TXT pm._domainkey.auth.kaven.com +short
```

### Problema: DMARC reports não chegando

**Causas:**

- E-mail `dmarc@kaven.com` não existe
- Filtros de spam bloqueando relatórios

**Solução:**

- Criar alias ou caixa de e-mail real
- Usar serviço de análise DMARC (Postmark DMARC Analytics)

---

## 📚 Recursos Adicionais

### Ferramentas de Validação

- **MXToolbox**: https://mxtoolbox.com/
- **DMARC Analyzer**: https://www.dmarcanalyzer.com/
- **Mail Tester**: https://www.mail-tester.com/
- **Google Admin Toolbox**: https://toolbox.googleapps.com/apps/checkmx/

### Documentação Oficial

- **SPF**: https://www.rfc-editor.org/rfc/rfc7208
- **DKIM**: https://www.rfc-editor.org/rfc/rfc6376
- **DMARC**: https://dmarc.org/overview/
- **BIMI**: https://bimigroup.org/

### Monitoramento de Reputação

- **Google Postmaster Tools**: https://postmaster.google.com/
- **Microsoft SNDS**: https://sendersupport.olc.protection.outlook.com/snds/
- **Spamhaus**: https://www.spamhaus.org/

---

## 🎯 Próximos Passos

Após configurar e validar o DNS:

1. ✅ Aguardar propagação completa (24-48h)
2. ✅ Executar scripts de validação
3. ✅ Enviar e-mail de teste e verificar headers
4. ✅ Validar score no Mail Tester (target: 10/10)
5. ✅ Configurar webhooks no provedor
6. ✅ Iniciar warm-up period (30 dias)

**Documento relacionado:** `email-go-live-checklist.md`
