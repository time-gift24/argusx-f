import { Injectable, inject } from '@angular/core';
import type { Element, Nodes, Parents, Root, RootContent } from 'hast';
import { urlAttributes } from 'html-url-attributes';
import type { HTML, Root as MdastRoot } from 'mdast';
import type { Options as RemarkRehypeOptions } from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import type { Parent } from 'unist';
import type { PluggableList, Processor } from 'unified';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import type {
  AllowElement,
  RenderBlock,
  RenderNode,
  RenderOptions,
  RenderRootNode,
  UrlTransform,
} from '../models/markdown.models';
import { MarkdownCapabilitiesResolverService } from './markdown-capabilities-resolver.service';
import { MarkdownParserService } from './markdown-parser.service';
import { ProcessorCache } from './processor-cache';
import { RemendService } from './remend.service';

const DEFAULT_REMARK_REHYPE_OPTIONS: Readonly<RemarkRehypeOptions> = {
  allowDangerousHtml: true,
};

const DEFAULT_URL_TRANSFORM: UrlTransform = (value) => value;
type CachedProcessor = Processor<any, any, any, any, any>;

const hasRehypeRaw = (plugins: PluggableList): boolean =>
  plugins.some((plugin) =>
    Array.isArray(plugin) ? plugin[0] === rehypeRaw : plugin === rehypeRaw
  );

const remarkEscapeHtml = () => (tree: MdastRoot) => {
  visit(tree, 'html', (node: HTML, index: number | null | undefined, parent?: Parent) => {
    if (!parent || typeof index !== 'number') {
      return;
    }

    parent.children[index] = {
      type: 'text',
      value: node.value,
    } as unknown as Parent['children'][number];
  });
};

interface NormalizedOptions {
  mode: 'streaming' | 'static';
  parseIncompleteMarkdown: boolean;
  remendOptions: RenderOptions['remendOptions'];
  remarkPlugins: PluggableList;
  rehypePlugins: PluggableList;
  remarkRehypeOptions: Readonly<RemarkRehypeOptions>;
  allowedElements: readonly string[] | undefined;
  disallowedElements: readonly string[] | undefined;
  allowElement: AllowElement | undefined;
  skipHtml: boolean;
  unwrapDisallowed: boolean;
  urlTransform: UrlTransform;
}

@Injectable({ providedIn: 'root' })
export class MarkdownEngineService {
  private readonly parser = inject(MarkdownParserService);
  private readonly remend = inject(RemendService);
  private readonly capabilitiesResolver =
    inject(MarkdownCapabilitiesResolverService, { optional: true }) ??
    new MarkdownCapabilitiesResolverService();
  private readonly processorCache = new ProcessorCache<CachedProcessor>();

  renderBlocks(markdown: string, options: RenderOptions = {}): RenderBlock[] {
    if (!markdown) {
      return [];
    }

    const normalized = this.normalizeOptions(options);
    const preprocessedMarkdown =
      normalized.mode === 'streaming' && normalized.parseIncompleteMarkdown
        ? this.remend.complete(markdown, normalized.remendOptions)
        : markdown;

    const rawBlocks =
      normalized.mode === 'streaming'
        ? this.parser.parseBlocks(preprocessedMarkdown)
        : [preprocessedMarkdown];

    const blocks = rawBlocks.filter((block) => block.trim().length > 0);
    if (blocks.length === 0) {
      return [];
    }

    const processor = this.getProcessor(normalized);

    return blocks.map((block, index) => {
      const tree = processor.runSync(processor.parse(block), block) as Nodes;
      const filteredTree = this.postProcessTree(tree, normalized);

      return {
        id: String(index),
        raw: block,
        root: this.toRenderRoot(filteredTree),
      };
    });
  }

  private normalizeOptions(options: RenderOptions): NormalizedOptions {
    const capabilities = options.capabilities ?? {
      pipeline: {
        remarkPlugins: options.remarkPlugins,
        rehypePlugins: options.rehypePlugins,
        allowedTags: options.allowedTags,
      },
    };

    const resolvedCapabilities = this.capabilitiesResolver.resolve(capabilities);
    const hasExplicitRemarkPlugins =
      capabilities.pipeline?.remarkPlugins !== undefined;
    const remarkPlugins =
      !hasExplicitRemarkPlugins && !hasRehypeRaw(resolvedCapabilities.rehypePlugins)
        ? [...resolvedCapabilities.remarkPlugins, remarkEscapeHtml]
        : resolvedCapabilities.remarkPlugins;
    const rehypePlugins = resolvedCapabilities.rehypePlugins;

    return {
      mode: options.mode ?? 'streaming',
      parseIncompleteMarkdown: options.parseIncompleteMarkdown !== false,
      remendOptions: options.remendOptions,
      remarkPlugins,
      rehypePlugins,
      remarkRehypeOptions: options.remarkRehypeOptions
        ? { ...DEFAULT_REMARK_REHYPE_OPTIONS, ...options.remarkRehypeOptions }
        : DEFAULT_REMARK_REHYPE_OPTIONS,
      allowedElements: options.allowedElements,
      disallowedElements: options.disallowedElements,
      allowElement: options.allowElement,
      skipHtml: options.skipHtml === true,
      unwrapDisallowed: options.unwrapDisallowed === true,
      urlTransform: options.urlTransform ?? DEFAULT_URL_TRANSFORM,
    };
  }

