# E2E Tests - Tenant App

Testes end-to-end completos usando Playwright para validar fluxos críticos do Tenant App.

## 🎯 Cobertura de Testes

### Autenticação

- ✅ Login com credenciais válidas
- ✅ Erro com credenciais inválidas
- ✅ Redirecionamento após login

### Projects Management

- ✅ Navegação para página de projetos
- ✅ Listagem de projetos
- ✅ Criação de novo projeto
- ✅ Visualização de detalhes do projeto
- ✅ Deleção de projeto

### Tasks Management

- ✅ Criação de task em projeto
- ✅ Atualização de status inline
- ✅ Deleção de task

### Navegação e UI

- ✅ Navegação entre páginas via sidebar
- ✅ Space selector (quando disponível)
- ✅ Loading states
- ✅ Empty states

### Tenant Isolation

- ✅ Apenas projetos do tenant atual são exibidos

## 🚀 Executando os Testes

### Pré-requisitos

1. Backend rodando em `http://localhost:8000`
2. Banco de dados com dados de seed (opcional, mas recomendado)

```bash
# Popular banco com dados demo
cd packages/database
npx tsx prisma/seeds/demo-projects-tasks.ts
```

### Comandos

```bash
# Executar todos os testes (headless)
pnpm test:e2e

# Executar com UI interativa
pnpm test:e2e:ui

# Executar com browser visível
pnpm test:e2e:headed

# Executar em modo debug
pnpm test:e2e:debug

# Ver relatório HTML
pnpm test:e2e:report
```

### Executar testes específicos

```bash
# Apenas testes de autenticação
pnpm test:e2e --grep "Authentication"

# Apenas testes de projects
pnpm test:e2e --grep "Projects Management"

# Apenas um browser
pnpm test:e2e --project=chromium
```

## 📁 Estrutura de Arquivos

```
e2e/
├── auth.setup.ts           # Setup global de autenticação
├── projects-tasks.spec.ts  # Testes principais de Projects e Tasks
└── README.md              # Esta documentação

playwright.config.ts        # Configuração do Playwright
playwright/.auth/          # Estado de autenticação salvo
playwright-report/         # Relatórios HTML gerados
```

## 🔧 Configuração

### Playwright Config

- **Base URL**: `http://localhost:3001`
- **Browsers**: Chromium, Firefox, WebKit
- **Retries**: 2 (apenas em CI)
- **Screenshots**: Apenas em falhas
- **Trace**: Apenas na primeira retry

### Web Server

O Playwright inicia automaticamente o servidor de desenvolvimento (`pnpm dev`) antes de executar os testes e o encerra ao final.

## 📝 Escrevendo Novos Testes

### Exemplo básico

```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Login é feito automaticamente via auth.setup.ts
    await page.goto('/my-feature');
  });

  test('should do something', async ({ page }) => {
    await page.click('button:has-text("Action")');
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

### Boas Práticas

1. **Use seletores semânticos**: Prefira `text=`, `role=`, `aria-label` sobre CSS classes
2. **Aguarde elementos**: Use `waitForSelector`, `waitForURL` para garantir que elementos estejam prontos
3. **Isole testes**: Cada teste deve ser independente e poder rodar em qualquer ordem
4. **Limpe dados**: Delete dados de teste criados durante o teste
5. **Use timeouts**: Adicione timeouts adequados para operações assíncronas

## 🐛 Debugging

### Ver teste rodando

```bash
pnpm test:e2e:headed
```

### Modo debug interativo

```bash
pnpm test:e2e:debug
```

### Ver screenshots de falhas

Screenshots são salvos automaticamente em `test-results/` quando um teste falha.

### Ver traces

```bash
# Após uma falha, abrir trace viewer
npx playwright show-trace test-results/.../trace.zip
```

## 🎭 CI/CD

### GitHub Actions

```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: pnpm test:e2e
  env:
    CI: true

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## 📊 Relatórios

Após executar os testes, um relatório HTML é gerado automaticamente:

```bash
pnpm test:e2e:report
```

O relatório inclui:

- Status de cada teste
- Screenshots de falhas
- Traces de execução
- Tempo de execução
- Comparação entre browsers

## 🔒 Autenticação

Os testes usam um setup global (`auth.setup.ts`) que:

1. Faz login uma vez
2. Salva o estado de autenticação em `playwright/.auth/user.json`
3. Reutiliza esse estado em todos os testes

Isso acelera significativamente a execução dos testes.

## ⚡ Performance

- **Parallel execution**: Testes rodam em paralelo por padrão
- **Shared authentication**: Login feito apenas uma vez
- **Reuse server**: Servidor de desenvolvimento é reutilizado entre execuções

## 📚 Recursos

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Guide](https://playwright.dev/docs/ci)
