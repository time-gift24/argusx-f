import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  OnDestroy,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { cva } from 'class-variance-authority';
import { LucideAngularModule, XIcon } from 'lucide-angular';
import { cn } from '../../utils/cn';
import { argusxButtonVariants } from '../button';

export type ArgusxDrawerDirection = 'top' | 'right' | 'bottom' | 'left';
export type ArgusxDrawerSize = 'default' | 'sm' | 'lg' | 'full';

let drawerIdCounter = 0;

@Component({
  selector: 'argusx-drawer',
  exportAs: 'argusxDrawer',
  imports: [CommonModule, OverlayModule, A11yModule],
  template: `
    <div class="inline-flex">
      <div cdkOverlayOrigin #trigger="cdkOverlayOrigin">
        <ng-content select="[argusxDrawerTrigger]" />
      </div>

      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="trigger"
        [cdkConnectedOverlayOpen]="open()"
        [cdkConnectedOverlayHasBackdrop]="true"
        (backdropClick)="onBackdropClick()"
        (detach)="onDetach()"
      >
        <div
          [class]="overlayClass()"
          data-slot="drawer-overlay"
          [attr.data-state]="open() ? 'open' : 'closed'"
        ></div>

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
          [attr.data-vaul-drawer-direction]="direction()"
          (keydown)="onContentKeydown($event)"
        >
          <ng-content />
        </div>
      </ng-template>
    </div>
  `,
  host: {
    '[attr.data-slot]': '"drawer"',
    '[attr.data-state]': 'open() ? "open" : "closed"',
    '[attr.data-vaul-drawer-direction]': 'direction()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxDrawerComponent {
  readonly open = model<boolean>(false);

  readonly direction = input<ArgusxDrawerDirection>('bottom');
  readonly size = input<ArgusxDrawerSize>('default');
  readonly class = input<string>('');
  readonly dismissible = input<boolean>(true);
  readonly shouldScaleBackground = input<boolean>(false);

  readonly openChange = output<boolean>();

  readonly id = `argusx-drawer-${drawerIdCounter++}`;
  readonly titleId = signal<string | null>(null);
  readonly descriptionId = signal<string | null>(null);

  protected readonly trigger = viewChild(CdkOverlayOrigin);

  protected readonly overlayClass = computed(() =>
    cn(
      'fixed inset-0 z-50 bg-black/50',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
    )
  );

  protected readonly contentWrapperClass = computed(() =>
    cn(
      'fixed inset-0 z-50 outline-none',
      this.class()
    )
  );

  protected readonly titleLabelledBy = computed(() => this.titleId());
  protected readonly descriptionDescribedBy = computed(() => this.descriptionId());

  openDrawer(): void {
    if (this.open()) {
      return;
    }
    this.open.set(true);
    this.openChange.emit(true);
  }

  closeDrawer(): void {
    if (!this.open()) {
      return;
    }
    this.open.set(false);
    this.openChange.emit(false);
  }

  toggleDrawer(): void {
    if (this.open()) {
      this.closeDrawer();
      return;
    }
    this.openDrawer();
  }

  protected onContentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.dismissible()) {
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
}

@Directive({
  selector: '[argusxDrawerTrigger]',
  host: {
    '[attr.data-slot]': '"drawer-trigger"',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': 'drawer.open()',
    '(click)': 'onClick()',
  },
})
export class ArgusxDrawerTriggerDirective {
  readonly drawer = inject(ArgusxDrawerComponent);

  onClick(): void {
    this.drawer.openDrawer();
  }
}

@Directive({
  selector: 'argusx-drawer-portal',
  host: {
    '[attr.data-slot]': '"drawer-portal"',
  },
})
export class ArgusxDrawerPortalComponent {}

@Component({
  selector: 'argusx-drawer-overlay',
  imports: [CommonModule],
  template: '',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"drawer-overlay"',
    '[attr.data-state]': 'drawer.open() ? "open" : "closed"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxDrawerOverlayComponent {
  readonly drawer = inject(ArgusxDrawerComponent);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'fixed inset-0 z-50 bg-black/50',
      this.class()
    )
  );
}

@Directive({
  selector: '[argusxDrawerClose]',
  host: {
    '[attr.data-slot]': '"drawer-close"',
    '(click)': 'onClick()',
  },
})
export class ArgusxDrawerCloseDirective {
  readonly drawer = inject(ArgusxDrawerComponent);

  onClick(): void {
    this.drawer.closeDrawer();
  }
}

export const argusxDrawerContentVariants = cva(
  'group/drawer-content bg-background fixed z-50 flex h-auto flex-col border shadow-xl',
  {
    variants: {
      direction: {
        top:
          'inset-x-4 top-4 rounded-lg data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-4 bottom-4 rounded-lg data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        right:
          'top-4 bottom-4 right-4 rounded-lg data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
        left:
          'top-4 bottom-4 left-4 rounded-lg data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
      },
      size: {
        default: '',
        sm: '',
        lg: '',
        full: '',
      },
    },
    compoundVariants: [
      {
        direction: ['left', 'right'],
        size: 'default',
        class: 'w-3/4 sm:max-w-sm',
      },
      {
        direction: ['left', 'right'],
        size: 'sm',
        class: 'w-1/2 sm:max-w-xs',
      },
      {
        direction: ['left', 'right'],
        size: 'lg',
        class: 'w-full sm:max-w-lg',
      },
      {
        direction: ['left', 'right'],
        size: 'full',
        class: 'w-[calc(100vw-2rem)] sm:!max-w-[calc(100vw-2rem)]',
      },
      {
        direction: ['top', 'bottom'],
        size: 'default',
        class: 'max-h-[80vh]',
      },
      {
        direction: ['top', 'bottom'],
        size: 'sm',
        class: 'max-h-[50vh]',
      },
      {
        direction: ['top', 'bottom'],
        size: 'lg',
        class: 'max-h-[90vh]',
      },
      {
        direction: ['top', 'bottom'],
        size: 'full',
        class: 'h-[calc(100vh-2rem)] !max-h-[calc(100vh-2rem)]',
      },
    ],
    defaultVariants: {
      direction: 'bottom',
      size: 'default',
    },
  }
);

@Component({
  selector: 'argusx-drawer-content',
  imports: [CommonModule, LucideAngularModule],
  template: `
    @if (drawer.direction() === 'bottom') {
      <div
        class="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block"
      ></div>
    }

    <ng-content />

    @if (showCloseButton()) {
      <button
        [class]="closeButtonClass()"
        (click)="onCloseClick()"
        aria-label="Close drawer"
      >
        <lucide-icon [img]="xIcon" class="size-4"></lucide-icon>
        <span class="sr-only">Close</span>
      </button>
    }
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"drawer-content"',
    '[attr.data-size]': 'drawer.size()',
    '[attr.data-state]': 'drawer.open() ? "open" : "closed"',
    '[attr.data-vaul-drawer-direction]': 'drawer.direction()',
    'role': 'document',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxDrawerContentComponent {
  readonly drawer = inject(ArgusxDrawerComponent);
  readonly class = input<string>('');
  readonly showCloseButton = input<boolean>(false);

  protected readonly xIcon = XIcon;

  protected readonly computedClass = computed(() =>
    cn(
      argusxDrawerContentVariants({
        direction: this.drawer.direction(),
        size: this.drawer.size(),
      }),
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'ease-out data-[state=closed]:duration-200 data-[state=open]:duration-300',
      this.class()
    )
  );

  protected readonly closeButtonClass = computed(() =>
    cn(
      argusxButtonVariants({ variant: 'outline', size: 'icon-sm' }),
      'absolute top-4 right-4 z-10 shadow-sm'
    )
  );

  protected onCloseClick(): void {
    this.drawer.closeDrawer();
  }
}

@Component({
  selector: 'argusx-drawer-header',
  imports: [CommonModule],
  template: '<ng-content />',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"drawer-header"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxDrawerHeaderComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'flex flex-col gap-0.5 p-4',
      'group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center',
      'group-data-[vaul-drawer-direction=top]/drawer-content:text-center',
      'md:gap-1.5 md:text-left',
      this.class()
    )
  );
}

@Component({
  selector: 'argusx-drawer-footer',
  imports: [CommonModule],
  template: '<ng-content />',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"drawer-footer"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxDrawerFooterComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'mt-auto flex flex-col gap-2 p-4',
      this.class()
    )
  );
}

@Component({
  selector: 'argusx-drawer-title',
  imports: [CommonModule],
  template: '<ng-content />',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"drawer-title"',
    '[attr.id]': 'titleId',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxDrawerTitleComponent implements OnDestroy {
  readonly drawer = inject(ArgusxDrawerComponent);
  readonly class = input<string>('');
  protected readonly titleId = `${this.drawer.id}-title`;

  protected readonly computedClass = computed(() =>
    cn(
      'text-foreground font-semibold',
      this.class()
    )
  );

  constructor() {
    this.drawer.titleId.set(this.titleId);
  }

  ngOnDestroy(): void {
    this.drawer.titleId.set(null);
  }
}

@Component({
  selector: 'argusx-drawer-description',
  imports: [CommonModule],
  template: '<ng-content />',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"drawer-description"',
    '[attr.id]': 'descriptionId',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxDrawerDescriptionComponent implements OnDestroy {
  readonly drawer = inject(ArgusxDrawerComponent);
  readonly class = input<string>('');
  protected readonly descriptionId = `${this.drawer.id}-description`;

  protected readonly computedClass = computed(() =>
    cn(
      'text-muted-foreground text-sm',
      this.class()
    )
  );

  constructor() {
    this.drawer.descriptionId.set(this.descriptionId);
  }

  ngOnDestroy(): void {
    this.drawer.descriptionId.set(null);
  }
}

export const ArgusxDrawerComponents = [
  ArgusxDrawerComponent,
  ArgusxDrawerTriggerDirective,
  ArgusxDrawerPortalComponent,
  ArgusxDrawerOverlayComponent,
  ArgusxDrawerCloseDirective,
  ArgusxDrawerContentComponent,
  ArgusxDrawerHeaderComponent,
  ArgusxDrawerFooterComponent,
  ArgusxDrawerTitleComponent,
  ArgusxDrawerDescriptionComponent,
];
