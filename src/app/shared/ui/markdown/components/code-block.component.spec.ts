import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('CodeBlockComponent', () => {
  it('hides header when showHeader is false', () => {
    const nodeSource = readFileSync(
      new URL('./markdown-node.component.ts', import.meta.url),
      'utf8'
    );

    expect(nodeSource).toContain(
      '[showHeader]="renderCapabilities().controls.code"'
    );
  });
});
