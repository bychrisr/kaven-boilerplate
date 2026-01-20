import { api } from '../src/lib/api';

async function testEmailTestEndpoint() {
  console.log('\n🧪 TESTANDO ENDPOINT /api/settings/email/test\n');

  try {
    // Buscar token de autenticação do localStorage (simulado)
    // Em produção, isso viria do cookie/session
    
    const response = await api.post('/api/settings/email/test', {
      id: '75ddeb38-e8dc-4bcf-929b-33d9e07df92e', // ID da integração Resend
      mode: 'sandbox',
    });

    console.log('✅ SUCESSO!');
    console.log('Response:', JSON.stringify(response.data, null, 2));

  } catch (error: any) {
    console.log('❌ ERRO!');
    console.log('Status:', error.response?.status);
    console.log('Data:', JSON.stringify(error.response?.data, null, 2));
    console.log('Message:', error.message);
  }
}

testEmailTestEndpoint().catch(console.error);
