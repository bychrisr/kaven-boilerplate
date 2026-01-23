import { prisma } from '../../lib/prisma'; // Assuming standard prisma lib location or ../../lib/prisma
import { LicenseStatus } from '@prisma/client';
import crypto from 'crypto';

export class LicensingService {
  /**
   * Issue a new license key for a user and module
   */
  async issueLicense(userId: string, moduleSlug: string, purchaseId?: string) {
    // Generate a secure random key: KVN-XXXX-XXXX-XXXX
    const randomPart = crypto.randomBytes(6).toString('hex').toUpperCase();
    const key = `KVN-${moduleSlug.toUpperCase().substring(0, 3)}-${randomPart}`;

    return await prisma.license.create({
      data: {
        key,
        userId,
        moduleSlug,
        purchaseId,
        status: LicenseStatus.ACTIVE
      }
    });
  }

  /**
   * Verify a license key
   */
  async verifyLicense(key: string, moduleSlug?: string): Promise<{ valid: boolean; reason?: string; license?: any }> {
    const license = await prisma.license.findUnique({
      where: { key },
      include: { user: true }
    });

    if (!license) {
      return { valid: false, reason: 'License key not found' };
    }

    if (license.status !== LicenseStatus.ACTIVE) {
      return { valid: false, reason: `License is ${license.status}` };
    }

    if (license.expiresAt && license.expiresAt < new Date()) {
      return { valid: false, reason: 'License expired' };
    }

    if (moduleSlug && license.moduleSlug !== moduleSlug) {
      return { valid: false, reason: 'License not valid for this module' };
    }

    return { valid: true, license };
  }

  /**
   * Revoke a license
   */
  async revokeLicense(key: string) {
    return await prisma.license.update({
      where: { key },
      data: {
        status: LicenseStatus.REVOKED,
        revokedAt: new Date()
      }
    });
  }
}

export const licensingService = new LicensingService();
