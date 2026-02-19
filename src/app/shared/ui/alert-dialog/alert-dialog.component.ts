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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../utils/cn';
import { cva } from 'class-variance-authority';
import { argusxButtonVariants } from '../button';

// ============================================================================
// Types
// ============================================================================

export type AlertDialogSize = 'default' | 'sm';
export type AlertDialogActionVariant = 'default' | 'destructive' | 'outline';
export type AlertDialogButtonSize = 'default' | 'sm' | 'lg';

// ============================================================================
// Alert Dialog Root Component
// ============================================================================

let alertDialogIdCounter = 0;

/**
 * Alert Dialog Root Component
 * Uses Angular CDK Overlay for modal presentation
 *
 * A11y Features:
 * - role="alertdialog" + aria-modal="true"
 * - aria-labelledby pointing to title
 * - aria-describedby pointing to description
 * - Focus trap
 * - Escape key closes dialog
 * - Click outside does NOT close (by design for alert dialogs)
 */
@Component({
  selector: 'app-alert-dialog',
  imports: [
    CommonModule,
    OverlayModule,
    A11yModule,
  ],
  template: `
    <div class="inline-flex">
      <!-- Trigger element -->
      <div cdkOverlayOrigin #trigger="cdkOverlayOrigin">
        <ng-content select="[appAlertDialogTrigger],[app-alert-dialog-trigger]" />
      </div>

      <!-- Dialog overlay and content via CDK Overlay -->
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="trigger"
        [cdkConnectedOverlayOpen]="open()"
        [cdkConnectedOverlayHasBackdrop]="true"
        [cdkConnectedOverlayBackdropClass]="'alert-dialog-backdrop'"
        [cdkConnectedOverlayPanelClass]="'alert-dialog-panel'"
        [cdkConnectedOverlayFlexibleDimensions]="true"
        [cdkConnectedOverlayGrowAfterOpen]="true"
        (backdropClick)="onBackdropClick()"
        (detach)="onDetach()">
        <!-- Overlay backdrop -->
        <div
          [class]="overlayClass()"
          [attr.data-state]="open() ? 'open' : 'closed'">
        </div>
        <!-- Dialog content container with focus trap -->
        <div
          cdkTrapFocus
          cdkInitialFocus
          [cdkTrapFocusAutoCapture]="true"
          role="alertdialog"
          [attr.aria-modal]="true"
          [attr.aria-labelledby]="titleLabelledBy()"
          [attr.aria-describedby]="descriptionDescribedBy()"
          [class]="contentWrapperClass()"
          [attr.data-state]="open() ? 'open' : 'closed'"
          (keydown)="onContentKeydown($event)">
          <ng-content />
        </div>
      </ng-template>
    </div>
  `,
  host: {
    '[attr.data-slot]': '"alert-dialog"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialogComponent {
  readonly open = model<boolean>(false);

  readonly size = input<AlertDialogSize>('default');
  readonly class = input<string>('');

  // Outputs for action/cancel events
  readonly actionClick = output<void>();
  readonly cancelClick = output<void>();

  // Unique ID for accessibility
  readonly id = `alert-dialog-${alertDialogIdCounter++}`;

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
      'duration-200',
      'supports-backdrop-filter:backdrop-blur-xs'
    )
  );

  protected readonly contentWrapperClass = computed(() =>
    cn(
      'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
      'outline-none',
      this.class()
    )
  );

  protected readonly titleLabelledBy = computed(() => this.titleId());
  protected readonly descriptionDescribedBy = computed(() => this.descriptionId());

  openDialog(): void {
    if (this.open()) return;
    this.open.set(true);
  }

  closeDialog(): void {
    if (!this.open()) return;
    this.open.set(false);
  }

  toggleDialog(): void {
    if (this.open()) {
      this.closeDialog();
    } else {
      this.openDialog();
    }
  }

  protected onContentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeDialog();
    }
  }

  protected onBackdropClick(): void {
    // Click on backdrop does NOT close alert dialog by design
    // This is intentional per accessibility guidelines
  }

  protected onDetach(): void {
    // Called when overlay is detached
    this.open.set(false);
  }

}

// ============================================================================
// Alert Dialog Trigger
// ============================================================================

/**
 * Alert Dialog Trigger Directive
 * Opens the alert dialog when clicked
 */
@Directive({
  selector: '[appAlertDialogTrigger],[app-alert-dialog-trigger]',
  host: {
    '[attr.data-slot]': '"alert-dialog-trigger"',
    '[attr.aria-haspopup]': '"dialog"',
    '(click)': 'onClick()',
  },
})
export class AlertDialogTriggerDirective {
  readonly alertDialog = inject(AlertDialogComponent);

