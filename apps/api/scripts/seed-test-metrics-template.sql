-- Template de Email: Test Metrics (Validação de Métricas)
-- Tipo: NOTIFICATION
-- Bilíngue: PT + EN

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
  'test-metrics',
  'Teste de Métricas',
  'Template para validação de persistência de métricas de email',
  'NOTIFICATION',
  'ACTIVE',
  
  -- Subject PT
  '[TESTE] Validação de Métricas de Email',
  
  -- Subject EN
  '[TEST] Email Metrics Validation',
  
  -- HTML Content PT
  '<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Teste de Métricas</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .badge {
      display: inline-block;
      background-color: #10b981;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .info-box {
      background-color: #f9fafb;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-box h3 {
      margin: 0 0 10px 0;
      color: #667eea;
      font-size: 16px;
    }
    .info-box p {
      margin: 5px 0;
      font-size: 14px;
      color: #6b7280;
    }
    .info-box strong {
      color: #374151;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 5px 0;
      font-size: 12px;
      color: #9ca3af;
    }
    .button {
      display: inline-block;
      background-color: #667eea;
      color: #ffffff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin-top: 20px;
    }
    .button:hover {
      background-color: #5568d3;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧪 Teste de Métricas</h1>
    </div>
    
    <div class="content">
      <span class="badge">✅ Sistema de Notificações</span>
      
      <h2>Email de Validação de Métricas</h2>
      <p>Este email foi enviado automaticamente para validar o sistema de persistência de métricas de email.</p>
      
      <div class="info-box">
        <h3>📊 Informações do Teste</h3>
        <p><strong>ID do Teste:</strong> {{testId}}</p>
        <p><strong>Timestamp:</strong> {{timestamp}}</p>
        <p><strong>Tipo de Email:</strong> NOTIFICATION</p>
        <p><strong>Template:</strong> test-metrics</p>
      </div>
      
      <div class="info-box">
        <h3>🎯 Objetivo</h3>
        <p>Verificar se as métricas estão sendo corretamente:</p>
        <ul>
          <li>Registradas no Prometheus (em memória)</li>
          <li>Persistidas no PostgreSQL (banco de dados)</li>
          <li>Agregadas pelo AdvancedMetricsService</li>
          <li>Separadas por provider no Grafana</li>
        </ul>
      </div>
      
      <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
        Se você recebeu este email, significa que o sistema de envio está funcionando corretamente. 
        Agora precisamos verificar se as métricas foram persistidas no banco de dados.
      </p>
    </div>
    
    <div class="footer">
      <p><strong>{{companyName}}</strong></p>
      <p>Sistema de Observabilidade e Métricas</p>
      <p style="margin-top: 15px;">Este é um email automático de teste. Não é necessário responder.</p>
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
  <title>Metrics Test</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .badge {
      display: inline-block;
      background-color: #10b981;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .info-box {
      background-color: #f9fafb;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-box h3 {
      margin: 0 0 10px 0;
      color: #667eea;
      font-size: 16px;
    }
    .info-box p {
      margin: 5px 0;
      font-size: 14px;
      color: #6b7280;
    }
    .info-box strong {
      color: #374151;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 5px 0;
      font-size: 12px;
      color: #9ca3af;
    }
    .button {
      display: inline-block;
      background-color: #667eea;
      color: #ffffff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin-top: 20px;
    }
    .button:hover {
      background-color: #5568d3;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧪 Metrics Test</h1>
    </div>
    
    <div class="content">
      <span class="badge">✅ Notification System</span>
      
      <h2>Email Metrics Validation</h2>
      <p>This email was sent automatically to validate the email metrics persistence system.</p>
      
      <div class="info-box">
        <h3>📊 Test Information</h3>
        <p><strong>Test ID:</strong> {{testId}}</p>
        <p><strong>Timestamp:</strong> {{timestamp}}</p>
        <p><strong>Email Type:</strong> NOTIFICATION</p>
        <p><strong>Template:</strong> test-metrics</p>
      </div>
      
      <div class="info-box">
        <h3>🎯 Objective</h3>
        <p>Verify that metrics are being correctly:</p>
        <ul>
          <li>Registered in Prometheus (in-memory)</li>
          <li>Persisted in PostgreSQL (database)</li>
          <li>Aggregated by AdvancedMetricsService</li>
          <li>Separated by provider in Grafana</li>
        </ul>
      </div>
      
      <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
        If you received this email, it means the sending system is working correctly. 
        Now we need to verify if the metrics were persisted in the database.
      </p>
    </div>
    
    <div class="footer">
      <p><strong>{{companyName}}</strong></p>
      <p>Observability and Metrics System</p>
      <p style="margin-top: 15px;">This is an automated test email. No reply is necessary.</p>
    </div>
  </div>
</body>
</html>',
  
  -- Text Content PT
  'TESTE DE MÉTRICAS

Email de Validação de Métricas

Este email foi enviado automaticamente para validar o sistema de persistência de métricas de email.

INFORMAÇÕES DO TESTE:
- ID do Teste: {{testId}}
- Timestamp: {{timestamp}}
- Tipo de Email: NOTIFICATION
- Template: test-metrics

OBJETIVO:
Verificar se as métricas estão sendo corretamente:
- Registradas no Prometheus (em memória)
- Persistidas no PostgreSQL (banco de dados)
- Agregadas pelo AdvancedMetricsService
- Separadas por provider no Grafana

Se você recebeu este email, significa que o sistema de envio está funcionando corretamente.

{{companyName}}
Sistema de Observabilidade e Métricas

Este é um email automático de teste. Não é necessário responder.',
  
  -- Text Content EN
  'METRICS TEST

Email Metrics Validation

This email was sent automatically to validate the email metrics persistence system.

TEST INFORMATION:
- Test ID: {{testId}}
- Timestamp: {{timestamp}}
- Email Type: NOTIFICATION
- Template: test-metrics

OBJECTIVE:
Verify that metrics are being correctly:
- Registered in Prometheus (in-memory)
- Persisted in PostgreSQL (database)
- Aggregated by AdvancedMetricsService
- Separated by provider in Grafana

If you received this email, it means the sending system is working correctly.

{{companyName}}
Observability and Metrics System

This is an automated test email. No reply is necessary.',
  
  -- Variables
  '["testId", "timestamp", "companyName"]'::jsonb,
  
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
