import { Overlay, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  type ComponentRef,
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  numberAttribute,
  output,
  PLATFORM_ID,
  Renderer2,
  runInInjectionContext,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { filter, map, of, Subject, switchMap, tap, timer } from 'rxjs';

import { cn } from '../../utils/cn';

// ============================================================================
// Types
// ============================================================================

export type ArgusxTooltipPosition = 'top' | 'right' | 'bottom' | 'left';
export type ArgusxTooltipTrigger = 'hover' | 'click';
export type ArgusxTooltipType = string | TemplateRef<void> | null;

interface DelayConfig {
  isShow: boolean;
  delay: number;
}

// ============================================================================
// Tooltip Directive
// ============================================================================

const TOOLTIP_POSITIONS_MAP: Record<ArgusxTooltipPosition, import('@angular/cdk/overlay').ConnectedPosition> = {
  top: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -4 },
  bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 4 },
  left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -4 },
  right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 4 },
};

const throttle = (callback: () => void, wait: number) => {
  let time = Date.now();
  return function () {
    if (time + wait - Date.now() < 0) {
      callback();
      time = Date.now();
    }
  };
};

/**
 * Tooltip Directive
 * Shows tooltip on hover or click
 *
 * @example
 * ```html
 * <button [argusxTooltip]="'Tooltip content'" argusxTooltipPosition="top">Hover me</button>
 * ```
 *
 * @example
 * ```html
 * <button [argusxTooltip]="tooltipTemplate" [argusxTooltipTrigger]="'click'">Click me</button>
 * <ng-template #tooltipTemplate>Custom content</ng-template>
 * ```
 */
@Directive({
  selector: '[argusxTooltip]',
  standalone: true,
})
export class ArgusxTooltipDirective {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer = inject(Renderer2);

  private delaySubject?: Subject<DelayConfig>;
  private componentRef?: ComponentRef<ArgusxTooltipContentComponent>;
  private listenersRefs: (() => void)[] = [];
  private overlayRef?: OverlayRef;
  private ariaEffectRef?: ReturnType<typeof effect>;

  /**
   * Tooltip position relative to trigger element
   */
  readonly argusxTooltipPosition = input<ArgusxTooltipPosition>('top');

  /**
   * Trigger type: 'hover' or 'click'
   */
  readonly argusxTooltipTrigger = input<ArgusxTooltipTrigger>('hover');

  /**
   * Tooltip content - string or TemplateRef
   */
  readonly argusxTooltip = input<ArgusxTooltipType>(null);

  /**
   * Show delay in milliseconds
   */
  readonly argusxShowDelay = input(150, { transform: numberAttribute });

  /**
   * Hide delay in milliseconds
   */
  readonly argusxHideDelay = input(100, { transform: numberAttribute });

  /**
   * Optional controlled open state
   * Use argusxTooltipOpen as the input name for ArgusX consistency
   */
  readonly argusxTooltipOpen = input<boolean | undefined>(undefined);

  /**
   * Emitted when tooltip is shown
   */
  readonly show = output<void>();

  /**
   * Emitted when tooltip is hidden
   */
  readonly hide = output<void>();

  private readonly tooltipText = computed(() => {
    const tooltipText = this.argusxTooltip();
    if (!tooltipText) {
      return '';
    } else if (typeof tooltipText === 'string') {
      return tooltipText.trim();
    }
    return tooltipText;
  });

  private readonly isControlled = computed(() => this.argusxTooltipOpen() !== undefined);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const positionStrategy = this.overlayPositionBuilder
        .flexibleConnectedTo(this.elementRef)
        .withPositions([TOOLTIP_POSITIONS_MAP[this.argusxTooltipPosition()]]);
      this.overlayRef = this.overlay.create({ positionStrategy });

