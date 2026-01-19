#!/usr/bin/env tsx
/**
 * Script para buscar API key do Resend via Admin Panel
 * 
 * Como a API key está criptografada com a chave antiga,
 * vamos fazer login no admin panel e buscar via API.
 */

import { prisma } from '../src/lib/prisma';

async function getResendIntegration() {
  console.log('🔍 Buscando integração Resend...\n');

  try {
    const integration = await prisma.emailIntegration.findFirst({
      where: { provider: 'RESEND' },
      select: {
        id: true,
        provider: true,
        isActive: true,
        isPrimary: true,
        apiKey: true,
        fromEmail: true,
        fromName: true,
      },
    });

    if (!integration) {
      console.log('❌ Nenhuma integração Resend encontrada');
      return;
    }

    console.log('✅ Integração encontrada:');
    console.log('ID:', integration.id);
    console.log('Provider:', integration.provider);
    console.log('Active:', integration.isActive);
    console.log('Primary:', integration.isPrimary);
    console.log('From Email:', integration.fromEmail);
    console.log('From Name:', integration.fromName);
    console.log('API Key (encrypted):', integration.apiKey ? `${integration.apiKey.substring(0, 20)}...` : 'NULL');
    console.log('\n📋 Próximos passos:');
    console.log('1. Fazer login no Admin Panel (admin@kaven.dev / Admin@123)');
    console.log('2. Ir em Platform Settings > Integrations > Email');
    console.log('3. Editar integração Resend');
    console.log('4. Re-salvar com a nova ENCRYPTION_KEY');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getResendIntegration();
