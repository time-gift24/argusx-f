# Streamdown Angular 实现设计文档

**日期**: 2026-02-17
**目标**: 将 React 版本的 streamdown 流式 Markdown 库转换为 Angular 20+ 实现

## 1. 概述

本设计文档描述了如何在 Angular 项目中实现流式 Markdown 渲染库，参考 streamdown React 版本架构，并遵循 Angular 20+ 最佳实践（Signals、Standalone 组件、OnPush 变更检测）。

### 1.1 核心功能

- **基础 Markdown**: 标题、段落、列表、引用、链接、图片、粗体、斜体、代码、行内代码
- **GFM 扩展**: 表格、脚注、任务列表、删除线、URL 自动链接
- **代码块**: 语法高亮（Prism.js）、复制、下载
- **Mermaid**: 图表渲染（流程图、时序图等）
- **流式渲染**: 边接收边渲染，处理不完整 Markdown 语法

### 1.2 技术栈

- **解析引擎**: unified + remark-parse + remark-rehype
- **GFM 支持**: remark-gfm
- **HTML 清洗**: rehype-sanitize + rehype-harden
- **不完整语法补全**: remend
- **代码高亮**: Prism.js
- **图表渲染**: mermaid
- **分块解析**: marked Lexer

---

## 2. 架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    SdMarkdownComponent                  │
│  (主入口，接收 markdown 输入，管理流式状态)               │
└─────────────────────┬───────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
   ┌─────────────┐        ┌─────────────┐
   │ RemendService│        │ ParserService│
   │ (语法补全)   │        │ (分块处理)   │
   └──────┬──────┘        └──────┬──────┘
          │                      │
          └──────────┬───────────┘
                     ▼
          ┌─────────────────────┐
          │ MarkdownEngineService│
          │ (unified 管道)      │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │   RenderNode[]     │
          │ (AST 树)           │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │MarkdownNodeComponent│
          │ (递归渲染组件)      │
          └─────────────────────┘
```

### 2.2 模块划分

| 模块 | 职责 | 位置 |
|------|------|------|
| `SdMarkdownComponent` | 主入口，管理输入和状态 | `markdown.component.ts` |
| `MarkdownEngineService` | unified 管道执行，AST 转换 | `services/markdown-engine.service.ts` |
| `RemendService` | 包装 remend 库，补全不完整语法 | `services/remend.service.ts` |
| `MarkdownParserService` | 分块逻辑，流式模式专用 | `services/markdown-parser.service.ts` |
| `MarkdownNodeComponent` | 递归渲染 AST 节点 | `components/markdown-node.component.ts` |
| `CodeBlockComponent` | 代码块 + Prism 高亮 | `components/code-block.component.ts` |
| `MermaidComponent` | Mermaid 图表渲染 | `components/mermaid.component.ts` |
| `TableComponent` | 表格（含控件） | `components/table.component.ts` |

---

## 3. 核心实现

### 3.1 MarkdownEngineService

核心解析引擎，复用 unified 管道：

```typescript
@Injectable({ providedIn: 'root' })
export class MarkdownEngineService {
  private processorCache = new Map<string, Processor>();

  renderBlocks(markdown: string, options: RenderOptions): RenderBlock[] {
    // 1. 语法补全（流式模式）
    const processedMarkdown = options.mode === 'streaming'
      ? remend(markdown, options.remendOptions)
      : markdown;

    // 2. 分块处理
    const blocks = options.mode === 'streaming'
      ? parseMarkdownIntoBlocks(processedMarkdown)
      : [processedMarkdown];

    // 3. 解析每个块
    return blocks.map((block, index) => {
      const tree = this.parseToHast(block);
      return {
        id: String(index),
        raw: block,
        root: this.toRenderNode(tree),
      };
    });
  }

  private parseToHast(markdown: string): Root {
    const processor = this.getProcessor();
    return processor.runSync(processor.parse(markdown), markdown) as Root;
  }
}
```

### 3.2 管道配置

```typescript
const createProcessor = (options: NormalizedOptions) => {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)           // GFM 支持
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)           // 允许原始 HTML
    .use(rehypeSanitize, sanitizeSchema)
    .use(harden, hardenOptions);
};
```

### 3.3 MarkdownNodeComponent

递归组件渲染 AST：

```typescript
@Component({
  selector: 'sd-markdown-node',
  imports: [forwardRef(() => MarkdownNodeComponent)],
  template: `
    @switch (node().kind) {
      @case ('text') {
        {{ node().value }}
      }
      @case ('element') {
        @switch (tagName()) {
          @case ('h1') { <h1 ...> ... </h1> }
          @case ('code') { <sd-code-block ...> }
          @case ('pre') { <pre ...> ... </pre> }
          @default { <span> ... </span> }
        }
      }
    }
  `
})
export class MarkdownNodeComponent {
  readonly node = input.required<RenderNode>();
  // 递归渲染子节点
}
```

### 3.4 流式渲染状态管理

```typescript
@Component({...})
export class SdMarkdownComponent {
  readonly content = input<string>('');
  readonly mode = input<'streaming' | 'static'>('streaming');

