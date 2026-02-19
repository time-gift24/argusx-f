import '@angular/compiler';
import { Injector, runInInjectionContext } from '@angular/core';
import type { MermaidConfig } from 'mermaid';
import type { Plugin } from 'unified';
import { bench, describe } from 'vitest';
import type { MarkdownPlugins } from '../models/markdown-plugin.models';
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

const sizesKb = [10, 100, 500] as const;
const chunkRates = [10, 30, 60] as const;
const presets = ['base', 'mermaid', 'math+cjk', 'full'] as const;
const streamUpdatesByRate = {
  10: 10,
  30: 20,
  60: 30,
} as const;
const benchOptionsBySize = {
  10: { iterations: 4, warmupIterations: 1 },
  100: { iterations: 2, warmupIterations: 1 },
  500: { iterations: 1, warmupIterations: 0 },
} as const;

const noopPlugin: Plugin<[], any> = () => () => undefined;

const previewMermaidPlugin = {
  name: 'mermaid' as const,
  type: 'diagram' as const,
  language: 'mermaid',
  getMermaid(config?: MermaidConfig) {
    return {
      initialize(_cfg: MermaidConfig) {
        void _cfg;
      },
      async render(_id: string, source: string) {
        if (config) {
          void config;
        }
        return {
          svg: `<svg xmlns="http://www.w3.org/2000/svg"><text x="0" y="14">${source.length}</text></svg>`,
        };
      },
    };
  },
};

const buildPlugins = (
  preset: (typeof presets)[number]
): MarkdownPlugins | undefined => {
  if (preset === 'base') {
    return undefined;
  }

  if (preset === 'mermaid') {
    return { mermaid: previewMermaidPlugin };
  }

  if (preset === 'math+cjk') {
    return {
      math: {
        name: 'katex',
        type: 'math',
        remarkPlugin: noopPlugin,
        rehypePlugin: noopPlugin,
      },
      cjk: {
        name: 'cjk',
        type: 'cjk',
        remarkPluginsBefore: [noopPlugin],
        remarkPluginsAfter: [noopPlugin],
        remarkPlugins: [noopPlugin, noopPlugin],
      },
    };
  }

  return {
    mermaid: previewMermaidPlugin,
    math: {
      name: 'katex',
      type: 'math',
      remarkPlugin: noopPlugin,
      rehypePlugin: noopPlugin,
    },
    cjk: {
      name: 'cjk',
      type: 'cjk',
      remarkPluginsBefore: [noopPlugin],
      remarkPluginsAfter: [noopPlugin],
      remarkPlugins: [noopPlugin, noopPlugin],
    },
  };
};

const buildMarkdown = (targetKb: number): string => {
  const section = `
# Streaming Report

## Summary
Progressive markdown payload with mixed content and controls.

\`\`\`mermaid
graph TD
  A[Start] --> B{Check}
  B -->|Yes| C[Proceed]
  B -->|No| D[Retry]
\`\`\`

\`\`\`ts
export const aggregate = (items: number[]) => items.reduce((sum, value) => sum + value, 0);
\`\`\`

| Metric | Value |
| ------ | ----- |
| p50 | 10ms |
| p95 | 28ms |
| p99 | 42ms |

Math sample:
$$
f(x) = \\frac{1}{\\sqrt{2\\pi}} e^{-\\frac{x^2}{2}}
$$
`;

  const targetChars = targetKb * 1024;
  let output = '';
  while (output.length < targetChars) {
    output += section;
  }

  return output.slice(0, targetChars);
};

const buildStreamingChunks = (markdown: string, chunksPerSecond: number): string[] => {
  const totalUpdates = streamUpdatesByRate[chunksPerSecond as 10 | 30 | 60] ?? 10;
  return Array.from({ length: totalUpdates }, (_, index) => {
    const end = Math.ceil(((index + 1) / totalUpdates) * markdown.length);
    return markdown.slice(0, end);
  });
};

for (const sizeKb of sizesKb) {
  const markdown = buildMarkdown(sizeKb);
  const benchOptions = benchOptionsBySize[sizeKb];

  for (const rate of chunkRates) {
    const chunks = buildStreamingChunks(markdown, rate);

    describe(`markdown streaming ${sizeKb}KB @ ${rate}chunk/s`, () => {
      for (const preset of presets) {
        const plugins = buildPlugins(preset);

        bench(
          `incremental updates | ${preset}`,
          () => {
            for (const chunk of chunks) {
              engine.renderBlocks(chunk, {
                mode: 'streaming',
                plugins,
                capabilities: { plugins },
              });
            }
          },
          benchOptions
        );
      }
    });
  }
}
