import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sd-code-block',
  imports: [CommonModule],
  template: `
    <div class="my-4 rounded-xl border overflow-hidden bg-card">
      @if (showHeader()) {
        <div class="flex items-center justify-between bg-muted px-4 py-2 border-b">
          <span class="text-sm text-muted-foreground">{{ language() }}</span>
          <button
            type="button"
            (click)="copy()"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
  readonly code = input.required<string>();
  readonly language = input<string>('');
  readonly showHeader = input<boolean>(true);

  copied = signal(false);

  languageClass = computed(() => `language-${this.language()}`);

  copy() {
    navigator.clipboard.writeText(this.code());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