  private engine = inject(MarkdownEngineService);

  // 计算属性：内容变化时重新渲染
  readonly blocks = computed(() =>
    this.engine.renderBlocks(this.content(), {
      mode: this.mode(),
      parseIncompleteMarkdown: this.mode() === 'streaming',
    })
  );
}
```

---

## 4. GFM 实现细节

### 4.1 表格

GFM 表格通过 remark-gfm 解析，生成 `<table>` 及相关元素。

**组件结构**：
```typescript
@Component({
  selector: 'sd-table',
  template: `
    <div class="my-4 flex flex-col space-y-2">
      @if (showControls) {
        <div class="flex justify-end gap-1">
          <sd-copy-button [content]="tableHtml()" />
          <sd-download-button [content]="tableHtml()" />
        </div>
      }
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border border-border">
          <ng-content />
        </table>
      </div>
    </div>
  `
})
export class TableComponent {
  showControls = input<boolean>(false);
}
```

### 4.2 脚注

脚注在流式渲染时需要特殊处理：过滤空脚注（脚注定义未到达时）。

```typescript
// 在 MarkdownNodeComponent 的 section 处理中
@case ('section') {
  @if (isFootnotesSection()) {
    <!-- 过滤空脚注 -->
    <section [class]="className()">
      @for (footnote of filteredFootnotes(); track footnote.id) {
        <sd-markdown-node [node]="footnote" />
      }
    </section>
  } @else {
    <section [class]="className()">
      <ng-content />
    </section>
  }
}
```

### 4.3 任务列表

remark-gfm 将任务列表转换为 `<input type="checkbox">`，无需特殊组件处理。

---

## 5. 代码块实现

### 5.1 架构

```
CodeBlockComponent
├── Header (语言标签 + 复制/下载按钮)
├── Body (Prism 高亮内容)
└── Skeleton (加载骨架)
```

### 5.2 Prism 集成

```typescript
@Component({
  selector: 'sd-code-block',
  template: `
    <sd-code-block-container>
      <sd-code-block-header [language]="language">
        <sd-copy-button [code]="code" />
      </sd-code-block-header>
      <pre class="sd-code-body"><code [innerHTML]="highlightedHtml()"></code></pre>
    </sd-code-block-container>
  `
})
export class CodeBlockComponent {
  code = input.required<string>();
  language = input<string>('');

  private prism = inject(PrismService);

  highlightedHtml = computed(() =>
    this.prism.highlight(this.code(), this.language())
  );
}
```

### 5.3 样式

使用 Tailwind 类 + Prism CSS 主题：

```css
/* 需要引入 prism 主题 */
/* @import 'prismjs/themes/prism-tomorrow.css'; */

.sd-code-body {
  @apply overflow-x-auto p-4 text-sm;
}

.sd-code-body code {
  @apply font-mono;
}
```

---

## 6. Mermaid 实现

### 6.1 组件结构

```typescript
@Component({
  selector: 'sd-mermaid',
  template: `
    @if (hasError() && !lastValidSvg()) {
      <!-- 错误状态 -->
      <div class="rounded-lg border border-red-200 bg-red-50 p-4">
        <p class="text-sm text-red-700">{{ error() }}</p>
        <details class="mt-2">
          <summary class="cursor-pointer text-xs text-red-600">Show Code</summary>
          <pre class="mt-2 overflow-x-auto bg-red-100 p-2 text-xs">{{ chart() }}</pre>
        </details>
      </div>
    } @else {
      <!-- 正常渲染 -->
      <div class="my-4">
        @if (showControls) {
          <div class="flex justify-end gap-2 mb-2">
            <sd-mermaid-download [chart]="chart()" />
            <sd-mermaid-fullscreen [chart]="chart()" />
          </div>
        }
        <div [innerHTML]="svgHtml()" class="mermaid-content"></div>
      </div>
    }
  `
})
export class MermaidComponent {
  chart = input.required<string>();
  showControls = input<boolean>(true);

  private mermaidService = inject(MermaidService);

