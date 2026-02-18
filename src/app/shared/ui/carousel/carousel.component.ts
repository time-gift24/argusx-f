import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  output,
  inject,
} from '@angular/core';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';
import { cn } from '../../utils/cn';
import { CarouselService, CarouselOrientation, CarouselOptions } from './carousel.service';

export type { CarouselOrientation, CarouselOptions } from './carousel.service';

export type CarouselVariant = 'default' | 'overflow';
export type CarouselSize = 'default' | 'sm' | 'lg' | 'xl';

/**
 * Carousel component for displaying a sliding carousel of items.
 * Supports horizontal and vertical orientations, loop mode, and keyboard navigation.
 *
 * @example
 * ```html
 * <app-carousel [opts]="{ loop: true }" orientation="horizontal">
 *   <app-carousel-content>
 *     <app-carousel-item>Slide 1</app-carousel-item>
 *     <app-carousel-item>Slide 2</app-carousel-item>
 *   </app-carousel-content>
 *   <app-carousel-previous />
 *   <app-carousel-next />
 * </app-carousel>
 * ```
 */
@Component({
  selector: 'app-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CarouselService],
  host: {
    role: 'region',
    'aria-roledescription': 'carousel',
    '[attr.data-slot]': '"carousel"',
  },
  template: `
    <div
      class="relative"
      (keydown)="onKeyDown($event)"
    >
      <ng-content />
    </div>
  `,
})
export class CarouselComponent {
  private readonly service = inject(CarouselService);

  /** Carousel options */
  readonly opts = input<CarouselOptions>({});

  /** Orientation of the carousel */
  readonly orientation = input<CarouselOrientation>('horizontal');

  /** Variant of the carousel */
  readonly variant = input<CarouselVariant>('default');

  /** Size of the carousel */
  readonly size = input<CarouselSize>('default');

  /** Callback when carousel API is ready */
  readonly api = output<CarouselService>();

  readonly currentIndex = this.service.currentIndex;
  readonly canScrollPrev = this.service.canScrollPrev;
  readonly canScrollNext = this.service.canScrollNext;

  initialize(slideCount: number): void {
    this.service.initialize(this.opts(), this.orientation(), slideCount);
    this.api.emit(this.service);
  }

  onKeyDown(event: KeyboardEvent): void {
    const orientation = this.orientation();
    if (orientation === 'horizontal') {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.service.scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.service.scrollNext();
      }
    } else {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.service.scrollPrev();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.service.scrollNext();
      }
    }
  }
}

/**
 * Container for carousel items with overflow handling.
 */
@Component({
  selector: 'app-carousel-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-slot]': '"carousel-content"',
  },
  template: `
    <div
      #container
      class="overflow-hidden"
    >
      <div
        [class]="contentClass()"
        [style.transform]="transform()"
        style="transition: transform 300ms ease-out"
      >
        <ng-content />
      </div>
    </div>
  `,
})
export class CarouselContentComponent {
  private readonly carousel = inject(CarouselComponent);
  private readonly service = inject(CarouselService);

  readonly class = input<string>('');
  readonly items = contentChildren(CarouselItemComponent);

  readonly orientation = this.service.orientation;
  readonly currentIndex = this.service.currentIndex;

  readonly contentClass = computed(() =>
    cn(
      'flex',
      this.orientation() === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
      this.class()
    )
  );

  readonly transform = computed(() => {
    const index = this.currentIndex();
    const orientation = this.orientation();
    return orientation === 'horizontal'
      ? `translateX(-${index * 100}%)`
      : `translateY(-${index * 100}%)`;
  });

  private readonly initializeSlidesEffect = effect(() => {
    const items = this.items();
    const count = items.length;
    if (count > 0) {
      this.carousel.initialize(count);
    }
  });
}

/**
 * Individual carousel item/slide.
 */
@Component({
  selector: 'app-carousel-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'group',
    'aria-roledescription': 'slide',
    '[attr.data-slot]': '"carousel-item"',
    '[class]': 'itemClass()',
  },
  template: `<ng-content />`,
})
export class CarouselItemComponent {
  private readonly service = inject(CarouselService);

  readonly class = input<string>('');

  protected readonly itemClass = computed(() =>
    cn(
      'min-w-0 shrink-0 grow-0 basis-full',
      this.service.orientation() === 'horizontal' ? 'pl-4' : 'pt-4',
      this.class()
    )
  );
}

