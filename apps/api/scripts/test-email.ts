#!/usr/bin/env tsx

/**
 * Script de Teste: Envio de E-mail via MailHog
 * 
 * Uso:
 *   pnpm tsx scripts/test-email.ts
 * 
 * Pré-requisitos:
 *   - MailHog rodando em localhost:1025
 *   - Banco de dados com seed executado
 */

import { emailServiceV2 } from '../src/lib/email';
import { EmailType } from '../src/lib/email/types';

async function testEmailSending() {
  console.log('🧪 Iniciando teste de envio de e-mail...\n');

  try {
    // 1. Inicializar o serviço
    console.log('📋 Inicializando EmailServiceV2...');
    await emailServiceV2.initialize();
    console.log('✅ EmailServiceV2 inicializado com sucesso\n');

    // 2. Enviar e-mail de teste
    console.log('📧 Enviando e-mail de teste...');
    const result = await emailServiceV2.send(
      {
        to: 'test@example.com',
        subject: 'Teste de Infraestrutura de E-mail - Kaven',
        html: `
          <h1>Teste de E-mail</h1>
          <p>Este é um e-mail de teste enviado via MailHog.</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          <p><strong>Provider:</strong> SMTP (MailHog)</p>
        `,
        text: 'Este é um e-mail de teste enviado via MailHog.',
        type: EmailType.TRANSACTIONAL,
      },
      { useQueue: false } // Envio direto para teste
    );

    // 3. Verificar resultado
    if (result.success) {
      console.log('✅ E-mail enviado com sucesso!');
      console.log(`   Message ID: ${result.messageId}`);
      console.log(`   Provider: ${result.provider}`);
      console.log('\n📬 Verifique o MailHog em: http://localhost:8025');
    } else {
      console.error('❌ Falha ao enviar e-mail:');
      console.error(`   Erro: ${result.error}`);
      process.exit(1);
    }

    console.log('\n✅ Teste concluído com sucesso!');
  } catch (error: any) {
    console.error('\n❌ Erro durante o teste:');
    console.error(error);
    process.exit(1);
  }
}

// Executar teste
testEmailSending();
