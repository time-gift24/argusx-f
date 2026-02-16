// src/app/shared/ui/liquid-glass/liquid-performance.service.ts
import { Injectable, signal, effect, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { QualityLevel } from './liquid-glass.types';
import { QUALITY_PRESETS } from './liquid-glass.config';

@Injectable({ providedIn: 'root' })
export class LiquidPerformanceService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly qualityLevel = signal<QualityLevel>('high');

  readonly effectiveConfig = computed(() => {
    const level = this.qualityLevel();
    return QUALITY_PRESETS[level];
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initReducedMotionObserver();
    }
  }

  private initReducedMotionObserver(): void {
    effect(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

      const handler = (event: MediaQueryListEvent): void => {
        this.qualityLevel.set(event.matches ? 'low-power' : 'high');
      };

      if (mediaQuery.matches) {
        this.qualityLevel.set('low-power');
      }

      mediaQuery.addEventListener('change', handler);
    });
  }

  setDragging(isDragging: boolean): void {
    this.qualityLevel.update((current) => (isDragging ? 'dragging' : 'high'));
  }
}
