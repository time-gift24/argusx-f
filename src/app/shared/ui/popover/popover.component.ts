import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  inject,
  input,
  model,
  output,
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

export type PopoverAlign = 'start' | 'center' | 'end';
export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';

// ============================================================================
// Popover Root
// ============================================================================

let popoverIdCounter = 0;

/**
 * Popover Root Component
 * Uses Angular CDK Overlay for positioning
 *
 * @example
 * ```html
 * <app-popover [open]="open()" (openChange)="open.set($event)">
 *   <button appPopoverTrigger>Open</button>
 *   <app-popover-content>
 *     <app-popover-header>
 *       <app-popover-title>Title</app-popover-title>
 *       <app-popover-description>Description</app-popover-description>
 *     </app-popover-header>
 *   </app-popover-content>
 * </app-popover>
 * ```
 */
@Component({
  selector: 'app-popover',
  imports: [CommonModule, OverlayModule],
  template: `
    <div class="inline-flex">
      <!-- Trigger element -->
      <div cdkOverlayOrigin #trigger="cdkOverlayOrigin">
        <ng-content select="[appPopoverTrigger]" />
      </div>

      <!-- Popover content via CDK Overlay -->
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="trigger"
        [cdkConnectedOverlayOpen]="open()"
        [cdkConnectedOverlayHasBackdrop]="false"
        [cdkConnectedOverlayPanelClass]="'popover-panel'"
        [cdkConnectedOverlayFlexibleDimensions]="true"
        [cdkConnectedOverlayGrowAfterOpen]="true"
        [cdkConnectedOverlayPositions]="positions()"
        (detach)="onDetach()">
        <ng-content />
      </ng-template>
    </div>
  `,
  host: {
    '[attr.data-slot]': '"popover"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverComponent {
  readonly open = model<boolean>(false);

  readonly align = input<PopoverAlign>('center');
  readonly side = input<PopoverSide>('bottom');
  readonly sideOffset = input<number>(4);

  readonly openChange = output<boolean>();

  readonly id = `popover-${popoverIdCounter++}`;

  protected readonly trigger = viewChild(CdkOverlayOrigin);

  protected readonly positions = computed<ConnectedPosition[]>(() => {
    const side = this.side();
    const align = this.align();
    const offset = this.sideOffset();

    const positionMap: Record<PopoverSide, ConnectedPosition> = {
      top: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -offset },
      bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: offset },
      left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -offset },
      right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: offset },
    };

    const primary = positionMap[side];

    // Adjust for alignment
    if (align === 'start') {
      return [primary];
    } else if (align === 'end') {
      return [primary];
    }

    return [primary];
  });

  openPopover(): void {
    if (this.open()) return;
    this.open.set(true);
    this.openChange.emit(true);
  }

  closePopover(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.openChange.emit(false);
  }

  togglePopover(): void {
    if (this.open()) {
      this.closePopover();
    } else {
      this.openPopover();
    }
  }

  protected onDetach(): void {
    this.open.set(false);
    this.openChange.emit(false);
  }
}

// ============================================================================
// Popover Trigger
// ============================================================================

/**
 * Popover Trigger Directive
 * Opens the popover when clicked
 */
@Directive({
  selector: '[appPopoverTrigger]',
  host: {
    '[attr.data-slot]': '"popover-trigger"',
    '[attr.aria-expanded]': 'popover.open()',
    '[attr.aria-haspopup]': '"dialog"',
    '(click)': 'onClick()',
  },
})
export class PopoverTriggerDirective {
  readonly popover = inject(PopoverComponent);

  onClick(): void {
    this.popover.togglePopover();
  }
}

// ============================================================================
// Popover Anchor
// ============================================================================

/**
 * Popover Anchor Directive
 * Anchors the popover to a specific element
 */
@Directive({
  selector: '[appPopoverAnchor]',
  host: {
    '[attr.data-slot]': '"popover-anchor"',
  },
})
export class PopoverAnchorDirective {
  readonly popover = inject(PopoverComponent);
}

// ============================================================================
// Popover Content
// ============================================================================

/**
 * Popover Content Component
 * The main popover panel
 */
@Component({
  selector: 'app-popover-content',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"popover-content"',
    '[attr.data-state]': 'popover.open() ? "open" : "closed"',
    '[class]': 'computedClass()',
  },
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 0.625rem;
      border-radius: 0.5rem;
      background: var(--popover-background);
      color: var(--popover-foreground);
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      z-index: 50;
      width: 18rem;
      outline: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverContentComponent {
  readonly popover = inject(PopoverComponent);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'bg-popover text-popover-foreground',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'ring-foreground/10 ring-1',
      'duration-100',
      this.class()
    )
  );
}

// ============================================================================
// Popover Header
// ============================================================================

/**
 * Popover Header Component
 * Container for title and description
 */
@Component({
  selector: 'app-popover-header',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"popover-header"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverHeaderComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('flex flex-col gap-1 text-xs', this.class())
  );
}

// ============================================================================
// Popover Title
// ============================================================================

/**
 * Popover Title Component
 * Title text for the popover
 */
@Component({
  selector: 'app-popover-title',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"popover-title"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverTitleComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('text-sm font-medium', this.class())
  );
}

// ============================================================================
// Popover Description
// ============================================================================

/**
 * Popover Description Component
 * Description text for the popover
 */
@Component({
  selector: 'app-popover-description',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"popover-description"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverDescriptionComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('text-muted-foreground', this.class())
  );
}

// ============================================================================
// Exports
// ============================================================================

export const PopoverComponents = [
  PopoverComponent,
  PopoverTriggerDirective,
  PopoverAnchorDirective,
  PopoverContentComponent,
  PopoverHeaderComponent,
  PopoverTitleComponent,
  PopoverDescriptionComponent,
];
