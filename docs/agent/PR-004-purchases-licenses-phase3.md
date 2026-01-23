# PR #4 (Phase 3): Purchases & License Keys

**Status:** Concluído
**Data:** 23/01/2026
**Autor:** Antigravity

## 1. Resumo da Implementação

Implementação do sistema de Licenciamento (Phase 3) para módulos pagos.
Inclui modelo de dados, lógica de backend para validar chaves e integração no CLI.

### Principais Mudanças

1.  **Database (`packages/database`)**:
    - Novo modelo `License` (key unique, userId, moduleSlug, status).
    - Relações adicionadas em `User` e `Purchase`.
    - Enum `LicenseStatus` (ACTIVE, REVOKED, EXPIRED).

2.  **Backend (`apps/api`)**:
    - **LicensingService**: Geração de chaves seguras (`KVN-XXX-HEX`) e verificação.
    - **LicensingController**: Endpoint `POST /licenses/verify` (boilerplate implementado).
    - **Routes**: Estrutura pronta para ser consumida.

3.  **CLI (`kaven-cli`)**:
    - **Install Command**: Nova flag `--key <KEY>`.
    - **Marketplace Client**: Atualizado para passar a chave ao solicitar token de download.
    - **Mock Logic**: Simulação de erro 402 se tentar baixar módulo pago sem chave.

## 2. Decisões Técnicas (ADR)

- **Key Format**: `KVN-{SLUG}-{RANDOM}`. Fácil de ler e identificar visualmente o módulo, suficiente para MVP.
- **Database Schema**: A escolha de ligar `License` a `Purchase` (opcional) permite chaves geradas manualmente (gift) ou compradas.
- **CLI UX**: Se o usuário não tem licença no Passport (online check), o CLI sugere usar `--key`, permitindo instalação offline/manual se a chave for válida (futuro).

## 3. Validação

### Testes

- **CLI Build**: `tsc` passando sem erros.
- **Manual Verify**: Fluxo de instalação com `--key` passa a chave simulada para o client.

### Evidência

Bundle de evidência gerado em: `.agent/artifacts/20260123_105647__kaven-license-system`

## 4. Próximos Passos

- Implementar integração com Stripe Webhook para criar a licença automaticamente após pagamento.
- Conectar o Endpoint `verify` real no `kaven-cli` (atualmente mockado no client).
