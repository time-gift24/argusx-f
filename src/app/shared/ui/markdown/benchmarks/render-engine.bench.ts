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
const presets = ['base', 'mermaid', 'math+cjk', 'full'] as const;
const benchOptionsBySize = {
  10: { iterations: 8, warmupIterations: 2 },
  100: { iterations: 4, warmupIterations: 1 },
  500: { iterations: 2, warmupIterations: 1 },
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
## Section
Regular paragraph with **bold**, *italic*, and [link](https://example.com).

\`\`\`ts
export const aggregate = (items: number[]) => items.reduce((sum, value) => sum + value, 0);
\`\`\`

\`\`\`mermaid
graph TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Run]
  B -->|No| D[Wait]
\`\`\`

| Metric | Value | Unit |
| ------ | ----- | ---- |
| p50 | 10 | ms |
| p95 | 28 | ms |
| p99 | 42 | ms |

Inline math $E = mc^2$ and block math:
$$
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$
`;

  const targetChars = targetKb * 1024;
  let output = '# Markdown Render Benchmark\n\n';
  while (output.length < targetChars) {
    output += section;
  }

  return output.slice(0, targetChars);
};

for (const sizeKb of sizesKb) {
  const markdown = buildMarkdown(sizeKb);
  const benchOptions = benchOptionsBySize[sizeKb];

  describe(`markdown engine rendering ${sizeKb}KB`, () => {
    for (const preset of presets) {
      const plugins = buildPlugins(preset);

      bench(
        `static | ${preset}`,
        () => {
          engine.renderBlocks(markdown, {
            mode: 'static',
            plugins,
            capabilities: { plugins },
          });
        },
        benchOptions
      );

      bench(
        `streaming | ${preset}`,
        () => {
          engine.renderBlocks(markdown, {
            mode: 'streaming',
            plugins,
            capabilities: { plugins },
          });
        },
        benchOptions
      );
    }
  });
}
