import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkOverlayOrigin,
  OverlayModule,
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { CdkListbox, CdkOption, ListboxValueChangeEvent } from '@angular/cdk/listbox';
import { cn } from '../../utils/cn';
import {
  LucideAngularModule,
  ChevronDownIcon,
  XIcon,
  CheckIcon,
  SearchIcon,
} from 'lucide-angular';

// ============================================================================
// Types
// ============================================================================

export type ComboboxAlign = 'start' | 'center' | 'end';
export type ComboboxSide = 'top' | 'bottom';

export interface ComboboxItemData<T = unknown> {
  value: T;
  label: string;
  disabled?: boolean;
}

// ============================================================================
// Combobox Root Token for DI
// ============================================================================

export abstract class ComboboxRootToken<T = unknown> {
  abstract value: ReturnType<typeof model<T | T[] | undefined>>;
  abstract multiple: () => boolean;
  abstract disabled: () => boolean;
  abstract open: ReturnType<typeof signal<boolean>>;
  abstract searchTerm: ReturnType<typeof signal<string>>;
  abstract filterMode: () => boolean;
  abstract openCombobox: () => void;
  abstract closeCombobox: () => void;
  abstract toggleCombobox: () => void;
  abstract isSelected: (value: T) => boolean;
  abstract selectValue: (value: T) => void;
  abstract deselectValue: (value: T) => void;
  abstract clearValue: () => void;
  abstract getDisplayValue: () => string;
  abstract registerItemLabel: (value: T, label: string) => void;
  abstract getItemLabel: (value: T) => string;
}

// ============================================================================
// Combobox Item Component
// ============================================================================

/**
 * Combobox Item Component
 * Individual selectable item in the dropdown
 */
@Component({
  selector: 'app-combobox-item',
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
    '[attr.data-slot]': '"combobox-item"',
    '[attr.role]': '"option"',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.data-disabled]': 'disabled()',
    '[attr.data-value]': 'value()',
    '(click)': 'onClick()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CdkOption,
      useExisting: forwardRef(() => ComboboxItemComponent),
    },
  ],
})
export class ComboboxItemComponent<T = unknown> {
  readonly combobox = inject<ComboboxRootToken<T>>(ComboboxRootToken);

  readonly value = input.required<T>();
  readonly label = input<string>('');
  readonly class = input<string>('');
  readonly disabled = input<boolean>(false);

  protected readonly checkIcon = CheckIcon;

  constructor() {
    effect(() => {
      const itemValue = this.value();
      const label = this.label().trim() || String(itemValue);
      this.combobox.registerItemLabel(itemValue, label);
    });
  }

  protected readonly computedClass = computed(() =>
    cn(
      'data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground min-h-7 gap-2 rounded-md px-2 py-1 text-xs/relaxed [&_svg:not([class*=\'size-\'])]:size-3.5 relative flex w-full cursor-default items-center outline-hidden select-none hover:bg-accent hover:text-accent-foreground',
      this.disabled() ? 'pointer-events-none opacity-50' : 'cursor-pointer',
      this.class()
    )
  );

  protected readonly isSelected = computed(() => {
    const currentValue = this.value();
    return this.combobox.isSelected(currentValue);
  });

  onClick(): void {
    if (this.disabled()) return;
    if (this.isSelected()) {
      this.combobox.deselectValue(this.value());
    } else {
      this.combobox.selectValue(this.value());
    }
    if (!this.combobox.multiple()) {
      this.combobox.closeCombobox();
    }
  }
}

// ============================================================================
// Combobox Group Component
// ============================================================================

/**
 * Combobox Group Component
 * Groups related items together
 */
@Component({
  selector: 'app-combobox-group',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-group"',
    role: 'group',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxGroupComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('p-1', this.class())
  );
}

// ============================================================================
// Combobox Label Component
// ============================================================================

/**
 * Combobox Label Component
 * Labels a group of items
 */
@Component({
  selector: 'app-combobox-label',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-label"',
    role: 'presentation',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxLabelComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('text-muted-foreground px-2 py-1.5 text-xs', this.class())
  );
}

