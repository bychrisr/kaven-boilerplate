import { PrismaClient } from '@prisma/client';
import { decrypt } from '../src/lib/crypto/encryption';

const prisma = new PrismaClient();

async function checkResendIntegration() {
  console.log('\n🔍 VERIFICANDO INTEGRAÇÃO RESEND NO BANCO\n');

  try {
    const resendIntegrations = await prisma.emailIntegration.findMany({
      where: { provider: 'RESEND' },
    });

    if (resendIntegrations.length === 0) {
      console.log('❌ Nenhuma integração Resend encontrada no banco');
      return;
    }

    console.log(`✅ Encontradas ${resendIntegrations.length} integração(ões) Resend\n`);

    for (const integration of resendIntegrations) {
      console.log('━'.repeat(60));
      console.log(`📧 Integração ID: ${integration.id}`);
      console.log(`   Provider: ${integration.provider}`);
      console.log(`   Active: ${integration.isActive}`);
      console.log(`   Primary: ${integration.isPrimary}`);
      console.log(`   From: ${integration.fromName} <${integration.fromEmail}>`);
      console.log(`   Domains: ${integration.transactionalDomain}, ${integration.marketingDomain}`);
      
      // Tentar descriptografar API key
      if (integration.apiKey) {
        try {
          const decryptedKey = decrypt(integration.apiKey);
          console.log(`   API Key (criptografada): ${integration.apiKey.substring(0, 20)}...`);
          console.log(`   API Key (descriptografada): ${decryptedKey.substring(0, 10)}...`);
          
          // Testar API key
          console.log('\n   🧪 Testando API key...');
          const response = await fetch('https://api.resend.com/domains', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${decryptedKey}`,
              'Content-Type': 'application/json',
            },
          });

          console.log(`   📊 Status: ${response.status} ${response.statusText}`);

          if (response.ok) {
            const data = await response.json();
            console.log(`   ✅ API Key VÁLIDA!`);
            console.log(`   📊 Domínios: ${data.data?.length || 0}`);
            console.log(`   ✅ Verificados: ${data.data?.filter((d: any) => d.status === 'verified').length || 0}`);
          } else {
            const errorText = await response.text();
            console.log(`   ❌ API Key INVÁLIDA!`);
            console.log(`   📋 Erro: ${errorText}`);
          }

        } catch (error: any) {
          console.log(`   ❌ Erro ao descriptografar: ${error.message}`);
        }
      } else {
        console.log(`   ⚠️  API Key não configurada`);
      }

      console.log('');
    }

  } catch (error: any) {
    console.log('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkResendIntegration().catch(console.error);
