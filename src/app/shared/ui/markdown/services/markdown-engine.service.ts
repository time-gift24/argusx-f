import { Injectable } from '@angular/core';
import type { Nodes, Root, RootContent } from 'hast';
import type { Options as RemarkRehypeOptions } from 'remark-rehype';
import type { PluggableList } from 'unified';
import { unified } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { MarkdownParserService } from './markdown-parser.service';
import { RemendService } from './remend.service';
import type { RenderBlock, RenderNode, RenderRootNode, RenderOptions } from '../models/markdown.models';

const DEFAULT_REMARK_PLUGINS: PluggableList = [[remarkGfm, {}]];

const DEFAULT_REMARK_REHYPE_OPTIONS: Readonly<RemarkRehypeOptions> = {
  allowDangerousHtml: true,
};

interface NormalizedOptions {
  mode: 'streaming' | 'static';
  parseIncompleteMarkdown: boolean;
  remendOptions: RenderOptions['remendOptions'];
  remarkPlugins: PluggableList;
  rehypePlugins: PluggableList;
}

@Injectable({ providedIn: 'root' })
export class MarkdownEngineService {
  constructor(
    private parser: MarkdownParserService,
    private remend: RemendService
  ) {}

  renderBlocks(markdown: string, options: RenderOptions): RenderBlock[] {
    if (!markdown) return [];

    const normalized = this.normalizeOptions(options);

    // 1. 语法补全
    const processed = normalized.mode === 'streaming' && normalized.parseIncompleteMarkdown
      ? this.remend.complete(markdown, normalized.remendOptions)
      : markdown;

    // 2. 分块
    const rawBlocks = normalized.mode === 'streaming'
      ? this.parser.parseBlocks(processed)
      : [processed];

    const blocks = rawBlocks.filter(b => b.length > 0);
    if (blocks.length === 0) return [];

    // 3. 解析每个块
    const processor = this.getProcessor(normalized);

    return blocks.map((block, index) => {
      const tree = processor.runSync(processor.parse(block), block) as Nodes;
      return {
        id: String(index),
        raw: block,
        root: this.toRenderRoot(tree as Root),
      };
    });
  }

  private normalizeOptions(options: RenderOptions): NormalizedOptions {
    return {
      mode: options.mode ?? 'streaming',
      parseIncompleteMarkdown: options.parseIncompleteMarkdown !== false,
      remendOptions: options.remendOptions,
      remarkPlugins: options.remarkPlugins ?? DEFAULT_REMARK_PLUGINS,
      rehypePlugins: options.rehypePlugins ?? this.createDefaultRehypePlugins(),
    };
  }

  private createDefaultRehypePlugins(): PluggableList {
    // 简化版本 - 后续可以添加 rehypeSanitize 等
    return [];
  }

  private processorCache = new Map<string, unknown>();

  private getProcessor(options: NormalizedOptions) {
    const key = this.getCacheKey(options);
    if (this.processorCache.has(key)) {
      return this.processorCache.get(key) as ReturnType<typeof unified>;
    }

    const processor = unified()
      .use(remarkParse)
      .use(options.remarkPlugins)
      .use(remarkRehype, DEFAULT_REMARK_REHYPE_OPTIONS)
      .use(options.rehypePlugins);

    this.processorCache.set(key, processor);
    return processor as unknown as ReturnType<typeof unified>;
  }

  private getCacheKey(options: NormalizedOptions): string {
    return JSON.stringify(options);
  }

  private toRenderRoot(tree: Root): RenderRootNode {
    return {
      kind: 'root',
      children: tree.children.map(child => this.toRenderNode(child as RootContent)),
    };
  }

  private toRenderNode(node: RootContent): RenderNode {
    if (node.type === 'text') {
      return { kind: 'text', value: node.value };
    }
    if (node.type === 'element') {
      return {
        kind: 'element',
        tagName: node.tagName,
        properties: { ...node.properties },
        children: node.children.map(child => this.toRenderNode(child as RootContent)),
      };
    }
    return { kind: 'text', value: '' };
  }
}
