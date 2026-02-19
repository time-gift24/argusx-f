import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EffectRef,
  Injector,
  OnDestroy,
  OnInit,
  computed,
  contentChild,
  effect,
  forwardRef,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { CdkOverlayOrigin, ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckIcon, ChevronDownIcon, LucideAngularModule, XIcon } from 'lucide-angular';

import { cn } from '../../utils/cn';

export type ArgusxComboboxAlign = 'start' | 'center' | 'end';
export type ArgusxComboboxSide = 'top' | 'bottom';
export type ArgusxComboboxVariant = 'plain';
export type ArgusxComboboxSize = 'sm' | 'default';

export interface ArgusxComboboxItemData<T = unknown> {
  value: T;
  label: string;
  disabled?: boolean;
}

export abstract class ArgusxComboboxRootToken<T = unknown> {
  abstract value: ReturnType<typeof model<T | T[] | undefined>>;
  abstract multiple: () => boolean;
  abstract disabled: () => boolean;
  abstract variant: () => ArgusxComboboxVariant;
  abstract size: () => ArgusxComboboxSize;
  abstract open: ReturnType<typeof model<boolean>>;
  abstract searchTerm: ReturnType<typeof signal<string>>;
  abstract highlightedValue: ReturnType<typeof signal<T | undefined>>;
  abstract hasVisibleItems: () => boolean;
  abstract openCombobox: () => void;
  abstract closeCombobox: () => void;
  abstract toggleCombobox: () => void;
  abstract isSelected: (value: T) => boolean;
  abstract selectValue: (value: T) => void;
  abstract deselectValue: (value: T) => void;
  abstract clearValue: () => void;
  abstract getDisplayValue: () => string;
  abstract setHighlightedValue: (value: T | undefined) => void;
  abstract selectHighlighted: () => void;
  abstract registerItemLabel: (value: T, label: string) => void;
  abstract getItemLabel: (value: T) => string;
  abstract registerItem: (isVisible: () => boolean) => number;
  abstract unregisterItem: (id: number) => void;
}

