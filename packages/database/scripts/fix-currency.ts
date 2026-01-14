import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixCurrency() {
  console.log('🔧 Fixing Platform Currency from BTC to SATS...\n');

  // 1. Verificar estado atual
  const config = await prisma.platformConfig.findFirst();
  console.log('📋 Current config:', {
    id: config?.id,
    currency: config?.currency,
  });

  if (!config) {
    console.error('❌ No PlatformConfig found!');
    process.exit(1);
  }

  // 2. Verificar se SATS existe
  const satsCurrency = await prisma.currency.findFirst({
    where: { code: 'SATS' },
  });

  console.log('\n⚡ SATS currency:', {
    exists: !!satsCurrency,
    code: satsCurrency?.code,
    name: satsCurrency?.name,
    decimals: satsCurrency?.decimals,
    iconType: satsCurrency?.iconType,
    hasIconSvgPath: !!satsCurrency?.iconSvgPath,
  });

  if (!satsCurrency) {
    console.error('❌ SATS currency not found in database!');
    process.exit(1);
  }

  // 3. Atualizar para SATS
  const updated = await prisma.platformConfig.update({
    where: { id: config.id },
    data: { currency: 'SATS' },
  });

  console.log('\n✅ Updated config:', {
    id: updated.id,
    currency: updated.currency,
  });

  console.log('\n🎉 Done! Platform currency is now SATS');
  console.log('💡 Reload your dashboard to see the changes');
}

fixCurrency()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
