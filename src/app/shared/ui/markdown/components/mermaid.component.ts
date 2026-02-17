import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { scheduleDeferredRender } from '../services/deferred-render-controller';

let mermaidModulePromise: Promise<typeof import('mermaid')> | null = null;
let mermaidInitialized = false;

const loadMermaid = (): Promise<typeof import('mermaid')> => {
  if (!mermaidModulePromise) {
    mermaidModulePromise = import('mermaid');
  }

  return mermaidModulePromise;
};

@Component({
  selector: 'sd-mermaid',
  template: `
    <div #container>
      @if (error() && !lastValidSvg()) {
        <div class="my-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p class="font-mono text-sm text-red-700">Mermaid Error: {{ error() }}</p>
        </div>
      } @else if (svg()) {
        <div class="my-4" [innerHTML]="svg()"></div>
      } @else {
        <div class="my-4 flex min-h-[100px] items-center justify-center text-muted-foreground">
          <span>Loading diagram...</span>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MermaidComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private renderVersion = 0;
  private readonly containerRef = viewChild<ElementRef<HTMLElement>>('container');
  private readonly isVisible = signal(false);

  readonly chart = input.required<string>();

  readonly svg = signal<SafeHtml>('');
  readonly error = signal<string | null>(null);
  readonly lastValidSvg = signal<SafeHtml>('');

  constructor() {
    effect(() => {
      const container = this.containerRef()?.nativeElement;

      if (!container) {
        return;
      }

      if (typeof IntersectionObserver !== 'function') {
        this.isVisible.set(true);
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.isVisible.set(true);
          observer.disconnect();
        }
      });
      observer.observe(container);

      return () => observer.disconnect();
    });

    effect(() => {
      const chart = this.chart();
      if (!this.isVisible()) {
        return;
      }

      const cancel = scheduleDeferredRender(() => {
        void this.render(chart);
      });

      return () => cancel();
    });
  }

  private async render(chart: string): Promise<void> {
    const currentVersion = ++this.renderVersion;
    const trimmed = chart.trim();

    if (!trimmed) {
      this.error.set(null);
      this.svg.set(this.lastValidSvg() || '');
      return;
    }

    try {
      const mermaid = await loadMermaid();
      if (currentVersion !== this.renderVersion) {
        return;
      }

      if (!mermaidInitialized) {
        mermaid.default.initialize({ startOnLoad: false });
        mermaidInitialized = true;
      }

      const id = `mermaid-${currentVersion}-${Math.random().toString(36).slice(2, 10)}`;
      const { svg } = await mermaid.default.render(id, trimmed);
      if (currentVersion !== this.renderVersion) {
        return;
      }

      const safeSvg = this.sanitizer.bypassSecurityTrustHtml(svg);
      this.lastValidSvg.set(safeSvg);
      this.svg.set(safeSvg);
      this.error.set(null);
    } catch (err) {
      if (currentVersion !== this.renderVersion) {
        return;
      }

      this.error.set(err instanceof Error ? err.message : 'Render failed');
      this.svg.set(this.lastValidSvg() || '');
    }
  }
}
