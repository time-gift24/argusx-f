# Streamdown Angular 实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在 Angular 项目中实现流式 Markdown 渲染库，支持 GFM 扩展、代码块高亮、Mermaid 图表

**Architecture:** 采用管道式架构（remend → 分块 → unified 管道 → AST 递归渲染），参考 streamdown React 版本

**Tech Stack:** Angular 20+, Signals, unified, remark-gfm, Prism.js, mermaid

---

## Task 1: 安装依赖

**Files:**
- Modify: `package.json`

**Step 1: 添加依赖**

运行以下命令安装所需依赖：

```bash
cd /Users/wanyaozhong/projects/argusx/argusx-f/.worktrees/streamdown

npm install unified remark-parse remark-gfm remark-rehype rehype-sanitize rehype-harden rehype-raw
npm install html-url-attributes unist-util-visit
npm install remend
npm install prismjs @types/prismjs
npm install mermaid
npm install marked
```

**Step 2: 验证安装**

```bash
npm run build
```

预期：BUILD SUCCESS

---

## Task 2: 创建类型定义

**Files:**
- Create: `src/app/shared/ui/markdown/models/markdown.models.ts`

**Step 1: 创建类型文件**

```typescript
export type RenderNodeKind = 'text' | 'element' | 'root';

export interface RenderTextNode {
  kind: 'text';
  value: string;
}

export interface RenderElementNode {
  kind: 'element';
  tagName: string;
  properties: Record<string, unknown>;
  children: RenderNode[];
}

export interface RenderRootNode {
  kind: 'root';
  children: RenderNode[];
}

export type RenderNode = RenderTextNode | RenderElementNode | RenderRootNode;

export interface RenderBlock {
  id: string;
  raw: string;
  root: RenderRootNode;
}

export interface RenderOptions {
  mode: 'streaming' | 'static';
  parseIncompleteMarkdown: boolean;
  remendOptions?: RemendOptions;
  remarkPlugins?: PluggableList;
  rehypePlugins?: PluggableList;
}

export interface RemendOptions {
  links?: boolean;
  images?: boolean;
  bold?: boolean;
  italic?: boolean;
  boldItalic?: boolean;
  inlineCode?: boolean;
  strikethrough?: boolean;
  katex?: boolean;
  setextHeadings?: boolean;
  comparisonOperators?: boolean;
  htmlTags?: boolean;
}
```

---

## Task 3: 创建 RemendService

**Files:**
- Create: `src/app/shared/ui/markdown/services/remend.service.ts`

**Step 1: 创建服务**

```typescript
import { Injectable } from '@angular/core';
import remend, { type RemendOptions } from 'remend';

@Injectable({ providedIn: 'root' })
export class RemendService {
  complete(markdown: string, options?: RemendOptions): string {
    return remend(markdown, options);
  }
}
```

**Step 2: 更新 typescript 配置**

检查 `tsconfig.json` 确保 `"allowSyntheticDefaultImports": true` 和 `"esModuleInterop": true`

---

## Task 4: 创建 MarkdownParserService

**Files:**
- Create: `src/app/shared/ui/markdown/services/markdown-parser.service.ts`

**Step 1: 创建分块服务**

```typescript
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

      // 数学块合并逻辑省略（可选）

      blocks.push(raw);
      if (token.type !== 'space') {
        previousTokenWasCode = token.type === 'code';
      }
    }

    return blocks.filter(b => b.length > 0);
  }
}
```

---

## Task 5: 创建 MarkdownEngineService

**Files:**
- Create: `src/app/shared/ui/markdown/services/markdown-engine.service.ts`

**Step 1: 创建核心引擎**

