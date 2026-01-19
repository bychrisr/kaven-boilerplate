#!/usr/bin/env tsx
/**
 * Script para testar validação de credenciais de todas as integrações de email
 */

import { prisma } from '../src/lib/prisma';
import { EmailServiceV2 } from '../src/lib/email';

async function testEmailIntegrationsHealth() {
  console.log('🔍 Testando validação de credenciais de email...\n');

  try {
    // Buscar todas as integrações
    const integrations = await prisma.emailIntegration.findMany({
      where: { isActive: true },
      select: {
        id: true,
        provider: true,
        isActive: true,
        isPrimary: true,
        apiKey: true,
        smtpHost: true,
        smtpPort: true,
      },
    });

    console.log(`📋 Encontradas ${integrations.length} integração(ões) ativa(s)\n`);

    // Inicializar EmailService
    const emailService = EmailServiceV2.getInstance();
    await emailService.initialize();

    // Testar cada integração
    for (const integration of integrations) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🧪 Testando: ${integration.provider}`);
      console.log(`${'='.repeat(60)}`);
      
      console.log(`ID: ${integration.id}`);
      console.log(`Active: ${integration.isActive}`);
      console.log(`Primary: ${integration.isPrimary}`);
      
      if (integration.provider === 'SMTP') {
        console.log(`SMTP Host: ${integration.smtpHost}:${integration.smtpPort}`);
      } else {
        console.log(`API Key: ${integration.apiKey ? '✅ Configurada' : '❌ Não configurada'}`);
      }

      // Executar health check
      try {
        // @ts-ignore - accessing private method for testing
        const provider = emailService.providers.get(integration.provider);
        
        if (!provider) {
          console.log(`\n❌ Provider não inicializado (credenciais faltando)\n`);
          continue;
        }

        const health = await provider.healthCheck();
        
        console.log(`\n📊 Resultado do Health Check:`);
        console.log(`Status: ${health.healthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
        console.log(`Mensagem: ${health.message}`);
        
        if (health.details) {
          console.log(`Detalhes:`, JSON.stringify(health.details, null, 2));
        }
        
        console.log('');
      } catch (error: any) {
        console.log(`\n❌ Erro ao executar health check:`);
        console.log(`   ${error.message}\n`);
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ Teste concluído!');
    console.log(`${'='.repeat(60)}\n`);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEmailIntegrationsHealth();
