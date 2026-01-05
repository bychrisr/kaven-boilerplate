# Resposta às Perguntas Técnicas - PagueBit API

Obrigado pelas respostas! Seguem esclarecimentos adicionais necessários:

---

## 🎯 Objetivo da Integração

Queremos **integralizar ao máximo** nossa aplicação com o PagueBit.

**Visão:** Usuário configura credenciais uma vez e gerencia tudo pela nossa plataforma, sem precisar alternar entre sistemas.

---

## 🔍 QR Code Estático

Observamos que o QR Code Estático é gerado automaticamente na loja e pode ser baixado.

**Perguntas:**

1. Existe endpoint para **buscar o QR Code Estático** da loja via API?
   - Para exibir na nossa aplicação sem precisar fazer upload manual

2. Recebemos webhook para pagamentos feitos via QR Estático?
   - Para rastrear transações de ponta a ponta

**Observação:** Entendemos que QR Estático não será nosso foco principal (usaremos mais QR Dinâmico com valor fixo), mas seria útil para casos específicos.

---

## 🔍 Integração com Loja Virtual

Vimos no dashboard que existe funcionalidade de Loja Virtual com produtos.

**Pergunta Principal:**

**É possível gerenciar produtos da Loja Virtual via API?**

- Criar produto
- Atualizar produto
- Deletar produto
- Listar produtos

**Objetivo:** Sincronizar produtos criados na nossa plataforma com a Loja Virtual do PagueBit automaticamente.

---

## ❓ Esclarecimentos Adicionais

### 1. Status de Revisão

Entendemos que:

- Limite diário: R$ 6.000 por CPF
- Ao ultrapassar: `review` → `not_approved` → reembolso automático

**Perguntas:**

- Recebemos webhook com status `review`?
- Quanto tempo entre `review` e `not_approved`?

### 2. Expiração de QR Code

- Após 10 minutos, pagamento muda para `expired` ou permanece `pending`?
- Se cliente pagar QR expirado, o que acontece?

### 3. Cancelamento

- Existe endpoint para cancelar pagamento `pending`?

### 4. Rate Limiting

- API retorna headers informativos (`X-RateLimit-Remaining`, `X-RateLimit-Reset`)?
