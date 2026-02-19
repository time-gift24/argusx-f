import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
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

export type ArgusxHoverCardSide = 'top' | 'right' | 'bottom' | 'left';
export type ArgusxHoverCardAlign = 'start' | 'center' | 'end';

// ============================================================================
// Argusx Hover Card Trigger Directive
// ============================================================================

/**
 * Argusx Hover Card Trigger Directive
 * Opens the hover card when mouse enters
 */
@Directive({
  selector: '[argusxHoverCardTrigger]',
  host: {
    '[attr.data-slot]': '"hover-card-trigger"',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': 'hoverCard.open()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
  },
})
export class ArgusxHoverCardTriggerDirective {
  readonly hoverCard = inject(ArgusxHoverCardComponent);
  readonly elementRef = inject(ElementRef<HTMLElement>);

  onMouseEnter(): void {
    this.hoverCard.handleTriggerEnter();
  }

  onMouseLeave(): void {
    this.hoverCard.handleTriggerLeave();
  }

  onFocus(): void {
    this.hoverCard.handleTriggerEnter();
  }

  onBlur(): void {
    this.hoverCard.handleTriggerLeave();
  }
}

// ============================================================================
// Argusx Hover Card Content Component
// ============================================================================

/**
 * Argusx Hover Card Content Component
 * The content that appears when hovering
 * Wrapper component that configures the content in the parent
 */
