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

const sampleMarkdown = `
# Streamdown Render Benchmark

## Features
- **bold**
- *italic*
- \`inline code\`

\`\`\`ts
const value = 42;
console.log(value);
\`\`\`

| Name | Value |
| ---- | ----- |
| A    | 1     |
| B    | 2     |
`;

describe('markdown engine rendering', () => {
  bench('render blocks (static)', () => {
    engine.renderBlocks(sampleMarkdown, { mode: 'static' });
  });

  bench('render blocks (streaming)', () => {
    engine.renderBlocks(sampleMarkdown, { mode: 'streaming' });
  });

  bench('render blocks with cache hit', () => {
    engine.renderBlocks(sampleMarkdown, { mode: 'static' });
    engine.renderBlocks(sampleMarkdown, { mode: 'static' });
  });
});
