import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import { SdMarkdownComponent } from '../shared/ui/markdown/markdown.component';

@Component({
  selector: 'app-markdown-preview',
  imports: [SdMarkdownComponent],
  template: `
    <div class="mx-auto max-w-6xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Markdown</h1>
      <p class="mb-8 text-muted-foreground">
        Renders markdown content with support for streaming and static modes.
      </p>

      <!-- Mode Toggle -->
      <div class="mb-6">
        <h2 class="mb-3 text-sm font-medium text-muted-foreground">Mode</h2>
        <div class="flex gap-4">
          <label class="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              [checked]="mode() === 'streaming'"
              (change)="mode.set('streaming')" />
            Streaming
          </label>
          <label class="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              [checked]="mode() === 'static'"
              (change)="mode.set('static')" />
            Static
          </label>
        </div>
      </div>

      <!-- Demo Content Selector -->
      <div class="mb-6">
        <h2 class="mb-3 text-sm font-medium text-muted-foreground">Demo Content</h2>
        <div class="flex flex-wrap gap-2">
          <button argus-button variant="outline" (click)="loadDemo('basic')">
            Basic
          </button>
          <button argus-button variant="outline" (click)="loadDemo('gfm')">
            GFM
          </button>
          <button argus-button variant="outline" (click)="loadDemo('code')">
            Code
          </button>
          <button argus-button variant="outline" (click)="loadDemo('mermaid')">
            Mermaid
          </button>
          <button argus-button variant="outline" (click)="loadDemo('streaming')">
            Streaming
          </button>
        </div>
      </div>

      <!-- Markdown Input -->
      <div class="mb-6">
        <h2 class="mb-3 text-sm font-medium text-muted-foreground">Input</h2>
        <textarea
          [value]="content()"
          (input)="content.set($any($event.target).value)"
          class="w-full h-48 p-4 border rounded-lg font-mono text-sm bg-background"
          placeholder="Enter markdown..."></textarea>
      </div>

      <!-- Rendered Output -->
      <div>
        <h2 class="mb-3 text-sm font-medium text-muted-foreground">Output</h2>
        <div class="border rounded-lg p-6 min-h-[200px] bg-background">
          <sd-markdown [content]="content()" [mode]="mode()" />
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownPreviewComponent {
  mode = signal<'streaming' | 'static'>('streaming');
  content = signal<string>(DEMOS.basic);

  loadDemo(name: string) {
    const demo = DEMOS[name as keyof typeof DEMOS];
    if (demo) {
      this.content.set(demo);
    }
  }
}

const DEMOS = {
  basic: `# Hello World

This is a paragraph with **bold** and *italic* text.

## Lists

- Item 1
- Item 2
- Item 3

> A blockquote

\`\`\`javascript
const hello = "world";
console.log(hello);
\`\`\`
`,
  gfm: `# GFM Features

## Table

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

## Task List

- [x] Completed task
- [ ] Pending task

## Strikethrough

~~This text is crossed out~~
`,
  code: `# Code Blocks

## JavaScript

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
\`\`\`

## Python

\`\`\`python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
\`\`\`

Inline \`code\` works too.
`,
  mermaid: `# Mermaid Diagrams

\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Do Something]
    B -->|No| D[Do Other]
    C --> E[End]
    D --> E
\`\`\`

## Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>Bob: Hello Bob!
    Bob-->>Alice: Hi Alice!
\`\`\`
`,
  streaming: `# Streaming Demo

This simulates streaming content as it arrives from an AI response.

Hello! I'm generating res`,
};
