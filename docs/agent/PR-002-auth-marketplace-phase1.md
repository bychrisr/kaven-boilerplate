# PR #2 (Phase 1): Auth & Marketplace Foundation

**Status:** Concluído
**Data:** 23/01/2026
**Autor:** Antigravity

## 1. Resumo da Implementação

Implementação da camada de autenticação do CLI e do cliente básico para o Marketplace de Módulos.
O foco foi criar uma base segura para gerenciar identidade e credenciais.

### Principais Mudanças

1.  **Auth Service (Device Code Flow)**:
    - Implementado `AuthService` com suporte a fluxo de código de dispositivo.
    - Métodos: `login`, `logout`, `whoami`.
    - Integração mocks de API para simular fluxo sem backend real no momento.

2.  **Credential Manager Segura**:
    - Refatorado para suportar **Keytar** (Keychain do sistema) via importação dinâmica.
    - **Fallback Robusto**: Se Keytar falhar (comum em CI/Linux headless), salva em `~/.kaven/credentials.json` com permissão **0600** (somente leitura pelo dono).

3.  **Marketplace Client**:
    - Client HTTP básico preparado para listar e baixar módulos.
    - Integração automática com token de auth via interceptor Axios.

4.  **CLI Commands**:
    - `kaven auth login`
    - `kaven auth logout`
    - `kaven auth whoami`
    - `kaven marketplace list` (impl via `src/index.ts` e `commands/marketplace/list.ts` existente/mocked).

## 2. Decisões Técnicas (ADR)

- **Keytar Opcional**: Para evitar quebras em ambientes onde compilação nativa falha, `keytar` é tratado como dependência opcional e carregado dinamicamente. O fallback para FS é considerado seguro o suficiente para dev environments, desde que `chmod 600` seja aplicado.
- **Logging Interface**: Expandimos `ILogger` para suportar `box` e spinners de conveniência, melhorando a UX do login.

## 3. Validação

### Testes

- **Unitários (`AuthService.test.ts`)**: (PASS)
  - Verifica lógica de proteção de login (não logar 2x).
  - Verifica logout (limpeza de credenciais).
  - Verifica recuperação de usuário corrente.

### Evidência

Bundle de evidência gerado em: `.agent/artifacts/20260123_003645__kaven-cli-auth-marketplace`

## 4. Próximos Passos (Phase 2)

- Integrar `MarketplaceClient` com o `ModuleManager` (implementado na Phase 0) para realizar downloads reais.
- Implementar verificação de assinatura de pacotes.
