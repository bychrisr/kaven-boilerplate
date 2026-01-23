import { describe, it, expect, vi } from 'vitest';
import { MarkerEngine } from '../marker-engine.js';

describe('MarkerEngine V2', () => {
  const mockLogger = { debug: () => {}, info: () => {}, warn: () => {}, error: () => {} } as any;
  const engine = new MarkerEngine(mockLogger);
  const fileContent = `
import { A } from 'a';
// [KAVEN_ANCHOR]
const b = 1;
  `;

  it('should inject new block before anchor', () => {
    const result = engine.inject({
      moduleId: 'test_mod',
      injectionId: 'import_b',
      targetFileContent: fileContent,
      codeToInject: "import { B } from 'b';",
      anchor: '// [KAVEN_ANCHOR]',
      mode: 'before'
    });

    expect(result).toContain('// [KAVEN_MODULE:test_mod:import_b:START]');
    expect(result).toContain("import { B } from 'b';");
    expect(result).toContain('// [KAVEN_MODULE:test_mod:import_b:END]');
    // Ensure order
    const anchorIdx = result.indexOf('// [KAVEN_ANCHOR]');
    const injectionIdx = result.indexOf("import { B } from 'b';");
    expect(injectionIdx).toBeLessThan(anchorIdx);
  });

  it('should update existing block', () => {
    // 1. First injection
    let currentContent = engine.inject({
      moduleId: 'test_mod',
      injectionId: 'block1',
      targetFileContent: fileContent,
      codeToInject: 'console.log("v1");',
      anchor: '// [KAVEN_ANCHOR]',
      mode: 'after'
    });

    // 2. Update injection
    currentContent = engine.inject({
      moduleId: 'test_mod',
      injectionId: 'block1',
      targetFileContent: currentContent,
      codeToInject: 'console.log("v2_updated");',
      anchor: '// [KAVEN_ANCHOR]',
      mode: 'after'
    });

    // Assertions
    expect(currentContent).toContain('console.log("v2_updated");');
    expect(currentContent).not.toContain('console.log("v1");');
    // Ensure no duplication of markers
    const startMarkers = currentContent.match(/START/g);
    expect(startMarkers?.length).toBe(1);
  });

  it('should eject block cleanly', () => {
    // Inject first
    let content = engine.inject({
      moduleId: 'test_mod',
      injectionId: 'to_remove',
      targetFileContent: fileContent,
      codeToInject: 'REMOVE_ME',
      anchor: '// [KAVEN_ANCHOR]',
      mode: 'before'
    });

    // Eject
    content = engine.eject('test_mod', 'to_remove', content);

    expect(content).not.toContain('REMOVE_ME');
    expect(content).not.toContain('KAVEN_MODULE:test_mod');
  });
});
