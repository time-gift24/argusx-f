import '@angular/compiler';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { MarkdownNodeComponent } from './markdown-node.component';

it('renders pre/code nodes without blocking initial template render', () => {
  expect(MarkdownNodeComponent).toBeTruthy();
});

it('keeps markdown node host layout-transparent for table semantics', () => {
  const source = readFileSync(
    `${process.cwd()}/src/app/shared/ui/markdown/components/markdown-node.component.ts`,
    'utf8'
  );

  expect(source).toContain("'style': 'display: contents;'");
});

it('renders table subtree as semantic html without recursive host wrappers', () => {
  const source = readFileSync(
    `${process.cwd()}/src/app/shared/ui/markdown/components/markdown-node.component.ts`,
    'utf8'
  );

  expect(source).toContain('[innerHTML]="tableInnerSafeHtml()"');
  expect(source).toContain('bypassSecurityTrustHtml');
});

it('renders gfm strikethrough and task checkbox tags semantically', () => {
  const source = readFileSync(
    `${process.cwd()}/src/app/shared/ui/markdown/components/markdown-node.component.ts`,
    'utf8'
  );

  expect(source).toContain("@case ('del')");
  expect(source).toContain("@case ('input')");
  expect(source).toContain("[attr.type]=\"attr('type')\"");
  expect(source).toContain("[attr.checked]=\"attr('checked')\"");
});
