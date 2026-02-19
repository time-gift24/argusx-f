import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  Directive,
  ElementRef,
  inject,
  input,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkOverlayOrigin,
  ConnectedPosition,
  OverlayModule,
} from '@angular/cdk/overlay';
import { cn } from '../../utils/cn';

// ============================================================================
// Types
// ============================================================================

export type ArgusxPopoverAlign = 'start' | 'center' | 'end';
export type ArgusxPopoverSide = 'top' | 'right' | 'bottom' | 'left';
export type ArgusxPopoverVariant = 'plain' | 'glass';

// ============================================================================
// Trigger
// ============================================================================

@Directive({
  selector: '[argusxPopoverTrigger]',
  host: {
    '[attr.data-slot]': '"popover-trigger"',
    '[attr.aria-expanded]': 'popover.open()',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-controls]': 'popover.open() ? popover.id : null',
    '(click)': 'onClick()',
    '(keydown.escape)': 'onEscape()',
  },
})
export class ArgusxPopoverTriggerDirective {
  readonly popover = inject(ArgusxPopoverComponent);
  readonly elementRef = inject(ElementRef<HTMLElement>);

  onClick(): void {
    if (this.elementRef.nativeElement.hasAttribute('disabled')) {
      return;
    }

    this.popover.togglePopover();
  }

  onEscape(): void {
    this.popover.closePopover();
  }
}

// ============================================================================
// Anchor
// ============================================================================

@Directive({
  selector: '[argusxPopoverAnchor]',
  hostDirectives: [CdkOverlayOrigin],
  host: {
    '[attr.data-slot]': '"popover-anchor"',
  },
})
export class ArgusxPopoverAnchorDirective {
  readonly elementRef = inject(ElementRef<HTMLElement>);
  readonly overlayOrigin = inject(CdkOverlayOrigin);
}

// ============================================================================
// Content
// ============================================================================

@Component({
  selector: 'argusx-popover-content',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"popover-content"',
    '[attr.id]': 'popover.id',
    '[attr.data-state]': 'popover.open() ? "open" : "closed"',
    '[attr.data-side]': 'side()',
    '[attr.data-align]': 'align()',
    '[attr.data-variant]': 'variant()',
    '[attr.role]': '"dialog"',
    '[attr.tabindex]': '-1',
    '(keydown.escape)': 'popover.closePopover()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxPopoverContentComponent {
  readonly popover = inject(ArgusxPopoverComponent);

  readonly align = input<ArgusxPopoverAlign>('center');
  readonly side = input<ArgusxPopoverSide>('bottom');
  readonly sideOffset = input<number>(4);
  readonly alignOffset = input<number>(0);
  readonly variant = input<ArgusxPopoverVariant>('plain');
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md p-4 outline-hidden',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      this.variant() === 'glass'
        ? 'border border-white/15 bg-black/40 text-white shadow-lg backdrop-blur-md'
        : 'border bg-popover text-popover-foreground shadow-md',
      this.class()
    )
  );
}

// ============================================================================
// Header
// ============================================================================

@Component({
  selector: 'argusx-popover-header',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"popover-header"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxPopoverHeaderComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('flex flex-col gap-1 text-sm', this.class())
  );
}

// ============================================================================
// Title
// ============================================================================

@Component({
  selector: 'argusx-popover-title',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"popover-title"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxPopoverTitleComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('font-medium', this.class())
  );
}

// ============================================================================
// Description
// ============================================================================

@Component({
  selector: 'argusx-popover-description',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"popover-description"',
    '[class]': 'computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxPopoverDescriptionComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('text-muted-foreground', this.class())
  );
}

// ============================================================================
// Root
// ============================================================================

let argusxPopoverIdCounter = 0;