/**
 * Previous button for the carousel.
 */
@Component({
  selector: 'app-carousel-previous',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  host: {
    '[attr.data-slot]': '"carousel-previous"',
  },
  template: `
    <button
      type="button"
      class="rounded-full absolute touch-manipulation inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 outline-none select-none focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-2 border border-transparent bg-clip-padding text-xs/relaxed font-medium"
      [class]="buttonClass()"
      [class.opacity-50]="!canScrollPrev()"
      [disabled]="!canScrollPrev()"
      (click)="scrollPrev()"
      aria-label="Previous slide"
    >
      <ng-content>
        <lucide-icon [img]="chevronLeftIcon" class="size-4"></lucide-icon>
      </ng-content>
      <span class="sr-only">Previous slide</span>
    </button>
  `,
})
export class CarouselPreviousComponent {
  private readonly service = inject(CarouselService);

  readonly chevronLeftIcon = ChevronLeft;
  readonly variant = input<'outline' | 'ghost'>('outline');
  readonly class = input<string>('');

  readonly canScrollPrev = this.service.canScrollPrev;
  readonly orientation = this.service.orientation;

  protected readonly buttonClass = computed(() =>
    cn(
      'h-8 w-8',
      this.orientation() === 'horizontal'
        ? 'top-1/2 -left-12 -translate-y-1/2'
        : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
      this.variant() === 'outline' && 'border-border dark:bg-input/30 hover:bg-input/50 hover:text-foreground',
      this.variant() === 'ghost' && 'hover:bg-muted hover:text-foreground dark:hover:bg-muted/50',
      this.class()
    )
  );

  scrollPrev(): void {
    this.service.scrollPrev();
  }
}

/**
 * Next button for the carousel.
 */
@Component({
  selector: 'app-carousel-next',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  host: {
    '[attr.data-slot]': '"carousel-next"',
  },
  template: `
    <button
      type="button"
      class="rounded-full absolute touch-manipulation inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 outline-none select-none focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-2 border border-transparent bg-clip-padding text-xs/relaxed font-medium"
      [class]="buttonClass()"
      [class.opacity-50]="!canScrollNext()"
      [disabled]="!canScrollNext()"
      (click)="scrollNext()"
      aria-label="Next slide"
    >
      <ng-content>
        <lucide-icon [img]="chevronRightIcon" class="size-4"></lucide-icon>
      </ng-content>
      <span class="sr-only">Next slide</span>
    </button>
  `,
})
export class CarouselNextComponent {
  private readonly service = inject(CarouselService);

  readonly chevronRightIcon = ChevronRight;
  readonly variant = input<'outline' | 'ghost'>('outline');
  readonly class = input<string>('');

  readonly canScrollNext = this.service.canScrollNext;
  readonly orientation = this.service.orientation;

  protected readonly buttonClass = computed(() =>
    cn(
      'h-8 w-8',
      this.orientation() === 'horizontal'
        ? 'top-1/2 -right-12 -translate-y-1/2'
        : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
      this.variant() === 'outline' && 'border-border dark:bg-input/30 hover:bg-input/50 hover:text-foreground',
      this.variant() === 'ghost' && 'hover:bg-muted hover:text-foreground dark:hover:bg-muted/50',
      this.class()
    )
  );

  scrollNext(): void {
    this.service.scrollNext();
  }
}

/**
 * Dot indicators for carousel navigation.
 */
@Component({
  selector: 'app-carousel-dots',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-slot]': '"carousel-dots"',
  },
  template: `
    <div class="flex items-center justify-center gap-2">
      @for (snap of scrollSnaps(); track snap; let i = $index) {
        <button
          type="button"
          class="h-2 w-2 rounded-full transition-all"
          [class.bg-primary]="currentIndex() === i"
          [class.bg-muted-foreground]="currentIndex() !== i"
          [class.opacity-50]="currentIndex() !== i"
          [attr.aria-label]="'Go to slide ' + (i + 1)"
          [attr.aria-current]="currentIndex() === i ? 'true' : null"
          (click)="scrollTo(i)"
        ></button>
      }
    </div>
  `,
})
export class CarouselDotsComponent {
  private readonly service = inject(CarouselService);

  readonly scrollSnaps = this.service.scrollSnaps;
  readonly currentIndex = this.service.currentIndex;

  scrollTo(index: number): void {
    this.service.scrollTo(index);
  }
}
