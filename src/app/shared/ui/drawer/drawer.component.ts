import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule, CdkOverlayOrigin } from '@angular/cdk/overlay';
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
  OnInit,
  OnDestroy,
  ElementRef,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../utils/cn';
import { cva } from 'class-variance-authority';
import { buttonVariants } from '../button';
import { LucideAngularModule, XIcon } from 'lucide-angular';

// ============================================================================
// Types
// ============================================================================

export type DrawerDirection = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'default' | 'sm' | 'lg' | 'xl' | 'full';

// ============================================================================
// Drawer Root Component
// ============================================================================

let drawerIdCounter = 0;

/**
 * Drawer Root Component
 * Uses Angular CDK Overlay for slide-out panel presentation
 *
 * A11y Features:
 * - role="dialog" + aria-modal="true"
 * - aria-labelledby pointing to title
 * - aria-describedby pointing to description
 * - Focus trap
 * - Escape key closes drawer
 * - Click outside closes drawer (optional)
 * - Swipe to close gesture support
 */
@Component({
  selector: 'app-drawer',
  imports: [
    CommonModule,
    OverlayModule,
    A11yModule,
  ],
  template: `
    <div class="inline-flex">
      <!-- Trigger element -->
      <div cdkOverlayOrigin #trigger="cdkOverlayOrigin">
        <ng-content select="[appDrawerTrigger]" />
      </div>

      <!-- Drawer overlay and content via CDK Overlay -->
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="trigger"
        [cdkConnectedOverlayOpen]="open()"
        [cdkConnectedOverlayHasBackdrop]="true"
        [cdkConnectedOverlayBackdropClass]="'drawer-backdrop'"
        [cdkConnectedOverlayPanelClass]="'drawer-panel'"
        [cdkConnectedOverlayFlexibleDimensions]="true"
        [cdkConnectedOverlayGrowAfterOpen]="true"
        [cdkConnectedOverlayWidth]="overlayWidth()"
        [cdkConnectedOverlayHeight]="overlayHeight()"
        (backdropClick)="onBackdropClick()"
        (detach)="onDetach()">
        <!-- Overlay backdrop -->
        <div
          [class]="overlayClass()"
          [attr.data-state]="open() ? 'open' : 'closed'"
          (click)="onBackdropClick()">
        </div>
        <!-- Drawer content container with focus trap -->
        <div
          cdkTrapFocus
          cdkInitialFocus
          [cdkTrapFocusAutoCapture]="true"
          role="dialog"
          [attr.aria-modal]="true"
          [attr.aria-labelledby]="titleLabelledBy()"
          [attr.aria-describedby]="descriptionDescribedBy()"
          [class]="contentWrapperClass()"
          [attr.data-state]="open() ? 'open' : 'closed'"
          [attr.data-direction]="direction()"
          (keydown)="onContentKeydown($event)"
          (pointerdown)="onPointerDown($event)"
          (pointermove)="onPointerMove($event)"
          (pointerup)="onPointerUp()"
          #drawerContent>
          <ng-content />
        </div>
      </ng-template>
    </div>
  `,
  host: {
    '[attr.data-slot]': '"drawer"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent implements OnDestroy {
  readonly open = model<boolean>(false);

  readonly direction = input<DrawerDirection>('bottom');
  readonly size = input<DrawerSize>('default');
  readonly class = input<string>('');
  readonly dismissible = input<boolean>(true);
  readonly shouldScaleBackground = input<boolean>(false);

  // Outputs
  readonly openChange = output<boolean>();
  readonly closeClick = output<void>();

  // Unique ID for accessibility
  readonly id = `drawer-${drawerIdCounter++}`;

  // Internal signals for accessibility IDs
  readonly titleId = signal<string | null>(null);
  readonly descriptionId = signal<string | null>(null);

  // CDK Overlay
  protected readonly trigger = viewChild(CdkOverlayOrigin);
  protected readonly drawerContent = viewChild<ElementRef<HTMLElement>>('drawerContent');

  // Swipe gesture state
  private swipeStartY = signal<number | null>(null);
  private swipeStartX = signal<number | null>(null);
  private isDragging = signal(false);
  private readonly SWIPE_THRESHOLD = 50;

  protected readonly overlayWidth = computed(() => {
    const dir = this.direction();
    if (dir === 'left' || dir === 'right') {
      return this.getDrawerWidth();
    }
    return '100vw';
  });

  protected readonly overlayHeight = computed(() => {
    const dir = this.direction();
    if (dir === 'top' || dir === 'bottom') {
      return this.getDrawerHeight();
    }
    return '100vh';
  });

  protected readonly overlayClass = computed(() =>
    cn(
      'fixed inset-0 z-50 bg-black/80',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'supports-backdrop-filter:backdrop-blur-xs'
    )
  );

  protected readonly contentWrapperClass = computed(() => {
    const dir = this.direction();
    const positionClasses: Record<DrawerDirection, string> = {
      left: 'left-0 top-0 h-full',
      right: 'right-0 top-0 h-full',
      top: 'top-0 left-0 w-full',
      bottom: 'bottom-0 left-0 w-full',
    };

    return cn(
      'fixed z-50 outline-none',
      positionClasses[dir],
      this.class()
    );
  });

  protected readonly titleLabelledBy = computed(() => this.titleId());
  protected readonly descriptionDescribedBy = computed(() => this.descriptionId());

  private getDrawerWidth(): string {
    const size = this.size();
    const widthMap: Record<DrawerSize, string> = {
      sm: '288px',  // max-w-sm
      default: '384px', // max-w-sm default
      lg: '512px',  // max-w-lg
      xl: '640px',  // max-w-xl
      full: '100vw',
    };
    return widthMap[size] ?? widthMap['default'];
  }

  private getDrawerHeight(): string {
    const size = this.size();
    const heightMap: Record<DrawerSize, string> = {
      sm: '50vh',
      default: '80vh',
      lg: '90vh',
      xl: '95vh',
      full: '100vh',
    };
    return heightMap[size] ?? heightMap['default'];
  }

  openDrawer(): void {
    if (this.open()) return;
    this.open.set(true);
    this.openChange.emit(true);
  }

  closeDrawer(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.openChange.emit(false);
  }

  toggleDrawer(): void {
    if (this.open()) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  }

  protected onContentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeDrawer();
    }
  }

  protected onBackdropClick(): void {
    if (this.dismissible()) {
      this.closeDrawer();
    }
  }

  protected onDetach(): void {
    this.open.set(false);
    this.openChange.emit(false);
  }

  // Swipe gesture handlers
  protected onPointerDown(event: PointerEvent): void {
    if (!this.dismissible()) return;

    const dir = this.direction();
    if (dir === 'bottom' || dir === 'top') {
      this.swipeStartY.set(event.clientY);
    } else {
      this.swipeStartX.set(event.clientX);
    }
    this.isDragging.set(true);
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.isDragging()) return;

    const dir = this.direction();
    const startY = this.swipeStartY();
    const startX = this.swipeStartX();

    if ((dir === 'bottom' || dir === 'top') && startY !== null) {
      const deltaY = event.clientY - startY;
      const threshold = dir === 'bottom' ? -this.SWIPE_THRESHOLD : this.SWIPE_THRESHOLD;
      if (deltaY < threshold) {
        this.closeDrawer();
        this.resetSwipeState();
      }
    } else if ((dir === 'left' || dir === 'right') && startX !== null) {
      const deltaX = event.clientX - startX;
      const threshold = dir === 'right' ? -this.SWIPE_THRESHOLD : this.SWIPE_THRESHOLD;
      if (deltaX < threshold) {
        this.closeDrawer();
        this.resetSwipeState();
      }
    }
  }

  protected onPointerUp(): void {
    this.resetSwipeState();
  }

  private resetSwipeState(): void {
    this.swipeStartY.set(null);
    this.swipeStartX.set(null);
    this.isDragging.set(false);
  }

  ngOnDestroy(): void {
    this.resetSwipeState();
  }
}

