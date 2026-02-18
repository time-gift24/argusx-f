import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ButtonComponent } from '@app/shared/ui/button';
import { SdMarkdownComponent } from '../shared/ui/markdown/markdown.component';

@Component({
  selector: 'app-markdown-preview',
  imports: [ButtonComponent, SdMarkdownComponent],
  template: `
    <div class="mx-auto max-w-6xl p-8">
      <h1 class="mb-2 text-2xl font-semibold">Markdown</h1>
      <p class="mb-8 text-muted-foreground">
        Renders markdown content with support for streaming and static modes.
      </p>

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
        </div>
      </div>

      <div class="mb-6">
        <h2 class="mb-3 text-sm font-medium text-muted-foreground">Capabilities</h2>
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            [checked]="capabilityTableControls()"
            (change)="capabilityTableControls.set($any($event.target).checked)" />
          Enable table controls
        </label>
      </div>

      <div class="mb-6 rounded-lg border p-4">
        <h2 class="mb-2 text-sm font-medium text-muted-foreground">Real Streaming</h2>
        <p class="mb-4 text-sm text-muted-foreground">
          Simulate token-by-token updates to preview the real streaming rendering process.
        </p>

        <div class="flex flex-wrap gap-2">
          <button argus-button (click)="startLiveStreaming()">
            Start Streaming
          </button>

          @if (isStreaming()) {
            <button argus-button variant="outline" (click)="pauseStreaming()">
              Pause
            </button>
          } @else if (hasPendingChunks()) {
            <button argus-button variant="outline" (click)="resumeStreaming()">
              Resume
            </button>
          }

          <button
            argus-button
            variant="outline"
            [disabled]="!isStreaming() && !hasPendingChunks()"
            (click)="stopStreaming()">
            Stop
          </button>

          <button argus-button variant="ghost" (click)="showFullStreamingResult()">
            Show Full Result
          </button>
        </div>

        <p class="mt-3 text-xs text-muted-foreground">
          Status: {{ streamingStatus() }} · {{ streamProgress() }}%
        </p>

        <div class="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              [checked]="autoScroll()"
              (change)="autoScroll.set($any($event.target).checked)" />
            Auto scroll to bottom
          </label>

          <label class="flex items-center gap-2">
            Behavior
            <select
              class="rounded border bg-background px-2 py-1 text-xs"
              [value]="autoScrollBehavior()"
              (change)="autoScrollBehavior.set($any($event.target).value)">
              <option value="auto">Instant</option>
              <option value="smooth">Smooth</option>
            </select>
          </label>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 class="mb-3 text-sm font-medium text-muted-foreground">Input</h2>
          <textarea
            [value]="content()"
            (input)="onContentInput($any($event.target).value)"
            class="h-[480px] w-full rounded-lg border bg-background p-4 font-mono text-sm"
            placeholder="Enter markdown..."></textarea>
        </div>

        <div>
          <h2 class="mb-3 text-sm font-medium text-muted-foreground">Output</h2>
          <div class="h-[480px] overflow-auto rounded-lg border bg-background p-6">
            <sd-markdown
              [content]="content()"
              [mode]="mode()"
              [capabilities]="markdownCapabilities()"
              [autoScroll]="autoScroll()"
              [autoScrollBehavior]="autoScrollBehavior()" />
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownPreviewComponent {
  private readonly destroyRef = inject(DestroyRef);
  private streamTimer: ReturnType<typeof setTimeout> | null = null;
  private streamSource = STREAMING_RESPONSE;

  readonly mode = signal<'streaming' | 'static'>('streaming');
  readonly content = signal<string>(DEMOS.basic);
  readonly autoScroll = signal(true);
  readonly autoScrollBehavior = signal<ScrollBehavior>('auto');
  readonly capabilityTableControls = signal(true);
  readonly markdownCapabilities = computed(() => ({
    controls: { table: this.capabilityTableControls() },
    image: { download: true },
    linkSafety: {
      enabled: true,
      trustedPrefixes: ['https://argusx.ai'],
    },
  }));

  readonly isStreaming = signal(false);
  readonly streamFinished = signal(false);
  readonly streamCursor = signal(0);
  readonly streamTotal = signal(0);

  readonly hasPendingChunks = computed(
    () => this.streamCursor() > 0 && this.streamCursor() < this.streamTotal()
  );

  readonly streamProgress = computed(() => {
    if (this.streamTotal() === 0) {
      return 0;
    }

    return Math.floor((this.streamCursor() / this.streamTotal()) * 100);
  });

  readonly streamingStatus = computed(() => {
    if (this.isStreaming()) {
      return 'Streaming';
    }

    if (this.streamFinished()) {
      return 'Completed';
    }

    if (this.hasPendingChunks()) {
      return 'Paused';
    }

    return 'Idle';
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.clearStreamTimer();
    });
  }

  loadDemo(name: keyof typeof DEMOS) {
    const demo = DEMOS[name];
    if (!demo) {
      return;
    }

    this.clearStreamTimer();
    this.isStreaming.set(false);
    this.streamFinished.set(false);
    this.streamCursor.set(0);
    this.streamTotal.set(0);
    this.content.set(demo);
  }

  startLiveStreaming() {
    this.clearStreamTimer();

    this.streamSource = STREAMING_RESPONSE;
    this.mode.set('streaming');
    this.content.set('');
    this.streamCursor.set(0);
    this.streamTotal.set(this.streamSource.length);
    this.streamFinished.set(false);
    this.isStreaming.set(true);

    this.pushNextChunk();
  }

  pauseStreaming() {
    if (!this.isStreaming()) {
      return;
    }

    this.clearStreamTimer();
    this.isStreaming.set(false);
  }

  resumeStreaming() {
    if (this.isStreaming() || !this.hasPendingChunks()) {
      return;
    }

    this.mode.set('streaming');
    this.isStreaming.set(true);
    this.pushNextChunk();
  }

  stopStreaming() {
    this.clearStreamTimer();
    this.isStreaming.set(false);
  }

  showFullStreamingResult() {
    this.clearStreamTimer();

    this.mode.set('streaming');
    this.content.set(STREAMING_RESPONSE);
    this.streamCursor.set(STREAMING_RESPONSE.length);
    this.streamTotal.set(STREAMING_RESPONSE.length);
    this.streamFinished.set(true);
    this.isStreaming.set(false);
  }

  onContentInput(nextValue: string) {
    this.stopStreaming();
    this.streamFinished.set(false);
    this.streamCursor.set(0);
    this.streamTotal.set(0);
    this.content.set(nextValue);
  }

  private pushNextChunk() {
    if (!this.isStreaming()) {
      return;
    }

    const cursor = this.streamCursor();
    const total = this.streamTotal();
    if (cursor >= total) {
      this.finishStreaming();
      return;
    }

    const chunkSize = Math.min(total - cursor, this.nextChunkSize());
    const nextCursor = cursor + chunkSize;
    const chunk = this.streamSource.slice(cursor, nextCursor);

    this.content.update((current) => current + chunk);
    this.streamCursor.set(nextCursor);

    if (nextCursor >= total) {
      this.finishStreaming();
      return;
    }

    this.streamTimer = setTimeout(() => {
      this.pushNextChunk();
    }, this.nextDelayMs());
  }

  private finishStreaming() {
    this.clearStreamTimer();
    this.isStreaming.set(false);
    this.streamFinished.set(true);
    this.streamCursor.set(this.streamTotal());
  }

  private clearStreamTimer() {
    if (this.streamTimer !== null) {
      clearTimeout(this.streamTimer);
      this.streamTimer = null;
    }
  }

  private nextChunkSize(): number {
    return 2 + Math.floor(Math.random() * 10);
  }

  private nextDelayMs(): number {
    return 35 + Math.floor(Math.random() * 90);
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
};

const STREAMING_RESPONSE = `# Streaming Demo (Live)

This section is produced chunk by chunk, just like an actual LLM streaming response.

## Partial Plan

1. Read the request and identify constraints.
2. Propose a practical implementation path.
3. Execute incrementally and verify each step.

## Example Output

\`\`\`ts
export async function streamAnswer(push: (chunk: string) => void) {
  for (const chunk of ['hello', ' ', 'streaming', '!']) {
    push(chunk);
    await new Promise((resolve) => setTimeout(resolve, 80));
  }
}
\`\`\`

The final sentence arrives at the end, confirming the response is complete.`;
