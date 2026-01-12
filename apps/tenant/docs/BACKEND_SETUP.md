# Backend Setup Guide

## Problema Identificado

O frontend está tentando conectar ao backend em `http://localhost:8000`, mas o backend não está rodando, resultando em erro `ERR_CONNECTION_REFUSED`.

## Solução

### 1. Iniciar o Backend

O backend está localizado em `/apps/api`. Para iniciá-lo:

```bash
# Navegue até o diretório do backend
cd apps/api

# Instale as dependências (se ainda não instalou)
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

O backend deve iniciar na porta **8000** (http://localhost:8000).

### 2. Verificar Conexão

Após iniciar o backend, teste a conexão:

```bash
curl http://localhost:8000/api/health
```

Se retornar um status 200, o backend está funcionando corretamente.

### 3. Testar Login

Agora você pode testar o login no frontend:

1. Acesse http://localhost:3000/login
2. Use as credenciais de teste (verifique no backend/documentação)
3. O login deve funcionar sem erros de conexão

## Estrutura do Projeto

```
kaven-boilerplate/
├── apps/
│   ├── admin/          # Frontend (Next.js) - porta 3000
│   └── api/            # Backend (Node.js) - porta 8000
```

## Comandos Úteis

### Iniciar Ambos (Frontend + Backend)

```bash
# Na raiz do projeto
pnpm dev
```

Isso deve iniciar tanto o frontend quanto o backend simultaneamente.

### Apenas Frontend

```bash
cd apps/admin
pnpm dev
```

### Apenas Backend

```bash
cd apps/api
pnpm dev
```

## Troubleshooting

### Backend não inicia

1. Verifique se a porta 8000 está livre:

   ```bash
   lsof -i :8000
   ```

2. Verifique se as variáveis de ambiente estão configuradas:

   ```bash
   cd apps/api
   cat .env
   ```

3. Verifique os logs do backend para erros

### Frontend não conecta

1. Verifique se o backend está rodando:

   ```bash
   curl http://localhost:8000/api/health
   ```

2. Verifique se a URL do backend está correta no frontend (deve ser `http://localhost:8000`)

3. Verifique o console do browser para erros de CORS

## Próximos Passos

Após iniciar o backend, todas as funcionalidades de autenticação devem funcionar:

- ✅ Login
- ✅ Register
- ✅ Forgot Password
- ✅ Reset Password
- ✅ Verify Email
- ✅ 2FA Setup

---

**Nota**: Este guia assume que o backend já está configurado. Se você está configurando pela primeira vez, consulte a documentação do backend em `/apps/api/README.md`.