  onClick(): void {
    this.alertDialog.openDialog();
  }
}

// ============================================================================
// Alert Dialog Portal (placeholder for API compatibility)
// ============================================================================

/**
 * Alert Dialog Portal Component
 * In Angular CDK, portals are handled by the Overlay system
 * This component exists for API compatibility
 */
@Directive({
  selector: 'app-alert-dialog-portal,[app-alert-dialog-portal]',
  host: {
    '[attr.data-slot]': '"alert-dialog-portal"',
  },
})
export class AlertDialogPortalComponent {
  // Portal functionality is handled by CDK Overlay in the root component
}

// ============================================================================
// Alert Dialog Overlay
// ============================================================================

/**
 * Alert Dialog Overlay Component
 * The semi-transparent background behind the dialog
 */
@Component({
  selector: 'app-alert-dialog-overlay,[app-alert-dialog-overlay]',
  imports: [CommonModule],
  template: '',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"alert-dialog-overlay"',
    '[attr.data-state]': 'alertDialog.open() ? "open" : "closed"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialogOverlayComponent {
  readonly alertDialog = inject(AlertDialogComponent);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'fixed inset-0 z-50 bg-black/80 duration-200',
      'supports-backdrop-filter:backdrop-blur-xs',
      this.class()
    )
  );
}

// ============================================================================
// Alert Dialog Content
// ============================================================================

