# 🛡️ Guia de Troubleshooting: Autenticação & "Zombie Sessions"

Este guia documenta o problema de "Zombie Session Loop" encontrado e resolvido em Dezembro/2025, para referência futura.

## 🚨 Sintoma: O Loop Infinito

1. Usuário faz login com sucesso (`200 OK`, recebe tokens).
2. Usuário é redirecionado para o Dashboard.
3. Dashboard pisca e usuário volta para o Login.
4. Console mostra erro `401 Unauthorized` em `/api/users/me` ou `/api/users`.

## 🕵️ Causa Raiz: "The Soft-Delete Trap"

O problema ocorre quando um usuário está marcado como **DELETADO** (`deletedAt !== null`) no banco de dados, mas o sistema de login não valida isso.

### O Fluxo da Falha

1. **Login (AuthService):** Aceitava email/senha corretos, ignorando `deletedAt`. Gerava um JWT válido.
2. **Dashboard (AuthMiddleware):** Recebia o JWT. Validava a assinatura (ok). Consultava o usuário no banco pelo ID do token.
3. **Bloqueio (AuthMiddleware):** O middleware (Axisor Style) checa se `deletedAt` existe. Se sim, retorna `401 Unauthorized`.
4. **Frontend (Axios Interceptor):** Recebe `401`. Tenta refresh.
5. **Refresh (AuthService):** Também falha pois o usuário está deletado.
6. **Frontend:** Redireciona para `/login`.

Resultado: O usuário tem credenciais "válidas" para gerar token, mas o token é "inválido" para usar a API.

## ✅ Solução Implementada

### 1. Backend: Bloqueio no Login

Modificado `AuthService.login` para rejeitar o login se o usuário estiver deletado.

```typescript
// apps/api/src/modules/auth/services/auth.service.ts
if (!user || user.deletedAt) {
  throw new Error('Credenciais inválidas');
}
```

Isso previne a criação de tokens "zumbi".

### 2. Frontend: Robust AuthGuard

Implementado `RobustAuthGuard` (Axisor Pattern) que lida melhor com falhas de inicialização.

- Timeout de segurança (3s) para evitar loading infinito.
- Verificação direta no `localStorage` como fallback.

## 🛠️ Ferramentas Forenses

Scripts criados para diagnosticar este problema:

- `apps/api/scripts/debug-auth.ts`: Verifica a existência do usuário, tipos de ID e gera/valida tokens manualmente.
- `apps/api/scripts/restore-user.ts`: Restaura um usuário soft-deleted (remove `deletedAt`).

## 📝 Checklist de Prevenção

- [ ] Sempre verificar `deletedAt` em operações de Login/Recovery.
- [ ] Middleware deve continuar retornando 401 para usuários deletados (Correto).
- [ ] Frontend deve tratar 401 como logout definitivo (Correto).
