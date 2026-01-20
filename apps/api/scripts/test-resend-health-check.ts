import { PrismaClient } from '@prisma/client';
import { decrypt } from '../src/lib/crypto/encryption';
import { ResendProvider } from '../src/lib/email/providers/resend.provider';

const prisma = new PrismaClient();

async function testResendHealthCheck() {
  console.log('\n🧪 TESTANDO NOVO HEALTH CHECK DO RESEND\n');

  try {
    const resendIntegration = await prisma.emailIntegration.findFirst({
      where: { provider: 'RESEND' },
    });

    if (!resendIntegration) {
      console.log('❌ Nenhuma integração Resend encontrada');
      return;
    }

    console.log(`✅ Integração encontrada: ${resendIntegration.id}\n`);

    // Descriptografar API key
    const apiKey = resendIntegration.apiKey ? decrypt(resendIntegration.apiKey) : null;

    if (!apiKey) {
      console.log('❌ API Key não configurada');
      return;
    }

    console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...\n`);

    // Criar provider
    const provider = new ResendProvider({
      apiKey,
      fromEmail: resendIntegration.fromEmail || undefined,
      fromName: resendIntegration.fromName || undefined,
      transactionalDomain: resendIntegration.transactionalDomain || undefined,
      marketingDomain: resendIntegration.marketingDomain || undefined,
    });

    // Executar health check
    console.log('🏥 Executando health check...\n');
    const result = await provider.healthCheck();

    console.log('━'.repeat(60));
    console.log(`Status: ${result.healthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
    console.log(`Message: ${result.message}`);
    if (result.details) {
      console.log(`Details:`, JSON.stringify(result.details, null, 2));
    }
    console.log('━'.repeat(60));

  } catch (error: any) {
    console.log('❌ Erro:', error.message);
    console.log(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testResendHealthCheck().catch(console.error);
