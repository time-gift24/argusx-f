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
import type { MermaidConfig } from 'mermaid';
import type { MarkdownMermaidPlugin } from '../models/markdown-plugin.models';
import { scheduleDeferredRender } from '../services/deferred-render-controller';
import { MermaidPanZoomComponent } from './mermaid-pan-zoom.component';

let mermaidModulePromise: Promise<typeof import('mermaid')> | null = null;
let mermaidInitialized = false;
let fallbackMermaidConfigKey = '';

const loadMermaid = (): Promise<typeof import('mermaid')> => {
  if (!mermaidModulePromise) {
    mermaidModulePromise = import('mermaid');
  }

  return mermaidModulePromise;
};

@Component({
  selector: 'sd-mermaid',
  standalone: true,
  imports: [MermaidPanZoomComponent],
  template: `
    <div #container class="sd-heavy-content">
      @if (showControlsBar()) {
        <div class="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          @if (allowCopy()) {
            <button type="button" (click)="copySource()">Copy</button>
          }
          @if (allowDownload()) {
            <button type="button" (click)="download('mmd')">MMD</button>
            <button type="button" (click)="download('svg')">SVG</button>
            <button type="button" (click)="download('png')">PNG</button>
          }
          @if (allowFullscreen()) {
            <button type="button" (click)="openFullscreen()">Fullscreen</button>
          }
        </div>
      }

      @if (error() && !lastValidSvg()) {
        <div class="my-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p class="font-mono text-sm text-red-700">Mermaid Error: {{ error() }}</p>
        </div>
      } @else if (svg()) {
        <sd-mermaid-pan-zoom [showControls]="showPanZoom()">
          <div class="my-4 flex justify-center" [innerHTML]="svg()"></div>
        </sd-mermaid-pan-zoom>
      } @else {
        <div class="my-4 flex min-h-[120px] items-center justify-center text-muted-foreground">
          <span>Loading diagram...</span>
        </div>
      }
    </div>

    @if (fullscreenOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
        (click)="closeFullscreen()"
        (keydown.escape)="closeFullscreen()"
        tabindex="0">
        <div
          class="h-[90vh] w-[90vw] rounded-xl border bg-background p-3 shadow-xl"
          (click)="$event.stopPropagation()">
          <div class="mb-3 flex justify-end">
            <button type="button" class="rounded border px-2 py-1 text-xs" (click)="closeFullscreen()">
              Close
            </button>
          </div>

          @if (svg()) {
            <sd-mermaid-pan-zoom
              [fullscreen]="true"
              [showControls]="showPanZoom()"
              [initialZoom]="1">
              <div class="flex h-full w-full items-center justify-center" [innerHTML]="svg()"></div>
            </sd-mermaid-pan-zoom>
          } @else {
            <div class="flex h-full items-center justify-center text-muted-foreground">
              Rendering...
            </div>
          }
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MermaidComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private renderVersion = 0;
  private readonly containerRef = viewChild<ElementRef<HTMLElement>>('container');
  private readonly isVisible = signal(false);

  readonly chart = input.required<string>();
  readonly plugin = input<MarkdownMermaidPlugin | undefined>(undefined);
  readonly config = input<MermaidConfig | undefined>(undefined);
  readonly showPanZoom = input<boolean>(true);
  readonly showControlsBar = input<boolean>(true);
  readonly allowFullscreen = input<boolean>(false);
  readonly allowCopy = input<boolean>(true);
  readonly allowDownload = input<boolean>(false);
  readonly deferRootMargin = input('300px');
  readonly deferDebounceMs = input(300);
  readonly deferIdleTimeout = input(500);

  readonly svg = signal<SafeHtml>('');
  readonly rawSvg = signal('');
  readonly error = signal<string | null>(null);
  readonly lastValidSvg = signal<SafeHtml>('');
  readonly lastValidRawSvg = signal('');
  readonly fullscreenOpen = signal(false);

  constructor() {
    effect(() => {
      const container = this.containerRef()?.nativeElement;
      const rootMargin = this.deferRootMargin();

      if (!container) {
        return;
      }

      if (typeof IntersectionObserver !== 'function') {
        this.isVisible.set(true);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this.isVisible.set(true);
            observer.disconnect();
          }
        },
        {
          rootMargin,
          threshold: 0,
        }
      );
      observer.observe(container);

      return () => observer.disconnect();
    });

    effect(() => {
      const chart = this.chart();
      const shouldRender = this.isVisible() || this.fullscreenOpen();
      if (!shouldRender) {
        return;
      }

      const cancel = scheduleDeferredRender(
        () => {
          void this.render(chart);
        },
        {
          debounceMs: this.deferDebounceMs(),
          idleTimeout: this.deferIdleTimeout(),
        }
      );

      return () => cancel();
    });

    effect(() => {
      if (!this.fullscreenOpen()) {
        return;
      }

      if (typeof document === 'undefined') {
        return;
      }

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const onEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          this.closeFullscreen();
        }
      };
      document.addEventListener('keydown', onEscape);

      return () => {
        document.removeEventListener('keydown', onEscape);
        document.body.style.overflow = originalOverflow;
      };
    });
  }

  async copySource(): Promise<void> {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      return;
    }

    await navigator.clipboard.writeText(this.chart());
  }

  download(format: 'mmd' | 'svg' | 'png'): void {
    if (format === 'mmd') {
      this.downloadText('diagram.mmd', this.chart(), 'text/plain;charset=utf-8');
      return;
    }

    const svgContent = this.rawSvg() || this.lastValidRawSvg();
    if (!svgContent) {
      return;
    }

    if (format === 'svg') {
      this.downloadText('diagram.svg', svgContent, 'image/svg+xml;charset=utf-8');
      return;
    }

    void this.downloadPng(svgContent);
  }

  openFullscreen(): void {
    this.fullscreenOpen.set(true);
  }

  closeFullscreen(): void {
    this.fullscreenOpen.set(false);
  }

  private async render(chart: string): Promise<void> {
    const currentVersion = ++this.renderVersion;
    const trimmed = chart.trim();

    if (!trimmed) {
      this.error.set(null);
      this.svg.set(this.lastValidSvg() || '');
      this.rawSvg.set(this.lastValidRawSvg() || '');
      return;
    }

    try {
      const svgContent = await this.renderChart(trimmed);
      if (currentVersion !== this.renderVersion) {
        return;
      }

      const safeSvg = this.sanitizer.bypassSecurityTrustHtml(svgContent);
      this.lastValidSvg.set(safeSvg);
      this.lastValidRawSvg.set(svgContent);
      this.svg.set(safeSvg);
      this.rawSvg.set(svgContent);
      this.error.set(null);
    } catch (err) {
      if (currentVersion !== this.renderVersion) {
        return;
      }

      this.error.set(err instanceof Error ? err.message : 'Render failed');
      this.svg.set(this.lastValidSvg() || '');
      this.rawSvg.set(this.lastValidRawSvg() || '');
    }
  }

  private async renderChart(chart: string): Promise<string> {
    const plugin = this.plugin();
    const config = this.config();
    const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    if (plugin) {
      const mermaid = plugin.getMermaid(config);
      const result = await mermaid.render(id, chart);
      return result.svg;
    }

    const mermaid = await loadMermaid();
    const mergedConfig = {
      startOnLoad: false,
      ...(config ?? {}),
    };
    const configKey = JSON.stringify(mergedConfig);
    if (!mermaidInitialized || fallbackMermaidConfigKey !== configKey) {
      mermaid.default.initialize(mergedConfig);
      mermaidInitialized = true;
      fallbackMermaidConfigKey = configKey;
    }

    const result = await mermaid.default.render(id, chart);
    return result.svg;
  }

  private downloadText(
    filename: string,
    content: string,
    contentType: string
  ): void {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private async downloadPng(svgContent: string): Promise<void> {
    if (typeof document === 'undefined') {
      return;
    }

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(blob);
    const image = new Image();

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Failed to load SVG image'));
      image.src = svgUrl;
    });

    const width = Math.max(1, Math.round(image.width || 1200));
    const height = Math.max(1, Math.round(image.height || 800));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) {
      URL.revokeObjectURL(svgUrl);
      return;
    }

    context.drawImage(image, 0, 0, width, height);
    const pngBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    );
    URL.revokeObjectURL(svgUrl);
    if (!pngBlob) {
      return;
    }

    const pngUrl = URL.createObjectURL(pngBlob);
    const anchor = document.createElement('a');
    anchor.href = pngUrl;
    anchor.download = 'diagram.png';
    anchor.click();
    URL.revokeObjectURL(pngUrl);
  }
}