      runInInjectionContext(this.injector, () => {
        toObservable(this.argusxTooltipTrigger)
          .pipe(
            tap(() => {
              this.setupDelayMechanism();
              this.cleanupTriggerEvents();
              this.initTriggers();
            }),
            filter(() => !!this.overlayRef),
            switchMap(() => (this.overlayRef as OverlayRef).outsidePointerEvents()),
            filter(event => !this.elementRef.nativeElement.contains(event.target)),
            takeUntilDestroyed(this.destroyRef),
          )
          .subscribe(() => this.delay(false, 0));
      });
    }
  }

  ngOnDestroy(): void {
    if (this.ariaEffectRef) {
      this.ariaEffectRef.destroy();
      this.ariaEffectRef = undefined;
    }

    this.delaySubject?.complete();
    this.cleanupTriggerEvents();
    this.overlayRef?.dispose();
  }

  private initTriggers(): void {
    this.initScrollListener();
    this.initClickListeners();
    this.initHoverListeners();
  }

  private initClickListeners(): void {
    if (this.argusxTooltipTrigger() !== 'click') {
      return;
    }

    this.listenersRefs = [
      ...this.listenersRefs,
      this.renderer.listen(this.elementRef.nativeElement, 'click', () => {
        if (this.isControlled()) {
          // In controlled mode, toggle based on open input
          const shouldShow = !this.argusxTooltipOpen();
          this.handleOpenChange(shouldShow);
        } else {
          // In uncontrolled mode, toggle based on attached state
          const shouldShowTooltip = !this.overlayRef?.hasAttached();
          const delay = shouldShowTooltip ? this.argusxShowDelay() : this.argusxHideDelay();
          this.delay(shouldShowTooltip, delay);
        }
      }),
    ];
  }

  private initHoverListeners(): void {
    if (this.argusxTooltipTrigger() !== 'hover') {
      return;
    }

    this.listenersRefs = [
      ...this.listenersRefs,
      this.renderer.listen(this.elementRef.nativeElement, 'mouseenter', () => {
        if (!this.isControlled()) {
          this.delay(true, this.argusxShowDelay());
        }
      }),
      this.renderer.listen(this.elementRef.nativeElement, 'mouseleave', () => {
        if (!this.isControlled()) {
          this.delay(false, this.argusxHideDelay());
        }
      }),
      this.renderer.listen(this.elementRef.nativeElement, 'focus', () => {
        if (!this.isControlled()) {
          this.delay(true, this.argusxShowDelay());
        }
      }),
      this.renderer.listen(this.elementRef.nativeElement, 'blur', () => {
        if (!this.isControlled()) {
          this.delay(false, this.argusxHideDelay());
        }
      }),
    ];
  }

  private initScrollListener(): void {
    this.listenersRefs = [
      ...this.listenersRefs,
      this.renderer.listen(
        this.document.defaultView,
        'scroll',
        throttle(() => {
          if (!this.isControlled()) {
            this.delay(false, 0);
          }
        }, 100),
      ),
    ];
  }

  private cleanupTriggerEvents(): void {
    for (const eventRef of this.listenersRefs) {
      eventRef();
    }
    this.listenersRefs = [];
  }

  private delay(isShow: boolean, delay = -1): void {
    this.delaySubject?.next({ isShow, delay });
  }

  private setupDelayMechanism(): void {
    this.delaySubject?.complete();
    this.delaySubject = new Subject<DelayConfig>();

    this.delaySubject
      .pipe(
        switchMap(config => (config.delay < 0 ? of(config) : timer(config.delay).pipe(map(() => config)))),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(config => {
        if (config.isShow) {
          this.showTooltip();
        } else {
          this.hideTooltip();
        }
      });
  }

  private handleOpenChange(shouldShow: boolean): void {
    if (shouldShow) {
      this.showTooltip();
    } else {
      this.hideTooltip();
    }
  }

  private showTooltip() {
    // Check controlled mode
    if (this.isControlled() && !this.argusxTooltipOpen()) {
      return;
    }

    if (this.componentRef || !this.argusxTooltip()) {
      return;
    }

    const tooltipPortal = new ComponentPortal(ArgusxTooltipContentComponent);
    this.componentRef = this.overlayRef?.attach(tooltipPortal);
    this.componentRef?.onDestroy(() => {
      this.componentRef = undefined;
    });
    this.componentRef?.instance.state.set('opened');
    this.componentRef?.instance.setProps(this.argusxTooltip(), this.argusxTooltipPosition());

    runInInjectionContext(this.injector, () => {
      this.ariaEffectRef = effect(() => {
        const tooltipId = this.componentRef?.instance.getUniqueId();
        if (tooltipId) {
          this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-describedby', tooltipId);
          this.ariaEffectRef?.destroy();
          this.ariaEffectRef = undefined;
        }
      });
    });

    this.show.emit();
  }

  private hideTooltip() {
    if (!this.componentRef) {
      return;
    }

    if (this.ariaEffectRef) {
      this.ariaEffectRef.destroy();
      this.ariaEffectRef = undefined;
    }

    this.renderer.removeAttribute(this.elementRef.nativeElement, 'aria-describedby');
    this.componentRef.instance.state.set('closed');
    this.hide.emit();
    this.overlayRef?.detach();
  }
}

