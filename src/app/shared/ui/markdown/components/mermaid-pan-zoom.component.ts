import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'sd-mermaid-pan-zoom',
  standalone: true,
  template: `
    <div
      class="relative flex flex-col"
      [class.h-full]="fullscreen()"
      [class.min-h-28]="!fullscreen()"
      [style.cursor]="isPanning() ? 'grabbing' : 'grab'">
      @if (showControls()) {
        <div
          class="absolute z-10 flex flex-col gap-1 rounded border border-border bg-background/90 p-1 shadow-sm backdrop-blur-sm"
          [class.bottom-4]="fullscreen()"
          [class.left-4]="fullscreen()"
          [class.bottom-2]="!fullscreen()"
          [class.left-2]="!fullscreen()">
          <button
            type="button"
            class="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            [disabled]="zoom() >= maxZoom()"
            (click)="zoomIn()">
            +
          </button>
          <button
            type="button"
            class="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            [disabled]="zoom() <= minZoom()"
            (click)="zoomOut()">
            -
          </button>
          <button
            type="button"
            class="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            (click)="reset()">
            Reset
          </button>
        </div>
      }

      <div
        class="flex flex-1 items-center justify-center transition-transform duration-150 ease-out"
        [style.transform]="transformStyle()"
        [class.h-full]="fullscreen()"
        [style.touch-action]="'none'"
        [style.will-change]="'transform'"
        (wheel)="onWheel($event)"
        (pointerdown)="onPointerDown($event)"
        (pointermove)="onPointerMove($event)"
        (pointerup)="onPointerUp($event)"
        (pointercancel)="onPointerUp($event)">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MermaidPanZoomComponent {
  readonly minZoom = input(0.5);
  readonly maxZoom = input(3);
  readonly zoomStep = input(0.1);
  readonly initialZoom = input(1);
  readonly showControls = input(true);
  readonly fullscreen = input(false);

  readonly zoom = signal(1);
  readonly panX = signal(0);
  readonly panY = signal(0);
  readonly isPanning = signal(false);
  private panStartX = 0;
  private panStartY = 0;
  private panOriginX = 0;
  private panOriginY = 0;

  readonly transformStyle = computed(
    () => `translate(${this.panX()}px, ${this.panY()}px) scale(${this.zoom()})`
  );

  constructor() {
    this.zoom.set(this.initialZoom());
  }

  zoomIn(): void {
    const next = Math.min(this.maxZoom(), this.zoom() + this.zoomStep());
    this.zoom.set(next);
  }

  zoomOut(): void {
    const next = Math.max(this.minZoom(), this.zoom() - this.zoomStep());
    this.zoom.set(next);
  }

  reset(): void {
    this.zoom.set(this.initialZoom());
    this.panX.set(0);
    this.panY.set(0);
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    if (event.deltaY > 0) {
      this.zoomOut();
      return;
    }

    this.zoomIn();
  }

  onPointerDown(event: PointerEvent): void {
    if (event.button !== 0 || event.isPrimary === false) {
      return;
    }

    this.isPanning.set(true);
    this.panStartX = event.clientX;
    this.panStartY = event.clientY;
    this.panOriginX = this.panX();
    this.panOriginY = this.panY();

    if (typeof document !== 'undefined') {
      document.body.style.userSelect = 'none';
    }

    const target = event.currentTarget;
    if (target instanceof HTMLElement && typeof target.setPointerCapture === 'function') {
      target.setPointerCapture(event.pointerId);
    }
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.isPanning()) {
      return;
    }

    event.preventDefault();
    const deltaX = event.clientX - this.panStartX;
    const deltaY = event.clientY - this.panStartY;
    this.panX.set(this.panOriginX + deltaX);
    this.panY.set(this.panOriginY + deltaY);
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.isPanning()) {
      return;
    }

    this.isPanning.set(false);
    if (typeof document !== 'undefined') {
      document.body.style.userSelect = '';
    }

    const target = event.currentTarget;
    if (target instanceof HTMLElement && typeof target.releasePointerCapture === 'function') {
      target.releasePointerCapture(event.pointerId);
    }
  }
}
