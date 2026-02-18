import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('MermaidComponent', () => {
  it('exposes capability-driven controls inputs', () => {
    const source = readFileSync(
      new URL('./mermaid.component.ts', import.meta.url),
      'utf8'
    );

    expect(source).toContain('readonly showPanZoom = input<boolean>(true);');
    expect(source).toContain('readonly showControlsBar = input<boolean>(true);');
    expect(source).toContain('readonly allowFullscreen = input<boolean>(false);');
  });
});
