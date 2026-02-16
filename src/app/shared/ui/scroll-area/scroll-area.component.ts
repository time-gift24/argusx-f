import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
  effect,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { cn } from '../../utils/cn';

/**
 * ScrollArea Component
 *
 * A custom scrollable area component that provides styled scrollbars
 * while maintaining native browser scrolling behavior.
 *
 * Aligned with official shadcn preset (.vendor/aim/components/ui/scroll-area.tsx)
 *
 * @example
 * ```html
 * <app-scroll-area class="h-72">
 *   <div class="p-4">
 *     Content goes here...
 *   </div>
 * </app-scroll-area>
 * ```
 *
 * @example With horizontal scroll
 * ```html
 * <app-scroll-area class="h-72" orientation="horizontal">
 *   <div class="flex gap-4 p-4">
 *     <div class="w-96">Item 1</div>
 *     <div class="w-96">Item 2</div>
 *   </div>
 * </app-scroll-area>
 * ```
 */
@Component({
  selector: 'app-scroll-area',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #viewport
      class="scroll-area-viewport"
      [class]="viewportClass()"
      (scroll)="onScroll($event)"
    >
      <ng-content />
    </div>
    @if (showScrollbar()) {
      <app-scroll-bar
        [orientation]="orientation()"
        [scrollHeight]="scrollHeight()"
        [clientHeight]="clientHeight()"
        [scrollTop]="scrollTop()"
        [scrollLeft]="scrollLeft()"
        [scrollWidth]="scrollWidth()"
        [clientWidth]="clientWidth()"
        (scrollTo)="scrollToPosition($event)"
      />
    }
  `,
  host: {
    '[attr.data-slot]': '"scroll-area"',
    '[class]': 'computedClass()',
  },
  styles: [
    `
      :host {
        position: relative;
        display: block;
        overflow: hidden;
      }

      .scroll-area-viewport {
        width: 100%;
        height: 100%;
        overflow: scroll;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */
        border-radius: inherit;
      }

      .scroll-area-viewport::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
      }

      .scroll-area-viewport:focus-visible {
        outline: none;
        box-shadow:
          0 0 0 2px var(--background, #fff),
          0 0 0 4px hsl(var(--ring) / 0.5);
      }

      .scroll-area-viewport:focus-visible::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
      }
    `,
  ],
  imports: [forwardRef(() => ScrollBarComponent)],
})
export class ScrollAreaComponent {
  /**
   * Orientation of the scrollbar.
   * - 'vertical': Only vertical scrollbar
   * - 'horizontal': Only horizontal scrollbar
   * - 'both': Both scrollbars (default)
   */
  readonly orientation = input<'vertical' | 'horizontal' | 'both'>('both');

  /**
   * Additional CSS classes to apply to the scroll area.
   */
  readonly class = input<string>('');

  /**
   * Whether to show the custom scrollbar.
   * @default true
   */
  readonly scrollbarVisible = input<boolean>(true);

  /**
   * Emitted when the scroll position changes.
   */
  readonly scrollChange = output<{ top: number; left: number }>();

  /**
   * Emitted when scroll reaches the bottom.
   */
  readonly scrollBottom = output<void>();

  /**
   * Reference to the viewport element.
   */
  protected readonly viewport = viewChild<ElementRef<HTMLDivElement>>('viewport');

  /**
   * Internal scroll state.
   */
  protected readonly scrollTop = signal(0);
  protected readonly scrollLeft = signal(0);
  protected readonly scrollHeight = signal(0);
  protected readonly clientHeight = signal(0);
  protected readonly scrollWidth = signal(0);
  protected readonly clientWidth = signal(0);

  /**
   * Computed class for the host element.
   */
  protected readonly computedClass = computed(() => cn('relative', this.class()));

  /**
   * Computed class for the viewport.
   */
  protected readonly viewportClass = computed(() => {
    const orientation = this.orientation();
    const overflowX = orientation === 'vertical' ? 'hidden' : 'auto';
    const overflowY = orientation === 'horizontal' ? 'hidden' : 'auto';

    return cn('focus-visible:ring-ring/50 size-full rounded-[inherit]', 'transition-[color,box-shadow]', 'outline-none');
  });

  /**
   * Whether to show the custom scrollbar.
   */
  protected readonly showScrollbar = computed(() => {
    if (!this.scrollbarVisible()) return false;
    const orientation = this.orientation();
    if (orientation === 'vertical') {
      return this.scrollHeight() > this.clientHeight();
    }
    if (orientation === 'horizontal') {
      return this.scrollWidth() > this.clientWidth();
    }
    return this.scrollHeight() > this.clientHeight() || this.scrollWidth() > this.clientWidth();
  });

  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Update scroll dimensions on viewport changes
    effect(() => {
      const viewportEl = this.viewport();
      if (viewportEl) {
        const el = viewportEl.nativeElement;

        // Clean up previous observer if exists
        if (this.resizeObserver) {
          this.resizeObserver.disconnect();
        }

        this.resizeObserver = new ResizeObserver(() => {
          this.updateScrollState(el);
        });
        this.resizeObserver.observe(el);
        this.updateScrollState(el);
      }
    });

    // Clean up ResizeObserver on component destroy
    destroyRef.onDestroy(() => {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
    });
  }

  /**
   * Handle scroll events.
   */
  protected onScroll(event: Event): void {
    const target = event.target as HTMLDivElement;
    this.updateScrollState(target);

    this.scrollChange.emit({
      top: target.scrollTop,
      left: target.scrollLeft,
    });

    // Check if scrolled to bottom
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 1) {
      this.scrollBottom.emit();
    }
  }

  /**
   * Update internal scroll state.
   */
  private updateScrollState(el: HTMLDivElement): void {
    this.scrollTop.set(el.scrollTop);
    this.scrollLeft.set(el.scrollLeft);
    this.scrollHeight.set(el.scrollHeight);
    this.clientHeight.set(el.clientHeight);
    this.scrollWidth.set(el.scrollWidth);
    this.clientWidth.set(el.clientWidth);
  }

  /**
   * Scroll to a specific position.
   */
  scrollToPosition(position: { top?: number; left?: number }): void {
    const viewportEl = this.viewport();
    if (viewportEl) {
      if (position.top !== undefined) {
        viewportEl.nativeElement.scrollTop = position.top;
      }
      if (position.left !== undefined) {
        viewportEl.nativeElement.scrollLeft = position.left;
      }
    }
  }

  /**
   * Scroll to top.
   */
  scrollToTop(): void {
    this.scrollToPosition({ top: 0 });
  }

  /**
   * Scroll to bottom.
   */
  scrollToBottom(): void {
    const viewportEl = this.viewport();
    if (viewportEl) {
      this.scrollToPosition({ top: viewportEl.nativeElement.scrollHeight });
    }
  }
}

/**
 * ScrollBar Component
 *
 * Custom scrollbar that mimics native behavior with custom styling.
 */
@Component({
  selector: 'app-scroll-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (showVertical()) {
      <div
        class="scroll-bar-track"
        [class]="trackClass()"
        [attr.data-orientation]="'vertical'"
        (mousedown)="onTrackClick($event, 'vertical')"
      >
        <div
          class="scroll-bar-thumb"
          [class]="thumbClass()"
          [style.height.px]="thumbHeight()"
          [style.transform]="verticalTransform()"
          (mousedown)="onThumbMouseDown($event, 'vertical')"
        ></div>
      </div>
    }
    @if (showHorizontal()) {
      <div
        class="scroll-bar-track"
        [class]="trackClass()"
        [attr.data-orientation]="'horizontal'"
        (mousedown)="onTrackClick($event, 'horizontal')"
      >
        <div
          class="scroll-bar-thumb"
          [class]="thumbClass()"
          [style.width.px]="thumbWidth()"
          [style.transform]="horizontalTransform()"
          (mousedown)="onThumbMouseDown($event, 'horizontal')"
        ></div>
      </div>
    }
  `,
  host: {
    '[attr.data-slot]': '"scroll-area-scrollbar"',
    '[class]': 'computedClass()',
  },
  styles: [
    `
      :host {
        position: absolute;
        display: flex;
        touch-action: none;
        user-select: none;
        padding: 1px;
        transition: background-color 150ms;
      }

      :host([data-orientation='vertical']) {
        right: 0;
        top: 0;
        bottom: 0;
        width: 10px;
        flex-direction: column;
        border-left: 1px solid transparent;
      }

      :host([data-orientation='horizontal']) {
        bottom: 0;
        left: 0;
        right: 0;
        height: 10px;
        flex-direction: row;
        border-top: 1px solid transparent;
      }

      .scroll-bar-track {
        position: relative;
        flex: 1;
        border-radius: 9999px;
        background: transparent;
      }

      .scroll-bar-thumb {
        position: relative;
        flex: none;
        border-radius: 9999px;
        background: hsl(var(--border));
        cursor: pointer;
        transition: background-color 150ms;
      }

      .scroll-bar-thumb:hover {
        background: hsl(var(--border) / 0.8);
      }

      .scroll-bar-thumb:active {
        background: hsl(var(--border) / 0.6);
      }
    `,
  ],
})
export class ScrollBarComponent {
  /**
   * Orientation: vertical, horizontal, or both.
   */
  readonly orientation = input<'vertical' | 'horizontal' | 'both'>('vertical');

