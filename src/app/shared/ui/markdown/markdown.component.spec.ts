import '@angular/compiler';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('SdMarkdownComponent', () => {
  it('accepts capabilities while legacy remarkPlugins still works', () => {
    const source = readFileSync(
      new URL('./markdown.component.ts', import.meta.url),
      'utf8'
    );

    expect(source).toContain(
      'readonly capabilities = input<MarkdownCapabilities | undefined>(undefined);'
    );
    expect(source).toContain('normalizeCapabilities({');
  });
});
