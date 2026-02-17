import { Injectable } from '@angular/core';
import { Lexer } from 'marked';

const FOOTNOTE_REFERENCE = /\[\^[\w-]{1,200}\](?!:)/;
const FOOTNOTE_DEFINITION = /\[\^[\w-]{1,200}\]:/;
const CLOSING_TAG = /<\/(\w+)>/;
const OPENING_TAG = /<(\w+)[\s>]/;

const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const countDoubleDollars = (value: string): number => {
  let count = 0;

  for (let i = 0; i < value.length - 1; i += 1) {
    if (value[i] === '$' && value[i + 1] === '$') {
      count += 1;
      i += 1;
    }
  }

  return count;
};

@Injectable({ providedIn: 'root' })
export class MarkdownParserService {
  parseBlocks(markdown: string): string[] {
    if (!markdown) {
      return [];
    }

    if (FOOTNOTE_REFERENCE.test(markdown) || FOOTNOTE_DEFINITION.test(markdown)) {
      return [markdown];
    }

    const tokens = Lexer.lex(markdown, { gfm: true });
    const blocks: string[] = [];
    const htmlStack: string[] = [];
    let previousTokenWasCode = false;

    for (const token of tokens) {
      const raw = token.raw;
      const blocksLength = blocks.length;

      if (htmlStack.length > 0) {
        blocks[blocksLength - 1] += raw;

        if (token.type === 'html') {
          const closingTagMatch = raw.match(CLOSING_TAG);
          if (closingTagMatch && htmlStack.at(-1) === closingTagMatch[1]) {
            htmlStack.pop();
          }
        }

        continue;
      }

      if (token.type === 'html' && token.block) {
        const openingTagMatch = raw.match(OPENING_TAG);

        if (openingTagMatch) {
          const tagName = openingTagMatch[1];
          const hasClosingTag = raw.includes(`</${tagName}>`);

          if (!(hasClosingTag || VOID_ELEMENTS.has(tagName.toLowerCase()))) {
            htmlStack.push(tagName);
          }
        }
      }

      if (blocksLength > 0 && !previousTokenWasCode) {
        const previousBlock = blocks[blocksLength - 1];
        const previousDollarCount = countDoubleDollars(previousBlock);

        if (previousDollarCount % 2 === 1) {
          blocks[blocksLength - 1] = previousBlock + raw;
          continue;
        }
      }

      blocks.push(raw);

      if (token.type !== 'space') {
        previousTokenWasCode = token.type === 'code';
      }
    }

    return blocks;
  }
}