  /**
   * Additional CSS classes.
   */
  readonly class = input<string>('');

  /**
   * Scroll dimensions from parent.
   */
  readonly scrollHeight = input<number>(0);
  readonly clientHeight = input<number>(0);
  readonly scrollTop = input<number>(0);
  readonly scrollWidth = input<number>(0);
  readonly clientWidth = input<number>(0);
  readonly scrollLeft = input<number>(0);

  /**
   * Output for scroll position changes.
   */
  readonly scrollTo = output<{ top?: number; left?: number }>();

  /**
   * Track drag state.
   */
  private isDragging = false;
  private dragStartPos = 0;
  private dragStartScroll = 0;
  private currentOrientation: 'vertical' | 'horizontal' = 'vertical';

  /**
   * Computed host class.
   */
  protected readonly computedClass = computed(() =>
    cn(
      'data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent',
      'data-horizontal:h-2.5 data-horizontal:w-full data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent',
      'flex touch-none p-px transition-colors select-none',
      this.class()
    )
  );

  /**
   * Track class.
   */
  protected readonly trackClass = computed(() =>
    cn('relative flex-1 rounded-full')
  );

  /**
   * Thumb class.
   */
  protected readonly thumbClass = computed(() =>
    cn('bg-border relative rounded-full flex-1 cursor-pointer')
  );

