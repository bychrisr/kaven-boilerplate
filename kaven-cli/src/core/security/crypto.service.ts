import { injectable } from 'inversify';
import sodium from 'sodium-native';
import fs from 'fs-extra';
import crypto from 'crypto';
import 'reflect-metadata';

export interface ICryptoService {
  /**
   * Verify Ed25519 signature of a file
   * @param filePath Path to the file to verify
   * @param signatureHex Hex string of the signature
   * @param publicKeyHex Hex string of the public key
   */
  verifyFileSignature(filePath: string, signatureHex: string, publicKeyHex: string): Promise<boolean>;
  
  /**
   * Calculate SHA256 checksum of a file
   */
  calculateChecksum(filePath: string): Promise<string>;
}

@injectable()
export class CryptoService implements ICryptoService {
  async verifyFileSignature(filePath: string, signatureHex: string, publicKeyHex: string): Promise<boolean> {
    const fileBuffer = await fs.readFile(filePath);
    
    const signature = Buffer.from(signatureHex, 'hex');
    const publicKey = Buffer.from(publicKeyHex, 'hex');

    if (signature.length !== sodium.crypto_sign_BYTES) {
        throw new Error(`Invalid signature length: ${signature.length} (expected ${sodium.crypto_sign_BYTES})`);
    }

    if (publicKey.length !== sodium.crypto_sign_PUBLICKEYBYTES) {
        throw new Error(`Invalid public key length: ${publicKey.length} (expected ${sodium.crypto_sign_PUBLICKEYBYTES})`);
    }

    return sodium.crypto_sign_verify_detached(signature, fileBuffer, publicKey);
  }

  async calculateChecksum(filePath: string): Promise<string> {
    const fileBuffer = await fs.readFile(filePath);
    const hash = crypto.createHash('sha256');
    hash.update(fileBuffer);
    return hash.digest('hex');
  }
}
