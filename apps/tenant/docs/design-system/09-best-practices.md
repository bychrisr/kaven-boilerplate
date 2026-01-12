# Best Practices - Design System Minimals

## 🎯 Visão Geral

Guidelines e padrões para uso consistente do Design System.

## Código

### TypeScript

```tsx
// ✅ Bom - Tipagem explícita
interface UserProps {
  user: User;
  onEdit: (id: string) => void;
}

// ❌ Ruim - any
function UserCard(props: any) {}
```

### Componentes

```tsx
// ✅ Bom - Componente focado
function UserCard({ user }: UserCardProps) {
  return (
    <Card>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </Card>
  );
}

// ❌ Ruim - Componente monolítico
function UserPage() {
  // 500 linhas de código...
}
```

## Design

### Hierarquia Visual

```tsx
// ✅ Bom - Hierarquia clara
<div>
  <h1 className="text-4xl font-bold">Título</h1>
  <h2 className="text-2xl font-semibold">Subtítulo</h2>
  <p className="text-base">Conteúdo</p>
</div>

// ❌ Ruim - Sem hierarquia
<div>
  <h1 className="text-xl">Título</h1>
  <p className="text-xl">Conteúdo</p>
</div>
```

### Espaçamento

```tsx
// ✅ Bom - Espaçamento consistente (múltiplos de 8)
<div className="space-y-6">
  <Card className="p-6">Item 1</Card>
  <Card className="p-6">Item 2</Card>
</div>

// ❌ Ruim - Valores arbitrários
<div className="space-y-[13px]">
  <Card className="p-[17px]">Item</Card>
</div>
```

### Cores

```tsx
// ✅ Bom - Cores semânticas
<Alert severity="success">Sucesso!</Alert>
<Button color="primary">Salvar</Button>

// ❌ Ruim - Cores hardcoded
<div className="bg-[#1877F2]">Conteúdo</div>
```

## Performance

### Lazy Loading

```tsx
// ✅ Bom - Lazy load de rotas
const UsersPage = lazy(() => import('@/app/(dashboard)/users/page'));

// ❌ Ruim - Import síncrono de tudo
import UsersPage from '@/app/(dashboard)/users/page';
```

### Memoização

```tsx
// ✅ Bom - Memo para componentes pesados
const UserTable = memo(({ users }: UserTableProps) => {
  // Renderização pesada
});

// ❌ Ruim - Re-render desnecessário
function UserTable({ users }: UserTableProps) {
  // Re-renderiza sempre que parent atualiza
}
```

## Acessibilidade

### Labels

```tsx
// ✅ Bom - Label associado
<div>
  <label htmlFor="email">Email</label>
  <input id="email" type="email" />
</div>

// ❌ Ruim - Sem label
<input type="email" placeholder="Email" />
```

### Keyboard Navigation

```tsx
// ✅ Bom - Navegação por teclado
<button onClick={handleClick}>
  Clique
</button>

// ❌ Ruim - Div clicável sem acessibilidade
<div onClick={handleClick}>
  Clique
</div>
```

### Contraste

```tsx
// ✅ Bom - Contraste adequado (WCAG AA)
<p className="text-grey-900">Texto legível</p>

// ❌ Ruim - Contraste insuficiente
<p className="text-grey-300">Texto ilegível</p>
```

## Testes

### Unit Tests

```tsx
// ✅ Bom - Testar lógica isolada
describe('formatCurrency', () => {
  it('formata valor em BRL', () => {
    expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
  });
});
```

### Integration Tests

```tsx
// ✅ Bom - Testar fluxo completo
describe('UserView', () => {
  it('exibe lista de usuários', async () => {
    render(<UserView />);
    await waitFor(() => {
      expect(screen.getByText('João')).toBeInTheDocument();
    });
  });
});
```

## Git

### Commits

```bash
# ✅ Bom - Commit atômico e descritivo
git commit -m "feat: add user table sorting

Implemented sortable columns for user table with
ascending/descending order toggle."

# ❌ Ruim - Commit vago
git commit -m "fix stuff"
```

### Branches

```bash
# ✅ Bom - Nome descritivo
git checkout -b feat/user-table-sorting

# ❌ Ruim - Nome genérico
git checkout -b fix
```

## Documentação

### Comentários

```tsx
// ✅ Bom - Explica PORQUÊ
// Usa Math.floor porque API aceita apenas inteiros
const cents = Math.floor(dollars * 100);

// ❌ Ruim - Explica O QUÊ (óbvio)
// Multiplica por 100
const cents = dollars * 100;
```

### JSDoc

```tsx
// ✅ Bom - Documentação completa
/**
 * Formata valor monetário em BRL
 * @param value - Valor numérico
 * @param currency - Código da moeda (padrão: BRL)
 * @returns String formatada
 */
function formatCurrency(value: number, currency = 'BRL'): string {
  // ...
}
```

## Checklist de Review

Antes de fazer commit/PR, verificar:

- [ ] 0 erros TypeScript (`pnpm tsc --noEmit`)
- [ ] 0 warnings ESLint (`pnpm lint`)
- [ ] Código formatado (`pnpm format`)
- [ ] Testes passando (`pnpm test`)
- [ ] Acessibilidade verificada
- [ ] Performance considerada
- [ ] Documentação atualizada

## Referências

- [React Best Practices](https://react.dev/learn)
- [TypeScript Guidelines](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
