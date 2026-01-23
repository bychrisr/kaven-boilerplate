# PR #3 (Phase 2): Signed Downloads & Verification

**Status:** Concluído
**Data:** 23/01/2026
**Autor:** Antigravity

## 1. Resumo da Implementação

Implementação do sistema de download seguro de módulos.
Módulos não encontrados localmente agora são baixados automaticamente do Marketplace, com verificação criptográfica obrigatória.

### Principais Mudanças

1.  **Crypto Service (`sodium-native`)**:
    - Implementada verificação de assinatura **Ed25519** (padrão de segurança moderna).
    - Cálculo de checksum **SHA-256**.
    - Uso de `libsodium` via `sodium-native` para performance e segurança.

2.  **Download Manager**:
    - Responsável por orquestrar: Download (Axios) -> Checksum -> Signature Verify -> Extract (tar).
    - **Fail-secure**: Se qualquer verificação falhar, o arquivo temporário é deletado e o erro é propagado.

3.  **Module Manager Integration**:
    - Atualizado `addModule` para detectar ausência local e invocar `Marketplace` + `DownloadManager`.
    - Resolve dependências via importação preguiçosa (`await import`) do container IoC, mantendo a classe leve.

## 2. Decisões Técnicas (ADR)

- **Sodium Native**: Escolhido por ser binding direto da libsodium, muito mais rápido que implementações JS puras de Ed25519.
- **IoC Container**: `CryptoService` e `DownloadManager` foram registrados no container Inversify, permitindo injeção de dependência e facilitando mocks nos testes.
- **Lazy Loading em ModuleManager**: Para evitar refatorar todo o `bin/kaven` neste momento, usamos imports dinâmicos dentro do método `addModule` para acessar o container configurado. Isso é uma estratégia de transição válida.

## 3. Validação

### Testes

- **Unitários (`DownloadManager.test.ts`)**: (PASS)
  - Simula download bem sucedido com verificação correta.
  - Simula ataque de adulteração (checksum mismatch) -> lança erro.
  - Simula assinatura inválida -> lança erro.

### Evidência

Bundle de evidência gerado em: `.agent/artifacts/20260123_090739__kaven-cli-downloads`

## 4. Próximos Passos (Conclusão)

- O sistema agora está completo com:
  - Phase 0: Module System Refactor.
  - Phase 1: Auth & Identity.
  - Phase 2: Secure Downloads.

Ready for production use / release candidate.
