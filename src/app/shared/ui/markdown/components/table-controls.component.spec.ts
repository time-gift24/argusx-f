import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { TableControlsComponent } from './table-controls.component';

describe('TableControlsComponent', () => {
  it('creates copy/download controls', () => {
    expect(TableControlsComponent).toBeTruthy();

    const source = readFileSync(
      new URL('./table-controls.component.ts', import.meta.url),
      'utf8'
    );
    const buttonCount = (source.match(/<button/g) ?? []).length;

    expect(buttonCount).toBe(2);
  });
});
