#!/usr/bin/env tsx
/**
 * Script de Teste de Email Metrics
 * 
 * Objetivo: Enviar email de teste e monitorar TODO o fluxo com LOGS MÁXIMOS
 * para identificar onde está o erro silencioso de persistência.
 * 
 * Uso:
 *   cd apps/api
 *   npx tsx scripts/test-email-metrics.ts
 */

import { emailServiceV2 } from '../src/lib/email';
import { EmailType } from '../src/lib/email/types';
import { emailMetricsPersistence } from '../src/lib/email/metrics-persistence.service';
import { register } from '../src/lib/metrics';
import { prisma } from '../src/lib/prisma';

// Cores para logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(emoji: string, message: string, data?: any) {
  console.log(`${colors.bright}${emoji} ${message}${colors.reset}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

function logSection(title: string) {
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${title}${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

async function testEmailMetrics() {
  try {
    logSection('🧪 TESTE DE MÉTRICAS DE EMAIL - LOGS MÁXIMOS');

    // ========================================
    // ETAPA 1: Verificar Estado Inicial
    // ========================================
    logSection('📊 ETAPA 1: Verificando Estado Inicial');

    log('🔍', 'Verificando registros no banco ANTES do envio...');
    const countBefore = await prisma.emailMetrics.count();
    log('💾', `Total de registros no banco: ${countBefore}`);

    if (countBefore > 0) {
      log('📋', 'Últimos 3 registros:');
      const lastRecords = await prisma.emailMetrics.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          provider: true,
          sentCount: true,
          date: true,
          createdAt: true,
        },
      });
      console.log(JSON.stringify(lastRecords, null, 2));
    }

    log('🔍', 'Verificando métricas Prometheus ANTES do envio...');
    const metricsBefore = await register.metrics();
    const emailMetricsBefore = metricsBefore
      .split('\n')
      .filter(line => line.includes('kaven_email_'));
    log('📊', `Métricas de email no Prometheus (${emailMetricsBefore.length} linhas):`);
    emailMetricsBefore.forEach(line => console.log(`  ${line}`));

    // ========================================
    // ETAPA 2: Inicializar Email Service
    // ========================================
    logSection('🔧 ETAPA 2: Inicializando Email Service');

    log('🔄', 'Chamando emailServiceV2.initialize()...');
    await emailServiceV2.initialize();
    log('✅', 'Email Service inicializado');

    // ========================================
    // ETAPA 3: Enviar Email de Teste
    // ========================================
    logSection('📧 ETAPA 3: Enviando Email de Teste');

    const testPayload = {
      to: 'test@example.com',
      subject: '[TESTE] Validação de Métricas de Email',
      html: '<h1>Email de Teste</h1><p>Este email foi enviado para validar a persistência de métricas.</p>',
      text: 'Email de Teste - Validação de Métricas',
      type: EmailType.TEST,
      template: 'test-metrics',
      templateData: {
        testId: `test-${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    };

    log('📋', 'Payload do email:', testPayload);

    log('🚀', 'Chamando emailServiceV2.send() com useQueue: false...');
    const sendResult = await emailServiceV2.send(testPayload, { useQueue: false });
    
    log('📬', 'Resultado do envio:', sendResult);

    if (!sendResult.success) {
      log('❌', 'ERRO: Email não foi enviado!', { error: sendResult.error });
      process.exit(1);
    }

    log('✅', `Email enviado com sucesso! Provider: ${sendResult.provider}, MessageId: ${sendResult.messageId}`);

    // ========================================
    // ETAPA 4: Aguardar Processamento
    // ========================================
    logSection('⏳ ETAPA 4: Aguardando Processamento (3 segundos)');

    log('⏱️', 'Aguardando 3 segundos para garantir que tudo foi processado...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    log('✅', 'Aguardo concluído');

    // ========================================
    // ETAPA 5: Verificar Prometheus
    // ========================================
    logSection('📊 ETAPA 5: Verificando Métricas Prometheus DEPOIS');

    log('🔍', 'Buscando métricas Prometheus...');
    const metricsAfter = await register.metrics();
    const emailMetricsAfter = metricsAfter
      .split('\n')
      .filter(line => line.includes('kaven_email_'));
    
    log('📊', `Métricas de email no Prometheus (${emailMetricsAfter.length} linhas):`);
    emailMetricsAfter.forEach(line => console.log(`  ${line}`));

    // Comparar antes e depois
    const newMetrics = emailMetricsAfter.filter(line => !emailMetricsBefore.includes(line));
    if (newMetrics.length > 0) {
      log('✅', `${newMetrics.length} NOVAS métricas detectadas no Prometheus:`);
      newMetrics.forEach(line => console.log(`  ${colors.green}+ ${line}${colors.reset}`));
    } else {
      log('⚠️', 'ATENÇÃO: Nenhuma nova métrica detectada no Prometheus!');
    }

    // ========================================
    // ETAPA 6: Verificar Banco de Dados
    // ========================================
    logSection('💾 ETAPA 6: Verificando Banco de Dados DEPOIS');

    log('🔍', 'Contando registros no banco...');
    const countAfter = await prisma.emailMetrics.count();
    log('📊', `Total de registros no banco: ${countAfter} (antes: ${countBefore})`);

    if (countAfter > countBefore) {
      log('✅', `${colors.green}SUCESSO! ${countAfter - countBefore} novo(s) registro(s) criado(s)!${colors.reset}`);
      
      log('📋', 'Último registro criado:');
      const lastRecord = await prisma.emailMetrics.findFirst({
        orderBy: { createdAt: 'desc' },
      });
      console.log(JSON.stringify(lastRecord, null, 2));
    } else {
      log('❌', `${colors.red}ERRO CRÍTICO: Nenhum registro foi criado no banco!${colors.reset}`);
      log('🔍', 'Investigando possíveis causas...');
      
      // Verificar se há erro de unique constraint
      log('🔍', 'Verificando registros de hoje...');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayRecords = await prisma.emailMetrics.findMany({
        where: {
          date: today,
        },
        select: {
          id: true,
          provider: true,
          emailType: true,
          templateCode: true,
          sentCount: true,
          createdAt: true,
        },
      });
      
      log('📋', `Registros de hoje (${todayRecords.length}):`, todayRecords);
    }

    // ========================================
    // ETAPA 7: Verificar AdvancedMetricsService
    // ========================================
    logSection('📈 ETAPA 7: Verificando AdvancedMetricsService.getEmailMetrics()');

    log('🔍', 'Chamando advancedMetricsService.getEmailMetrics()...');
    const { advancedMetricsService } = await import('../src/modules/observability/services/advanced-metrics.service');
    const emailMetrics = await advancedMetricsService.getEmailMetrics();
    
    log('📊', 'Resultado de getEmailMetrics():', emailMetrics);

    // ========================================
    // ETAPA 8: Resumo Final
    // ========================================
    logSection('📋 ETAPA 8: Resumo Final');

    const summary = {
      emailEnviado: sendResult.success,
      provider: sendResult.provider,
      messageId: sendResult.messageId,
      prometheusAntes: emailMetricsBefore.length,
      prometheusDepois: emailMetricsAfter.length,
      prometheusNovas: newMetrics.length,
      bancoAntes: countBefore,
      bancoDepois: countAfter,
      bancoNovos: countAfter - countBefore,
      agregado: {
        totalSent: emailMetrics.overview.sent,
        byProvider: emailMetrics.byProvider,
      },
    };

    log('📊', 'RESUMO COMPLETO:', summary);

    // Verificar sucesso
    if (sendResult.success && countAfter > countBefore && newMetrics.length > 0) {
      log('✅', `${colors.green}${colors.bright}TESTE PASSOU! Métricas persistidas com sucesso!${colors.reset}`);
      process.exit(0);
    } else {
      log('❌', `${colors.red}${colors.bright}TESTE FALHOU! Verifique os logs acima.${colors.reset}`);
      
      if (!sendResult.success) {
        log('❌', 'Causa: Email não foi enviado');
      }
      if (countAfter === countBefore) {
        log('❌', 'Causa: Nenhum registro criado no banco (ERRO SILENCIOSO)');
      }
      if (newMetrics.length === 0) {
        log('❌', 'Causa: Nenhuma métrica nova no Prometheus');
      }
      
      process.exit(1);
    }

  } catch (error) {
    logSection('💥 ERRO FATAL');
    log('❌', 'Erro durante execução do teste:', {
      name: (error as Error).name,
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    process.exit(1);
  } finally {
    // Cleanup
    await prisma.$disconnect();
  }
}

// Executar teste
testEmailMetrics();
