import { config } from 'dotenv';
import { resolve } from 'path';

// Carregar .env
config({ path: resolve(__dirname, '../.env') });

async function testResendApiKey() {
  console.log('\n🧪 TESTE DE API KEY DO RESEND\n');

  // Buscar API key do .env
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log('❌ RESEND_API_KEY não encontrada no .env');
    return;
  }

  console.log('✅ API Key encontrada:', apiKey.substring(0, 10) + '...');
  console.log('\n📡 Testando conectividade com Resend API...\n');

  try {
    const response = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('\n❌ ERRO NA RESPOSTA:');
      console.log(errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.log('\n📋 Detalhes do erro:');
        console.log(JSON.stringify(errorJson, null, 2));
      } catch {
        // Não é JSON
      }

      return;
    }

    const data = await response.json();
    console.log('\n✅ SUCESSO! API Key válida');
    console.log('\n📋 Dados retornados:');
    console.log(JSON.stringify(data, null, 2));

    if (data.data) {
      console.log(`\n📊 Total de domínios: ${data.data.length}`);
      const verified = data.data.filter((d: any) => d.status === 'verified').length;
      console.log(`✅ Domínios verificados: ${verified}`);
    }

  } catch (error: any) {
    console.log('\n❌ ERRO DE REDE:');
    console.log(error.message);
    console.log(error.stack);
  }
}

testResendApiKey().catch(console.error);
