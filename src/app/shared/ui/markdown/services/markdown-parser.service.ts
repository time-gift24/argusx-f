import { Injectable } from '@angular/core';
import { Lexer } from 'marked';

const FOOTNOTE_REFERENCE = /\[\^[\w-]{1,200}\](?!:)/;
const FOOTNOTE_DEFINITION = /\[\^[\w-]{1,200}\]:/;
const CLOSING_TAG = /<\/(\w+)>/;
const OPENING_TAG = /<(\w+)[\s>]/;

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img',
  'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

@Injectable({ providedIn: 'root' })
export class MarkdownParserService {
  parseBlocks(markdown: string): string[] {
    // 脚注整体返回
    if (FOOTNOTE_REFERENCE.test(markdown) || FOOTNOTE_DEFINITION.test(markdown)) {
      return [markdown];
    }

    const tokens = Lexer.lex(markdown, { gfm: true });
    const blocks: string[] = [];
    const htmlStack: string[] = [];
    let previousTokenWasCode = false;

    for (const token of tokens) {
      const raw = token.raw;

      // HTML 块合并
      if (htmlStack.length > 0) {
        blocks[blocks.length - 1] += raw;
        if (token.type === 'html') {
          const match = raw.match(CLOSING_TAG);
          if (match && htmlStack.at(-1) === match[1]) {
            htmlStack.pop();
          }
        }
        continue;
      }

      // HTML 块开始
      if (token.type === 'html' && token.block) {
        const match = raw.match(OPENING_TAG);
        if (match) {
          const tag = match[1];
          const hasClosing = raw.includes(`</${tag}>`);
          if (!hasClosing && !VOID_ELEMENTS.has(tag.toLowerCase())) {
            htmlStack.push(tag);
          }
        }
      }

      blocks.push(raw);
      if (token.type !== 'space') {
        previousTokenWasCode = token.type === 'code';
      }
    }

    return blocks.filter(b => b.length > 0);
  }
}