// ============================================================================
// Drawer Trigger
// ============================================================================

/**
 * Drawer Trigger Directive
 * Opens the drawer when clicked
 */
@Directive({
  selector: '[appDrawerTrigger]',
  host: {
    '[attr.data-slot]': '"drawer-trigger"',
    '[attr.aria-haspopup]': '"dialog"',
    '(click)': 'onClick()',
  },
})
export class DrawerTriggerDirective {
  readonly drawer = inject(DrawerComponent);

  onClick(): void {
    this.drawer.openDrawer();
  }
}

// ============================================================================
// Drawer Portal (placeholder for API compatibility)
// ============================================================================

/**
 * Drawer Portal Component
 * In Angular CDK, portals are handled by the Overlay system
 * This component exists for API compatibility
 */
@Directive({
  selector: 'app-drawer-portal',
  host: {
    '[attr.data-slot]': '"drawer-portal"',
  },
})
export class DrawerPortalComponent {
  // Portal functionality is handled by CDK Overlay in the root component
}

// ============================================================================
// Drawer Overlay
// ============================================================================

/**
 * Drawer Overlay Component
 * The semi-transparent background behind the drawer
 */
@Component({
  selector: 'app-drawer-overlay',
  imports: [CommonModule],
  template: '',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"drawer-overlay"',
    '[attr.data-state]': 'drawer.open() ? "open" : "closed"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerOverlayComponent {
  readonly drawer = inject(DrawerComponent);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'fixed inset-0 z-50 bg-black/80',
      'supports-backdrop-filter:backdrop-blur-xs',
      this.class()
    )
  );
}

