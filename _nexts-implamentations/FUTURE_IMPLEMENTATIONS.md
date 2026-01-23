# Planejamento de Implementações Futuras (Gaps)

Este documento detalha as funcionalidades que representam diferenciais competitivos e que serão implementadas como módulos opcionais controlados via CLI.

## 1. Módulos Diferenciais (Roadmap v2.0)

| Feature           | Lacuna Identificada                                                                                         | Prioridade |
| :---------------- | :---------------------------------------------------------------------------------------------------------- | :--------: |
| **AI Assistant**  | Pasta `modules/ai-assistant` inexistente no Backend. Falta integração com OpenAI/Anthropic.                 |    Alta    |
| **Analytics**     | Pasta `modules/analytics` inexistente no Backend. Necessário sistema de eventos e trackings personalizados. |   Média    |
| **Notifications** | Estrutura de pasta existe, mas falta engine de envio para Email/SMS/Push.                                   |    Alta    |

## 2. Experiência de Consumo (Customer Portal)

| Feature                   | Lacuna Identificada                                                                                    | Prioridade |
| :------------------------ | :----------------------------------------------------------------------------------------------------- | :--------: |
| **Checkout Flow**         | Rota frontend existe, mas falta o flow completo de redirecionamento e tratamento de sucesso/erro real. |    Alta    |
| **User Onboarding**       | Wizard de configuração pós-cadastro para novos tenants.                                                |   Média    |
| **Usage Limits Frontend** | Exibir visualmente (progress bars) o consumo de quotas (`USERS`, `STORAGE`) para o usuário.            |    Alta    |

## 3. Core Engine Enhancements

| Feature                   | Lacuna Identificada                                                                                 | Prioridade |
| :------------------------ | :-------------------------------------------------------------------------------------------------- | :--------: |
| **Granular UI Guard**     | Proteção de componentes React baseada no `EntitlementService` (bloquear botões/menus via frontend). |   Média    |
| **Automatic Module Sync** | Lógica na CLI para baixar módulos de um repositório centralizado durante o `module add`.            |   Baixa    |
| **Multi-region DB**       | Suporte a réplicas do banco de dados para escala global.                                            |   Baixa    |

---

> [!TIP]
> Recomenda-se iniciar a Fase 4 focando na estabilização do `Checkout Flow` e na implementação do `AI Assistant`, dada a alta demanda por estes recursos.
