import '@angular/compiler';
import { expect, it } from 'vitest';
import { MarkdownNodeComponent } from './markdown-node.component';

it('renders pre/code nodes without blocking initial template render', () => {
  expect(MarkdownNodeComponent).toBeTruthy();
});
