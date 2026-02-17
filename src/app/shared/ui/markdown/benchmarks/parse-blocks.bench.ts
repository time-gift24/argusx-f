import { bench, describe } from 'vitest';
import { MarkdownParserService } from '../services/markdown-parser.service';

const parser = new MarkdownParserService();

const singleBlock = '# Heading\n\nThis is a paragraph.';
const multipleBlocks = `
# Heading 1

This is paragraph 1.

## Heading 2

This is paragraph 2.

- List item 1
- List item 2

> Blockquote text
`;

const manyBlocks = Array.from(
  { length: 100 },
  (_, index) => `## Section ${index}\n\nParagraph ${index}`
).join('\n\n');

const htmlBlocks = `
<div class="card">
  <p>HTML content</p>
</div>

## Heading

Paragraph text
`;

const mathAndFootnotes = `
This is text with a footnote[^1].

$$
\\int_0^\\infty x^2 dx
$$

[^1]: This is the first footnote.
`;

describe('markdown parser block splitting', () => {
  bench('single block', () => {
    parser.parseBlocks(singleBlock);
  });

  bench('multiple blocks (10)', () => {
    parser.parseBlocks(multipleBlocks);
  });

  bench('many blocks (100)', () => {
    parser.parseBlocks(manyBlocks);
  });

  bench('html blocks', () => {
    parser.parseBlocks(htmlBlocks);
  });

  bench('math and footnotes', () => {
    parser.parseBlocks(mathAndFootnotes);
  });
});
