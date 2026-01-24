# Kaven Boilerplate (Legacy)

⚠️ **Este repositório é LEGADO e está arquivado.**  
Ele existiu durante a fase de prototipagem/refatorações iniciais e **não representa o estado atual** do Kaven.

A partir de agora, o Kaven segue uma estrutura oficial com repositórios separados e versionamento reiniciado (SemVer `0.x`), com governança e segurança consistentes.

---

## Repositórios oficiais (atuais)

- **Kaven CLI (público):** `KavenTheCreator/kaven-cli`  
  Ferramenta de linha de comando + documentação técnica oficial.

- **Kaven Framework (privado):** `KavenTheCreator/kaven-framework`  
  Código-base (framework) e módulos distribuídos via CLI/marketplace.

- **Kaven Marketplace (privado):** `KavenTheCreator/kaven-marketplace`  
  Backend de autenticação, compras, licenças e downloads assinados.

- **Kaven Site (privado):** `KavenTheCreator/kaven-site`  
  Site oficial `kaven.site`, tenant app e experiências de comunidade.

> Observação: os links acima podem exigir permissão (repos privados).

---

## Por que este repositório foi descontinuado?

- A estrutura anterior misturava responsabilidades (CLI, framework, docs e infra no mesmo lugar).
- O versionamento evoluiu “informalmente” durante refatorações (ex.: `v2.x` sem release público).
- A nova arquitetura exige separação clara entre:
  - distribuição (CLI)
  - produto comercial (framework/módulos)
  - backend (marketplace)
  - site (marketing + tenant)

---

## Status

✅ **Archived / Read-only**  
Este repositório é mantido apenas como referência histórica.

---

## Licença

Consulte o repositório oficial correspondente (`kaven-cli` para open-source; `kaven-framework` para termos comerciais).
