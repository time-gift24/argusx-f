import { Injectable, inject, signal } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';

export interface LiquidOverlayConfig {
  hasBackdrop?: boolean;
  backdropClass?: string | string[];
  panelClass?: string | string[];
  disposeOnNavigation?: boolean;
}

@Injectable({ providedIn: 'root' })
export class LiquidOverlayService {
  private readonly overlay = inject(Overlay);

  readonly activeOverlays = signal<Set<string>>(new Set());

  open(config: LiquidOverlayConfig = {}): OverlayRef {
    const overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: config.hasBackdrop ?? true,
        backdropClass: config.backdropClass ?? 'liquid-backdrop',
        panelClass: config.panelClass ?? 'liquid-overlay-pane',
        disposeOnNavigation: config.disposeOnNavigation ?? true,
        positionStrategy: this.overlay
          .position()
          .global()
          .centerHorizontally()
          .centerVertically(),
      })
    );

    return overlayRef;
  }

  close(overlayRef: OverlayRef): void {
    overlayRef.dispose();
  }
}
