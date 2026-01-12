
import { TenantInvite, PrismaClient } from '@prisma/client';

export const testInvite = (invite: TenantInvite) => {
    console.log(invite.token);
    console.log(invite.usedAt);
}

const prisma = new PrismaClient();
// @ts-ignore
prisma.tenantInvite.findMany().then(invites => {
    invites.forEach(testInvite);
});