@Component({
  selector: 'argusx-combobox-item',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <span class="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
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
    '[attr.data-state]': 'isSelected() ? "checked" : "unchecked"',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-highlighted]': 'isHighlighted() ? "" : null',
    '[attr.hidden]': 'isVisible() ? null : ""',
    '[attr.role]': '"option"',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.tabindex]': 'disabled() ? null : "-1"',
    '(click)': 'onClick()',
    '(mousemove)': 'onMouseMove()',
    '(keydown)': 'onKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxComboboxItemComponent<T = unknown> implements OnInit, OnDestroy {
  private readonly combobox = inject<ArgusxComboboxRootToken<T>>(ArgusxComboboxRootToken);
  private readonly injector = inject(Injector);

  readonly value = input.required<T>();
  readonly label = input<string>('');
  readonly class = input<string>('');
  readonly disabled = input<boolean>(false);

  protected readonly checkIcon = CheckIcon;

  private readonly resolvedLabel = computed(() => {
    const label = this.label().trim();
    return label || String(this.value());
  });

  protected readonly isSelected = computed(() => this.combobox.isSelected(this.value()));
  protected readonly isHighlighted = computed(
    () => this.combobox.highlightedValue() === this.value()
  );
  protected readonly isVisible = computed(() => {
    const searchTerm = this.combobox.searchTerm().trim().toLowerCase();
    if (!searchTerm) {
      return true;
    }

    const label = this.resolvedLabel().toLowerCase();
    const valueText = String(this.value()).toLowerCase();
    return label.includes(searchTerm) || valueText.includes(searchTerm);
  });

  protected readonly computedClass = computed(() =>
    cn(
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-xs/relaxed outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
      this.class()
    )
  );

  private itemId: number | null = null;
  private labelSyncEffect: EffectRef | null = null;

  ngOnInit(): void {
    this.itemId = this.combobox.registerItem(() => this.isVisible());
    this.labelSyncEffect = effect(
      () => {
        this.combobox.registerItemLabel(this.value(), this.resolvedLabel());
      },
      { injector: this.injector }
    );
  }

  ngOnDestroy(): void {
    if (this.itemId !== null) {
      this.combobox.unregisterItem(this.itemId);
      this.itemId = null;
    }

    this.labelSyncEffect?.destroy();
    this.labelSyncEffect = null;
  }

  protected onMouseMove(): void {
    if (this.disabled() || !this.isVisible()) {
      return;
    }

    this.combobox.setHighlightedValue(this.value());
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.onClick();
  }

  protected onClick(): void {
    if (this.disabled() || !this.isVisible()) {
      return;
    }

    this.combobox.setHighlightedValue(this.value());
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

@Component({
  selector: 'argusx-combobox-group',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-group"',
    role: 'group',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxComboboxGroupComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn('p-1', this.class()));
}

@Component({
  selector: 'argusx-combobox-label',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-label"',
    role: 'presentation',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxComboboxLabelComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('text-muted-foreground px-2 py-1.5 text-xs', this.class())
  );
}

@Component({
  selector: 'argusx-combobox-separator',
  imports: [CommonModule],
  template: '',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-separator"',
    role: 'separator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxComboboxSeparatorComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn('bg-border -mx-1 my-1 h-px', this.class()));
}

@Component({
  selector: 'argusx-combobox-empty',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-empty"',
    '[attr.hidden]': 'combobox.hasVisibleItems() ? "" : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxComboboxEmptyComponent {
  private readonly combobox = inject<ArgusxComboboxRootToken>(ArgusxComboboxRootToken);

  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('text-muted-foreground flex w-full justify-center py-2 text-center text-xs/relaxed', this.class())
  );
}

@Component({
  selector: 'argusx-combobox-collection',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[attr.data-slot]': '"combobox-collection"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxComboboxCollectionComponent {}

@Component({
  selector: 'argusx-combobox-value',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-value"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxComboboxValueComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() => cn('flex-1 truncate', this.class()));
}

@Component({
  selector: 'argusx-combobox-trigger',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <ng-content />
    <lucide-icon
      [img]="chevronDownIcon"
      data-slot="combobox-trigger-icon"
      class="text-muted-foreground pointer-events-none size-3.5" />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-trigger"',
    '[attr.data-size]': 'combobox.size()',
    '[attr.data-variant]': 'combobox.variant()',
    '[attr.aria-expanded]': 'combobox.open()',
    '[attr.aria-haspopup]': '"listbox"',
    '[attr.aria-disabled]': 'combobox.disabled()',
    '[attr.role]': '"combobox"',
    '[attr.tabindex]': 'combobox.disabled() ? null : "0"',
    '(click)': 'onClick()',
    '(keydown)': 'onKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxComboboxTriggerComponent {
  protected readonly combobox = inject<ArgusxComboboxRootToken>(ArgusxComboboxRootToken);

  readonly class = input<string>('');

  protected readonly chevronDownIcon = ChevronDownIcon;

  protected readonly computedClass = computed(() =>
    cn(
      "[&_svg:not([class*='size-'])]:size-3.5 inline-flex items-center justify-between gap-1.5",
      this.class()
    )
  );

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.combobox.openCombobox();
  }

  protected onClick(): void {
    this.combobox.toggleCombobox();
  }
}

@Component({
  selector: 'argusx-combobox-clear',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <lucide-icon [img]="xIcon" class="pointer-events-none size-3.5" />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-clear"',
    '[attr.data-size]': 'combobox.size()',
    '[attr.data-disabled]': 'combobox.disabled() ? "true" : null',
    '[attr.aria-disabled]': 'combobox.disabled()',
    '(click)': 'onClick($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxComboboxClearComponent {
  protected readonly combobox = inject<ArgusxComboboxRootToken>(ArgusxComboboxRootToken);

  readonly class = input<string>('');

  protected readonly xIcon = XIcon;

  protected readonly computedClass = computed(() =>
    cn(
      'hover:bg-muted inline-flex size-6 items-center justify-center rounded-sm transition-colors data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
      this.class()
    )
  );

  protected onClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.combobox.disabled()) {
      return;
    }

    this.combobox.clearValue();
    this.combobox.closeCombobox();
  }
}

@Component({
  selector: 'argusx-combobox-list',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-list"',
    '[attr.data-empty]': 'combobox.hasVisibleItems() ? null : ""',
    role: 'listbox',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxComboboxListComponent {
  private readonly combobox = inject<ArgusxComboboxRootToken>(ArgusxComboboxRootToken);

  readonly class = input<string>('');
  readonly fixedHeight = input<boolean>(false);

  protected readonly computedClass = computed(() =>
    cn(
      'max-h-[min(calc(--spacing(96)---spacing(9)),calc(100vh---spacing(9)))] scroll-py-1 overflow-y-auto p-1',
      this.fixedHeight() && 'h-72',
      this.class()
    )
  );
}

@Component({
  selector: 'argusx-combobox-content',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-content"',
    '[attr.data-state]': 'combobox.open() ? "open" : "closed"',
    '[attr.data-side]': 'side()',
    '[attr.data-variant]': 'combobox.variant()',
    '[attr.data-size]': 'combobox.size()',
    '[attr.data-chips]': 'anchor() ? "" : null',
    '(keydown)': 'onKeydown($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxComboboxContentComponent {
  private readonly combobox = inject<ArgusxComboboxRootToken>(ArgusxComboboxRootToken);

  readonly side = input<ArgusxComboboxSide>('bottom');
  readonly sideOffset = input<number>(6);
  readonly align = input<ArgusxComboboxAlign>('start');
  readonly alignOffset = input<number>(0);
  readonly anchor = input<CdkOverlayOrigin | null>(null);
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 relative max-h-96 min-w-52 overflow-hidden rounded-md shadow-sm ring-1 duration-100',
      this.class()
    )
  );

  protected onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.combobox.closeCombobox();
        break;
      case 'Enter':
        this.combobox.selectHighlighted();
        break;
      default:
        break;
    }
  }
}

@Component({
  selector: 'argusx-combobox-input',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div [class]="groupClass()">
      <input
        [class]="inputClass()"
        [type]="'text'"
        [placeholder]="placeholder()"
        [disabled]="isDisabled()"
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
            [disabled]="isDisabled()"
            data-slot="input-group-button"
            (click)="onTriggerClick($event)">
            <lucide-icon [img]="chevronDownIcon" class="size-3.5 pointer-events-none" />
          </button>
        }

        @if (shouldShowClear()) {
          <button
            type="button"
            [class]="clearButtonClass()"
            [disabled]="isDisabled()"
            [attr.data-slot]="'combobox-clear'"
            (click)="onClearClick($event)">
            <lucide-icon [img]="xIcon" class="pointer-events-none size-3.5" />
          </button>
        }
      </div>

      <ng-content />
    </div>
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-input-wrapper"',
    '[attr.data-size]': 'combobox.size()',
    '[attr.data-variant]': 'combobox.variant()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxComboboxInputComponent {
  protected readonly combobox = inject<ArgusxComboboxRootToken>(ArgusxComboboxRootToken);

  readonly placeholder = input<string>('Search...');
  readonly disabled = input<boolean | null>(null);
  readonly showTrigger = input<boolean>(true);
  readonly showClear = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly chevronDownIcon = ChevronDownIcon;
  protected readonly xIcon = XIcon;

  protected readonly hasValue = computed(() => {
    const value = this.combobox.value();
    if (this.combobox.multiple()) {
      return Array.isArray(value) && value.length > 0;
    }

    return value !== undefined && value !== null;
  });

  protected readonly isDisabled = computed(() => this.disabled() ?? this.combobox.disabled());
  protected readonly shouldShowClear = computed(() => this.showClear() && this.hasValue());
  protected readonly shouldShowTrigger = computed(
    () => this.showTrigger() && !(this.shouldShowClear() && !this.combobox.multiple())
  );

  protected readonly inputValue = computed(() => {
    const searchTerm = this.combobox.searchTerm();
    if (this.combobox.multiple()) {
      return searchTerm;
    }

    return searchTerm || this.combobox.getDisplayValue();
  });

  protected readonly computedClass = computed(() => cn('w-auto', this.class()));
  protected readonly groupClass = computed(() =>
    cn(
      'border-input bg-input/20 focus-within:border-ring focus-within:ring-ring/30 flex w-auto rounded-md border transition-colors focus-within:ring-2',
      this.combobox.size() === 'sm' ? 'h-7' : 'h-8'
    )
  );
  protected readonly inputClass = computed(() =>
    cn(
      'h-full flex-1 rounded-none border-0 bg-transparent px-2 py-0.5 text-xs/relaxed outline-none placeholder:text-muted-foreground focus-visible:ring-0',
      this.combobox.size() === 'sm' ? 'text-xs/relaxed' : 'text-sm',
      'disabled:cursor-not-allowed disabled:opacity-50'
    )
  );
  protected readonly triggerButtonClass = computed(() =>
    cn(
      'hover:bg-muted inline-flex size-6 items-center justify-center rounded-sm transition-colors',
      'disabled:pointer-events-none disabled:opacity-50 data-[pressed=true]:bg-transparent'
    )
  );
  protected readonly clearButtonClass = computed(() =>
    cn(
      'hover:bg-muted inline-flex size-6 items-center justify-center rounded-sm transition-colors',
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
    if (!this.isDisabled()) {
      this.combobox.openCombobox();
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        this.combobox.closeCombobox();
        return;
      case 'ArrowDown':
      case 'ArrowUp':
        if (!this.combobox.open()) {
          this.combobox.openCombobox();
        }
        return;
      case 'Enter':
        if (this.combobox.open()) {
          this.combobox.selectHighlighted();
        }
        return;
      default:
        return;
    }
  }

  protected onTriggerClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.combobox.toggleCombobox();
  }

  protected onClearClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.combobox.clearValue();
    this.combobox.closeCombobox();
  }
}

@Component({
  selector: 'argusx-combobox-chips',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"combobox-chips"',
    '[attr.data-size]': 'combobox.size()',
    '[attr.data-variant]': 'combobox.variant()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxComboboxChipsComponent {
  private readonly combobox = inject<ArgusxComboboxRootToken>(ArgusxComboboxRootToken);

  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'border-input bg-background focus-within:border-ring focus-within:ring-ring/30 flex min-h-8 flex-wrap items-center gap-1.5 rounded-md border px-2 py-1 transition-colors focus-within:ring-2',
      this.combobox.size() === 'sm' ? 'text-xs/relaxed' : 'text-sm',
      this.class()
    )
  );
}

@Component({
  selector: 'argusx-combobox-chip',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <ng-content />
    @if (showRemove()) {
      <button
        type="button"
        class="-ml-1 inline-flex size-4 items-center justify-center opacity-50 transition-opacity hover:opacity-100"
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
export class ArgusxComboboxChipComponent<T = unknown> {
  private readonly combobox = inject<ArgusxComboboxRootToken<T>>(ArgusxComboboxRootToken);

  readonly value = input.required<T>();
  readonly showRemove = input<boolean>(true);
  readonly class = input<string>('');

  protected readonly xIcon = XIcon;

  protected readonly computedClass = computed(() =>
    cn(
      'bg-muted text-foreground inline-flex h-5 items-center gap-1 rounded-sm px-1.5 text-xs font-medium whitespace-nowrap',
      'has-data-[slot=combobox-chip-remove]:pr-0',
      this.class()
    )
  );

  protected onRemove(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.combobox.deselectValue(this.value());
  }
}

@Component({
  selector: 'argusx-combobox-chips-input',
  imports: [CommonModule],
  template: `
    <input
      [class]="computedClass()"
      [type]="'text'"
      [placeholder]="placeholder()"
      [disabled]="disabled() ?? combobox.disabled()"
      [value]="combobox.searchTerm()"
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
export class ArgusxComboboxChipsInputComponent {
  protected readonly combobox = inject<ArgusxComboboxRootToken>(ArgusxComboboxRootToken);

  readonly placeholder = input<string>('');
  readonly disabled = input<boolean | null>(null);
  readonly class = input<string>('');

  protected readonly wrapperClass = computed(() => cn('min-w-16 flex-1', this.class()));
  protected readonly computedClass = computed(() =>
    cn(
      'w-full bg-transparent text-xs/relaxed outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
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
      return;
    }

    if (event.key === 'Backspace' && !this.combobox.searchTerm()) {
      const currentValue = this.combobox.value();
      if (Array.isArray(currentValue) && currentValue.length > 0) {
        this.combobox.deselectValue(currentValue[currentValue.length - 1]);
      }
    }
  }
}

let argusxComboboxIdCounter = 0;

@Component({
  selector: 'argusx-combobox',
  imports: [CommonModule, OverlayModule],
  template: `
    <div class="inline-flex w-full">
      <div cdkOverlayOrigin #trigger="cdkOverlayOrigin" class="w-full">
        <ng-content select="argusx-combobox-input, argusx-combobox-chips, argusx-combobox-trigger" />
      </div>

      <ng-template
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="content()?.anchor() ?? trigger"
        [cdkConnectedOverlayOpen]="open()"
        [cdkConnectedOverlayPositions]="positions()"
        [cdkConnectedOverlayWidth]="overlayWidth()"
        [cdkConnectedOverlayHasBackdrop]="false"
        (overlayOutsideClick)="onOutsideClick($event)"
        (detach)="closeCombobox()">
        <ng-content select="argusx-combobox-content" />
      </ng-template>
    </div>
  `,
  host: {
    '[attr.data-slot]': '"combobox"',
    '[attr.data-size]': 'size()',
    '[attr.data-variant]': 'variant()',
    '[class]': 'class()',
  },
  providers: [
    {
      provide: ArgusxComboboxRootToken,
      useExisting: forwardRef(() => ArgusxComboboxComponent),
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArgusxComboboxComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxComboboxComponent<T = unknown>
  implements ArgusxComboboxRootToken<T>, ControlValueAccessor
{
  readonly value = model<T | T[] | undefined>(undefined);
  readonly open = model<boolean>(false);
  readonly multiple = input<boolean>(false);
  readonly disabledInput = input<boolean>(false, { alias: 'disabled' });
  readonly variant = input<ArgusxComboboxVariant>('plain');
  readonly size = input<ArgusxComboboxSize>('default');
  readonly class = input<string>('');

  readonly searchTerm = signal<string>('');
  readonly highlightedValue = signal<T | undefined>(undefined);
  readonly disabled = computed(() => this.disabledInput() || this.formDisabled());

  private readonly formDisabled = signal<boolean>(false);
  private readonly itemLabels = new Map<T, string>();
  private readonly itemVisibilityMap = signal(new Map<number, () => boolean>());
  private nextItemId = 0;

  readonly id = `argusx-combobox-${argusxComboboxIdCounter++}`;

  protected readonly trigger = viewChild(CdkOverlayOrigin);
  protected readonly content = contentChild(ArgusxComboboxContentComponent);

  readonly hasVisibleItems = computed(() => {
    const visibilityMap = this.itemVisibilityMap();
    if (visibilityMap.size === 0) {
      return false;
    }

    for (const isVisible of visibilityMap.values()) {
      if (isVisible()) {
        return true;
      }
    }

    return false;
  });

  protected readonly positions = computed<ConnectedPosition[]>(() => {
    const content = this.content();
    const side = content?.side() ?? 'bottom';
    const align = content?.align() ?? 'start';
    const sideOffset = content?.sideOffset() ?? 6;
    const alignOffset = content?.alignOffset() ?? 0;

    const alignX: ConnectedPosition['originX'] =
      align === 'center' ? 'center' : align === 'end' ? 'end' : 'start';

    const positions: ConnectedPosition[] = [];

    if (side === 'bottom') {
      positions.push({
        originX: alignX,
        originY: 'bottom',
        overlayX: alignX,
        overlayY: 'top',
        offsetY: sideOffset,
        offsetX: alignOffset,
      });
    }

    if (side === 'top') {
      positions.push({
        originX: alignX,
        originY: 'top',
        overlayX: alignX,
        overlayY: 'bottom',
        offsetY: -sideOffset,
        offsetX: alignOffset,
      });
    }

    positions.push({
      originX: alignX,
      originY: side === 'bottom' ? 'top' : 'bottom',
      overlayX: alignX,
      overlayY: side === 'bottom' ? 'bottom' : 'top',
      offsetY: side === 'bottom' ? -sideOffset : sideOffset,
      offsetX: alignOffset,
    });

    return positions;
  });

  protected readonly overlayWidth = computed(() => {
    const anchor = this.content()?.anchor() ?? this.trigger();
    const element = anchor?.elementRef.nativeElement;
    return element?.offsetWidth ?? 220;
  });

  private onChange: (value: T | T[] | undefined) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      this.onChange(this.value());
    });
  }

  openCombobox(): void {
    if (this.disabled()) {
      return;
    }

    this.open.set(true);
  }

  closeCombobox(): void {
    if (!this.open()) {
      return;
    }

    this.open.set(false);
    this.searchTerm.set('');
    this.highlightedValue.set(undefined);
    this.onTouched();
  }

  toggleCombobox(): void {
    if (this.disabled()) {
      return;
    }

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

  selectValue(itemValue: T): void {
    if (this.multiple()) {
      const currentValue = this.value();
      const currentArray = Array.isArray(currentValue) ? [...currentValue] : [];
      if (!currentArray.includes(itemValue)) {
        currentArray.push(itemValue);
        this.value.set(currentArray as T[]);
      }
      return;
    }

    this.value.set(itemValue);
    this.closeCombobox();
  }

  deselectValue(itemValue: T): void {
    if (this.multiple()) {
      const currentValue = this.value();
      if (!Array.isArray(currentValue)) {
        return;
      }

      this.value.set(currentValue.filter((value) => value !== itemValue) as T[]);
      return;
    }

    this.value.set(undefined);
  }

  clearValue(): void {
    if (this.multiple()) {
      this.value.set([] as T[]);
      return;
    }

    this.value.set(undefined);
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

  setHighlightedValue(value: T | undefined): void {
    this.highlightedValue.set(value);
  }

  selectHighlighted(): void {
    const highlighted = this.highlightedValue();
    if (highlighted === undefined) {
      return;
    }

    if (this.isSelected(highlighted)) {
      this.deselectValue(highlighted);
    } else {
      this.selectValue(highlighted);
    }
  }

  registerItemLabel(itemValue: T, label: string): void {
    this.itemLabels.set(itemValue, label);
  }

  getItemLabel(itemValue: T): string {
    return this.itemLabels.get(itemValue) ?? String(itemValue);
  }

  registerItem(isVisible: () => boolean): number {
    const id = this.nextItemId++;
    this.itemVisibilityMap.update((current) => {
      const next = new Map(current);
      next.set(id, isVisible);
      return next;
    });
    return id;
  }

  unregisterItem(id: number): void {
    this.itemVisibilityMap.update((current) => {
      const next = new Map(current);
      next.delete(id);
      return next;
    });
  }

  writeValue(value: T | T[] | undefined): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: T | T[] | undefined) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  protected onOutsideClick(event: MouseEvent): void {
    const triggerElement = this.trigger()?.elementRef.nativeElement;
    if (triggerElement?.contains(event.target as Node)) {
      return;
    }

    this.closeCombobox();
  }
}

export const ArgusxComboboxComponents = [
  ArgusxComboboxComponent,
  ArgusxComboboxValueComponent,
  ArgusxComboboxTriggerComponent,
  ArgusxComboboxClearComponent,
  ArgusxComboboxInputComponent,
  ArgusxComboboxContentComponent,
  ArgusxComboboxListComponent,
  ArgusxComboboxItemComponent,
  ArgusxComboboxGroupComponent,
  ArgusxComboboxLabelComponent,
  ArgusxComboboxCollectionComponent,
  ArgusxComboboxEmptyComponent,
  ArgusxComboboxSeparatorComponent,
  ArgusxComboboxChipsComponent,
  ArgusxComboboxChipComponent,
  ArgusxComboboxChipsInputComponent,
] as const;
