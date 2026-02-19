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

  it('accepts capabilities input from host template', () => {
    const previewSource = readFileSync(
      new URL('../../../preview/markdown-preview.component.ts', import.meta.url),
      'utf8'
    );

    expect(previewSource).toContain('[capabilities]="markdownCapabilities()"');
  });

  it('styles gfm task list checkboxes', () => {
    const styleSource = readFileSync(
      new URL('./markdown.component.css', import.meta.url),
      'utf8'
    );

    expect(styleSource).toContain('.sd-root ul.contains-task-list');
    expect(styleSource).toContain(".sd-root li.task-list-item > input[type='checkbox']");
  });
});
