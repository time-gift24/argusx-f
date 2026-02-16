import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  effect,
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
import { cva, type VariantProps } from 'class-variance-authority';
import {
  LucideAngularModule,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from 'lucide-angular';

// Aligned with official shadcn preset (.vendor/aim/components/ui/select.tsx)
const selectTriggerVariants = cva(
  "border-input data-placeholder:text-muted-foreground bg-input/20 dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 gap-1.5 rounded-md border px-2 py-1.5 text-xs/relaxed transition-colors focus-visible:ring-2 aria-invalid:ring-2 *:data-[slot=select-value]:gap-1.5 [&_svg:not([class*='size-'])]:size-3.5 flex w-fit items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      size: {
        default: 'h-7',
        sm: 'h-6',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

type SelectTriggerVariants = VariantProps<typeof selectTriggerVariants>;

export type SelectSize = NonNullable<SelectTriggerVariants['size']>;

// Select Item Component
@Component({
  selector: 'app-select-item',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <span class="pointer-events-none absolute right-2 flex items-center justify-center">
      @if (isSelected()) {
        <lucide-icon [img]="checkIcon" class="size-3.5 pointer-events-none" />
      }
    </span>
    <span class="flex-1">
      <ng-content />
    </span>
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"select-item"',
    '[attr.role]': '"option"',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.data-disabled]': 'disabled()',
    '(click)': 'onClick()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectItemComponent<T = string> {
  readonly value = input.required<T>();
  readonly class = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly selectValue = input<T | undefined>(undefined);
  readonly selectOnChange = output<T>();

  protected readonly checkIcon = CheckIcon;

  protected readonly computedClass = computed(() =>
    cn(
      'focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground min-h-7 gap-2 rounded-md px-2 py-1 text-xs/relaxed [&_svg:not([class*=\'size-\'])]:size-3.5 relative flex w-full cursor-default items-center outline-hidden select-none',
      this.disabled() ? 'pointer-events-none opacity-50' : 'cursor-pointer',
      this.class()
    )
  );

  protected readonly isSelected = computed(
    () => this.selectValue() === this.value()
  );

  onClick(): void {
    if (this.disabled()) return;
    this.selectOnChange.emit(this.value());
  }
}

// Select Group Component
@Component({
  selector: 'app-select-group',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"select-group"',
    role: 'group',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectGroupComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('scroll-my-1 p-1', this.class())
  );
}

// Select Label Component
@Component({
  selector: 'app-select-label',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"select-label"',
    role: 'presentation',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectLabelComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('text-muted-foreground px-2 py-1.5 text-xs', this.class())
  );
}

// Select Separator Component
@Component({
  selector: 'app-select-separator',
  imports: [CommonModule],
  template: '',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"select-separator"',
    role: 'separator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSeparatorComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('bg-border/50 -mx-1 my-1 h-px pointer-events-none', this.class())
  );
}

// Select Scroll Up Button Component
@Component({
  selector: 'app-select-scroll-up',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <lucide-icon [img]="chevronUpIcon" />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"select-scroll-up-button"',
    role: 'presentation',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectScrollUpComponent {
  readonly class = input<string>('');

  protected readonly chevronUpIcon = ChevronUpIcon;

  protected readonly computedClass = computed(() =>
    cn(
      'bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*=\'size-\'])]:size-3.5',
      this.class()
    )
  );
}

// Select Scroll Down Button Component
@Component({
  selector: 'app-select-scroll-down',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <lucide-icon [img]="chevronDownIcon" />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"select-scroll-down-button"',
    role: 'presentation',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectScrollDownComponent {
  readonly class = input<string>('');

  protected readonly chevronDownIcon = ChevronDownIcon;

  protected readonly computedClass = computed(() =>
    cn(
      'bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*=\'size-\'])]:size-3.5',
      this.class()
    )
  );
}

// Select Root Component
@Component({
  selector: 'app-select',
  imports: [
    CommonModule,
    OverlayModule,
    LucideAngularModule,
    SelectScrollUpComponent,
    SelectScrollDownComponent,
  ],
  template: `
    <div class="inline-flex">
      <!-- Trigger -->
      <button
        type="button"
        cdkOverlayOrigin
        #trigger="cdkOverlayOrigin"
        [class]="triggerClass()"
        [attr.data-slot]="'select-trigger'"
        [attr.data-size]="size()"
        [attr.data-placeholder]="!value()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-disabled]="disabled()"
        [attr.aria-invalid]="invalid()"
        [disabled]="disabled()"
        (click)="toggle()">
        <span data-slot="select-value" class="flex items-center gap-1.5 line-clamp-1">
          <ng-content select="app-select-value" />
        </span>
        <lucide-icon
          [img]="chevronDownIcon"
          class="text-muted-foreground size-3.5 pointer-events-none" />
      </button>

      <!-- Dropdown -->
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="trigger"
        [cdkConnectedOverlayOpen]="isOpen()"
        [cdkConnectedOverlayPositions]="positions"
        [cdkConnectedOverlayWidth]="triggerWidth()"
        (attach)="onOverlayAttach()"
        (overlayOutsideClick)="onOutsideClick($event)"
        (detach)="close()">
        <div
          [class]="contentClass()"
          [attr.data-slot]="'select-content'"
          [attr.data-align-trigger]="true"
          role="listbox"
          (keydown.escape)="close()">
          @if (showScrollUpButton()) {
            <app-select-scroll-up (click)="scrollViewport(-40)" />
          }
          <div
            #viewport
            data-position="item-aligned"
            class="data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)"
            (scroll)="onViewportScroll()">
            <ng-content select="app-select-group, app-select-item, app-select-separator" />
          </div>
          @if (showScrollDownButton()) {
            <app-select-scroll-down (click)="scrollViewport(40)" />
          }
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `],
  host: {
    '[attr.data-slot]': '"select"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<T = string> {
  readonly value = model<T | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly placeholder = input<string>('Select an option');
  readonly size = input<SelectSize>('default');
  readonly invalid = input<boolean>(false);
  readonly class = input<string>('');

  readonly valueChange = output<T | undefined>();

  // Internal state
  readonly isOpen = signal(false);
  protected readonly trigger = viewChild(CdkOverlayOrigin);
  protected readonly viewport = viewChild<ElementRef<HTMLDivElement>>('viewport');
  protected readonly showScrollUpButton = signal(false);
  protected readonly showScrollDownButton = signal(false);

  protected readonly chevronDownIcon = ChevronDownIcon;

  protected readonly positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 4,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -4,
    },
  ];

  protected readonly triggerClass = computed(() =>
    cn(selectTriggerVariants({ size: this.size() }), this.class())
  );

  protected readonly contentClass = computed(() =>
    cn(
      'bg-popover text-popover-foreground ring-foreground/10 min-w-32 rounded-lg shadow-md ring-1 duration-100 relative z-50 max-h-96 overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none',
      // Animation classes for open/close - aligned with vendor
      this.isOpen()
        ? 'animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
        : 'animate-out fade-out-0 zoom-out-95 data-[side=bottom]:slide-out-to-top-2 data-[side=left]:slide-out-to-right-2 data-[side=right]:slide-out-to-left-2 data-[side=top]:slide-out-to-bottom-2'
    )
  );

  protected readonly triggerWidth = computed(() => {
    const triggerEl = this.trigger()?.elementRef?.nativeElement;
    return triggerEl?.offsetWidth ?? 150;
  });

  constructor() {
    effect(() => {
      if (!this.isOpen()) {
        this.showScrollUpButton.set(false);
        this.showScrollDownButton.set(false);
      }
    });
  }

  setValue(newValue: T | undefined): void {
    this.value.set(newValue);
    this.valueChange.emit(newValue);
    this.close();
  }

  open(): void {
    if (!this.disabled()) {
      this.isOpen.set(true);
    }
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    if (this.disabled()) return;
    this.isOpen.update((v) => !v);
  }

  onOutsideClick(event: MouseEvent): void {
    const triggerEl = this.trigger()?.elementRef?.nativeElement;
    if (triggerEl && !triggerEl.contains(event.target as Node)) {
      this.close();
    }
  }

  onOverlayAttach(): void {
    queueMicrotask(() => this.updateScrollButtonVisibility());
  }

  onViewportScroll(): void {
    this.updateScrollButtonVisibility();
  }

  scrollViewport(deltaY: number): void {
    const viewportEl = this.viewport()?.nativeElement;
    if (!viewportEl) return;
    viewportEl.scrollBy({ top: deltaY, behavior: 'smooth' });
    queueMicrotask(() => this.updateScrollButtonVisibility());
  }

  private updateScrollButtonVisibility(): void {
    const viewportEl = this.viewport()?.nativeElement;
    if (!viewportEl) {
      this.showScrollUpButton.set(false);
      this.showScrollDownButton.set(false);
      return;
    }

    const hasOverflow = viewportEl.scrollHeight > viewportEl.clientHeight + 1;
    if (!hasOverflow) {
      this.showScrollUpButton.set(false);
      this.showScrollDownButton.set(false);
      return;
    }

    this.showScrollUpButton.set(viewportEl.scrollTop > 0);
    this.showScrollDownButton.set(
      viewportEl.scrollTop + viewportEl.clientHeight < viewportEl.scrollHeight - 1
    );
  }
}

// Select Value Component (for projection)
@Component({
  selector: 'app-select-value',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'class()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectValueComponent {
  readonly class = input<string>('');
}

// Re-export all components
export const SelectComponents = [
  SelectComponent,
  SelectValueComponent,
  SelectItemComponent,
  SelectGroupComponent,
  SelectLabelComponent,
  SelectSeparatorComponent,
  SelectScrollUpComponent,
  SelectScrollDownComponent,
];