@Component({
  selector: 'argusx-popover',
  imports: [CommonModule, OverlayModule],
  template: `
    <div class="inline-flex">
      <div cdkOverlayOrigin #triggerOrigin="cdkOverlayOrigin">
        <ng-content select="[argusxPopoverTrigger]" />
      </div>
      <ng-content select="[argusxPopoverAnchor]" />

      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="anchor()?.overlayOrigin ?? triggerOrigin"
        [cdkConnectedOverlayOpen]="open()"
        [cdkConnectedOverlayHasBackdrop]="false"
        [cdkConnectedOverlayFlexibleDimensions]="true"
        [cdkConnectedOverlayGrowAfterOpen]="true"
        [cdkConnectedOverlayPositions]="positions()"
        (overlayOutsideClick)="onOutsideClick($event)"
        (detach)="onDetach()">
        <ng-content select="argusx-popover-content" />
      </ng-template>
    </div>
  `,
  host: {
    '[attr.data-slot]': '"popover"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxPopoverComponent {
  readonly open = model<boolean>(false);
  readonly id = `argusx-popover-${argusxPopoverIdCounter++}`;

  protected readonly trigger = contentChild(ArgusxPopoverTriggerDirective);
  protected readonly anchor = contentChild(ArgusxPopoverAnchorDirective);
  protected readonly content = contentChild(ArgusxPopoverContentComponent);

  protected readonly positions = computed<ConnectedPosition[]>(() => {
    const content = this.content();
    const side = content?.side() ?? 'bottom';
    const align = content?.align() ?? 'center';
    const sideOffset = content?.sideOffset() ?? 4;
    const alignOffset = content?.alignOffset() ?? 0;

    const horizontalAlign: ConnectedPosition['originX'] =
      align === 'center' ? 'center' : align === 'start' ? 'start' : 'end';
    const verticalAlign: ConnectedPosition['originY'] =
      align === 'center' ? 'center' : align === 'start' ? 'top' : 'bottom';

    const primaryMap: Record<ArgusxPopoverSide, ConnectedPosition> = {
      top: {
        originX: horizontalAlign,
        originY: 'top',
        overlayX: horizontalAlign,
        overlayY: 'bottom',
        offsetX: alignOffset,
        offsetY: -sideOffset,
      },
      bottom: {
        originX: horizontalAlign,
        originY: 'bottom',
        overlayX: horizontalAlign,
        overlayY: 'top',
        offsetX: alignOffset,
        offsetY: sideOffset,
      },
      left: {
        originX: 'start',
        originY: verticalAlign,
        overlayX: 'end',
        overlayY: verticalAlign,
        offsetX: -sideOffset,
        offsetY: alignOffset,
      },
      right: {
        originX: 'end',
        originY: verticalAlign,
        overlayX: 'start',
        overlayY: verticalAlign,
        offsetX: sideOffset,
        offsetY: alignOffset,
      },
    };

    const fallbackMap: Record<ArgusxPopoverSide, ConnectedPosition> = {
      top: {
        originX: horizontalAlign,
        originY: 'bottom',
        overlayX: horizontalAlign,
        overlayY: 'top',
        offsetX: alignOffset,
        offsetY: sideOffset,
      },
      bottom: {
        originX: horizontalAlign,
        originY: 'top',
        overlayX: horizontalAlign,
        overlayY: 'bottom',
        offsetX: alignOffset,
        offsetY: -sideOffset,
      },
      left: {
        originX: 'end',
        originY: verticalAlign,
        overlayX: 'start',
        overlayY: verticalAlign,
        offsetX: sideOffset,
        offsetY: alignOffset,
      },
      right: {
        originX: 'start',
        originY: verticalAlign,
        overlayX: 'end',
        overlayY: verticalAlign,
        offsetX: -sideOffset,
        offsetY: alignOffset,
      },
    };

    return [primaryMap[side], fallbackMap[side]];
  });

  openPopover(): void {
    this.open.set(true);
  }

  closePopover(): void {
    this.open.set(false);
  }

  togglePopover(): void {
    this.open.update(isOpen => !isOpen);
  }

  protected onDetach(): void {
    this.open.set(false);
  }

  protected onOutsideClick(event: MouseEvent): void {
    const target = event.target as Node | null;
    if (!target) {
      return;
    }

    const triggerElement = this.trigger()?.elementRef.nativeElement;
    if (triggerElement?.contains(target)) {
      return;
    }

    const anchorElement = this.anchor()?.elementRef.nativeElement;
    if (anchorElement?.contains(target)) {
      return;
    }

    this.closePopover();
  }
}

// ============================================================================
// Exports
// ============================================================================

export const ArgusxPopoverComponents = [
  ArgusxPopoverComponent,
  ArgusxPopoverTriggerDirective,
  ArgusxPopoverAnchorDirective,
  ArgusxPopoverContentComponent,
  ArgusxPopoverHeaderComponent,
  ArgusxPopoverTitleComponent,
  ArgusxPopoverDescriptionComponent,
];