const alertDialogContentVariants = cva(
  'bg-background ring-foreground/10 gap-3 rounded-lg p-4 shadow-lg ring-1 duration-200 outline-none',
  {
    variants: {
      size: {
        default: 'max-w-xs sm:max-w-sm w-full',
        sm: 'max-w-64 w-full',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

/**
 * Alert Dialog Content Component
 * The main dialog panel
 */
@Component({
  selector: 'app-alert-dialog-content,[app-alert-dialog-content]',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"alert-dialog-content"',
    '[attr.data-size]': 'resolvedSize()',
    '[attr.data-state]': 'alertDialog.open() ? "open" : "closed"',
    'role': 'document',
  },
  styles: [`
    :host {
      display: grid;
      position: relative;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialogContentComponent {
  readonly alertDialog = inject(AlertDialogComponent);
  readonly size = input<AlertDialogSize | null>(null);
  readonly class = input<string>('');

  protected readonly resolvedSize = computed<AlertDialogSize>(
    () => this.size() ?? this.alertDialog.size()
  );

  protected readonly computedClass = computed(() =>
    cn(
      alertDialogContentVariants({ size: this.resolvedSize() }),
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'group/alert-dialog-content',
      this.class()
    )
  );
}

// ============================================================================
// Alert Dialog Header
// ============================================================================

/**
 * Alert Dialog Header Component
 * Container for title, description, and optional media
 */
@Component({
  selector: 'app-alert-dialog-header,[app-alert-dialog-header]',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"alert-dialog-header"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialogHeaderComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'grid grid-rows-[auto_1fr] place-items-center gap-1 text-center',
      'has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr]',
      'has-data-[slot=alert-dialog-media]:gap-x-4',
      'sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left',
      'sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-cols-[auto_1fr] sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]',
      this.class()
    )
  );
}

// ============================================================================
// Alert Dialog Footer
// ============================================================================

/**
 * Alert Dialog Footer Component
 * Container for action buttons
 */
@Component({
  selector: 'app-alert-dialog-footer,[app-alert-dialog-footer]',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"alert-dialog-footer"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialogFooterComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'flex flex-col-reverse gap-2',
      'group-data-[size=sm]/alert-dialog-content:grid',
      'group-data-[size=sm]/alert-dialog-content:grid-cols-2',
      'sm:flex-row sm:justify-end sm:space-x-2',
      this.class()
    )
  );
}

// ============================================================================
// Alert Dialog Media
// ============================================================================

/**
 * Alert Dialog Media Component
 * Container for icons or visual media
 */
@Component({
  selector: 'app-alert-dialog-media,[app-alert-dialog-media]',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"alert-dialog-media"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialogMediaComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'bg-muted mb-1 inline-flex size-8 items-center justify-center rounded-md',
      'text-foreground',
      'sm:group-data-[size=default]/alert-dialog-content:row-span-2',
      'sm:group-data-[size=default]/alert-dialog-content:mb-0',
      "*:[svg:not([class*='size-'])]:size-4",
      this.class()
    )
  );
}

// ============================================================================
// Alert Dialog Title
// ============================================================================

/**
 * Alert Dialog Title Component
 * Required for accessibility - provides the dialog's accessible name
 */
@Component({
  selector: 'app-alert-dialog-title,[app-alert-dialog-title]',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"alert-dialog-title"',
    '[attr.id]': 'titleId',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialogTitleComponent implements OnInit, OnDestroy {
  readonly alertDialog = inject(AlertDialogComponent);
  readonly class = input<string>('');
  protected readonly titleId = `${this.alertDialog.id}-title`;

  protected readonly computedClass = computed(() =>
    cn(
      'text-sm font-semibold',
      "sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
      this.class()
    )
  );

  ngOnInit(): void {
    this.alertDialog.titleId.set(this.titleId);
  }

  ngOnDestroy(): void {
    this.alertDialog.titleId.set(null);
  }
}

// ============================================================================
// Alert Dialog Description
// ============================================================================

/**
 * Alert Dialog Description Component
 * Provides additional context for the dialog
 */
@Component({
  selector: 'app-alert-dialog-description,[app-alert-dialog-description]',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"alert-dialog-description"',
    '[attr.id]': 'descriptionId',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialogDescriptionComponent implements OnInit, OnDestroy {
  readonly alertDialog = inject(AlertDialogComponent);
  readonly class = input<string>('');
  protected readonly descriptionId = `${this.alertDialog.id}-description`;

  protected readonly computedClass = computed(() =>
    cn(
      'text-muted-foreground *:[a]:hover:text-foreground',
      'text-xs/relaxed text-balance',
      '*:[a]:underline *:[a]:underline-offset-3',
      this.class()
    )
  );

  ngOnInit(): void {
    this.alertDialog.descriptionId.set(this.descriptionId);
  }

  ngOnDestroy(): void {
    this.alertDialog.descriptionId.set(null);
  }
}

// ============================================================================
// Alert Dialog Action
// ============================================================================

/**
 * Alert Dialog Action Component
 * Primary action button that closes the dialog
 */
@Component({
  selector: 'app-alert-dialog-action,[app-alert-dialog-action]',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"alert-dialog-action"',
    '[attr.data-variant]': 'variant()',
    '[attr.type]': '"button"',
    '(click)': 'onClick()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialogActionComponent {
  readonly alertDialog = inject(AlertDialogComponent);
  readonly variant = input<AlertDialogActionVariant>('default');
  readonly size = input<AlertDialogButtonSize>('default');
  readonly class = input<string>('');

  readonly actionClick = output<void>();

  protected readonly computedClass = computed(() =>
    cn(
      argusxButtonVariants({ variant: this.variant(), size: this.size() }),
      this.class()
    )
  );

  onClick(): void {
    this.actionClick.emit();
    this.alertDialog.actionClick.emit();
    this.alertDialog.closeDialog();
  }
}

// ============================================================================
// Alert Dialog Cancel
// ============================================================================

/**
 * Alert Dialog Cancel Component
 * Secondary action button that closes the dialog without action
 */
@Component({
  selector: 'app-alert-dialog-cancel,[app-alert-dialog-cancel]',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"alert-dialog-cancel"',
    '[attr.type]': '"button"',
    '(click)': 'onClick()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertDialogCancelComponent {
  readonly alertDialog = inject(AlertDialogComponent);
  readonly size = input<AlertDialogButtonSize>('default');
  readonly class = input<string>('');

  readonly cancelClick = output<void>();

  protected readonly computedClass = computed(() =>
    cn(
      argusxButtonVariants({ variant: 'outline', size: this.size() }),
      'mt-2 sm:mt-0 group-data-[size=sm]/alert-dialog-content:mt-0',
      this.class()
    )
  );

  onClick(): void {
    this.cancelClick.emit();
    this.alertDialog.cancelClick.emit();
    this.alertDialog.closeDialog();
  }
}

// ============================================================================
// Exports
// ============================================================================

export const AlertDialogComponents = [
  AlertDialogComponent,
  AlertDialogTriggerDirective,
  AlertDialogPortalComponent,
  AlertDialogOverlayComponent,
  AlertDialogContentComponent,
  AlertDialogHeaderComponent,
  AlertDialogFooterComponent,
  AlertDialogMediaComponent,
  AlertDialogTitleComponent,
  AlertDialogDescriptionComponent,
  AlertDialogActionComponent,
  AlertDialogCancelComponent,
];
