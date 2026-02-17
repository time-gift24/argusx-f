import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'sd-code-block',
  template: `
    <div class="my-4 overflow-hidden rounded-xl border bg-card">
      @if (showHeader()) {
        <div class="flex items-center justify-between border-b bg-muted px-4 py-2">
          <span class="text-sm text-muted-foreground">{{ language() }}</span>
          <button
            type="button"
            (click)="copy()"
            class="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {{ copied() ? 'Copied!' : 'Copy' }}
          </button>
        </div>
      }
      <pre class="overflow-x-auto p-4"><code [class]="languageClass()">{{ code() }}</code></pre>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlockComponent {
  private readonly destroyRef = inject(DestroyRef);
  private resetTimer: ReturnType<typeof setTimeout> | null = null;

  readonly code = input.required<string>();
  readonly language = input<string>('');
  readonly showHeader = input<boolean>(true);

  readonly copied = signal(false);

  readonly languageClass = computed(() =>
    this.language() ? `language-${this.language()}` : null
  );

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.resetTimer !== null) {
        clearTimeout(this.resetTimer);
      }
    });
  }

  async copy(): Promise<void> {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);

      if (this.resetTimer !== null) {
        clearTimeout(this.resetTimer);
      }

      this.resetTimer = setTimeout(() => {
        this.copied.set(false);
      }, 2000);
    } catch {
      this.copied.set(false);
    }
  }
}
