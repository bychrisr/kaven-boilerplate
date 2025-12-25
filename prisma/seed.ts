import { SetupService } from '../apps/api/src/services/setup.service';
import { DEFAULT_SEED_CONFIG } from '../apps/api/src/types/seed-config';

/**
 * Seed Script CLI
 * Executa o seed do banco de dados via terminal
 * Usa o SetupService para manter lógica reutilizável
 */
async function main() {
  console.log('🌱 Kaven Boilerplate - Database Seed');
  console.log('=====================================\n');
  
  try {
    const result = await SetupService.seedDatabase(DEFAULT_SEED_CONFIG);
    
    console.log('\n=====================================');
    console.log('✅ Seed completed successfully!');
    console.log(`📦 Tenant: ${result.tenant.name} (${result.tenant.slug})`);
    console.log(`👥 Users: ${result.users.length} created`);
    
  } catch (error) {
    console.error('\n=====================================');
    console.error('❌ Fatal error during seed:', error);
    process.exit(1);
  } finally {
    await SetupService.disconnect();
  }
}

main();