// ============================================================================
// Combobox Separator Component
// ============================================================================

/**
 * Combobox Separator Component
 * Visual divider between items
 */
@Component({
  selector: 'app-combobox-separator',
  imports: [CommonModule],
  template: '',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-separator"',
    role: 'separator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxSeparatorComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('bg-border/50 -mx-1 my-1 h-px pointer-events-none', this.class())
  );
}

// ============================================================================
// Combobox Empty Component
// ============================================================================

/**
 * Combobox Empty Component
 * Shows when no results found
 */
@Component({
  selector: 'app-combobox-empty',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-empty"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxEmptyComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'text-muted-foreground flex w-full justify-center py-2 text-center text-xs/relaxed',
      this.class()
    )
  );
}

// ============================================================================
// Combobox Collection Component
// ============================================================================

/**
 * Combobox Collection Component
 * Container for items that can be filtered
 */
@Component({
  selector: 'app-combobox-collection',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"combobox-collection"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxCollectionComponent {
  readonly class = input<string>('');
}

// ============================================================================
// Combobox Value Component
// ============================================================================

/**
 * Combobox Value Component
 * Displays the selected value(s)
 */
@Component({
  selector: 'app-combobox-value',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-value"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxValueComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('flex-1 truncate', this.class())
  );
}

// ============================================================================
// Combobox Trigger Component
// ============================================================================

/**
 * Combobox Trigger Component
 * Button to open the dropdown
 */
@Component({
  selector: 'app-combobox-trigger',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <ng-content />
    <lucide-icon
      [img]="chevronDownIcon"
      class="text-muted-foreground size-3.5 pointer-events-none" />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-trigger"',
    '[attr.aria-expanded]': 'combobox.open()',
    '[attr.aria-haspopup]': '"listbox"',
    '[attr.disabled]': 'combobox.disabled() ? true : null',
    '(click)': 'onClick()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxTriggerComponent {
  readonly combobox = inject<ComboboxRootToken>(ComboboxRootToken);

  readonly class = input<string>('');

  protected readonly chevronDownIcon = ChevronDownIcon;

  protected readonly computedClass = computed(() =>
    cn(
      "[&_svg:not([class*='size-'])]:size-3.5",
      "flex items-center justify-center",
      this.class()
    )
  );

  onClick(): void {
    this.combobox.toggleCombobox();
  }
}

// ============================================================================
// Combobox Clear Component
// ============================================================================

/**
 * Combobox Clear Component
 * Button to clear the selection
 */
@Component({
  selector: 'app-combobox-clear',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <lucide-icon [img]="xIcon" class="pointer-events-none" />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-clear"',
    '[attr.disabled]': 'combobox.disabled() ? true : null',
    '(click)': 'onClick()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxClearComponent {
  readonly combobox = inject<ComboboxRootToken>(ComboboxRootToken);

  readonly class = input<string>('');

  protected readonly xIcon = XIcon;

  protected readonly computedClass = computed(() =>
    cn(
      'size-6 p-0 flex items-center justify-center rounded-md hover:bg-muted transition-colors',
      'disabled:pointer-events-none disabled:opacity-50',
      this.class()
    )
  );

  onClick(): void {
    if (!this.combobox.disabled()) {
      this.combobox.clearValue();
    }
  }
}

// ============================================================================
// Combobox List Component
// ============================================================================

/**
 * Combobox List Component
 * Scrollable container for items
 */
@Component({
  selector: 'app-combobox-list',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-list"',
    role: 'listbox',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxListComponent {
  readonly class = input<string>('');
  readonly fixedHeight = input<boolean>(false);

  protected readonly computedClass = computed(() =>
    cn(
      'block w-full overflow-y-auto overscroll-contain scroll-py-1 p-1',
      this.fixedHeight() ? 'h-72 max-h-72' : 'max-h-72',
      this.class()
    )
  );
}

// ============================================================================
// Combobox Content Component
// ============================================================================

/**
 * Combobox Content Component
 * The dropdown panel
 */
@Component({
  selector: 'app-combobox-content',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-content"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxContentComponent {
  readonly side = input<ComboboxSide>('bottom');
  readonly sideOffset = input<number>(6);
  readonly align = input<ComboboxAlign>('start');
  readonly alignOffset = input<number>(0);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'bg-popover text-popover-foreground ring-foreground/10 rounded-lg shadow-md ring-1 duration-100',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      'overflow-hidden',
      'relative max-h-96 min-w-32',
      this.class()
    )
  );
}

// ============================================================================
// Combobox Input Component
// ============================================================================

/**
 * Combobox Input Component
 * Search input for filtering items
 */
@Component({
  selector: 'app-combobox-input',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-input/20 dark:bg-input/30 border-input focus-within:border-ring focus-within:ring-ring/30 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive dark:has-aria-invalid:border-destructive/50 flex h-7 rounded-md border bg-clip-padding transition-colors focus-within:ring-2 has-aria-invalid:ring-2 w-auto group/input-group">
      <input
        [class]="inputClass()"
        [type]="'text'"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [value]="inputValue()"
        [attr.aria-expanded]="combobox.open()"
        [attr.aria-haspopup]="'listbox'"
        [attr.aria-autocomplete]="'list'"
        [attr.role]="'combobox'"
        [attr.data-slot]="'combobox-input'"
        (input)="onInput($event)"
        (focus)="onFocus()"
        (keydown)="onKeydown($event)"
      />
      <div class="flex items-center gap-0.5 pr-1">
        @if (shouldShowTrigger()) {
          <button
            type="button"
            [class]="triggerButtonClass()"
            [disabled]="disabled()"
            (click)="onTriggerClick()"
            data-slot="input-group-button">
            <lucide-icon [img]="chevronDownIcon" class="size-3.5 pointer-events-none" />
          </button>
        }
        @if (shouldShowClear()) {
          <button
            type="button"
            [class]="clearButtonClass()"
            [disabled]="disabled()"
            [attr.data-slot]="'combobox-clear'"
            (click)="onClearClick($event)">
            <lucide-icon [img]="xIcon" class="pointer-events-none" />
          </button>
        }
      </div>
      <ng-content />
    </div>
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-input-wrapper"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxInputComponent {
  readonly combobox = inject<ComboboxRootToken>(ComboboxRootToken);

  readonly placeholder = input<string>('Search...');
  readonly disabled = input<boolean>(false);
  readonly showTrigger = input<boolean>(true);
  readonly showClear = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly chevronDownIcon = ChevronDownIcon;
  protected readonly xIcon = XIcon;

  protected readonly searchTerm = computed(() => this.combobox.searchTerm());

  protected readonly hasValue = computed(() => {
    const value = this.combobox.value();
    if (this.combobox.multiple()) {
      return Array.isArray(value) && value.length > 0;
    }
    return value !== undefined && value !== null;
  });

  protected readonly shouldShowClear = computed(() =>
    this.showClear() && this.hasValue()
  );

  protected readonly shouldShowTrigger = computed(() =>
    this.showTrigger() && !(this.shouldShowClear() && !this.combobox.multiple())
  );

  protected readonly computedClass = computed(() =>
    cn('w-auto', this.class())
  );

  protected readonly inputValue = computed(() => {
    const searchTerm = this.searchTerm();
    if (this.combobox.multiple()) {
      return searchTerm;
    }
    return searchTerm || this.combobox.getDisplayValue();
  });

  protected readonly inputClass = computed(() =>
    cn(
      'rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0',
      'flex-1 h-full px-2 py-0.5 text-xs/relaxed outline-none placeholder:text-muted-foreground',
      'disabled:cursor-not-allowed disabled:opacity-50'
    )
  );

  protected readonly triggerButtonClass = computed(() =>
    cn(
      'size-6 p-0 flex items-center justify-center rounded-sm hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 transition-colors',
      'data-pressed:bg-transparent',
      'disabled:pointer-events-none disabled:opacity-50'
    )
  );

  protected readonly clearButtonClass = computed(() =>
    cn(
      'size-6 p-0 flex items-center justify-center rounded-sm hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 transition-colors',
      'disabled:pointer-events-none disabled:opacity-50'
    )
  );

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.combobox.searchTerm.set(target.value);
    if (!this.combobox.open()) {
      this.combobox.openCombobox();
    }
  }

  protected onFocus(): void {
    if (!this.combobox.disabled()) {
      this.combobox.openCombobox();
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.combobox.closeCombobox();
    } else if (event.key === 'Enter') {
      // Selection is handled by item click
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!this.combobox.open()) {
        this.combobox.openCombobox();
      }
    }
  }

  protected onTriggerClick(): void {
    this.combobox.toggleCombobox();
  }

  protected onClearClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.combobox.clearValue();
    this.combobox.closeCombobox();
  }
}

// ============================================================================
// Combobox Chips Component (for multiple selection)
// ============================================================================

/**
 * Combobox Chips Component
 * Container for chips in multiple selection mode
 */
@Component({
  selector: 'app-combobox-chips',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-chips"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxChipsComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'bg-input/20 dark:bg-input/30 border-input focus-within:border-ring focus-within:ring-ring/30 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive dark:has-aria-invalid:border-destructive/50 flex min-h-7 flex-wrap items-center gap-1 rounded-md border bg-clip-padding px-2 py-0.5 text-xs/relaxed transition-colors focus-within:ring-2 has-aria-invalid:ring-2 has-data-[slot=combobox-chip]:px-1',
      this.class()
    )
  );
}

// ============================================================================
// Combobox Chip Component
// ============================================================================

/**
 * Combobox Chip Component
 * Individual chip for selected item in multiple selection
 */
@Component({
  selector: 'app-combobox-chip',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <ng-content />
    @if (showRemove()) {
      <button
        type="button"
        class="-ml-1 opacity-50 hover:opacity-100 size-4 p-0 flex items-center justify-center"
        data-slot="combobox-chip-remove"
        (click)="onRemove($event)">
        <lucide-icon [img]="xIcon" class="pointer-events-none size-3" />
      </button>
    }
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-chip"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxChipComponent<T = unknown> {
  readonly combobox = inject<ComboboxRootToken<T>>(ComboboxRootToken);

  readonly value = input.required<T>();
  readonly showRemove = input<boolean>(true);
  readonly class = input<string>('');

  protected readonly xIcon = XIcon;

  protected readonly computedClass = computed(() =>
    cn(
      'bg-muted-foreground/10 text-foreground flex h-[calc(--spacing(4.75))] w-fit items-center justify-center gap-1 rounded-[calc(var(--radius-sm)-2px)] px-1.5 text-xs/relaxed font-medium whitespace-nowrap has-data-[slot=combobox-chip-remove]:pr-0 has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50',
      this.class()
    )
  );

  protected onRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.combobox.deselectValue(this.value());
  }
}

// ============================================================================
// Combobox Chips Input Component
// ============================================================================

/**
 * Combobox Chips Input Component
 * Input field inside chips container
 */
@Component({
  selector: 'app-combobox-chips-input',
  imports: [CommonModule],
  template: `
    <input
      [class]="computedClass()"
      [type]="'text'"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [value]="searchTerm()"
      [attr.aria-expanded]="combobox.open()"
      [attr.aria-haspopup]="'listbox'"
      [attr.aria-autocomplete]="'list'"
      [attr.role]="'combobox'"
      [attr.data-slot]="'combobox-chip-input'"
      (input)="onInput($event)"
      (focus)="onFocus()"
      (keydown)="onKeydown($event)"
    />
  `,
  host: {
    '[class]': 'wrapperClass()',
    '[attr.data-slot]': '"combobox-chips-input-wrapper"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxChipsInputComponent {
  readonly combobox = inject<ComboboxRootToken>(ComboboxRootToken);

  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly searchTerm = computed(() => this.combobox.searchTerm());

  protected readonly wrapperClass = computed(() =>
    cn('min-w-16 flex-1', this.class())
  );

  protected readonly computedClass = computed(() =>
    cn(
      'w-full h-full outline-none bg-transparent text-xs/relaxed',
      'placeholder:text-muted-foreground',
      'disabled:cursor-not-allowed disabled:opacity-50'
    )
  );

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.combobox.searchTerm.set(target.value);
    if (!this.combobox.open()) {
      this.combobox.openCombobox();
    }
  }

  protected onFocus(): void {
    if (!this.combobox.disabled()) {
      this.combobox.openCombobox();
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.combobox.closeCombobox();
    } else if (event.key === 'Backspace' && !this.combobox.searchTerm()) {
      // Remove last selected item on backspace if input is empty
      const currentValue = this.combobox.value();
      if (Array.isArray(currentValue) && currentValue.length > 0) {
        this.combobox.deselectValue(currentValue[currentValue.length - 1]);
      }
    }
  }
}

// ============================================================================
// Combobox Root Component
// ============================================================================

let comboboxIdCounter = 0;

/**
 * Combobox Root Component
 * Main container with CDK Overlay for positioning
 */
@Component({
  selector: 'app-combobox',
  imports: [
    CommonModule,
    OverlayModule,
  ],
  template: `
    <div class="inline-flex w-full">
      <!-- Trigger element -->
      <div cdkOverlayOrigin #trigger="cdkOverlayOrigin" class="w-full">
        <ng-content select="app-combobox-input, app-combobox-chips" />
      </div>

      <!-- Dropdown content via CDK Overlay -->
      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="trigger"
        [cdkConnectedOverlayOpen]="open()"
        [cdkConnectedOverlayPositions]="positions()"
        [cdkConnectedOverlayWidth]="triggerWidth()"
        [cdkConnectedOverlayHasBackdrop]="false"
        (overlayOutsideClick)="onOutsideClick($event)"
        (detach)="closeCombobox()">
        <div
          [class]="contentClass()"
          role="listbox"
          [attr.data-state]="open() ? 'open' : 'closed'"
          [attr.data-side]="side()"
          (keydown)="onContentKeydown($event)">
          <ng-content select="app-combobox-content, app-combobox-list, app-combobox-item, app-combobox-group, app-combobox-label, app-combobox-separator, app-combobox-empty" />
        </div>
      </ng-template>
    </div>
  `,
  host: {
    '[attr.data-slot]': '"combobox"',
    '[class]': 'class()',
  },
  providers: [
    {
      provide: ComboboxRootToken,
      useExisting: forwardRef(() => ComboboxComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxComponent<T = unknown> implements ComboboxRootToken<T> {
  readonly value = model<T | T[] | undefined>(undefined);
  readonly multiple = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly placeholder = input<string>('Select an option');
  readonly filterMode = input<boolean>(true);
  readonly side = input<ComboboxSide>('bottom');
  readonly sideOffset = input<number>(6);
  readonly align = input<ComboboxAlign>('start');
  readonly alignOffset = input<number>(0);
  readonly class = input<string>('');

  readonly valueChange = output<T | T[] | undefined>();

  readonly open = signal<boolean>(false);
  readonly searchTerm = signal<string>('');
  private readonly itemLabels = new Map<T, string>();

  readonly id = `combobox-${comboboxIdCounter++}`;

  protected readonly trigger = viewChild(CdkOverlayOrigin);

  protected readonly positions = computed<ConnectedPosition[]>(() => {
    const alignX = this.align() === 'start' ? 'start' : this.align() === 'end' ? 'end' : 'center';
    const positions: ConnectedPosition[] = [];

    if (this.side() === 'bottom') {
      positions.push({
        originX: alignX,
        originY: 'bottom',
        overlayX: alignX,
        overlayY: 'top',
        offsetY: this.sideOffset(),
      });
    }

    if (this.side() === 'top') {
      positions.push({
        originX: alignX,
        originY: 'top',
        overlayX: alignX,
        overlayY: 'bottom',
        offsetY: -this.sideOffset(),
      });
    }

    // Fallback position
    positions.push({
      originX: alignX,
      originY: this.side() === 'bottom' ? 'top' : 'bottom',
      overlayX: alignX,
      overlayY: this.side() === 'bottom' ? 'bottom' : 'top',
      offsetY: this.side() === 'bottom' ? -this.sideOffset() : this.sideOffset(),
    });

    return positions;
  });

  protected readonly contentClass = computed(() =>
    cn(
      'bg-popover text-popover-foreground ring-foreground/10 rounded-lg shadow-md ring-1 duration-100 z-50',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      'data-[side=top]:slide-in-from-bottom-2',
      'overflow-hidden',
      'relative max-h-96',
      'w-full'
    )
  );

  protected readonly triggerWidth = computed(() => {
    const triggerEl = this.trigger()?.elementRef?.nativeElement;
    return triggerEl?.offsetWidth ?? 200;
  });

  openCombobox(): void {
    if (!this.disabled()) {
      this.open.set(true);
    }
  }

  closeCombobox(): void {
    this.open.set(false);
    this.searchTerm.set('');
  }

  toggleCombobox(): void {
    if (this.disabled()) return;
    if (this.open()) {
      this.closeCombobox();
    } else {
      this.openCombobox();
    }
  }

  isSelected(itemValue: T): boolean {
    const currentValue = this.value();
    if (this.multiple()) {
      return Array.isArray(currentValue) && currentValue.includes(itemValue);
    }
    return currentValue === itemValue;
  }

  registerItemLabel(itemValue: T, label: string): void {
    this.itemLabels.set(itemValue, label);
  }

  getItemLabel(itemValue: T): string {
    return this.itemLabels.get(itemValue) ?? String(itemValue);
  }

  selectValue(itemValue: T): void {
    if (this.multiple()) {
      const currentValue = this.value();
      const currentArray = Array.isArray(currentValue) ? [...currentValue] : [];
      if (!currentArray.includes(itemValue)) {
        currentArray.push(itemValue);
      }
      this.value.set(currentArray as T[]);
      this.valueChange.emit(currentArray);
    } else {
      this.value.set(itemValue);
      this.valueChange.emit(itemValue);
      this.closeCombobox();
    }
  }

  deselectValue(itemValue: T): void {
    if (this.multiple()) {
      const currentValue = this.value();
      if (Array.isArray(currentValue)) {
        const newArray = currentValue.filter((v) => v !== itemValue);
        this.value.set(newArray as T[]);
        this.valueChange.emit(newArray);
      }
    } else {
      this.value.set(undefined);
      this.valueChange.emit(undefined);
    }
  }

  clearValue(): void {
    if (this.multiple()) {
      this.value.set([] as T[]);
      this.valueChange.emit([]);
    } else {
      this.value.set(undefined);
      this.valueChange.emit(undefined);
    }
  }

  getDisplayValue(): string {
    const currentValue = this.value();
    if (this.multiple()) {
      if (Array.isArray(currentValue) && currentValue.length > 0) {
        return `${currentValue.length} selected`;
      }
      return '';
    }
    if (currentValue !== undefined && currentValue !== null) {
      return this.getItemLabel(currentValue as T);
    }
    return '';
  }

  protected onContentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeCombobox();
    }
  }

  protected onOutsideClick(event: MouseEvent): void {
    const triggerEl = this.trigger()?.elementRef?.nativeElement;
    if (triggerEl && !triggerEl.contains(event.target as Node)) {
      this.closeCombobox();
    }
  }
}

// ============================================================================
// Exports
// ============================================================================

export const ComboboxComponents = [
  ComboboxComponent,
  ComboboxValueComponent,
  ComboboxTriggerComponent,
  ComboboxClearComponent,
  ComboboxInputComponent,
  ComboboxContentComponent,
  ComboboxListComponent,
  ComboboxItemComponent,
  ComboboxGroupComponent,
  ComboboxLabelComponent,
  ComboboxCollectionComponent,
  ComboboxEmptyComponent,
  ComboboxSeparatorComponent,
  ComboboxChipsComponent,
  ComboboxChipComponent,
  ComboboxChipsInputComponent,
];
