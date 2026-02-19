import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('button-group preview template', () => {
  it('should prevent grid stretch in non-conflict extension section', () => {
    const source = readFileSync(
      resolve(import.meta.dirname, 'button-group-preview.component.ts'),
      'utf8'
    );

    expect(source).toMatch(
      /ArgusX Plain Extension Check \(non-conflict\)[\s\S]*<div class="[^"]*grid[^"]*items-start/
    );
  });
});