  /**
   * Whether to show vertical scrollbar.
   */
  protected readonly showVertical = computed(() => {
    const orientation = this.orientation();
    return (orientation === 'vertical' || orientation === 'both') &&
           this.scrollHeight() > this.clientHeight();
  });

  /**
   * Whether to show horizontal scrollbar.
   */
  protected readonly showHorizontal = computed(() => {
    const orientation = this.orientation();
    return (orientation === 'horizontal' || orientation === 'both') &&
           this.scrollWidth() > this.clientWidth();
  });

  /**
   * Calculate vertical thumb height.
   */
  protected readonly thumbHeight = computed(() => {
    const scrollHeight = this.scrollHeight();
    const clientHeight = this.clientHeight();
    if (scrollHeight === 0 || clientHeight === 0) return 0;
    const ratio = clientHeight / scrollHeight;
    return Math.max(ratio * clientHeight, 20);
  });

  /**
   * Calculate horizontal thumb width.
   */
  protected readonly thumbWidth = computed(() => {
    const scrollWidth = this.scrollWidth();
    const clientWidth = this.clientWidth();
    if (scrollWidth === 0 || clientWidth === 0) return 0;
    const ratio = clientWidth / scrollWidth;
    return Math.max(ratio * clientWidth, 20);
  });

  /**
   * Calculate vertical thumb transform.
   */
  protected readonly verticalTransform = computed(() => {
    const scrollHeight = this.scrollHeight();
    const clientHeight = this.clientHeight();
    const scrollTop = this.scrollTop();
    if (scrollHeight === clientHeight) return 'translateY(0)';
    const maxScroll = scrollHeight - clientHeight;
    const maxThumbPos = clientHeight - this.thumbHeight();
    const thumbPos = maxScroll > 0 ? (scrollTop / maxScroll) * maxThumbPos : 0;
    return `translateY(${thumbPos}px)`;
  });

