#!/usr/bin/env tsx
/**
 * Script para limpar chaves criptografadas antigas
 * 
 * Como a ENCRYPTION_KEY foi gerada agora, as chaves antigas
 * não podem ser descriptografadas. Vamos limpá-las.
 */

import { prisma } from '../src/lib/prisma';

async function clearEncryptedKeys() {
  console.log('🔧 Limpando chaves criptografadas antigas...\n');

  try {
    // Atualizar integração RESEND para remover api_key antiga
    const result = await prisma.emailIntegration.updateMany({
      where: {
        provider: 'RESEND',
        apiKey: { not: null },
      },
      data: {
        apiKey: null,
        apiSecret: null,
        webhookSecret: null,
      },
    });

    console.log(`✅ ${result.count} integração(ões) atualizada(s)`);
    console.log('\n📋 Próximos passos:');
    console.log('1. Configure as integrações via Admin Panel');
    console.log('2. Ou adicione manualmente via SQL com a nova ENCRYPTION_KEY');
    console.log('\n💡 Para SMTP (MailHog), não é necessário API key');
    
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearEncryptedKeys();