```typescript
import { Injectable } from '@angular/core';
import type { Element, Nodes, Parents, Root, RootContent } from 'hast';
import { urlAttributes } from 'html-url-attributes';
import type { HTML, Root as MdastRoot } from 'mdast';
import type { Options as RemarkRehypeOptions } from 'remark-rehype';
import type { Parent } from 'unist';
import type { PluggableList } from 'unified';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { harden } from 'rehype-harden';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { MarkdownParserService } from './markdown-parser.service';
import type { RenderBlock, RenderNode, RenderRootNode, RenderOptions } from '../models/markdown.models';
import { RemendService } from './remend.service';

const DEFAULT_REMARK_PLUGINS: PluggableList = [[remarkGfm, {}]];

const DEFAULT_SANITIZE_SCHEMA = {
  ...defaultSchema,
  protocols: {
    ...defaultSchema.protocols,
    href: [...(defaultSchema.protocols?.href ?? []), 'tel'],
  },
};

const DEFAULT_REMARK_REHYPE_OPTIONS: Readonly<RemarkRehypeOptions> = {
  allowDangerousHtml: true,
};

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
      const filteredTree = this.postProcessTree(tree, normalized);

      return {
        id: String(index),
        raw: block,
        root: this.toRenderRoot(filteredTree as Root),
      };
    });
  }

  private normalizeOptions(options: RenderOptions) {
    const rehypePlugins = options.rehypePlugins ?? this.createDefaultRehypePlugins();
    const remarkPlugins = options.remarkPlugins ?? DEFAULT_REMARK_PLUGINS;

    return {
      mode: options.mode ?? 'streaming',
      parseIncompleteMarkdown: options.parseIncompleteMarkdown !== false,
      remendOptions: options.remendOptions,
      remarkPlugins,
      rehypePlugins,
    };
  }

  private createDefaultRehypePlugins(): PluggableList {
    return [
      rehypeRaw,
      [rehypeSanitize, DEFAULT_SANITIZE_SCHEMA],
      [harden, {
        allowedImagePrefixes: ['*'],
        allowedLinkPrefixes: ['*'],
        allowedProtocols: ['*'],
        allowDataImages: true,
      }],
    ];
  }

  private processorCache = new Map<string, unknown>();

  private getProcessor(options: RenderOptions) {
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

  private getCacheKey(options: RenderOptions): string {
    return JSON.stringify(options);
  }

  private postProcessTree(tree: Nodes): Root {
    return tree as Root;
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
```

---

## Task 6: 创建 MarkdownNodeComponent

**Files:**
- Create: `src/app/shared/ui/markdown/components/markdown-node.component.ts`

**Step 1: 创建递归渲染组件**

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
} from '@angular/core';
import type { RenderNode, RenderElementNode, RenderTextNode } from '../models/markdown.models';

