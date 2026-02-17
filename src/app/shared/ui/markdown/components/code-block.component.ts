import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

type LanguageLoader = () => Promise<unknown>;

const LANGUAGE_ALIASES: Record<string, string> = {
  cjs: 'javascript',
  cpp: 'c',
  csharp: 'csharp',
  cs: 'csharp',
  html: 'markup',
  js: 'javascript',
  json5: 'json',
  md: 'markdown',
  sh: 'bash',
  shell: 'bash',
  svg: 'markup',
  ts: 'typescript',
  yml: 'yaml',
};

const LANGUAGE_LOADERS: Record<string, LanguageLoader> = {
  bash: () => import('prismjs/components/prism-bash'),
  c: () => import('prismjs/components/prism-c'),
  csharp: () => import('prismjs/components/prism-csharp'),
  go: () => import('prismjs/components/prism-go'),
  java: () => import('prismjs/components/prism-java'),
  json: () => import('prismjs/components/prism-json'),
  jsx: () => import('prismjs/components/prism-jsx'),
  markdown: () => import('prismjs/components/prism-markdown'),
  python: () => import('prismjs/components/prism-python'),
  rust: () => import('prismjs/components/prism-rust'),
  sql: () => import('prismjs/components/prism-sql'),
  tsx: () => import('prismjs/components/prism-tsx'),
  typescript: () => import('prismjs/components/prism-typescript'),
  yaml: () => import('prismjs/components/prism-yaml'),
};

const loadedLanguages = new Set<string>();
const loadingLanguages = new Map<string, Promise<void>>();

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
      <pre class="overflow-x-auto p-4">
        <code #codeElement [class]="languageClass()">{{ code() }}</code>
      </pre>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlockComponent {
  private readonly destroyRef = inject(DestroyRef);
  private resetTimer: ReturnType<typeof setTimeout> | null = null;
  private highlightToken = 0;

  readonly code = input.required<string>();
  readonly language = input<string>('');
  readonly showHeader = input<boolean>(true);
  readonly codeElement = viewChild<ElementRef<HTMLElement>>('codeElement');

  readonly copied = signal(false);

  readonly normalizedLanguage = computed(() =>
    this.normalizeLanguage(this.language())
  );

  readonly languageClass = computed(() =>
    this.normalizedLanguage() ? `language-${this.normalizedLanguage()}` : null
  );

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.resetTimer !== null) {
        clearTimeout(this.resetTimer);
      }
    });

    effect(() => {
      const codeValue = this.code();
      const languageValue = this.normalizedLanguage();
      const codeNode = this.codeElement()?.nativeElement;
      if (!codeNode) {
        return;
      }

      const currentToken = ++this.highlightToken;
      queueMicrotask(() => {
        void this.highlightCode(codeNode, codeValue, languageValue, currentToken);
      });
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

  private normalizeLanguage(rawLanguage: string): string {
    const normalized = rawLanguage.trim().toLowerCase();
    if (!normalized) {
      return '';
    }

    return LANGUAGE_ALIASES[normalized] ?? normalized;
  }

  private async highlightCode(
    codeNode: HTMLElement,
    codeValue: string,
    languageValue: string,
    token: number
  ): Promise<void> {
    await this.ensureLanguageLoaded(languageValue);
    if (token !== this.highlightToken) {
      return;
    }

    const grammar = languageValue ? Prism.languages[languageValue] : undefined;
    if (!grammar) {
      codeNode.textContent = codeValue;
      return;
    }

    codeNode.innerHTML = Prism.highlight(codeValue, grammar, languageValue);
  }

  private async ensureLanguageLoaded(languageValue: string): Promise<void> {
    if (!languageValue || Prism.languages[languageValue] || loadedLanguages.has(languageValue)) {
      return;
    }

    const existingLoad = loadingLanguages.get(languageValue);
    if (existingLoad) {
      await existingLoad;
      return;
    }

    const loader = LANGUAGE_LOADERS[languageValue];
    if (!loader) {
      return;
    }

    const loadPromise = loader()
      .then(() => {
        loadedLanguages.add(languageValue);
      })
      .catch(() => undefined)
      .finally(() => {
        loadingLanguages.delete(languageValue);
      });

    loadingLanguages.set(languageValue, loadPromise);
    await loadPromise;
  }
}
