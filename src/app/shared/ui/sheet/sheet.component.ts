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
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../utils/cn';
import { ArgusxButtonDirective } from '../button/button.directive';
import { LucideAngularModule, X } from 'lucide-angular';

// ============================================================================
// Types
// ============================================================================

export type SheetSide = 'top' | 'right' | 'bottom' | 'left';
export type SheetSize = 'default' | 'sm' | 'lg' | 'xl' | 'full';

// ============================================================================
// Sheet Root Component
// ============================================================================

let sheetIdCounter = 0;

/**
 * Sheet Root Component
 * Uses Angular CDK Overlay for slide-in panel presentation
 *
 * A11y Features:
 * - role="dialog" + aria-modal="true"
 * - aria-labelledby pointing to title
 * - aria-describedby pointing to description
 * - Focus trap
 * - Escape key closes sheet
 * - Click outside closes sheet by default
 */
@Component({
  selector: 'app-sheet',
  exportAs: 'appSheet',
  imports: [
    CommonModule,
    OverlayModule,
    A11yModule,
  ],
  template: `
    <div class="inline-flex">
      <!-- Trigger element -->
      <div cdkOverlayOrigin #trigger="cdkOverlayOrigin">
        <ng-content select="[appSheetTrigger]" />
      </div>

      <!-- Sheet overlay and content via CDK Overlay -->
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="trigger"
        [cdkConnectedOverlayOpen]="open()"
        [cdkConnectedOverlayHasBackdrop]="true"
        [cdkConnectedOverlayBackdropClass]="'sheet-backdrop'"
        [cdkConnectedOverlayPanelClass]="'sheet-panel'"
        [cdkConnectedOverlayFlexibleDimensions]="true"
        [cdkConnectedOverlayGrowAfterOpen]="true"
        (backdropClick)="onBackdropClick()"
        (detach)="onDetach()">
        <!-- Overlay backdrop -->
        <div
          [class]="overlayClass()"
          [attr.data-state]="open() ? 'open' : 'closed'">
        </div>
        <!-- Sheet content container with focus trap -->
        <div
          cdkTrapFocus
          cdkInitialFocus
          [cdkTrapFocusAutoCapture]="true"
          role="dialog"
          [attr.aria-modal]="true"
          [attr.aria-labelledby]="titleLabelledBy()"
          [attr.aria-describedby]="descriptionDescribedBy()"
          [class]="contentWrapperClass()"
          [attr.data-side]="side()"
          [attr.data-state]="open() ? 'open' : 'closed'"
          (keydown)="onContentKeydown($event)">
          <ng-content />
        </div>
      </ng-template>
    </div>
  `,
  host: {
    '[attr.data-slot]': '"sheet"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetComponent implements OnDestroy {
  readonly open = model<boolean>(false);

  readonly side = input<SheetSide>('right');
  readonly size = input<SheetSize>('default');
  readonly class = input<string>('');
  readonly closeOnBackdropClick = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);

  // Outputs
  readonly openChange = output<boolean>();

  // Unique ID for accessibility
  readonly id = `sheet-${sheetIdCounter++}`;

  // Internal signals for accessibility IDs
  readonly titleId = signal<string | null>(null);
  readonly descriptionId = signal<string | null>(null);

  // CDK Overlay
  protected readonly trigger = viewChild(CdkOverlayOrigin);

  protected readonly overlayClass = computed(() =>
    cn(
      'fixed inset-0 z-50 bg-black/80',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'duration-100',
      'supports-backdrop-filter:backdrop-blur-xs'
    )
  );

  protected readonly contentWrapperClass = computed(() => {
    const side = this.side();
    const size = this.size();

    const baseClasses =
      'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 outline-none';

    const sideClasses: Record<SheetSide, string> = {
      top: 'inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
      bottom:
        'inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
      left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
      right:
        'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
    };

    const sizeClasses: Record<SheetSize, string> = {
      default: '',
      sm: 'max-w-sm',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full h-full',
    };

    return cn(
      baseClasses,
      sideClasses[side],
      sizeClasses[size]
    );
  });

  protected readonly titleLabelledBy = computed(() => this.titleId());
  protected readonly descriptionDescribedBy = computed(() => this.descriptionId());

  openSheet(): void {
    if (this.open()) return;
    this.open.set(true);
    this.openChange.emit(true);
  }

  closeSheet(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.openChange.emit(false);
  }

  toggleSheet(): void {
    if (this.open()) {
      this.closeSheet();
    } else {
      this.openSheet();
    }
  }

  protected onContentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.closeOnEscape()) {
      event.preventDefault();
      this.closeSheet();
    }
  }

  protected onBackdropClick(): void {
    if (this.closeOnBackdropClick()) {
      this.closeSheet();
    }
  }

  protected onDetach(): void {
    this.open.set(false);
    this.openChange.emit(false);
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }
}

// ============================================================================
// Sheet Trigger
// ============================================================================

/**
 * Sheet Trigger Directive
 * Opens the sheet when clicked
 */
@Directive({
  selector: '[appSheetTrigger]',
  host: {
    '[attr.data-slot]': '"sheet-trigger"',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': 'sheet.open()',
    '(click)': 'onClick()',
  },
})
export class SheetTriggerDirective {
  readonly sheet = inject(SheetComponent);

  onClick(): void {
    this.sheet.openSheet();
  }
}

// ============================================================================
// Sheet Portal
// ============================================================================

/**
 * Sheet Portal Directive
 * In Angular CDK, portals are handled by the Overlay system
 */
