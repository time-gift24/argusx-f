import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'sd-mermaid',
  template: `
    @if (error() && !lastValidSvg()) {
      <div class="rounded-lg border border-red-200 bg-red-50 p-4 my-4">
        <p class="text-sm text-red-700 font-mono">Mermaid Error: {{ error() }}</p>
      </div>
    } @else if (svg()) {
      <div class="my-4" [innerHTML]="svg()"></div>
    } @else {
      <div class="my-4 min-h-[100px] flex items-center justify-center text-muted-foreground">
        <span>Loading diagram...</span>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MermaidComponent {
  readonly chart = input.required<string>();

  svg = signal<SafeHtml>('');
  error = signal<string | null>(null);
  lastValidSvg = signal<SafeHtml>('');

  constructor(private sanitizer: DomSanitizer) {
    effect(() => {
      this.render(this.chart());
    });
  }

  private async render(chart: string) {
    try {
      const mermaid = await import('mermaid');
      mermaid.default.initialize({ startOnLoad: false });

      const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
      const { svg } = await mermaid.default.render(id, chart);

      const safeSvg = this.sanitizer.bypassSecurityTrustHtml(svg);
      this.lastValidSvg.set(safeSvg);
      this.svg.set(safeSvg);
      this.error.set(null);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Render failed');
    }
  }
}
