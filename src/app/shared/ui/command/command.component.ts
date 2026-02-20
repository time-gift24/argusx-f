import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  type OnDestroy,
  type OnInit,
} from '@angular/core';
import { CheckIcon, LucideAngularModule, SearchIcon } from 'lucide-angular';

import {
  DialogComponent,
  DialogContentComponent,
  DialogDescriptionComponent,
  DialogHeaderComponent,
  DialogTitleComponent,
} from '../dialog';
import {
  focusItemByIndex,
  getCommandFocusableItems,
} from '../menu-core/focus';
import {
  argusxMenuItemVariants,
  argusxMenuLabelVariants,
  argusxMenuSeparatorVariants,
  argusxMenuShortcutVariants,
} from '../menu-core/menu.variants';
import { cn } from '../../utils/cn';

// ============================================================================
// Types
// ============================================================================

export interface ArgusxCommandItemData<T = unknown> {
  value: T;
  label: string;
  disabled?: boolean;
  keywords?: readonly string[];
}

interface ArgusxCommandRegisteredItem<T = unknown> {
  value: () => T | undefined;
  label: () => string;
  keywords: () => readonly string[];
  disabled: () => boolean;
  isVisible: () => boolean;
  element: () => HTMLElement | null;
  emitSelect: () => void;
}

// ============================================================================
// Root tokens
// ============================================================================

export abstract class ArgusxCommandRootToken<T = unknown> {
  abstract value: ReturnType<typeof model<string>>;
  abstract disabled: () => boolean;
  abstract filter: () =>
    | ((item: ArgusxCommandItemData<T>, search: string) => boolean)
    | undefined;
  abstract highlightedValue: ReturnType<typeof signal<T | undefined>>;
  abstract hasVisibleItems: () => boolean;
  abstract setSearchValue: (value: string) => void;
  abstract clearSearch: () => void;
  abstract isHighlighted: (value: T) => boolean;
  abstract setHighlightedValue: (value: T | undefined) => void;
  abstract moveHighlighted: (direction: 1 | -1) => void;
  abstract highlightBoundary: (position: 'first' | 'last') => void;
  abstract selectHighlighted: () => void;
  abstract registerItem: (item: ArgusxCommandRegisteredItem<T>) => number;
  abstract unregisterItem: (id: number) => void;
}

export abstract class ArgusxCommandGroupToken {
  abstract hasVisibleItems: () => boolean;
  abstract registerItem: (isVisible: () => boolean) => number;
  abstract unregisterItem: (id: number) => void;
}

// ============================================================================
// Root
// ============================================================================

