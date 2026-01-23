import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DownloadManager } from '../download-manager.js';
import { ILogger } from '../logger.js';
import { ICryptoService } from '../security/crypto.service.js';
import fs from 'fs-extra';
import axios from 'axios';
import * as tar from 'tar';

vi.mock('fs-extra');
vi.mock('axios');
vi.mock('tar');

describe('DownloadManager', () => {
    let downloadManager: DownloadManager;
    let mockLogger: ILogger;
    let mockCrypto: ICryptoService;

    beforeEach(() => {
        mockLogger = {
            startSpinner: vi.fn(),
            stopSpinner: vi.fn(),
            succeedSpinner: vi.fn(),
            failSpinner: vi.fn(),
            box: vi.fn(),
            info: vi.fn(),
            success: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
            debug: vi.fn(),
        } as any;

        mockCrypto = {
            verifyFileSignature: vi.fn(),
            calculateChecksum: vi.fn(),
        };

        downloadManager = new DownloadManager(mockLogger, mockCrypto);
        
        vi.mocked(fs.ensureDir).mockResolvedValue(undefined);
        vi.mocked(fs.writeFile).mockResolvedValue(undefined);
        vi.mocked(fs.remove).mockResolvedValue(undefined);
    });

    it('should download, verify and extract valid module', async () => {
        const token = {
            url: 'https://test.com/mod.tgz',
            sha256: 'valid-sha',
            signature: 'valid-sig',
            publicKey: 'valid-pub'
        };

        // Mocks
        vi.mocked(axios).mockResolvedValue({ data: Buffer.from('content') });
        vi.mocked(mockCrypto.calculateChecksum).mockResolvedValue('valid-sha');
        vi.mocked(mockCrypto.verifyFileSignature).mockResolvedValue(true);
        vi.mocked(tar.x).mockResolvedValue(undefined);

        // Act
        await downloadManager.downloadAndExtract('mod-name', token, '/target');

        // Assert
        expect(axios).toHaveBeenCalled();
        expect(mockCrypto.calculateChecksum).toHaveBeenCalled();
        expect(mockCrypto.verifyFileSignature).toHaveBeenCalled();
        expect(tar.x).toHaveBeenCalled();
        expect(mockLogger.succeedSpinner).toHaveBeenCalledWith(expect.stringContaining('Extracted'));
    });

    it('should fail if checksum mismatch', async () => {
        const token = {
            url: 'https://test.com/mod.tgz',
            sha256: 'valid-sha',
            signature: 'valid-sig',
            publicKey: 'valid-pub'
        };

        vi.mocked(axios).mockResolvedValue({ data: Buffer.from('content') });
        vi.mocked(mockCrypto.calculateChecksum).mockResolvedValue('invalid-sha');

        await expect(downloadManager.downloadAndExtract('mod-name', token, '/target'))
            .rejects.toThrow(/Checksum mismatch/);
    });

    it('should fail if signature invalid', async () => {
        const token = {
            url: 'https://test.com/mod.tgz',
            sha256: 'valid-sha',
            signature: 'valid-sig',
            publicKey: 'valid-pub'
        };

        vi.mocked(axios).mockResolvedValue({ data: Buffer.from('content') });
        vi.mocked(mockCrypto.calculateChecksum).mockResolvedValue('valid-sha');
        vi.mocked(mockCrypto.verifyFileSignature).mockResolvedValue(false);

        await expect(downloadManager.downloadAndExtract('mod-name', token, '/target'))
            .rejects.toThrow(/Invalid signature/);
    });
});
