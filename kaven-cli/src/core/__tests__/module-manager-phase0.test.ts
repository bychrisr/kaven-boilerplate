import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModuleManager } from '../module-manager.js';
import { fsUtils } from '../../lib/fs.js';
import path from 'path';

// Mock fsUtils methods directly since it is an exported instance
vi.mock('../../lib/fs.js', () => ({
    fsUtils: {
        exists: vi.fn(),
        readJSON: vi.fn(),
        readKavenConfig: vi.fn(),
        writeKavenConfig: vi.fn(),
        copy: vi.fn(),
        remove: vi.fn(),
        readFile: vi.fn(),
        writeFile: vi.fn(),
    }
}));

describe('ModuleManager Phase 0', () => {
    let moduleManager: ModuleManager;
    const projectRoot = '/mock/project/root';

    beforeEach(() => {
        vi.resetAllMocks();
        moduleManager = new ModuleManager(projectRoot);
    });

    it('should load manifest and inject code via anchors', async () => {
        // Mock manifest loading
        vi.mocked(fsUtils.exists).mockResolvedValue(true);
        vi.mocked(fsUtils.readJSON).mockResolvedValue({
            name: 'Test Module',
            slug: 'test-module',
            version: '1.0.0',
            description: 'Test',
            category: 'feature',
            files: [],
            injections: [
                {
                    targetFile: 'app.ts',
                    type: 'anchor',
                    anchor: 'TEST_ANCHOR',
                    content: 'import { test } from "test";',
                    dedupeKey: 'test-import',
                    strategy: 'append'
                }
            ]
        });

        // Mock Config
        vi.mocked(fsUtils.readKavenConfig).mockResolvedValue({
            name: 'test-project',
            version: '1.0.0',
            kaven: {
                version: '2.0.0',
                installedAt: '',
                repository: '',
                features: { multiTenant: true, database: 'postgresql' },
                modules: { core: {}, optional: {} },
                customizations: { addedModules: [], removedModules: [] }
            }
        } as any);

        // Mock Target File
        vi.mocked(fsUtils.readFile).mockResolvedValue(`
import x from 'y';
// [TEST_ANCHOR]
        `);

        // Execute
        await moduleManager.execute({ name: 'test-module', action: 'add' });

        // Assert Injections
        const writeFileCall = vi.mocked(fsUtils.writeFile).mock.calls[0];
        expect(writeFileCall).toBeDefined();
        
        const [filePath, content] = writeFileCall;
        expect(filePath).toBe(path.join(projectRoot, 'app.ts'));
        expect(content).toContain('// [KAVEN:test-module:test-import:START]');
        expect(content).toContain('import { test } from "test";');
        expect(content).toContain('// [KAVEN:test-module:test-import:END]');
        expect(content).toContain('// [TEST_ANCHOR]'); // Anchor should be preserved
    });

    it('should remove injected code idempotently', async () => {
        // Mock manifest 
        vi.mocked(fsUtils.exists).mockResolvedValue(true);
        vi.mocked(fsUtils.readJSON).mockResolvedValue({
            name: 'Test Module',
            version: '1.0.0',
            description: 'Test Description',
            category: 'feature',
            slug: 'test-module',
            files: [],
            injections: [
                {
                    targetFile: 'app.ts',
                    type: 'anchor',
                    anchor: 'TEST_ANCHOR',
                    content: 'import { test } from "test";',
                    dedupeKey: 'test-import'
                }
            ]
        });

        // Mock Config (installed)
        vi.mocked(fsUtils.readKavenConfig).mockResolvedValue({
            kaven: { 
                modules: { optional: { 'test-module': true } },
                customizations: { addedModules: ['test-module'], removedModules: [] } 
            }
        } as any);

        // Mock Target File containing injection
        vi.mocked(fsUtils.readFile).mockResolvedValue(`
import x from 'y';
// [KAVEN:test-module:test-import:START]
import { test } from "test";
// [KAVEN:test-module:test-import:END]
// [TEST_ANCHOR]
        `);

        // Execute
        await moduleManager.execute({ name: 'test-module', action: 'remove' });

        // Assert Removal
        const writeFileCall = vi.mocked(fsUtils.writeFile).mock.calls[0];
        expect(writeFileCall).toBeDefined();
        
        const [filePath, content] = writeFileCall;
        expect(content).not.toContain('import { test } from "test";');
        expect(content).not.toContain('KAVEN:test-module:test-import:START');
    });
});
