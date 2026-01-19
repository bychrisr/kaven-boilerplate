-- Template de Email: Observability Alert (Alertas de Observabilidade)
-- Tipo: NOTIFICATION
-- Bilíngue: PT + EN
-- Uso: Alertas do sistema de observabilidade (serviços DOWN, métricas críticas, etc)

INSERT INTO email_templates (
  id,
  code,
  name,
  description,
  type,
  status,
  subject_pt,
  subject_en,
  html_content_pt,
  html_content_en,
  text_content_pt,
  text_content_en,
  variables,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'observability-alert',
  'Alerta de Observabilidade',
  'Template para alertas do sistema de observabilidade (serviços DOWN, métricas críticas, etc)',
  'NOTIFICATION',
  'ACTIVE',
  
  -- Subject PT
  '[{{severity}}] {{alertType}} - {{serviceName}}',
  
  -- Subject EN
  '[{{severity}}] {{alertType}} - {{serviceName}}',
  
  -- HTML Content PT
  '<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alerta de Observabilidade</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      padding: 32px 30px;
      text-align: center;
      color: #ffffff;
    }
    .header.critical {
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
    }
    .header.warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }
    .header.info {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .severity-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      margin-top: 12px;
      background-color: rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
    }
    .content {
      padding: 40px 30px;
    }
    .alert-box {
      background-color: #fef2f2;
      border-left: 4px solid #dc2626;
      padding: 20px;
      margin: 24px 0;
      border-radius: 6px;
    }
    .alert-box.warning {
      background-color: #fffbeb;
      border-left-color: #f59e0b;
    }
    .alert-box.info {
      background-color: #eff6ff;
      border-left-color: #3b82f6;
    }
    .alert-box h2 {
      margin: 0 0 12px 0;
      font-size: 18px;
      color: #111827;
    }
    .alert-box p {
      margin: 0;
      font-size: 15px;
      color: #374151;
      line-height: 1.6;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 12px;
      margin: 24px 0;
      padding: 20px;
      background-color: #f9fafb;
      border-radius: 8px;
    }
    .details-label {
      font-weight: 600;
      color: #6b7280;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .details-value {
      color: #111827;
      font-size: 14px;
      font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 15px;
      margin-top: 24px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 4px 0;
      font-size: 12px;
      color: #9ca3af;
    }
    .footer strong {
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header {{severityClass}}">
      <h1>🚨 Alerta de Observabilidade</h1>
      <span class="severity-badge">{{severity}}</span>
    </div>
    
    <div class="content">
      <div class="alert-box {{severityClass}}">
        <h2>{{alertType}}</h2>
        <p>{{message}}</p>
      </div>
      
      <div class="details-grid">
        <div class="details-label">Serviço</div>
        <div class="details-value">{{serviceName}}</div>
        
        <div class="details-label">Severidade</div>
        <div class="details-value">{{severity}}</div>
        
        <div class="details-label">Timestamp</div>
        <div class="details-value">{{timestamp}}</div>
        
        {{#if metricValue}}
        <div class="details-label">Valor Atual</div>
        <div class="details-value">{{metricValue}}</div>
        {{/if}}
        
        {{#if threshold}}
        <div class="details-label">Limite</div>
        <div class="details-value">{{threshold}}</div>
        {{/if}}
      </div>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
        Este alerta foi gerado automaticamente pelo sistema de observabilidade do {{companyName}}. 
        Recomendamos que você verifique o dashboard para mais detalhes e tome as ações necessárias.
      </p>
      
      <center>
        <a href="{{dashboardUrl}}" class="cta-button">
          📊 Ver Dashboard de Observabilidade
        </a>
      </center>
    </div>
    
    <div class="footer">
      <p><strong>{{companyName}}</strong></p>
      <p>Sistema de Observabilidade e Monitoramento</p>
      <p style="margin-top: 12px;">Este é um email automático. Para alterar suas preferências de notificação, acesse as configurações da plataforma.</p>
    </div>
  </div>
</body>
</html>',
  
  -- HTML Content EN
  '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Observability Alert</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      padding: 32px 30px;
      text-align: center;
      color: #ffffff;
    }
    .header.critical {
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
    }
    .header.warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }
    .header.info {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .severity-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      margin-top: 12px;
      background-color: rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
    }
    .content {
      padding: 40px 30px;
    }
    .alert-box {
      background-color: #fef2f2;
      border-left: 4px solid #dc2626;
      padding: 20px;
      margin: 24px 0;
      border-radius: 6px;
    }
    .alert-box.warning {
      background-color: #fffbeb;
      border-left-color: #f59e0b;
    }
    .alert-box.info {
      background-color: #eff6ff;
      border-left-color: #3b82f6;
    }
    .alert-box h2 {
      margin: 0 0 12px 0;
      font-size: 18px;
      color: #111827;
    }
    .alert-box p {
      margin: 0;
      font-size: 15px;
      color: #374151;
      line-height: 1.6;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 12px;
      margin: 24px 0;
      padding: 20px;
      background-color: #f9fafb;
      border-radius: 8px;
    }
    .details-label {
      font-weight: 600;
      color: #6b7280;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .details-value {
      color: #111827;
      font-size: 14px;
      font-family: "SF Mono", Monaco, "Cascadia Code", monospace;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 15px;
      margin-top: 24px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 4px 0;
      font-size: 12px;
      color: #9ca3af;
    }
    .footer strong {
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header {{severityClass}}">
      <h1>🚨 Observability Alert</h1>
      <span class="severity-badge">{{severity}}</span>
    </div>
    
    <div class="content">
      <div class="alert-box {{severityClass}}">
        <h2>{{alertType}}</h2>
        <p>{{message}}</p>
      </div>
      
      <div class="details-grid">
        <div class="details-label">Service</div>
        <div class="details-value">{{serviceName}}</div>
        
        <div class="details-label">Severity</div>
        <div class="details-value">{{severity}}</div>
        
        <div class="details-label">Timestamp</div>
        <div class="details-value">{{timestamp}}</div>
        
        {{#if metricValue}}
        <div class="details-label">Current Value</div>
        <div class="details-value">{{metricValue}}</div>
        {{/if}}
        
        {{#if threshold}}
        <div class="details-label">Threshold</div>
        <div class="details-value">{{threshold}}</div>
        {{/if}}
      </div>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
        This alert was automatically generated by {{companyName}}''s observability system. 
        We recommend checking the dashboard for more details and taking necessary actions.
      </p>
      
      <center>
        <a href="{{dashboardUrl}}" class="cta-button">
          📊 View Observability Dashboard
        </a>
      </center>
    </div>
    
    <div class="footer">
      <p><strong>{{companyName}}</strong></p>
      <p>Observability and Monitoring System</p>
      <p style="margin-top: 12px;">This is an automated email. To change your notification preferences, access the platform settings.</p>
    </div>
  </div>
</body>
</html>',
  
  -- Text Content PT
  '🚨 ALERTA DE OBSERVABILIDADE

[{{severity}}] {{alertType}}

Serviço: {{serviceName}}
Mensagem: {{message}}

DETALHES:
- Severidade: {{severity}}
- Timestamp: {{timestamp}}
{{#if metricValue}}- Valor Atual: {{metricValue}}{{/if}}
{{#if threshold}}- Limite: {{threshold}}{{/if}}

Este alerta foi gerado automaticamente pelo sistema de observabilidade do {{companyName}}.

Acesse o dashboard para mais detalhes: {{dashboardUrl}}

---
{{companyName}}
Sistema de Observabilidade e Monitoramento',
  
  -- Text Content EN
  '🚨 OBSERVABILITY ALERT

[{{severity}}] {{alertType}}

Service: {{serviceName}}
Message: {{message}}

DETAILS:
- Severity: {{severity}}
- Timestamp: {{timestamp}}
{{#if metricValue}}- Current Value: {{metricValue}}{{/if}}
{{#if threshold}}- Threshold: {{threshold}}{{/if}}

This alert was automatically generated by {{companyName}}''s observability system.

Access the dashboard for more details: {{dashboardUrl}}

---
{{companyName}}
Observability and Monitoring System',
  
  -- Variables
  '["severity", "severityClass", "alertType", "serviceName", "message", "timestamp", "metricValue", "threshold", "companyName", "dashboardUrl"]'::jsonb,
  
  -- Timestamps
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (code) DO UPDATE SET
  html_content_pt = EXCLUDED.html_content_pt,
  html_content_en = EXCLUDED.html_content_en,
  text_content_pt = EXCLUDED.text_content_pt,
  text_content_en = EXCLUDED.text_content_en,
  subject_pt = EXCLUDED.subject_pt,
  subject_en = EXCLUDED.subject_en,
  variables = EXCLUDED.variables,
  updated_at = CURRENT_TIMESTAMP;
