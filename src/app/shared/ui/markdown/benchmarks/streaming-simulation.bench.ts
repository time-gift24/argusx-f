import '@angular/compiler';
import { Injector, runInInjectionContext } from '@angular/core';
import { bench, describe } from 'vitest';
import { MarkdownEngineService } from '../services/markdown-engine.service';
import { MarkdownParserService } from '../services/markdown-parser.service';
import { RemendService } from '../services/remend.service';

const injector = Injector.create({
  providers: [MarkdownParserService, RemendService],
});

const engine = runInInjectionContext(
  injector,
  () => new MarkdownEngineService()
);

const complexMarkdown = `
# Streaming Report

## Summary
This is a progressively delivered markdown payload with mixed content.

### Mermaid
\`\`\`mermaid
graph TD
  A[Start] --> B{Check}
  B -->|Yes| C[Proceed]
  B -->|No| D[Retry]
\`\`\`

### Code
\`\`\`ts
export const aggregate = (items: number[]) =>
  items.reduce((sum, value) => sum + value, 0);
\`\`\`

### Table
| Metric | Value |
| ------ | ----- |
| p50    | 10ms  |
| p95    | 28ms  |
| p99    | 42ms  |
`;

const streamingChunks = Array.from({ length: 20 }, (_, index) => {
  const end = Math.ceil(((index + 1) / 20) * complexMarkdown.length);
  return complexMarkdown.slice(0, end);
});

describe('markdown streaming simulation', () => {
  bench('20 incremental streaming updates', () => {
    for (const chunk of streamingChunks) {
      engine.renderBlocks(chunk, { mode: 'streaming' });
    }
  });
});
