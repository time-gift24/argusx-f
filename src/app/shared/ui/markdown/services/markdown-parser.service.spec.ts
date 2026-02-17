import { describe, expect, it } from 'vitest';
import { MarkdownParserService } from './markdown-parser.service';

describe('MarkdownParserService', () => {
  it('merges blocks when there is an unmatched $$ pair in streaming markdown', () => {
    const parser = new MarkdownParserService();
    const input = [
      'Here is math:',
      '',
      '$$',
      'a + b',
      '',
      '- list item',
      '',
      'closing now $$',
    ].join('\n');

    const blocks = parser.parseBlocks(input);

    expect(blocks.length).toBe(3);
    expect(blocks[2]).toContain('$$\na + b');
    expect(blocks[2]).toContain('- list item');
    expect(blocks[2]).toContain('closing now $$');
  });
});