// ============================================================================
// Tooltip Content Component
// ============================================================================

/**
 * Tooltip Content Component
 * The tooltip panel with arrow
 */
@Component({
  selector: 'argusx-tooltip-content',
  imports: [CommonModule],
  standalone: true,
  template: `
    <div [class]="wrapperClasses()">
      @if (tooltipContent(); as content) {
        @if (isTemplateRef(content); as tpl) {
          <ng-container *ngTemplateOutlet="$any(content)"></ng-container>
        } @else {
          {{ content }}
        }
      }
      <span [class]="arrowClasses()"></span>
    </div>
  `,
  host: {
    '[attr.data-slot]': '"tooltip-content"',
    '[attr.data-side]': 'position()',
    '[attr.data-state]': 'state()',
    '[attr.role]': '"tooltip"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxTooltipContentComponent {
  readonly tooltipContent = signal<ArgusxTooltipType>(null);
  readonly position = signal<ArgusxTooltipPosition>('top');
  readonly state = signal<'closed' | 'opened'>('closed');

  readonly class = input<string>('');

  readonly uniqueId = signal<string>('tooltip');

  private static idCounter = 0;
  private readonly id = `argusx-tooltip-${ArgusxTooltipContentComponent.idCounter++}`;

  constructor() {
    this.uniqueId.set(this.id);
  }

  getUniqueId(): string {
    return this.uniqueId();
  }

  setProps(content: ArgusxTooltipType, newPosition: ArgusxTooltipPosition): void {
    if (content) {
      this.tooltipContent.set(content);
    }
    this.position.set(newPosition);
  }

  protected isTemplateRef(content: ArgusxTooltipType): content is TemplateRef<void> {
    return content instanceof TemplateRef;
  }

  protected readonly wrapperClasses = computed(() =>
    cn(
      // Base styles - Plain style
      'z-50 max-w-xs px-3 py-1.5 text-xs rounded-md bg-foreground text-background',
      // Animation
      'animate-in fade-in-0 zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      // Position animations
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      this.class()
    )
  );

  protected readonly arrowClasses = computed(() => {
    const pos = this.position();
    return cn(
      'size-2.5 rotate-45 rounded-[2px] bg-foreground z-50',
      'absolute',
      pos === 'top' && 'bottom-0 translate-y-[calc(50%_-_2px)] left-1/2 -translate-x-1/2',
      pos === 'bottom' && 'top-0 -translate-y-[calc(50%_-_2px)] left-1/2 -translate-x-1/2',
      pos === 'left' && 'right-0 translate-x-[calc(50%_-_2px)] top-1/2 -translate-y-1/2',
      pos === 'right' && 'left-0 -translate-x-[calc(50%_-_2px)] top-1/2 -translate-y-1/2'
    );
  });
}

// ============================================================================
// Exports
// ============================================================================

export const ArgusxTooltipComponents = [
  ArgusxTooltipDirective,
  ArgusxTooltipContentComponent,
];
