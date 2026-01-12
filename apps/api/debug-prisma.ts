
import { PrismaClient } from '@prisma/client';

console.log('--- DEBUGGING PRISMA CLIENT ---');
try {
  const prisma = new PrismaClient();
  // @ts-ignore
  const dmmf = prisma._dmmf;
  if (!dmmf) {
      console.log('No DMMF found in PrismaClient instance');
  } else {
    // Check if TenantInvite model exists in DMMF
    const tenantInviteModel = dmmf.datamodel.models.find((m: any) => m.name === 'TenantInvite');
    if (tenantInviteModel) {
        console.log('✅ Model TenantInvite FOUND in runtime DMMF');
        // Check fields
        const usedAtField = tenantInviteModel.fields.find((f: any) => f.name === 'usedAt');
        if (usedAtField) {
            console.log('✅ Field usedAt FOUND in TenantInvite');
        } else {
             console.log('❌ Field usedAt NOT FOUND in TenantInvite model');
        }
    } else {
        console.log('❌ Model TenantInvite NOT FOUND in runtime DMMF');
    }

     // Check PasswordResetToken
    const prtModel = dmmf.datamodel.models.find((m: any) => m.name === 'PasswordResetToken');
    if (prtModel) {
        console.log('✅ Model PasswordResetToken FOUND in runtime DMMF');
         const usedAtField = prtModel.fields.find((f: any) => f.name === 'usedAt');
         if (usedAtField) {
             console.log('✅ Field usedAt FOUND in PasswordResetToken');
         } else {
              console.log('❌ Field usedAt NOT FOUND in PasswordResetToken model');
         }
    } else {
         console.log('❌ Model PasswordResetToken NOT FOUND in runtime DMMF');
    }
  }

} catch (e) {
  console.error('Error instantiating PrismaClient:', e);
}

// Check where require resolves to
try {
    const resolvedPath = require.resolve('@prisma/client');
    console.log('Resolved @prisma/client path:', resolvedPath);
} catch (e) {
    console.error('Could not resolve @prisma/client:', e);
}