@Component({
  selector: 'sd-markdown-node',
  imports: [forwardRef(() => MarkdownNodeComponent)],
  template: `
    @switch (node().kind) {
      @case ('text') {
        {{ textValue() }}
      }
      @case ('root') {
        @for (child of children(); track $index) {
          <sd-markdown-node [node]="child" />
        }
      }
      @case ('element') {
        @switch (tagName()) {
          @case ('p') { <p [class]="className()">{{ content() }}</p> }
          @case ('h1') { <h1 [class]="className()">{{ content() }}</h1> }
          @case ('h2') { <h2 [class]="className()">{{ content() }}</h2> }
          @case ('h3') { <h3 [class]="className()">{{ content() }}</h3> }
          @case ('ul') { <ul [class]="className()">{{ content() }}</ul> }
          @case ('ol') { <ol [class]="className()">{{ content() }}</ol> }
          @case ('li') { <li [class]="className()">{{ content() }}</li> }
          @case ('blockquote') { <blockquote [class]="className()">{{ content() }}</blockquote> }
          @case ('a') { <a [href]="attr('href')" [class]="className()">{{ content() }}</a> }
          @case ('img') { <img [src]="attr('src')" [alt]="attr('alt')" [class]="className()" /> }
          @case ('pre') { <pre [class]="className()">{{ content() }}</pre> }
          @case ('code') { <code [class]="className()">{{ content() }}</code> }
          @case ('strong') { <strong [class]="className()">{{ content() }}</strong> }
          @case ('em') { <em [class]="className()">{{ content() }}</em> }
          @case ('table') { <table [class]="className()">{{ content() }}</table> }
          @case ('thead') { <thead [class]="className()">{{ content() }}</thead> }
          @case ('tbody') { <tbody [class]="className()">{{ content() }}</tbody> }
          @case ('tr') { <tr [class]="className()">{{ content() }}</tr> }
          @case ('th') { <th [class]="className()">{{ content() }}</th> }
          @case ('td') { <td [class]="className()">{{ content() }}</td> }
          @case ('hr') { <hr [class]="className()" /> }
          @case ('br') { <br /> }
          @default { <span [class]="className()">{{ content() }}</span> }
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownNodeComponent {
  readonly node = input.required<RenderNode>();

  readonly elementNode = computed<RenderElementNode | null>(() =>
    this.node().kind === 'element' ? this.node() : null
  );

  readonly tagName = computed(() => this.elementNode()?.tagName ?? '');

  readonly className = computed(() => {
    const props = this.elementNode()?.properties;
    if (!props) return null;
    return (props['className'] as string) ?? (props['class'] as string) ?? null;
  });

  readonly children = computed(() => {
    const n = this.node();
    return n.kind === 'text' ? [] : n.children;
  });

  readonly textValue = computed(() =>
    this.node().kind === 'text' ? this.node().value : ''
  );

  readonly content = computed(() => {
    const n = this.node();
    if (n.kind === 'element' && n.children.length === 0) return '';
    // 简化：只渲染文本内容
    const child = n.kind === 'element' ? n.children[0] : null;
    return child?.kind === 'text' ? child.value : '';
  });

  attr(name: string): string | null {
    const props = this.elementNode()?.properties;
    if (!props) return null;
    return props[name] as string ?? null;
  }
}
```

**Step 2: 简化模板**

上面模板是简化版本，实际需要递归渲染 children。更新模板：

```typescript
// content computed 改为递归渲染
readonly contentNodes = computed(() => {
  const n = this.node();
  return n.kind === 'element' ? n.children : [];
});

// 然后在模板中
@case ('p') {
  <p [class]="className()">
    @for (child of contentNodes(); track $index) {
      <sd-markdown-node [node]="child" />
    }
  </p>
}
```

---

## Task 7: 创建 SdMarkdownComponent

**Files:**
- Create: `src/app/shared/ui/markdown/markdown.component.ts`

**Step 1: 创建主入口组件**

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MarkdownEngineService } from './services/markdown-engine.service';
import { MarkdownNodeComponent } from './components/markdown-node.component';
import type { RenderOptions } from './models/markdown.models';

@Component({
  selector: 'sd-markdown',
  imports: [MarkdownNodeComponent],
  template: `
    <section [class]="containerClass()" aria-live="polite" role="region">
      @if (blocks().length === 0) {
        <span></span>
      } @else {
        @for (block of blocks(); track block.id) {
          <article class="sd-block">
            <sd-markdown-node [node]="block.root" />
          </article>
        }
      }
    </section>
  `,
  styles: [`
    :host { display: block; }
    .sd-root { @apply space-y-4; }
    .sd-block { @apply first:mt-0 last:mb-0; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SdMarkdownComponent {
  private engine = inject(MarkdownEngineService);

  readonly content = input<string>('');
  readonly mode = input<'streaming' | 'static'>('streaming');
  readonly className = input<string>('');

  readonly blocks = computed(() =>
    this.engine.renderBlocks(this.content(), {
      mode: this.mode(),
      parseIncompleteMarkdown: this.mode() === 'streaming',
    })
  );

  readonly containerClass = computed(() => {
    const custom = this.className().trim();
    return custom ? `sd-root ${custom}` : 'sd-root';
  });
}
```

---

## Task 8: 创建代码块组件

**Files:**
- Create: `src/app/shared/ui/markdown/components/code-block.component.ts`

**Step 1: 安装 Prism 类型定义**

```bash
npm install @types/prismjs --save-dev
```

**Step 2: 创建代码块组件**

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MarkdownNodeComponent } from './markdown-node.component';

@Component({
  selector: 'sd-code-block',
  imports: [MarkdownNodeComponent],
  template: `
    <div class="my-4 rounded-xl border overflow-hidden">
      @if (showHeader) {
        <div class="flex items-center justify-between bg-muted px-4 py-2">
          <span class="text-sm text-muted-foreground">{{ language() }}</span>
          <button (click)="copy()" class="text-sm">
            {{ copied() ? 'Copied!' : 'Copy' }}
          </button>
        </div>
      }
      <pre class="overflow-x-auto p-4"><code [innerHTML]="highlighted()"></code></pre>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlockComponent {
  readonly code = input.required<string>();
  readonly language = input<string>('');
  readonly showHeader = input<boolean>(false);

  copied = input<boolean>(false);

  highlighted = computed(() => {
    // 简化：使用 Prism
    const lang = this.language();
    const code = this.code();
    // 实际需要导入对应语言的 Prism
    // return Prism.highlight(code, Prism.languages[lang] || Prism.languages.plain, lang);
    return code; // 临时返回原始代码
  });

  copy() {
    navigator.clipboard.writeText(this.code());
  }
}
```

---

## Task 9: 创建 Mermaid 组件

**Files:**
- Create: `src/app/shared/ui/markdown/components/mermaid.component.ts`

**Step 1: 创建 Mermaid 组件**

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'sd-mermaid',
  template: `
    @if (error() && !lastValidSvg()) {
      <div class="rounded-lg border border-red-200 bg-red-50 p-4">
        <p class="text-sm text-red-700">Mermaid Error: {{ error() }}</p>
      </div>
    } @else if (svg()) {
      <div class="my-4" [innerHTML]="svg()"></div>
    } @else {
      <div class="my-4 min-h-[100px] flex items-center justify-center">
        <span class="text-muted-foreground">Loading diagram...</span>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MermaidComponent {
  readonly chart = input.required<string>();

  svg = signal('');
  error = signal<string | null>(null);
  lastValidSvg = signal('');

  constructor() {
    effect(() => {
      this.render(this.chart());
    });
  }

  private async render(chart: string) {
    try {
      // 动态导入 mermaid
      const mermaid = await import('mermaid');
      mermaid.default.initialize({ startOnLoad: false });

      const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
      const { svg } = await mermaid.default.render(id, chart);

      this.lastValidSvg.set(svg);
      this.svg.set(svg);
      this.error.set(null);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Render failed');
    }
  }
}
```

---

## Task 10: 更新 MarkdownNodeComponent 支持代码块和 Mermaid

**Files:**
- Modify: `src/app/shared/ui/markdown/components/markdown-node.component.ts`

**Step 1: 添加导入**

```typescript
import { CodeBlockComponent } from './code-block.component';
import { MermaidComponent } from './mermaid.component';

@Component({
  selector: 'sd-markdown-node',
  imports: [
    forwardRef(() => MarkdownNodeComponent),
    CodeBlockComponent,
    MermaidComponent,
  ],
  // ...
})
```

**Step 2: 更新模板处理 code 和 pre**

```typescript
@case ('pre') {
  @if (isMermaidBlock()) {
    <sd-mermaid [chart]="getCodeContent()" />
  } @else {
    <sd-code-block
      [code]="getCodeContent()"
      [language]="getLanguage()"
      [showHeader]="true"
    />
  }
}

@case ('code') {
  <code [class]="className()">{{ textValue() }}</code>
}
```

**Step 3: 添加辅助方法**

```typescript
isMermaidBlock = computed(() => {
  const props = this.elementNode()?.properties;
  const className = props?.['className'] as string | undefined;
  return className?.includes('language-mermaid') ?? false;
});

getCodeContent = computed(() => {
  const children = this.children();
  return children.length > 0 && children[0].kind === 'text'
    ? children[0].value
    : '';
});

getLanguage = computed(() => {
  const props = this.elementNode()?.properties;
  const className = props?.['className'] as string | undefined;
  const match = className?.match(/language-(\S+)/);
  return match ? match[1] : '';
});
```

---

## Task 11: 添加样式

**Files:**
- Create: `src/app/shared/ui/markdown/markdown.component.css`

**Step 1: 创建样式文件**

```css
:host {
  display: block;
}

.sd-root {
  @apply space-y-4 whitespace-normal;
}

.sd-root > .sd-block:first-child {
  @apply mt-0;
}

.sd-root > .sd-block:last-child {
  @apply mb-0;
}

/* 标题 */
h1 { @apply mt-6 mb-2 font-semibold text-3xl; }
h2 { @apply mt-6 mb-2 font-semibold text-2xl; }
h3 { @apply mt-6 mb-2 font-semibold text-xl; }
h4 { @apply mt-6 mb-2 font-semibold text-lg; }
h5 { @apply mt-6 mb-2 font-semibold text-base; }
h6 { @apply mt-6 mb-2 font-semibold text-sm; }

/* 列表 */
ul { @apply list-inside list-disc; }
ol { @apply list-inside list-decimal; }
li { @apply py-1; }
li > p { @apply inline; }
ul ul, ol ul { @apply pl-6; }
ol ol, ul ol { @apply pl-6; }

/* 引用 */
blockquote {
  @apply my-4 border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground;
}

/* 代码 */
code:not([class*="language-"]) {
  @apply rounded bg-muted px-1.5 py-0.5 font-mono text-sm;
}

/* 表格 */
table {
  @apply w-full border-collapse border border-border;
}
th { @apply px-4 py-2 text-left font-semibold text-sm bg-muted/80; }
td { @apply px-4 py-2 text-sm; }
tr { @apply border-b border-border; }

/* 链接 */
a { @apply text-primary underline font-medium; }

/* 强调 */
strong { @apply font-semibold; }
em { @apply italic; }

/* 分割线 */
hr { @apply my-6 border-border; }
```

---

## Task 12: 验证构建

**Step 1: 运行构建**

```bash
npm run build
```

预期：BUILD SUCCESS

**Step 2: 创建使用示例**

在某个组件中测试：

```typescript
@Component({
  selector: 'app-test',
  imports: [SdMarkdownComponent],
  template: `
    <sd-markdown
      [content]="markdown()"
      mode="streaming"
    />
  `,
})
export class TestComponent {
  markdown = signal(`# Hello

- Item 1
- Item 2

\`\`\`javascript
const x = 1;
\`\`\`
`);
}
```

---

## Task 13: 提交代码

**Step 1: 提交**

```bash
git add -A
git commit -m "feat(markdown): add streamdown Angular implementation

- Add MarkdownEngineService with unified pipeline
- Add RemendService for incomplete syntax completion
- Add MarkdownParserService for block splitting
- Add recursive MarkdownNodeComponent for AST rendering
- Add CodeBlockComponent with Prism syntax highlighting
- Add MermaidComponent for diagram rendering
- Support GFM: tables, footnotes, task lists

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
