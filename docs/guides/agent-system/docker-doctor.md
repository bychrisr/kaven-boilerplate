# 🏥 Smart Docker Doctor v3.0

O **Smart Docker Doctor** é um sistema especialista autônomo escrito em Python, responsável por garantir a saúde dos containers Docker do projeto.

Diferente de scripts simples que apenas reiniciam containers falhos, o Smart Doctor **analisa, diagnostica e cura**.

## 🧠 Como Funciona

### 1. Monitoramento

O script monitora continuamente o status (`running`, `exited`, `restarting`) e o healthcheck (`healthy`, `unhealthy`) de todos os containers do projeto.

### 2. Análise Semântica

Se um container apresenta problemas (ex: loop de restart), o Doctor lê os últimos logs (`STDERR/STDOUT`) e aplica **Regex Matching** para encontrar padrões de erro conhecidos.

### 3. Diagnóstico e Cura

Com base no padrão encontrado, ele seleciona uma estratégia da **Knowledge Base**:

| Sintoma (Regex)                  | Diagnóstico             | Tratamento (Auto-Fix)                                                                      |
| :------------------------------- | :---------------------- | :----------------------------------------------------------------------------------------- |
| `address already in use`         | **Conflito de Porta**   | Força a recriação do container para tentar liberar o bind da porta.                        |
| `password authentication failed` | **Falha de Auth**       | Recria o container para garantir que novas variáveis de ambiente (`.env`) sejam aplicadas. |
| `database system is starting up` | **Deep Sleep**          | Entra em modo de espera (Backoff) e aguarda o banco liberar o lock sozinho.                |
| `permission denied`              | **Erro de Permissão**   | Recria o container (geralmente resolve problemas de montagem de volume em dev).            |
| `Module not found`               | **Dependência Missing** | Instrui rebuild (ou alerta o usuário se não puder resolver sozinho).                       |

## 🛡️ Segurança

- **Timeout:** Se o problema não for resolvido após 15 tentativas, o Doctor desiste para evitar loops infinitos.
- **Fail-Safe:** Em caso de erro desconhecido, ele tenta um `docker restart` padrão como último recurso.

## 💻 Uso Manual

Você pode invocar o médico a qualquer momento:

```bash
python3 .agent/scripts/docker_doctor.py
```

Se tudo estiver bem, você verá: `✅ All systems operational`.
Se houver falhas, ele iniciará o tratamento automaticamente.