@Component({
  selector: 'argusx-command',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command"',
    '[attr.data-variant]': '"plain"',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '(keydown)': 'onKeydown($event)',
  },
  providers: [
    {
      provide: ArgusxCommandRootToken,
      useExisting: forwardRef(() => ArgusxCommandComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCommandComponent<T = unknown>
  implements ArgusxCommandRootToken<T>
{
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly class = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly autoHighlight = input<boolean>(true);
  readonly loop = input<boolean>(true);
  readonly filter = input<(item: ArgusxCommandItemData<T>, search: string) => boolean>();

  readonly value = model<string>('');
  readonly highlightedValue = signal<T | undefined>(undefined);

  private readonly itemRegistry = signal(new Map<number, ArgusxCommandRegisteredItem<T>>());
  private nextItemId = 0;

  readonly hasVisibleItems = computed(() => this.getVisibleItems().length > 0);

  protected readonly computedClass = computed(() =>
    cn(
      'bg-popover text-popover-foreground rounded-xl p-1 flex size-full flex-col overflow-hidden',
      this.class()
    )
  );

  constructor() {
    effect(() => {
      this.value();
      const highlighted = this.highlightedValue();
      const visibleEnabledItems = this.getVisibleEnabledItems();

      if (!visibleEnabledItems.length) {
        if (highlighted !== undefined) {
          untracked(() => this.highlightedValue.set(undefined));
        }
        return;
      }

      const hasCurrent = visibleEnabledItems.some((item) =>
        Object.is(item.value(), highlighted)
      );

      if (!hasCurrent && this.autoHighlight()) {
        untracked(() => this.highlightedValue.set(visibleEnabledItems[0]!.value()));
      }
    });
  }

  setSearchValue(nextValue: string): void {
    this.value.set(nextValue);
  }

  clearSearch(): void {
    if (!this.value()) {
      return;
    }

    this.value.set('');
  }

  isHighlighted(value: T): boolean {
    return Object.is(this.highlightedValue(), value);
  }

  setHighlightedValue(value: T | undefined): void {
    this.highlightedValue.set(value);
  }

  moveHighlighted(direction: 1 | -1): void {
    const items = this.getVisibleEnabledItems();
    if (!items.length) {
      this.highlightedValue.set(undefined);
      return;
    }

    const highlighted = this.highlightedValue();
    const currentIndex = items.findIndex((item) =>
      Object.is(item.value(), highlighted)
    );

    let targetIndex = 0;
    if (currentIndex < 0) {
      targetIndex = direction === 1 ? 0 : items.length - 1;
    } else if (this.loop()) {
      targetIndex = (currentIndex + direction + items.length) % items.length;
    } else {
      targetIndex = Math.max(0, Math.min(items.length - 1, currentIndex + direction));
    }

    const targetItem = items[targetIndex];
    this.highlightedValue.set(targetItem?.value());
    focusItemByIndex(getCommandFocusableItems(this.elementRef.nativeElement), targetIndex);
  }

  highlightBoundary(position: 'first' | 'last'): void {
    const items = this.getVisibleEnabledItems();
    if (!items.length) {
      this.highlightedValue.set(undefined);
      return;
    }

    const targetItem =
      position === 'first' ? items[0] : items[items.length - 1];
    const targetIndex = position === 'first' ? 0 : -1;

    this.highlightedValue.set(targetItem?.value());
    focusItemByIndex(getCommandFocusableItems(this.elementRef.nativeElement), targetIndex);
  }

  selectHighlighted(): void {
    const highlighted = this.highlightedValue();
    if (highlighted === undefined) {
      return;
    }

    const match = this.getVisibleEnabledItems().find((item) =>
      Object.is(item.value(), highlighted)
    );

    match?.emitSelect();
  }

  registerItem(item: ArgusxCommandRegisteredItem<T>): number {
    const id = this.nextItemId++;
    this.itemRegistry.update((current) => {
      const next = new Map(current);
      next.set(id, item);
      return next;
    });
    return id;
  }

  unregisterItem(id: number): void {
    this.itemRegistry.update((current) => {
      const next = new Map(current);
      next.delete(id);
      return next;
    });
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveHighlighted(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveHighlighted(-1);
        break;
      case 'Home':
        event.preventDefault();
        this.highlightBoundary('first');
        break;
      case 'End':
        event.preventDefault();
        this.highlightBoundary('last');
        break;
      case 'Enter':
        event.preventDefault();
        this.selectHighlighted();
        break;
      case 'Escape':
        if (this.value()) {
          event.preventDefault();
          this.clearSearch();
        }
        break;
      default:
        break;
    }
  }

  private getVisibleItems(): ArgusxCommandRegisteredItem<T>[] {
    return Array.from(this.itemRegistry().values()).filter((item) => item.isVisible());
  }

  private getVisibleEnabledItems(): ArgusxCommandRegisteredItem<T>[] {
    return this.getVisibleItems().filter(
      (item) => !item.disabled() && item.value() !== undefined
    );
  }
}

// ============================================================================
// Dialog wrapper
// ============================================================================

@Component({
  selector: 'argusx-command-dialog',
  imports: [
    CommonModule,
    DialogComponent,
    DialogContentComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogDescriptionComponent,
  ],
  template: `
    <div argus-dialog [open]="open()" (openChange)="open.set($event)">
      <div
        argus-dialog-content
        [class]="contentClass()"
        [showCloseButton]="showCloseButton()">
        <div argus-dialog-header class="sr-only">
          <h3 argus-dialog-title>{{ title() }}</h3>
          <p argus-dialog-description>{{ description() }}</p>
        </div>

        <ng-content />
      </div>
    </div>
  `,
  host: {
    class: 'contents',
    '[attr.data-slot]': '"command-dialog"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCommandDialogComponent {
  readonly open = model<boolean>(false);
  readonly title = input<string>('Command Palette');
  readonly description = input<string>('Search for a command to run...');
  readonly showCloseButton = input<boolean>(false);
  readonly class = input<string>('');

  protected readonly contentClass = computed(() =>
    cn('top-1/3 -translate-y-0 overflow-hidden !gap-0 !p-0 rounded-xl', this.class())
  );
}

// ============================================================================
// Input
// ============================================================================

@Component({
  selector: 'argusx-command-input',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div data-slot="command-input-wrapper" class="p-1 pb-0">
      <div
        class="bg-input/20 dark:bg-input/30 h-8 flex items-center gap-3 rounded-md border border-input transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
        <lucide-icon
          [img]="searchIcon"
          class="text-muted-foreground size-3.5 ml-2 shrink-0 opacity-50" />

        <input
          [class]="inputClass()"
          [type]="'text'"
          [placeholder]="placeholder()"
          [disabled]="command.disabled()"
          [value]="command.value()"
          [attr.data-slot]="'command-input'"
          [attr.role]="'combobox'"
          [attr.aria-expanded]="'true'"
          [attr.aria-haspopup]="'listbox'"
          [attr.aria-autocomplete]="'list'"
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
          (input)="onInput($event)" />
      </div>
    </div>
  `,
  host: {
    '[class]': 'class()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCommandInputComponent {
  protected readonly command = inject<ArgusxCommandRootToken>(ArgusxCommandRootToken);

  readonly placeholder = input<string>('Type a command or search...');
  readonly class = input<string>('');

  protected readonly searchIcon = SearchIcon;

  protected readonly inputClass = computed(() =>
    cn(
      'w-full text-xs/relaxed outline-hidden disabled:cursor-not-allowed disabled:opacity-50 bg-transparent border-0 pr-2 py-0.5',
      this.class()
    )
  );

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.command.setSearchValue(target.value);
  }
}

// ============================================================================
// List / Empty / Group / Separator
// ============================================================================

@Component({
  selector: 'argusx-command-list',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command-list"',
    role: 'listbox',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCommandListComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'block no-scrollbar max-h-72 scroll-py-1 outline-none overflow-x-hidden overflow-y-auto',
      this.class()
    )
  );
}

@Component({
  selector: 'argusx-command-empty',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command-empty"',
    '[attr.hidden]': 'command.hasVisibleItems() ? "" : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCommandEmptyComponent {
  private readonly command = inject<ArgusxCommandRootToken>(ArgusxCommandRootToken);

  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn('py-6 text-center text-xs/relaxed', this.class())
  );
}

@Component({
  selector: 'argusx-command-group',
  imports: [CommonModule],
  template: `
    @if (heading()) {
      <div
        [class]="headingClass()"
        [attr.cmdk-group-heading]="true"
        role="presentation">
        {{ heading() }}
      </div>
    }
    <ng-content />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command-group"',
    '[attr.hidden]': 'hasVisibleItems() ? null : ""',
    role: 'group',
  },
  providers: [
    {
      provide: ArgusxCommandGroupToken,
      useExisting: forwardRef(() => ArgusxCommandGroupComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCommandGroupComponent implements ArgusxCommandGroupToken {
  readonly heading = input<string>('');
  readonly class = input<string>('');

  private readonly itemVisibilityMap = signal(new Map<number, () => boolean>());
  private nextItemId = 0;

  readonly hasVisibleItems = computed(() => {
    for (const isVisible of this.itemVisibilityMap().values()) {
      if (isVisible()) {
        return true;
      }
    }

    return false;
  });

  protected readonly headingClass = computed(() =>
    cn(
      argusxMenuLabelVariants({ inset: false }),
      'text-muted-foreground px-2.5 py-0.5 text-xs font-medium',
      this.class()
    )
  );

  protected readonly computedClass = computed(() =>
    cn('block text-foreground overflow-hidden px-1 pb-1 pt-1', this.class())
  );

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
}

@Component({
  selector: 'argusx-command-separator',
  imports: [CommonModule],
  template: '',
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command-separator"',
    role: 'separator',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCommandSeparatorComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(argusxMenuSeparatorVariants(), 'bg-border/50 -mx-1 mt-0 mb-0', this.class())
  );
}

// ============================================================================
// Item / Shortcut
// ============================================================================

@Component({
  selector: 'argusx-command-item',
  imports: [CommonModule, LucideAngularModule],
  template: `
    <ng-content />
    <lucide-icon
      [img]="checkIcon"
      class="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100 size-3.5" />
  `,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command-item"',
    '[attr.data-value]': 'stringValue()',
    '[attr.data-disabled]': 'disabled() ? "true" : null',
    '[attr.data-checked]': 'isHighlighted() ? "true" : "false"',
    '[attr.data-selected]': 'isHighlighted() ? "" : null',
    '[attr.aria-selected]': 'isHighlighted()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.hidden]': 'isVisible() ? null : ""',
    '[attr.role]': '"option"',
    '[attr.tabindex]': 'disabled() ? null : (isHighlighted() ? "0" : "-1")',
    '(click)': 'onClick()',
    '(keydown.enter)': 'onKeydownSelect($event)',
    '(keydown.space)': 'onKeydownSelect($event)',
    '(pointermove)': 'onPointerMove($event)',
    '(focus)': 'onFocus()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCommandItemComponent<T = unknown> implements OnInit, OnDestroy {
  private readonly command = inject<ArgusxCommandRootToken<T>>(ArgusxCommandRootToken);
  private readonly group = inject<ArgusxCommandGroupToken | null>(ArgusxCommandGroupToken, {
    optional: true,
  });
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly value = input<T | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly keywords = input<readonly string[]>([]);
  readonly class = input<string>('');

  readonly select = output<T>();

  protected readonly checkIcon = CheckIcon;

  private rootItemId: number | null = null;
  private groupItemId: number | null = null;

  protected readonly stringValue = computed(() => String(this.value() ?? ''));

  protected readonly normalizedLabel = computed(() =>
    (this.elementRef.nativeElement.textContent ?? '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
  );

  protected readonly isHighlighted = computed(() =>
    this.value() !== undefined && this.command.isHighlighted(this.value() as T)
  );

  protected readonly isVisible = computed(() => {
    const search = this.command.value().trim().toLowerCase();
    if (!search) {
      return true;
    }

    const item: ArgusxCommandItemData<T> = {
      value: this.value() as T,
      label: this.normalizedLabel(),
      disabled: this.disabled(),
      keywords: this.keywords(),
    };

    const filter = this.command.filter();
    if (filter) {
      return filter(item, search);
    }

    const keywords = this.keywords().join(' ').toLowerCase();
    return (
      item.label.includes(search) ||
      this.stringValue().toLowerCase().includes(search) ||
      keywords.includes(search)
    );
  });

  protected readonly computedClass = computed(() =>
    cn(
      argusxMenuItemVariants({ inset: false, variant: 'default' }),
      'data-selected:bg-muted data-selected:text-foreground data-selected:*:[svg]:text-foreground',
      'active:bg-accent active:text-accent-foreground active:*:[svg]:text-accent-foreground',
      'relative min-h-7 gap-2 rounded-md px-2.5 py-1.5 text-xs/relaxed',
      'in-data-[slot=dialog-content]:rounded-md',
      "[&_svg:not([class*='size-'])]:size-3.5",
      'group/command-item',
      '[&_svg]:pointer-events-none [&_svg]:shrink-0',
      this.class()
    )
  );

  ngOnInit(): void {
    this.rootItemId = this.command.registerItem({
      value: () => this.value(),
      label: () => this.normalizedLabel(),
      keywords: () => this.keywords(),
      disabled: () => this.disabled(),
      isVisible: () => this.isVisible(),
      element: () => this.elementRef.nativeElement,
      emitSelect: () => this.emitSelect(),
    });

    if (this.group) {
      this.groupItemId = this.group.registerItem(() => this.isVisible());
    }
  }

  ngOnDestroy(): void {
    if (this.rootItemId !== null) {
      this.command.unregisterItem(this.rootItemId);
      this.rootItemId = null;
    }

    if (this.group && this.groupItemId !== null) {
      this.group.unregisterItem(this.groupItemId);
      this.groupItemId = null;
    }
  }

  protected onPointerMove(event: PointerEvent): void {
    if (
      event.defaultPrevented ||
      event.pointerType !== 'mouse' ||
      this.disabled() ||
      this.value() === undefined
    ) {
      return;
    }

    this.command.setHighlightedValue(this.value() as T);
  }

  protected onFocus(): void {
    if (this.disabled() || this.value() === undefined) {
      return;
    }

    this.command.setHighlightedValue(this.value() as T);
  }

  protected onKeydownSelect(event: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.onClick();
  }

  protected onClick(): void {
    if (this.disabled() || !this.isVisible() || this.value() === undefined) {
      return;
    }

    this.command.setHighlightedValue(this.value() as T);
    this.emitSelect();
  }

  private emitSelect(): void {
    const value = this.value();
    if (value === undefined) {
      return;
    }

    this.select.emit(value as T);
  }
}

@Component({
  selector: 'argusx-command-shortcut',
  imports: [CommonModule],
  template: `<ng-content />`,
  host: {
    '[class]': 'computedClass()',
    '[attr.data-slot]': '"command-shortcut"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArgusxCommandShortcutComponent {
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      argusxMenuShortcutVariants(),
      'group-data-selected/command-item:text-foreground text-[0.625rem]',
      this.class()
    )
  );
}

// ============================================================================
// Exports
// ============================================================================

export const ArgusxCommandComponents = [
  ArgusxCommandComponent,
  ArgusxCommandDialogComponent,
  ArgusxCommandInputComponent,
  ArgusxCommandListComponent,
  ArgusxCommandEmptyComponent,
  ArgusxCommandGroupComponent,
  ArgusxCommandItemComponent,
  ArgusxCommandShortcutComponent,
  ArgusxCommandSeparatorComponent,
] as const;
