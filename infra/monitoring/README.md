# Kaven Monitoring Stack

Este diretório contém a configuração completa do stack de monitoramento com Prometheus, Grafana e Alertmanager.

## 🚀 Quick Start

```bash
# Iniciar o stack de monitoramento
docker-compose -f docker-compose.monitoring.yml up -d

# Verificar status
docker-compose -f docker-compose.monitoring.yml ps

# Ver logs
docker-compose -f docker-compose.monitoring.yml logs -f
```

## 📊 Acesso

- **Prometheus:** http://localhost:9090
- **Alertmanager:** http://localhost:9093
- **Grafana:** http://localhost:3004 (admin/admin)

## 📁 Estrutura

```
monitoring/
├── prometheus/
│   ├── prometheus.yml    # Configuração do Prometheus
│   └── alerts.yml        # Alert rules (15+ regras)
├── alertmanager/
│   └── alertmanager.yml  # Configuração de notificações
└── grafana/
    ├── provisioning/
    │   ├── datasources/  # Datasource Prometheus
    │   └── dashboards/   # Dashboard provisioning
    └── dashboards/       # Dashboards JSON
```

## 🔔 Alert Rules

**15+ regras configuradas:**

### Infrastructure

- KavenAPIDown
- HighCPUUsage / CriticalCPUUsage
- HighMemoryUsage / CriticalMemoryUsage
- DiskSpaceLow / DiskSpaceCritical

### Application

- HighErrorRate / CriticalErrorRate
- HighResponseTime
- HighEventLoopLag

### Services

- PostgreSQLDown / PostgreSQLSlow
- RedisDown / RedisSlow

### Business

- NoUserRegistrations
- HighLoginFailureRate

## 🔧 Configuração de Notificações

### Webhook (Padrão)

Alertas são enviados para:

- `http://host.docker.internal:8000/api/webhooks/alerts`
- `http://host.docker.internal:8000/api/webhooks/alerts/critical`
- `http://host.docker.internal:8000/api/webhooks/alerts/warning`

### Slack (Opcional)

Descomentar em `alertmanager.yml` e configurar:

```yaml
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Email (Opcional)

Descomentar em `alertmanager.yml` e configurar:

```yaml
ALERT_EMAIL_TO=alerts@example.com
ALERT_EMAIL_FROM=kaven@example.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 📈 Métricas Exportadas

### Kaven API

- `kaven_hardware_cpu_usage_percent`
- `kaven_hardware_memory_usage_percent`
- `kaven_hardware_disk_usage_percent`
- `kaven_http_requests_total`
- `kaven_http_request_duration_seconds`
- `kaven_nodejs_event_loop_lag_ms`
- `kaven_infrastructure_latency_ms`
- `kaven_user_registrations_total`
- `kaven_login_attempts_total`
- `kaven_login_failures_total`

### PostgreSQL Exporter

- `pg_up`
- `pg_stat_database_*`
- `pg_stat_bgwriter_*`

### Redis Exporter

- `redis_up`
- `redis_connected_clients`
- `redis_memory_used_bytes`

## 🛠️ Comandos Úteis

```bash
# Parar o stack
docker-compose -f docker-compose.monitoring.yml down

# Parar e remover volumes
docker-compose -f docker-compose.monitoring.yml down -v

# Reiniciar apenas o Prometheus
docker-compose -f docker-compose.monitoring.yml restart prometheus

# Ver logs do Alertmanager
docker-compose -f docker-compose.monitoring.yml logs -f alertmanager

# Recarregar configuração do Prometheus (sem restart)
curl -X POST http://localhost:9090/-/reload
```

## 📚 Documentação

Para mais detalhes, consulte:

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Alertmanager Documentation](https://prometheus.io/docs/alerting/latest/alertmanager/)
