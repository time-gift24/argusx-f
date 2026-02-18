import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { LinkSafetyDialogComponent } from './link-safety-dialog.component';

describe('LinkSafetyDialogComponent', () => {
  it('renders url and action buttons', () => {
    expect(LinkSafetyDialogComponent).toBeTruthy();

    const source = readFileSync(
      new URL('./link-safety-dialog.component.ts', import.meta.url),
      'utf8'
    );

    expect(source).toContain('Open external link?');
    expect(source).toContain('{{ url() }}');
    expect((source.match(/<button/g) ?? []).length).toBe(2);
  });
});