@Component({
  selector: 'argusx-hover-card-content',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"hover-card-content"',
    style: 'display: contents;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxHoverCardContentComponent {
  private readonly hoverCard = inject(ArgusxHoverCardComponent);

  readonly side = input<ArgusxHoverCardSide>('bottom');
  readonly sideOffset = input<number>(4);
  readonly align = input<ArgusxHoverCardAlign>('center');
  readonly alignOffset = input<number>(0);
  readonly class = input<string>('');

  constructor() {
    // Sync content config to parent hover card
    this.hoverCard.registerContentConfig({
      side: this.side(),
      sideOffset: this.sideOffset(),
      align: this.align(),
      alignOffset: this.alignOffset(),
      className: this.class(),
    });
  }
}

// ============================================================================
// Argusx Hover Card Root Component
// ============================================================================

let hoverCardIdCounter = 0;

/**
 * Argusx Hover Card Root Component
 * Uses Angular CDK Overlay for positioning
 * Shows content on hover with configurable delay
 */
@Component({
  selector: 'argusx-hover-card',
  imports: [
    CommonModule,
    OverlayModule,
  ],
  template: `
    <div class="inline-flex">
      <!-- Trigger element -->
      <div cdkOverlayOrigin #trigger="cdkOverlayOrigin">
        <ng-content select="[argusxHoverCardTrigger]" />
      </div>

      <!-- Hover card content via CDK Overlay -->
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="trigger"
        [cdkConnectedOverlayOpen]="open()"
        [cdkConnectedOverlayPositions]="positions()"
        (detach)="closeCard()"
        (overlayOutsideClick)="onOutsideClick($event)">
        <div
          [class]="contentClass()"
          role="dialog"
          [attr.data-state]="open() ? 'open' : 'closed'"
          [attr.data-side]="contentSide()"
          (mouseenter)="onContentEnter()"
          (mouseleave)="onContentLeave()"
          (keydown)="onKeydown($event)">
          <ng-content />
        </div>
      </ng-template>
    </div>
  `,
  host: {
    '[attr.data-slot]': '"hover-card"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxHoverCardComponent {
  readonly open = model<boolean>(false);

  readonly openDelay = input<number>(200);
  readonly closeDelay = input<number>(300);

  readonly id = `hover-card-${hoverCardIdCounter++}`;

  private openTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private closeTimeoutId: ReturnType<typeof setTimeout> | null = null;

  protected readonly contentSide = signal<ArgusxHoverCardSide>('bottom');
  private readonly contentSideOffset = signal<number>(4);
  private readonly contentAlign = signal<ArgusxHoverCardAlign>('center');
  private readonly contentAlignOffset = signal<number>(0);
  private readonly contentClassOverride = signal<string>('');

  protected readonly trigger = viewChild(CdkOverlayOrigin);

  protected readonly positions = computed<ConnectedPosition[]>(() => {
    const side = this.contentSide();
    const sideOffset = this.contentSideOffset();
    const align = this.contentAlign();
    const alignOffset = this.contentAlignOffset();

    const alignX = align === 'start' ? 'start' : align === 'end' ? 'end' : 'center';

    const basePosition: ConnectedPosition = {
      originX: alignX,
      originY: side === 'top' ? 'top' : side === 'bottom' ? 'bottom' : 'center',
      overlayX: alignX,
      overlayY: side === 'top' ? 'bottom' : side === 'bottom' ? 'top' : 'center',
      offsetX: side === 'left' ? -sideOffset : side === 'right' ? sideOffset : alignOffset,
      offsetY: side === 'top' ? -sideOffset : side === 'bottom' ? sideOffset : 0,
    };

    // Fallback position (opposite side)
    const fallbackPosition: ConnectedPosition = {
      originX: alignX,
      originY: side === 'top' ? 'bottom' : side === 'bottom' ? 'top' : 'center',
      overlayX: alignX,
      overlayY: side === 'top' ? 'top' : side === 'bottom' ? 'bottom' : 'center',
      offsetX: side === 'left' ? sideOffset : side === 'right' ? -sideOffset : alignOffset,
      offsetY: side === 'top' ? sideOffset : side === 'bottom' ? -sideOffset : 0,
    };

    return [basePosition, fallbackPosition];
  });

  protected readonly contentClass = computed(() =>
    cn(
      'bg-popover text-popover-foreground ring-foreground/10 z-50 w-64 rounded-lg p-4 shadow-md ring-1 outline-hidden',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      'origin-(--radix-hover-card-content-transform-origin)',
      this.contentClassOverride()
    )
  );

  handleTriggerEnter(): void {
    this.clearCloseTimeout();
    this.scheduleOpen();
  }

  handleTriggerLeave(): void {
    this.clearOpenTimeout();
    this.scheduleClose();
  }

  protected onContentEnter(): void {
    this.clearCloseTimeout();
  }

  protected onContentLeave(): void {
    this.scheduleClose();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeCard();
    }
  }

  protected onOutsideClick(event: MouseEvent): void {
    const triggerEl = this.trigger()?.elementRef?.nativeElement;
    if (triggerEl && !triggerEl.contains(event.target as Node)) {
      this.scheduleClose();
    }
  }

  openCard(): void {
    this.clearAllTimeouts();
    this.open.set(true);
  }

  closeCard(): void {
    this.clearAllTimeouts();
    this.open.set(false);
  }

  registerContentConfig(config: {
    side?: ArgusxHoverCardSide;
    sideOffset?: number;
    align?: ArgusxHoverCardAlign;
    alignOffset?: number;
    className?: string;
  }): void {
    if (config.side !== undefined) this.contentSide.set(config.side);
    if (config.sideOffset !== undefined) this.contentSideOffset.set(config.sideOffset);
    if (config.align !== undefined) this.contentAlign.set(config.align);
    if (config.alignOffset !== undefined) this.contentAlignOffset.set(config.alignOffset);
    if (config.className !== undefined) this.contentClassOverride.set(config.className);
  }

  private scheduleOpen(): void {
    this.clearOpenTimeout();
    this.openTimeoutId = setTimeout(() => {
      this.open.set(true);
      this.openTimeoutId = null;
    }, this.openDelay());
  }

  private scheduleClose(): void {
    this.clearCloseTimeout();
    this.closeTimeoutId = setTimeout(() => {
      this.open.set(false);
      this.closeTimeoutId = null;
    }, this.closeDelay());
  }

  private clearOpenTimeout(): void {
    if (this.openTimeoutId !== null) {
      clearTimeout(this.openTimeoutId);
      this.openTimeoutId = null;
    }
  }

  private clearCloseTimeout(): void {
    if (this.closeTimeoutId !== null) {
      clearTimeout(this.closeTimeoutId);
      this.closeTimeoutId = null;
    }
  }

  private clearAllTimeouts(): void {
    this.clearOpenTimeout();
    this.clearCloseTimeout();
  }
}

// ============================================================================
// Exports
// ============================================================================

export const ArgusxHoverCardComponents = [
  ArgusxHoverCardComponent,
  ArgusxHoverCardTriggerDirective,
  ArgusxHoverCardContentComponent,
];