@Directive({
  selector: 'app-sheet-portal',
  host: {
    '[attr.data-slot]': '"sheet-portal"',
  },
})
export class SheetPortalComponent {
  // Portal functionality is handled by CDK Overlay in the root component
}

// ============================================================================
// Sheet Close
// ============================================================================

/**
 * Sheet Close Directive
 * Closes the sheet when clicked
 */
@Directive({
  selector: '[appSheetClose]',
  host: {
    '[attr.data-slot]': '"sheet-close"',
    '(click)': 'onClick()',
  },
})
export class SheetCloseDirective {
  readonly sheet = inject(SheetComponent);

  onClick(): void {
    this.sheet.closeSheet();
  }
}

// ============================================================================
// Sheet Overlay
// ============================================================================

/**
 * Sheet Overlay Component
 * The semi-transparent background behind the sheet
 */
@Component({
  selector: 'app-sheet-overlay',
  imports: [CommonModule],
  template: '',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"sheet-overlay"',
    '[attr.data-state]': 'sheet.open() ? "open" : "closed"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetOverlayComponent {
  readonly sheet = inject(SheetComponent);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'fixed inset-0 z-50 bg-black/80 duration-100',
      'supports-backdrop-filter:backdrop-blur-xs',
      this.class()
    )
  );
}

// ============================================================================
// Sheet Content
// ============================================================================

/**
 * Sheet Content Component
 * The main sheet panel with optional close button
 */
@Component({
  selector: 'app-sheet-content',
  imports: [CommonModule, ArgusxButtonDirective, LucideAngularModule],
  template: `
    <ng-content />
    @if (showCloseButton()) {
      <button
        argusx-button
        variant="ghost"
        size="icon-sm"
        class="absolute top-4 right-4"
        aria-label="Close"
        appSheetClose>
        <lucide-icon [img]="xIcon" class="size-3.5"></lucide-icon>
      </button>
    }
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"sheet-content"',
    '[attr.data-side]': 'sheet.side()',
    '[attr.data-state]': 'sheet.open() ? "open" : "closed"',
    'role': 'document',
  },
  styles: [`
    :host {
      display: grid;
      position: relative;
      height: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetContentComponent {
  readonly sheet = inject(SheetComponent);
  readonly class = input<string>('');
  readonly showCloseButton = input<boolean>(true);

  protected readonly xIcon = X;

  protected readonly computedClass = computed(() =>
    cn(
      'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'group/sheet-content',
      this.class()
    )
  );
}

// ============================================================================
// Sheet Header
// ============================================================================

/**
 * Sheet Header Component
 * Container for title, description, and optional media
 */
@Component({
  selector: 'app-sheet-header',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"sheet-header"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetHeaderComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'gap-1.5 flex flex-col p-6',
      this.class()
    )
  );
}

// ============================================================================
// Sheet Footer
// ============================================================================

/**
 * Sheet Footer Component
 * Container for action buttons
 */
@Component({
  selector: 'app-sheet-footer',
  imports: [CommonModule],
  template: `
    <ng-content />
    @if (showCloseButton()) {
      <button argusx-button variant="outline" appSheetClose>Close</button>
    }
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"sheet-footer"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetFooterComponent {
  readonly sheet = inject(SheetComponent);
  readonly class = input<string>('');
  readonly showCloseButton = input<boolean>(false);

  protected readonly computedClass = computed(() =>
    cn(
      'gap-2 flex flex-col mt-auto p-6',
      'sm:flex-row sm:justify-end',
      this.class()
    )
  );
}

// ============================================================================
// Sheet Title
// ============================================================================

/**
 * Sheet Title Component
 * Required for accessibility - provides the sheet's accessible name
 */
@Component({
  selector: 'app-sheet-title',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"sheet-title"',
    '[attr.id]': 'titleId',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetTitleComponent implements OnDestroy {
  readonly sheet = inject(SheetComponent);
  readonly class = input<string>('');
  protected readonly titleId = `${this.sheet.id}-title`;

  protected readonly computedClass = computed(() =>
    cn(
      'text-foreground text-sm font-medium',
      this.class()
    )
  );

  ngOnDestroy(): void {
    this.sheet.titleId.set(null);
  }

  constructor() {
    this.sheet.titleId.set(this.titleId);
  }
}

// ============================================================================
// Sheet Description
// ============================================================================

/**
 * Sheet Description Component
 * Provides additional context for the sheet
 */
@Component({
  selector: 'app-sheet-description',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"sheet-description"',
    '[attr.id]': 'descriptionId',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetDescriptionComponent implements OnDestroy {
  readonly sheet = inject(SheetComponent);
  readonly class = input<string>('');
  protected readonly descriptionId = `${this.sheet.id}-description`;

  protected readonly computedClass = computed(() =>
    cn(
      'text-muted-foreground text-xs/relaxed',
      this.class()
    )
  );

  ngOnDestroy(): void {
    this.sheet.descriptionId.set(null);
  }

  constructor() {
    this.sheet.descriptionId.set(this.descriptionId);
  }
}

// ============================================================================
// Exports
// ============================================================================

export const SheetComponents = [
  SheetComponent,
  SheetTriggerDirective,
  SheetPortalComponent,
  SheetCloseDirective,
  SheetOverlayComponent,
  SheetContentComponent,
  SheetHeaderComponent,
  SheetFooterComponent,
  SheetTitleComponent,
  SheetDescriptionComponent,
];