  svgHtml = computedAsync(() => this.mermaidService.render(this.chart()));
  // 需要处理错误边界，保留上一次有效 SVG
}
```

### 6.2 错误处理策略

关键实现：Mermaid 渲染失败时保留上一次有效 SVG，避免内容闪烁。

```typescript
// 伪代码
const render = async () => {
  try {
    const { svg } = await mermaid.render(id, chart);
    lastValidSvg.set(svg);  // 先保存有效 SVG
    svgContent.set(svg);
  } catch (err) {
    // 错误时不做任何操作，保持显示 lastValidSvg
  }
};
```

---

## 7. 流式渲染实现

### 7.1 分块逻辑

使用 marked Lexer 进行分块：

```typescript
// parse-markdown-into-blocks.ts
export function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = Lexer.lex(markdown, { gfm: true });

  const blocks: string[] = [];
  // 特殊处理：HTML 块合并、脚注整体返回
  // ...（详见 streamdown parse-blocks.tsx）

  return blocks;
}
```

### 7.2 状态更新

```typescript
@Component({...})
export class SdMarkdownComponent {
  // 输入信号
  readonly content = input<string>('');

  // 派生状态：分块结果
  readonly blocks = computed(() => {
    const processed = remend(this.content(), this.remendOptions());
    return parseMarkdownIntoBlocks(processed);
  });

  // 渲染每一块
  readonly renderResults = computed(() =>
    this.blocks().map(block =>
      this.engine.renderBlock(block)
    )
  );
}
```

---

## 8. 样式方案

### 8.1 Tailwind 类复用

直接复用 React 版本的 Tailwind 类：

| 元素 | Tailwind 类 |
|------|------------|
| h1 | `mt-6 mb-2 font-semibold text-3xl` |
| h2 | `mt-6 mb-2 font-semibold text-2xl` |
| p | `whitespace-normal` |
| ul/ol | `list-inside list-disc/list-decimal [li_&]:pl-6` |
| blockquote | `my-4 border-l-4 border-muted-foreground/30 pl-4 italic` |
| table | `w-full border-collapse border border-border` |
| code (inline) | `rounded bg-muted px-1.5 py-0.5 font-mono text-sm` |

### 8.2 CSS 变量

通过 CSS 变量支持主题切换：

```css
:root {
  --sd-color-primary: var(--color-primary);
  --sd-color-muted: var(--color-muted);
  --sd-border-color: var(--color-border);
}
```

---

## 9. 依赖安装

```bash
# 核心依赖
npm install unified remark-parse remark-gfm remark-rehype rehype-sanitize rehype-harden rehype-raw
npm install html-url-attributes unist-util-visit

# 流式补全
npm install remend

# 代码高亮
npm install prismjs @types/prismjs

# 图表
npm install mermaid

# 分块
npm install marked
```

---

## 10. 使用示例

```typescript
@Component({
  selector: 'app-chat-message',
  imports: [SdMarkdownComponent],
  template: `
    <sd-markdown
      [content]="message()"
      mode="streaming"
      className="prose prose-sm max-w-none"
    />
  `
})
export class ChatMessageComponent {
  message = signal<string>('');

  // 模拟流式更新
  updateMessage(chunk: string) {
    this.message.update(current => current + chunk);
  }
}
```

---

## 11. 与 React 版本对比总结

| 方面 | React Streamdown | Angular 实现 |
|------|-----------------|--------------|
| AST → 组件 | `hast-util-to-jsx-runtime` | 递归组件 `MarkdownNodeComponent` |
| 状态管理 | `useState` + `useTransition` | Signals (`signal`/`computed`) |
| 组件渲染 | `memo()` | OnPush + 自定义比较 |
| 代码高亮 | Shiki (同步) | Prism.js |
| 主题 | 双主题 (light/dark) | CSS 变量 |
| 流式更新 | React state | Angular signals |

---

## 12. 待实现清单

1. [ ] 创建 `MarkdownEngineService` - 核心解析引擎
2. [ ] 创建 `RemendService` - 语法补全
3. [ ] 创建 `MarkdownParserService` - 分块处理
4. [ ] 创建 `MarkdownNodeComponent` - 递归渲染
5. [ ] 实现基础 Markdown 元素渲染
6. [ ] 实现 GFM 扩展（表格、脚注）
7. [ ] 创建 `CodeBlockComponent` - 代码块 + Prism
8. [ ] 创建 `MermaidComponent` - 图表渲染
9. [ ] 创建 `SdMarkdownComponent` - 主入口
10. [ ] 添加单元测试

---

## 13. 参考资料

- [streamdown 仓库](file:///Users/wanyaozhong/projects/streamdown)
- [remend 库](file:///Users/wanyaozhong/projects/streamdown/packages/remend)
- [streamdown-angular-headless](file:///Users/wanyaozhong/projects/streamdown/packages/streamdown-angular-headless)
