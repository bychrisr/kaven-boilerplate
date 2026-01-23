import { injectable, inject } from 'inversify';
import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import * as tar from 'tar';
import { TYPES } from './ioc/types.js';
import type { ILogger } from './logger.js';
import type { ICryptoService } from './security/crypto.service.js';
import { DownloadToken } from './marketplace/marketplace-client.js';
import 'reflect-metadata';

export interface IDownloadManager {
    downloadAndExtract(name: string, token: DownloadToken, targetDir: string): Promise<void>;
}

@injectable()
export class DownloadManager implements IDownloadManager {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.CryptoService) private crypto: ICryptoService
    ) {}

    async downloadAndExtract(name: string, token: DownloadToken, targetDir: string): Promise<void> {
        const tempDir = path.join(targetDir, '.tmp_download');
        await fs.ensureDir(tempDir);
        
        const tarballPath = path.join(tempDir, `${name}.tgz`);

        try {
            // 1. Download
            this.logger.info(`Downloading ${name} from ${token.url}...`);
            const response = await axios({
                method: 'GET',
                url: token.url,
                responseType: 'arraybuffer'
            });
            await fs.writeFile(tarballPath, response.data);

            // 2. Verify Checksum
            this.logger.startSpinner('Verifying checksum...');
            const calculatedSha = await this.crypto.calculateChecksum(tarballPath);
            if (calculatedSha !== token.sha256) {
                throw new Error(`Checksum mismatch! Expected ${token.sha256}, got ${calculatedSha}`);
            }

            // 3. Verify Signature
            this.logger.startSpinner('Verifying signature...');
            const isValid = await this.crypto.verifyFileSignature(tarballPath, token.signature, token.publicKey);
            if (!isValid) {
                throw new Error('Invalid signature! The file may have been tampered with.');
            }
            this.logger.succeedSpinner('Security verification passed (SHA256 + Ed25519)');

            // 4. Extract
            this.logger.startSpinner('Extracting...');
            await fs.ensureDir(targetDir);
            await tar.x({
                file: tarballPath,
                cwd: targetDir,
                strip: 1 // Assume package/ inside tarball
            });
            this.logger.succeedSpinner('Extracted successfully');

        } catch (error) {
            this.logger.failSpinner('Download failed');
            throw error;
        } finally {
            // Cleanup
            await fs.remove(tempDir);
        }
    }
}
