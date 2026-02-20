import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { cn } from '../../utils';

export type DialogSize = 'sm' | 'default' | 'lg' | 'xl' | 'full';

const DIALOG_SIZE_CLASSES: Record<DialogSize, string> = {
  sm: 'max-w-xs',
  default: 'max-w-[calc(100%-2rem)] sm:max-w-sm',
  lg: 'max-w-[calc(100%-2rem)] sm:max-w-lg',
  xl: 'max-w-[calc(100%-2rem)] sm:max-w-xl',
  full: 'max-w-[calc(100%-2rem)] h-[calc(100%-2rem)]',
};

/**
 * Dialog Trigger Directive
 * Marks an element that triggers the dialog to open.
 */
@Directive({
  selector: '[argus-dialog-trigger]',
  host: {
    '[attr.aria-haspopup]': '"dialog"',
    '(click)': 'onClick()',
  },
})
export class DialogTriggerComponent {
  private readonly dialog = inject(DialogComponent, { optional: true });

  readonly openDialog = output<void>();

  protected onClick(): void {
    this.openDialog.emit();
    this.dialog?.open.set(true);
  }
}

/**
 * Dialog Portal Component
 */
@Component({
  selector: 'div[argus-dialog-portal]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"dialog-portal"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
})
export class DialogPortalComponent {
  protected readonly computedClass = computed(() => 'fixed inset-0 z-50');
}

/**
 * Dialog Overlay Component
 */