// ============================================================================
// Drawer Close
// ============================================================================

/**
 * Drawer Close Directive
 * Closes the drawer when clicked
 */
@Directive({
  selector: '[appDrawerClose]',
  host: {
    '[attr.data-slot]': '"drawer-close"',
    '(click)': 'onClick()',
  },
})
export class DrawerCloseDirective {
  readonly drawer = inject(DrawerComponent);

  onClick(): void {
    this.drawer.closeDrawer();
    this.drawer.closeClick.emit();
  }
}

// ============================================================================
// Drawer Content
// ============================================================================

const drawerContentVariants = cva(
  'bg-background flex flex-col text-xs/relaxed z-50',
  {
    variants: {
      direction: {
        left: 'h-full border-r data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
        right: 'h-full border-l data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
        top: 'w-full border-b data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom: 'w-full border-t data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
      },
      size: {
        sm: '',
        default: '',
        lg: '',
        xl: '',
        full: '',
      },
    },
    defaultVariants: {
      direction: 'bottom',
      size: 'default',
    },
  }
);

/**
 * Drawer Content Component
 * The main drawer panel
 */
@Component({
  selector: 'app-drawer-content',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <!-- Drag handle for bottom drawer -->
    @if (drawer.direction() === 'bottom') {
      <div class="bg-muted mx-auto mt-4 h-1.5 w-[100px] rounded-full shrink-0 group-data-[vaul-drawer-direction=bottom]/drawer-content:block"></div>
    }
    <ng-content />
    <!-- Close button -->
    <button
      [class]="closeButtonClass()"
      (click)="onCloseClick()"
      aria-label="Close drawer">
      <lucide-icon [img]="xIcon" class="size-4" />
      <span class="sr-only">Close</span>
    </button>
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"drawer-content"',
    '[attr.data-direction]': 'drawer.direction()',
    '[attr.data-size]': 'drawer.size()',
    '[attr.data-state]': 'drawer.open() ? "open" : "closed"',
    'role': 'document',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerContentComponent {
  readonly drawer = inject(DrawerComponent);
  readonly class = input<string>('');
  readonly showCloseButton = input<boolean>(true);

  protected readonly xIcon = XIcon;

  protected readonly computedClass = computed(() => {
    const dir = this.drawer.direction();
    const size = this.drawer.size();

    const sizeClasses: Record<DrawerDirection, Record<DrawerSize, string>> = {
      left: {
        sm: 'w-72',
        default: 'w-3/4 sm:max-w-sm',
        lg: 'w-3/4 sm:max-w-lg',
        xl: 'w-3/4 sm:max-w-xl',
        full: 'w-full',
      },
      right: {
        sm: 'w-72',
        default: 'w-3/4 sm:max-w-sm',
        lg: 'w-3/4 sm:max-w-lg',
        xl: 'w-3/4 sm:max-w-xl',
        full: 'w-full',
      },
      top: {
        sm: 'h-[50vh]',
        default: 'max-h-[80vh]',
        lg: 'h-[90vh]',
        xl: 'h-[95vh]',
        full: 'h-full',
      },
      bottom: {
        sm: 'h-[50vh]',
        default: 'max-h-[80vh]',
        lg: 'h-[90vh]',
        xl: 'h-[95vh]',
        full: 'h-full',
      },
    };

    return cn(
      drawerContentVariants({ direction: dir, size }),
      sizeClasses[dir][size],
      'p-4',
      'group/drawer-content',
      this.class()
    );
  });

  protected readonly closeButtonClass = computed(() =>
    cn(
      buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
      'absolute top-4 right-4'
    )
  );

  protected onCloseClick(): void {
    this.drawer.closeDrawer();
    this.drawer.closeClick.emit();
  }
}

// ============================================================================
// Drawer Header
// ============================================================================

/**
 * Drawer Header Component
 * Container for title, description, and optional media
 */
@Component({
  selector: 'app-drawer-header',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"drawer-header"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerHeaderComponent {
  readonly drawer = inject(DrawerComponent);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'flex flex-col gap-1 p-4',
      'group-data-[direction=bottom]/drawer-content:text-center',
      'group-data-[direction=top]/drawer-content:text-center',
      'md:text-left',
      this.class()
    )
  );
}

// ============================================================================
// Drawer Footer
// ============================================================================

/**
 * Drawer Footer Component
 * Container for action buttons
 */
@Component({
  selector: 'app-drawer-footer',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"drawer-footer"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerFooterComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'flex flex-col gap-2 p-4 mt-auto',
      this.class()
    )
  );
}

// ============================================================================
// Drawer Title
// ============================================================================

/**
 * Drawer Title Component
 * Required for accessibility - provides the drawer's accessible name
 */
@Component({
  selector: 'app-drawer-title',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"drawer-title"',
    '[attr.id]': 'titleId',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerTitleComponent implements OnInit, OnDestroy {
  readonly drawer = inject(DrawerComponent);
  readonly class = input<string>('');
  protected readonly titleId = `${this.drawer.id}-title`;

  protected readonly computedClass = computed(() =>
    cn(
      'text-foreground text-sm font-medium',
      this.class()
    )
  );

  ngOnInit(): void {
    this.drawer.titleId.set(this.titleId);
  }

  ngOnDestroy(): void {
    this.drawer.titleId.set(null);
  }
}

// ============================================================================
// Drawer Description
// ============================================================================

/**
 * Drawer Description Component
 * Provides additional context for the drawer
 */
@Component({
  selector: 'app-drawer-description',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"drawer-description"',
    '[attr.id]': 'descriptionId',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerDescriptionComponent implements OnInit, OnDestroy {
  readonly drawer = inject(DrawerComponent);
  readonly class = input<string>('');
  protected readonly descriptionId = `${this.drawer.id}-description`;

  protected readonly computedClass = computed(() =>
    cn(
      'text-muted-foreground text-xs/relaxed',
      this.class()
    )
  );

  ngOnInit(): void {
    this.drawer.descriptionId.set(this.descriptionId);
  }

  ngOnDestroy(): void {
    this.drawer.descriptionId.set(null);
  }
}

// ============================================================================
// Exports
// ============================================================================

export const DrawerComponents = [
  DrawerComponent,
  DrawerTriggerDirective,
  DrawerPortalComponent,
  DrawerOverlayComponent,
  DrawerCloseDirective,
  DrawerContentComponent,
  DrawerHeaderComponent,
  DrawerFooterComponent,
  DrawerTitleComponent,
  DrawerDescriptionComponent,
];