  private getProcessor(options: NormalizedOptions): CachedProcessor {
    const cacheKey = this.processorCache.makeKey({
      remarkPlugins: options.remarkPlugins,
      rehypePlugins: options.rehypePlugins,
      remarkRehypeOptions: options.remarkRehypeOptions,
    });
    const cached = this.processorCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const processor = unified()
      .use(remarkParse)
      .use(options.remarkPlugins)
      .use(remarkRehype, options.remarkRehypeOptions)
      .use(options.rehypePlugins);

    this.processorCache.set(cacheKey, processor as CachedProcessor);
    return processor as CachedProcessor;
  }

  private postProcessTree(tree: Nodes, options: NormalizedOptions): Root {
    const hasFiltering =
      options.allowElement !== undefined ||
      options.allowedElements !== undefined ||
      options.disallowedElements !== undefined ||
      options.skipHtml ||
      options.urlTransform !== DEFAULT_URL_TRANSFORM;

    if (!hasFiltering) {
      return tree as Root;
    }

    visit(tree as Root, (node, index, parent) => {
      if (node.type === 'raw' && parent && typeof index === 'number') {
        this.handleRawNode(parent, index, options.skipHtml, node.value);
        return index;
      }

      if (node.type !== 'element') {
        return;
      }

      this.transformUrls(node, options.urlTransform);

      const shouldRemove = this.shouldRemoveElement(
        node,
        index,
        parent,
        options.allowedElements,
        options.disallowedElements,
        options.allowElement
      );

      if (!shouldRemove || !parent || typeof index !== 'number') {
        return;
      }

      if (options.unwrapDisallowed && node.children.length > 0) {
        parent.children.splice(index, 1, ...node.children);
      } else {
        parent.children.splice(index, 1);
      }

      return index;
    });

    return tree as Root;
  }

  private handleRawNode(
    parent: Parents,
    index: number,
    skipHtml: boolean,
    value: string
  ): void {
    if (skipHtml) {
      parent.children.splice(index, 1);
      return;
    }

    parent.children[index] = {
      type: 'text',
      value,
    };
  }

  private transformUrls(node: Element, transform: UrlTransform): void {
    for (const key in urlAttributes) {
      if (!Object.hasOwn(urlAttributes, key) || !Object.hasOwn(node.properties, key)) {
        continue;
      }

      const test = urlAttributes[key as keyof typeof urlAttributes];
      if (test !== null && !test.includes(node.tagName)) {
        continue;
      }

      const value = node.properties[key];
      node.properties[key] = transform(String(value ?? ''), key, node) ?? undefined;
    }
  }

  private shouldRemoveElement(
    node: Readonly<Element>,
    index: number | undefined,
    parent: Readonly<Parents> | undefined,
    allowedElements: readonly string[] | undefined,
    disallowedElements: readonly string[] | undefined,
    allowElement: AllowElement | undefined
  ): boolean {
    let remove = false;

    if (allowedElements) {
      remove = !allowedElements.includes(node.tagName);
    } else if (disallowedElements) {
      remove = disallowedElements.includes(node.tagName);
    }

    if (!remove && allowElement && typeof index === 'number') {
      remove = !allowElement(node, index, parent);
    }

    return remove;
  }

  private toRenderRoot(tree: Root): RenderRootNode {
    return {
      kind: 'root',
      children: tree.children.map((child) => this.toRenderNode(child as RootContent)),
    };
  }

  private toRenderNode(node: RootContent): RenderNode {
    if (node.type === 'text') {
      return {
        kind: 'text',
        value: node.value,
      };
    }

    if (node.type === 'element') {
      return {
        kind: 'element',
        tagName: node.tagName,
        properties: { ...node.properties },
        children: node.children.map((child) => this.toRenderNode(child as RootContent)),
      };
    }

    if ('value' in node && typeof node.value === 'string') {
      return {
        kind: 'text',
        value: node.value,
      };
    }

    return {
      kind: 'text',
      value: '',
    };
  }
}