@Component({
  selector: 'div[argus-dialog-overlay]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"dialog-overlay"',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    '(click)': 'close.emit()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class DialogOverlayComponent {
  private readonly dialog = inject(DialogComponent, { optional: true });

  readonly open = input<boolean | null>(null);
  readonly close = output<void>();

  protected readonly isOpen = computed(() => this.open() ?? this.dialog?.open() ?? false);

  protected readonly computedClass = computed(() => {
    return cn(
      'fixed inset-0 isolate z-50 bg-black/80 supports-backdrop-filter:backdrop-blur-xs',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'duration-200',
    );
  });
}

/**
 * Dialog Close Directive
 * Closes dialog on click.
 */
@Directive({
  selector: '[argus-dialog-close]',
  host: {
    '[attr.data-slot]': '"dialog-close"',
    '(click)': 'onClick()',
  },
})
export class DialogCloseDirective {
  private readonly dialog = inject(DialogComponent, { optional: true });
  private readonly dialogContent = inject(DialogContentComponent, { optional: true });

  readonly close = output<void>();

  protected onClick(): void {
    this.close.emit();
    this.dialogContent?.close.emit();
    this.dialog?.closeDialog();
  }
}

/**
 * Dialog Content Component
 */
@Component({
  selector: 'div[argus-dialog-content]',
  imports: [DialogCloseDirective],
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"dialog-content"',
    '[attr.data-size]': 'size()',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    'role': 'dialog',
    '[attr.aria-modal]': 'isOpen() ? "true" : null',
    '[attr.aria-hidden]': 'isOpen() ? null : "true"',
    '[attr.aria-labelledby]': 'resolvedAriaLabelledby()',
    '[attr.aria-describedby]': 'resolvedAriaDescribedby()',
    '[attr.tabindex]': '-1',
    '(keydown.escape)': 'onEscape($event)',
    '(keydown)': 'onKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />
    @if (showCloseButton()) {
      <button
        type="button"
        argus-dialog-close
        class="absolute top-3 right-3 inline-flex size-6 items-center justify-center rounded-md text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-2 outline-none"
        [attr.aria-label]="'Close dialog'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span class="sr-only">Close</span>
      </button>
    }
  `,
})
export class DialogContentComponent implements OnDestroy {
  private readonly dialog = inject(DialogComponent, { optional: true });
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly open = input<boolean | null>(null);
  readonly size = input<DialogSize>('default');
  readonly showCloseButton = input<boolean>(true);
  readonly ariaLabelledby = input<string | null>(null);
  readonly ariaDescribedby = input<string | null>(null);

  readonly close = output<void>();

  private wasOpen = false;
  private previousActiveElement: HTMLElement | null = null;

  protected readonly isOpen = computed(() => this.open() ?? this.dialog?.open() ?? false);

  protected readonly resolvedAriaLabelledby = computed(() => {
    return this.ariaLabelledby() ?? this.dialog?.titleId() ?? null;
  });

  protected readonly resolvedAriaDescribedby = computed(() => {
    return this.ariaDescribedby() ?? this.dialog?.descriptionId() ?? null;
  });

  constructor() {
    effect(() => {
      const open = this.isOpen();

      if (open && !this.wasOpen) {
        this.wasOpen = true;
        this.previousActiveElement =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
        queueMicrotask(() => this.focusInitialElement());
        return;
      }

      if (!open && this.wasOpen) {
        this.wasOpen = false;
        this.restoreFocus();
      }
    });
  }

  protected readonly computedClass = computed(() => {
    return cn(
      'fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2',
      DIALOG_SIZE_CLASSES[this.size()],
      'gap-3 rounded-xl bg-popover p-4 text-popover-foreground',
      'ring-1 ring-foreground/10 outline-none',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'duration-200',
    );
  });

  protected onEscape(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.close.emit();
    this.dialog?.closeDialog();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this.isOpen()) {
      return;
    }

    const focusables = this.getFocusableElements();
    if (focusables.length === 0) {
      event.preventDefault();
      this.host.nativeElement.focus();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  ngOnDestroy(): void {
    this.restoreFocus();
  }

  private focusInitialElement(): void {
    const focusables = this.getFocusableElements();
    if (focusables.length > 0) {
      focusables[0].focus();
      return;
    }

    this.host.nativeElement.focus();
  }

  private getFocusableElements(): HTMLElement[] {
    const root = this.host.nativeElement;
    const focusableSelector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const elements = Array.from(root.querySelectorAll(focusableSelector));

    return elements.filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement &&
        !el.hasAttribute('hidden') &&
        !el.getAttribute('aria-hidden'),
    );
  }

  private restoreFocus(): void {
    if (!this.previousActiveElement) {
      return;
    }

    this.previousActiveElement.focus();
    this.previousActiveElement = null;
  }
}

/**
 * Dialog Header Component
 */
@Component({
  selector: 'div[argus-dialog-header]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"dialog-header"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
})
export class DialogHeaderComponent {
  protected readonly computedClass = computed(() => 'flex flex-col gap-2');
}

/**
 * Dialog Title Component
 */
@Component({
  selector: 'h3[argus-dialog-title]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"dialog-title"',
    '[attr.id]': 'resolvedId()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
})
export class DialogTitleComponent {
  private readonly dialog = inject(DialogComponent, { optional: true });

  readonly id = input<string | null>(null);

  protected readonly resolvedId = computed(() => this.id() ?? this.dialog?.titleId() ?? null);

  protected readonly computedClass = computed(() => 'text-sm font-semibold leading-none');
}

/**
 * Dialog Description Component
 */
@Component({
  selector: 'p[argus-dialog-description]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"dialog-description"',
    '[attr.id]': 'resolvedId()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
})
export class DialogDescriptionComponent {
  private readonly dialog = inject(DialogComponent, { optional: true });

  readonly id = input<string | null>(null);

  protected readonly resolvedId = computed(() => this.id() ?? this.dialog?.descriptionId() ?? null);

  protected readonly computedClass = computed(() => 'text-muted-foreground text-xs/relaxed');
}

/**
 * Dialog Footer Component
 */
@Component({
  selector: 'div[argus-dialog-footer]',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"dialog-footer"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
})
export class DialogFooterComponent {
  protected readonly computedClass = computed(() =>
    'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'
  );
}

/**
 * Dialog Root Component
 */
@Component({
  selector: 'div[argus-dialog]',
  imports: [DialogPortalComponent, DialogOverlayComponent],
  host: {
    class: 'contents',
    '[attr.data-slot]': '"dialog"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div argus-dialog-portal>
        <div argus-dialog-overlay (close)="closeDialog()"></div>
        <ng-content></ng-content>
      </div>
    }
  `,
})
export class DialogComponent implements OnDestroy {
  private static nextId = 0;
  private readonly dialogId = `argus-dialog-${DialogComponent.nextId++}`;
  private readonly bodyScrollLocked = signal(false);

  readonly open = model<boolean>(false);
  readonly close = output<void>();

  readonly titleId = signal<string>(`${this.dialogId}-title`);
  readonly descriptionId = signal<string>(`${this.dialogId}-description`);

  constructor() {
    effect(() => {
      if (this.open()) {
        document.body.classList.add('argus-dialog-scroll-locked');
        this.bodyScrollLocked.set(true);
        return;
      }

      if (this.bodyScrollLocked()) {
        document.body.classList.remove('argus-dialog-scroll-locked');
        this.bodyScrollLocked.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.bodyScrollLocked()) {
      document.body.classList.remove('argus-dialog-scroll-locked');
    }
  }

  closeDialog(): void {
    if (!this.open()) {
      return;
    }

    this.close.emit();
    this.open.set(false);
  }
}
