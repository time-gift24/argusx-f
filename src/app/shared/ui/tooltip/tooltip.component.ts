import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  inject,
  input,
  model,
  viewChild,
  OnDestroy,
} from '@angular/core';
import { TooltipService } from './tooltip.service';
import { CommonModule } from '@angular/common';
import {
  CdkOverlayOrigin,
  OverlayModule,
  ConnectedPosition,
} from '@angular/cdk/overlay';
import { cn } from '../../utils/cn';

// ============================================================================
// Types
// ============================================================================

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
export type TooltipAlign = 'start' | 'center' | 'end';

// ============================================================================
// Tooltip Root
// ============================================================================

let tooltipIdCounter = 0;

/**
 * Tooltip Root Component
 * Uses Angular CDK Overlay for positioning
 *
 * @example
 * ```html
 * <app-tooltip>
 *   <button appTooltipTrigger>Hover me</button>
 *   <app-tooltip-content>This is a tooltip</app-tooltip-content>
 * </app-tooltip>
 * ```
 */
@Component({
  selector: 'app-tooltip',
  imports: [CommonModule, OverlayModule],
  template: `
    <div class="inline-flex">
      <!-- Trigger element -->
      <div cdkOverlayOrigin #trigger="cdkOverlayOrigin">
        <ng-content select="[appTooltipTrigger]" />
      </div>

      <!-- Tooltip content via CDK Overlay -->
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="trigger"
        [cdkConnectedOverlayOpen]="open()"
        [cdkConnectedOverlayHasBackdrop]="false"
        [cdkConnectedOverlayPanelClass]="'tooltip-panel'"
        [cdkConnectedOverlayFlexibleDimensions]="true"
        [cdkConnectedOverlayGrowAfterOpen]="true"
        [cdkConnectedOverlayPositions]="positions()"
        (mouseenter)="onMouseEnter()"
        (mouseleave)="onMouseLeave()"
        (detach)="onDetach()">
        <ng-content />
      </ng-template>
    </div>
  `,
  host: {
    '[attr.data-slot]': '"tooltip"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent implements OnDestroy {
  readonly tooltipService = inject(TooltipService);

  readonly open = model<boolean>(false);

  readonly side = input<TooltipSide>('top');
  readonly sideOffset = input<number>(0);

  readonly id = `tooltip-${tooltipIdCounter++}`;

  private hideTimeout: ReturnType<typeof setTimeout> | null = null;
  private showTimeout: ReturnType<typeof setTimeout> | null = null;

  protected readonly trigger = viewChild(CdkOverlayOrigin);

  ngOnDestroy(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
  }

  protected readonly positions = computed<ConnectedPosition[]>(() => {
    const side = this.side();
    const offset = this.sideOffset();

    const positionMap: Record<TooltipSide, ConnectedPosition> = {
      top: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -offset },
      bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: offset },
      left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -offset },
      right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: offset },
    };

    return [positionMap[side]];
  });

  onMouseEnter(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    const delay = this.tooltipService.delayDuration();
    this.showTimeout = setTimeout(() => {
      this.open.set(true);
    }, delay);
  }

  onMouseLeave(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    this.hideTimeout = setTimeout(() => {
      this.open.set(false);
    }, 100);
  }

  protected onDetach(): void {
    this.open.set(false);
  }
}

// ============================================================================
// Tooltip Trigger
// ============================================================================

/**
 * Tooltip Trigger Directive
 * Shows tooltip on hover/focus
 */
@Directive({
  selector: '[appTooltipTrigger]',
  host: {
    '[attr.data-slot]': '"tooltip-trigger"',
    '[attr.data-state]': 'tooltip.open() ? "open" : "closed"',
    '[attr.aria-describedby]': 'tooltip.open() ? tooltip.id : null',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
  },
})
export class TooltipTriggerDirective {
  readonly tooltip = inject(TooltipComponent);

  protected onMouseEnter(): void {
    this.tooltip.onMouseEnter();
  }

  protected onMouseLeave(): void {
    this.tooltip.onMouseLeave();
  }

  protected onFocus(): void {
    this.tooltip.onMouseEnter();
  }

  protected onBlur(): void {
    this.tooltip.onMouseLeave();
  }
}

// ============================================================================
// Tooltip Content
// ============================================================================

/**
 * Tooltip Content Component
 * The tooltip panel with arrow
 */
@Component({
  selector: 'app-tooltip-content',
  imports: [CommonModule],
  template: `
    <div [class]="computedWrapperClass()">
      <ng-content />
      <div [class]="arrowClass()"></div>
    </div>
  `,
  host: {
    '[attr.data-slot]': '"tooltip-content"',
    '[attr.data-state]': 'tooltip.open() ? "open" : "closed"',
    '[attr.data-side]': 'tooltip.side()',
    '[attr.role]': '"tooltip"',
    '[attr.id]': 'tooltip.id',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipContentComponent {
  readonly tooltip = inject(TooltipComponent);
  readonly class = input<string>('');

  protected readonly computedWrapperClass = computed(() =>
    cn(
      'z-50 max-w-xs px-3 py-1.5 text-xs rounded-md bg-foreground text-background',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      this.class()
    )
  );

  protected readonly arrowClass = computed(() =>
    cn(
      'size-2.5 rotate-45 rounded-[2px] bg-foreground fill-foreground',
      'z-50',
      this.tooltip.side() === 'top' && 'translate-y-[calc(-50%_-_2px)] -translate-x-1/2 left-1/2 -bottom-1',
      this.tooltip.side() === 'bottom' && 'translate-y-[50%] -translate-x-1/2 left-1/2 -top-1',
      this.tooltip.side() === 'left' && 'translate-x-[calc(-50%_-_2px)] -right-1 top-1/2 -translate-y-1/2',
      this.tooltip.side() === 'right' && 'translate-x-[50%] -left-1 top-1/2 -translate-y-1/2'
    )
  );
}

// ============================================================================
// Tooltip Provider
// ============================================================================

/**
 * Tooltip Provider Component
 * Wrapper to configure tooltip delay duration globally
 */
@Component({
  selector: 'app-tooltip-provider',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"tooltip-provider"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipProviderComponent {
  readonly tooltipService = inject(TooltipService);
  readonly delayDuration = input<number>(0);

  constructor() {
    effect(() => {
      this.tooltipService.setDelayDuration(this.delayDuration());
    });
  }
}

// ============================================================================
// Exports
// ============================================================================

export const TooltipComponents = [
  TooltipComponent,
  TooltipTriggerDirective,
  TooltipContentComponent,
  TooltipProviderComponent,
];

export { TooltipService } from './tooltip.service';