  /**
   * Calculate horizontal thumb transform.
   */
  protected readonly horizontalTransform = computed(() => {
    const scrollWidth = this.scrollWidth();
    const clientWidth = this.clientWidth();
    const scrollLeft = this.scrollLeft();
    if (scrollWidth === clientWidth) return 'translateX(0)';
    const maxScroll = scrollWidth - clientWidth;
    const maxThumbPos = clientWidth - this.thumbWidth();
    const thumbPos = maxScroll > 0 ? (scrollLeft / maxScroll) * maxThumbPos : 0;
    return `translateX(${thumbPos}px)`;
  });

  /**
   * Handle track click to scroll.
   */
  protected onTrackClick(event: MouseEvent, orientation: 'vertical' | 'horizontal'): void {
    if (this.isDragging) return;

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    if (orientation === 'vertical') {
      const clickPos = event.clientY - rect.top;
      const ratio = clickPos / rect.height;
      const newScrollTop = ratio * this.scrollHeight();
      this.scrollTo.emit({ top: newScrollTop });
    } else {
      const clickPos = event.clientX - rect.left;
      const ratio = clickPos / rect.width;
      const newScrollLeft = ratio * this.scrollWidth();
      this.scrollTo.emit({ left: newScrollLeft });
    }
  }

  /**
   * Handle thumb mouse down to start dragging.
   */
  protected onThumbMouseDown(event: MouseEvent, orientation: 'vertical' | 'horizontal'): void {
    event.preventDefault();
    event.stopPropagation();

    this.isDragging = true;
    this.currentOrientation = orientation;

    if (orientation === 'vertical') {
      this.dragStartPos = event.clientY;
      this.dragStartScroll = this.scrollTop();
    } else {
      this.dragStartPos = event.clientX;
      this.dragStartScroll = this.scrollLeft();
    }

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  /**
   * Handle mouse move during drag.
   */
  private onMouseMove = (event: MouseEvent): void => {
    if (!this.isDragging) return;

    if (this.currentOrientation === 'vertical') {
      const deltaY = event.clientY - this.dragStartPos;
      const clientHeight = this.clientHeight();
      const scrollHeight = this.scrollHeight();
      const thumbHeight = this.thumbHeight();

      const maxThumbPos = clientHeight - thumbHeight;
      const maxScroll = scrollHeight - clientHeight;
      const scrollRatio = maxThumbPos > 0 ? maxScroll / maxThumbPos : 1;
      const newScrollTop = Math.max(0, Math.min(maxScroll, this.dragStartScroll + deltaY * scrollRatio));

      this.scrollTo.emit({ top: newScrollTop });
    } else {
      const deltaX = event.clientX - this.dragStartPos;
      const clientWidth = this.clientWidth();
      const scrollWidth = this.scrollWidth();
      const thumbWidth = this.thumbWidth();

      const maxThumbPos = clientWidth - thumbWidth;
      const maxScroll = scrollWidth - clientWidth;
      const scrollRatio = maxThumbPos > 0 ? maxScroll / maxThumbPos : 1;
      const newScrollLeft = Math.max(0, Math.min(maxScroll, this.dragStartScroll + deltaX * scrollRatio));

      this.scrollTo.emit({ left: newScrollLeft });
    }
  };

  /**
   * Handle mouse up to stop dragging.
   */
  private onMouseUp = (): void => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };
}

/**
 * Export all ScrollArea components.
 */
export const ScrollAreaComponents = [ScrollAreaComponent, ScrollBarComponent];
