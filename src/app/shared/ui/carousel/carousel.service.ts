import { Injectable, computed, signal } from '@angular/core';

export type CarouselOrientation = 'horizontal' | 'vertical';

export interface CarouselOptions {
  loop?: boolean;
  align?: 'start' | 'center' | 'end';
  skipSnaps?: boolean;
  containScroll?: boolean;
  dragFree?: boolean;
  slidesToScroll?: number;
  duration?: number;
}

@Injectable()
export class CarouselService {
  // Configuration
  readonly orientation = signal<CarouselOrientation>('horizontal');
  readonly options = signal<CarouselOptions>({});
  readonly slideCount = signal(0);

  // State
  readonly currentIndex = signal(0);
  readonly isDragging = signal(false);
  readonly autoplayEnabled = signal(false);

  // Computed values
  readonly canScrollPrev = computed(() => {
    const index = this.currentIndex();
    const loop = this.options().loop ?? false;
    return loop || index > 0;
  });

  readonly canScrollNext = computed(() => {
    const index = this.currentIndex();
    const count = this.slideCount();
    const loop = this.options().loop ?? false;
    return loop || index < count - 1;
  });

  readonly scrollSnaps = computed(() => {
    const count = this.slideCount();
    return Array.from({ length: count }, (_, i) => i);
  });

  initialize(options: CarouselOptions, orientation: CarouselOrientation, slideCount: number): void {
    this.options.set(options);
    this.orientation.set(orientation);
    this.slideCount.set(slideCount);
    this.currentIndex.set(0);
  }

  scrollPrev(): void {
    const index = this.currentIndex();
    const count = this.slideCount();
    const loop = this.options().loop ?? false;

    if (loop && index === 0) {
      this.currentIndex.set(count - 1);
    } else if (index > 0) {
      this.currentIndex.set(index - 1);
    }
  }

  scrollNext(): void {
    const index = this.currentIndex();
    const count = this.slideCount();
    const loop = this.options().loop ?? false;

    if (loop && index === count - 1) {
      this.currentIndex.set(0);
    } else if (index < count - 1) {
      this.currentIndex.set(index + 1);
    }
  }

  scrollTo(index: number): void {
    const count = this.slideCount();
    if (index >= 0 && index < count) {
      this.currentIndex.set(index);
    }
  }

  startAutoplay(interval: number): () => void {
    this.autoplayEnabled.set(true);
    const timer = setInterval(() => {
      this.scrollNext();
    }, interval);

    return () => {
      clearInterval(timer);
      this.autoplayEnabled.set(false);
    };
  }
}
