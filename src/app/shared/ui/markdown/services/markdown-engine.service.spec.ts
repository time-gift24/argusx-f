import '@angular/compiler';
import { Injector, runInInjectionContext } from '@angular/core';
import { describe, expect, it } from 'vitest';
import type { Root as MdastRoot } from 'mdast';
import { MarkdownEngineService } from './markdown-engine.service';
import { MarkdownParserService } from './markdown-parser.service';
import { RemendService } from './remend.service';

describe('MarkdownEngineService', () => {
  it('does not reuse processor cache for different remark plugin functions', () => {
    const injector = Injector.create({
      providers: [MarkdownParserService, RemendService],
    });

    const service = runInInjectionContext(
      injector,
      () => new MarkdownEngineService()
    );

    const pluginA = () => (tree: MdastRoot) => {
      tree.children.push({
        type: 'paragraph',
        children: [{ type: 'text', value: 'PLUGIN_A' }],
      } as MdastRoot['children'][number]);
    };

    const pluginB = () => (tree: MdastRoot) => {
      tree.children.push({
        type: 'paragraph',
        children: [{ type: 'text', value: 'PLUGIN_B' }],
      } as MdastRoot['children'][number]);
    };

    const blocksA = service.renderBlocks('base', {
      mode: 'static',
      remarkPlugins: [pluginA],
      rehypePlugins: [],
    });

    const blocksB = service.renderBlocks('base', {
      mode: 'static',
      remarkPlugins: [pluginB],
      rehypePlugins: [],
    });

    const asText = (value: unknown): string => JSON.stringify(value);
    expect(asText(blocksA[0].root)).toContain('PLUGIN_A');
    expect(asText(blocksB[0].root)).toContain('PLUGIN_B');
    expect(asText(blocksB[0].root)).not.toContain('PLUGIN_A');
  });

  it('caps processor cache size at 100 entries', () => {
    const injector = Injector.create({
      providers: [MarkdownParserService, RemendService],
    });
    const service = runInInjectionContext(
      injector,
      () => new MarkdownEngineService()
    );

    const plugin = () => () => {};

    for (let i = 0; i < 150; i += 1) {
      service.renderBlocks(`# ${i}`, {
        mode: 'static',
        remarkPlugins: [[plugin, { i }]],
        rehypePlugins: [],
      });
    }

    const cacheSize = (service as any).processorCache.size;
    expect(cacheSize).toBeLessThanOrEqual(100);
  });
});
