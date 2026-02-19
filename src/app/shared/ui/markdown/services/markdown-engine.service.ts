import { Injectable, inject } from '@angular/core';
import type {
  Element,
  ElementContent,
  Nodes,
  Parents,
  Root,
  RootContent,
} from 'hast';
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
import type { MarkdownCapabilities } from '../models/markdown-capabilities.models';
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

interface StreamingRenderCache {
  optionsKey: string;
  rawBlocks: string[];
  renderedBlocks: RenderBlock[];
}

@Injectable({ providedIn: 'root' })
export class MarkdownEngineService {
  private readonly parser = inject(MarkdownParserService);
  private readonly remend = inject(RemendService);
  private readonly capabilitiesResolver =
    inject(MarkdownCapabilitiesResolverService, { optional: true }) ??
    new MarkdownCapabilitiesResolverService();
  private readonly processorCache = new ProcessorCache<CachedProcessor>();
  private streamingRenderCache: StreamingRenderCache | null = null;

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
      this.streamingRenderCache = null;
      return [];
    }

    const processor = this.getProcessor(normalized);
    if (normalized.mode !== 'streaming' || !this.canReuseStreamingBlocks(normalized)) {
      this.streamingRenderCache = null;
      return this.renderAllBlocks(blocks, normalized, processor);
    }

    return this.renderStreamingBlocksWithReuse(blocks, normalized, processor);
  }

  private normalizeOptions(options: RenderOptions): NormalizedOptions {
    const baseCapabilities = options.capabilities ?? {
      pipeline: {
        remarkPlugins: options.remarkPlugins,
        rehypePlugins: options.rehypePlugins,
        allowedTags: options.allowedTags,
      },
    };
    const capabilities: MarkdownCapabilities = {
      ...baseCapabilities,
      plugins: {
        ...(options.plugins ?? {}),
        ...(baseCapabilities.plugins ?? {}),
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

  private renderStreamingBlocksWithReuse(
    blocks: string[],
    options: NormalizedOptions,
    processor: CachedProcessor
  ): RenderBlock[] {
    const optionsKey = this.makeStreamingCacheKey(options);
    const previous = this.streamingRenderCache;
    const renderedBlocks = new Array<RenderBlock>(blocks.length);
    let startIndex = 0;

    if (previous && previous.optionsKey === optionsKey) {
      const maxPrefix = Math.min(previous.rawBlocks.length, blocks.length);
      while (
        startIndex < maxPrefix &&
        previous.rawBlocks[startIndex] === blocks[startIndex]
      ) {
        renderedBlocks[startIndex] = previous.renderedBlocks[startIndex];
        startIndex += 1;
      }
    }

    for (let index = startIndex; index < blocks.length; index += 1) {
      renderedBlocks[index] = this.renderBlock(blocks[index], index, options, processor);
    }

    this.streamingRenderCache = {
      optionsKey,
      rawBlocks: [...blocks],
      renderedBlocks,
    };

    return renderedBlocks;
  }

  private renderAllBlocks(
    blocks: string[],
    options: NormalizedOptions,
    processor: CachedProcessor
  ): RenderBlock[] {
    return blocks.map((block, index) =>
      this.renderBlock(block, index, options, processor)
    );
  }

  private renderBlock(
    block: string,
    index: number,
    options: NormalizedOptions,
    processor: CachedProcessor
  ): RenderBlock {
    const tree = processor.runSync(processor.parse(block), block) as Nodes;
    const filteredTree = this.postProcessTree(tree, options);

    return {
      id: String(index),
      raw: block,
      root: this.toRenderRoot(filteredTree),
    };
  }

  private canReuseStreamingBlocks(options: NormalizedOptions): boolean {
    return (
      options.allowElement === undefined &&
      options.allowedElements === undefined &&
      options.disallowedElements === undefined &&
      options.skipHtml === false &&
      options.unwrapDisallowed === false &&
      options.urlTransform === DEFAULT_URL_TRANSFORM
    );
  }

  private makeStreamingCacheKey(options: NormalizedOptions): string {
    return this.processorCache.makeKey({
      remarkPlugins: options.remarkPlugins,
      rehypePlugins: options.rehypePlugins,
      remarkRehypeOptions: options.remarkRehypeOptions,
    });
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
      this.normalizeTableRows(tree as Root);
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

    this.normalizeTableRows(tree as Root);
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

  private normalizeTableRows(tree: Root): void {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'table') {
        return;
      }

      const columnCount = this.resolveTableColumnCount(node);
      if (columnCount <= 1) {
        return;
      }

      const tbody = node.children.find((child): child is Element =>
        this.isElementTag(child, 'tbody')
      );
      if (!tbody || tbody.children.length === 0) {
        return;
      }

      const normalizedRows: ElementContent[] = [];
      let hasChanges = false;
      let pendingCells: ElementContent[] = [];

      const flushPendingCells = (): void => {
        if (pendingCells.length === 0) {
          return;
        }

        hasChanges = true;
        if (pendingCells.length % columnCount === 0) {
          for (let index = 0; index < pendingCells.length; index += columnCount) {
            normalizedRows.push(
              this.createTableRow(
                pendingCells.slice(index, index + columnCount)
              )
            );
          }
        } else {
          normalizedRows.push(this.createTableRow([...pendingCells]));
        }

        pendingCells = [];
      };

      for (const row of tbody.children) {
        if (this.isWhitespaceTextNode(row)) {
          continue;
        }

        if (this.isTableCell(row)) {
          pendingCells.push(row);
          continue;
        }

        flushPendingCells();

        if (!this.isElementTag(row, 'tr')) {
          normalizedRows.push(row);
          continue;
        }

        const rowElement = row as Element;
        const rowCells = rowElement.children.filter((cell: ElementContent) =>
          this.isTableCell(cell)
        );
        const cellCount = rowCells.length;
        const hasNonCellContent = rowElement.children.some(
          (cell: ElementContent) =>
            !this.isWhitespaceTextNode(cell) && !this.isTableCell(cell)
        );
        const shouldSplit =
          !hasNonCellContent &&
          cellCount > columnCount &&
          cellCount % columnCount === 0;

        if (!shouldSplit) {
          normalizedRows.push(rowElement);
          continue;
        }

        hasChanges = true;
        for (let index = 0; index < cellCount; index += columnCount) {
          normalizedRows.push({
            type: 'element',
            tagName: 'tr',
            properties: { ...rowElement.properties },
            children: rowCells.slice(index, index + columnCount),
          });
        }
      }

      flushPendingCells();

      if (hasChanges) {
        tbody.children = normalizedRows;
      }
    });
  }

  private resolveTableColumnCount(table: Element): number {
    const thead = table.children.find((child): child is Element =>
      this.isElementTag(child, 'thead')
    );
    if (!thead) {
      return 0;
    }

    const headerRow = thead.children.find((child): child is Element =>
      this.isElementTag(child, 'tr')
    );
    if (!headerRow) {
      return 0;
    }

    return headerRow.children.filter(
      (cell) => this.isTableCell(cell)
    ).length;
  }

  private isTableCell(node: RootContent | ElementContent): node is Element {
    return this.isElementTag(node, 'td') || this.isElementTag(node, 'th');
  }

  private isWhitespaceTextNode(node: RootContent | ElementContent): boolean {
    return node.type === 'text' && node.value.trim().length === 0;
  }

  private isElementTag(
    node: RootContent | ElementContent,
    tagName: string
  ): node is Element {
    return node.type === 'element' && node.tagName === tagName;
  }

  private createTableRow(cells: ElementContent[]): Element {
    return {
      type: 'element',
      tagName: 'tr',
      properties: {},
      children: cells,
    };
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
